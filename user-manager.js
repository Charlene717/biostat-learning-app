// user-manager.js — multi-user accounts + per-user namespaced progress
(function () {
  const USERS_KEY = 'biostat-users-v1';
  const STATS_PREFIX = 'biostat-quiz-stats-v1';

  const AVATARS = ['μ', 'σ', 'β', 'λ', 'χ', 'ρ', 'θ', 'φ', 'Δ', 'Σ'];
  const COLORS = [
    'oklch(0.58 0.10 175)', 'oklch(0.50 0.12 265)', 'oklch(0.62 0.16 25)',
    'oklch(0.55 0.12 145)', 'oklch(0.55 0.13 300)', 'oklch(0.60 0.13 60)'
  ];

  function uid() {
    return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }
  function saveUsers(data) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(data)); } catch (e) {}
  }

  // Ensure at least one user exists; migrate legacy stats to first user
  function ensureInit() {
    let data = loadUsers();
    if (data && data.users && data.users.length) return data;

    const firstId = uid();
    data = {
      users: [{ id: firstId, name: '我的帳號', avatar: 'μ', color: COLORS[0], created: Date.now() }],
      activeId: firstId
    };
    // Migrate legacy single-user stats (unnamespaced) into the first user
    try {
      const legacy = localStorage.getItem(STATS_PREFIX);
      if (legacy && !localStorage.getItem(statsKey(firstId))) {
        localStorage.setItem(statsKey(firstId), legacy);
      }
    } catch (e) {}
    saveUsers(data);
    return data;
  }

  function statsKey(userId) {
    return STATS_PREFIX + '::' + userId;
  }

  function getUsers() { return ensureInit().users; }
  function getActiveId() { return ensureInit().activeId; }
  function getActiveUser() {
    const d = ensureInit();
    return d.users.find(u => u.id === d.activeId) || d.users[0];
  }
  function getActiveStatsKey() { return statsKey(getActiveId()); }

  function addUser(name) {
    const d = ensureInit();
    const n = (name || '').trim() || `帳號 ${d.users.length + 1}`;
    const idx = d.users.length;
    const u = {
      id: uid(),
      name: n,
      avatar: AVATARS[idx % AVATARS.length],
      color: COLORS[idx % COLORS.length],
      created: Date.now()
    };
    d.users.push(u);
    d.activeId = u.id; // switch to the new user
    saveUsers(d);
    return u;
  }

  function renameUser(id, name) {
    const d = ensureInit();
    const u = d.users.find(x => x.id === id);
    if (u) { u.name = (name || '').trim() || u.name; saveUsers(d); }
    return d;
  }

  function deleteUser(id) {
    const d = ensureInit();
    if (d.users.length <= 1) return d; // keep at least one
    d.users = d.users.filter(u => u.id !== id);
    try { localStorage.removeItem(statsKey(id)); } catch (e) {}
    if (d.activeId === id) d.activeId = d.users[0].id;
    saveUsers(d);
    return d;
  }

  function switchUser(id) {
    const d = ensureInit();
    if (d.users.some(u => u.id === id)) { d.activeId = id; saveUsers(d); }
    return d;
  }

  // Per-user stats summary (for the account list)
  function userSummary(id) {
    try {
      const raw = localStorage.getItem(statsKey(id));
      if (!raw) return { answered: 0, correct: 0, sessions: 0, accuracy: 0 };
      const data = JSON.parse(raw);
      const answered = Object.values(data.totals || {}).reduce((s, v) => s + v.answered, 0);
      const correct = Object.values(data.totals || {}).reduce((s, v) => s + v.correct, 0);
      return {
        answered, correct,
        sessions: (data.history || []).length,
        accuracy: answered > 0 ? correct / answered : 0
      };
    } catch (e) {
      return { answered: 0, correct: 0, sessions: 0, accuracy: 0 };
    }
  }

  // ── Export / Import ──
  function exportActive() {
    const u = getActiveUser();
    let stats = {};
    try { stats = JSON.parse(localStorage.getItem(getActiveStatsKey()) || '{}'); } catch (e) {}
    return {
      app: 'biostat-learning-app',
      version: 1,
      exportedAt: new Date().toISOString(),
      user: { name: u.name, avatar: u.avatar, color: u.color },
      stats
    };
  }

  function downloadActive() {
    const payload = exportActive();
    const u = getActiveUser();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safe = (u.name || 'user').replace(/[^\w\u4e00-\u9fa5-]/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `biostat-progress-${safe}-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Import a payload. mode: 'new' creates a new user; 'merge' merges into active.
  function importPayload(payload, mode = 'new') {
    if (!payload || !payload.stats) throw new Error('檔案格式不符');
    const incoming = payload.stats;

    if (mode === 'new') {
      const name = (payload.user && payload.user.name)
        ? payload.user.name + '（匯入）'
        : '匯入的帳號';
      const u = addUser(name);
      try { localStorage.setItem(statsKey(u.id), JSON.stringify(incoming)); } catch (e) {}
      if (payload.user) {
        const d = ensureInit();
        const me = d.users.find(x => x.id === u.id);
        if (me) {
          if (payload.user.avatar) me.avatar = payload.user.avatar;
          if (payload.user.color) me.color = payload.user.color;
          saveUsers(d);
        }
      }
      return u;
    }

    // merge into active
    const key = getActiveStatsKey();
    let cur = { history: [], wrong: {}, totals: {} };
    try { cur = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    cur.history = cur.history || []; cur.wrong = cur.wrong || {}; cur.totals = cur.totals || {};

    // merge totals
    Object.entries(incoming.totals || {}).forEach(([topic, v]) => {
      if (!cur.totals[topic]) cur.totals[topic] = { answered: 0, correct: 0 };
      cur.totals[topic].answered += v.answered || 0;
      cur.totals[topic].correct += v.correct || 0;
    });
    // merge wrong (keep higher count)
    Object.entries(incoming.wrong || {}).forEach(([sig, v]) => {
      if (!cur.wrong[sig] || (v.count || 0) > (cur.wrong[sig].count || 0)) {
        cur.wrong[sig] = v;
      }
    });
    // merge history
    cur.history = [...cur.history, ...(incoming.history || [])]
      .sort((a, b) => (a.ts || 0) - (b.ts || 0))
      .slice(-50);
    try { localStorage.setItem(key, JSON.stringify(cur)); } catch (e) {}
    return getActiveUser();
  }

  window.UserManager = {
    AVATARS, COLORS,
    getUsers, getActiveId, getActiveUser, getActiveStatsKey,
    addUser, renameUser, deleteUser, switchUser,
    userSummary, exportActive, downloadActive, importPayload,
    ensureInit
  };
})();

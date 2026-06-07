// account.jsx — multi-user account modal (shared desktop + mobile)
const { useState: _uS, useEffect: _uE, useRef: _uR } = React;

// Global open/close pub-sub so any component (avatar, sidebar) can trigger it
window.openAccountModal = function () {
  window.dispatchEvent(new CustomEvent('biostat-open-account'));
};

// Language toggle pill — switches the whole UI between 中文 / English
window.LangToggle = function LangToggle({ className, style }) {
  const [lang, setLang] = _uS(window.I18N ? window.I18N.getLang() : 'zh');
  _uE(() => {
    if (!window.I18N) return;
    const unsub = window.I18N.subscribe((l) => setLang(l));
    return unsub;
  }, []);
  const next = lang === 'en' ? '中' : 'EN';
  return (
    <button
      className={`lang-toggle ${className || ''}`}
      style={style}
      title={lang === 'en' ? '切換為中文' : 'Switch to English'}
      onClick={(e) => { e.stopPropagation(); window.I18N && window.I18N.toggle(); }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2.5 12h19M12 2.5c2.5 2.6 3.8 6 3.8 9.5S14.5 18.9 12 21.5C9.5 18.9 8.2 15.5 8.2 12S9.5 5.1 12 2.5z"
          stroke="currentColor" strokeWidth="1.5"/>
      </svg>
      <span>{next}</span>
    </button>
  );
};

window.AccountModal = function AccountModal({ onUserChange }) {
  const [open, setOpen] = _uS(false);
  const [tick, setTick] = _uS(0);   // force refresh after mutations
  const [newName, setNewName] = _uS('');
  const [importMode, setImportMode] = _uS('new');
  const [msg, setMsg] = _uS(null);
  const [editingId, setEditingId] = _uS(null);
  const [editName, setEditName] = _uS('');
  const fileRef = _uR(null);

  _uE(() => {
    const h = () => { setOpen(true); setMsg(null); };
    window.addEventListener('biostat-open-account', h);
    return () => window.removeEventListener('biostat-open-account', h);
  }, []);

  if (!open) return null;

  const UM = window.UserManager;
  const users = UM.getUsers();
  const activeId = UM.getActiveId();

  const refresh = (notifyUser) => {
    setTick(t => t + 1);
    if (notifyUser && onUserChange) onUserChange();
  };

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(null), 2600); };

  const doSwitch = (id) => {
    if (id === activeId) return;
    UM.switchUser(id);
    refresh(true);
  };
  const doAdd = () => {
    UM.addUser(newName);
    setNewName('');
    refresh(true);
    flash('已新增並切換至新帳號');
  };
  const doDelete = (id, name) => {
    if (users.length <= 1) { flash('至少需保留一個帳號'); return; }
    if (!confirm(`刪除帳號「${name}」？此帳號的所有學習進度將一併刪除，無法復原。`)) return;
    UM.deleteUser(id);
    refresh(true);
  };
  const startEdit = (u) => { setEditingId(u.id); setEditName(u.name); };
  const cancelEdit = () => { setEditingId(null); setEditName(''); };
  const saveEdit = (id) => {
    const nm = editName.trim();
    if (nm) { UM.renameUser(id, nm); refresh(true); flash('已更新帳號名稱'); }
    setEditingId(null); setEditName('');
  };
  const doExport = () => {
    UM.downloadActive();
    flash('已匯出當前帳號進度 JSON');
  };
  const doImportClick = () => fileRef.current && fileRef.current.click();
  const doImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        const u = UM.importPayload(payload, importMode);
        refresh(true);
        flash(importMode === 'new'
          ? `已匯入為新帳號「${u.name}」`
          : '已合併匯入紀錄至當前帳號');
      } catch (err) {
        flash('匯入失敗：' + (err.message || '檔案格式不符'));
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const fmtPct = (x) => `${Math.round(x * 100)}%`;

  return (
    <div className="acc-overlay" onClick={(e) => { if (e.target.classList.contains('acc-overlay')) setOpen(false); }}>
      <div className="acc-modal">
        <div className="acc-head">
          <div>
            <div className="acc-eyebrow">Accounts</div>
            <h2>使用者帳號</h2>
          </div>
          <button className="acc-close" onClick={() => setOpen(false)} aria-label="關閉">✕</button>
        </div>

        {msg && <div className="acc-msg">{msg}</div>}

        {/* User list */}
        <div className="acc-section-label">切換帳號 · {users.length} 個</div>
        <div className="acc-users">
          {users.map(u => {
            const s = UM.userSummary(u.id);
            const active = u.id === activeId;
            return (
              <div key={u.id} className={`acc-user ${active ? 'active' : ''} ${editingId === u.id ? 'editing' : ''}`}
                onClick={() => editingId === u.id ? null : doSwitch(u.id)}>
                <div className="acc-avatar" style={{ background: u.color }}>{u.avatar}</div>
                {editingId === u.id ? (
                  <div className="acc-user-info" onClick={(e) => e.stopPropagation()}>
                    <input className="acc-rename" autoFocus value={editName}
                      maxLength={24}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(u.id);
                        if (e.key === 'Escape') cancelEdit();
                      }} />
                    <div className="acc-rename-actions">
                      <button className="acc-mini-btn primary" onClick={(e) => { e.stopPropagation(); saveEdit(u.id); }}>儲存</button>
                      <button className="acc-mini-btn" onClick={(e) => { e.stopPropagation(); cancelEdit(); }}>取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="acc-user-info">
                    <div className="acc-user-name">
                      {u.name}
                      {active && <span className="acc-badge">使用中</span>}
                    </div>
                    <div className="acc-user-stat">
                      {s.answered > 0
                        ? `${s.sessions} 次練習 · ${s.answered} 題 · 正確率 ${fmtPct(s.accuracy)}`
                        : '尚無紀錄'}
                    </div>
                  </div>
                )}
                {editingId !== u.id && (
                  <div className="acc-user-actions">
                    <button className="acc-edit" title="重新命名"
                      onClick={(e) => { e.stopPropagation(); startEdit(u); }}>
                      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                        <path d="M10.5 2.5l2 2L6 11l-2.5.5.5-2.5 6.5-6.5z" stroke="currentColor"
                          strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button className="acc-del" title="刪除帳號"
                      onClick={(e) => { e.stopPropagation(); doDelete(u.id, u.name); }}>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M3 4h9M6 4V3h3v1M5 4l.5 8h4L10 4" stroke="currentColor"
                          strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add user */}
        <div className="acc-section-label">新增帳號</div>
        <div className="acc-add">
          <input
            placeholder="輸入帳號名稱…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doAdd()}
          />
          <button className="acc-btn primary" onClick={doAdd}>+ 新增</button>
        </div>

        {/* Export / Import */}
        <div className="acc-section-label">備份與還原</div>
        <div className="acc-io">
          <button className="acc-btn" onClick={doExport}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1v8m0 0L4.5 6m3 3l3-3M2 11v2h11v-2" stroke="currentColor"
                strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            匯出當前進度
          </button>
          <button className="acc-btn" onClick={doImportClick}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 9V1m0 0L4.5 4m3-3l3 3M2 11v2h11v-2" stroke="currentColor"
                strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            匯入舊紀錄
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json"
            style={{ display: 'none' }} onChange={doImportFile} />
        </div>
        <div className="acc-import-mode">
          <span>匯入方式：</span>
          <label className={importMode === 'new' ? 'on' : ''}>
            <input type="radio" name="impmode" checked={importMode === 'new'}
              onChange={() => setImportMode('new')} />
            建立新帳號
          </label>
          <label className={importMode === 'merge' ? 'on' : ''}>
            <input type="radio" name="impmode" checked={importMode === 'merge'}
              onChange={() => setImportMode('merge')} />
            合併到當前
          </label>
        </div>

        <div className="acc-foot">
          進度儲存於此瀏覽器。換裝置前請先「匯出」，並在新裝置「匯入」以延續紀錄。
        </div>
      </div>
    </div>
  );
};

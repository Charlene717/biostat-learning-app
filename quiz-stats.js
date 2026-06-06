// quiz-stats.js — persistent quiz progress + wrong-answer log
(function () {
  const KEY = 'biostat-quiz-stats-v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { history: [], wrong: {}, totals: {} };
    } catch (e) {
      return { history: [], wrong: {}, totals: {} };
    }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  // Record one completed session: arr of { q, value, correct }
  function recordSession(items) {
    const data = load();
    const ts = Date.now();
    let correctCount = 0;
    items.forEach(it => {
      const q = it.q;
      const topic = q.topic;
      if (!data.totals[topic]) data.totals[topic] = { answered: 0, correct: 0 };
      data.totals[topic].answered += 1;
      if (it.correct) {
        data.totals[topic].correct += 1;
        correctCount += 1;
        // remove from wrong list if previously wrong
        const sig = qSignature(q);
        if (data.wrong[sig]) delete data.wrong[sig];
      } else {
        // add to wrong list (or bump count)
        const sig = qSignature(q);
        if (!data.wrong[sig]) {
          data.wrong[sig] = { q, topic, count: 0, lastWrong: ts };
        }
        data.wrong[sig].count += 1;
        data.wrong[sig].lastWrong = ts;
        data.wrong[sig].lastAnswer = it.value;
      }
    });
    data.history.push({
      ts, total: items.length, correct: correctCount,
      topics: [...new Set(items.map(i => i.q.topic))]
    });
    // Keep history to last 50 sessions
    if (data.history.length > 50) data.history = data.history.slice(-50);
    save(data);
    return data;
  }

  function qSignature(q) {
    // Use stem prefix as a stable id (questions don't have explicit ids)
    return q.topic + '::' + q.stem.slice(0, 60);
  }

  function resetWrong() {
    const data = load();
    data.wrong = {};
    save(data);
    return data;
  }
  function resetAll() {
    save({ history: [], wrong: {}, totals: {} });
    return load();
  }

  function getWrongQuestions() {
    const data = load();
    return Object.values(data.wrong).sort((a, b) => b.count - a.count);
  }

  // Topics ranked by accuracy ascending (worst first), but only those with attempts
  function getReviewSuggestions() {
    const data = load();
    const rows = Object.entries(data.totals)
      .filter(([, v]) => v.answered >= 3)
      .map(([topic, v]) => ({
        topic,
        answered: v.answered,
        correct: v.correct,
        rate: v.correct / v.answered
      }))
      .sort((a, b) => a.rate - b.rate);
    return rows;
  }

  function getSummary() {
    const data = load();
    const answered = Object.values(data.totals).reduce((s, v) => s + v.answered, 0);
    const correct = Object.values(data.totals).reduce((s, v) => s + v.correct, 0);
    const sessions = data.history.length;
    const wrongCount = Object.keys(data.wrong).length;
    return { answered, correct, sessions, wrongCount,
             accuracy: answered > 0 ? correct / answered : 0 };
  }

  function getRecentHistory(limit = 7) {
    const data = load();
    return data.history.slice(-limit);
  }

  window.QuizStats = {
    recordSession, getSummary, getRecentHistory,
    getWrongQuestions, getReviewSuggestions,
    resetWrong, resetAll, qSignature
  };
})();

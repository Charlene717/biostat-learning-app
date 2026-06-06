// quiz-engine.jsx — handles mc/multi/num/tf questions with session config
const { useState: _useState, useMemo: _useMemo } = React;

// Question type renderers
function QuestionMC({ q, answer, revealed, onSelect }) {
  return (
    <div className="m-choices">
      {q.choices.map((c, i) => {
        let cls = 'm-choice';
        if (revealed) {
          if (i === q.correct) cls += ' correct';
          else if (i === answer) cls += ' wrong';
        } else if (answer === i) cls += ' selected';
        return (
          <button key={i} className={cls} onClick={() => !revealed && onSelect(i)}>
            <span className="letter">{String.fromCharCode(65 + i)}</span>
            <span>{c}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionMulti({ q, answer, revealed, onSelect }) {
  const selected = Array.isArray(answer) ? answer : [];
  const toggle = (i) => {
    if (revealed) return;
    onSelect(selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i]);
  };
  return (
    <div className="m-choices">
      {q.choices.map((c, i) => {
        const isSel = selected.includes(i);
        const isCor = q.correct.includes(i);
        let cls = 'm-choice';
        if (revealed) {
          if (isCor && isSel) cls += ' correct';
          else if (isCor && !isSel) cls += ' correct';
          else if (!isCor && isSel) cls += ' wrong';
        } else if (isSel) cls += ' selected';
        return (
          <button key={i} className={cls} onClick={() => toggle(i)}>
            <span className="letter" style={{borderRadius: 4}}>
              {isSel || (revealed && isCor) ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (i + 1)}
            </span>
            <span>{c}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionTF({ q, answer, revealed, onSelect }) {
  return (
    <div className="m-choices">
      {[
        { v: true, label: '正確 True' },
        { v: false, label: '錯誤 False' }
      ].map(opt => {
        let cls = 'm-choice';
        if (revealed) {
          if (opt.v === q.correct) cls += ' correct';
          else if (opt.v === answer) cls += ' wrong';
        } else if (answer === opt.v) cls += ' selected';
        return (
          <button key={String(opt.v)} className={cls}
            onClick={() => !revealed && onSelect(opt.v)}>
            <span className="letter">{opt.v ? '✓' : '✗'}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionNum({ q, answer, revealed, onSelect }) {
  const isCorrect = revealed && answer !== null && answer !== ''
    && Math.abs(parseFloat(answer) - q.answer) <= q.tolerance;
  return (
    <div style={{padding: '0 20px'}}>
      <div style={{
        background: 'var(--panel)',
        border: revealed ? `1px solid ${isCorrect ? 'var(--good)' : 'var(--bad)'}` : '1px solid var(--line)',
        borderRadius: 14,
        padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        <div style={{
          fontFamily: 'var(--f-mono)', fontSize: 10.5,
          color: 'var(--ink-3)', letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>數值答案 · 容差 ±{q.tolerance}</div>
        <input
          type="number"
          value={answer ?? ''}
          disabled={revealed}
          onChange={(e) => onSelect(e.target.value)}
          step="any"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: '12px 14px',
            fontFamily: 'var(--f-mono)',
            fontSize: 22,
            fontWeight: 600,
            color: revealed ? (isCorrect ? 'var(--good)' : 'var(--bad)') : 'var(--ink)',
            width: '100%',
            outline: 'none'
          }}
        />
        {revealed && (
          <div style={{
            fontFamily: 'var(--f-mono)', fontSize: 12,
            color: isCorrect ? 'var(--good)' : 'var(--bad)'
          }}>
            {isCorrect ? '✓ 正確' : `✗ 標準答案：${q.answer}`}
          </div>
        )}
      </div>
    </div>
  );
}

// Generic question renderer
window.QuizQuestion = function QuizQuestion({ q, answer, revealed, onSelect }) {
  if (q.type === 'multi') return <QuestionMulti q={q} answer={answer} revealed={revealed} onSelect={onSelect} />;
  if (q.type === 'tf')    return <QuestionTF q={q} answer={answer} revealed={revealed} onSelect={onSelect} />;
  if (q.type === 'num')   return <QuestionNum q={q} answer={answer} revealed={revealed} onSelect={onSelect} />;
  return <QuestionMC q={q} answer={answer} revealed={revealed} onSelect={onSelect} />;
};

// Check if a given answer is correct
window.isQuizCorrect = function isQuizCorrect(q, answer) {
  if (answer === null || answer === undefined || answer === '') return false;
  if (q.type === 'multi') {
    const a = Array.isArray(answer) ? [...answer].sort() : [];
    const c = [...q.correct].sort();
    return a.length === c.length && a.every((v, i) => v === c[i]);
  }
  if (q.type === 'tf')  return answer === q.correct;
  if (q.type === 'num') return Math.abs(parseFloat(answer) - q.answer) <= q.tolerance;
  return answer === q.correct;
};

// Check if the answer is "submittable" (user picked something)
window.isQuizAnswered = function isQuizAnswered(q, answer) {
  if (answer === null || answer === undefined || answer === '') return false;
  if (q.type === 'multi') return Array.isArray(answer) && answer.length > 0;
  return true;
};

// Get a session of N questions based on filters
window.buildQuizSession = function buildQuizSession({ topic, difficulty, count = 10 }) {
  let pool = window.QuizBank || [];
  if (topic && topic !== 'all') pool = pool.filter(q => q.topic === topic);
  if (difficulty && difficulty !== 'all') pool = pool.filter(q => q.difficulty === difficulty);
  // shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Tag label for type
window.quizTypeLabel = function quizTypeLabel(type) {
  return type === 'multi' ? '複選'
       : type === 'tf'    ? '是非'
       : type === 'num'   ? '計算'
       : '單選';
};

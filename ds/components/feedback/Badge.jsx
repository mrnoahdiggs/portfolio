
const TONES = {
  primary: { background: 'var(--orange-100)', color: 'var(--orange-800)', border: '1px solid var(--orange-300)' },
  accent: { background: 'var(--teal-100)', color: 'var(--teal-800)', border: '1px solid var(--teal-300)' },
  highlight: { background: 'var(--gold-100)', color: 'var(--ink-900)', border: '1px solid var(--gold-400)' },
  neutral: { background: 'var(--ink-100)', color: 'var(--ink-700)', border: '1px solid var(--ink-300)' },
};

function Badge({ tone = 'primary', children }) {
  const t = TONES[tone] || TONES.primary;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      font: 'var(--text-label)', letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '6px 12px', borderRadius: 'var(--radius-full)',
      ...t,
    }}>
      {children}
    </span>
  );
}
module.exports = { Badge };

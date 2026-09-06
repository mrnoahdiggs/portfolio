
function Card({ children, style }) {
  return (
    <div
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-3px, -3px)'; e.currentTarget.style.boxShadow = '7px 7px 0 var(--ink-900)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-pop)'; }}
      style={{
      background: 'var(--color-surface)',
      border: '2px solid var(--ink-900)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-pop)',
      padding: 'var(--space-6)',
      boxSizing: 'border-box',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      ...style,
    }}>
      {children}
    </div>
  );
}
module.exports = { Card };

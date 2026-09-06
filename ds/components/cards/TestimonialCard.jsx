
function TestimonialCard({ quote, name, role }) {
  return (
    <div style={{
      background: 'var(--cream-50)',
      border: '2px solid var(--ink-900)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-pop-accent)',
      padding: 'var(--space-6)',
      maxWidth: '360px',
      boxSizing: 'border-box',
    }}>
      <p style={{ font: 'italic 400 19px/1.5 var(--font-serif)', color: 'var(--color-text)', margin: '0 0 16px' }}>&ldquo;{quote}&rdquo;</p>
      <p style={{ font: '700 14px/1.3 var(--font-sans)', color: 'var(--color-primary)', margin: 0 }}>{name}</p>
      <p style={{ font: 'var(--text-small)', color: 'var(--color-text-muted)', margin: 0 }}>{role}</p>
    </div>
  );
}
module.exports = { TestimonialCard };

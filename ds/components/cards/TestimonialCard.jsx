
// `icon` is the avatar chosen on testimonial.html: { type: 'initials' | 'emoji' | 'icon', value, color }.
// Rendering the curated icons relies on window.testimonialIcons (testimonial-icons.js); without it,
// or without an icon, the card shows no avatar.
function Avatar({ icon }) {
  const t = window.testimonialIcons;
  if (!icon || !t) return null;
  const color = t.colorOf(icon.color);
  return (
    <div
      aria-hidden="true"
      style={{
        width: '48px', height: '48px', flex: 'none', borderRadius: '50%',
        border: '2px solid var(--ink-900)', background: color.bg, color: color.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {icon.type === 'icon'
        ? <span style={{ display: 'flex' }} dangerouslySetInnerHTML={{ __html: t.iconSvg(icon.value, 24) }} />
        : icon.type === 'emoji'
          ? <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon.value || '🎵'}</span>
          : <span style={{ font: '700 17px/1 var(--font-sans)' }}>{icon.value || '♪'}</span>}
    </div>
  );
}

function TestimonialCard({ quote, name, role, icon }) {
  return (
    <div style={{
      background: 'var(--cream-50)',
      border: '2px solid var(--ink-900)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-pop-accent)',
      padding: 'var(--space-6)',
      maxWidth: '360px',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <p style={{ font: 'italic 400 19px/1.5 var(--font-serif)', color: 'var(--color-text)', margin: '0 0 16px', flex: 1, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>&ldquo;{quote}&rdquo;</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Avatar icon={icon} />
        <div style={{ minWidth: 0 }}>
          <p style={{ font: '700 14px/1.3 var(--font-sans)', color: 'var(--color-primary)', margin: 0 }}>{name}</p>
          <p style={{ font: 'var(--text-small)', color: 'var(--color-text-muted)', margin: 0 }}>{role}</p>
        </div>
      </div>
    </div>
  );
}
module.exports = { TestimonialCard };


function MediaCard({ title, meta, kind = 'video', thumbnail, cardStyle, aspectRatio = '4 / 3' }) {
  return (
    <div style={{ width: '280px', fontFamily: 'var(--font-sans)', ...cardStyle }}>
      <div
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-3px, -3px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink-900)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-pop-sm)'; }}
        style={{
        aspectRatio,
        background: thumbnail ? `url(${thumbnail}) center/cover` : 'var(--ink-200)',
        border: '2px solid var(--ink-900)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-pop-sm)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          font: 'var(--text-label)', background: 'var(--color-primary)', color: '#fff',
          padding: '4px 10px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase',
        }}>{kind}</span>
      </div>
      <p style={{ font: '600 17px/1.3 var(--font-serif)', color: 'var(--color-text)', margin: '12px 0 2px' }}>{title}</p>
      <p style={{ font: 'var(--text-small)', color: 'var(--color-text-muted)', margin: 0 }}>{meta}</p>
    </div>
  );
}
module.exports = { MediaCard };

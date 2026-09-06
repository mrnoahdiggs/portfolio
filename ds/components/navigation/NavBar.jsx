
function NavBar({ links = [], active, brand = 'Noah Diggs', logoSrc, onSelect }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 40px', background: 'var(--color-bg)', borderBottom: '2px solid var(--ink-900)',
      fontFamily: 'var(--font-sans)',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {logoSrc && <img src={logoSrc} style={{ height: '56px', width: 'auto' }} alt="" />}
        <span style={{ font: '600 22px/1 var(--font-serif)', color: 'var(--color-text)' }}>{brand}</span>
      </span>
      <div style={{ display: 'flex', gap: '28px' }}>
        {links.map((l) => (
          <a key={l} href="#" onClick={(e) => { e.preventDefault(); onSelect && onSelect(l); }} style={{
            font: '600 14px/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.04em',
            color: l === active ? 'var(--color-primary)' : 'var(--color-text)',
            textDecoration: 'none', paddingBottom: '4px',
            borderBottom: l === active ? '2px solid var(--color-primary)' : '2px solid transparent',
          }}>{l}</a>
        ))}
      </div>
    </nav>
  );
}
module.exports = { NavBar };

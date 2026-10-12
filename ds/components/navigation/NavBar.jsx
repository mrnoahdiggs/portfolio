
function NavBar({ links = [], active, brand = 'Noah Diggs', logoSrc, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const toggleRef = React.useRef(null);
  const closeRef = React.useRef(null);

  const [hidden, setHidden] = React.useState(false);
  const navRef = React.useRef(null);

  // Slide the sticky bar away while scrolling down and bring it back on any
  // scroll up. Small jitters are ignored, and it always shows near the top.
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const navH = navRef.current ? navRef.current.offsetHeight : 0;
      if (y <= navH) setHidden(false);
      else if (y - lastY > 6) setHidden(true);
      else if (lastY - y > 6) setHidden(false);
      else return;
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const select = (label) => {
    setOpen(false);
    onSelect && onSelect(label);
  };

  // While the menu is open: lock page scroll, close on Escape, and move
  // focus into the panel (and back to the hamburger button on close).
  React.useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    closeRef.current && closeRef.current.focus();
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      toggle && toggle.focus();
    };
  }, [open]);

  const linkStyle = (l) => ({
    font: '600 14px/1 var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.04em',
    color: l === active ? 'var(--color-primary)' : 'var(--color-text)',
    textDecoration: 'none', paddingBottom: '4px',
    borderBottom: l === active ? '2px solid var(--color-primary)' : '2px solid transparent',
  });

  const drawerLinkStyle = (l) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    font: '600 26px/1.2 var(--font-serif)',
    color: l === active ? 'var(--color-primary)' : 'var(--color-text)',
    textDecoration: 'none', padding: '18px 0',
    borderBottom: '2px solid var(--ink-200)',
  });

  const bar = { display: 'block', width: '22px', height: '2px', background: 'var(--ink-900)', borderRadius: '2px' };

  return (
    <nav ref={navRef} className="site-nav" onFocus={() => setHidden(false)} style={{
      position: 'sticky', top: 0, zIndex: 100,
      // 'none' (not translateY(0)) when shown: any transform would become the
      // containing block for the fixed-position drawer below.
      transform: hidden && !open ? 'translateY(calc(-100% - 4px))' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', rowGap: '10px', columnGap: '16px',
      padding: 'clamp(12px, 4vw, 20px) clamp(16px, 5vw, 40px)', background: 'var(--color-bg)', borderBottom: '2px solid var(--ink-900)',
      fontFamily: 'var(--font-sans)',
    }}>
      <a href="./index.html" aria-label={brand + ', home'} onClick={(e) => { e.preventDefault(); select('Home'); }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        {logoSrc && <img src={logoSrc} style={{ height: '56px', width: 'auto' }} alt="" />}
        <span style={{ font: '600 22px/1 var(--font-serif)', color: 'var(--color-text)' }}>{brand}</span>
      </a>

      <div className="nav-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(14px, 4vw, 28px)' }}>
        {links.map((l) => (
          <a key={l} href="#" aria-current={l === active ? 'page' : undefined} onClick={(e) => { e.preventDefault(); select(l); }} style={linkStyle(l)}>{l}</a>
        ))}
      </div>

      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="nav-drawer"
        onClick={() => setOpen(true)}
        style={{
          display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px',
          width: '48px', height: '48px', padding: 0, cursor: 'pointer',
          background: 'var(--color-surface)', border: '2px solid var(--ink-900)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-pop-sm)',
        }}
      >
        <span style={bar}></span><span style={bar}></span><span style={bar}></span>
      </button>

      <div className={'nav-drawer' + (open ? ' is-open' : '')} aria-hidden={!open}>
        <div className="nav-drawer-backdrop" onClick={() => setOpen(false)}></div>
        <div id="nav-drawer" className="nav-drawer-panel" role="dialog" aria-modal="true" aria-label="Site menu">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ font: 'var(--text-label)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Menu</span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{
                width: '44px', height: '44px', padding: 0, cursor: 'pointer',
                font: '400 28px/1 var(--font-sans)', color: 'var(--ink-900)',
                background: 'var(--color-surface)', border: '2px solid var(--ink-900)',
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-pop-sm)',
              }}
            >×</button>
          </div>
          {links.map((l) => (
            <a key={l} href="#" tabIndex={open ? 0 : -1} aria-current={l === active ? 'page' : undefined}
              onClick={(e) => { e.preventDefault(); select(l); }} style={drawerLinkStyle(l)}>
              <span>{l}</span>
              <span aria-hidden="true" style={{ font: '400 20px/1 var(--font-sans)', color: l === active ? 'var(--color-primary)' : 'var(--ink-400)' }}>{l === 'LinkedIn' ? '↗' : '→'}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
module.exports = { NavBar };

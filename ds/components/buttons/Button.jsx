
const SIZES = {
  sm: { padding: '8px 18px', font: '600 14px/1.2 var(--font-sans)' },
  md: { padding: '12px 26px', font: '600 16px/1.2 var(--font-sans)' },
  lg: { padding: '16px 34px', font: '600 18px/1.2 var(--font-sans)' },
};

const VARIANTS = {
  primary: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: '2px solid var(--ink-900)', boxShadow: 'var(--shadow-pop)' },
  secondary: { background: 'var(--color-accent)', color: 'var(--color-on-accent)', border: '2px solid var(--ink-900)', boxShadow: 'var(--shadow-pop)' },
  outline: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '2px solid var(--ink-900)', boxShadow: 'var(--shadow-pop)' },
  ghost: { background: 'transparent', color: 'var(--color-text)', border: '2px solid transparent', boxShadow: 'none' },
};

function Button({ variant = 'primary', size = 'md', disabled = false, children, style, ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-sans)',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        opacity: disabled ? 0.5 : 1,
        ...s,
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled && v.boxShadow !== 'none') { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink-900)'; } }}
      onMouseDown={(e) => { if (!disabled) { e.currentTarget.style.transform = 'translate(3px, 3px)'; e.currentTarget.style.boxShadow = 'none'; } }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink-900)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = v.boxShadow; }}
      {...rest}
    >
      {children}
    </button>
  );
}
module.exports = { Button };


/**
 * TrustLayer Divider Component
 * 
 * Fine technical dividers with subtle borders and optional forensic metadata markers.
 */
export const Divider = ({
  variant = 'hairline',
  label = null,
  orientation = 'horizontal',
  className = '',
  style = {},
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        style={{
          width: '1px',
          alignSelf: 'stretch',
          backgroundColor: 'var(--tl-border)',
          margin: '0 8px',
          ...style,
        }}
        className={`tl-divider-v ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '24px 0',
          width: '100%',
          ...style,
        }}
        className={`tl-divider-with-label ${className}`}
      >
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'var(--tl-border)',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.625rem',
            color: 'var(--tl-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            userSelect: 'none',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'var(--tl-border)',
          }}
        />
      </div>
    );
  }

  const variantStyles = {
    hairline: {
      backgroundColor: 'var(--tl-border)',
      height: '1px',
    },
    dashed: {
      borderTop: '1px dashed var(--tl-border)',
      height: 0,
      backgroundColor: 'transparent',
    },
    gradient: {
      height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--tl-border) 20%, var(--tl-border) 80%, transparent)',
    },
  };

  return (
    <div
      style={{
        width: '100%',
        margin: '16px 0',
        ...(variantStyles[variant] || variantStyles.hairline),
        ...style,
      }}
      className={`tl-divider ${className}`}
    />
  );
};

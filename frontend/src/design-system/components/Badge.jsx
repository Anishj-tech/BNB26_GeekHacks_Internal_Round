import { StatusDot } from './StatusDot';

/**
 * TrustLayer Badge Component
 * Warm editorial badge styles with pill radii and refined contrast.
 */
export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  dot = false,
  pulse = false,
  mono = false,
  className = '',
  style = {},
  ...props
}) => {
  const variantStyles = {
    brand: {
      backgroundColor: 'rgba(204, 120, 92, 0.12)',
      borderColor: 'rgba(204, 120, 92, 0.32)',
      color: 'var(--tl-primary-active)',
    },
    primary: {
      backgroundColor: 'var(--tl-primary)',
      borderColor: 'var(--tl-primary)',
      color: '#ffffff',
    },
    match: {
      backgroundColor: 'rgba(93, 184, 166, 0.14)',
      borderColor: 'rgba(93, 184, 166, 0.36)',
      color: '#2a7566',
    },
    conflict: {
      backgroundColor: 'rgba(198, 69, 69, 0.12)',
      borderColor: 'rgba(198, 69, 69, 0.32)',
      color: '#a33333',
    },
    uncertainty: {
      backgroundColor: 'rgba(232, 165, 90, 0.14)',
      borderColor: 'rgba(232, 165, 90, 0.36)',
      color: '#9e6216',
    },
    neutral: {
      backgroundColor: 'var(--tl-surface-card)',
      borderColor: 'var(--tl-hairline)',
      color: 'var(--tl-body)',
    },
    dark: {
      backgroundColor: 'var(--tl-surface-dark-elevated)',
      borderColor: 'rgba(250, 249, 245, 0.12)',
      color: 'var(--tl-on-dark)',
    },
  };

  const sizeStyles = {
    xs: {
      fontSize: '0.625rem',
      padding: '2px 6px',
      gap: '4px',
      borderRadius: 'var(--tl-radius-pill)',
    },
    sm: {
      fontSize: '0.6875rem',
      padding: '3px 8px',
      gap: '5px',
      borderRadius: 'var(--tl-radius-pill)',
    },
    md: {
      fontSize: '0.75rem',
      padding: '4px 10px',
      gap: '6px',
      borderRadius: 'var(--tl-radius-pill)',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.neutral;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        fontFamily: mono ? 'var(--tl-font-mono)' : 'var(--tl-font-sans)',
        fontWeight: 500,
        letterSpacing: mono ? '0.04em' : '0.01em',
        lineHeight: 1.2,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...currentVariant,
        ...currentSize,
        ...style,
      }}
      className={`tl-badge ${className}`}
      {...props}
    >
      {dot && <StatusDot variant={variant} size={size === 'xs' ? 'xs' : 'sm'} pulse={pulse} />}
      {children}
    </span>
  );
};

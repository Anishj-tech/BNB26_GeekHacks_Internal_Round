import { StatusDot } from './StatusDot';

/**
 * TrustLayer Badge Component
 * 
 * Strict semantic styles:
 * - brand: System status / Primary (#5B8DEF)
 * - match: Verified / Consistent (#4FB3A5)
 * - conflict: Flagged / Mismatch (#E06C75)
 * - uncertainty: Low confidence (#D6A85F)
 * - neutral: Secondary metadata (#9AA6B2)
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
      backgroundColor: 'var(--tl-brand-subtle)',
      borderColor: 'var(--tl-brand-border)',
      color: 'var(--tl-brand)',
    },
    match: {
      backgroundColor: 'var(--tl-match-subtle)',
      borderColor: 'var(--tl-match-border)',
      color: 'var(--tl-match)',
    },
    conflict: {
      backgroundColor: 'var(--tl-conflict-subtle)',
      borderColor: 'var(--tl-conflict-border)',
      color: 'var(--tl-conflict)',
    },
    uncertainty: {
      backgroundColor: 'var(--tl-uncertainty-subtle)',
      borderColor: 'var(--tl-uncertainty-border)',
      color: 'var(--tl-uncertainty)',
    },
    neutral: {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderColor: 'var(--tl-border)',
      color: 'var(--tl-text-secondary)',
    },
  };

  const sizeStyles = {
    sm: {
      fontSize: '0.6875rem',
      padding: '2px 6px',
      gap: '4px',
    },
    md: {
      fontSize: '0.75rem',
      padding: '3px 8px',
      gap: '6px',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.neutral;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--tl-radius-sm)',
        border: '1px solid',
        fontFamily: mono ? 'var(--tl-font-mono)' : 'var(--tl-font-sans)',
        fontWeight: 500,
        letterSpacing: mono ? '0.04em' : '-0.01em',
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
      {dot && <StatusDot variant={variant} size={size === 'sm' ? 'sm' : 'sm'} pulse={pulse} />}
      {children}
    </span>
  );
};

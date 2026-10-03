/**
 * TrustLayer IconContainer Component
 * 
 * Provides a structured forensic container for icons with subtle border & depth.
 */
export const IconContainer = ({
  icon: Icon,
  children,
  variant = 'brand',
  size = 'md',
  className = '',
  style = {},
}) => {
  const sizeMap = {
    sm: { box: 28, iconSize: 14 },
    md: { box: 36, iconSize: 18 },
    lg: { box: 44, iconSize: 22 },
  };

  const variantMap = {
    brand: {
      color: 'var(--tl-brand)',
      bg: 'var(--tl-brand-subtle)',
      border: 'var(--tl-brand-border)',
    },
    match: {
      color: 'var(--tl-match)',
      bg: 'var(--tl-match-subtle)',
      border: 'var(--tl-match-border)',
    },
    conflict: {
      color: 'var(--tl-conflict)',
      bg: 'var(--tl-conflict-subtle)',
      border: 'var(--tl-conflict-border)',
    },
    uncertainty: {
      color: 'var(--tl-uncertainty)',
      bg: 'var(--tl-uncertainty-subtle)',
      border: 'var(--tl-uncertainty-border)',
    },
    neutral: {
      color: 'var(--tl-text-secondary)',
      bg: 'rgba(255, 255, 255, 0.03)',
      border: 'var(--tl-border)',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const currentVariant = variantMap[variant] || variantMap.brand;

  return (
    <div
      style={{
        width: `${currentSize.box}px`,
        height: `${currentSize.box}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--tl-radius-md)',
        backgroundColor: currentVariant.bg,
        border: `1px solid ${currentVariant.border}`,
        color: currentVariant.color,
        flexShrink: 0,
        ...style,
      }}
      className={`tl-icon-container ${className}`}
    >
      {Icon ? <Icon size={currentSize.iconSize} /> : children}
    </div>
  );
};

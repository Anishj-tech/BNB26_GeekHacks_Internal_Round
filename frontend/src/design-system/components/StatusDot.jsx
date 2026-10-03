/**
 * TrustLayer StatusDot Component
 * 
 * Semantic Variants:
 * - brand: System active / processing (#5B8DEF)
 * - match: Agreement / Verified consistent (#4FB3A5)
 * - conflict: Suspicious / Deepfake conflict (#E06C75)
 * - uncertainty: Low confidence / Insufficient evidence (#D6A85F)
 * - neutral: Idle / Muted (#9AA6B2)
 */
export const StatusDot = ({
  variant = 'brand',
  size = 'md',
  pulse = false,
  className = '',
  style = {},
}) => {
  const sizeMap = {
    sm: 6,
    md: 8,
    lg: 10,
  };

  const colorMap = {
    brand: 'var(--tl-brand)',
    match: 'var(--tl-match)',
    conflict: 'var(--tl-conflict)',
    uncertainty: 'var(--tl-uncertainty)',
    neutral: 'var(--tl-text-muted)',
  };

  const glowMap = {
    brand: 'var(--tl-brand-glow)',
    match: 'var(--tl-match-glow)',
    conflict: 'var(--tl-conflict-glow)',
    uncertainty: 'var(--tl-uncertainty-glow)',
    neutral: 'transparent',
  };

  const dimension = sizeMap[size] || 8;
  const dotColor = colorMap[variant] || colorMap.brand;
  const dotGlow = glowMap[variant] || glowMap.brand;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${dimension}px`,
        height: `${dimension}px`,
        ...style,
      }}
      className={`tl-status-dot-wrapper ${className}`}
    >
      {pulse && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: dotColor,
            animation: 'tl-ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.75,
          }}
        />
      )}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: `${dimension}px`,
          height: `${dimension}px`,
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotGlow}`,
        }}
      />
    </span>
  );
};

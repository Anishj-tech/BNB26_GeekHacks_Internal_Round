import { Badge } from './Badge';

/**
 * TrustLayer MetricBlock Component
 * 
 * Dashboard-first metric foundation:
 * Specifically tuned for Trust Assessment, Synthetic Signals, and Consistency Signals.
 * 
 * Variants:
 * - brand: System / Primary metric
 * - match: Consistent / High trust (#4FB3A5)
 * - conflict: Flagged synthetic anomaly / Mismatch (#E06C75)
 * - uncertainty: Low confidence / Insufficient evidence (#D6A85F)
 * - neutral: Informational metric
 */
export const MetricBlock = ({
  label,
  value,
  subtext,
  category,
  variant = 'brand',
  progress = null,
  badge = null,
  icon: Icon,
  className = '',
  style = {},
}) => {
  const colorMap = {
    brand: 'var(--tl-brand)',
    match: 'var(--tl-match)',
    conflict: 'var(--tl-conflict)',
    uncertainty: 'var(--tl-uncertainty)',
    neutral: 'var(--tl-text-primary)',
  };

  const bgSubtleMap = {
    brand: 'var(--tl-brand-subtle)',
    match: 'var(--tl-match-subtle)',
    conflict: 'var(--tl-conflict-subtle)',
    uncertainty: 'var(--tl-uncertainty-subtle)',
    neutral: 'rgba(255, 255, 255, 0.02)',
  };

  const borderMap = {
    brand: 'var(--tl-brand-border)',
    match: 'var(--tl-match-border)',
    conflict: 'var(--tl-conflict-border)',
    uncertainty: 'var(--tl-uncertainty-border)',
    neutral: 'var(--tl-border)',
  };

  const valueColor = colorMap[variant] || colorMap.neutral;

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--tl-surface)',
        border: '1px solid var(--tl-border)',
        borderRadius: 'var(--tl-radius-md)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--tl-shadow-sm)',
        transition: 'border-color var(--tl-transition-fast), transform var(--tl-transition-fast)',
        ...style,
      }}
      className={`tl-metric-block ${className}`}
    >
      {/* Subtle indicator bar on left border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '3px',
          backgroundColor: valueColor,
        }}
      />

      {/* Header with category label and badge/icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {category && (
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '1px 5px',
                borderRadius: 'var(--tl-radius-sm)',
                backgroundColor: bgSubtleMap[variant],
                color: valueColor,
                border: `1px solid ${borderMap[variant]}`,
              }}
            >
              {category}
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--tl-text-muted)',
            }}
          >
            {label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {badge && typeof badge === 'string' ? (
            <Badge variant={variant} size="sm">
              {badge}
            </Badge>
          ) : (
            badge
          )}
          {Icon && (
            <span style={{ color: 'var(--tl-text-muted)', display: 'inline-flex' }}>
              <Icon size={15} />
            </span>
          )}
        </div>
      </div>

      {/* Primary Value Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1,
            color: valueColor,
            letterSpacing: '-0.03em',
            fontFeatureSettings: "'tnum' on, 'zero' on",
          }}
        >
          {value}
        </span>
      </div>

      {/* Progress Bar (Optional) */}
      {progress !== null && (
        <div
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--tl-radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
              height: '100%',
              backgroundColor: valueColor,
              borderRadius: 'var(--tl-radius-full)',
              transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      )}

      {/* Forensic Subtext */}
      {subtext && (
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.75rem',
            lineHeight: 1.45,
            color: 'var(--tl-text-secondary)',
            margin: 0,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

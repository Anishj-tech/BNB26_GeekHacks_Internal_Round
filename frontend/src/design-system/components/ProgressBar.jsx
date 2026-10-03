/**
 * TrustLayer ProgressBar Component
 * 
 * Supports determinate progress, confidence gauges, and active forensic scan lines.
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'brand',
  size = 'md',
  showLabel = false,
  label = '',
  isScanning = false,
  className = '',
  style = {},
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const heightMap = {
    xs: 3,
    sm: 6,
    md: 8,
    lg: 12,
  };

  const colorMap = {
    brand: 'var(--tl-brand)',
    match: 'var(--tl-match)',
    conflict: 'var(--tl-conflict)',
    uncertainty: 'var(--tl-uncertainty)',
  };

  const barHeight = heightMap[size] || 6;
  const barColor = colorMap[variant] || colorMap.brand;

  return (
    <div style={{ width: '100%', ...style }} className={`tl-progress-wrapper ${className}`}>
      {(showLabel || label) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.75rem',
          }}
        >
          <span style={{ color: 'var(--tl-text-muted)' }}>{label}</span>
          <span
            style={{
              color: 'var(--tl-text-primary)',
              fontWeight: 500,
              fontFeatureSettings: "'tnum' on",
            }}
          >
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: `${barHeight}px`,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--tl-radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: isScanning ? '100%' : `${percentage}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: 'var(--tl-radius-full)',
            transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isScanning && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'tl-scanner-line 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * TrustLayer SectionHeader Component
 * Editorial serif display heading with technical eyebrow
 */
export const SectionHeader = ({
  category,
  title,
  description,
  action,
  className = '',
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
        ...style,
      }}
      className={`tl-section-header ${className}`}
    >
      <div style={{ maxWidth: '680px' }}>
        {category && (
          <div
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--tl-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ opacity: 0.6 }}>//</span>
            <span>{category}</span>
          </div>
        )}
        <h2
          style={{
            fontFamily: 'var(--tl-font-display)',
            fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
            fontWeight: 400,
            color: 'var(--tl-ink)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.9375rem',
              color: 'var(--tl-body)',
              marginTop: '6px',
              lineHeight: 1.55,
              margin: '6px 0 0',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {action && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {action}
        </div>
      )}
    </div>
  );
};

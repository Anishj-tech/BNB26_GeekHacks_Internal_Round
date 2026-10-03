/**
 * TrustLayer SectionHeader Component
 * 
 * Technical header for dashboard modules and investigation views.
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
        marginBottom: '20px',
        ...style,
      }}
      className={`tl-section-header ${className}`}
    >
      <div style={{ maxWidth: '640px' }}>
        {category && (
          <div
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--tl-brand)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px',
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
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--tl-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.875rem',
              color: 'var(--tl-text-secondary)',
              marginTop: '4px',
              lineHeight: 1.5,
              margin: '4px 0 0',
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

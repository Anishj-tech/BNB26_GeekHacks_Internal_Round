import { Badge } from '../../design-system/components/Badge';

export const Timeline = ({ timelineEvents = [] }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--tl-canvas)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-timeline-panel"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--tl-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            CHAIN OF CUSTODY & PIPELINE LOGS
          </span>
          <h3
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: 0,
            }}
          >
            Forensic Investigation Timeline
          </h3>
        </div>

        <Badge variant="neutral" size="sm" mono>
          {timelineEvents.length} VERIFIED MILESTONES
        </Badge>
      </div>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-body)',
          maxWidth: '780px',
          lineHeight: 1.55,
          marginBottom: '24px',
        }}
      >
        Every computation is recorded in sequential order with verifiable step descriptions, preserving an auditable chain of custody from file intake to evidence synthesis.
      </p>

      {/* Sequential Milestone Pipeline */}
      <div
        style={{
          position: 'relative',
          paddingLeft: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Continuous Hairline connector */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            bottom: '8px',
            left: '9px',
            width: '1px',
            backgroundColor: 'var(--tl-hairline)',
          }}
        />

        {timelineEvents.map((evt, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {/* Step dot */}
            <div
              style={{
                position: 'absolute',
                left: '-28px',
                top: '4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--tl-canvas)',
                border: '2px solid var(--tl-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--tl-primary)',
                }}
              />
            </div>

            {/* Step Content */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-muted)',
                }}
              >
                {evt.timestamp}
              </span>
              <span
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--tl-ink)',
                }}
              >
                {evt.step}
              </span>
              <Badge variant="match" size="xs">
                {evt.status}
              </Badge>
            </div>

            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              {evt.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

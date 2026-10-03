import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const ConflictPanel = ({ conflict }) => {
  if (!conflict) return null;

  const {
    detected = false,
    title = 'Cross-Modal Assessment Coherent',
    severity = 'NONE',
    description,
    details = [],
    impactOnTrust,
  } = conflict;

  return (
    <div
      style={{
        backgroundColor: detected ? 'rgba(198, 69, 69, 0.04)' : 'rgba(93, 184, 114, 0.04)',
        border: `1px solid ${detected ? 'rgba(198, 69, 69, 0.28)' : 'rgba(93, 184, 114, 0.28)'}`,
        borderRadius: 'var(--tl-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-conflict-panel"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--tl-radius-md)',
              backgroundColor: detected ? 'rgba(198, 69, 69, 0.12)' : 'rgba(93, 184, 114, 0.12)',
              color: detected ? 'var(--tl-error)' : 'var(--tl-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {detected ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: detected ? 'var(--tl-error)' : 'var(--tl-success)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {detected ? 'FIRST-CLASS FORENSIC SIGNAL // CONFLICT DETECTED' : 'CROSS-MODAL CONCORDANCE // NO CONFLICT'}
            </span>
            <h3
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: '1.375rem',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: '2px 0 0',
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        <Badge variant={detected ? 'conflict' : 'match'} size="sm" dot>
          {detected ? `${severity} SEVERITY CONFLICT` : 'CONCORDANT SIGNALS'}
        </Badge>
      </div>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-body)',
          maxWidth: '820px',
          lineHeight: 1.55,
          marginBottom: detected ? '20px' : '8px',
        }}
      >
        {description}
      </p>

      {/* Conflicting Pairs Breakout (When conflict is detected) */}
      {detected && details.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {details.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--tl-canvas)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--tl-ink)',
                  }}
                >
                  {item.pair}
                </span>
                <Badge variant="conflict" size="xs">
                  {item.status}
                </Badge>
              </div>
              <p
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.8125rem',
                  color: 'var(--tl-body)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Uncertainty & Trust Impact Callout */}
      {impactOnTrust && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--tl-radius-md)',
            backgroundColor: detected ? 'rgba(198, 69, 69, 0.08)' : 'rgba(93, 184, 114, 0.08)',
            border: `1px solid ${detected ? 'rgba(198, 69, 69, 0.2)' : 'rgba(93, 184, 114, 0.2)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <HelpCircle size={16} color={detected ? 'var(--tl-error)' : 'var(--tl-success)'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: detected ? 'var(--tl-error)' : 'var(--tl-success)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '2px',
              }}
            >
              WHY THIS IMPACTS TRUST CONFIDENCE
            </span>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-ink)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {impactOnTrust}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

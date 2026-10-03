import { ArrowRightLeft } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const ConsistencyPanel = ({ consistencyNetwork = [] }) => {
  if (!consistencyNetwork || !consistencyNetwork.length) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-canvas)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-consistency-panel"
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
            MULTI-MODAL AGREEMENT MATRIX
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
            Cross-Modal Consistency & Coherence
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="match" size="sm" dot>
            AGREEMENT RAISES CONFIDENCE
          </Badge>
          <Badge variant="conflict" size="sm" dot>
            CONFLICT LOWERS CONFIDENCE
          </Badge>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-body)',
          maxWidth: '780px',
          lineHeight: 1.55,
          marginBottom: '16px',
        }}
      >
        Authentic recordings exhibit physical congruence across modalities: mouth movement tracks audio phonemes, reverberation matches room geometry, and transcripts reflect audible speech. Divergences expose generative tampering.
      </p>

      {/* Forensic Insight Banner: Why axes differ */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--tl-surface-card)',
          borderLeft: '3px solid var(--tl-primary)',
          borderRadius: 'var(--tl-radius-xs)',
          marginBottom: '24px',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          color: 'var(--tl-ink)',
        }}
      >
        <strong>Why Synthetic and Consistency Axes Differ:</strong> A video can be completely pristine (0% synthetic traces) but completely out-of-context or spliced with an external voice clone (100% cross-modal conflict). Conversely, heavy compression can create false visual artifacts while cross-modal audio-visual synchronization remains perfectly intact.
      </div>

      {/* Relationships Table / Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {consistencyNetwork.map((rel, idx) => {
          const isConflict = rel.status === 'CONFLICT';
          const isUncertain = rel.status === 'UNCERTAIN';
          const statusVariant = isConflict ? 'conflict' : isUncertain ? 'uncertainty' : 'match';

          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Relationship pair */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                    {rel.source}
                  </span>
                  <ArrowRightLeft size={12} color="var(--tl-muted)" />
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                    {rel.target}
                  </span>
                </div>

                <Badge variant={statusVariant} size="xs" dot>
                  {rel.status}
                </Badge>
              </div>

              {/* Relationship Name & Score */}
              <div>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block' }}>
                  CORRELATION VORTELL // {rel.relationship}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--tl-font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: isConflict ? 'var(--tl-error)' : 'var(--tl-ink)',
                    }}
                  >
                    {rel.score.toFixed(2)}
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                    correlation coefficient
                  </span>
                </div>
              </div>

              {/* Forensic observation note */}
              <p
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.8125rem',
                  color: 'var(--tl-body)',
                  margin: 0,
                  lineHeight: 1.45,
                  paddingTop: '8px',
                  borderTop: '1px solid var(--tl-hairline-soft)',
                }}
              >
                {rel.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

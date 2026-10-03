import { Check, Minus, Video, Mic, FileText, Crosshair, UserCheck, AlertCircle } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const EvidenceCoverage = ({ coverage = [] }) => {
  const iconMap = {
    VIDEO: Video,
    AUDIO: Mic,
    TRANSCRIPT: FileText,
    CROSS_MODAL: Crosshair,
    FACE: UserCheck,
  };

  const analyzedCount = coverage.filter((item) => item.analyzed).length;
  const totalCount = coverage.length;

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-canvas)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-evidence-coverage-panel"
    >
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
            FORENSIC PROVENANCE & SENSOR AUDIT
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
            Evidence Coverage & Availability
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant={analyzedCount === totalCount ? 'match' : 'uncertainty'} size="sm" dot>
            {analyzedCount} / {totalCount} MODALITIES ANALYZED
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
          marginBottom: '24px',
        }}
      >
        TrustLayer explicitly audits which sensory streams were examined. Missing evidence is never assumed to be authentic; absent modalities directly constrain forensic certainty bounds.
      </p>

      {/* Modality Tiles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {coverage.map((mod, idx) => {
          const Icon = iconMap[mod.modality] || Video;
          return (
            <div
              key={idx}
              style={{
                padding: '18px 20px',
                borderRadius: 'var(--tl-radius-md)',
                backgroundColor: mod.analyzed ? 'var(--tl-surface-card)' : 'rgba(230, 223, 216, 0.3)',
                border: `1px solid ${mod.analyzed ? 'var(--tl-hairline)' : '#e0d8cd'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--tl-radius-sm)',
                      backgroundColor: mod.analyzed ? 'var(--tl-canvas)' : 'transparent',
                      border: '1px solid var(--tl-hairline)',
                      color: mod.analyzed ? 'var(--tl-primary)' : 'var(--tl-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--tl-font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: mod.analyzed ? 'var(--tl-ink)' : 'var(--tl-muted)',
                    }}
                  >
                    {mod.label}
                  </span>
                </div>

                {mod.analyzed ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--tl-font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--tl-success)',
                      fontWeight: 600,
                    }}
                  >
                    <Check size={14} strokeWidth={2.5} /> ANALYZED
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--tl-font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--tl-muted)',
                      fontWeight: 500,
                    }}
                  >
                    <Minus size={14} /> MISSING
                  </span>
                )}
              </div>

              {/* Progress Bar / Coverage Metric */}
              {mod.analyzed ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)' }}>
                      SIGNAL INTEGRITY
                    </span>
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                      {mod.coverage}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      backgroundColor: 'rgba(20, 20, 19, 0.08)',
                      borderRadius: 'var(--tl-radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${mod.coverage}%`,
                        backgroundColor: 'var(--tl-primary)',
                        borderRadius: 'var(--tl-radius-full)',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--tl-radius-xs)',
                    backgroundColor: 'rgba(232, 165, 90, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <AlertCircle size={12} color="var(--tl-accent-amber)" />
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                    Modality was not present in intake
                  </span>
                </div>
              )}

              {/* Supporting Evidence Tag if applicable */}
              {mod.isSupporting && (
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.625rem',
                    color: 'var(--tl-muted)',
                    backgroundColor: 'rgba(20, 20, 19, 0.04)',
                    padding: '2px 6px',
                    borderRadius: 'var(--tl-radius-xs)',
                    width: 'fit-content',
                  }}
                >
                  SUPPORTING EVIDENCE ONLY
                </span>
              )}

              {/* Detail note */}
              {mod.detail && (
                <p
                  style={{
                    fontFamily: 'var(--tl-font-sans)',
                    fontSize: '0.75rem',
                    color: mod.analyzed ? 'var(--tl-body)' : 'var(--tl-muted-soft)',
                    margin: 0,
                    lineHeight: 1.45,
                  }}
                >
                  {mod.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

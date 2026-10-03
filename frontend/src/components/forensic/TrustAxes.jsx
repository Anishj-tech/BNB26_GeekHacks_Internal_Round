import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const TrustAxes = ({ syntheticScore = 0.5, consistencyScore = 0.5, quadrant = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Consistency on X (0 to 100%), Synthetic on Y (0 to 100%)
  const posX = Math.max(8, Math.min(92, consistencyScore * 100));
  const posY = Math.max(8, Math.min(92, syntheticScore * 100));

  // Determine current quadrant
  const isHighSynthetic = syntheticScore >= 0.5;
  const isHighConsistency = consistencyScore >= 0.5;

  let computedQuadrant = quadrant;
  if (!computedQuadrant) {
    if (isHighSynthetic && !isHighConsistency) {
      computedQuadrant = 'AI MANIPULATION (HIGH SYNTHETIC / LOW CONSISTENCY)';
    } else if (isHighSynthetic && isHighConsistency) {
      computedQuadrant = 'ADVANCED SYNCHRONIZED AI (HIGH SYNTHETIC / HIGH CONSISTENCY)';
    } else if (!isHighSynthetic && isHighConsistency) {
      computedQuadrant = 'AUTHENTIC BASELINE (LOW SYNTHETIC / HIGH CONSISTENCY)';
    } else {
      computedQuadrant = 'OUT-OF-CONTEXT / AMBIGUOUS (LOW SYNTHETIC / LOW CONSISTENCY)';
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-surface-card)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-trust-axes-container"
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--tl-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              TWO-AXIS FORENSIC MATRIX
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              SYNTHETIC VS. CONSISTENCY
            </span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: 0,
            }}
          >
            Decoupled Multi-Modal Trust Space
          </h3>
        </div>

        <Badge variant={isHighSynthetic ? 'conflict' : 'match'} size="sm" dot>
          {computedQuadrant}
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
        Single-classifier detectors conflate compression noise with AI generation. TrustLayer plots
        independent <strong>Synthetic Artifact Evidence</strong> against <strong>Cross-Modal Consistency</strong> to isolate genuine manipulation from real out-of-context media.
      </p>

      {/* Visual Coordinate Grid & Readout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(260px, 0.8fr)',
          gap: '24px',
          alignItems: 'center',
        }}
        className="tl-axes-grid-layout"
      >
        {/* 2D Matrix */}
        <div
          style={{
            position: 'relative',
            height: '320px',
            backgroundColor: 'var(--tl-canvas)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            overflow: 'hidden',
          }}
        >
          {/* Quadrant Tint Zones */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              height: '100%',
              width: '100%',
            }}
          >
            {/* Top-Left Quadrant: High Synthetic, Low Consistency */}
            <div
              style={{
                backgroundColor: 'rgba(198, 69, 69, 0.05)',
                borderRight: '1px dashed var(--tl-hairline)',
                borderBottom: '1px dashed var(--tl-hairline)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-error)', fontWeight: 600 }}>
                CRITICAL MANIPULATION
              </span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                High Synthetic / Low Consistency
              </span>
            </div>

            {/* Top-Right Quadrant: High Synthetic, High Consistency */}
            <div
              style={{
                backgroundColor: 'rgba(212, 160, 23, 0.05)',
                borderBottom: '1px dashed var(--tl-hairline)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                textAlign: 'right',
              }}
            >
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-warning)', fontWeight: 600 }}>
                SYNCHRONIZED AI
              </span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                High Synthetic / High Consistency
              </span>
            </div>

            {/* Bottom-Left Quadrant: Low Synthetic, Low Consistency */}
            <div
              style={{
                backgroundColor: 'rgba(232, 165, 90, 0.05)',
                borderRight: '1px dashed var(--tl-hairline)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-accent-amber)', fontWeight: 600 }}>
                OUT-OF-CONTEXT / UNCERTAIN
              </span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                Low Synthetic / Low Consistency
              </span>
            </div>

            {/* Bottom-Right Quadrant: Low Synthetic, High Consistency */}
            <div
              style={{
                backgroundColor: 'rgba(93, 184, 114, 0.06)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                textAlign: 'right',
              }}
            >
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-success)', fontWeight: 600 }}>
                VERIFIED AUTHENTIC
              </span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                Low Synthetic / High Consistency
              </span>
            </div>
          </div>

          {/* Plotted Investigation Coordinate Point */}
          <div
            style={{
              position: 'absolute',
              left: `${posX}%`,
              bottom: `${posY}%`,
              transform: 'translate(-50%, 50%)',
              zIndex: 10,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Ping aura */}
            <span
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                backgroundColor: isHighSynthetic ? 'var(--tl-error)' : 'var(--tl-success)',
                opacity: 0.25,
                animation: 'tl-ping-soft 2s ease-out infinite',
              }}
            />
            {/* Core marker */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: isHighSynthetic ? 'var(--tl-error)' : 'var(--tl-success)',
                border: '3px solid #ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                transform: isHovered ? 'scale(1.25)' : 'scale(1)',
                transition: 'transform 140ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Axis Labels */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.625rem',
              color: 'var(--tl-muted)',
              backgroundColor: 'rgba(250, 249, 245, 0.9)',
              padding: '2px 8px',
              borderRadius: 'var(--tl-radius-xs)',
              pointerEvents: 'none',
              letterSpacing: '0.04em',
            }}
          >
            CROSS-MODAL CONSISTENCY (X) →
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '8px',
              transform: 'translateY(-50%) rotate(-90deg)',
              transformOrigin: 'left center',
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.625rem',
              color: 'var(--tl-muted)',
              backgroundColor: 'rgba(250, 249, 245, 0.9)',
              padding: '2px 8px',
              borderRadius: 'var(--tl-radius-xs)',
              pointerEvents: 'none',
              letterSpacing: '0.04em',
            }}
          >
            ↑ SYNTHETIC EVIDENCE (Y)
          </div>
        </div>

        {/* Forensic Matrix Readout Inspector */}
        <div
          style={{
            backgroundColor: 'var(--tl-canvas)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crosshair size={16} color="var(--tl-primary)" />
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              CALIBRATED COORDINATES
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              borderTop: '1px solid var(--tl-hairline-soft)',
              paddingTop: '12px',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block' }}>
                X-AXIS (CONSISTENCY)
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                {consistencyScore.toFixed(2)}
              </span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)', display: 'block' }}>
                Agreement between streams
              </span>
            </div>

            <div>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block' }}>
                Y-AXIS (SYNTHETIC)
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                {syntheticScore.toFixed(2)}
              </span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted)', display: 'block' }}>
                Isolated artifact density
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--tl-radius-sm)',
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
            }}
          >
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block', marginBottom: '4px' }}>
              FORENSIC SIGNIFICANCE
            </span>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.45 }}>
              {isHighSynthetic && !isHighConsistency && (
                <>High synthetic artifact density paired with low cross-modal consistency confirms AI manipulation rather than accidental camera encoding issues.</>
              )}
              {isHighSynthetic && isHighConsistency && (
                <>Synchronized neural synthesis detected. Despite aligned lip motion, high-frequency boundary traces indicate AI generation.</>
              )}
              {!isHighSynthetic && isHighConsistency && (
                <>Baseline coherent physical recording. Both visual temporal flow and acoustic spectrograms demonstrate organic continuity.</>
              )}
              {!isHighSynthetic && !isHighConsistency && (
                <>Low consistency without high synthetic scores indicates out-of-context splicing or sensor degradation rather than deepfake generation.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

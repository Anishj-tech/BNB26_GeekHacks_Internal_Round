import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle, Activity, Layers, GitCompare } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const TrustAssessment = ({ assessment }) => {
  if (!assessment) return null;

  const {
    verdict = 'UNCERTAIN',
    summary,
    confidenceExplanation,
    engineeringTrustIndex,
    syntheticScore,
    syntheticLabel,
    consistencyScore,
    consistencyLabel,
    evidenceCoverage,
    conflictDetected,
    insufficientEvidence,
  } = assessment;

  // Verdict design configuration
  const verdictConfig = {
    TRUSTED: {
      color: 'var(--tl-success)',
      borderColor: 'rgba(93, 184, 114, 0.32)',
      bgSubtle: 'rgba(93, 184, 114, 0.08)',
      icon: ShieldCheck,
      badgeText: 'VERIFIED COHERENT',
      badgeVariant: 'match',
    },
    'PROBABLY TRUSTED': {
      color: 'var(--tl-accent-teal)',
      borderColor: 'rgba(93, 184, 166, 0.32)',
      bgSubtle: 'rgba(93, 184, 166, 0.08)',
      icon: ShieldCheck,
      badgeText: 'PREPONDERANCE OF TRUST',
      badgeVariant: 'match',
    },
    UNCERTAIN: {
      color: 'var(--tl-accent-amber)',
      borderColor: 'rgba(232, 165, 90, 0.32)',
      bgSubtle: 'rgba(232, 165, 90, 0.08)',
      icon: HelpCircle,
      badgeText: insufficientEvidence ? 'INSUFFICIENT EVIDENCE' : 'EVIDENCE INCONCLUSIVE',
      badgeVariant: 'uncertainty',
    },
    'PROBABLY MANIPULATED': {
      color: 'var(--tl-warning)',
      borderColor: 'rgba(212, 160, 23, 0.32)',
      bgSubtle: 'rgba(212, 160, 23, 0.08)',
      icon: AlertTriangle,
      badgeText: 'SUSPICIOUS ANOMALIES',
      badgeVariant: 'conflict',
    },
    MANIPULATED: {
      color: 'var(--tl-error)',
      borderColor: 'rgba(198, 69, 69, 0.32)',
      bgSubtle: 'rgba(198, 69, 69, 0.08)',
      icon: ShieldAlert,
      badgeText: 'MANIPULATION CONFIRMED',
      badgeVariant: 'conflict',
    },
  };

  const currentConfig = verdictConfig[verdict] || verdictConfig.UNCERTAIN;
  const VerdictIcon = currentConfig.icon;

  return (
    <section
      style={{
        backgroundColor: 'var(--tl-surface-dark)',
        color: 'var(--tl-on-dark)',
        borderRadius: 'var(--tl-radius-lg)',
        border: '1px solid var(--tl-surface-dark-elevated)',
        padding: '32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="tl-assessment-block"
    >
      {/* Top Hairline Indicator */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: currentConfig.color,
        }}
      />

      {/* Header Eyebrow */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: 'var(--tl-on-dark-soft)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            TRUST CONCLUSION DERIVED FROM MULTI-MODAL EVIDENCE
          </span>
        </div>

        <Badge variant={currentConfig.badgeVariant} size="sm" dot>
          {currentConfig.badgeText}
        </Badge>
      </div>

      {/* Primary Conclusion Headline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--tl-radius-md)',
            backgroundColor: currentConfig.bgSubtle,
            border: `1px solid ${currentConfig.borderColor}`,
            color: currentConfig.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <VerdictIcon size={24} />
        </div>

        <div>
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              color: 'var(--tl-on-dark-soft)',
              textTransform: 'uppercase',
            }}
          >
            TRUST ASSESSMENT
          </span>
          <h2
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: 'var(--tl-on-dark)',
              margin: '2px 0 8px',
            }}
          >
            {verdict}
          </h2>
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '1rem',
              color: 'var(--tl-on-dark-soft)',
              lineHeight: 1.55,
              maxWidth: '840px',
              margin: 0,
            }}
          >
            {summary}
          </p>
        </div>
      </div>

      {confidenceExplanation && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--tl-radius-md)',
            backgroundColor: 'var(--tl-surface-dark-soft)',
            border: '1px solid rgba(250, 249, 245, 0.08)',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--tl-primary)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            CONFIDENCE & EVIDENCE INTEGRITY NOTE
          </span>
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--tl-on-dark-soft)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {confidenceExplanation}
          </p>
        </div>
      )}

      {/* Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          borderTop: '1px solid var(--tl-surface-dark-elevated)',
          paddingTop: '24px',
        }}
        className="tl-assessment-metrics-grid"
      >
        {/* Metric 1: Synthetic Score */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-dark-elevated)',
            padding: '16px',
            borderRadius: 'var(--tl-radius-md)',
            border: '1px solid rgba(250, 249, 245, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', letterSpacing: '0.06em' }}>
              SYNTHETIC EVIDENCE
            </span>
            <Activity size={14} color="var(--tl-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
              {syntheticScore !== undefined ? syntheticScore.toFixed(2) : '—'}
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
              / 1.00
            </span>
          </div>
          <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', marginTop: '4px', display: 'block' }}>
            {syntheticLabel || 'Artifact intensity'}
          </span>
        </div>

        {/* Metric 2: Consistency Score */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-dark-elevated)',
            padding: '16px',
            borderRadius: 'var(--tl-radius-md)',
            border: '1px solid rgba(250, 249, 245, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', letterSpacing: '0.06em' }}>
              CONSISTENCY SCORE
            </span>
            <GitCompare size={14} color="var(--tl-accent-teal)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
              {consistencyScore !== undefined ? consistencyScore.toFixed(2) : '—'}
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
              / 1.00
            </span>
          </div>
          <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', marginTop: '4px', display: 'block' }}>
            {consistencyLabel || 'Cross-modal agreement'}
          </span>
        </div>

        {/* Metric 3: Evidence Coverage */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-dark-elevated)',
            padding: '16px',
            borderRadius: 'var(--tl-radius-md)',
            border: '1px solid rgba(250, 249, 245, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', letterSpacing: '0.06em' }}>
              EVIDENCE COVERAGE
            </span>
            <Layers size={14} color="var(--tl-accent-amber)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
              {evidenceCoverage}%
            </span>
          </div>
          <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', marginTop: '4px', display: 'block' }}>
            Multi-modal sensor breadth
          </span>
        </div>

        {/* Metric 4: Conflict Status */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-dark-elevated)',
            padding: '16px',
            borderRadius: 'var(--tl-radius-md)',
            border: '1px solid rgba(250, 249, 245, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', letterSpacing: '0.06em' }}>
              CROSS-MODAL CONFLICT
            </span>
            <AlertTriangle size={14} color={conflictDetected ? 'var(--tl-error)' : 'var(--tl-success)'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: conflictDetected ? 'var(--tl-error)' : 'var(--tl-success)',
              }}
            >
              {conflictDetected ? 'DETECTED' : 'NONE'}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', marginTop: '4px', display: 'block' }}>
            {conflictDetected ? 'Modalities disagree' : 'Signals concordant'}
          </span>
        </div>

        {/* Metric 5: Engineering Trust Index */}
        {engineeringTrustIndex !== undefined && (
          <div
            style={{
              backgroundColor: 'var(--tl-surface-dark-elevated)',
              padding: '16px',
              borderRadius: 'var(--tl-radius-md)',
              border: '1px solid rgba(250, 249, 245, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', letterSpacing: '0.06em' }}>
                TRUST INDEX (ENGINEERING)
              </span>
              <Shield size={14} color={currentConfig.color} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.75rem', fontWeight: 600, color: currentConfig.color }}>
                {engineeringTrustIndex}
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                / 100
              </span>
            </div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted-soft)', marginTop: '4px', display: 'block' }}>
              Engineering metric, NOT probability
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

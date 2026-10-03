import { Video, Mic, FileText, Crosshair, UserCheck, AlertCircle, Clock, ShieldCheck, ShieldAlert, HelpCircle } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const EvidenceCard = ({ evidence }) => {
  if (!evidence) return null;

  const {
    id,
    modality = 'VIDEO',
    isSupporting = false,
    signalType,
    score,
    direction = 'SUSPICIOUS_ARTIFACT',
    uncertainty = 'Low',
    timeRange,
    observation,
    reasoning,
  } = evidence;

  const modalityIcons = {
    VIDEO: Video,
    AUDIO: Mic,
    TRANSCRIPT: FileText,
    CROSS_MODAL: Crosshair,
    FACE: UserCheck,
  };

  const Icon = modalityIcons[modality] || Video;

  const directionConfig = {
    CONFIRMS_AUTHENTIC: {
      color: 'var(--tl-success)',
      label: 'CONFIRMS AUTHENTIC',
      badgeVariant: 'match',
      icon: ShieldCheck,
    },
    SUSPICIOUS_ARTIFACT: {
      color: 'var(--tl-error)',
      label: 'SUSPICIOUS ARTIFACT',
      badgeVariant: 'conflict',
      icon: ShieldAlert,
    },
    CROSS_MODAL_CONFLICT: {
      color: 'var(--tl-error)',
      label: 'CROSS-MODAL CONFLICT',
      badgeVariant: 'conflict',
      icon: AlertCircle,
    },
    INSUFFICIENT: {
      color: 'var(--tl-accent-amber)',
      label: 'INSUFFICIENT SIGNAL',
      badgeVariant: 'uncertainty',
      icon: HelpCircle,
    },
  };

  const currentDir = directionConfig[direction] || directionConfig.SUSPICIOUS_ARTIFACT;

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-canvas)',
        border: `1px solid ${isSupporting ? 'var(--tl-hairline)' : 'var(--tl-hairline)'}`,
        borderLeft: `4px solid ${currentDir.color}`,
        borderRadius: 'var(--tl-radius-md)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'border-color 140ms ease, box-shadow 140ms ease',
        boxShadow: '0 1px 3px rgba(20, 20, 19, 0.04)',
      }}
      className="tl-evidence-card"
    >
      {/* Top Metadata Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--tl-radius-xs)',
              backgroundColor: 'var(--tl-surface-card)',
              color: 'var(--tl-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={14} />
          </div>

          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--tl-muted)',
              letterSpacing: '0.06em',
            }}
          >
            {modality} // {id}
          </span>

          {isSupporting && (
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.625rem',
                fontWeight: 600,
                color: 'var(--tl-accent-amber)',
                backgroundColor: 'rgba(232, 165, 90, 0.12)',
                border: '1px solid rgba(232, 165, 90, 0.28)',
                padding: '1px 6px',
                borderRadius: 'var(--tl-radius-xs)',
              }}
            >
              SUPPORTING EVIDENCE
            </span>
          )}

          {!isSupporting && (
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.625rem',
                color: 'var(--tl-muted-soft)',
                backgroundColor: 'var(--tl-surface-card)',
                padding: '1px 6px',
                borderRadius: 'var(--tl-radius-xs)',
              }}
            >
              PRIMARY EVIDENCE
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {timeRange && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted)',
              }}
            >
              <Clock size={12} /> {timeRange}
            </span>
          )}
          <Badge variant={currentDir.badgeVariant} size="xs" dot>
            {currentDir.label}
          </Badge>
        </div>
      </div>

      {/* Signal Title & Direction */}
      <div>
        <h4
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--tl-ink)',
            margin: '0 0 4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {signalType}
        </h4>
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            color: 'var(--tl-body)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {observation}
        </p>
      </div>

      {/* Reasoning Trail / Forensic Justification */}
      {reasoning && (
        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            padding: '10px 14px',
            borderRadius: 'var(--tl-radius-sm)',
            border: '1px solid var(--tl-hairline)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.625rem',
              color: 'var(--tl-muted)',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '2px',
            }}
          >
            FORENSIC REASONING TRAIL
          </span>
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              color: 'var(--tl-body)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {reasoning}
          </p>
        </div>
      )}

      {/* Technical Spec Footer */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          borderTop: '1px solid var(--tl-hairline-soft)',
          paddingTop: '10px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block' }}>
              SIGNAL SCORE
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
              {score.toFixed(2)}
            </span>
          </div>

          <div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block' }}>
              UNCERTAINTY
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--tl-body)' }}>
              {uncertainty}
            </span>
          </div>
        </div>

        {isSupporting && (
          <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-muted-soft)', fontStyle: 'italic' }}>
            Note: Supporting evidence does not serve as standalone proof.
          </span>
        )}
      </div>
    </div>
  );
};

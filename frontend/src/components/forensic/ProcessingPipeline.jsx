import { Activity, CheckCircle2, Shield, Search, GitCompare, Layers } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const ProcessingPipeline = ({ currentStageIndex = 0, stageName = 'VALIDATING', note = '', percent = 0 }) => {
  const stages = [
    { name: 'VALIDATING', label: 'Media Validation', icon: Shield },
    { name: 'EXTRACTING', label: 'Feature Extraction', icon: Search },
    { name: 'ANALYZING', label: 'Signal Dissection', icon: Activity },
    { name: 'CHECKING CONSISTENCY', label: 'Cross-Modal Match', icon: GitCompare },
    { name: 'FUSING EVIDENCE', label: 'Evidence Fusion', icon: Layers },
    { name: 'ASSESSING TRUST', label: 'Trust Synthesis', icon: CheckCircle2 },
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-surface-dark)',
        color: 'var(--tl-on-dark)',
        borderRadius: 'var(--tl-radius-lg)',
        border: '1px solid var(--tl-surface-dark-elevated)',
        padding: '36px',
        maxWidth: '720px',
        margin: '40px auto',
        textAlign: 'center',
      }}
      className="tl-processing-container"
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <Badge variant="brand" size="sm" dot pulse>
          EVIDENCE FUSION PIPELINE ACTIVE
        </Badge>
      </div>

      <h3
        style={{
          fontFamily: 'var(--tl-font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--tl-on-dark)',
          margin: '0 0 8px',
        }}
      >
        {stageName ? `Pipeline Stage // ${stageName}` : 'Analyzing Evidence Bundle'}
      </h3>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.9375rem',
          color: 'var(--tl-on-dark-soft)',
          margin: '0 0 28px',
          lineHeight: 1.5,
        }}
      >
        {note || 'Running multi-modal neural decomposition across visual and acoustic frequency spaces.'}
      </p>

      {/* Progress Bar */}
      <div
        style={{
          height: '6px',
          backgroundColor: 'rgba(250, 249, 245, 0.1)',
          borderRadius: 'var(--tl-radius-full)',
          overflow: 'hidden',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: 'var(--tl-primary)',
            borderRadius: 'var(--tl-radius-full)',
            transition: 'width 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Pipeline Stages Stepper */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '8px',
        }}
      >
        {stages.map((st, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = st.icon;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 4px',
                borderRadius: 'var(--tl-radius-sm)',
                backgroundColor: isCurrent ? 'var(--tl-surface-dark-elevated)' : 'transparent',
                border: isCurrent ? '1px solid rgba(204, 120, 92, 0.3)' : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isDone
                    ? 'rgba(93, 184, 114, 0.2)'
                    : isCurrent
                    ? 'var(--tl-primary)'
                    : 'var(--tl-surface-dark-soft)',
                  color: isDone ? 'var(--tl-success)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDone ? <CheckCircle2 size={15} /> : <Icon size={14} />}
              </div>

              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? 'var(--tl-on-dark)' : isDone ? 'var(--tl-success)' : 'var(--tl-on-dark-soft)',
                  textAlign: 'center',
                  letterSpacing: '0.04em',
                }}
              >
                {st.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

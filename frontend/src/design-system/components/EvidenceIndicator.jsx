import { StatusDot } from './StatusDot';
import { Badge } from './Badge';

/**
 * TrustLayer EvidenceIndicator Component
 * 
 * Specifically designed for future Evidence Graph nodes and Timeline items.
 * 
 * States:
 * - MATCH: Verified agreement / Consistency (#4FB3A5)
 * - CONFLICT: Detected mismatch / Synthetic artifact (#E06C75)
 * - UNCERTAIN: Ambiguous signal / Insufficient evidence (#D6A85F)
 * - ANALYZING: Ongoing modal evaluation (#5B8DEF)
 */
export const EvidenceIndicator = ({
  state = 'MATCH',
  modality = 'Audio-Visual Sync',
  score = null,
  timestamp = null,
  description = null,
  compact = false,
  className = '',
  style = {},
}) => {
  const normalizedState = state.toUpperCase();

  const stateConfig = {
    MATCH: {
      variant: 'match',
      label: 'MATCH',
      borderColor: 'var(--tl-match-border)',
      bg: 'var(--tl-match-subtle)',
      color: 'var(--tl-match)',
    },
    CONFLICT: {
      variant: 'conflict',
      label: 'CONFLICT',
      borderColor: 'var(--tl-conflict-border)',
      bg: 'var(--tl-conflict-subtle)',
      color: 'var(--tl-conflict)',
    },
    UNCERTAIN: {
      variant: 'uncertainty',
      label: 'UNCERTAIN',
      borderColor: 'var(--tl-uncertainty-border)',
      bg: 'var(--tl-uncertainty-subtle)',
      color: 'var(--tl-uncertainty)',
    },
    ANALYZING: {
      variant: 'brand',
      label: 'EVALUATING',
      borderColor: 'var(--tl-brand-border)',
      bg: 'var(--tl-brand-subtle)',
      color: 'var(--tl-brand)',
    },
  };

  const config = stateConfig[normalizedState] || stateConfig.MATCH;

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          backgroundColor: config.bg,
          border: `1px solid ${config.borderColor}`,
          borderRadius: 'var(--tl-radius-sm)',
          fontSize: '0.75rem',
          ...style,
        }}
        className={`tl-evidence-indicator-compact ${className}`}
      >
        <StatusDot variant={config.variant} size="sm" pulse={normalizedState === 'ANALYZING'} />
        <span
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontWeight: 600,
            color: config.color,
            letterSpacing: '0.04em',
          }}
        >
          {config.label}
        </span>
        <span style={{ color: 'var(--tl-text-secondary)', fontSize: '0.6875rem' }}>
          {modality}
        </span>
        {score !== null && (
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              color: 'var(--tl-text-muted)',
              fontSize: '0.6875rem',
              marginLeft: 'auto',
            }}
          >
            {score}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px 14px',
        backgroundColor: 'var(--tl-surface)',
        border: `1px solid ${config.borderColor}`,
        borderRadius: 'var(--tl-radius-md)',
        position: 'relative',
        ...style,
      }}
      className={`tl-evidence-indicator-card ${className}`}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '3px',
          backgroundColor: config.color,
          borderRadius: 'var(--tl-radius-md) 0 0 var(--tl-radius-md)',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingLeft: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant={config.variant} size="sm" dot pulse={normalizedState === 'ANALYZING'}>
            {config.label}
          </Badge>
          <span
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--tl-text-primary)',
            }}
          >
            {modality}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {timestamp && (
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-text-muted)',
              }}
            >
              {timestamp}
            </span>
          )}
          {score !== null && (
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: config.color,
              }}
            >
              {score}
            </span>
          )}
        </div>
      </div>

      {description && (
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.75rem',
            lineHeight: 1.45,
            color: 'var(--tl-text-secondary)',
            margin: 0,
            paddingLeft: '6px',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

import { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Film,
  Mic,
  Crosshair,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

/**
 * Phase 5.2: Suspicious Timeline Component
 * 
 * Concept from PRD:
 * 00:00 ────────●────────●────────── 00:20
 *               │        │
 *            region    region
 * 
 * Indicators:
 * - visual anomaly
 * - audio anomaly
 * - lip-sync inconsistency
 * - cross-modal conflict
 * 
 * Clicking a suspicious region displays time range, signal, status, supporting evidence.
 */
export const SuspiciousTimeline = ({
  duration = '00:18',
  suspiciousIntervals = [],
  representativeFrames = [],
  onSelectRegion = null,
}) => {
  const [selectedIntervalIdx, setSelectedIntervalIdx] = useState(
    suspiciousIntervals.findIndex((s) => s.status === 'SUSPICIOUS') !== -1
      ? suspiciousIntervals.findIndex((s) => s.status === 'SUSPICIOUS')
      : 0
  );

  // Fallback default intervals if none provided
  const intervals = suspiciousIntervals.length > 0
    ? suspiciousIntervals
    : [
        { start: '00:00', end: '00:04.2', status: 'NORMAL', label: 'Pristine Anchor' },
        { start: '00:04.2', end: '00:11.8', status: 'SUSPICIOUS', label: 'Warping & Lip Desync', anomalyType: 'Lip-Sync Desynchronization' },
        { start: '00:11.8', end: duration, status: 'NORMAL', label: 'Pristine Outro' },
      ];

  const activeInterval = intervals[selectedIntervalIdx] || intervals[0];

  const handleIntervalClick = (idx) => {
    setSelectedIntervalIdx(idx);
    const item = intervals[idx];
    if (onSelectRegion) {
      onSelectRegion({
        id: `REGION-${idx + 1}`,
        signal: item.label || 'Timeline Anomaly Region',
        status: item.status === 'SUSPICIOUS' ? 'ANOMALY CONFIRMED' : 'AUTHENTIC STREAM',
        source: item.anomalyType || 'Audiovisual SyncNet Interval',
        timeRange: `${item.start} - ${item.end}`,
        whyItMatters: item.status === 'SUSPICIOUS'
          ? 'Desynchronization between speech envelope velocity and 3D mouth landmarks indicates localized splicing or generative re-voicing.'
          : 'Normal biological phoneme-viseme lock within natural tolerances.',
        isSupporting: false,
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-surface-dark)',
        color: 'var(--tl-on-dark)',
        borderRadius: 'var(--tl-radius-lg)',
        border: '1px solid var(--tl-surface-dark-elevated)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-suspicious-timeline-container"
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
              TEMPORAL FORENSIC ANALYSIS
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
              SUSPICIOUS TIMELINE
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--tl-on-dark)',
              margin: 0,
            }}
          >
            Temporal Anomaly Scrubber
          </h3>
        </div>

        <Badge variant={activeInterval.status === 'SUSPICIOUS' ? 'conflict' : 'match'} size="sm" dot>
          {activeInterval.status === 'SUSPICIOUS' ? 'SUSPICIOUS REGION SELECTED' : 'AUTHENTIC BASELINE'}
        </Badge>
      </div>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-on-dark-soft)',
          maxWidth: '780px',
          lineHeight: 1.55,
          marginBottom: '24px',
        }}
      >
        Tampering is rarely uniform across an entire file. TrustLayer isolates specific timestamped intervals exhibiting visual boundary blurring, acoustic vocoder splices, or lip-sync desynchronization.
      </p>

      {/* Interactive Horizontal Scrubber Track */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', marginBottom: '8px' }}>
          <span>00:00 (Start of Media)</span>
          <span>{duration} (End of Stream)</span>
        </div>

        {/* Multi-segment time bar */}
        <div
          style={{
            display: 'flex',
            height: '24px',
            borderRadius: 'var(--tl-radius-sm)',
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
          }}
        >
          {intervals.map((interval, idx) => {
            const isSuspicious = interval.status === 'SUSPICIOUS';
            const isSelected = idx === selectedIntervalIdx;

            return (
              <div
                key={idx}
                onClick={() => handleIntervalClick(idx)}
                style={{
                  flex: isSuspicious ? 1.5 : 1,
                  backgroundColor: isSuspicious ? 'rgba(198, 69, 69, 0.45)' : 'rgba(93, 184, 114, 0.25)',
                  borderRight: idx < intervals.length - 1 ? '2px solid var(--tl-surface-dark)' : 'none',
                  outline: isSelected ? '2px solid var(--tl-primary)' : 'none',
                  outlineOffset: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 160ms ease',
                }}
                title={`${interval.start} - ${interval.end}: ${interval.label}`}
              >
                {/* Pin marker for suspicious region */}
                {isSuspicious && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--tl-error)',
                      boxShadow: '0 0 8px var(--tl-error)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Interval Inspector Card */}
      <div
        style={{
          backgroundColor: 'var(--tl-surface-dark-elevated)',
          borderRadius: 'var(--tl-radius-md)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            SELECTED INTERVAL RANGE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--tl-primary)" />
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
              {activeInterval.start} ── {activeInterval.end}
            </span>
          </div>
        </div>

        <div>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            FORENSIC SIGNAL CLASSIFICATION
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
              {activeInterval.label}
            </span>
          </div>
        </div>

        <div>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            AUDIT ACTION
          </span>
          <button
            onClick={() => handleIntervalClick(selectedIntervalIdx)}
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--tl-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--tl-radius-md)',
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Examine Interval Details</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

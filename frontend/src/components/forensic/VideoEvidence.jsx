import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

export const VideoEvidence = ({ videoAnalysis, filename = 'evidence_sample.mp4', duration = '00:18' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(0);

  if (!videoAnalysis) return null;

  const {
    framesAnalyzed = 540,
    visualSyntheticScore = 0.82,
    visualUncertainty = 'Low',
    suspiciousIntervals = [],
    representativeFrames = [],
  } = videoAnalysis;

  const currentFrame = representativeFrames[selectedFrame] || representativeFrames[0];

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-surface-dark)',
        color: 'var(--tl-on-dark)',
        border: '1px solid var(--tl-surface-dark-elevated)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '32px',
        marginBottom: '32px',
      }}
      className="tl-video-forensics-panel"
    >
      {/* Section Header */}
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
                color: 'var(--tl-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              MODALITY INSPECTION // VIDEO STREAM FORENSICS
            </span>
            <span style={{ color: 'var(--tl-surface-dark-elevated)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
              {filename}
            </span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: '1.625rem',
              fontWeight: 400,
              color: 'var(--tl-on-dark)',
              margin: 0,
            }}
          >
            Video Keyframe & Temporal Scrubber
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Badge variant="dark" size="sm" mono>
            {framesAnalyzed} FRAMES SAMPLED
          </Badge>
          <Badge variant={visualSyntheticScore > 0.5 ? 'conflict' : 'match'} size="sm" dot>
            SYNTHETIC: {visualSyntheticScore.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Main Video & Scrubber Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(280px, 0.8fr)',
          gap: '24px',
          alignItems: 'start',
        }}
        className="tl-video-grid-layout"
      >
        {/* Left: Video Player Mockup & Scrubber Bar */}
        <div>
          {/* Mock Video Canvas */}
          <div
            style={{
              position: 'relative',
              height: '240px',
              backgroundColor: '#0d0d0c',
              borderRadius: 'var(--tl-radius-md)',
              border: '1px solid rgba(250, 249, 245, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Top Video Telemetry HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'rgba(250, 249, 245, 0.7)' }}>
                REC // 1920x1080 @ 30FPS
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)' }}>
                KEYFRAME INTEL
              </span>
            </div>

            {/* Central Playback HUD Motif */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 2,
              }}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(250, 249, 245, 0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(250, 249, 245, 0.25)',
                  color: 'var(--tl-on-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 100ms ease',
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
              </button>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'rgba(250, 249, 245, 0.6)' }}>
                {duration} FORENSIC STREAM
              </span>
            </div>

            {/* Subtle Crosshair Grid inside Player */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at center, rgba(204, 120, 92, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom HUD bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                UNCERTAINTY: {visualUncertainty}
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                TEMPORAL DISSECTION ACTIVE
              </span>
            </div>
          </div>

          {/* Temporal Scrubber with Suspicious Regions */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                TEMPORAL REGIONS SCRUBBER
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                00:00 — {duration}
              </span>
            </div>

            {/* Interval Track */}
            <div
              style={{
                display: 'flex',
                height: '24px',
                borderRadius: 'var(--tl-radius-xs)',
                overflow: 'hidden',
                border: '1px solid rgba(250, 249, 245, 0.1)',
                backgroundColor: 'var(--tl-surface-dark-soft)',
              }}
            >
              {suspiciousIntervals.map((interval, idx) => {
                const isSuspicious = interval.status === 'SUSPICIOUS';
                return (
                  <div
                    key={idx}
                    style={{
                      flex: isSuspicious ? 1.5 : 1,
                      backgroundColor: isSuspicious ? 'rgba(198, 69, 69, 0.35)' : 'rgba(93, 184, 114, 0.18)',
                      borderRight: '1px solid rgba(250, 249, 245, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 8px',
                      position: 'relative',
                    }}
                    title={`${interval.start} - ${interval.end}: ${interval.label}`}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--tl-font-mono)',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        color: isSuspicious ? '#ff9999' : '#a2e8b0',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {interval.start} - {interval.end} ({interval.label})
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Scrubber Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgba(93, 184, 114, 0.5)' }} />
                <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                  Normal Coherent Baseline
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'rgba(198, 69, 69, 0.6)' }} />
                <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                  Flagged Suspicious Interval
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Representative Frame Evidence Inspector */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-dark-elevated)',
            border: '1px solid rgba(250, 249, 245, 0.08)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.06em' }}>
              REPRESENTATIVE FRAME EVIDENCE
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
              FRAME {currentFrame?.frameNumber || '134'} @ {currentFrame?.timestamp || '00:04.46'}
            </span>
          </div>

          {/* Frame selection buttons if multiple */}
          {representativeFrames.length > 1 && (
            <div style={{ display: 'flex', gap: '6px' }}>
              {representativeFrames.map((frame, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFrame(idx)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--tl-radius-xs)',
                    backgroundColor: idx === selectedFrame ? 'var(--tl-primary)' : 'var(--tl-surface-dark-soft)',
                    color: idx === selectedFrame ? '#ffffff' : 'var(--tl-on-dark-soft)',
                    border: '1px solid rgba(250, 249, 245, 0.1)',
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.6875rem',
                    cursor: 'pointer',
                  }}
                >
                  Frame #{frame.frameNumber}
                </button>
              ))}
            </div>
          )}

          {/* Frame inspection card */}
          {currentFrame && (
            <div>
              <h4
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--tl-on-dark)',
                  margin: '0 0 6px',
                }}
              >
                {currentFrame.label}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.8125rem',
                  color: 'var(--tl-on-dark-soft)',
                  lineHeight: 1.5,
                  margin: '0 0 12px',
                }}
              >
                {currentFrame.finding}
              </p>

              <div
                style={{
                  backgroundColor: 'var(--tl-surface-dark-soft)',
                  padding: '10px 12px',
                  borderRadius: 'var(--tl-radius-xs)',
                  border: '1px solid rgba(250, 249, 245, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                  SIGNAL CONFIDENCE:
                </span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-accent-teal)', fontWeight: 600 }}>
                  {currentFrame.confidence}
                </span>
              </div>
            </div>
          )}

          <div
            style={{
              paddingTop: '8px',
              borderTop: '1px solid rgba(250, 249, 245, 0.08)',
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.75rem',
              color: 'var(--tl-muted)',
              lineHeight: 1.45,
            }}
          >
            TrustLayer isolates pixel diffusion traces and corneal reflections only where data was directly extracted.
          </div>
        </div>
      </div>
    </div>
  );
};

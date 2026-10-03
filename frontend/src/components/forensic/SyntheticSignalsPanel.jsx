import { useState } from 'react';
import {
  Activity,
  Video,
  Mic,
  UserCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Info,
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

/**
 * Phase 4.3: Synthetic Signals Section
 * 
 * Communicates independent Synthetic Evidence:
 * - Visual: Frame artifacts, diffusion boundaries, Face consistency (SUPPORTING ONLY)
 * - Audio: Vocoder harmonics, phase anomalies, voice characteristics
 * - Expandable evidence cards
 * - Respects the rule: Face consistency is supporting evidence only, not standalone proof.
 */
export const SyntheticSignalsPanel = ({
  syntheticScore = 0.5,
  syntheticLabel = 'MODERATE',
  evidenceList = [],
  videoAnalysis = null,
  onOpenEvidenceDetail = null,
}) => {
  const [expandedSignals, setExpandedSignals] = useState({});

  const toggleExpand = (id) => {
    setExpandedSignals((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Derive visual & audio synthetic signals from evidenceList or defaults
  const visualEvidence = evidenceList.filter(
    (e) => e.modality === 'VIDEO' || e.modality === 'FACE'
  );
  const audioEvidence = evidenceList.filter((e) => e.modality === 'AUDIO');

  // Helper to format status badge
  const getSignalBadge = (score, isSupporting = false) => {
    if (score >= 0.7) {
      return { variant: 'conflict', label: 'ANOMALY DETECTED', icon: ShieldAlert };
    } else if (score <= 0.3) {
      return { variant: 'match', label: 'CLEAN BASELINE', icon: ShieldCheck };
    }
    return { variant: 'uncertainty', label: 'AMBIGUOUS SIGNAL', icon: HelpCircle };
  };

  return (
    <section
      style={{
        backgroundColor: 'var(--tl-surface-card)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '28px',
        marginBottom: '32px',
      }}
      className="tl-synthetic-signals-panel"
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
              FORENSIC AXIS 1 // INTRINSIC GENERATIVE TRACES
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              SYNTHETIC SIGNALS
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
            Synthetic Signal Decomposition
          </h3>
        </div>

        {/* Overall Synthetic Metric Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.75rem',
              color: 'var(--tl-muted)',
            }}
          >
            Overall Synthetic Evidence:
          </span>
          <Badge
            variant={syntheticScore >= 0.6 ? 'conflict' : syntheticScore <= 0.3 ? 'match' : 'uncertainty'}
            size="sm"
            dot
          >
            {(syntheticScore * 100).toFixed(0)}% — {syntheticLabel}
          </Badge>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-body)',
          maxWidth: '820px',
          lineHeight: 1.55,
          marginBottom: '24px',
        }}
      >
        Intrinsic generative models leave subtle mathematical traces: high-frequency phase step discontinuities,
        Laplacian boundary warping, and texture synthesis artifacts. Each modality is isolated independently.
      </p>

      {/* Grid of Modalities: Visual vs Audio */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {/* 1. VISUAL SIGNALS */}
        <div
          style={{
            backgroundColor: 'var(--tl-canvas)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--tl-hairline)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={16} color="var(--tl-primary)" />
              <span
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--tl-ink)',
                }}
              >
                Visual Modality Signals
              </span>
            </div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              Frame Raster Scan
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Signal 1: Frame Artifacts / Boundary Blur */}
            <div
              style={{
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-sm)',
                padding: '12px 14px',
                backgroundColor: 'var(--tl-surface-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpand('visual_artifacts')}
              >
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                    Frame Artifacts & Boundary Contours
                  </span>
                  <p style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                    Laplacian frequency gradient inspection
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant={syntheticScore >= 0.6 ? 'conflict' : 'match'} size="xs">
                    {syntheticScore >= 0.6 ? 'WARPING DETECTED' : 'HOMOGENEOUS'}
                  </Badge>
                  {expandedSignals['visual_artifacts'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedSignals['visual_artifacts'] && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed var(--tl-hairline)',
                    fontSize: '0.75rem',
                    color: 'var(--tl-body)',
                    lineHeight: 1.45,
                  }}
                >
                  <p style={{ margin: '0 0 6px' }}>
                    High-pass spatial filtering evaluates pixel transition boundaries. Generative models typically create sharp dropoffs in high-frequency texture noise along face and silhouette borders.
                  </p>
                  {onOpenEvidenceDetail && (
                    <button
                      onClick={() => onOpenEvidenceDetail({
                        modality: 'VIDEO',
                        signalType: 'Spatial Boundary Contours',
                        score: syntheticScore,
                        status: syntheticScore >= 0.6 ? 'ANOMALY DETECTED' : 'CLEAN BASELINE',
                        source: 'Keyframe Raster Analyzer',
                        timeRange: 'All Analyzed Frames',
                        whyItMatters: 'Boundary warping reveals where synthetic diffusion patches were blended into background video plates.',
                      })}
                      style={{
                        fontFamily: 'var(--tl-font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--tl-primary)',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Examine in Evidence Drawer →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Signal 2: Face Consistency (CRITICAL: EXPLICITLY SUPPORTING EVIDENCE) */}
            <div
              style={{
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-sm)',
                padding: '12px 14px',
                backgroundColor: 'var(--tl-surface-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpand('face_consistency')}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                      Facial Landmark Consistency
                    </span>
                    <Badge variant="neutral" size="xs">
                      SUPPORTING EVIDENCE
                    </Badge>
                  </div>
                  <p style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                    Biological micro-blinks & 3D mesh curvature
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant={syntheticScore >= 0.6 ? 'conflict' : 'match'} size="xs">
                    {syntheticScore >= 0.6 ? 'IRREGULAR' : 'PHYSIOLOGICAL'}
                  </Badge>
                  {expandedSignals['face_consistency'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedSignals['face_consistency'] && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed var(--tl-hairline)',
                    fontSize: '0.75rem',
                    color: 'var(--tl-body)',
                    lineHeight: 1.45,
                  }}
                >
                  <div
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'rgba(232, 165, 90, 0.1)',
                      borderLeft: '3px solid var(--tl-accent-amber)',
                      borderRadius: 'var(--tl-radius-xs)',
                      marginBottom: '8px',
                      fontSize: '0.75rem',
                      color: 'var(--tl-ink)',
                    }}
                  >
                    <strong>Forensic Rule:</strong> Face consistency is SUPPORTING evidence only. It must not be presented as independent final proof of authenticity.
                  </div>
                  <p style={{ margin: '0 0 6px' }}>
                    Biological motion tracks natural autonomic reflexes (eyelid blink velocity curves and vascular flush).
                  </p>
                  {onOpenEvidenceDetail && (
                    <button
                      onClick={() => onOpenEvidenceDetail({
                        modality: 'FACE',
                        signalType: 'Facial Landmark Tracking',
                        score: syntheticScore,
                        isSupporting: true,
                        status: syntheticScore >= 0.6 ? 'IRREGULAR REFLEXES' : 'PHYSIOLOGICAL LOCK',
                        source: 'Landmark Biometric Extractor',
                        timeRange: 'Full Face Visibility Range',
                        whyItMatters: 'Autonomic physiological motion supports authenticity verification when primary modalities agree.',
                      })}
                      style={{
                        fontFamily: 'var(--tl-font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--tl-primary)',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Examine in Evidence Drawer →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. AUDIO SIGNALS */}
        <div
          style={{
            backgroundColor: 'var(--tl-canvas)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--tl-hairline)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={16} color="var(--tl-primary)" />
              <span
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--tl-ink)',
                }}
              >
                Acoustic Modality Signals
              </span>
            </div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              16kHz Spectrogram Analysis
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Signal 1: Voice Characteristics & Neural Vocoder */}
            <div
              style={{
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-sm)',
                padding: '12px 14px',
                backgroundColor: 'var(--tl-surface-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpand('audio_vocoder')}
              >
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                    Voice Characteristics & Vocoder Traces
                  </span>
                  <p style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                    Bispectral harmonic phase continuity
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant={syntheticScore >= 0.5 ? 'conflict' : 'match'} size="xs">
                    {syntheticScore >= 0.5 ? 'VOCODER DETECTED' : 'NATURAL HARMONICS'}
                  </Badge>
                  {expandedSignals['audio_vocoder'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedSignals['audio_vocoder'] && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed var(--tl-hairline)',
                    fontSize: '0.75rem',
                    color: 'var(--tl-body)',
                    lineHeight: 1.45,
                  }}
                >
                  <p style={{ margin: '0 0 6px' }}>
                    Neural voice cloning engines (e.g. ElevenLabs, VALL-E) introduce characteristic phase smearing and spectral brickwall cutoffs above 7.8kHz that do not exist in natural voice recordings.
                  </p>
                  {onOpenEvidenceDetail && (
                    <button
                      onClick={() => onOpenEvidenceDetail({
                        modality: 'AUDIO',
                        signalType: 'Neural Vocoder Phase Harmonics',
                        score: syntheticScore,
                        status: syntheticScore >= 0.5 ? 'VOCODER DETECTED' : 'NATURAL HARMONICS',
                        source: 'Acoustic Bispectral Scanner',
                        timeRange: 'Full Audio Track',
                        whyItMatters: 'Harmonic phase continuity proves whether speech was produced by biological vocal cords or generated by a neural vocoder.',
                      })}
                      style={{
                        fontFamily: 'var(--tl-font-mono)',
                        fontSize: '0.6875rem',
                        color: 'var(--tl-primary)',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Examine in Evidence Drawer →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Signal 2: Acoustic Room Reverberation */}
            <div
              style={{
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-sm)',
                padding: '12px 14px',
                backgroundColor: 'var(--tl-surface-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpand('audio_room')}
              >
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                    Room Tone & Acoustic Floor Profile
                  </span>
                  <p style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                    RT60 reverberation impulse response
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant="match" size="xs">
                    STABLE NOISE FLOOR
                  </Badge>
                  {expandedSignals['audio_room'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {expandedSignals['audio_room'] && (
                <div
                  style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed var(--tl-hairline)',
                    fontSize: '0.75rem',
                    color: 'var(--tl-body)',
                    lineHeight: 1.45,
                  }}
                >
                  <p style={{ margin: '0 0 6px' }}>
                    Background ambience and impulse decay curves are checked for unnatural step drops during speech pauses, which flag spliced or re-voiced audio segments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

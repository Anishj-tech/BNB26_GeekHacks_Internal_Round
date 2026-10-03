import { useState, useEffect } from 'react';
import {
  FileVideo,
  Mic,
  FileText,
  Activity,
  Layers,
  GitCompare,
  Cpu,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

/**
 * Phase 3: Processing / Analysis View
 * 
 * Strict Phase 3 Constraints:
 * - NO final verdict
 * - NO final trust state
 * - NO final scores pretending to be real
 * - Communicates multi-modal evidence intake and decomposition in real time.
 */
export const AnalysisProcessingView = ({
  evidenceReference = {
    filename: 'briefing_leak_h264.mp4',
    size: '24.8 MB',
    type: 'video/mp4',
    hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  hasAudio = true,
  hasTranscript = true,
  onComplete,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  // 5 Explicit Phase 3 Stages from the prompt:
  // 1. Evidence intake
  // 2. Synthetic analysis
  // 3. Cross-modal consistency
  // 4. Evidence fusion
  // 5. Preparing assessment
  const stages = [
    {
      id: 'intake',
      name: 'Evidence Intake & Ingestion',
      category: 'MEDIA CONTAINER',
      desc: 'Validating stream continuity, unpacking frames, and generating cryptographic SHA-256 seal.',
      statusLabel: 'Intake Active',
      duration: 800,
    },
    {
      id: 'synthetic',
      name: 'Synthetic Signal Dissection',
      category: 'INDEPENDENT AXIS 1',
      desc: 'Evaluating spatial-frequency artifacts, neural vocoder phase distributions, and biological textures.',
      statusLabel: 'Decomposing Traces',
      duration: 1100,
    },
    {
      id: 'consistency',
      name: 'Cross-Modal Consistency',
      category: 'INDEPENDENT AXIS 2',
      desc: 'Correlating 3D lip-motion visemes with acoustic formant envelopes (SyncNet correlation).',
      statusLabel: 'Comparing Modalities',
      duration: 1100,
    },
    {
      id: 'fusion',
      name: 'Deterministic Evidence Fusion',
      category: 'FUSION GRAPH',
      desc: 'Assembling multi-sensor evidence vectors and calibrating directional uncertainty bounds.',
      statusLabel: 'Fusing Evidence',
      duration: 900,
    },
    {
      id: 'preparing',
      name: 'Preparing Trust Assessment',
      category: 'SYNTHESIS',
      desc: 'Synthesizing evidence-backed audit dossier without probabilistic guessing.',
      statusLabel: 'Finalizing Dossier',
      duration: 700,
    },
  ];

  useEffect(() => {
    let currentIdx = 0;
    let timer;

    const runNextStage = () => {
      if (currentIdx < stages.length - 1) {
        currentIdx += 1;
        setCurrentStageIndex(currentIdx);
        setProgressPercent(Math.round(((currentIdx + 1) / stages.length) * 100));
        timer = setTimeout(runNextStage, stages[currentIdx].duration);
      } else {
        setProgressPercent(100);
        if (onComplete) {
          timer = setTimeout(() => {
            onComplete();
          }, 600);
        }
      }
    };

    timer = setTimeout(runNextStage, stages[0].duration);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const activeStage = stages[currentStageIndex] || stages[0];

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-canvas)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="tl-processing-screen animate-fadeIn"
    >
      {/* 1. TOP PROCESS STEPPER HEADER */}
      <header
        style={{
          borderBottom: '1px solid var(--tl-hairline)',
          backgroundColor: 'var(--tl-surface-card)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Brand & Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--tl-radius-sm)',
                backgroundColor: 'var(--tl-surface-dark)',
                color: 'var(--tl-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              TL
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  color: 'var(--tl-primary)',
                  fontWeight: 600,
                  display: 'block',
                }}
              >
                TRUSTLAYER FORENSIC INTAKE
              </span>
              <span
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--tl-ink)',
                }}
              >
                Multi-Modal Analysis Pipeline
              </span>
            </div>
          </div>

          {/* 3-Step Progress Indicator: 01 Upload → 02 Analyze → 03 Results */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tl-success)' }}>
              <span style={{ fontWeight: 600 }}>01</span>
              <span>Upload</span>
              <CheckCircle2 size={13} />
            </div>

            <span style={{ color: 'var(--tl-hairline)' }}>→</span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--tl-primary)',
                padding: '4px 10px',
                backgroundColor: 'var(--tl-primary-subtle)',
                borderRadius: 'var(--tl-radius-pill)',
                border: '1px solid var(--tl-primary-border)',
                fontWeight: 600,
              }}
            >
              <span className="tl-pulse-dot" />
              <span>02 Analyze</span>
            </div>

            <span style={{ color: 'var(--tl-hairline)' }}>→</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tl-muted)' }}>
              <span>03</span>
              <span>Results</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN PROCESSING STAGE CONTENT */}
      <main
        style={{
          flex: 1,
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        {/* Main Heading & Evidence Reference */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
          <Badge variant="brand" size="sm" dot pulse>
            DECOUPLING FORENSIC EVIDENCE
          </Badge>

          <h1
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: '12px 0 8px',
              letterSpacing: '-0.025em',
            }}
          >
            Analyzing your evidence
          </h1>

          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.9375rem',
              color: 'var(--tl-body)',
              lineHeight: 1.6,
              margin: '0 auto 20px',
            }}
          >
            TrustLayer is decomposing the ingested media stream into independent forensic dimensions:
            measuring synthetic generative traces while simultaneously verifying cross-modal coherence.
          </p>

          {/* Uploaded Evidence Reference Chip */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '10px 18px',
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-pill)',
              fontSize: '0.8125rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tl-ink)' }}>
              <FileVideo size={15} color="var(--tl-primary)" />
              <strong style={{ fontFamily: 'var(--tl-font-mono)' }}>{evidenceReference.filename}</strong>
            </div>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-muted)' }}>
              {evidenceReference.size}
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted-soft)',
              }}
            >
              SHA-256: {evidenceReference.hash.substring(0, 10)}…
            </span>
          </div>
        </div>

        {/* 3. CENTRAL ARCHITECTURE VISUALIZATION (PRD CONCEPT) */}
        {/*
                     VIDEO / VISUAL
                            │
                  ┌─────────┴─────────┐
                  ↓                   ↓
           SYNTHETIC ANALYSIS   CROSS-MODAL
                                CONSISTENCY
                  │                   │
                  └─────────┬─────────┘
                            ↓
                     EVIDENCE FUSION
        */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-dark)',
            color: 'var(--tl-on-dark)',
            borderRadius: 'var(--tl-radius-lg)',
            border: '1px solid var(--tl-surface-dark-elevated)',
            padding: '36px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="tl-processing-matrix"
        >
          {/* Subtle Scanning Line Animation */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, var(--tl-primary) 50%, transparent 100%)',
              animation: 'tl-scan 2.8s linear infinite',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--tl-primary)" />
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.08em',
                  color: 'var(--tl-on-dark-soft)',
                }}
              >
                DECOUPLED EVIDENCE FUSION ENGINE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--tl-primary)',
                  fontWeight: 600,
                }}
              >
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          {/* Graphical Pipeline Tree */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            {/* Top Node: VIDEO / VISUAL INGESTION */}
            <div
              style={{
                backgroundColor: currentStageIndex >= 0 ? 'var(--tl-surface-dark-elevated)' : 'transparent',
                border: currentStageIndex === 0 ? '1px solid var(--tl-primary)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--tl-radius-md)',
                padding: '12px 24px',
                textAlign: 'center',
                minWidth: '240px',
                transition: 'all 240ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FileVideo size={16} color="var(--tl-primary)" />
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 600 }}>
                  VIDEO / VISUAL EVIDENCE
                </span>
              </div>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                Container Demuxing • Frame Ingestion
              </span>
            </div>

            {/* Connecting Split Lines */}
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '2px', height: '16px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    backgroundColor: currentStageIndex >= 1 ? 'var(--tl-primary)' : 'transparent',
                    transition: 'all 300ms ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    backgroundColor: currentStageIndex >= 2 ? 'var(--tl-accent-teal)' : 'transparent',
                    transition: 'all 300ms ease',
                  }}
                />
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '2px', height: '16px', backgroundColor: currentStageIndex >= 1 ? 'var(--tl-primary)' : 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: '2px', height: '16px', backgroundColor: currentStageIndex >= 2 ? 'var(--tl-accent-teal)' : 'rgba(255,255,255,0.15)' }} />
              </div>
            </div>

            {/* Middle Split: SYNTHETIC ANALYSIS vs CROSS-MODAL CONSISTENCY */}
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Branch 1: Synthetic Analysis */}
              <div
                style={{
                  backgroundColor: currentStageIndex === 1 ? 'var(--tl-surface-dark-elevated)' : 'rgba(255,255,255,0.02)',
                  border: currentStageIndex === 1 ? '1px solid var(--tl-primary)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--tl-radius-md)',
                  padding: '18px 20px',
                  transition: 'all 240ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color="var(--tl-primary)" />
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 600 }}>
                      SYNTHETIC ANALYSIS
                    </span>
                  </div>
                  {currentStageIndex === 1 ? (
                    <Badge variant="brand" size="xs" dot pulse>SCANNING</Badge>
                  ) : currentStageIndex > 1 ? (
                    <CheckCircle2 size={14} color="var(--tl-success)" />
                  ) : (
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)' }}>QUEUED</span>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', margin: '0 0 10px', lineHeight: 1.4 }}>
                  Independent Axis: Searches for spatial-frequency artifacts, vocoder harmonics, and diffusion boundaries.
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    Laplacian Contours
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    Neural Vocoder
                  </span>
                </div>
              </div>

              {/* Branch 2: Cross-Modal Consistency */}
              <div
                style={{
                  backgroundColor: currentStageIndex === 2 ? 'var(--tl-surface-dark-elevated)' : 'rgba(255,255,255,0.02)',
                  border: currentStageIndex === 2 ? '1px solid var(--tl-accent-teal)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--tl-radius-md)',
                  padding: '18px 20px',
                  transition: 'all 240ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitCompare size={16} color="var(--tl-accent-teal)" />
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 600 }}>
                      CROSS-MODAL CONSISTENCY
                    </span>
                  </div>
                  {currentStageIndex === 2 ? (
                    <Badge variant="match" size="xs" dot pulse>ALIGNING</Badge>
                  ) : currentStageIndex > 2 ? (
                    <CheckCircle2 size={14} color="var(--tl-success)" />
                  ) : (
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)' }}>QUEUED</span>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', margin: '0 0 10px', lineHeight: 1.4 }}>
                  Independent Axis: Checks physical agreement between video mouth kinematics, audio speech, and scene lighting.
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    SyncNet Lip-Voice
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    Phonetic Track
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Merge Lines */}
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '2px', height: '16px', backgroundColor: currentStageIndex >= 3 ? 'var(--tl-primary)' : 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: '2px', height: '16px', backgroundColor: currentStageIndex >= 3 ? 'var(--tl-accent-teal)' : 'rgba(255,255,255,0.15)' }} />
              </div>
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: currentStageIndex >= 3 ? 'var(--tl-primary)' : 'rgba(255,255,255,0.15)',
                }}
              />
              <div style={{ width: '2px', height: '16px', backgroundColor: currentStageIndex >= 3 ? 'var(--tl-primary)' : 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Bottom Node: EVIDENCE FUSION */}
            <div
              style={{
                backgroundColor: currentStageIndex >= 3 ? 'var(--tl-surface-dark-elevated)' : 'transparent',
                border: currentStageIndex >= 3 ? '1px solid var(--tl-primary)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--tl-radius-md)',
                padding: '14px 28px',
                textAlign: 'center',
                minWidth: '260px',
                transition: 'all 240ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--tl-primary)" />
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 600 }}>
                  DETERMINISTIC EVIDENCE FUSION
                </span>
              </div>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                {currentStageIndex >= 4 ? 'Calibrating Directional Uncertainty' : 'Uncertainty Weighting • Conflict Resolution'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. TWO-AXIS PREVIEW & EVIDENCE AVAILABILITY SUMMARY */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Two-Axis Preview (Explaining the Decoupled Dimensions, NOT showing fake verdict) */}
          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-primary)',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                TWO-AXIS FRAMEWORK PREVIEW
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: '0 0 10px',
              }}
            >
              Synthetic vs. Consistency Space
            </h3>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                lineHeight: 1.5,
                margin: '0 0 16px',
              }}
            >
              TrustLayer does not collapse forensic results into a single generic "AI percentage".
              The assessment plots independent synthetic evidence against cross-modal agreement.
            </p>

            {/* Coordinate Grid Skeleton Preview */}
            <div
              style={{
                height: '110px',
                backgroundColor: 'var(--tl-canvas)',
                border: '1px dashed var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-sm)',
                padding: '12px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-muted)' }}>
                <span>↑ High Synthetic Evidence</span>
                <span>Calculating…</span>
              </div>
              <div
                style={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: 'var(--tl-hairline)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: `${Math.min(90, progressPercent)}%`,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--tl-primary)',
                    boxShadow: '0 0 8px var(--tl-primary)',
                    transition: 'left 400ms ease',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-muted)' }}>
                <span>← Low Consistency</span>
                <span>High Consistency →</span>
              </div>
            </div>
          </div>

          {/* Evidence Availability Summary */}
          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-primary)',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                }}
              >
                AUDITABLE MODALITY COVERAGE
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: '0 0 10px',
              }}
            >
              Evidence Ingestion Manifest
            </h3>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                lineHeight: 1.5,
                margin: '0 0 16px',
              }}
            >
              Missing evidence is explicitly distinguished from authenticity confirmation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Video Track */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--tl-canvas)',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-sm)',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileVideo size={15} color="var(--tl-primary)" />
                  <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-ink)' }}>Video Frames (Keyframes)</span>
                </div>
                <Badge variant="match" size="xs">AVAILABLE</Badge>
              </div>

              {/* Audio Track */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--tl-canvas)',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-sm)',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic size={15} color="var(--tl-primary)" />
                  <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-ink)' }}>Acoustic Track (Spectrogram)</span>
                </div>
                <Badge variant={hasAudio ? 'match' : 'neutral'} size="xs">
                  {hasAudio ? 'AVAILABLE' : 'EMBEDDED'}
                </Badge>
              </div>

              {/* Transcript */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--tl-canvas)',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-sm)',
                  fontSize: '0.8125rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={15} color="var(--tl-primary)" />
                  <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-ink)' }}>Phonetic Transcript</span>
                </div>
                <Badge variant={hasTranscript ? 'match' : 'uncertainty'} size="xs">
                  {hasTranscript ? 'AVAILABLE' : 'INFERRED'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 5. ACTIVE STAGE TELEMETRY BAR */}
        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '16px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--tl-primary)',
                animation: 'tl-pulse 1.2s infinite',
              }}
            />
            <div>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-muted)',
                  display: 'block',
                }}
              >
                ACTIVE FORENSIC COMPUTATION
              </span>
              <span
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--tl-ink)',
                }}
              >
                Stage {currentStageIndex + 1} of {stages.length}: {activeStage.name}
              </span>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.75rem',
              color: 'var(--tl-body)',
              margin: 0,
              maxWidth: '520px',
            }}
          >
            {activeStage.desc}
          </p>
        </div>
      </main>
    </div>
  );
};

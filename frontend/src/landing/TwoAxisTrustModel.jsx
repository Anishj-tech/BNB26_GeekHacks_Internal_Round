import { useState } from 'react';
import { Fingerprint, Activity, Info } from 'lucide-react';
import { Card, CardContent } from '../design-system/components/Card';
import { Badge } from '../design-system/components/Badge';
import { SectionHeader } from '../design-system/components/SectionHeader';
import { Divider } from '../design-system/components/Divider';

export const TwoAxisTrustModel = () => {
  const [selectedPoint, setSelectedPoint] = useState(0);

  const samplePoints = [
    {
      id: 0,
      title: 'Verified Authentic Recording',
      quadrant: 'AUTHENTIC BASELINE',
      x: 88, // Consistency %
      y: 12, // Synthetic %
      variant: 'match',
      badgeText: 'HIGH TRUST',
      syntheticScore: '0.12 (Low)',
      consistencyScore: '0.94 (High)',
      verdict: 'Consistent evidence across video, speech envelope, and room acoustics. Natural micro-expressions verified.',
      audioAnalysis: 'Phonemes match lip velocity within ±8ms. Natural ambient microphone reverb.',
      videoAnalysis: 'Zero generative diffusion patterns. Biological blink rate and vascular pulse detected.',
    },
    {
      id: 1,
      title: 'Desynchronized Face Swap',
      quadrant: 'AI MANIPULATION',
      x: 18, // Consistency %
      y: 86, // Synthetic %
      variant: 'conflict',
      badgeText: 'CRITICAL ALERT',
      syntheticScore: '0.86 (High)',
      consistencyScore: '0.22 (Low)',
      verdict: 'Neural voice synthesis detected alongside prominent facial landmark displacement.',
      audioAnalysis: 'Cloned vocoder spectral harmonics present. Unnatural formant frequency steps.',
      videoAnalysis: 'Boundary blur around jawline. Temporal warping observed between frames 30-75.',
    },
    {
      id: 2,
      title: 'Out-of-Context Real Media',
      quadrant: 'CROSS-MODAL CONFLICT',
      x: 24, // Consistency %
      y: 15, // Synthetic %
      variant: 'uncertainty',
      badgeText: 'CONTEXT MISMATCH',
      syntheticScore: '0.15 (Low)',
      consistencyScore: '0.26 (Low)',
      verdict: 'Both audio and video are authentic recordings, but spliced from conflicting real events.',
      audioAnalysis: 'Speech was recorded in outdoor traffic acoustics with high stereo spread.',
      videoAnalysis: 'Visual setting is a soundproof indoor conference room. Mouth shapes disagree with audio.',
    },
    {
      id: 3,
      title: 'High-Fidelity AI Video',
      quadrant: 'ADVANCED GENERATION',
      x: 82, // Consistency %
      y: 78, // Synthetic %
      variant: 'conflict',
      badgeText: 'SYNCED SYNTHETIC',
      syntheticScore: '0.78 (High)',
      consistencyScore: '0.85 (High)',
      verdict: 'AI lip-sync is tightly aligned, but pixel-level generative artifacts expose synthetic origin.',
      audioAnalysis: 'Acoustic track synthesized with clean neural voice clone.',
      videoAnalysis: 'Corneal eye reflections lack natural light-source geometry despite accurate lip sync.',
    },
  ];

  const current = samplePoints[selectedPoint];

  return (
    <section id="trust-model" className="tl-landing-section">
      <SectionHeader
        category="CORE ARCHITECTURE // TWO-AXIS MODEL"
        title="Decoupling Synthetic Artifacts from Cross-Modal Consistency"
        description="Conventional deepfake detectors compress complex media into a single fragile probability. TrustLayer separates AI generation detection from cross-modal agreement, enabling transparent forensic reasoning."
      />

      {/* Conceptual Explanation Cards */}
      <div className="tl-grid-two-col" style={{ marginBottom: '32px' }}>
        <Card variant="surface" interactive>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--tl-radius-md)',
                  backgroundColor: 'var(--tl-conflict-subtle)',
                  border: '1px solid var(--tl-conflict-border)',
                  color: 'var(--tl-conflict)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Fingerprint size={16} />
              </div>
              <div>
                <span className="tl-label-tech">AXIS 01 // Y-AXIS</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tl-text-primary)' }}>
                  Synthetic Score
                </h3>
              </div>
            </div>
            <p className="tl-body-sm" style={{ marginBottom: '12px' }}>
              <strong>“How much evidence suggests AI generation or manipulation?”</strong>
            </p>
            <p className="tl-body-sm">
              Scans isolated modalities for digital manipulation: diffusion texture anomalies, generative facial artifacts, vocoder frequency fingerprints, and unnatural corneal reflections.
            </p>
          </CardContent>
        </Card>

        <Card variant="surface" interactive>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--tl-radius-md)',
                  backgroundColor: 'var(--tl-match-subtle)',
                  border: '1px solid var(--tl-match-border)',
                  color: 'var(--tl-match)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Activity size={16} />
              </div>
              <div>
                <span className="tl-label-tech">AXIS 02 // X-AXIS</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tl-text-primary)' }}>
                  Consistency Score
                </h3>
              </div>
            </div>
            <p className="tl-body-sm" style={{ marginBottom: '12px' }}>
              <strong>“How well do the independent evidence sources agree?”</strong>
            </p>
            <p className="tl-body-sm">
              Correlates speech phonemes with 3D facial landmark velocity (SyncNet), aligns ambient acoustics with visual environment, and checks biological temporal continuity across frames.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive 2D Coordinate Space Visualization */}
      <div className="tl-coordinate-container">
        {/* Left: 2D Plane */}
        <div className="tl-plane-wrapper">
          <div className="tl-plane-header">
            <span className="tl-label-tech">
              CONCEPTUAL TRUST SPACE // INTERACTIVE COORDINATES
            </span>
            <span className="tl-meta">CLICK ANY SAMPLE NODE TO INSPECT</span>
          </div>

          <div className="tl-coordinate-plane">
            {/* Quadrant Background Zones */}
            <div className="tl-quadrant top-left">
              <span className="quadrant-tag conflict">
                HIGH SYNTHETIC // LOW CONSISTENCY
                <br />
                <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Deepfake / AI Generation</span>
              </span>
            </div>

            <div className="tl-quadrant top-right">
              <span className="quadrant-tag brand">
                HIGH SYNTHETIC // HIGH CONSISTENCY
                <br />
                <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Advanced Synchronized AI</span>
              </span>
            </div>

            <div className="tl-quadrant bottom-left">
              <span className="quadrant-tag uncertainty">
                LOW SYNTHETIC // LOW CONSISTENCY
                <br />
                <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Out-of-Context Media</span>
              </span>
            </div>

            <div className="tl-quadrant bottom-right">
              <span className="quadrant-tag match">
                LOW SYNTHETIC // HIGH CONSISTENCY
                <br />
                <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Authentic Evidence</span>
              </span>
            </div>

            {/* Axis Center Lines */}
            <div className="tl-axis-line horizontal" />
            <div className="tl-axis-line vertical" />

            {/* Axis Labels */}
            <div className="tl-axis-title y-axis">
              ↑ SYNTHETIC EVIDENCE SCORE (AI GENERATION)
            </div>
            <div className="tl-axis-title x-axis">
              CROSS-MODAL CONSISTENCY (AGREEMENT) →
            </div>

            {/* Plotted Interactive Sample Nodes */}
            {samplePoints.map((pt) => {
              const isSelected = pt.id === selectedPoint;
              return (
                <button
                  key={pt.id}
                  className={`tl-plane-node ${pt.variant} ${isSelected ? 'selected' : ''}`}
                  style={{
                    left: `${pt.x}%`,
                    bottom: `${pt.y}%`,
                  }}
                  onClick={() => setSelectedPoint(pt.id)}
                  aria-label={pt.title}
                >
                  <span className="tl-node-ring" />
                  <span className="tl-node-core" />
                  <span className="tl-node-tooltip">{pt.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Forensic Coordinate Inspector Panel */}
        <div className="tl-coordinate-inspector">
          <div className="tl-inspector-header">
            <span className="tl-label-tech">FORENSIC INSPECTOR // CASE STUDY</span>
            <Badge variant={current.variant} size="sm" dot>
              {current.badgeText}
            </Badge>
          </div>

          <h3 className="tl-inspector-title">{current.title}</h3>
          <p className="tl-inspector-verdict">{current.verdict}</p>

          <Divider variant="hairline" style={{ margin: '14px 0' }} />

          {/* Coordinate Readout */}
          <div className="tl-inspector-metrics">
            <div className="tl-inspector-metric">
              <span className="tl-label-tech">CONSISTENCY (X)</span>
              <span className="value" style={{ color: current.variant === 'match' ? 'var(--tl-match)' : 'var(--tl-text-primary)' }}>
                {current.consistencyScore}
              </span>
            </div>
            <div className="tl-inspector-metric">
              <span className="tl-label-tech">SYNTHETIC (Y)</span>
              <span className="value" style={{ color: current.variant === 'conflict' ? 'var(--tl-conflict)' : 'var(--tl-text-primary)' }}>
                {current.syntheticScore}
              </span>
            </div>
          </div>

          <Divider variant="hairline" style={{ margin: '14px 0' }} />

          {/* Modality Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="tl-inspector-detail">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={12} color="var(--tl-brand)" />
                <span className="tl-label-tech">CROSS-MODAL ANALYSIS</span>
              </div>
              <p className="tl-body-sm" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                {current.audioAnalysis}
              </p>
            </div>

            <div className="tl-inspector-detail">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Fingerprint size={12} color="var(--tl-brand)" />
                <span className="tl-label-tech">GENERATIVE PATTERN DISSECTION</span>
              </div>
              <p className="tl-body-sm" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                {current.videoAnalysis}
              </p>
            </div>
          </div>

          <div className="tl-inspector-footnote">
            <Info size={13} color="var(--tl-text-muted)" />
            <span style={{ fontSize: '0.6875rem', color: 'var(--tl-text-muted)' }}>
              Conceptual demonstration of the TrustLayer two-axis classification logic.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

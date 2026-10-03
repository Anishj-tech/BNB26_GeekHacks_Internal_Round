import { useState } from 'react';
import { Video, Mic, FileText, CheckCircle2, AlertTriangle, HelpCircle, Network } from 'lucide-react';
import { SectionHeader } from '../design-system/components/SectionHeader';
import { Badge } from '../design-system/components/Badge';
import { StatusDot } from '../design-system/components/StatusDot';

export const EvidenceArchitectureSection = () => {
  const [activeEvidenceNode, setActiveEvidenceNode] = useState(0);

  const evidenceNodes = [
    {
      id: 0,
      modality: 'CROSS-MODAL',
      title: 'Phonetic Lip-Sync Alignment',
      state: 'MATCH',
      variant: 'match',
      icon: CheckCircle2,
      summary: 'Correlates acoustic speech phonemes with 3D mouth contour landmark velocity.',
      relationship: 'Audio Stream ⟷ Video Frames 32-140',
      reasoning: 'Lip movement acceleration strictly tracks spoken consonants without temporal lagging or rubbery morphing.',
    },
    {
      id: 1,
      modality: 'VISUAL ARTIFACT',
      title: 'Corneal Specular Reflection',
      state: 'MISMATCH',
      variant: 'conflict',
      icon: AlertTriangle,
      summary: 'Analyzes light source geometry reflected on the eye surface against room lighting.',
      relationship: 'Left Pupil Highlight ⟷ Ambient Light Field',
      reasoning: 'The left eye reflects a rectangular softbox light source while the room environment in the background only contains warm overhead tungsten fixtures.',
    },
    {
      id: 2,
      modality: 'ACOUSTIC',
      title: 'Acoustic Reverberation Match',
      state: 'MATCH',
      variant: 'match',
      icon: CheckCircle2,
      summary: 'Compares audio impulse response with visible physical room dimensions.',
      relationship: 'Microphone Impulse ⟷ 3D Room Volume',
      reasoning: 'Measured room decay time (RT60: 0.38s) agrees with the physical glass-and-drywall conference room dimensions.',
    },
    {
      id: 3,
      modality: 'PHYSIOLOGICAL',
      title: 'Corneal Blink Cadence',
      state: 'UNCERTAIN',
      variant: 'uncertainty',
      icon: HelpCircle,
      summary: 'Measures periodic natural blink rate intervals to detect deepfake blink suppression.',
      relationship: 'Ocular Landmark Timeline',
      reasoning: 'Speaker turns away from the camera for 3.2 seconds, introducing partial occlusion that prevents conclusive blink interval verification.',
    },
  ];

  const current = evidenceNodes[activeEvidenceNode];

  return (
    <section id="evidence-architecture" className="tl-landing-section">
      <SectionHeader
        category="EVIDENCE MODEL // ARCHITECTURE"
        title="Multi-Modal Evidence Relationships"
        description="A conceptual preview of the TrustLayer Evidence Graph. Instead of opaque probabilities, evidence is structured as an inspectable network of cross-modal relationships."
      />

      <div className="tl-evidence-map-container">
        {/* Modality Columns Feed Visual */}
        <div className="tl-evidence-pillars">
          {/* Column 1: Video */}
          <div className="tl-evidence-pillar">
            <div className="tl-pillar-header">
              <Video size={14} color="var(--tl-brand)" />
              <span>VIDEO MODALITY</span>
            </div>
            <div className="tl-pillar-items">
              <div className="tl-pillar-item">
                <span className="name">Facial Landmarks</span>
                <Badge variant="match" size="sm">CONTINUOUS</Badge>
              </div>
              <div className="tl-pillar-item">
                <span className="name">Corneal Specular</span>
                <Badge variant="conflict" size="sm">MISMATCH</Badge>
              </div>
              <div className="tl-pillar-item">
                <span className="name">Temporal Blink Rate</span>
                <Badge variant="uncertainty" size="sm">OCCLUDED</Badge>
              </div>
            </div>
          </div>

          {/* Column 2: Audio */}
          <div className="tl-evidence-pillar">
            <div className="tl-pillar-header">
              <Mic size={14} color="var(--tl-match)" />
              <span>AUDIO MODALITY</span>
            </div>
            <div className="tl-pillar-items">
              <div className="tl-pillar-item">
                <span className="name">Voice Formants</span>
                <Badge variant="match" size="sm">NATURAL</Badge>
              </div>
              <div className="tl-pillar-item">
                <span className="name">Vocoder Harmonics</span>
                <Badge variant="match" size="sm">NO ARTIFACTS</Badge>
              </div>
              <div className="tl-pillar-item">
                <span className="name">Room Reverb (RT60)</span>
                <Badge variant="match" size="sm">MATCH</Badge>
              </div>
            </div>
          </div>

          {/* Column 3: Text */}
          <div className="tl-evidence-pillar">
            <div className="tl-pillar-header">
              <FileText size={14} color="var(--tl-text-primary)" />
              <span>TEXT TRANSCRIPT</span>
            </div>
            <div className="tl-pillar-items">
              <div className="tl-pillar-item">
                <span className="name">Whisper Alignment</span>
                <Badge variant="match" size="sm">±12ms SYNC</Badge>
              </div>
              <div className="tl-pillar-item">
                <span className="name">Semantic Context</span>
                <Badge variant="match" size="sm">COHERENT</Badge>
              </div>
              <div className="tl-pillar-item">
                <span className="name">Utterance Timestamps</span>
                <Badge variant="neutral" size="sm" mono>00:04.22</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Central Evidence Relationship Network Preview */}
        <div className="tl-evidence-network-wrapper">
          <div className="tl-network-canvas">
            <div className="tl-network-title">
              <Network size={14} />
              <span>CROSS-MODAL EVIDENCE RELATIONSHIP MAPPING</span>
            </div>

            {/* Evidence nodes interactive list */}
            <div className="tl-network-nodes-grid">
              {evidenceNodes.map((node) => {
                const isSelected = node.id === activeEvidenceNode;
                return (
                  <div
                    key={node.id}
                    className={`tl-network-node-card ${node.variant} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActiveEvidenceNode(node.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="tl-label-tech" style={{ fontSize: '0.625rem' }}>
                        {node.modality}
                      </span>
                      <Badge variant={node.variant} size="sm" dot>
                        {node.state}
                      </Badge>
                    </div>

                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-text-primary)', margin: '4px 0' }}>
                      {node.title}
                    </h4>

                    <span className="tl-meta" style={{ display: 'block', fontSize: '0.6875rem' }}>
                      {node.relationship}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Detail Readout */}
          <div className="tl-network-detail-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <StatusDot variant={current.variant} pulse />
              <span className="tl-label-tech">EVIDENCE NODE DETAILS</span>
              <Badge variant={current.variant} size="sm">
                {current.state}
              </Badge>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tl-text-primary)', marginBottom: '4px' }}>
              {current.title}
            </h4>
            <p className="tl-body-sm" style={{ marginBottom: '10px' }}>
              {current.summary}
            </p>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '10px 12px',
                borderRadius: 'var(--tl-radius-sm)',
                border: '1px solid var(--tl-border)',
                marginBottom: '8px',
              }}
            >
              <span className="tl-label-tech" style={{ display: 'block', marginBottom: '4px' }}>
                CROSS-MODAL REASONING TRAIL
              </span>
              <p className="tl-body-sm" style={{ fontSize: '0.8125rem', color: 'var(--tl-text-secondary)', margin: 0 }}>
                {current.reasoning}
              </p>
            </div>

            <span className="tl-meta">
              CONNECTED RELATIONSHIP: <strong style={{ color: 'var(--tl-text-primary)' }}>{current.relationship}</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

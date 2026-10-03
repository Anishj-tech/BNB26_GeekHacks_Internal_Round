import { useState, useEffect } from 'react';
import {
  Shield,
  ArrowRight,
  Video,
  Mic,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { StatusDot } from '../design-system/components/StatusDot';

export const HeroSection = ({ onStartInvestigation, onExploreModel }) => {
  const [activeCycle, setActiveCycle] = useState(0);

  // Subtle cyclic telemetry update to give the feel of a live intelligence console
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCycle((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const cycles = [
    {
      label: 'SAMPLE A // DUAL MODALITY MATCH',
      syntheticStatus: '0.12 LOW',
      syntheticVariant: 'match',
      consistencyStatus: '98% ALIGNED',
      consistencyVariant: 'match',
      trustScore: '94% HIGH TRUST',
      trustVariant: 'match',
      note: 'SyncNet confirms micro-phoneme lip velocity matches speech envelope within ±12ms.',
    },
    {
      label: 'SAMPLE B // GENERATIVE MANIPULATION',
      syntheticStatus: '0.89 FLAGGED',
      syntheticVariant: 'conflict',
      consistencyStatus: '24% CONFLICT',
      consistencyVariant: 'conflict',
      trustScore: '18% HIGH RISK',
      trustVariant: 'conflict',
      note: 'Frequency artifacts detected in audio vocoder + temporal eye flicker in frames 42-88.',
    },
    {
      label: 'SAMPLE C // INSUFFICIENT EVIDENCE',
      syntheticStatus: '0.42 AMBIGUOUS',
      syntheticVariant: 'uncertainty',
      consistencyStatus: '62% UNCERTAIN',
      consistencyVariant: 'uncertainty',
      trustScore: '46% INCONCLUSIVE',
      trustVariant: 'uncertainty',
      note: 'Low lighting and severe audio reverberation impede definitive cross-modal lock.',
    },
  ];

  const current = cycles[activeCycle];

  return (
    <section className="tl-hero-section">
      <div className="tl-hero-content">
        {/* Technical Eyebrow */}
        <div className="tl-hero-eyebrow">
          <StatusDot variant="brand" pulse />
          <span className="tl-hero-eyebrow-text">
            MULTI-MODAL DIGITAL FORENSICS PLATFORM
          </span>
          <span style={{ color: 'var(--tl-border)' }}>|</span>
          <span style={{ color: 'var(--tl-text-muted)', fontSize: '0.6875rem', fontFamily: 'var(--tl-font-mono)' }}>
            EVIDENCE FUSION
          </span>
        </div>

        {/* Primary PRD Tagline */}
        <h1 className="tl-hero-title">
          Don’t just detect fake content.
          <br />
          <span className="tl-hero-title-accent">
            Verify whether the evidence can be trusted.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="tl-hero-description">
          Traditional deepfake detectors rely on fragile single-frame classifiers.
          TrustLayer evaluates <strong>video, audio, and transcript</strong> modalities together—separating
          <strong> Synthetic Generation Signals</strong> from <strong>Cross-Modal Consistency</strong> to establish an evidence-backed trust assessment.
        </p>

        {/* Action Buttons */}
        <div className="tl-hero-actions">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onStartInvestigation}
          >
            Start Investigation
          </Button>

          <Button
            variant="secondary"
            size="lg"
            icon={Layers}
            onClick={onExploreModel}
          >
            Explore Trust Model
          </Button>
        </div>

        {/* Quick System Proof Badges */}
        <div className="tl-hero-meta-strip">
          <div className="tl-hero-meta-item">
            <span className="tl-label-tech">INPUT MODALITIES</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <Badge variant="neutral" size="sm">Video</Badge>
              <Badge variant="neutral" size="sm">Audio</Badge>
              <Badge variant="neutral" size="sm">Transcript</Badge>
            </div>
          </div>

          <div className="tl-hero-meta-divider" />

          <div className="tl-hero-meta-item">
            <span className="tl-label-tech">DUAL-AXIS EVALUATION</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <Badge variant="conflict" size="sm">Synthetic Analysis</Badge>
              <Badge variant="match" size="sm">Consistency Analysis</Badge>
            </div>
          </div>

          <div className="tl-hero-meta-divider" />

          <div className="tl-hero-meta-item">
            <span className="tl-label-tech">OUTPUT RESULT</span>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <Badge variant="brand" size="sm">Calibrated Trust Score</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Intelligence Stream Console (Hero Visual) */}
      <div className="tl-hero-visual-wrapper">
        <div className="tl-forensic-console">
          {/* Console Header Bar */}
          <div className="tl-console-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="tl-console-dot red" />
              <div className="tl-console-dot amber" />
              <div className="tl-console-dot teal" />
              <span className="tl-console-title">
                FORENSIC_STREAM // {current.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusDot variant={current.trustVariant} pulse />
              <span className="tl-mono" style={{ fontSize: '0.6875rem', color: 'var(--tl-text-muted)' }}>
                CYCLE {activeCycle + 1}/3
              </span>
            </div>
          </div>

          {/* Console Body: Multi-Modal Flow Map */}
          <div className="tl-console-body">
            {/* Step 1: Modalities */}
            <div className="tl-stream-column">
              <span className="tl-label-tech" style={{ marginBottom: '8px', display: 'block' }}>
                01. RAW MODALITIES
              </span>

              <div className="tl-stream-node">
                <div className="tl-node-icon video">
                  <Video size={14} />
                </div>
                <div className="tl-node-text">
                  <span className="title">Video Stream</span>
                  <span className="detail">Landmarks & Cornea</span>
                </div>
              </div>

              <div className="tl-stream-node">
                <div className="tl-node-icon audio">
                  <Mic size={14} />
                </div>
                <div className="tl-node-text">
                  <span className="title">Audio Stream</span>
                  <span className="detail">Phonemes & Acoustic</span>
                </div>
              </div>

              <div className="tl-stream-node">
                <div className="tl-node-icon text">
                  <FileText size={14} />
                </div>
                <div className="tl-node-text">
                  <span className="title">Transcript</span>
                  <span className="detail">Whisper Timestamps</span>
                </div>
              </div>
            </div>

            {/* Connecting Stream Lines */}
            <div className="tl-stream-connector">
              <div className="tl-connector-line" />
              <div className="tl-connector-tag">EXTRACT</div>
            </div>

            {/* Step 2: Dual Signals */}
            <div className="tl-stream-column">
              <span className="tl-label-tech" style={{ marginBottom: '8px', display: 'block' }}>
                02. DUAL SIGNALS
              </span>

              {/* Synthetic Signal Box */}
              <div className={`tl-eval-box ${current.syntheticVariant}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="box-title">SYNTHETIC ANALYSIS</span>
                  <Badge variant={current.syntheticVariant} size="sm">
                    {current.syntheticStatus}
                  </Badge>
                </div>
                <p className="box-desc">
                  Diffusion traces, vocoder cloning artifacts, eye blinking suppression
                </p>
              </div>

              {/* Consistency Signal Box */}
              <div className={`tl-eval-box ${current.consistencyVariant}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="box-title">CONSISTENCY ANALYSIS</span>
                  <Badge variant={current.consistencyVariant} size="sm">
                    {current.consistencyStatus}
                  </Badge>
                </div>
                <p className="box-desc">
                  SyncNet lip-audio correlation, acoustic room match, temporal continuity
                </p>
              </div>
            </div>

            {/* Connecting Stream Lines */}
            <div className="tl-stream-connector">
              <div className="tl-connector-line" />
              <div className="tl-connector-tag">FUSE</div>
            </div>

            {/* Step 3: Fused Trust Assessment */}
            <div className="tl-stream-column tl-stream-column-result">
              <span className="tl-label-tech" style={{ marginBottom: '8px', display: 'block' }}>
                03. TRUST ASSESSMENT
              </span>

              <div className={`tl-result-card ${current.trustVariant}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={16} />
                  <span className="result-label">TRUST INDEX</span>
                </div>

                <div className="result-score">
                  {current.trustScore}
                </div>

                <div className="result-status">
                  {current.trustVariant === 'match' && (
                    <span style={{ color: 'var(--tl-match)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> VERIFIED COHERENT
                    </span>
                  )}
                  {current.trustVariant === 'conflict' && (
                    <span style={{ color: 'var(--tl-conflict)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={13} /> CRITICAL DISCREPANCY
                    </span>
                  )}
                  {current.trustVariant === 'uncertainty' && (
                    <span style={{ color: 'var(--tl-uncertainty)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <HelpCircle size={13} /> EVIDENCE INCONCLUSIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Console Telemetry Footer */}
          <div className="tl-console-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={13} color="var(--tl-brand)" />
              <span className="tl-mono" style={{ fontSize: '0.75rem', color: 'var(--tl-text-secondary)' }}>
                {current.note}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCycle(idx)}
                  className={`tl-cycle-dot ${idx === activeCycle ? 'active' : ''}`}
                  aria-label={`Inspect Sample ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

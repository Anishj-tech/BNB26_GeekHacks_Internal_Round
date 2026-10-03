import { useState } from 'react';
import { Search, GitCompare, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../design-system/components/SectionHeader';
import { Badge } from '../design-system/components/Badge';

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Analyze Signals',
      icon: Search,
      tag: 'FEATURE EXTRACTION',
      summary: 'Video, audio, and transcript streams are dissected for subtle manipulation signatures.',
      details: [
        'Frame-by-frame analysis checks for diffusion artifacts, boundary warping, and corneal reflection symmetry.',
        'Audio spectrum analysis isolates synthetic vocoder traces, spectral gaps, and neural voice cloning signatures.',
        'Whisper speech-to-text extracts timestamped phoneme boundaries for cross-modal alignment.',
      ],
      metrics: ['24+ Frames Evaluated', '16kHz Audio Spectrogram', 'Whisper-v3 Alignment'],
    },
    {
      num: '02',
      title: 'Compare Evidence',
      icon: GitCompare,
      tag: 'CROSS-MODAL CORRELATION',
      summary: 'Evidence from separate modalities is tested for physical and biological agreement.',
      details: [
        'SyncNet measures mouth shape velocity against acoustic phonemes to detect desynchronized lip-sync.',
        'Acoustic reverberation matching ensures speech audio conforms to the physical room dimensions seen in video.',
        'Biological temporal continuity checks verify natural human blink rates and facial muscle micro-movements.',
      ],
      metrics: ['±15ms Lip-Sync Window', 'Acoustic Room Matching', 'Temporal Blink Cadence'],
    },
    {
      num: '03',
      title: 'Fuse Evidence',
      icon: Layers,
      tag: 'EVIDENCE FUSION ENGINE',
      summary: 'Independent confidence vectors are mathematically synthesized into an evidence graph.',
      details: [
        'Decouples synthetic artifact likelihood from cross-modal consistency to prevent misclassification.',
        'Calibrates sensor uncertainty when media has low resolution, occlusions, or background noise.',
        'Constructs an inspectable evidence chain where every claim links directly to timecoded frames.',
      ],
      metrics: ['Bayesian Evidence Weighting', 'Uncertainty Calibration', 'Graph Node Assembly'],
    },
    {
      num: '04',
      title: 'Assess Trust',
      icon: ShieldCheck,
      tag: 'CALIBRATED TRUST ASSESSMENT',
      summary: 'TrustLayer produces a definitive assessment backed by an auditable evidence chain.',
      details: [
        'Presents the Composite Trust Score alongside independent Synthetic and Consistency breakdowns.',
        'Highlights exact timecodes of detected anomalies rather than giving an opaque binary verdict.',
        'Prepares an actionable forensic summary suitable for fact-checkers, newsrooms, and security analysts.',
      ],
      metrics: ['Dual-Axis Verdict', 'Timecoded Breakdown', 'Audit Trail Export'],
    },
  ];

  return (
    <section id="how-it-works" className="tl-landing-section">
      <SectionHeader
        category="INVESTIGATION PIPELINE // STEP-BY-STEP"
        title="How TrustLayer Evaluates Digital Evidence"
        description="A four-stage forensic pipeline transforming raw multi-modal media into an explainable, calibrated trust assessment."
      />

      <div className="tl-pipeline-container">
        {/* Step Selector Cards */}
        <div className="tl-pipeline-steps">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            return (
              <div
                key={idx}
                className={`tl-pipeline-step-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="tl-pipeline-step-num">{step.num}</span>
                  <div className={`tl-pipeline-step-icon ${isActive ? 'active' : ''}`}>
                    <Icon size={16} />
                  </div>
                </div>

                <h3 className="tl-pipeline-step-title">{step.title}</h3>
                <p className="tl-pipeline-step-summary">{step.summary}</p>

                <div className="tl-pipeline-step-indicator">
                  <div className={`tl-step-bar ${isActive ? 'active' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Active Step Inspector */}
        <div className="tl-pipeline-detail-card">
          <div className="tl-pipeline-detail-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Badge variant="brand" size="sm" mono>
                STAGE {steps[activeStep].num}
              </Badge>
              <span className="tl-label-tech">{steps[activeStep].tag}</span>
            </div>
            <span className="tl-meta">CLICK ANY STAGE ABOVE TO EXPLORE</span>
          </div>

          <h3 className="tl-pipeline-detail-title">
            {steps[activeStep].title} — Forensic Methodology
          </h3>

          <div className="tl-pipeline-detail-list">
            {steps[activeStep].details.map((detail, dIdx) => (
              <div key={dIdx} className="tl-pipeline-detail-item">
                <CheckCircle2 size={16} color="var(--tl-match)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span className="tl-body-sm">{detail}</span>
              </div>
            ))}
          </div>

          <div className="tl-pipeline-metrics-bar">
            <span className="tl-label-tech">ACTIVE TELEMETRY VECTORS:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {steps[activeStep].metrics.map((m, mIdx) => (
                <Badge key={mIdx} variant="neutral" size="sm" mono>
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

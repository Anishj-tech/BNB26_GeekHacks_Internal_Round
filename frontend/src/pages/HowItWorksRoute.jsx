import {
  Layers,
  Activity,
  GitCompare,
  CheckCircle2,
  ArrowRight,
  Lock,
  Search,
} from 'lucide-react';
import { useRouter } from '../router';
import { TrustLayerShell } from '../components/shell/TrustLayerShell';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';

export const HowItWorksRoute = () => {
  const { navigate } = useRouter();

  const pipelineStages = [
    {
      step: '01',
      title: 'Evidence Intake & Cryptographic Sealing',
      summary: 'Raw media containers are validated for stream integrity and assigned an immutable SHA-256 hash.',
      detail: 'TrustLayer ensures zero-tampering during ingestion. Containers are checked for container metadata anomalies and stream format authenticity.',
      icon: Lock,
    },
    {
      step: '02',
      title: 'Multi-Modal Feature Extraction',
      summary: 'High-frequency keyframes and acoustic audio streams are separated for isolated frequency dissection.',
      detail: 'Keyframes are sampled sequentially at native framerate; audio tracks undergo STFT mel-spectrogram conversion across 16kHz forensic bands.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Signal Dissection & Artifact Scanning',
      summary: 'Visual keyframes are scanned for Laplacian edge diffusion warping; audio spectrograms are evaluated for vocoder phase steps.',
      detail: 'Generative models leave micro-textures in frequency domain. TrustLayer quantifies synthetic evidence independently from cross-modal timing.',
      icon: Activity,
    },
    {
      step: '04',
      title: 'Cross-Modal Consistency Correlation',
      summary: 'SyncNet 3D phoneme-viseme correlation measures sub-frame timing offsets between speech audio and mouth apertures.',
      detail: 'Agreement between independent sensors increases confidence. A 140ms desync immediately exposes spliced or cloned speech tracks.',
      icon: GitCompare,
    },
    {
      step: '05',
      title: 'Mathematical Evidence Graph Fusion',
      summary: 'Signals are mapped onto the Two-Axis Trust Space, penalizing conflicts and auditing missing modalities.',
      detail: 'Evidence fusion weighs signal reliability, sensor coverage, and cross-sensor contradiction to establish unambiguous certainty bounds.',
      icon: Layers,
    },
    {
      step: '06',
      title: 'Calibrated Trust Assessment Synthesis',
      summary: 'TrustLayer produces an auditable trust conclusion: TRUSTED, PROBABLY TRUSTED, UNCERTAIN, PROBABLY MANIPULATED, or MANIPULATED.',
      detail: 'The assessment is a forensic trust conclusion derived from evidence—never a vague or fabricated probability percentage.',
      icon: CheckCircle2,
    },
  ];

  return (
    <TrustLayerShell
      title="How TrustLayer Works"
      breadcrumbs={[{ label: 'HOW IT WORKS' }]}
      maxWidth="1140px"
    >
      {/* 1. EDITORIAL HEADER */}
      <div style={{ marginBottom: '48px', maxWidth: '780px' }}>
        <span
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--tl-primary)',
            letterSpacing: '0.08em',
            fontWeight: 600,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          FORENSIC INTELLIGENCE METHODOLOGY
        </span>
        <h1
          style={{
            fontFamily: 'var(--tl-font-display)',
            fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
            fontWeight: 400,
            color: 'var(--tl-ink)',
            lineHeight: 1.12,
            letterSpacing: '-0.025em',
            margin: '0 0 16px',
          }}
        >
          From "Is this fake?" to Evidence Intelligence
        </h1>
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '1.0625rem',
            color: 'var(--tl-body)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          In a world of generative models, asking whether a video "looks fake" yields brittle results.
          TrustLayer evaluates whether the multimedia evidence can be trusted by examining cross-modal physical congruence,
          auditing sensor coverage, and transparently communicating uncertainty.
        </p>
      </div>

      {/* 2. THE 6-STAGE PIPELINE (ALTERNATING CARDS) */}
      <section style={{ marginBottom: '64px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            THE FORENSIC PIPELINE
          </span>
          <h2 style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.75rem', fontWeight: 400, color: 'var(--tl-ink)', margin: '2px 0 0' }}>
            Six Deterministic Verification Milestones
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                style={{
                  backgroundColor: 'var(--tl-surface-card)',
                  border: '1px solid var(--tl-hairline)',
                  borderRadius: 'var(--tl-radius-lg)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--tl-radius-sm)',
                        backgroundColor: 'var(--tl-canvas)',
                        color: 'var(--tl-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--tl-hairline)',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tl-primary)' }}>
                      PHASE {stage.step}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 8px' }}>
                    {stage.title}
                  </h3>

                  <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', color: 'var(--tl-body)', lineHeight: 1.55, margin: '0 0 12px' }}>
                    {stage.summary}
                  </p>
                </div>

                <div
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--tl-hairline)',
                    fontFamily: 'var(--tl-font-sans)',
                    fontSize: '0.75rem',
                    color: 'var(--tl-muted)',
                    lineHeight: 1.45,
                  }}
                >
                  {stage.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRIMARY VS SUPPORTING EVIDENCE DEEP-DIVE */}
      <section
        style={{
          backgroundColor: 'var(--tl-surface-dark)',
          color: 'var(--tl-on-dark)',
          borderRadius: 'var(--tl-radius-xl)',
          padding: '40px',
          marginBottom: '64px',
          border: '1px solid var(--tl-surface-dark-elevated)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--tl-primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          EVIDENCE HIERARCHY MANDATE
        </span>
        <h2
          style={{
            fontFamily: 'var(--tl-font-display)',
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 400,
            color: 'var(--tl-on-dark)',
            margin: '0 0 16px',
          }}
        >
          Primary vs. Supporting Evidence
        </h2>
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.9375rem',
            color: 'var(--tl-on-dark-soft)',
            maxWidth: '720px',
            lineHeight: 1.6,
            margin: '0 0 32px',
          }}
        >
          A common pitfall in commercial deepfake detection is over-relying on facial landmark tracking or biological blink rates.
          TrustLayer maintains strict scientific demarcation:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="tl-evidence-mandate-grid">
          <div
            style={{
              backgroundColor: 'var(--tl-surface-dark-elevated)',
              border: '1px solid rgba(250, 249, 245, 0.08)',
              borderRadius: 'var(--tl-radius-md)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Badge variant="match" size="xs">PRIMARY EVIDENCE</Badge>
            </div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-on-dark)', margin: '0 0 8px' }}>
              Independent Probative Proof
            </h4>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-on-dark-soft)', margin: 0, lineHeight: 1.55 }}>
              Video frame frequency anomalies, vocoder phase discontinuities, and SyncNet lip-voice desynchronization carry independent mathematical proof of manipulation. If SyncNet detects a 140ms desync, audio and video were unequivocally produced separately.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--tl-surface-dark-elevated)',
              border: '1px solid rgba(204, 120, 92, 0.25)',
              borderRadius: 'var(--tl-radius-md)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Badge variant="brand" size="xs">SUPPORTING EVIDENCE</Badge>
            </div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-on-dark)', margin: '0 0 8px' }}>
              Corroboration, Not Standalone Proof
            </h4>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-on-dark-soft)', margin: 0, lineHeight: 1.55 }}>
              Face landmark continuity and biological blink rate cadences serve as supporting corroboration. A deepfake may preserve genuine blink patterns if grafted onto an authentic actor body. TrustLayer visually labels face metrics as supporting evidence.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CALLOUT ACTION */}
      <div
        style={{
          backgroundColor: 'var(--tl-surface-card)',
          border: '1px solid var(--tl-hairline)',
          borderRadius: 'var(--tl-radius-lg)',
          padding: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div>
          <h3 style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--tl-ink)', margin: '0 0 4px' }}>
            Ready to explore our evidence intelligence?
          </h3>
          <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', color: 'var(--tl-body)', margin: 0 }}>
            Inspect our pre-computed forensic cases or stage your own multimedia evidence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/investigations')}
          >
            View Case Archive
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/investigation/new')}
          >
            Start Investigation
          </Button>
        </div>
      </div>
    </TrustLayerShell>
  );
};

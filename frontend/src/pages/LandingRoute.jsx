import { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Video,
  Mic,
  FileText,
  Crosshair,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useRouter } from '../router';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';

export const LandingRoute = () => {
  const { navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);

  const demoArtifacts = [
    {
      id: 'INV-2026-001',
      title: 'Executive Briefing Leak',
      file: 'briefing_leak_h264.mp4',
      verdict: 'MANIPULATED',
      verdictVariant: 'conflict',
      syntheticScore: '0.86',
      syntheticLabel: 'High Synthetic',
      consistencyScore: '0.22',
      consistencyLabel: 'Critical Conflict',
      coverage: 92,
      conflict: 'DETECTED',
      conflictDetail: 'Acoustic onset precedes visual lip closure by 140ms.',
      explanation: 'Generative neural speech synthesis coupled with deepfake face swap manipulation.',
    },
    {
      id: 'INV-2026-002',
      title: 'UN Council Press Address',
      file: 'un_briefing_hq.mp4',
      verdict: 'TRUSTED',
      verdictVariant: 'match',
      syntheticScore: '0.08',
      syntheticLabel: 'Low Synthetic',
      consistencyScore: '0.95',
      consistencyLabel: 'High Consistency',
      coverage: 98,
      conflict: 'NONE',
      conflictDetail: 'All physical signals mutually corroborate within biological bounds.',
      explanation: 'SyncNet confirms lip articulation locks to audio phonemes within ±8ms.',
    },
    {
      id: 'INV-2026-003',
      title: 'Nighttime Alley Surveillance',
      file: 'cam04_alleyway.mp4',
      verdict: 'UNCERTAIN',
      verdictVariant: 'uncertainty',
      syntheticScore: '0.38',
      syntheticLabel: 'Ambiguous Signal',
      consistencyScore: '0.44',
      consistencyLabel: 'Inconclusive',
      coverage: 46,
      conflict: 'MISSING MODALITY',
      conflictDetail: 'Transcript and facial mouth regions obscured by low illumination.',
      explanation: 'Insufficient evidence to declare authenticity. TrustLayer refuses to fabricate certainty.',
    },
  ];

  const currentArtifact = demoArtifacts[selectedDemoIndex];

  return (
    <div style={{ backgroundColor: 'var(--tl-canvas)', color: 'var(--tl-ink)', minHeight: '100vh' }}>
      {/* 1. TOP EDITORIAL NAVIGATION */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          backgroundColor: 'rgba(250, 249, 245, 0.94)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--tl-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          maxWidth: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Original TrustLayer Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--tl-radius-md)',
                backgroundColor: 'var(--tl-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(204, 120, 92, 0.25)',
              }}
            >
              <Shield size={18} strokeWidth={2.2} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-display)',
                  fontSize: '1.375rem',
                  fontWeight: 500,
                  color: 'var(--tl-ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                TrustLayer
              </span>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--tl-primary)',
                  backgroundColor: 'rgba(204, 120, 92, 0.1)',
                  padding: '2px 5px',
                  borderRadius: 'var(--tl-radius-xs)',
                  fontWeight: 600,
                }}
              >
                FORENSIC
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
            className="tl-nav-links-desktop"
          >
            <button
              onClick={() => navigate('/investigations')}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--tl-body)',
                cursor: 'pointer',
                padding: '4px 0',
              }}
              className="tl-nav-link"
            >
              Investigations
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('paradigm-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--tl-body)',
                cursor: 'pointer',
                padding: '4px 0',
              }}
              className="tl-nav-link"
            >
              The Trust Model
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--tl-body)',
                cursor: 'pointer',
                padding: '4px 0',
              }}
              className="tl-nav-link"
            >
              How It Works
            </button>
          </nav>
        </div>

        {/* Right CTA Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="tl-engine-badge-desktop">
            <Badge variant="match" size="sm" dot>
              FORENSIC ENGINE ONLINE
            </Badge>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/investigation/new')}
          >
            Start Investigation
          </Button>

          {/* Mobile hamburger */}
          <button
            className="tl-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--tl-ink)',
              padding: '6px',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            borderBottom: '1px solid var(--tl-hairline)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/investigations');
            }}
            className="tl-btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Investigations Archive
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/investigation/new');
            }}
            className="tl-btn-primary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            + Start Investigation
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/how-it-works');
            }}
            className="tl-btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            How TrustLayer Works
          </button>
        </div>
      )}

      {/* 2. HERO SECTION — 6/6 EDITORIAL COMPOSITION */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '64px 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(320px, 0.9fr)',
          gap: '48px',
          alignItems: 'center',
        }}
        className="tl-hero-grid"
      >
        {/* Left Column: Editorial Headline & Actions */}
        <div>
          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: 'var(--tl-primary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              AI-POWERED DIGITAL AUTHENTICITY & TRUST
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted)',
              }}
            >
              CROSS-MODAL INTELLIGENCE
            </span>
          </div>

          {/* Primary Editorial Headline */}
          <h1
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--tl-ink)',
              margin: '0 0 24px',
            }}
          >
            Don’t just detect fake content.
            <br />
            <span style={{ color: 'var(--tl-primary)', fontStyle: 'italic' }}>
              Verify whether the evidence can be trusted.
            </span>
          </h1>

          {/* Secondary Explanation */}
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '1.0625rem',
              color: 'var(--tl-body)',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: '0 0 32px',
            }}
          >
            TrustLayer analyzes multimedia evidence across visual keyframes, acoustic spectrograms,
            speech transcripts, and cross-modal consistency signals to produce a transparent, calibrated trust assessment.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/investigation/new')}
            >
              Start Investigation
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/how-it-works')}
            >
              How TrustLayer Works
            </Button>
          </div>

          {/* Core Product Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              borderTop: '1px solid var(--tl-hairline)',
              paddingTop: '24px',
            }}
            className="tl-hero-pillars"
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                01 // MODALITY
              </span>
              <strong style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', color: 'var(--tl-ink)' }}>
                Multi-Modal Fusion
              </strong>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                Video, Audio, Text & SyncNet
              </p>
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                02 // ARCHITECTURE
              </span>
              <strong style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', color: 'var(--tl-ink)' }}>
                Two-Axis Trust Space
              </strong>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                Synthetic vs. Consistency
              </p>
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-muted)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                03 // INTEGRITY
              </span>
              <strong style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', color: 'var(--tl-ink)' }}>
                Calibrated Uncertainty
              </strong>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-muted)', margin: '2px 0 0' }}>
                Never fabricates confidence
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Real Forensic Evidence Artifact (Dark Surface) */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--tl-surface-dark)',
              color: 'var(--tl-on-dark)',
              borderRadius: 'var(--tl-radius-xl)',
              border: '1px solid var(--tl-surface-dark-elevated)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28)',
              padding: '28px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Accent Stripe */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: currentArtifact.verdictVariant === 'match' ? 'var(--tl-success)' : currentArtifact.verdictVariant === 'uncertainty' ? 'var(--tl-accent-amber)' : 'var(--tl-error)',
              }}
            />

            {/* Artifact Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--tl-surface-dark-elevated)',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.6875rem',
                    color: 'var(--tl-primary)',
                    letterSpacing: '0.08em',
                  }}
                >
                  INVESTIGATION
                </span>
                <span style={{ color: 'var(--tl-surface-dark-elevated)' }}>/</span>
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--tl-on-dark)',
                  }}
                >
                  {currentArtifact.id}
                </span>
              </div>

              {/* Case Preset Selector */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {demoArtifacts.map((d, idx) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDemoIndex(idx)}
                    style={{
                      background: idx === selectedDemoIndex ? 'var(--tl-primary)' : 'var(--tl-surface-dark-elevated)',
                      color: idx === selectedDemoIndex ? '#ffffff' : 'var(--tl-on-dark-soft)',
                      border: 'none',
                      borderRadius: 'var(--tl-radius-xs)',
                      fontFamily: 'var(--tl-font-mono)',
                      fontSize: '0.625rem',
                      padding: '3px 7px',
                      cursor: 'pointer',
                    }}
                    title={d.title}
                  >
                    CASE 0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence Metadata & Subject */}
            <div style={{ marginBottom: '18px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: 'var(--tl-on-dark)',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                {currentArtifact.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--tl-on-dark-soft)',
                }}
              >
                {currentArtifact.file} • SHA-256 SEAL VERIFIED
              </span>
            </div>

            {/* Primary Trust Assessment Banner */}
            <div
              style={{
                backgroundColor: 'var(--tl-surface-dark-elevated)',
                border: '1px solid rgba(250, 249, 245, 0.08)',
                borderRadius: 'var(--tl-radius-md)',
                padding: '16px',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', letterSpacing: '0.06em' }}>
                  TRUST CONCLUSION
                </span>
                <Badge variant={currentArtifact.verdictVariant} size="xs" dot>
                  {currentArtifact.verdict}
                </Badge>
              </div>

              <p
                style={{
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.8125rem',
                  color: 'var(--tl-on-dark)',
                  margin: 0,
                  lineHeight: 1.45,
                }}
              >
                {currentArtifact.explanation}
              </p>
            </div>

            {/* Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              {/* Coverage */}
              <div
                style={{
                  backgroundColor: 'var(--tl-surface-dark-soft)',
                  padding: '12px',
                  borderRadius: 'var(--tl-radius-sm)',
                  border: '1px solid rgba(250, 249, 245, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)' }}>
                    EVIDENCE COVERAGE
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
                    {currentArtifact.coverage}%
                  </span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'rgba(250, 249, 245, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${currentArtifact.coverage}%`, backgroundColor: 'var(--tl-accent-teal)' }} />
                </div>
              </div>

              {/* Conflict */}
              <div
                style={{
                  backgroundColor: 'var(--tl-surface-dark-soft)',
                  padding: '12px',
                  borderRadius: 'var(--tl-radius-sm)',
                  border: '1px solid rgba(250, 249, 245, 0.04)',
                }}
              >
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)', display: 'block', marginBottom: '2px' }}>
                  CROSS-MODAL CONFLICT
                </span>
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: currentArtifact.conflict === 'DETECTED' ? 'var(--tl-error)' : currentArtifact.conflict === 'NONE' ? 'var(--tl-success)' : 'var(--tl-accent-amber)',
                  }}
                >
                  {currentArtifact.conflict}
                </span>
              </div>

              {/* Synthetic Signal */}
              <div
                style={{
                  backgroundColor: 'var(--tl-surface-dark-soft)',
                  padding: '12px',
                  borderRadius: 'var(--tl-radius-sm)',
                  border: '1px solid rgba(250, 249, 245, 0.04)',
                }}
              >
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)', display: 'block', marginBottom: '2px' }}>
                  SYNTHETIC EVIDENCE
                </span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
                  {currentArtifact.syntheticScore}
                </span>
                <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', display: 'block', marginTop: '2px' }}>
                  {currentArtifact.syntheticLabel}
                </span>
              </div>

              {/* Consistency Signal */}
              <div
                style={{
                  backgroundColor: 'var(--tl-surface-dark-soft)',
                  padding: '12px',
                  borderRadius: 'var(--tl-radius-sm)',
                  border: '1px solid rgba(250, 249, 245, 0.04)',
                }}
              >
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-on-dark-soft)', display: 'block', marginBottom: '2px' }}>
                  CONSISTENCY SIGNAL
                </span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
                  {currentArtifact.consistencyScore}
                </span>
                <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', display: 'block', marginTop: '2px' }}>
                  {currentArtifact.consistencyLabel}
                </span>
              </div>
            </div>

            {/* Bottom Inspect Link */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--tl-surface-dark-elevated)' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
                Live Workspace Demonstration
              </span>
              <button
                onClick={() => navigate(`/investigation/${currentArtifact.id}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--tl-primary)',
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <span>Inspect Full Case</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE CORE PARADIGM SHIFT (SECTION) */}
      <section
        id="paradigm-section"
        style={{
          backgroundColor: 'var(--tl-surface-soft)',
          borderTop: '1px solid var(--tl-hairline)',
          borderBottom: '1px solid var(--tl-hairline)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
              PARADIGM INVERSION
            </span>
            <h2
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              Why "Is this file fake?" is the wrong question
            </h2>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '1rem',
                color: 'var(--tl-body)',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              In high-stakes forensic intelligence, media files are rarely 100% genuine or 100% synthetic.
              Selective dubbing, audio splicing, face swapping, compression noise, and out-of-context framing demand evidence verification.
            </p>
          </div>

          {/* Comparison Cards: Other Tools vs TrustLayer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}
            className="tl-comparison-grid"
          >
            {/* Left: Other Tools */}
            <div
              style={{
                backgroundColor: 'var(--tl-canvas)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-lg)',
                padding: '32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--tl-muted)' }} />
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)', letterSpacing: '0.06em' }}>
                  CONVENTIONAL TOOLS
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--tl-font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  color: 'var(--tl-ink)',
                  margin: '0 0 16px',
                }}
              >
                "Is this file fake?"
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--tl-body)' }}>
                  <X size={16} color="var(--tl-error)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Single-Classifier Fragility:</strong> Conflates WhatsApp/YouTube compression artifacts with generative deepfakes.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--tl-body)' }}>
                  <X size={16} color="var(--tl-error)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Opaque Probability Scores:</strong> Returns "87% Fake" without disclosing which modality triggered the alarm.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--tl-body)' }}>
                  <X size={16} color="var(--tl-error)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Fabricates Certainty:</strong> Returns authoritative answers on degraded or incomplete footage rather than flagging insufficient evidence.</span>
                </li>
              </ul>
            </div>

            {/* Right: TrustLayer */}
            <div
              style={{
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-primary)',
                borderRadius: 'var(--tl-radius-lg)',
                padding: '32px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                }}
              >
                <Badge variant="brand" size="xs">TRUSTLAYER CORE</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--tl-primary)' }} />
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.06em' }}>
                  EVIDENCE-BACKED FORENSICS
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--tl-font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  color: 'var(--tl-ink)',
                  margin: '0 0 16px',
                }}
              >
                "Can this evidence be trusted?"
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--tl-body)' }}>
                  <CheckCircle2 size={16} color="var(--tl-success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Multi-Modal Cross-Correlation:</strong> Checks whether speech phonemes match mouth muscle aperture and scene acoustics.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--tl-body)' }}>
                  <CheckCircle2 size={16} color="var(--tl-success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Decoupled Two-Axis Space:</strong> Evaluates Synthetic Artifacts separately from Cross-Modal Consistency.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: 'var(--tl-body)' }}>
                  <CheckCircle2 size={16} color="var(--tl-success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Honest Uncertainty Bounds:</strong> Explicitly audits missing modalities; refuses to declare authenticity without coverage.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE TWO-AXIS TRUST MODEL EXPLAINED */}
      <section style={{ maxWidth: '1120px', margin: '0 auto', padding: '88px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
            THE TWO-AXIS TRUST MODEL
          </span>
          <h2
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: '0 0 12px',
            }}
          >
            Decoupling Artifacts from Consistency
          </h2>
          <p
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '1rem',
              color: 'var(--tl-body)',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.55,
            }}
          >
            TrustLayer maps evidence onto two orthogonal dimensions to prevent erroneous verdicts.
          </p>
        </div>

        {/* 4 Quadrants Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={20} color="var(--tl-success)" />
              <Badge variant="match" size="xs">QUADRANT I</Badge>
            </div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 8px' }}>
              Authentic Baseline
            </h4>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-success)', display: 'block', marginBottom: '8px' }}>
              Low Synthetic • High Consistency
            </span>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
              All sensory streams corroborate. Sound matches visual mouth velocity, room reverberation matches physical geometry, and no generative traces exist.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldAlert size={20} color="var(--tl-error)" />
              <Badge variant="conflict" size="xs">QUADRANT II</Badge>
            </div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 8px' }}>
              AI Manipulation
            </h4>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-error)', display: 'block', marginBottom: '8px' }}>
              High Synthetic • Low Consistency
            </span>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
              Generative diffusion boundaries detected in visual keyframes alongside severe desynchronization between speech audio and mouth apertures.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <HelpCircle size={20} color="var(--tl-accent-amber)" />
              <Badge variant="uncertainty" size="xs">QUADRANT III</Badge>
            </div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 8px' }}>
              Uncertain Zone
            </h4>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-accent-amber)', display: 'block', marginBottom: '8px' }}>
              Low Coverage • Ambiguous Signals
            </span>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
              Heavy sensor noise, low framerate, or missing audio streams prevent conclusive verification. TrustLayer outputs UNCERTAIN rather than fabricating a score.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--tl-surface-card)',
              border: '1px solid var(--tl-hairline)',
              borderRadius: 'var(--tl-radius-lg)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={20} color="var(--tl-warning)" />
              <Badge variant="conflict" size="xs">QUADRANT IV</Badge>
            </div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 8px' }}>
              Divergent Streams
            </h4>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-warning)', display: 'block', marginBottom: '8px' }}>
              Selective Audio Re-Voicing
            </span>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
              Genuine video frames paired with spliced or cloned audio track. Visually pristine, but cross-modal physics break down under phoneme alignment.
            </p>
          </div>
        </div>
      </section>

      {/* 5. 5 MODALITIES SECTION (PRIMARY VS SUPPORTING) */}
      <section
        style={{
          backgroundColor: 'var(--tl-surface-soft)',
          borderTop: '1px solid var(--tl-hairline)',
          borderBottom: '1px solid var(--tl-hairline)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
              MULTI-MODAL EVIDENCE INTAKE
            </span>
            <h2
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: '0 0 12px',
              }}
            >
              Five Independent Forensic Streams
            </h2>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '1rem',
                color: 'var(--tl-body)',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.55,
              }}
            >
              TrustLayer strictly separates Primary Evidence from Supporting Evidence.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {/* 1. Video */}
            <div style={{ backgroundColor: 'var(--tl-canvas)', border: '1px solid var(--tl-hairline)', borderRadius: 'var(--tl-radius-md)', padding: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--tl-radius-sm)', backgroundColor: 'var(--tl-surface-card)', color: 'var(--tl-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Video size={16} />
              </div>
              <Badge variant="neutral" size="xs">PRIMARY</Badge>
              <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '8px 0 4px' }}>
                Video Keyframes
              </h4>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
                Diffusion boundary warping, Laplacian noise floor, and corneal specular reflection coherence.
              </p>
            </div>

            {/* 2. Audio */}
            <div style={{ backgroundColor: 'var(--tl-canvas)', border: '1px solid var(--tl-hairline)', borderRadius: 'var(--tl-radius-md)', padding: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--tl-radius-sm)', backgroundColor: 'var(--tl-surface-card)', color: 'var(--tl-accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Mic size={16} />
              </div>
              <Badge variant="neutral" size="xs">PRIMARY</Badge>
              <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '8px 0 4px' }}>
                Audio Spectrum
              </h4>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
                Bispectral vocoder harmonics, neural speech cloning artifacts, and high-frequency phase cuts.
              </p>
            </div>

            {/* 3. Transcript */}
            <div style={{ backgroundColor: 'var(--tl-canvas)', border: '1px solid var(--tl-hairline)', borderRadius: 'var(--tl-radius-md)', padding: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--tl-radius-sm)', backgroundColor: 'var(--tl-surface-card)', color: 'var(--tl-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <FileText size={16} />
              </div>
              <Badge variant="neutral" size="xs">PRIMARY</Badge>
              <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '8px 0 4px' }}>
                Speech Transcript
              </h4>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
                Whisper-v3 phoneme alignment verifying verbatim accuracy against audio cadence without splicing.
              </p>
            </div>

            {/* 4. Cross-Modal */}
            <div style={{ backgroundColor: 'var(--tl-canvas)', border: '1px solid var(--tl-hairline)', borderRadius: 'var(--tl-radius-md)', padding: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--tl-radius-sm)', backgroundColor: 'var(--tl-surface-card)', color: 'var(--tl-accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Crosshair size={16} />
              </div>
              <Badge variant="neutral" size="xs">PRIMARY</Badge>
              <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '8px 0 4px' }}>
                Lip-Sync Correlation
              </h4>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
                SyncNet 3D phoneme-viseme correlation measuring sub-frame timing offsets between audio and mouth.
              </p>
            </div>

            {/* 5. Face (Supporting) */}
            <div style={{ backgroundColor: 'var(--tl-canvas)', border: '1px dashed var(--tl-primary)', borderRadius: 'var(--tl-radius-md)', padding: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--tl-radius-sm)', backgroundColor: 'rgba(204, 120, 92, 0.12)', color: 'var(--tl-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <UserCheck size={16} />
              </div>
              <Badge variant="brand" size="xs">SUPPORTING EVIDENCE</Badge>
              <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '8px 0 4px' }}>
                Face Consistency
              </h4>
              <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
                Biological blink rates and landmark tracking. Labeled as supporting corroboration, never independent proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALLOUT CARD (CORAL SURFACE ACCENT MOMENT) */}
      <section style={{ maxWidth: '1120px', margin: '80px auto', padding: '0 24px' }}>
        <div
          style={{
            backgroundColor: 'var(--tl-primary)',
            color: '#ffffff',
            borderRadius: 'var(--tl-radius-lg)',
            padding: '56px 48px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            boxShadow: '0 8px 24px rgba(204, 120, 92, 0.3)',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.85)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              READY TO DISSECT MULTIMEDIA EVIDENCE?
            </span>
            <h2
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                margin: '0 0 12px',
              }}
            >
              Start an evidence investigation in seconds.
            </h2>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.9375rem',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Upload video footage, isolate secondary audio tracks, or provide transcripts.
              TrustLayer runs comprehensive cross-modal forensic checks with zero third-party data retention.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/investigation/new')}
            style={{
              backgroundColor: 'var(--tl-canvas)',
              color: 'var(--tl-ink)',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Launch Investigation Suite
          </Button>
        </div>
      </section>

      {/* 7. REFINED EDITORIAL FOOTER (DARK SURFACE) */}
      <footer
        style={{
          backgroundColor: 'var(--tl-surface-dark)',
          color: 'var(--tl-on-dark-soft)',
          borderTop: '1px solid var(--tl-surface-dark-elevated)',
          padding: '64px 24px 48px',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.4fr) repeat(3, minmax(140px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
          className="tl-footer-grid"
        >
          {/* Col 1: Brand & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--tl-radius-sm)',
                  backgroundColor: 'var(--tl-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={16} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--tl-font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  color: 'var(--tl-on-dark)',
                  letterSpacing: '-0.02em',
                }}
              >
                TrustLayer
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-on-dark-soft)',
                lineHeight: 1.6,
                maxWidth: '320px',
                margin: '0 0 16px',
              }}
            >
              Digital authenticity & trust assessment platform.
              Evaluating cross-modal evidence to verify whether media can be trusted.
            </p>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-primary)',
              }}
            >
              TRUST CONCLUSION DERIVED FROM EVIDENCE
            </span>
          </div>

          {/* Col 2: Workspace Routes */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-on-dark)',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              INVESTIGATION SUITE
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <li>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/investigations')}>Investigations Archive</span>
              </li>
              <li>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/investigation/new')}>New Investigation Setup</span>
              </li>
              <li>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/investigation/INV-2026-001')}>Sample: Manipulated Case</span>
              </li>
              <li>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/investigation/INV-2026-002')}>Sample: Authentic Baseline</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Forensic Modalities */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-on-dark)',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              MODALITIES
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <li>Visual Keyframe Warping</li>
              <li>Acoustic Vocoder Harmonics</li>
              <li>Phonetic Speech Alignment</li>
              <li>SyncNet Lip-Voice Timing</li>
              <li>Facial Landmark Support</li>
            </ul>
          </div>

          {/* Col 4: Platform & Methodology */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-on-dark)',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '16px',
              }}
            >
              METHODOLOGY
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem' }}>
              <li>
                <span style={{ cursor: 'pointer' }} onClick={() => navigate('/how-it-works')}>How TrustLayer Works</span>
              </li>
              <li>Two-Axis Trust Space</li>
              <li>Chain of Custody Seals</li>
              <li>Calibrated Uncertainty</li>
            </ul>
          </div>
        </div>

        {/* Bottom Baseline Bar */}
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            paddingTop: '24px',
            borderTop: '1px solid var(--tl-surface-dark-elevated)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.75rem',
            fontFamily: 'var(--tl-font-mono)',
          }}
        >
          <span>TRUSTLAYER FORENSIC INTELLIGENCE // 2026</span>
          <span>CALIBRATED TRUST MODEL • NO PROBABILISTIC FABRICATIONS</span>
        </div>
      </footer>
    </div>
  );
};

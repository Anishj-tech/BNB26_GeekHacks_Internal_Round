import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Film,
  Eye,
} from 'lucide-react';
import { useRouter } from '../router';
import { TrustLayerShell } from '../components/shell/TrustLayerShell';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Timeline } from '../components/forensic/Timeline';
import { SuspiciousTimeline } from '../components/forensic/SuspiciousTimeline';
import { EvidenceDetailDrawer } from '../components/forensic/EvidenceDetailDrawer';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { investigationService } from '../services/investigationService';

export const TimelineRoute = () => {
  const { route, navigate } = useRouter();
  const caseId = route.params?.id || 'INV-2026-001';

  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);
  const [selectedRegionDrawer, setSelectedRegionDrawer] = useState(null);

  useEffect(() => {
    let isMounted = true;

    investigationService
      .getInvestigation(caseId)
      .then((inv) => {
        if (isMounted) {
          setInvestigation(inv);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load timeline');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  if (loading) {
    return (
      <TrustLayerShell title="Loading Forensic Timeline..." activeInvestigationId={caseId}>
        <LoadingState message={`Reconstructing temporal custody sequence for ${caseId}...`} />
      </TrustLayerShell>
    );
  }

  if (error || !investigation) {
    return (
      <TrustLayerShell title="Timeline Not Found" activeInvestigationId={caseId}>
        <ErrorState
          title="Timeline Sequence Missing"
          message={`Could not load timeline sequence for ${caseId}.`}
          actionLabel="Back to Investigation"
          onAction={() => navigate(`/investigation/${caseId}`)}
        />
      </TrustLayerShell>
    );
  }

  const videoAnalysis = investigation.videoAnalysis || {};
  const suspiciousIntervals = videoAnalysis.suspiciousIntervals || [];
  const representativeFrames = videoAnalysis.representativeFrames || [];
  const activeFrame = representativeFrames[selectedFrameIdx] || representativeFrames[0];

  return (
    <TrustLayerShell
      title={`Timeline & Scrubber // ${investigation.name}`}
      activeInvestigationId={investigation.id}
      breadcrumbs={[
        { label: 'INVESTIGATIONS', path: '/investigations' },
        { label: investigation.id, path: `/investigation/${investigation.id}` },
        { label: 'TIMELINE' },
      ]}
      maxWidth="1160px"
    >
      {/* 1. TOP HEADER */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(`/investigation/${investigation.id}`)}
          >
            Dashboard
          </Button>
          <span style={{ color: 'var(--tl-hairline)' }}>/</span>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', fontWeight: 600 }}>
            TEMPORAL INTEGRITY & SCRUBBER
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--tl-font-display)',
            fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
            fontWeight: 400,
            color: 'var(--tl-ink)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            margin: '0 0 8px',
          }}
        >
          Temporal Forensics & Suspicious Regions
        </h1>
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.9375rem',
            color: 'var(--tl-body)',
            maxWidth: '740px',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Inspect timestamped interval segments, representative frame anomalies, and the auditable chain of custody
          logged throughout the forensic computation pipeline.
        </p>
      </div>

      {/* 2. SUSPICIOUS TIMELINE (PHASE 5.2) */}
      <SuspiciousTimeline
        duration={investigation.duration}
        suspiciousIntervals={suspiciousIntervals}
        representativeFrames={representativeFrames}
        onSelectRegion={(item) => setSelectedRegionDrawer(item)}
      />

      {/* 3. TEMPORAL INTERVAL SCRUBBER (DARK PRODUCT SURFACE) */}
      <section
        style={{
          backgroundColor: 'var(--tl-surface-dark)',
          color: 'var(--tl-on-dark)',
          borderRadius: 'var(--tl-radius-lg)',
          border: '1px solid var(--tl-surface-dark-elevated)',
          padding: '28px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={18} color="var(--tl-primary)" />
            <h3 style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.375rem', fontWeight: 400, color: 'var(--tl-on-dark)', margin: 0 }}>
              Video Stream Interval Map
            </h3>
          </div>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)' }}>
            Duration: {investigation.duration} • {videoAnalysis.framesAnalyzed || 0} Frames Analyzed
          </span>
        </div>

        <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-on-dark-soft)', margin: '0 0 20px', lineHeight: 1.5 }}>
          Regions marked in coral exhibit cross-modal desynchronization, diffusion warping, or acoustic formants divergence.
          Normal intervals conform to authentic baseline parameters.
        </p>

        {/* Visual Interval Timeline Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              height: '36px',
              backgroundColor: 'var(--tl-surface-dark-soft)',
              borderRadius: 'var(--tl-radius-sm)',
              border: '1px solid rgba(250, 249, 245, 0.1)',
              display: 'flex',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {suspiciousIntervals.map((interval, idx) => {
              const isSuspicious = interval.status === 'SUSPICIOUS';
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    backgroundColor: isSuspicious ? 'rgba(198, 69, 69, 0.45)' : 'rgba(93, 184, 114, 0.25)',
                    borderRight: idx < suspiciousIntervals.length - 1 ? '2px solid var(--tl-surface-dark)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 8px',
                    position: 'relative',
                  }}
                  title={`${interval.start} - ${interval.end} (${interval.label})`}
                >
                  <span
                    style={{
                      fontFamily: 'var(--tl-font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: isSuspicious ? 'var(--tl-error)' : 'var(--tl-success)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {interval.start} — {interval.end} : {interval.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
            <span>00:00</span>
            <span>{investigation.duration}</span>
          </div>
        </div>

        {/* Interval Cards List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {suspiciousIntervals.map((inv, idx) => {
            const isSuspicious = inv.status === 'SUSPICIOUS';
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--tl-surface-dark-elevated)',
                  border: `1px solid ${isSuspicious ? 'rgba(198, 69, 69, 0.3)' : 'rgba(250, 249, 245, 0.08)'}`,
                  borderRadius: 'var(--tl-radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tl-on-dark)', display: 'block' }}>
                    {inv.start} — {inv.end}
                  </span>
                  <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)' }}>
                    {inv.label}
                  </span>
                </div>
                <Badge variant={isSuspicious ? 'conflict' : 'match'} size="xs">
                  {inv.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. KEYFRAME EVIDENCE INSPECTOR */}
      {representativeFrames.length > 0 && (
        <section
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-lg)',
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                SPATIAL ANOMALY ISOLATION
              </span>
              <h3 style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.375rem', fontWeight: 400, color: 'var(--tl-ink)', margin: '2px 0 0' }}>
                Representative Keyframe Findings
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {representativeFrames.map((fr, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFrameIdx(idx)}
                  style={{
                    background: idx === selectedFrameIdx ? 'var(--tl-primary)' : 'var(--tl-canvas)',
                    color: idx === selectedFrameIdx ? '#ffffff' : 'var(--tl-ink)',
                    border: `1px solid ${idx === selectedFrameIdx ? 'var(--tl-primary)' : 'var(--tl-hairline)'}`,
                    borderRadius: 'var(--tl-radius-xs)',
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.6875rem',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Frame #{fr.frameNumber}
                </button>
              ))}
            </div>
          </div>

          {activeFrame && (
            <div
              style={{
                backgroundColor: 'var(--tl-canvas)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 0.8fr) minmax(280px, 1.2fr)',
                gap: '24px',
                alignItems: 'center',
              }}
              className="tl-frame-finding-grid"
            >
              {/* Mock Frame Visual */}
              <div
                style={{
                  height: '160px',
                  backgroundColor: 'var(--tl-surface-dark)',
                  borderRadius: 'var(--tl-radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid var(--tl-surface-dark-elevated)',
                  overflow: 'hidden',
                }}
              >
                <Eye size={28} color="var(--tl-primary)" />
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)', marginTop: '8px' }}>
                  KEYFRAME RASTER #{activeFrame.frameNumber}
                </span>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.625rem',
                    color: 'var(--tl-primary)',
                    backgroundColor: 'rgba(20, 20, 19, 0.85)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                  }}
                >
                  {activeFrame.timestamp}
                </div>
              </div>

              {/* Finding Text */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Badge variant="brand" size="xs">
                    {activeFrame.label}
                  </Badge>
                  <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                    Confidence: {activeFrame.confidence}
                  </span>
                </div>
                <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 6px' }}>
                  {activeFrame.finding}
                </h4>
                <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
                  Extracted via Laplacian edge gradient analysis and cross-referenced with corneal lighting vector field.
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. AUDITABLE PIPELINE TIMELINE COMPONENT */}
      <Timeline timelineEvents={investigation.timeline || []} />

      {/* REUSABLE EVIDENCE DETAIL DRAWER */}
      <EvidenceDetailDrawer
        isOpen={Boolean(selectedRegionDrawer)}
        evidence={selectedRegionDrawer}
        onClose={() => setSelectedRegionDrawer(null)}
      />
    </TrustLayerShell>
  );
};

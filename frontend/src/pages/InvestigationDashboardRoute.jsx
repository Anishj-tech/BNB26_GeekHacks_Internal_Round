import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronDown,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from '../router';
import { TrustLayerShell } from '../components/shell/TrustLayerShell';
import { Badge } from '../design-system/components/Badge';
import { Button } from '../design-system/components/Button';
import { TrustAssessment } from '../components/forensic/TrustAssessment';
import { TrustAxes } from '../components/forensic/TrustAxes';
import { SyntheticSignalsPanel } from '../components/forensic/SyntheticSignalsPanel';
import { ConsistencyPanel } from '../components/forensic/ConsistencyPanel';
import { AssessmentExplanation } from '../components/forensic/AssessmentExplanation';
import { EvidenceDetailDrawer } from '../components/forensic/EvidenceDetailDrawer';
import { EvidenceCoverage } from '../components/forensic/EvidenceCoverage';
import { ConflictPanel } from '../components/forensic/ConflictPanel';
import { VideoEvidence } from '../components/forensic/VideoEvidence';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { investigationService } from '../services/investigationService';

export const InvestigationDashboardRoute = () => {
  const { route, navigate } = useRouter();
  const caseId = route.params?.id || 'INV-2026-001';

  const [investigation, setInvestigation] = useState(null);
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvidenceDrawer, setSelectedEvidenceDrawer] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      investigationService.getInvestigation(caseId),
      investigationService.listInvestigations(),
    ])
      .then(([currentInv, list]) => {
        if (isMounted) {
          setInvestigation(currentInv);
          setAllCases(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load investigation');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  if (loading) {
    return (
      <TrustLayerShell title="Loading Investigation..." activeInvestigationId={caseId}>
        <LoadingState message={`Accessing forensic evidence vault for ${caseId}...`} />
      </TrustLayerShell>
    );
  }

  if (error || !investigation) {
    return (
      <TrustLayerShell title="Investigation Not Found" activeInvestigationId={caseId}>
        <ErrorState
          title="Case Dossier Unavailable"
          message={`Could not retrieve investigation record ${caseId}.`}
          actionLabel="Return to Investigations"
          onAction={() => navigate('/investigations')}
        />
      </TrustLayerShell>
    );
  }

  return (
    <TrustLayerShell
      title={investigation.name}
      activeInvestigationId={investigation.id}
      breadcrumbs={[
        { label: 'INVESTIGATIONS', path: '/investigations' },
        { label: investigation.id },
      ]}
      maxWidth="1200px"
    >
      {/* PHASE 4 HEADER PROGRESS BAR */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'var(--tl-surface-card)',
          border: '1px solid var(--tl-hairline)',
          borderRadius: 'var(--tl-radius-md)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--tl-primary)', letterSpacing: '0.08em' }}>
            TRUSTLAYER FORENSICS
          </span>
          <span style={{ color: 'var(--tl-hairline)' }}>•</span>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-body)' }}>
            INVESTIGATION / RESULTS
          </span>
          <span style={{ color: 'var(--tl-hairline)' }}>•</span>
          <Badge variant="match" size="xs">ANALYSIS COMPLETED</Badge>
        </div>

        {/* Progress: 01 Upload ✓  02 Analyze ✓  03 Results ● */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--tl-font-mono)', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--tl-success)' }}>
            <span>01 Upload</span>
            <CheckCircle2 size={13} />
          </div>
          <span style={{ color: 'var(--tl-hairline)' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--tl-success)' }}>
            <span>02 Analyze</span>
            <CheckCircle2 size={13} />
          </div>
          <span style={{ color: 'var(--tl-hairline)' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--tl-primary)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--tl-primary)' }} />
            <span>03 Results</span>
          </div>
        </div>
      </div>

      {/* 1. TOP CASE CONTEXT & QUICK SWITCHER */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--tl-hairline)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-primary)',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              CASE DOSSIER // {investigation.id}
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              {new Date(investigation.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            {investigation.isDemo && (
              <Badge variant="neutral" size="xs">DEMO CASE</Badge>
            )}
          </div>

          <h1
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {investigation.name}
          </h1>

          {/* Metadata String */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '0.8125rem' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-body)' }}>
              File: <strong>{investigation.filename}</strong>
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-muted)' }}>
              {investigation.duration} ({investigation.resolution} @ {investigation.fps}fps)
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-muted)' }}>
              Size: {investigation.fileSize}
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted-soft)',
              }}
              title={investigation.sha256}
            >
              SHA-256: {investigation.sha256.substring(0, 12)}…
            </span>
          </div>
        </div>

        {/* Action Controls & Case Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {/* Quick Case Switcher */}
          <div style={{ position: 'relative' }}>
            <select
              value={investigation.id}
              onChange={(e) => navigate(`/investigation/${e.target.value}`)}
              style={{
                height: '38px',
                padding: '0 32px 0 12px',
                backgroundColor: 'var(--tl-surface-card)',
                color: 'var(--tl-ink)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                outline: 'none',
              }}
            >
              {allCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}: {c.assessment.verdict} — {c.name.substring(0, 24)}…
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              color="var(--tl-muted)"
              style={{ position: 'absolute', right: '10px', top: '12px', pointerEvents: 'none' }}
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/investigation/new')}
          >
            New Investigation
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
          >
            Re-run Analysis
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/investigation/${investigation.id}/evidence`)}
          >
            Evidence ({investigation.evidenceList?.length || 0})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/investigation/${investigation.id}/timeline`)}
          >
            Timeline
          </Button>
        </div>
      </div>

      {/* 2. PRIMARY ASSESSMENT PANEL (DARK PRODUCT SURFACE) */}
      <TrustAssessment assessment={investigation.assessment} />

      {/* 3. TWO-AXIS TRUST MODEL (SYNTHETIC VS. CONSISTENCY) */}
      <TrustAxes
        syntheticScore={investigation.twoAxis?.synthetic ?? investigation.assessment.syntheticScore}
        consistencyScore={investigation.twoAxis?.consistency ?? investigation.assessment.consistencyScore}
        quadrant={investigation.twoAxis?.quadrant}
      />

      {/* 4. ASSESSMENT EXPLANATION & EXPLICIT UNCERTAINTY (PHASE 6.1 & 6.3) */}
      <AssessmentExplanation
        investigation={investigation}
        onOpenEvidenceDetail={(item) => setSelectedEvidenceDrawer(item)}
      />

      {/* 5. SYNTHETIC SIGNALS PANEL (DEDICATED SECTION) */}
      <SyntheticSignalsPanel
        syntheticScore={investigation.assessment.syntheticScore}
        syntheticLabel={investigation.assessment.syntheticLabel}
        evidenceList={investigation.evidenceList}
        videoAnalysis={investigation.videoAnalysis}
        onOpenEvidenceDetail={(item) => setSelectedEvidenceDrawer(item)}
      />

      {/* 5. CROSS-MODAL CONSISTENCY PANEL */}
      <ConsistencyPanel consistencyNetwork={investigation.consistencyNetwork} />

      {/* 6. CONFLICT ANALYSIS PANEL (FIRST-CLASS FORENSIC SIGNAL) */}
      <ConflictPanel conflict={investigation.conflict} />

      {/* 7. EVIDENCE COVERAGE & AUDIT */}
      <EvidenceCoverage coverage={investigation.coverage} />

      {/* 8. VIDEO FORENSICS & KEYFRAME SCRUBBER */}
      {investigation.videoAnalysis && (
        <VideoEvidence
          videoAnalysis={investigation.videoAnalysis}
          filename={investigation.filename}
          duration={investigation.duration}
        />
      )}

      {/* 7. DEEP-DIVE QUICK NAVIGATION BANDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '16px',
        }}
        className="tl-dashboard-subnav"
      >
        <div
          onClick={() => navigate(`/investigation/${investigation.id}/evidence`)}
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-lg)',
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 140ms ease, transform 120ms ease',
          }}
          className="tl-hover-card"
        >
          <div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.08em' }}>
              EVIDENCE EXPLORER
            </span>
            <h3 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '4px 0' }}>
              Audit All {investigation.evidenceList?.length || 0} Forensic Evidence Items
            </h3>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0 }}>
              Inspect primary visual signals, acoustic vocoder harmonics, and supporting face landmarks.
            </p>
          </div>
          <ArrowRight size={18} color="var(--tl-primary)" style={{ flexShrink: 0, marginLeft: '16px' }} />
        </div>

        <div
          onClick={() => navigate(`/investigation/${investigation.id}/timeline`)}
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-lg)',
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color 140ms ease, transform 120ms ease',
          }}
          className="tl-hover-card"
        >
          <div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.08em' }}>
              TIMELINE & SCRUBBER
            </span>
            <h3 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '4px 0' }}>
              Temporal Chain of Custody & Suspicious Intervals
            </h3>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0 }}>
              Review millisecond-level desync intervals and verifiable step-by-step pipeline milestones.
            </p>
          </div>
          <ArrowRight size={18} color="var(--tl-primary)" style={{ flexShrink: 0, marginLeft: '16px' }} />
        </div>
      </div>

      {/* REUSABLE EVIDENCE DETAIL DRAWER (ACCESSIBLE ACROSS ALL SECTIONS) */}
      <EvidenceDetailDrawer
        isOpen={Boolean(selectedEvidenceDrawer)}
        evidence={selectedEvidenceDrawer}
        onClose={() => setSelectedEvidenceDrawer(null)}
      />
    </TrustLayerShell>
  );
};

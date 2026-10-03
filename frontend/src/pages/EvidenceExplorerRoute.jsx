import { useState, useEffect } from 'react';
import {
  Video,
  Mic,
  FileText,
  Crosshair,
  UserCheck,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { useRouter } from '../router';
import { TrustLayerShell } from '../components/shell/TrustLayerShell';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { EvidenceCard } from '../components/forensic/EvidenceCard';
import { ConsistencyPanel } from '../components/forensic/ConsistencyPanel';
import { EvidenceGraph } from '../components/forensic/EvidenceGraph';
import { EvidenceDetailDrawer } from '../components/forensic/EvidenceDetailDrawer';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { investigationService } from '../services/investigationService';

export const EvidenceExplorerRoute = () => {
  const { route, navigate } = useRouter();
  const caseId = route.params?.id || 'INV-2026-001';

  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedModality, setSelectedModality] = useState('ALL');
  const [selectedDirection, setSelectedDirection] = useState('ALL');
  const [selectedEvidenceDrawer, setSelectedEvidenceDrawer] = useState(null);

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
          setError(err.message || 'Failed to load evidence');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  if (loading) {
    return (
      <TrustLayerShell title="Loading Evidence Vault..." activeInvestigationId={caseId}>
        <LoadingState message={`Decoupling evidence items for ${caseId}...`} />
      </TrustLayerShell>
    );
  }

  if (error || !investigation) {
    return (
      <TrustLayerShell title="Evidence Not Found" activeInvestigationId={caseId}>
        <ErrorState
          title="Evidence Records Missing"
          message={`Could not load evidence records for ${caseId}.`}
          actionLabel="Back to Investigation"
          onAction={() => navigate(`/investigation/${caseId}`)}
        />
      </TrustLayerShell>
    );
  }

  const allEvidence = investigation.evidenceList || [];

  // Filter evidence list
  const filteredEvidence = allEvidence.filter((item) => {
    const matchModality = selectedModality === 'ALL' || item.modality === selectedModality;
    const matchDirection = selectedDirection === 'ALL' || item.direction === selectedDirection;
    return matchModality && matchDirection;
  });

  const primaryEvidence = filteredEvidence.filter((item) => !item.isSupporting);
  const supportingEvidence = filteredEvidence.filter((item) => item.isSupporting);

  const modalities = [
    { key: 'ALL', label: 'All Modalities' },
    { key: 'VIDEO', label: 'Video', icon: Video },
    { key: 'AUDIO', label: 'Audio', icon: Mic },
    { key: 'TRANSCRIPT', label: 'Transcript', icon: FileText },
    { key: 'CROSS_MODAL', label: 'Lip-Sync', icon: Crosshair },
    { key: 'FACE', label: 'Face (Supporting)', icon: UserCheck },
  ];

  const directions = [
    { key: 'ALL', label: 'All Directions' },
    { key: 'CONFIRMS_AUTHENTIC', label: 'Confirms Authentic' },
    { key: 'SUSPICIOUS_ARTIFACT', label: 'Suspicious Artifact' },
    { key: 'CROSS_MODAL_CONFLICT', label: 'Cross-Modal Conflict' },
    { key: 'INSUFFICIENT', label: 'Insufficient Signal' },
  ];

  return (
    <TrustLayerShell
      title={`Evidence Explorer // ${investigation.name}`}
      activeInvestigationId={investigation.id}
      breadcrumbs={[
        { label: 'INVESTIGATIONS', path: '/investigations' },
        { label: investigation.id, path: `/investigation/${investigation.id}` },
        { label: 'EVIDENCE' },
      ]}
      maxWidth="1160px"
    >
      {/* 1. HEADER SECTION */}
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
            FIRST-CLASS FORENSIC OBJECTS
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
          Evidence Explorer & Modality Dissection
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
          Evidence is treated as a verifiable first-class entity. Each signal captures the modality source,
          quantified signal score, temporal interval, confidence uncertainty, and explicit forensic reasoning.
        </p>
      </div>

      {/* 2. INTERACTIVE EVIDENCE GRAPH (PHASE 5.1) */}
      <EvidenceGraph
        investigation={investigation}
        onNodeClick={(item) => setSelectedEvidenceDrawer(item)}
      />

      {/* 3. FILTER STRIP */}
      <div
        style={{
          backgroundColor: 'var(--tl-surface-card)',
          border: '1px solid var(--tl-hairline)',
          borderRadius: 'var(--tl-radius-lg)',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Modality Filter Tabs */}
        <div>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            FILTER BY MODALITY
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {modalities.map((mod) => (
              <button
                key={mod.key}
                onClick={() => setSelectedModality(mod.key)}
                style={{
                  background: selectedModality === mod.key ? 'var(--tl-primary)' : 'var(--tl-canvas)',
                  color: selectedModality === mod.key ? '#ffffff' : 'var(--tl-ink)',
                  border: `1px solid ${selectedModality === mod.key ? 'var(--tl-primary)' : 'var(--tl-hairline)'}`,
                  borderRadius: 'var(--tl-radius-sm)',
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Direction Filter Tabs */}
        <div style={{ borderTop: '1px solid var(--tl-hairline)', paddingTop: '10px' }}>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            FILTER BY FORENSIC DIRECTION
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {directions.map((dir) => (
              <button
                key={dir.key}
                onClick={() => setSelectedDirection(dir.key)}
                style={{
                  background: selectedDirection === dir.key ? 'var(--tl-ink)' : 'var(--tl-canvas)',
                  color: selectedDirection === dir.key ? '#ffffff' : 'var(--tl-body)',
                  border: `1px solid ${selectedDirection === dir.key ? 'var(--tl-ink)' : 'var(--tl-hairline)'}`,
                  borderRadius: 'var(--tl-radius-sm)',
                  fontFamily: 'var(--tl-font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                {dir.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PRIMARY EVIDENCE SECTION */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              PRIMARY MODALITIES
            </span>
            <h3 style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--tl-ink)', margin: '2px 0 0' }}>
              Primary Forensic Evidence ({primaryEvidence.length})
            </h3>
          </div>
          <Badge variant="match" size="sm">
            INDEPENDENT PROBATIVE VALUE
          </Badge>
        </div>

        {primaryEvidence.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {primaryEvidence.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                onClick={() => setSelectedEvidenceDrawer(ev)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--tl-surface-card)',
              borderRadius: 'var(--tl-radius-md)',
              border: '1px solid var(--tl-hairline)',
              textAlign: 'center',
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.875rem',
              color: 'var(--tl-muted)',
            }}
          >
            No primary evidence matches the active filters.
          </div>
        )}
      </section>

      {/* 4. SUPPORTING EVIDENCE SECTION (EXPLICIT DISTINCTION PER SPEC) */}
      <section style={{ marginBottom: '40px' }}>
        <div
          style={{
            backgroundColor: 'rgba(232, 165, 90, 0.08)',
            border: '1px solid rgba(232, 165, 90, 0.3)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '16px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <Info size={18} color="var(--tl-accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-ink)', margin: '0 0 2px' }}>
              Supporting Evidence Mandate: Facial Landmark & Pulse Consistency
            </h4>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.8125rem', color: 'var(--tl-body)', margin: 0, lineHeight: 1.5 }}>
              Biological eye blink intervals, vascular micro-pulse, and facial landmark stability serve as <strong>supporting corroboration</strong> only.
              TrustLayer never treats face tracking as independent proof of authenticity, as biological patterns can be mimicked or preserved in face-swap operations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-accent-amber)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CORROBORATING CORRELATION
            </span>
            <h3 style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--tl-ink)', margin: '2px 0 0' }}>
              Supporting Evidence ({supportingEvidence.length})
            </h3>
          </div>
          <Badge variant="uncertainty" size="sm">
            SUPPORTING ONLY
          </Badge>
        </div>

        {supportingEvidence.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {supportingEvidence.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                onClick={() => setSelectedEvidenceDrawer(ev)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--tl-surface-card)',
              borderRadius: 'var(--tl-radius-md)',
              border: '1px solid var(--tl-hairline)',
              textAlign: 'center',
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.875rem',
              color: 'var(--tl-muted)',
            }}
          >
            No supporting evidence matches the active filters.
          </div>
        )}
      </section>

      {/* 5. CROSS-MODAL CONSISTENCY NETWORK */}
      {investigation.consistencyNetwork && (
        <ConsistencyPanel consistencyNetwork={investigation.consistencyNetwork} />
      )}

      {/* REUSABLE EVIDENCE DETAIL DRAWER */}
      <EvidenceDetailDrawer
        isOpen={Boolean(selectedEvidenceDrawer)}
        evidence={selectedEvidenceDrawer}
        onClose={() => setSelectedEvidenceDrawer(null)}
      />
    </TrustLayerShell>
  );
};

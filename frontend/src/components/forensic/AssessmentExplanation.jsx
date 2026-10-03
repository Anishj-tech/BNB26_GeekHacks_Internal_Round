import { useState } from 'react';
import {
  HelpCircle,
  Activity,
  GitCompare,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Info,
  ChevronRight,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

/**
 * Phase 6.1 & 6.3: Assessment Explanation & Explicit Uncertainty Layer
 * 
 * "Why this assessment?"
 * 
 * Three Pillars:
 * 01 Synthetic Evidence
 * 02 Consistency Evidence
 * 03 Evidence Conflict
 * 
 * Explicit Uncertainty Principle:
 * "Missing evidence is NOT evidence of authenticity"
 * (No evidence available ≠ Evidence indicates authenticity)
 */
export const AssessmentExplanation = ({
  investigation = null,
  onOpenEvidenceDetail = null,
}) => {
  if (!investigation) return null;

  const {
    assessment = {},
    conflict = {},
    coverage = [],
  } = investigation;

  const {
    verdict = 'UNCERTAIN',
    summary = '',
    syntheticScore = 0.5,
    syntheticLabel = 'MODERATE',
    consistencyScore = 0.5,
    consistencyLabel = 'MODERATE',
    conflictDetected = false,
    insufficientEvidence = false,
  } = assessment;

  // Determine explanation narrative based on deterministic values
  const isHighSynthetic = syntheticScore >= 0.5;
  const isHighConsistency = consistencyScore >= 0.5;

  let pillar1Desc = '';
  if (syntheticScore >= 0.7) {
    pillar1Desc = `Strong generative neural diffusion traces and spectral anomalies detected across analyzed frames and audio tracks (${(syntheticScore * 100).toFixed(0)}% synthetic intensity).`;
  } else if (syntheticScore <= 0.3) {
    pillar1Desc = `No generative synthesis traces found. Spatial keyframe contours and acoustic phase harmonics conform to natural recording equipment baseline (${(syntheticScore * 100).toFixed(0)}% artifact floor).`;
  } else {
    pillar1Desc = `Ambiguous synthetic intensity (${(syntheticScore * 100).toFixed(0)}%). Spatial noise patterns could not be conclusively separated from hardware compression.`;
  }

  let pillar2Desc = '';
  if (consistencyScore >= 0.7) {
    pillar2Desc = `All independent sensory modalities mutually corroborate. Audio speech timing matches mouth landmark kinematics within sub-frame natural biological thresholds (SyncNet score ${(consistencyScore * 100).toFixed(0)}%).`;
  } else if (consistencyScore <= 0.4) {
    pillar2Desc = `Critical cross-modal desynchronization detected. Phoneme acoustic energy diverges from 3D mouth aperture velocity, indicating non-simultaneous recording or replacement.`;
  } else {
    pillar2Desc = `Cross-modal agreement is inconclusive due to partial sensor coverage or noisy background interference.`;
  }

  let pillar3Desc = '';
  if (conflictDetected || conflict.detected) {
    pillar3Desc = conflict.description || 'Conflict identified between acoustic formants and visual speech articulation, reducing trust confidence.';
  } else {
    pillar3Desc = 'No physical contradictions detected between acoustic reverberation, scene lighting, and facial movement.';
  }

  return (
    <section
      style={{
        backgroundColor: 'var(--tl-canvas)',
        border: '1px solid var(--tl-hairline)',
        borderRadius: 'var(--tl-radius-lg)',
        padding: '32px',
        marginBottom: '32px',
      }}
      className="tl-assessment-explanation-container"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--tl-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              TRANSPARENT FORENSIC REASONING
            </span>
            <span style={{ color: 'var(--tl-hairline)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              DECISION AUDIT
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: '1.75rem',
              fontWeight: 400,
              color: 'var(--tl-ink)',
              margin: 0,
            }}
          >
            Why this assessment?
          </h3>
        </div>

        <Badge variant={verdict === 'TRUSTED' ? 'match' : verdict === 'UNCERTAIN' ? 'uncertainty' : 'conflict'} size="sm" dot>
          VERDICT: {verdict}
        </Badge>
      </div>

      {/* Primary Thesis */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--tl-surface-card)',
          borderRadius: 'var(--tl-radius-md)',
          borderLeft: '4px solid var(--tl-primary)',
          marginBottom: '28px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '1rem',
            color: 'var(--tl-ink)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {summary || (
            isHighSynthetic
              ? 'TrustLayer identified strong synthetic signals while the available modalities showed inconsistent cross-modal relationships, producing a conclusive finding of generative manipulation.'
              : isHighConsistency
              ? 'Multi-modal evidence demonstrates coherent physical agreement across keyframe visual dynamics and acoustic harmonics without synthetic traces.'
              : 'Available evidence is insufficient or contradictory, preventing a deterministic authenticity finding.'
          )}
        </p>
      </div>

      {/* 6.3 EXPLICIT UNCERTAINTY MANDATE BANNER */}
      {(insufficientEvidence || verdict === 'UNCERTAIN' || conflictDetected) && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: insufficientEvidence ? 'rgba(232, 165, 90, 0.1)' : 'rgba(198, 69, 69, 0.08)',
            border: `1px solid ${insufficientEvidence ? 'rgba(232, 165, 90, 0.3)' : 'rgba(198, 69, 69, 0.28)'}`,
            borderRadius: 'var(--tl-radius-md)',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <AlertTriangle
            size={20}
            color={insufficientEvidence ? 'var(--tl-accent-amber)' : 'var(--tl-error)'}
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: insufficientEvidence ? 'var(--tl-accent-amber)' : 'var(--tl-error)',
                  textTransform: 'uppercase',
                }}
              >
                {insufficientEvidence ? 'CALIBRATED UNCERTAINTY // INSUFFICIENT EVIDENCE' : 'CALIBRATED UNCERTAINTY // CONFLICTING EVIDENCE'}
              </span>
            </div>

            <h4
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--tl-ink)',
                margin: '0 0 4px',
              }}
            >
              Missing evidence is NOT evidence of authenticity.
            </h4>

            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              TrustLayer strictly distinguishes <em>"No evidence available"</em> from <em>"Evidence indicates authenticity"</em>.
              {insufficientEvidence
                ? ' Low resolution, missing modalities, or sensor noise floor prevent conclusive validation. Confidence is refused rather than fabricated.'
                : ' Independent modalities produce contradictory signals (e.g. pristine visual plate with spliced cloned audio track).'}
            </p>
          </div>
        </div>
      )}

      {/* THREE PILLAR EVIDENCE CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Pillar 01: Synthetic Evidence */}
        <div
          onClick={() => {
            if (onOpenEvidenceDetail) {
              onOpenEvidenceDetail({
                id: 'PILLAR-01',
                signal: 'Intrinsic Generative Traces',
                status: syntheticLabel,
                score: syntheticScore,
                source: 'SYNTHETIC SIGNALS AXIS',
                timeRange: 'All Analyzed Streams',
                whyItMatters: 'Evaluates spatial diffusion contours, neural vocoder phase distributions, and high-frequency harmonics.',
                isSupporting: false,
              });
            }
          }}
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: onOpenEvidenceDetail ? 'pointer' : 'default',
            transition: 'border-color 140ms ease, transform 120ms ease',
          }}
          className="tl-hover-card"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--tl-primary)' }}>
                01
              </span>
              <Activity size={16} color="var(--tl-primary)" />
            </div>

            <h4
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--tl-ink)',
                margin: '0 0 8px',
              }}
            >
              Synthetic Evidence
            </h4>

            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                lineHeight: 1.5,
                margin: '0 0 16px',
              }}
            >
              {pillar1Desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--tl-hairline)', paddingTop: '12px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              Intensity: {(syntheticScore * 100).toFixed(0)}%
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Inspect Dossier <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Pillar 02: Consistency Evidence */}
        <div
          onClick={() => {
            if (onOpenEvidenceDetail) {
              onOpenEvidenceDetail({
                id: 'PILLAR-02',
                signal: 'Cross-Modal Coherence',
                status: consistencyLabel,
                score: consistencyScore,
                source: 'CONSISTENCY SIGNALS AXIS',
                timeRange: 'Audiovisual SyncNet Window',
                whyItMatters: 'Checks physical agreement between mouth aperture velocity and acoustic formants.',
                isSupporting: false,
              });
            }
          }}
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: onOpenEvidenceDetail ? 'pointer' : 'default',
            transition: 'border-color 140ms ease, transform 120ms ease',
          }}
          className="tl-hover-card"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--tl-accent-teal)' }}>
                02
              </span>
              <GitCompare size={16} color="var(--tl-accent-teal)" />
            </div>

            <h4
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--tl-ink)',
                margin: '0 0 8px',
              }}
            >
              Consistency Evidence
            </h4>

            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                lineHeight: 1.5,
                margin: '0 0 16px',
              }}
            >
              {pillar2Desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--tl-hairline)', paddingTop: '12px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
              Agreement: {(consistencyScore * 100).toFixed(0)}%
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-accent-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Inspect Dossier <ArrowRight size={12} />
            </span>
          </div>
        </div>

        {/* Pillar 03: Evidence Conflict */}
        <div
          onClick={() => {
            if (onOpenEvidenceDetail) {
              onOpenEvidenceDetail({
                id: 'PILLAR-03',
                signal: 'Cross-Modal Conflict Resolution',
                status: conflictDetected ? 'CONFLICT PRESENT' : 'NO CONFLICT',
                score: conflictDetected ? 0.8 : 0.05,
                source: 'EVIDENCE FUSION GRAPH',
                timeRange: 'Cross-Modal Audit',
                whyItMatters: 'Contradictions between modalities drastically reduce trust and indicate localized tampering.',
                isSupporting: false,
              });
            }
          }}
          style={{
            backgroundColor: 'var(--tl-surface-card)',
            border: '1px solid var(--tl-hairline)',
            borderRadius: 'var(--tl-radius-md)',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: onOpenEvidenceDetail ? 'pointer' : 'default',
            transition: 'border-color 140ms ease, transform 120ms ease',
          }}
          className="tl-hover-card"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '1.25rem', fontWeight: 600, color: conflictDetected ? 'var(--tl-error)' : 'var(--tl-success)' }}>
                03
              </span>
              <AlertTriangle size={16} color={conflictDetected ? 'var(--tl-error)' : 'var(--tl-success)'} />
            </div>

            <h4
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--tl-ink)',
                margin: '0 0 8px',
              }}
            >
              Evidence Conflict
            </h4>

            <p
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.8125rem',
                color: 'var(--tl-body)',
                lineHeight: 1.5,
                margin: '0 0 16px',
              }}
            >
              {pillar3Desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--tl-hairline)', paddingTop: '12px' }}>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: conflictDetected ? 'var(--tl-error)' : 'var(--tl-success)' }}>
              {conflictDetected ? 'Conflict Detected' : 'Concordant'}
            </span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Inspect Dossier <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

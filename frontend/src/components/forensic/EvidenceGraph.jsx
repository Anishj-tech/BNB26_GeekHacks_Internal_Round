import { useState } from 'react';
import {
  Video,
  Mic,
  FileText,
  Activity,
  GitCompare,
  Shield,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

/**
 * Phase 5.1: Interactive Evidence Graph
 * 
 * Concept from PRD:
 *              VIDEO
 *             /     \
 *            /       \
 *         AUDIO ─── TEXT
 *            \       /
 *             \     /
 *           ASSESSMENT
 * 
 * Nodes:
 * - Video / Visual
 * - Audio / Voice
 * - Transcript / Text
 * - Synthetic Signals
 * - Consistency Signals
 * - Final Assessment
 * 
 * Relationship states:
 * - Teal: MATCH / agreement
 * - Red: MISMATCH / conflict
 * - Amber: UNCERTAIN / insufficient evidence
 * - Blue: active selection
 */
export const EvidenceGraph = ({
  investigation = null,
  onNodeClick = null,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState('assessment');

  if (!investigation) return null;

  const { assessment = {}, conflict = {} } = investigation;
  const isConflict = conflict.detected || assessment.verdict === 'MANIPULATED' || assessment.verdict === 'PROBABLY MANIPULATED';
  const isUncertain = assessment.verdict === 'UNCERTAIN';

  // Semantic edge colors
  const colorMatch = '#5db8a6';     // Teal
  const colorConflict = '#c64545';  // Red
  const colorUncertain = '#e8a55a'; // Amber
  const colorActive = '#3b82f6';    // Blue

  // Node Definitions
  const nodes = [
    {
      id: 'video',
      label: 'Video / Visual',
      type: 'PRIMARY MODALITY',
      icon: Video,
      x: 350,
      y: 70,
      score: assessment.syntheticScore !== undefined ? 1 - assessment.syntheticScore : 0.8,
      status: assessment.syntheticScore >= 0.6 ? 'ANOMALY DETECTED' : 'HOMOGENEOUS',
      statusVariant: assessment.syntheticScore >= 0.6 ? 'conflict' : 'match',
      evidenceData: {
        id: 'NODE-VID',
        signal: 'Video Raster & Laplacian Continuity',
        status: assessment.syntheticScore >= 0.6 ? 'ANOMALY DETECTED' : 'PRISTINE',
        source: 'VIDEO',
        timeRange: 'Full Keyframe Sequence',
        whyItMatters: 'Video frames contain boundary contour gradients and facial landmark meshes.',
        isSupporting: false,
      },
    },
    {
      id: 'audio',
      label: 'Audio / Voice',
      type: 'PRIMARY MODALITY',
      icon: Mic,
      x: 140,
      y: 200,
      score: 0.75,
      status: isConflict ? 'VOCODER TRACE' : 'NATURAL HARMONICS',
      statusVariant: isConflict ? 'conflict' : 'match',
      evidenceData: {
        id: 'NODE-AUD',
        signal: 'Acoustic Spectrogram & Neural Vocoder',
        status: isConflict ? 'ANOMALY DETECTED' : 'NATURAL',
        source: 'AUDIO',
        timeRange: 'Full Audio Track',
        whyItMatters: 'Harmonic bispectrum evaluates vocal cord resonance vs neural vocoder cloning.',
        isSupporting: false,
      },
    },
    {
      id: 'text',
      label: 'Transcript / Text',
      type: 'PRIMARY MODALITY',
      icon: FileText,
      x: 560,
      y: 200,
      score: 0.95,
      status: 'PHONETIC ALIGNMENT',
      statusVariant: 'match',
      evidenceData: {
        id: 'NODE-TXT',
        signal: 'Whisper-v3 Phonetic Progression',
        status: 'VERIFIED CONCORDANT',
        source: 'TRANSCRIPT',
        timeRange: 'Continuous Speech',
        whyItMatters: 'Text progression confirms speech was not spliced with conflicting phonemes.',
        isSupporting: false,
      },
    },
    {
      id: 'synthetic',
      label: 'Synthetic Signals',
      type: 'INDEPENDENT AXIS',
      icon: Activity,
      x: 210,
      y: 330,
      score: assessment.syntheticScore,
      status: `${(assessment.syntheticScore * 100).toFixed(0)}% Intensity`,
      statusVariant: assessment.syntheticScore >= 0.6 ? 'conflict' : assessment.syntheticScore <= 0.3 ? 'match' : 'uncertainty',
      evidenceData: {
        id: 'NODE-SYN',
        signal: 'Intrinsic Generative Diffusion Traces',
        status: assessment.syntheticLabel || 'MODERATE',
        source: 'SYNTHETIC_SIGNALS',
        timeRange: 'Spatial & Spectral Cross-Sections',
        whyItMatters: 'Evaluates independent generative model artifacts without assuming cross-modal alignment.',
        isSupporting: false,
      },
    },
    {
      id: 'consistency',
      label: 'Consistency Signals',
      type: 'INDEPENDENT AXIS',
      icon: GitCompare,
      x: 490,
      y: 330,
      score: assessment.consistencyScore,
      status: `${(assessment.consistencyScore * 100).toFixed(0)}% Agreement`,
      statusVariant: isConflict ? 'conflict' : 'match',
      evidenceData: {
        id: 'NODE-CON',
        signal: 'SyncNet 3D Lip-Voice Correlation',
        status: isConflict ? 'CRITICAL DESYNC' : 'TIGHT SYNCHRONIZATION',
        source: 'CROSS_MODAL',
        timeRange: 'Speech Intervals',
        whyItMatters: 'Measures physical agreement between mouth kinematics and acoustic formants.',
        isSupporting: false,
      },
    },
    {
      id: 'assessment',
      label: 'Trust Assessment',
      type: 'EVIDENCE FUSION',
      icon: Shield,
      x: 350,
      y: 440,
      score: assessment.engineeringTrustIndex,
      status: assessment.verdict,
      statusVariant: isConflict ? 'conflict' : isUncertain ? 'uncertainty' : 'match',
      evidenceData: {
        id: 'NODE-ASSESS',
        signal: 'Multi-Modal Evidence Fusion Synthesis',
        status: assessment.verdict,
        source: 'TRUST_ENGINE',
        timeRange: 'Dossier Comprehensive',
        whyItMatters: 'Deterministic fusion integrates independent axes into the final calibrated trust conclusion.',
        isSupporting: false,
      },
    },
  ];

  // Defined Semantic Relationships (Edges)
  const edges = [
    // Video <-> Audio: Lip-voice sync
    { from: 'video', to: 'audio', status: isConflict ? 'conflict' : 'match', label: 'SyncNet Lip-Voice' },
    // Video <-> Text: Visual speech alignment
    { from: 'video', to: 'text', status: 'match', label: 'Viseme Articulation' },
    // Audio <-> Text: Whisper speech transcription
    { from: 'audio', to: 'text', status: 'match', label: 'Phoneme Concordance' },
    // Modalities -> Synthetic Axis
    { from: 'video', to: 'synthetic', status: assessment.syntheticScore >= 0.6 ? 'conflict' : 'match', label: 'Boundary Scan' },
    { from: 'audio', to: 'synthetic', status: isConflict ? 'conflict' : 'match', label: 'Vocoder Check' },
    // Modalities -> Consistency Axis
    { from: 'video', to: 'consistency', status: isConflict ? 'conflict' : 'match', label: 'Viseme Velocity' },
    { from: 'audio', to: 'consistency', status: isConflict ? 'conflict' : 'match', label: 'Acoustic Envelopes' },
    // Axes -> Assessment
    { from: 'synthetic', to: 'assessment', status: assessment.syntheticScore >= 0.6 ? 'conflict' : 'match', label: 'Axis 1 Fusion' },
    { from: 'consistency', to: 'assessment', status: isConflict ? 'conflict' : 'match', label: 'Axis 2 Fusion' },
  ];

  const handleSelectNode = (node) => {
    setSelectedNodeId(node.id);
    if (onNodeClick) {
      onNodeClick(node.evidenceData);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[nodes.length - 1];

  return (
    <div
      style={{
        backgroundColor: 'var(--tl-surface-dark)',
        color: 'var(--tl-on-dark)',
        borderRadius: 'var(--tl-radius-lg)',
        border: '1px solid var(--tl-surface-dark-elevated)',
        padding: '28px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="tl-evidence-graph-container"
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
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
              MULTI-MODAL EVIDENCE TOPOLOGY
            </span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-on-dark-soft)' }}>
              INTERACTIVE EVIDENCE GRAPH
            </span>
          </div>
          <h3
            style={{
              fontFamily: 'var(--tl-font-display)',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: 'var(--tl-on-dark)',
              margin: 0,
            }}
          >
            Evidence Relationship Graph
          </h3>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem', fontFamily: 'var(--tl-font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colorMatch }} />
            <span style={{ color: 'var(--tl-on-dark-soft)' }}>Agreement (Teal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colorConflict }} />
            <span style={{ color: 'var(--tl-on-dark-soft)' }}>Conflict (Red)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colorUncertain }} />
            <span style={{ color: 'var(--tl-on-dark-soft)' }}>Uncertain (Amber)</span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'var(--tl-font-sans)',
          fontSize: '0.875rem',
          color: 'var(--tl-on-dark-soft)',
          maxWidth: '780px',
          lineHeight: 1.55,
          marginBottom: '20px',
        }}
      >
        Click any node in the topology to inspect how raw sensor streams (Video, Audio, Transcript) decompose into independent Synthetic and Consistency axes, culminating in the authoritative Evidence Fusion result.
      </p>

      {/* SVG Canvas & Node Layout */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '700px',
          height: '520px',
          margin: '0 auto',
          backgroundColor: 'rgba(0,0,0,0.25)',
          borderRadius: 'var(--tl-radius-md)',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* SVG Relationship Lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 700 520"
        >
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isSelected = selectedNodeId === edge.from || selectedNodeId === edge.to;
            const strokeColor = edge.status === 'conflict' ? colorConflict : edge.status === 'uncertainty' ? colorUncertain : colorMatch;

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isSelected ? colorActive : strokeColor}
                  strokeWidth={isSelected ? 3 : 1.8}
                  strokeDasharray={edge.status === 'uncertainty' ? '4 3' : 'none'}
                  opacity={isSelected ? 1 : 0.65}
                  style={{ transition: 'all 200ms ease' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const NodeIcon = node.icon;

          return (
            <div
              key={node.id}
              onClick={() => handleSelectNode(node)}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                zIndex: isSelected ? 10 : 2,
                transition: 'transform 180ms ease, box-shadow 180ms ease',
              }}
            >
              <div
                style={{
                  width: node.id === 'assessment' ? '54px' : '44px',
                  height: node.id === 'assessment' ? '54px' : '44px',
                  borderRadius: '50%',
                  backgroundColor: isSelected
                    ? 'var(--tl-primary)'
                    : 'var(--tl-surface-dark-elevated)',
                  border: isSelected
                    ? '2px solid #ffffff'
                    : `2px solid ${node.statusVariant === 'conflict' ? colorConflict : colorMatch}`,
                  color: isSelected ? '#ffffff' : 'var(--tl-on-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected
                    ? '0 0 16px rgba(204, 120, 92, 0.6)'
                    : '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <NodeIcon size={node.id === 'assessment' ? 22 : 18} />
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(24, 23, 21, 0.92)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--tl-radius-xs)',
                  padding: '2px 8px',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--tl-primary)' : 'var(--tl-on-dark)',
                    display: 'block',
                  }}
                >
                  {node.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--tl-font-mono)',
                    fontSize: '0.625rem',
                    color: node.statusVariant === 'conflict' ? 'var(--tl-error)' : 'var(--tl-on-dark-soft)',
                  }}
                >
                  {node.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Inspector Bar */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px 20px',
          backgroundColor: 'var(--tl-surface-dark-elevated)',
          borderRadius: 'var(--tl-radius-md)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--tl-radius-sm)',
              backgroundColor: 'var(--tl-surface-dark)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--tl-primary)',
            }}
          >
            {selectedNode && <selectedNode.icon size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-primary)', fontWeight: 600 }}>
                {selectedNode.type}
              </span>
              <span style={{ color: 'var(--tl-on-dark-soft)' }}>•</span>
              <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-on-dark)' }}>
                {selectedNode.label}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.75rem', color: 'var(--tl-on-dark-soft)', margin: 0 }}>
              {selectedNode.evidenceData.whyItMatters}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNodeClick) onNodeClick(selectedNode.evidenceData);
          }}
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--tl-primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Examine Evidence Dossier</span>
          <span style={{ fontFamily: 'var(--tl-font-mono)' }}>→</span>
        </button>
      </div>
    </div>
  );
};

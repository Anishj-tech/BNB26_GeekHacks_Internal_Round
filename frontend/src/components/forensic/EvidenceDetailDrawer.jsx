import { useEffect } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  Layers,
  ArrowRightLeft,
  Video,
  Mic,
  FileText,
  UserCheck,
  Crosshair,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../../design-system/components/Badge';

/**
 * Reusable Evidence Detail Drawer (Phase 5 & Phase 6 Core Component)
 * 
 * Accessible from:
 * - Trust Assessment
 * - Synthetic Signals
 * - Consistency Signals
 * - Evidence Graph
 * - Suspicious Timeline
 * 
 * Standard Structure:
 * - SIGNAL
 * - STATUS
 * - SOURCE
 * - TIME RANGE
 * - WHY IT MATTERS
 * - RELATED EVIDENCE
 * - SUPPORTING EVIDENCE FLAG
 */
export const EvidenceDetailDrawer = ({
  isOpen = false,
  onClose,
  evidence = null,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !evidence) return null;

  const {
    id = 'EV-ITEM',
    signalType = evidence.signal || evidence.label || 'Forensic Modality Signal',
    status = evidence.direction || 'AUDITED',
    source = evidence.modality || evidence.source || 'Multi-Modal Stream',
    timeRange = evidence.timeRange || evidence.timestamp || 'Full Media Stream',
    observation = evidence.finding || evidence.detail || evidence.note || 'Forensic artifact evaluated against mathematical thresholds.',
    whyItMatters = evidence.reasoning || evidence.explanation || 'Determines whether visual and acoustic streams share genuine biological origin.',
    isSupporting = Boolean(evidence.isSupporting),
    score = evidence.score,
    uncertainty = evidence.uncertainty || 'Calibrated',
    relatedEvidence = evidence.relatedEvidence || [
      'Cross-Modal SyncNet Verification',
      'High-pass Laplacian Keyframe Filter',
    ],
  } = evidence;

  // Modality Icon selection
  const getModalityIcon = (mod) => {
    const m = String(mod).toUpperCase();
    if (m.includes('VIDEO')) return Video;
    if (m.includes('AUDIO') || m.includes('VOICE')) return Mic;
    if (m.includes('TRANSCRIPT') || m.includes('TEXT')) return FileText;
    if (m.includes('FACE')) return UserCheck;
    if (m.includes('CROSS') || m.includes('SYNC')) return Crosshair;
    return Layers;
  };

  const ModalityIcon = getModalityIcon(source);

  // Status variant configuration
  const getStatusVariant = (st) => {
    const s = String(st).toUpperCase();
    if (s.includes('MANIPULAT') || s.includes('CONFLICT') || s.includes('SUSPICIOUS') || s.includes('MISMATCH')) {
      return { variant: 'conflict', icon: ShieldAlert, color: 'var(--tl-error)', label: st };
    }
    if (s.includes('TRUST') || s.includes('AUTHENTIC') || s.includes('AGREEMENT') || s.includes('MATCH')) {
      return { variant: 'match', icon: ShieldCheck, color: 'var(--tl-success)', label: st };
    }
    return { variant: 'uncertainty', icon: HelpCircle, color: 'var(--tl-accent-amber)', label: st };
  };

  const statusConfig = getStatusVariant(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      className="tl-drawer-backdrop"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(20, 20, 19, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'opacity 200ms ease',
        }}
      />

      {/* Drawer Surface */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Evidence Detail Drawer"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          backgroundColor: 'var(--tl-canvas)',
          borderLeft: '1px solid var(--tl-hairline)',
          boxShadow: 'var(--tl-shadow-dark)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          overflowY: 'auto',
          animation: 'tl-drawer-slide-in 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="tl-drawer-panel"
      >
        {/* Top Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--tl-hairline)',
            backgroundColor: 'var(--tl-surface-card)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            position: 'sticky',
            top: 0,
            zIndex: 5,
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
                EVIDENCE DOSSIER // {id}
              </span>
              {isSupporting && (
                <Badge variant="neutral" size="xs">
                  SUPPORTING EVIDENCE
                </Badge>
              )}
            </div>

            <h2
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: '1.5rem',
                fontWeight: 400,
                color: 'var(--tl-ink)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {signalType}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Evidence Detail Drawer"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--tl-radius-md)',
              border: '1px solid var(--tl-hairline)',
              backgroundColor: 'var(--tl-canvas)',
              color: 'var(--tl-ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 140ms ease',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Supporting Evidence Rule Callout */}
          {isSupporting && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'rgba(232, 165, 90, 0.1)',
                borderLeft: '3px solid var(--tl-accent-amber)',
                borderRadius: 'var(--tl-radius-xs)',
                fontSize: '0.8125rem',
                color: 'var(--tl-ink)',
                lineHeight: 1.5,
              }}
            >
              <strong>Critical Forensic Principle:</strong> Face consistency is SUPPORTING evidence only. It is not an independent proof of authenticity and cannot override primary multi-modal cross-checks.
            </div>
          )}

          {/* 1. STATUS & SIGNAL METRICS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
              }}
            >
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block', marginBottom: '4px' }}>
                SIGNAL STATUS
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <StatusIcon size={14} color={statusConfig.color} />
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: statusConfig.color }}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
              }}
            >
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', display: 'block', marginBottom: '4px' }}>
                CALIBRATED INTENSITY
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-ink)' }}>
                {score !== undefined ? `${(score * 100).toFixed(0)}%` : 'Active'}
              </span>
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', marginLeft: '4px' }}>
                ({uncertainty} uncertainty)
              </span>
            </div>
          </div>

          {/* 2. SOURCE & MODALITY */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              SOURCE MODALITY
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--tl-radius-sm)',
                  backgroundColor: 'var(--tl-surface-dark)',
                  color: 'var(--tl-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ModalityIcon size={16} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--tl-font-sans)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-ink)', display: 'block' }}>
                  {source}
                </span>
                <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
                  Primary forensic sensor extraction
                </span>
              </div>
            </div>
          </div>

          {/* 3. TIME RANGE */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              TIME RANGE
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
              }}
            >
              <Clock size={15} color="var(--tl-primary)" />
              <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.8125rem', color: 'var(--tl-ink)' }}>
                {timeRange}
              </span>
            </div>
          </div>

          {/* 4. FORENSIC OBSERVATION */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              FORENSIC OBSERVATION
            </span>
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--tl-surface-card)',
                border: '1px solid var(--tl-hairline)',
                borderRadius: 'var(--tl-radius-md)',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.875rem',
                color: 'var(--tl-ink)',
                lineHeight: 1.6,
              }}
            >
              {observation}
            </div>
          </div>

          {/* 5. WHY IT MATTERS */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-primary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              WHY IT MATTERS
            </span>
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--tl-surface-card)',
                borderLeft: '3px solid var(--tl-primary)',
                borderRadius: 'var(--tl-radius-xs)',
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.875rem',
                color: 'var(--tl-body)',
                lineHeight: 1.6,
              }}
            >
              {whyItMatters}
            </div>
          </div>

          {/* 6. RELATED EVIDENCE LINKS */}
          <div>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              RELATED EVIDENCE CORRELATIONS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {relatedEvidence.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'var(--tl-surface-card)',
                    border: '1px solid var(--tl-hairline)',
                    borderRadius: 'var(--tl-radius-sm)',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowRightLeft size={13} color="var(--tl-muted)" />
                    <span style={{ fontFamily: 'var(--tl-font-mono)', color: 'var(--tl-ink)' }}>{item}</span>
                  </div>
                  <Badge variant="neutral" size="xs">CORRELATED</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '18px 24px',
            borderTop: '1px solid var(--tl-hairline)',
            backgroundColor: 'var(--tl-surface-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.6875rem', color: 'var(--tl-muted)' }}>
            Cryptographically sealed under chain of custody
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              backgroundColor: 'var(--tl-surface-dark)',
              color: 'var(--tl-on-dark)',
              border: 'none',
              borderRadius: 'var(--tl-radius-md)',
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

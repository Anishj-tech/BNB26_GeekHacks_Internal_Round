import { CheckCircle2, Lock, ArrowRight, X } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';

export const AnalysisReadyModal = ({
  isOpen,
  onClose,
  investigationId,
  videoFile,
  audioFile,
  transcriptText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="tl-modal-backdrop" onClick={onClose}>
      <div className="tl-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tl-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="var(--tl-match)" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-text-primary)' }}>
              Evidence Sealed // Investigation Initialized
            </span>
          </div>
          <button className="tl-modal-close-btn" onClick={onClose} aria-label="Close Modal">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="tl-modal-content">
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--tl-radius-md)',
              backgroundColor: 'var(--tl-match-subtle)',
              border: '1px solid var(--tl-match-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={22} color="var(--tl-match)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-text-primary)', marginBottom: '4px' }}>
                Phase 2 Complete — Evidence Bundle Sealed
              </h4>
              <p className="tl-body-sm" style={{ fontSize: '0.8125rem', margin: 0 }}>
                All evidence sources have been staged for investigation <strong>{investigationId}</strong>. The pipeline transition is verified and ready to connect to the <strong>Processing Screen (Phase 3)</strong>.
              </p>
            </div>
          </div>

          <div className="tl-modal-spec-grid">
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">PRIMARY VIDEO</span>
              <span className="val" title={videoFile?.name}>
                {videoFile?.name || 'video_sample.mp4'}
              </span>
            </div>
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">AUDIO SOURCE</span>
              <span className="val">
                {audioFile ? audioFile.name : 'In-Video Audio Track'}
              </span>
            </div>
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">TRANSCRIPT</span>
              <span className="val">
                {transcriptText?.trim() ? 'User Supplied' : 'Auto-Extraction Ready'}
              </span>
            </div>
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">NEXT MILESTONE</span>
              <span className="val">
                <Badge variant="brand" size="sm">PHASE 3 PROCESSING</Badge>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="tl-modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Back to Evidence Setup
          </Button>
          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={onClose}>
            Acknowledge & Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

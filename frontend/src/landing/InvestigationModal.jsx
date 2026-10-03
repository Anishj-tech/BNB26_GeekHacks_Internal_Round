import { X, Shield, ArrowRight, UploadCloud } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';

export const InvestigationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="tl-modal-backdrop" onClick={onClose}>
      <div className="tl-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tl-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--tl-brand)" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tl-text-primary)' }}>
              Investigation Console Initialized
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
              backgroundColor: 'var(--tl-brand-subtle)',
              border: '1px solid var(--tl-brand-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <UploadCloud size={22} color="var(--tl-brand)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tl-text-primary)', marginBottom: '4px' }}>
                Phase 1 Complete — Entry Point Connected
              </h4>
              <p className="tl-body-sm" style={{ fontSize: '0.8125rem', margin: 0 }}>
                The landing page navigation structure is active. The next milestone will implement the <strong>Upload Investigation Screen (Phase 2)</strong> supporting video, audio, and transcript file drops.
              </p>
            </div>
          </div>

          <div className="tl-modal-spec-grid">
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">PIPELINE TARGET</span>
              <span className="val">Two-Axis Fusion Engine</span>
            </div>
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">STATUS</span>
              <span className="val">
                <Badge variant="match" size="sm" dot>READY FOR PHASE 2</Badge>
              </span>
            </div>
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">SUPPORTED INPUTS</span>
              <span className="val">MP4, WebM, WAV, MP3, VTT</span>
            </div>
            <div className="tl-modal-spec-item">
              <span className="tl-label-tech">FORENSIC SUITE</span>
              <span className="val">SyncNet + Artifact Isolation</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="tl-modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Back to Landing Page
          </Button>
          <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={onClose}>
            Acknowledge & Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

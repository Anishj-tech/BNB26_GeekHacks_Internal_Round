import { ArrowLeft, Shield } from 'lucide-react';
import { Badge } from '../design-system/components/Badge';

export const UploadHeader = ({ onBack, investigationId }) => {
  return (
    <header className="tl-upload-header">
      <div className="tl-upload-header-inner">
        {/* Left: Back button & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="tl-back-btn" onClick={onBack} aria-label="Back to Landing Page">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--tl-border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--tl-brand)" />
            <span
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'var(--tl-text-primary)',
              }}
            >
              TrustLayer
            </span>
            <span style={{ color: 'var(--tl-border)' }}>/</span>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.6875rem',
                color: 'var(--tl-text-muted)',
              }}
            >
              INVESTIGATION SETUP
            </span>
          </div>
        </div>

        {/* Center: Step Indicator */}
        <div className="tl-step-indicator">
          <div className="tl-step-item active">
            <span className="step-num">01</span>
            <span className="step-label">Upload</span>
          </div>

          <div className="tl-step-separator" />

          <div className="tl-step-item disabled" title="Available in Phase 3">
            <span className="step-num">02</span>
            <span className="step-label">Analyze</span>
          </div>

          <div className="tl-step-separator" />

          <div className="tl-step-item disabled" title="Available in Phase 4">
            <span className="step-num">03</span>
            <span className="step-label">Results</span>
          </div>
        </div>

        {/* Right: Investigation ID Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="tl-label-tech" style={{ display: 'none' }}>ID:</span>
          <Badge variant="neutral" mono size="sm">
            {investigationId}
          </Badge>
        </div>
      </div>
    </header>
  );
};

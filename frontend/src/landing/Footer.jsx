import { Shield } from 'lucide-react';
import { StatusDot } from '../design-system/components/StatusDot';

export const Footer = () => {
  return (
    <footer className="tl-landing-footer">
      <div className="tl-footer-inner">
        <div className="tl-footer-brand">
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
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.625rem',
                color: 'var(--tl-text-muted)',
                border: '1px solid var(--tl-border)',
                padding: '1px 4px',
                borderRadius: 'var(--tl-radius-sm)',
              }}
            >
              2026
            </span>
          </div>
          <p className="tl-body-sm" style={{ fontSize: '0.8125rem', marginTop: '6px', maxWidth: '380px' }}>
            Multi-modal forensic intelligence platform uniting synthetic signal isolation with cross-modal consistency verification.
          </p>
        </div>

        <div className="tl-footer-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusDot variant="match" pulse />
            <span className="tl-mono" style={{ fontSize: '0.75rem', color: 'var(--tl-text-secondary)' }}>
              SYSTEM_STATUS: OPERATIONAL
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px' }}>
            <span className="tl-meta">BIT N BUILD HACKATHON</span>
            <span style={{ color: 'var(--tl-border)' }}>|</span>
            <span className="tl-meta">PHASE 1 COMPLETE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

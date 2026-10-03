import { ArrowRight, ShieldCheck, FileCheck2, Cpu } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';

export const FinalCtaSection = ({ onStartInvestigation }) => {
  return (
    <section className="tl-final-cta-section">
      <div className="tl-final-cta-card">
        {/* Subtle background ambient hairline */}
        <div className="tl-final-cta-glow" />

        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Badge variant="brand" size="sm" dot pulse>
              FORENSIC WORKSPACE READY
            </Badge>
            <span className="tl-label-tech">PHASE 1 LANDING PAGE</span>
          </div>

          <h2 className="tl-final-cta-title">
            Ready to investigate the evidence?
          </h2>

          <p className="tl-final-cta-desc">
            Upload video, audio, or multi-modal recordings to dissect synthetic artifacts, measure cross-modal consistency, and inspect the unified evidence chain.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginTop: '24px' }}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={onStartInvestigation}
            >
              Start Investigation
            </Button>

            <span className="tl-meta">
              Dual-Axis Engine • Evidence Graph • Audit Trail
            </span>
          </div>
        </div>

        {/* Minimal Forensic Spec Column */}
        <div className="tl-final-cta-specs">
          <div className="tl-cta-spec-item">
            <ShieldCheck size={16} color="var(--tl-match)" />
            <div>
              <span className="spec-label">EVIDENCE FUSION</span>
              <span className="spec-val">Cross-Modal Verification</span>
            </div>
          </div>

          <div className="tl-cta-spec-item">
            <FileCheck2 size={16} color="var(--tl-brand)" />
            <div>
              <span className="spec-label">TRANSPARENCY</span>
              <span className="spec-val">Inspectable Graph Reasoning</span>
            </div>
          </div>

          <div className="tl-cta-spec-item">
            <Cpu size={16} color="var(--tl-uncertainty)" />
            <div>
              <span className="spec-label">ACCURACY CALIBRATION</span>
              <span className="spec-val">Dual Synthetic & Consistency Scoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

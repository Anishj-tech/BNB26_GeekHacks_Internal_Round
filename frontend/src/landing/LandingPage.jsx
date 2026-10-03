import { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { TwoAxisTrustModel } from './TwoAxisTrustModel';
import { HowItWorksSection } from './HowItWorksSection';
import { EvidenceArchitectureSection } from './EvidenceArchitectureSection';
import { FinalCtaSection } from './FinalCtaSection';
import { Footer } from './Footer';
import { InvestigationModal } from './InvestigationModal';
import { Divider } from '../design-system/components/Divider';

export const LandingPage = ({ onStartInvestigation }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleStartInvestigation = () => {
    if (onStartInvestigation) {
      onStartInvestigation();
    } else {
      setModalOpen(true);
    }
  };

  const handleExploreModel = () => {
    const el = document.getElementById('trust-model');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="tl-app-layout tl-forensic-bg">
      <div className="tl-radial-vignette" />

      {/* 1. Minimal Premium Navigation */}
      <Navbar onStartInvestigation={handleStartInvestigation} />

      {/* Main Landing Flow */}
      <main>
        {/* 2. Hero Section */}
        <HeroSection
          onStartInvestigation={handleStartInvestigation}
          onExploreModel={handleExploreModel}
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <Divider variant="hairline" />
        </div>

        {/* 3. Two-Axis Trust Model Concept */}
        <TwoAxisTrustModel />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <Divider variant="hairline" />
        </div>

        {/* 4. How TrustLayer Works (4-Step Pipeline) */}
        <HowItWorksSection />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <Divider variant="hairline" />
        </div>

        {/* 5. Evidence & Modality Architecture Visual */}
        <EvidenceArchitectureSection />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <Divider variant="hairline" />
        </div>

        {/* 6. Final Call to Action */}
        <FinalCtaSection onStartInvestigation={handleStartInvestigation} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Investigation Entry-point Modal */}
      <InvestigationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

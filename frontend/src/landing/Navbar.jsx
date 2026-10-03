import { useState } from 'react';
import { Shield, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { IconContainer } from '../design-system/components/IconContainer';

export const Navbar = ({ onStartInvestigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="tl-landing-navbar">
      <div className="tl-landing-navbar-inner">
        {/* Brand / Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <IconContainer icon={Shield} variant="brand" size="sm" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
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
                letterSpacing: '0.04em',
                border: '1px solid var(--tl-border)',
                padding: '1px 5px',
                borderRadius: 'var(--tl-radius-sm)',
              }}
            >
              V1.0
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="tl-nav-links-desktop">
          <button className="tl-nav-link" onClick={() => scrollTo('trust-model')}>
            Trust Model
          </button>
          <button className="tl-nav-link" onClick={() => scrollTo('how-it-works')}>
            How It Works
          </button>
          <button className="tl-nav-link" onClick={() => scrollTo('evidence-architecture')}>
            Evidence Architecture
          </button>
        </div>

        {/* Action Button & System Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="tl-nav-badge-desktop">
            <Badge variant="match" size="sm" dot pulse>
              FORENSIC ENGINE ONLINE
            </Badge>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onStartInvestigation}
          >
            Start Investigation
          </Button>

          {/* Mobile hamburger */}
          <button
            className="tl-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="tl-mobile-nav-drawer">
          <button className="tl-nav-link" onClick={() => scrollTo('trust-model')}>
            Trust Model
          </button>
          <button className="tl-nav-link" onClick={() => scrollTo('how-it-works')}>
            How It Works
          </button>
          <button className="tl-nav-link" onClick={() => scrollTo('evidence-architecture')}>
            Evidence Architecture
          </button>
          <div style={{ paddingTop: '8px' }}>
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartInvestigation();
              }}
              style={{ width: '100%' }}
            >
              Start Investigation
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

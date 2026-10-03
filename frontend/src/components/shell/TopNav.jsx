import { useState } from 'react';
import { Shield, Plus, Menu, X } from 'lucide-react';
import { useRouter } from '../../router';
import { Button } from '../../design-system/components/Button';
import { Badge } from '../../design-system/components/Badge';

export const TopNav = ({ title, breadcrumbs = [], showNewBtn = true }) => {
  const { route, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--tl-canvas)',
        borderBottom: '1px solid var(--tl-hairline)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
      className="tl-topnav"
    >
      {/* Left: Mobile Brand & Contextual Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="tl-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--tl-ink)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Brand Title when sidebar is hidden */}
        <div
          className="tl-mobile-brand"
          style={{ display: 'none', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--tl-radius-sm)',
              backgroundColor: 'var(--tl-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={16} />
          </div>
          <span style={{ fontFamily: 'var(--tl-font-display)', fontSize: '1.125rem', fontWeight: 600 }}>
            TrustLayer
          </span>
        </div>

        {/* Breadcrumb Path on Desktop */}
        <nav
          aria-label="Breadcrumb"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          className="tl-breadcrumbs-desktop"
        >
          <span
            style={{
              fontFamily: 'var(--tl-font-mono)',
              fontSize: '0.75rem',
              color: 'var(--tl-muted)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            TRUSTLAYER
          </span>

          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--tl-hairline)', fontSize: '0.75rem' }}>/</span>
              <span
                style={{
                  fontFamily: 'var(--tl-font-mono)',
                  fontSize: '0.75rem',
                  color: idx === breadcrumbs.length - 1 ? 'var(--tl-ink)' : 'var(--tl-muted)',
                  fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                  cursor: crumb.path ? 'pointer' : 'default',
                }}
                onClick={() => crumb.path && navigate(crumb.path)}
              >
                {crumb.label}
              </span>
            </span>
          ))}

          {title && !breadcrumbs.length && (
            <span
              style={{
                fontFamily: 'var(--tl-font-sans)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--tl-ink)',
              }}
            >
              {title}
            </span>
          )}
        </nav>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="tl-engine-badge-desktop">
          <Badge variant="match" size="sm" dot>
            FORENSIC ENGINE ONLINE
          </Badge>
        </div>

        {showNewBtn && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate('/investigation/new')}
          >
            New Investigation
          </Button>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--tl-canvas)',
            borderBottom: '1px solid var(--tl-hairline)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(20, 20, 19, 0.08)',
          }}
        >
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/investigations');
            }}
            className="tl-btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            Investigations
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/investigation/new');
            }}
            className="tl-btn-primary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            + New Investigation
          </button>
          {route.params?.id && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`/investigation/${route.params.id}`);
                }}
                className="tl-btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Investigation Overview
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`/investigation/${route.params.id}/evidence`);
                }}
                className="tl-btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Evidence
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`/investigation/${route.params.id}/timeline`);
                }}
                className="tl-btn-secondary"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                Timeline
              </button>
            </>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/how-it-works');
            }}
            className="tl-btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            How It Works
          </button>
        </div>
      )}
    </header>
  );
};

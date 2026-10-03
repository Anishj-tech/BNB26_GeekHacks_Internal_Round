import { Shield, PlusCircle, Files, Clock, HelpCircle, Layers, ChevronRight } from 'lucide-react';
import { useRouter } from '../../router';

export const Sidebar = ({ activeInvestigationId }) => {
  const { route, navigate } = useRouter();

  const isRouteActive = (targetName) => {
    return route.name === targetName;
  };

  const currentCaseId = activeInvestigationId || route.params?.id || 'INV-2026-001';

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: 'var(--tl-canvas)',
        borderRight: '1px solid var(--tl-hairline)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 40,
      }}
      className="tl-sidebar-desktop"
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--tl-hairline-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--tl-radius-md)',
            backgroundColor: 'var(--tl-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(204, 120, 92, 0.25)',
          }}
        >
          <Shield size={18} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--tl-font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--tl-ink)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              TrustLayer
            </span>
            <span
              style={{
                fontFamily: 'var(--tl-font-mono)',
                fontSize: '0.625rem',
                color: 'var(--tl-primary)',
                backgroundColor: 'rgba(204, 120, 92, 0.1)',
                padding: '1px 4px',
                borderRadius: 'var(--tl-radius-xs)',
                fontWeight: 500,
              }}
            >
              2.0
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--tl-font-sans)',
              fontSize: '0.6875rem',
              color: 'var(--tl-muted)',
              display: 'block',
              marginTop: '3px',
              letterSpacing: '0.02em',
            }}
          >
            Digital Authenticity & Trust
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div
        style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--tl-muted-soft)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 12px 4px',
          }}
        >
          WORKSPACE
        </div>

        <button
          onClick={() => navigate('/investigations')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isRouteActive('investigations') ? 'var(--tl-ink)' : 'var(--tl-body)',
            backgroundColor: isRouteActive('investigations') ? 'var(--tl-surface-card)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          className="tl-sidebar-link"
        >
          <Files size={16} color={isRouteActive('investigations') ? 'var(--tl-primary)' : 'var(--tl-muted)'} />
          <span>Investigations</span>
        </button>

        <button
          onClick={() => navigate('/investigation/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isRouteActive('investigation-new') ? 'var(--tl-ink)' : 'var(--tl-body)',
            backgroundColor: isRouteActive('investigation-new') ? 'var(--tl-surface-card)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          className="tl-sidebar-link"
        >
          <PlusCircle size={16} color={isRouteActive('investigation-new') ? 'var(--tl-primary)' : 'var(--tl-muted)'} />
          <span>New Investigation</span>
        </button>

        <div
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--tl-muted-soft)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '16px 12px 4px',
          }}
        >
          ACTIVE CASE
        </div>

        <button
          onClick={() => navigate(`/investigation/${currentCaseId}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isRouteActive('investigation-dashboard') ? 'var(--tl-ink)' : 'var(--tl-body)',
            backgroundColor: isRouteActive('investigation-dashboard') ? 'var(--tl-surface-card)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          className="tl-sidebar-link"
        >
          <Layers size={16} color={isRouteActive('investigation-dashboard') ? 'var(--tl-primary)' : 'var(--tl-muted)'} />
          <span>Investigation Overview</span>
        </button>

        <button
          onClick={() => navigate(`/investigation/${currentCaseId}/evidence`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isRouteActive('investigation-evidence') ? 'var(--tl-ink)' : 'var(--tl-body)',
            backgroundColor: isRouteActive('investigation-evidence') ? 'var(--tl-surface-card)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          className="tl-sidebar-link"
        >
          <Shield size={16} color={isRouteActive('investigation-evidence') ? 'var(--tl-primary)' : 'var(--tl-muted)'} />
          <span>Evidence</span>
        </button>

        <button
          onClick={() => navigate(`/investigation/${currentCaseId}/timeline`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isRouteActive('investigation-timeline') ? 'var(--tl-ink)' : 'var(--tl-body)',
            backgroundColor: isRouteActive('investigation-timeline') ? 'var(--tl-surface-card)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          className="tl-sidebar-link"
        >
          <Clock size={16} color={isRouteActive('investigation-timeline') ? 'var(--tl-primary)' : 'var(--tl-muted)'} />
          <span>Timeline</span>
        </button>

        <div
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--tl-muted-soft)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '16px 12px 4px',
          }}
        >
          METHODOLOGY
        </div>

        <button
          onClick={() => navigate('/how-it-works')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--tl-radius-md)',
            fontFamily: 'var(--tl-font-sans)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isRouteActive('how-it-works') ? 'var(--tl-ink)' : 'var(--tl-body)',
            backgroundColor: isRouteActive('how-it-works') ? 'var(--tl-surface-card)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          className="tl-sidebar-link"
        >
          <HelpCircle size={16} color={isRouteActive('how-it-works') ? 'var(--tl-primary)' : 'var(--tl-muted)'} />
          <span>How It Works</span>
        </button>
      </div>

      {/* Active Case Badge in Footer */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--tl-hairline)',
          backgroundColor: 'var(--tl-surface-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: 'var(--tl-font-mono)', fontSize: '0.625rem', color: 'var(--tl-muted)', letterSpacing: '0.06em' }}>
            SELECTED CASE
          </span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--tl-accent-teal)' }} />
        </div>
        <div
          style={{
            fontFamily: 'var(--tl-font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--tl-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/investigation/${currentCaseId}`)}
        >
          <span>{currentCaseId}</span>
          <ChevronRight size={14} color="var(--tl-muted)" />
        </div>
      </div>
    </aside>
  );
};

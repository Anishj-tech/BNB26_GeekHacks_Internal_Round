import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export const TrustLayerShell = ({
  children,
  activeInvestigationId,
  title,
  breadcrumbs = [],
  showSidebar = true,
  maxWidth = '1280px',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--tl-canvas)',
        color: 'var(--tl-ink)',
      }}
      className="tl-shell-layout"
    >
      {/* Left Sidebar (Desktop) */}
      {showSidebar && <Sidebar activeInvestigationId={activeInvestigationId} />}

      {/* Main Investigation Workspace Column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: 'var(--tl-canvas)',
        }}
      >
        <TopNav title={title} breadcrumbs={breadcrumbs} />

        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth,
            margin: '0 auto',
            padding: '32px 24px 64px',
            boxSizing: 'border-box',
          }}
          className="tl-workspace-main"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

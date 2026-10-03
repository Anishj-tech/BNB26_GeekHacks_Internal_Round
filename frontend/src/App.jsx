import { RouterProvider, useRouter } from './router';
import { LandingRoute } from './pages/LandingRoute';
import { InvestigationNewRoute } from './pages/InvestigationNewRoute';
import { InvestigationDashboardRoute } from './pages/InvestigationDashboardRoute';
import { EvidenceExplorerRoute } from './pages/EvidenceExplorerRoute';
import { TimelineRoute } from './pages/TimelineRoute';
import { InvestigationHistoryRoute } from './pages/InvestigationHistoryRoute';
import { HowItWorksRoute } from './pages/HowItWorksRoute';
import './App.css';

function AppRoutes() {
  const { route } = useRouter();

  switch (route.name) {
    case 'landing':
      return <LandingRoute />;
    case 'investigation-new':
      return <InvestigationNewRoute />;
    case 'investigation-dashboard':
      return <InvestigationDashboardRoute />;
    case 'investigation-evidence':
      return <EvidenceExplorerRoute />;
    case 'investigation-timeline':
      return <TimelineRoute />;
    case 'investigations':
      return <InvestigationHistoryRoute />;
    case 'how-it-works':
      return <HowItWorksRoute />;
    default:
      return <LandingRoute />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

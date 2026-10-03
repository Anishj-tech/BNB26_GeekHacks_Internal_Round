/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from 'react';

const RouterContext = createContext(null);

export function parseRoute() {
  // Check hash first (e.g. #/investigation/INV-2026-001) then pathname
  let path = '/';
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    path = window.location.hash.slice(1);
  } else if (window.location.pathname && window.location.pathname !== '/') {
    path = window.location.pathname;
  }

  // Remove trailing slash if not root
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  // Route pattern matching
  if (path === '' || path === '/') {
    return { name: 'landing', path: '/', params: {} };
  }
  if (path === '/how-it-works') {
    return { name: 'how-it-works', path, params: {} };
  }
  if (path === '/investigations') {
    return { name: 'investigations', path, params: {} };
  }
  if (path === '/investigation/new') {
    return { name: 'investigation-new', path, params: {} };
  }

  // /investigation/:id/evidence
  const evidenceMatch = path.match(/^\/investigation\/([^/]+)\/evidence$/);
  if (evidenceMatch) {
    return { name: 'investigation-evidence', path, params: { id: evidenceMatch[1] } };
  }

  // /investigation/:id/timeline
  const timelineMatch = path.match(/^\/investigation\/([^/]+)\/timeline$/);
  if (timelineMatch) {
    return { name: 'investigation-timeline', path, params: { id: timelineMatch[1] } };
  }

  // /investigation/:id
  const dashboardMatch = path.match(/^\/investigation\/([^/]+)$/);
  if (dashboardMatch) {
    return { name: 'investigation-dashboard', path, params: { id: dashboardMatch[1] } };
  }

  // Default fallback
  return { name: 'landing', path: '/', params: {} };
}

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(() => parseRoute());

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (to) => {
    // Standardize to hash route for flawless single-page app support without server 404s
    const targetHash = `#${to.startsWith('/') ? to : '/' + to}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      // Force update if hash was same
      setRoute(parseRoute());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

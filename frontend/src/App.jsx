import { useState } from 'react';
import { LandingPage } from './landing/LandingPage';
import { UploadInvestigationPage } from './upload/UploadInvestigationPage';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  const navigateToUpload = () => {
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'upload') {
    return <UploadInvestigationPage onBack={navigateToLanding} />;
  }

  return <LandingPage onStartInvestigation={navigateToUpload} />;
}

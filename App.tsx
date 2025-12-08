
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Interactive/ToastContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { NationalJobsPortal } from './components/NationalJobsPortal';
import { TrainingCenter } from './components/TrainingCenter';
import { ServicesMarketplace } from './components/ServicesMarketplace';
import { HarajPortal } from './components/HarajPortal';
import { MuradGroupPortal } from './components/Corporate/MuradGroupPortal';
import { SupportPortal } from './components/Support/SupportPortal';
import { MilafBot } from './components/Interactive/MilafBot';
import { UniversalProfileHub } from './components/Nexus/UniversalProfileHub';
import { SEOHelmet } from './components/SEOHelmet';

// New Imports
import { MuradMeta } from './components/Meta/MuradMeta';
import { CloudMarketing } from './components/Cloud/CloudMarketing';
import { MuradCloud } from './components/Cloud/MuradCloud';
import { MuradDopamine } from './components/Dopamine/MuradDopamine';
import { MuradDomain } from './components/Domain/MuradDomain';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [showProfile, setShowProfile] = useState(false);

  // Simple Router
  const navigate = (view: string) => {
    window.history.pushState({}, '', view === 'landing' ? '/' : `/${view}`);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (path) setCurrentView(path);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'jobs': return <NationalJobsPortal onBack={() => navigate('landing')} />;
      case 'academy': return <TrainingCenter onClose={() => navigate('landing')} />;
      case 'market': return <ServicesMarketplace isOpen={true} onClose={() => navigate('landing')} />;
      case 'haraj': return <HarajPortal onBack={() => navigate('landing')} />;
      case 'corporate': return <MuradGroupPortal onNavigate={navigate} />;
      case 'support': return <SupportPortal onExit={() => navigate('landing')} />;
      case 'profile': return <UniversalProfileHub isOpen={true} onClose={() => navigate('landing')} />;
      
      // New Routes
      case 'meta': return <MuradMeta onExit={() => navigate('landing')} />;
      case 'clock-system': return <CloudMarketing onNavigate={navigate} />;
      case 'cloud': return <MuradCloud onExit={() => navigate('landing')} />;
      case 'dopamine': return <MuradDopamine onExit={() => navigate('landing')} />;
      case 'domains': return <MuradDomain onExit={() => navigate('landing')} />;
      
      default: return <LandingPage onStart={() => navigate('academy')} onSearch={() => {}} onOpenJobs={() => navigate('jobs')} onOpenTraining={() => navigate('academy')} onOpenMarket={() => navigate('market')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-gray-100 font-sans">
      <SEOHelmet title="مجموعة ميلاف مراد" />
      
      {/* Conditionally hide Header/Footer for immersive views if needed, otherwise show everywhere except specific portals */}
      {currentView !== 'support' && currentView !== 'corporate' && currentView !== 'clock-system' && currentView !== 'meta' && currentView !== 'cloud' && currentView !== 'dopamine' && currentView !== 'domains' && (
        <Header onNavigate={navigate} />
      )}

      <main className="flex-1 relative">
        {renderView()}
      </main>

      {currentView !== 'support' && currentView !== 'corporate' && currentView !== 'clock-system' && currentView !== 'meta' && currentView !== 'cloud' && currentView !== 'dopamine' && currentView !== 'domains' && (
        <Footer />
      )}
      
      <MilafBot />
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

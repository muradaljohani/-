
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Interactive/ToastContext';
import { UnifiedPortalGate } from './components/Nexus/UnifiedPortalGate';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { NationalJobsPortal } from './components/NationalJobsPortal';
import { TrainingCenter } from './components/TrainingCenter';
import { ServicesMarketplace } from './components/ServicesMarketplace';
import { HarajPortal } from './components/HarajPortal';
import { OmniCommand } from './components/Nexus/OmniCommand';
import { GodModeHUD } from './components/GodModeHUD';
import { UpsellModal } from './components/Subscription/UpsellModal';
import { MuradOS } from './components/MuradOS';
import { Trap } from './services/IronDome/Trap';
import { Enterprise } from './services/Enterprise/EnterpriseCore';
import { NexusBrain } from './services/Nexus/NexusBrain';
import { BridgeToast } from './components/Nexus/BridgeToast';
import { PublishPortal } from './components/PublishPortal';
import { MilafBot } from './components/Interactive/MilafBot';
import { CyberPreloader } from './components/Interactive/CyberPreloader';
import { UniversalProfileHub } from './components/Nexus/UniversalProfileHub';

const AppContent = () => {
  const { user, isAuthenticated, checkUpsellTrigger, showLoginModal, setShowLoginModal } = useAuth();
  
  // Navigation State
  const [currentView, setCurrentView] = useState('landing');
  const [showOmni, setShowOmni] = useState(false);
  
  // Modals
  const [showProfileHub, setShowProfileHub] = useState(false);
  const [upsellReason, setUpsellReason] = useState<'HeavySeller' | 'JobSeeker' | 'Learner' | null>(null);
  const [bridgeRec, setBridgeRec] = useState<any>(null);
  
  // Loading
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    Enterprise.init();
    const brain = NexusBrain.getInstance();
    const handleRec = (rec: any) => setBridgeRec(rec);
    brain.subscribe(handleRec);
    
    if (user) {
        const trigger = checkUpsellTrigger();
        if (trigger.showUpsell && trigger.reason) {
            setUpsellReason(trigger.reason);
        }
    }

    return () => { brain.unsubscribe(handleRec); };
  }, [user]);

  const handleCyberNavigate = (view: string) => {
      if (view === currentView) return;
      setIsPreloading(true);
      setTimeout(() => {
          setCurrentView(view);
          setIsPreloading(false);
      }, 1000);
  };

  const handleHoneypot = () => {
      Trap.getInstance().activateTrap('App_Honeypot');
  };

  return (
    <div className="flex flex-col h-dvh bg-[#0f172a] text-gray-100 font-sans overflow-hidden">
      
      {/* 1. GLOBAL HEADER */}
      <Header 
        isLanding={currentView === 'landing'}
        onOpenOmni={() => setShowOmni(true)} 
        onNewChat={() => handleCyberNavigate('landing')}
        onOpenJobs={() => handleCyberNavigate('jobs')}
        onOpenAcademy={() => handleCyberNavigate('academy')}
        onOpenHaraj={() => handleCyberNavigate('haraj')}
        onOpenMarket={() => handleCyberNavigate('market')}
        onOpenTraining={() => handleCyberNavigate('training')}
        onOpenPublish={() => handleCyberNavigate('publish')}
        onOpenBusiness={() => setShowProfileHub(true)} // Profile Trigger
      />
      
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {currentView === 'landing' && (
              <LandingPage 
                  onStart={() => handleCyberNavigate('training')} 
                  onSearch={() => {}} 
                  onOpenJobs={() => handleCyberNavigate('jobs')} 
                  onOpenTraining={() => handleCyberNavigate('training')} 
                  onOpenMarket={() => handleCyberNavigate('market')} 
              />
          )}
          {currentView === 'jobs' && <NationalJobsPortal onBack={() => handleCyberNavigate('landing')} />}
          {currentView === 'training' && <TrainingCenter onClose={() => handleCyberNavigate('landing')} />}
          {currentView === 'academy' && <TrainingCenter onClose={() => handleCyberNavigate('landing')} />} // Unified for now
          {currentView === 'market' && <ServicesMarketplace isOpen={true} onClose={() => handleCyberNavigate('landing')} />}
          {currentView === 'haraj' && <HarajPortal onBack={() => handleCyberNavigate('landing')} />}
          {currentView === 'publish' && <PublishPortal onBack={() => handleCyberNavigate('landing')} />}
      </main>

      {/* 3. GLOBAL MODALS (The Layers) */}
      
      {/* The Nexus Gate (Login) */}
      <UnifiedPortalGate 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
              setShowLoginModal(false);
              setShowProfileHub(true); // Open profile on login
          }} 
      />

      {/* The Universal Profile Hub */}
      <UniversalProfileHub 
          isOpen={showProfileHub} 
          onClose={() => setShowProfileHub(false)} 
      />

      {/* Other Overlays */}
      <OmniCommand isOpen={showOmni} onClose={() => setShowOmni(false)} onNavigate={(type) => handleCyberNavigate(type === 'Job' ? 'jobs' : type === 'Course' ? 'training' : 'market')} />
      <GodModeHUD />
      <MuradOS />
      {upsellReason && <UpsellModal reason={upsellReason} onClose={() => setUpsellReason(null)} onUpgrade={() => {}} />}
      <BridgeToast recommendation={bridgeRec} onClose={() => setBridgeRec(null)} onAction={(link) => handleCyberNavigate(link)} />
      
      {/* Interactive Layers */}
      <MilafBot />
      <CyberPreloader isActive={isPreloading} />

      {/* Security Honeypot */}
      <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <input type="text" name="honeypot_field_x" onChange={handleHoneypot} tabIndex={-1} autoComplete="off" />
      </div>
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

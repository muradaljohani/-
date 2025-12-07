
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
import { VisualSitemap } from './components/VisualSitemap';
import { SupportPortal } from './components/Support/SupportPortal';
import { MuradGroupPortal } from './components/Corporate/MuradGroupPortal';
import { MuradDopamine } from './components/Dopamine/MuradDopamine';
import { MuradCloud } from './components/Cloud/MuradCloud';
import { CloudMarketing } from './components/Cloud/CloudMarketing';
import { MuradDomain } from './components/Domain/MuradDomain'; 
import { MuradClockLanding } from './components/MuradClockLanding';
import { MuradMeta } from './components/Meta/MuradMeta';
import { ChevronLeft, Home } from 'lucide-react';
import { SEOHelmet } from './components/SEOHelmet';

// --- BREADCRUMBS COMPONENT (Hierarchical UI) ---
const Breadcrumbs = ({ currentView, onNavigate }: { currentView: string, onNavigate: (view: string) => void }) => {
    if (currentView === 'landing' || currentView === 'support' || currentView === 'group' || currentView === 'dopamine' || currentView === 'cloud' || currentView === 'cloud-system' || currentView === 'domains' || currentView === 'murad-clock' || currentView === 'meta') return null;

    const map: Record<string, string> = {
        'jobs': 'بوابة الوظائف',
        'academy': 'الأكاديمية والتدريب',
        'training': 'الأكاديمية والتدريب',
        'market': 'سوق الخدمات',
        'haraj': 'الحراج الإلكتروني',
        'publish': 'بوابة النشر',
        'sitemap': 'خريطة الموقع',
        'domains': 'حجز النطاقات',
        'murad-clock': 'مراد كلوك',
        'meta': 'مراد ميتا'
    };
    
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const section = pathSegments[0] || currentView;
    const label = map[section as keyof typeof map] || section;

    return (
        <nav aria-label="Breadcrumb" className="bg-[#0f172a] border-b border-white/5 px-4 py-2 sticky top-16 z-30">
            <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400 font-medium overflow-hidden whitespace-nowrap">
                <button onClick={() => onNavigate('landing')} className="hover:text-white flex items-center gap-1" aria-label="Back to Home">
                    <Home className="w-3 h-3"/> الرئيسية
                </button>
                <ChevronLeft className="w-3 h-3 rtl:rotate-180 text-gray-600"/>
                <span className="text-blue-400 font-bold">{label}</span>
            </div>
        </nav>
    );
};

const AppContent = () => {
  const { user, checkUpsellTrigger, showLoginModal, setShowLoginModal } = useAuth();
  
  // Navigation State
  const [currentView, setCurrentView] = useState('landing');
  const [showOmni, setShowOmni] = useState(false);
  const [showProfileHub, setShowProfileHub] = useState(false);
  const [upsellReason, setUpsellReason] = useState<'HeavySeller' | 'JobSeeker' | 'Learner' | null>(null);
  const [bridgeRec, setBridgeRec] = useState<any>(null);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // Whitelist valid routes
  const validRoutes = ['jobs', 'academy', 'training', 'market', 'haraj', 'publish', 'sitemap', 'support', 'group', 'corporate', 'dopamine', 'cloud', 'cloud-system', 'domains', 'murad-clock', 'meta', 'verify', 'policy', 'reset-password', 'reset', 'about', 'services', 'contact', 'login'];

  // --- SMART ROUTER (DEEP LINK HANDLER) ---
  useEffect(() => {
    const handlePathChange = () => {
        const path = window.location.pathname.toLowerCase();
        const segments = path.split('/').filter(Boolean);
        const root = segments[0];

        if (validRoutes.includes(root)) {
            if (root === 'training') setCurrentView('academy');
            else if (root === 'corporate') setCurrentView('group');
            else if (root === 'reset-password') setCurrentView('reset');
            
            // Map new AI routes
            else if (root === 'about') {
                // Smart Route: Redirect to corporate about page
                window.history.replaceState({}, '', '/group/about');
                setCurrentView('group');
            }
            else if (root === 'contact') {
                 window.history.replaceState({}, '', '/group/contact');
                 setCurrentView('group');
            }
            else if (root === 'services') {
                 // "Services" usually implies the Marketplace
                 window.history.replaceState({}, '', '/market');
                 setCurrentView('market');
            }
            else if (root === 'login') {
                 // Handle login route by showing modal and staying on landing or redirecting
                 window.history.replaceState({}, '', '/');
                 setCurrentView('landing');
                 setShowLoginModal(true);
            }
            else setCurrentView(root);
        } else {
            setCurrentView('landing');
        }
    };

    handlePathChange(); 
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

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
      if (view === currentView && window.location.pathname === `/${view}`) return;
      setIsPreloading(true);
      
      const path = view === 'landing' ? '/' : view.startsWith('/') ? view : `/${view}`;
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate')); 
      
      const viewName = path === '/' ? 'landing' : path.split('/')[1];
      setTimeout(() => {
          setCurrentView(viewName);
          setIsPreloading(false);
          window.scrollTo(0, 0);
      }, 300); 
  };

  const handleHoneypot = () => {
      Trap.getInstance().activateTrap('App_Honeypot');
  };

  // Handle Landing Page Search -> Trigger MilafBot
  const handleSmartSearch = (query: string) => {
    // Dispatch event to open MilafBot with specific query
    window.dispatchEvent(new CustomEvent('open-milaf-chat', { detail: { query } }));
  };

  // SEO PATH HELPER
  const getHelmet = () => {
    switch(currentView) {
        case 'jobs': return <SEOHelmet title="بوابة الوظائف الوطنية" description="أضخم بوابة للوظائف الحكومية والخاصة في السعودية." path="/jobs" type="Collection" />;
        case 'academy': return <SEOHelmet title="أكاديمية ميلاف للتدريب" description="دورات تدريبية معتمدة بشهادات مهنية دولية." path="/academy" type="Collection" />;
        case 'market': return <SEOHelmet title="سوق الخدمات الرقمية" description="منصة العمل الحر لبيع وشراء الخدمات المصغرة." path="/market" type="Collection" />;
        case 'haraj': return <SEOHelmet title="حراج ميلاف الإلكتروني" description="سوق بيع وشراء السيارات والعقارات والأجهزة." path="/haraj" type="Collection" />;
        case 'domains': return <SEOHelmet title="مراد دومين | حجز نطاقات" description="حجز نطاقات واستضافة مواقع بأسعار منافسة. الوكيل الرسمي للنطاق السعودي." path="/domains" type="Product" />;
        case 'sitemap': return <SEOHelmet title="خريطة الموقع الشاملة" description="فهرس شامل لجميع روابط وأقسام منصة ميلاف." path="/sitemap" type="General" />;
        case 'cloud': return <SEOHelmet title="ميلاف كلاود | المدونة التقنية" description="مقالات تقنية متخصصة في البرمجة والذكاء الاصطناعي." path="/cloud" type="Article" />;
        case 'cloud-system': return <SEOHelmet title="نظام مراد كلوك" description="النظام الذكي لإدارة الوقت والعمليات." path="/cloud-system" type="Product" />;
        case 'murad-clock': return <SEOHelmet title="مراد كلوك | Murad Clock" description="نبض الذكاء الاصطناعي لأكاديميتك. نظام إدارة الوقت والمهام." path="/murad-clock" type="Product" />;
        case 'meta': return <SEOHelmet title="مراد ميتا | أدوات الملفات" description="مجموعة أدوات تحويل ومعالجة الملفات (PDF Tools). مجاني وسريع." path="/meta" type="Product" />;
        default: return <SEOHelmet title="مجموعة ميلاف مراد" description="المنصة الوطنية الموحدة للتوظيف والتدريب والخدمات الرقمية." path="/" type="General" />;
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-[#0f172a] text-gray-100 font-sans overflow-hidden">
      
      {getHelmet()}
      
      {/* Header logic: Hide global header on standalone systems */}
      {currentView !== 'sitemap' && currentView !== 'support' && currentView !== 'group' && currentView !== 'dopamine' && currentView !== 'cloud' && currentView !== 'cloud-system' && currentView !== 'domains' && currentView !== 'murad-clock' && currentView !== 'meta' && (
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
            onOpenDomains={() => handleCyberNavigate('domains')}
            onOpenCloud={() => handleCyberNavigate('cloud-system')}
            onOpenMuradClock={() => handleCyberNavigate('murad-clock')}
            onOpenBusiness={() => setShowProfileHub(true)} 
          />
      )}

      <Breadcrumbs currentView={currentView} onNavigate={handleCyberNavigate} />
      
      {/* MAIN SEMANTIC CONTAINER */}
      <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" role="main">
          {currentView === 'landing' && (
              <LandingPage 
                  onStart={() => handleCyberNavigate('training')} 
                  onSearch={handleSmartSearch} 
                  onOpenJobs={() => handleCyberNavigate('jobs')} 
                  onOpenTraining={() => handleCyberNavigate('training')} 
                  onOpenMarket={() => handleCyberNavigate('market')} 
              />
          )}
          {currentView === 'jobs' && <NationalJobsPortal onBack={() => handleCyberNavigate('landing')} />}
          {(currentView === 'training' || currentView === 'academy') && <TrainingCenter onClose={() => handleCyberNavigate('landing')} />}
          {currentView === 'market' && <ServicesMarketplace isOpen={true} onClose={() => handleCyberNavigate('landing')} />}
          {currentView === 'haraj' && <HarajPortal onBack={() => handleCyberNavigate('landing')} />}
          {currentView === 'publish' && <PublishPortal onBack={() => handleCyberNavigate('landing')} />}
          {currentView === 'sitemap' && <VisualSitemap onBack={() => handleCyberNavigate('landing')} />}
          {currentView === 'support' && <SupportPortal onExit={() => handleCyberNavigate('landing')} />}
          {currentView === 'group' && <MuradGroupPortal onNavigate={handleCyberNavigate} />}
          {currentView === 'dopamine' && <MuradDopamine onExit={() => handleCyberNavigate('landing')} />}
          {currentView === 'cloud' && <MuradCloud onExit={() => handleCyberNavigate('landing')} />}
          {currentView === 'cloud-system' && <CloudMarketing onNavigate={handleCyberNavigate} />}
          {currentView === 'domains' && <MuradDomain onExit={() => handleCyberNavigate('landing')} />}
          {currentView === 'murad-clock' && <MuradClockLanding />}
          {currentView === 'meta' && <MuradMeta onExit={() => handleCyberNavigate('landing')} />}
          
          {/* Fallback for utility pages */}
          {(currentView === 'verify' || currentView === 'policy' || currentView === 'reset') && (
             <div className="flex items-center justify-center h-full">
                 <div className="text-center">
                     <h2 className="text-2xl font-bold text-white mb-2">صفحة النظام</h2>
                     <p className="text-gray-400">جاري تحميل الوحدة المطلوبة...</p>
                     <button onClick={() => handleCyberNavigate('landing')} className="mt-4 px-4 py-2 bg-blue-600 rounded text-white">العودة</button>
                 </div>
             </div>
          )}
      </main>

      {/* GLOBAL MODALS & LAYERS */}
      <UnifiedPortalGate 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => { setShowLoginModal(false); setShowProfileHub(true); }} 
      />
      <UniversalProfileHub isOpen={showProfileHub} onClose={() => setShowProfileHub(false)} />
      <OmniCommand isOpen={showOmni} onClose={() => setShowOmni(false)} onNavigate={(type) => handleCyberNavigate(type === 'Job' ? 'jobs' : type === 'Course' ? 'training' : 'market')} />
      <GodModeHUD />
      <MuradOS />
      {upsellReason && <UpsellModal reason={upsellReason} onClose={() => setUpsellReason(null)} onUpgrade={() => {}} />}
      <BridgeToast recommendation={bridgeRec} onClose={() => setBridgeRec(null)} onAction={(link) => handleCyberNavigate(link)} />
      
      {/* Bot Logic: Ensure bot is always available except maybe on pure text pages, but user requested "Keep bot" */}
      <MilafBot /> 
      <CyberPreloader isActive={isPreloading} />

      <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <input type="text" name="honeypot_field_x" aria-hidden="true" onChange={handleHoneypot} tabIndex={-1} autoComplete="off" />
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

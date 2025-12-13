
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Interactive/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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
import { SmartAssistantPage } from './components/SmartAssistantPage';
import { MuradDopamine } from './components/Dopamine/MuradDopamine';
import { MuradDomain } from './components/Domain/MuradDomain';
import { UserFieldsDashboard } from './components/UserFieldsDashboard';
import { CoursesList } from './components/CoursesList';
import { CourseView } from './components/CourseView';
import { VisualSitemap } from './components/VisualSitemap';
import { SocialLayout } from './components/Social/SocialLayout';
import { PublishPortal } from './components/PublishPortal';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [socialSubView, setSocialSubView] = useState<string | undefined>(undefined);
  const { theme, cycleTheme } = useTheme();

  // --- HASH ROUTER LOGIC ---
  const navigate = (view: string) => {
    let path = view;
    
    // Normalize path to start with /
    if (!path.startsWith('/')) path = `/${path}`;
    
    // Handle Special Cases
    if (view === 'landing') path = '/';
    
    // Update URL hash
    window.location.hash = path;
  };

  useEffect(() => {
    const handleHashChange = () => {
        // Get path from hash, removing the #
        const hash = window.location.hash.slice(1);
        const path = hash || '/'; // Default to root if empty

        // Clean query params for view matching if any
        const pathNoQuery = path.split('?')[0];
        
        console.log(`[Router] Navigating to: ${path}`);

        if (pathNoQuery === '/' || pathNoQuery === '') {
            setCurrentView('landing');
        } else if (pathNoQuery.startsWith('/courses/')) {
            const id = pathNoQuery.split('/')[2];
            if (id) {
                setCourseId(id);
                setCurrentView('course-view');
            } else {
                setCurrentView('courses');
            }
        } else if (pathNoQuery.startsWith('/social')) {
             // Handle sub-routes like /social/elite
             const parts = pathNoQuery.split('/');
             const sub = parts.length > 2 ? parts.slice(2).join('/') : undefined;
             setSocialSubView(sub);
             setCurrentView('social');
        } else if (pathNoQuery.startsWith('/group/blog/')) {
             // Let the component handle deeper state if needed, or route specifically
             setCurrentView('group'); // group portal handles internal routing via its own state usually, or we pass path
        } else {
            // Strip leading slash
            const viewName = pathNoQuery.substring(1);
            
            // Map known views
            if (viewName === 'jobs') setCurrentView('jobs');
            else if (viewName === 'academy') setCurrentView('academy');
            else if (viewName === 'market') setCurrentView('market');
            else if (viewName === 'haraj') setCurrentView('haraj');
            else if (viewName === 'assistant') setCurrentView('assistant');
            // ... map other views
            else setCurrentView(viewName);
        }
        
        // Scroll to top on nav
        window.scrollTo(0, 0);
    };

    // Listen to hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial Load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'jobs': return <NationalJobsPortal onBack={() => navigate('landing')} />;
      case 'academy': return <TrainingCenter onClose={() => navigate('landing')} />;
      case 'training': return <TrainingCenter onClose={() => navigate('landing')} />;
      case 'market': return <ServicesMarketplace isOpen={true} onClose={() => navigate('landing')} />;
      case 'haraj': return <HarajPortal onBack={() => navigate('landing')} />;
      case 'corporate': 
      case 'group': return <MuradGroupPortal onNavigate={navigate} />;
      case 'support': return <SupportPortal onExit={() => navigate('landing')} />;
      case 'meta': return <MuradMeta onExit={() => navigate('landing')} />;
      case 'cloud': return <CloudMarketing onNavigate={navigate} />;
      case 'assistant': return <SmartAssistantPage onBack={() => navigate('landing')} />;
      case 'dopamine': return <MuradDopamine onExit={() => navigate('landing')} />;
      case 'domains': return <MuradDomain onExit={() => navigate('landing')} />;
      case 'profile': return <UniversalProfileHub isOpen={true} onClose={() => navigate('landing')} />;
      case 'settings': return <UserFieldsDashboard onBack={() => navigate('landing')} />;
      case 'courses': return <CoursesList onBack={() => navigate('academy')} />;
      case 'course-view': return courseId ? <CourseView courseId={courseId} onBack={() => navigate('courses')} /> : <CoursesList onBack={() => navigate('academy')} />;
      case 'sitemap': return <VisualSitemap onBack={() => navigate('landing')} />;
      case 'social': return <SocialLayout onBack={() => navigate('landing')} initialView={socialSubView} />;
      case 'publish': return <PublishPortal onBack={() => navigate('landing')} />;
      
      // Fallback Routing
      default:
        // Check prefixes again for default routing logic
        if (currentView.startsWith('group')) return <MuradGroupPortal onNavigate={navigate} />;
        if (currentView.startsWith('cloud')) return <CloudMarketing onNavigate={navigate} />;
        if (currentView.startsWith('dopamine')) return <MuradDopamine onExit={() => navigate('landing')} />;
        if (currentView.startsWith('support')) return <SupportPortal onExit={() => navigate('landing')} />;
        
        // Landing Page (Default)
        return (
          <>
            <Header 
              onNavigate={navigate} 
              theme={theme === 'light' ? 'light' : 'dark'} 
              toggleTheme={cycleTheme} 
            />
            <LandingPage 
                onStart={() => navigate('profile')} 
                onSearch={(q) => {
                    // Redirect search to Smart Assistant
                    console.log("Searching for:", q);
                    navigate('assistant');
                }}
                onOpenTraining={() => navigate('academy')}
                onOpenJobs={() => navigate('jobs')}
                onOpenMarket={() => navigate('market')}
            />
            <Footer />
            <MilafBot />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] transition-colors duration-200 font-sans">
       <SEOHelmet title="Mylaf Murad | National Platform" />
       {renderView()}
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
             <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
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
import { MuradDopamine } from './components/Dopamine/MuradDopamine';
import { MuradDomain } from './components/Domain/MuradDomain';
import { UserFieldsDashboard } from './components/UserFieldsDashboard';
import { CoursesList } from './components/CoursesList';
import { CourseView } from './components/CourseView';
import { VisualSitemap } from './components/VisualSitemap';
import { SocialLayout } from './components/Social/SocialLayout';
import { PublishPortal } from './components/PublishPortal';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [courseId, setCourseId] = useState<string | null>(null);
  const { theme, cycleTheme } = useTheme();

  // Simple Router
  const navigate = (view: string) => {
    if (view.startsWith('courses/')) {
        const id = view.split('/')[1];
        setCourseId(id);
        setCurrentView('course-view');
        window.history.pushState({}, '', `/courses/${id}`);
    } else {
        window.history.pushState({}, '', view === 'landing' ? '/' : `/${view}`);
        setCurrentView(view);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
        setCurrentView('landing');
    } else if (path.startsWith('/courses/')) {
        const id = path.split('/')[2];
        if (id) {
            setCourseId(id);
            setCurrentView('course-view');
        } else {
            setCurrentView('courses');
        }
    } else {
        // Strip leading slash
        const viewName = path.substring(1);
        setCurrentView(viewName || 'landing');
    }

    const handlePopState = () => {
        const p = window.location.pathname;
        if (p.startsWith('/courses/')) {
             setCourseId(p.split('/')[2]);
             setCurrentView('course-view');
        } else {
             const viewName = p.substring(1);
             setCurrentView(viewName || 'landing');
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
      case 'cloud': 
      case 'clock-system': return <CloudMarketing onNavigate={navigate} />;
      case 'dopamine': return <MuradDopamine onExit={() => navigate('landing')} />;
      case 'domains': return <MuradDomain onExit={() => navigate('landing')} />;
      case 'profile': return <UniversalProfileHub isOpen={true} onClose={() => navigate('landing')} />;
      case 'settings': return <UserFieldsDashboard onBack={() => navigate('landing')} />;
      case 'courses': return <CoursesList onBack={() => navigate('academy')} />;
      case 'course-view': return courseId ? <CourseView courseId={courseId} onBack={() => navigate('courses')} /> : <CoursesList onBack={() => navigate('academy')} />;
      case 'sitemap': return <VisualSitemap onBack={() => navigate('landing')} />;
      case 'social': return <SocialLayout onBack={() => navigate('landing')} />;
      case 'publish': return <PublishPortal onBack={() => navigate('landing')} />;
      
      // Handle nested routes for group/cloud/dopamine by matching prefix
      default:
        if (currentView.startsWith('group')) return <MuradGroupPortal onNavigate={navigate} />;
        if (currentView.startsWith('cloud')) return <CloudMarketing onNavigate={navigate} />;
        if (currentView.startsWith('dopamine')) return <MuradDopamine onExit={() => navigate('landing')} />;
        if (currentView.startsWith('support')) return <SupportPortal onExit={() => navigate('landing')} />;
        if (currentView.startsWith('social')) return <SocialLayout onBack={() => navigate('landing')} />;
        return (
          <>
            <Header 
              onNavigate={navigate} 
              theme={theme === 'light' ? 'light' : 'dark'} 
              toggleTheme={cycleTheme} 
            />
            <LandingPage 
                onStart={() => navigate('profile')} 
                onSearch={(q) => console.log(q)}
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
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

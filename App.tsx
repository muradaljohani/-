
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Interactive/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
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
import { UserFieldsDashboard } from './components/UserFieldsDashboard';
import { CoursesList } from './components/CoursesList';
import { CourseView } from './components/CourseView';
import { VisualSitemap } from './components/VisualSitemap';
import { SocialLayout } from './components/Social/SocialLayout';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [courseId, setCourseId] = useState<string | null>(null);
  
  // Theme State (Default Dark)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      // Toggle class on HTML element for global Tailwind Dark Mode
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('murad_theme', newTheme);
  };

  // Initialize Theme
  useEffect(() => {
      const savedTheme = localStorage.getItem('murad_theme') as 'dark' | 'light';
      if (savedTheme) {
          setTheme(savedTheme);
          document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
          // Default to dark
          document.documentElement.classList.add('dark');
          setTheme('dark');
      }
  }, []);

  // Simple Router
  const navigate = (view: string) => {
    // Handle parameterized routes manually for simple router
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
        setCurrentView(path.replace('/', ''));
    }

    // Listener for internal navigation events if needed
    const handlePopState = () => {
        const p = window.location.pathname;
        if (p.startsWith('/courses/')) {
             setCourseId(p.split('/')[2]);
             setCurrentView('course-view');
        } else {
             setCurrentView(p.replace('/', '') || 'landing');
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
      case 'sitemap': return <VisualSitemap onBack={() => navigate('landing')} />;
      case 'user-dashboard': return <UserFieldsDashboard onBack={() => navigate('landing')} />;
      case 'courses': return <CoursesList onBack={() => navigate('landing')} />;
      case 'course-view': return <CourseView courseId={courseId!} onBack={() => navigate('courses')} />;
      
      // SOCIAL PLATFORM
      case 'social': return <SocialLayout onBack={() => navigate('landing')} />;

      default: return <LandingPage onStart={() => navigate('academy')} onSearch={() => {}} onOpenJobs={() => navigate('jobs')} onOpenTraining={() => navigate('academy')} onOpenMarket={() => navigate('market')} />;
    }
  };

  // Certain immersive views might want to hide the global header
  const isImmersive = ['clock-system', 'dopamine', 'social'].includes(currentView);

  return (
    // STRICT COLOR LOGIC: 
    // Light Mode: bg-white, text-slate-900 (Dark Gray/Black)
    // Dark Mode: bg-[#0f172a] (Dark Blue/Black), text-white
    <div className="flex flex-col min-h-screen font-sans transition-colors duration-300 bg-white text-slate-900 dark:bg-[#0f172a] dark:text-white">
      <SEOHelmet title="مجموعة ميلاف مراد" />
      
      {!isImmersive && (
        <Header onNavigate={navigate} theme={theme} toggleTheme={toggleTheme} />
      )}

      <main className="flex-1 relative">
        {renderView()}
      </main>

      {!isImmersive && (
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
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

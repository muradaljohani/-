
import React, { useState, useEffect, createContext, useContext } from 'react';
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

// --- THEME ENGINE ---
export type ThemeMode = 'light' | 'dim' | 'lights-out';

interface ThemeContextType {
  theme: ThemeMode;
  cycleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ theme: 'lights-out', cycleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

const AppContent = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [courseId, setCourseId] = useState<string | null>(null);

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
        setCurrentView(path.replace('/', ''));
    }

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
      case 'meta': return <MuradMeta onExit={() => navigate('landing')} />;
      case 'clock-system': return <CloudMarketing onNavigate={navigate} />;
      case 'cloud': return <MuradCloud onExit={() => navigate('landing')} />;
      case 'dopamine': return <MuradDopamine onExit={() => navigate('landing')} />;
      case 'domains': return <MuradDomain onExit={() => navigate('landing')} />;
      case 'sitemap': return <VisualSitemap onBack={() => navigate('landing')} />;
      case 'user-dashboard': return <UserFieldsDashboard onBack={() => navigate('landing')} />;
      case 'courses': return <CoursesList onBack={() => navigate('landing')} />;
      case 'course-view': return <CourseView courseId={courseId!} onBack={() => navigate('courses')} />;
      case 'social': return <SocialLayout onBack={() => navigate('landing')} />;
      default: return <LandingPage onStart={() => navigate('academy')} onSearch={() => {}} onOpenJobs={() => navigate('jobs')} onOpenTraining={() => navigate('academy')} onOpenMarket={() => navigate('market')} />;
    }
  };

  const isImmersive = ['clock-system', 'dopamine', 'social'].includes(currentView);

  return (
    <div className="flex flex-col min-h-screen font-sans transition-colors duration-200 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <SEOHelmet title="مجموعة ميلاف مراد" />
      
      {!isImmersive && (
        <Header onNavigate={navigate} />
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
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('murad_x_theme') as ThemeMode) || 'lights-out');

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dim', 'lights-out'];
    const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('murad_x_theme', theme);
    
    // Reset classes
    root.classList.remove('light', 'dark');
    
    // Apply Variables based on Mode
    if (theme === 'light') {
      root.classList.add('light');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f7f9f9');
      root.style.setProperty('--text-primary', '#0f1419');
      root.style.setProperty('--text-secondary', '#536471');
      root.style.setProperty('--border-color', '#eff3f4');
      root.style.setProperty('--accent-color', '#1d9bf0');
    } else if (theme === 'dim') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#15202b');
      root.style.setProperty('--bg-secondary', '#1e2732');
      root.style.setProperty('--text-primary', '#f7f9f9');
      root.style.setProperty('--text-secondary', '#8b98a5');
      root.style.setProperty('--border-color', '#38444d');
      root.style.setProperty('--accent-color', '#1d9bf0');
    } else {
      // Lights Out (True Black)
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#16181c');
      root.style.setProperty('--text-primary', '#e7e9ea');
      root.style.setProperty('--text-secondary', '#71767b');
      root.style.setProperty('--border-color', '#2f3336');
      root.style.setProperty('--accent-color', '#1d9bf0');
    }
  }, [theme]);

  return (
    <ToastProvider>
      <AuthProvider>
        <LanguageProvider>
          <ThemeContext.Provider value={{ theme, cycleTheme }}>
            <AppContent />
          </ThemeContext.Provider>
        </LanguageProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
    
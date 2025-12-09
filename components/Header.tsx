
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, LogIn, Globe, Sun, Moon, LogOut, 
  Settings, User as UserIcon, ChevronDown, LayoutGrid, 
  Building2, ShoppingBag, FileText, Clock, 
  Cloud, Zap, Check, ChevronRight, Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { useTranslation, SUPPORTED_LANGUAGES } from '../context/LanguageContext';

interface HeaderProps {
  onNavigate: (path: string) => void;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, theme, toggleTheme }) => {
  const { user, showLoginModal, setShowLoginModal, logout } = useAuth();
  const { t, language, changeLanguage, direction } = useTranslation();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLanguageSubmenu, setShowLanguageSubmenu] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setShowLanguageSubmenu(false); // Reset submenu on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
      if (showLoginModal) {
          setIsAuthOpen(true);
          setShowLoginModal(false);
      }
  }, [showLoginModal, setShowLoginModal]);

  const handleNav = (path: string) => {
      onNavigate(path);
      setMobileMenu(false);
      setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
      await logout();
      setIsUserMenuOpen(false);
      onNavigate('landing');
  };

  const currentLangName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name;

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* BRAND & LOGO */}
        <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
                className="lg:hidden p-2 -mr-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setMobileMenu(!mobileMenu)}
            >
                <Menu className="w-6 h-6"/>
            </button>

            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleNav('landing')}
            >
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <span className="font-black text-white text-lg">M</span>
                </div>
                
                <div className="hidden sm:flex flex-col justify-center">
                    <span className="text-base font-bold text-slate-800 dark:text-white leading-none tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t.brand_name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                        {t.brand_sub}
                    </span>
                </div>
            </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1">
            <NavButton onClick={() => handleNav('corporate')} icon={<Building2 className="w-4 h-4"/>} label={t.nav_corp} />
            <NavButton onClick={() => handleNav('market')} icon={<ShoppingBag className="w-4 h-4"/>} label={t.nav_market} />
            <NavButton onClick={() => handleNav('academy')} icon={<FileText className="w-4 h-4"/>} label={t.nav_academy} />
            <NavButton onClick={() => handleNav('jobs')} icon={<BriefcaseIcon className="w-4 h-4"/>} label={t.nav_jobs} />
        </nav>

        {/* USER CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3" ref={menuRef}>
            
            {/* AUTH ACTION */}
            {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                            isUserMenuOpen 
                            ? 'bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-slate-600' 
                            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <img 
                            src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            alt="User"
                        />
                        <div className="hidden md:flex flex-col items-start">
                             <span className="text-xs font-bold text-slate-700 dark:text-gray-200 max-w-[80px] truncate leading-tight">
                                {user.name.split(' ')[0]}
                            </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* PREMIUM USER DROPDOWN (Twitter/SaaS Style) */}
                    {isUserMenuOpen && (
                        <div className={`absolute top-full mt-3 w-80 origin-top-right bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl dark:shadow-slate-900/20 z-50 overflow-hidden ring-1 ring-black/5 ${direction === 'rtl' ? 'left-0' : 'right-0'} animate-fade-in-up`}>
                            
                            {/* 1. User Info Header */}
                            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-gray-500 truncate mt-0.5">{user.email}</p>
                            </div>

                            <div className="py-2">
                                {/* 2. Appearance Toggle */}
                                <button 
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                                        <span className="font-medium">المظهر</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        {theme === 'dark' ? 'Dark' : 'Light'}
                                    </span>
                                </button>

                                {/* 3. Language Switcher (Expandable) */}
                                <button 
                                    onClick={() => setShowLanguageSubmenu(!showLanguageSubmenu)}
                                    className={`w-full flex items-center justify-between px-5 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${showLanguageSubmenu ? 'bg-gray-50 dark:bg-gray-900' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium">اللغة (Language)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{currentLangName}</span>
                                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showLanguageSubmenu ? 'rotate-90' : 'rtl:rotate-180'}`}/>
                                    </div>
                                </button>

                                {/* Language Submenu */}
                                {showLanguageSubmenu && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 max-h-48 overflow-y-auto">
                                        {SUPPORTED_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    changeLanguage(lang.code);
                                                    setShowLanguageSubmenu(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-8 py-2.5 text-xs transition-colors ${
                                                    language === lang.code 
                                                    ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-900/20' 
                                                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                <span>{lang.name}</span>
                                                {language === lang.code && <Check className="w-3 h-3"/>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-1"></div>

                            {/* 4. App Navigation */}
                            <div className="py-2">
                                <DropdownItem 
                                    onClick={() => handleNav('profile')} 
                                    icon={<LayoutGrid className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors"/>} 
                                    label={t.dashboard} 
                                />
                                <DropdownItem 
                                    onClick={() => handleNav('settings')} 
                                    icon={<Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors"/>} 
                                    label={t.settings} 
                                />
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-1"></div>

                            {/* 5. Logout */}
                            <div className="py-2">
                                <button 
                                    onClick={handleLogout}
                                    className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-bold">{t.logout}</span>
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            ) : (
                <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                >
                    <LogIn className="w-4 h-4"/>
                    <span>{t.login}</span>
                </button>
            )}

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenu && (
          <div className="lg:hidden bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-800 absolute w-full left-0 top-16 shadow-2xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4 space-y-1">
                {user && (
                    <MobileNavItem onClick={() => handleNav('profile')} icon={<LayoutGrid className="w-5 h-5 text-blue-500"/>} label={t.dashboard} />
                )}
                <MobileNavItem onClick={() => handleNav('jobs')} icon={<BriefcaseIcon className="w-5 h-5 text-emerald-500"/>} label={t.nav_jobs} />
                <MobileNavItem onClick={() => handleNav('academy')} icon={<FileText className="w-5 h-5 text-purple-500"/>} label={t.nav_academy} />
                <MobileNavItem onClick={() => handleNav('market')} icon={<ShoppingBag className="w-5 h-5 text-amber-500"/>} label={t.nav_market} />
                <MobileNavItem onClick={() => handleNav('corporate')} icon={<Building2 className="w-5 h-5 text-slate-500"/>} label={t.nav_corp} />
                
                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                
                {/* Mobile Extra Controls (Since we removed them from top header) */}
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">المظهر</span>
                    <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
                         {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-400"/> : <Sun className="w-5 h-5 text-amber-500"/>}
                    </button>
                </div>
                
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">اللغة</span>
                    <button onClick={() => {
                        const nextLang = language === 'ar' ? 'en' : 'ar'; // Simple toggle for mobile quick access
                        changeLanguage(nextLang);
                    }} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-gray-200">
                         <Globe className="w-4 h-4"/> {language.toUpperCase()}
                    </button>
                </div>

            </div>
          </div>
      )}
    </header>

    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={() => setIsAuthOpen(false)} />
    </>
  );
};

// --- Sub Components ---

const NavButton = ({ onClick, icon, label, active }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            active 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const DropdownItem = ({ onClick, icon, label }: any) => {
    const { direction } = useTranslation();
    return (
        <button 
            onClick={onClick}
            className={`group w-full px-5 py-3 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-3 transition-colors ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
};

const MobileNavItem = ({ onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
        {icon}
        <span className="font-bold text-sm">{label}</span>
    </button>
);

// Helper Icon for consistency
const BriefcaseIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

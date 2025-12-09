
import React, { useState, useEffect } from 'react';
import { 
  Menu, LogIn, Globe, Sun, Moon, LogOut, 
  Settings, User, ChevronDown, LayoutGrid, 
  Building2, ShoppingBag, FileText, Clock, 
  Cloud, Server, Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onNavigate: (path: string) => void;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, theme, toggleTheme }) => {
  const { user, showLoginModal, setShowLoginModal, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Sync internal state with context state
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

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* RIGHT SIDE: LOGO & BRAND */}
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
                        ميلاف مراد
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                        National Platform
                    </span>
                </div>
            </div>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1">
            <NavButton onClick={() => handleNav('corporate')} icon={<Building2 className="w-4 h-4"/>} label="الشركة" active={false} />
            <NavButton onClick={() => handleNav('market')} icon={<ShoppingBag className="w-4 h-4"/>} label="السوق" active={false} />
            <NavButton onClick={() => handleNav('academy')} icon={<FileText className="w-4 h-4"/>} label="الأكاديمية" active={false} />
            <NavButton onClick={() => handleNav('jobs')} icon={<BriefcaseIcon className="w-4 h-4"/>} label="الوظائف" active={false} />
        </nav>

        {/* LEFT SIDE: USER CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block" title="تغيير اللغة">
                <Globe className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            {toggleTheme && (
                <button 
                    onClick={toggleTheme}
                    className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                </button>
            )}

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

            {/* Auth Action */}
            {user ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900"
                    >
                        <img 
                            src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            alt="User"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-gray-200 max-w-[80px] truncate hidden md:block">
                            {user.name.split(' ')[0]}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-fade-in-up origin-top-left">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user.email}</p>
                            </div>
                            
                            <DropdownItem onClick={() => handleNav('profile')} icon={<LayoutGrid className="w-4 h-4"/>} label="لوحة التحكم" />
                            <DropdownItem onClick={() => handleNav('settings')} icon={<Settings className="w-4 h-4"/>} label="الإعدادات" />
                            
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-gray-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                >
                    <LogIn className="w-4 h-4"/>
                    <span>دخول</span>
                </button>
            )}

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenu && (
          <div className="lg:hidden bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-800 absolute w-full left-0 top-16 shadow-2xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4 space-y-1">
                {user && (
                    <MobileNavItem onClick={() => handleNav('profile')} icon={<LayoutGrid className="w-5 h-5 text-blue-500"/>} label="لوحة التحكم" />
                )}
                <MobileNavItem onClick={() => handleNav('jobs')} icon={<BriefcaseIcon className="w-5 h-5 text-emerald-500"/>} label="الوظائف" />
                <MobileNavItem onClick={() => handleNav('academy')} icon={<FileText className="w-5 h-5 text-purple-500"/>} label="الأكاديمية" />
                <MobileNavItem onClick={() => handleNav('market')} icon={<ShoppingBag className="w-5 h-5 text-amber-500"/>} label="السوق" />
                <MobileNavItem onClick={() => handleNav('corporate')} icon={<Building2 className="w-5 h-5 text-slate-500"/>} label="الشركات" />
                
                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                
                <MobileNavItem onClick={() => handleNav('clock-system')} icon={<Clock className="w-5 h-5 text-cyan-500"/>} label="مراد كلوك" />
                <MobileNavItem onClick={() => handleNav('cloud')} icon={<Cloud className="w-5 h-5 text-blue-400"/>} label="مراد كلاود" />
                <MobileNavItem onClick={() => handleNav('dopamine')} icon={<Zap className="w-5 h-5 text-yellow-500"/>} label="دوبامين" />
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

const DropdownItem = ({ onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className="w-full text-right px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
    >
        {icon}
        <span>{label}</span>
    </button>
);

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

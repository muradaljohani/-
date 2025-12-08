
import React, { useState } from 'react';
import { Menu, LogIn, GraduationCap, ShoppingBag, Globe, FileText, Clock, Cloud, Server, Zap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, showLoginModal, setShowLoginModal } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Sync internal state with context state for triggering login modal from elsewhere
  React.useEffect(() => {
      if (showLoginModal) {
          setIsAuthOpen(true);
          setShowLoginModal(false); // Reset trigger
      }
  }, [showLoginModal]);

  const handleNav = (path: string) => {
      onNavigate(path);
      setMobileMenu(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO - PROFESSIONAL GLASS DESIGN */}
        <div 
            className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-blue-500/20 cursor-pointer group shrink-0"
            onClick={() => handleNav('landing')}
        >
            {/* The Integrated M Icon */}
            <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-inner border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <span className="font-black text-white text-lg drop-shadow-md">M</span>
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            {/* The Text */}
            <div className="flex flex-col justify-center">
                <span className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-wide leading-none group-hover:to-white transition-all">
                    موقع ميلاف مراد
                </span>
                <span className="text-[8px] text-blue-300/70 font-mono uppercase tracking-[0.2em] mt-0.5 group-hover:text-blue-300 transition-colors">
                    Official Portal
                </span>
            </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide px-2">
            <button onClick={() => handleNav('corporate')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <Building2 className="w-4 h-4 text-blue-400"/> شركة مراد الجهني لتقنية المعلومات العالمية
            </button>
            <button onClick={() => handleNav('academy')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <GraduationCap className="w-4 h-4 text-purple-400"/> أكاديمية ميلاف مراد
            </button>
            <button onClick={() => handleNav('market')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <ShoppingBag className="w-4 h-4 text-emerald-400"/> سوق ميلاف مراد
            </button>
            <button onClick={() => handleNav('meta')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <FileText className="w-4 h-4 text-red-400"/> مراد ميا
            </button>
            <button onClick={() => handleNav('clock-system')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <Clock className="w-4 h-4 text-amber-400"/> مراد كلوك
            </button>
            <button onClick={() => handleNav('cloud')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <Cloud className="w-4 h-4 text-blue-400"/> مراد كلاود
            </button>
            <button onClick={() => handleNav('haraj')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <Globe className="w-4 h-4 text-cyan-400"/> حراج ميلاف
            </button>
            <button onClick={() => handleNav('domains')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <Server className="w-4 h-4 text-pink-400"/> مراد دومين
            </button>
            <button onClick={() => handleNav('dopamine')} className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap">
                <Zap className="w-4 h-4 text-yellow-400"/> مراد دوبامين
            </button>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
            {user ? (
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleNav('profile')}>
                    <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-7 h-7 rounded-full border border-white/20"/>
                    <span className="text-xs font-bold text-white max-w-[80px] truncate hidden sm:block">{user.name.split(' ')[0]}</span>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-900/20"
                >
                    <LogIn className="w-4 h-4"/> دخول
                </button>
            )}
            <button className="lg:hidden text-white p-2" onClick={() => setMobileMenu(!mobileMenu)}>
                <Menu className="w-6 h-6"/>
            </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
          <div className="lg:hidden bg-[#1e293b] border-t border-white/10 p-4 absolute w-full left-0 top-16 shadow-2xl z-50 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
            <button onClick={() => handleNav('corporate')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><Building2 className="w-4 h-4 text-blue-400"/> شركة مراد الجهني لتقنية المعلومات العالمية</button>
            <button onClick={() => handleNav('academy')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><GraduationCap className="w-4 h-4 text-purple-400"/> أكاديمية ميلاف مراد</button>
            <button onClick={() => handleNav('market')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><ShoppingBag className="w-4 h-4 text-emerald-400"/> سوق ميلاف مراد</button>
            <button onClick={() => handleNav('meta')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><FileText className="w-4 h-4 text-red-400"/> مراد ميا</button>
            <button onClick={() => handleNav('clock-system')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><Clock className="w-4 h-4 text-amber-400"/> مراد كلوك</button>
            <button onClick={() => handleNav('cloud')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><Cloud className="w-4 h-4 text-blue-400"/> مراد كلاود</button>
            <button onClick={() => handleNav('haraj')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><Globe className="w-4 h-4 text-cyan-400"/> حراج ميلاف</button>
            <button onClick={() => handleNav('domains')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><Server className="w-4 h-4 text-pink-400"/> مراد دومين</button>
            <button onClick={() => handleNav('dopamine')} className="text-right px-4 py-3 text-white bg-white/5 rounded-lg flex items-center gap-3"><Zap className="w-4 h-4 text-yellow-400"/> مراد دوبامين</button>
          </div>
      )}
    </header>

    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={() => setIsAuthOpen(false)} />
    </>
  );
};

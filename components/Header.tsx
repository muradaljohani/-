
import React, { useState, useEffect } from 'react';
import { Crown, Gavel, UploadCloud, Landmark, Menu, X, GraduationCap, Briefcase, ShoppingBag, DownloadCloud, Command, Wallet, Gift, Building2, Fingerprint, Scale, Zap, LogIn, User, Globe, Clock, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PartnerCommandCenter } from './Expansion/PartnerCommandCenter';
import { DigitalPassport } from './Governance/DigitalPassport';
import { TribunalCourt } from './Governance/TribunalCourt';
import { PrimeDashboard } from './Subscription/PrimeDashboard';
import { UniversalProfileHub } from './Nexus/UniversalProfileHub';

interface HeaderProps {
  onNewChat?: () => void;
  onOpenJobs?: () => void;
  onOpenAcademy?: () => void;
  onOpenHaraj?: () => void;
  onOpenMarket?: () => void;
  onOpenPublish?: () => void;
  onOpenTraining?: () => void;
  onOpenOmni?: () => void;
  onOpenBusiness?: () => void; 
  onOpenDomains?: () => void; 
  onOpenCloud?: () => void;
  onOpenMuradClock?: () => void; 
  isLanding?: boolean; 
}

export const Header: React.FC<HeaderProps> = ({ 
  onNewChat, onOpenJobs, onOpenAcademy, onOpenHaraj, onOpenMarket, 
  onOpenPublish, onOpenTraining, onOpenOmni, onOpenBusiness, 
  onOpenDomains, onOpenCloud, onOpenMuradClock, isLanding = false 
}) => {
  const { user, brain, setShowLoginModal } = useAuth();
  
  // Modals Local State
  const [isPartnerOpen, setIsPartnerOpen] = useState(false); 
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isTribunalOpen, setIsTribunalOpen] = useState(false);
  const [isPrimeOpen, setIsPrimeOpen] = useState(false);
  const [isProfileHubOpen, setIsProfileHubOpen] = useState(false);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultOrder = ['jobs', 'haraj', 'market', 'training', 'academy'];
  const [menuOrder, setMenuOrder] = useState(defaultOrder);

  useEffect(() => {
      setMenuOrder(brain.getAdaptiveMenuOrder(defaultOrder));
  }, []);

  // SEO-Friendly Navigation Handler
  const handleNavClick = (e: React.MouseEvent, id: string, action?: () => void) => {
      e.preventDefault();
      brain.trackMenuClick(id);
      if (action) {
          action();
      } else {
          let path = `/${id}`;
          if (id === 'training') path = '/academy';
          if (id === 'murad-clock') path = '/murad-clock';
          if (id === 'meta') path = '/meta';
          
          window.history.pushState({}, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
      }
      setMobileMenuOpen(false);
  };

  const headerClass = isLanding ? "fixed top-0 w-full z-50 transition-all duration-300" : "sticky top-0 z-50 transition-all duration-300";
  const bgClass = isLanding ? "bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10" : "bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg";

  const renderNavButton = (id: string) => {
      switch(id) {
          case 'jobs': return (
              <a key="jobs" href="/jobs" onClick={(e) => handleNavClick(e, 'jobs', onOpenJobs)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" title="تصفح أحدث الوظائف">
                  <Briefcase className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform"/> 
                  <span className="hidden lg:inline">بوابة </span>الوظائف
              </a>
          );
          case 'haraj': return (
              <a key="haraj" href="/haraj" onClick={(e) => handleNavClick(e, 'haraj', onOpenHaraj)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" title="حراج السيارات والعقارات">
                  <Gavel className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform"/> الحراج
              </a>
          );
          case 'market': return (
              <a key="market" href="/market" onClick={(e) => handleNavClick(e, 'market', onOpenMarket)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" title="سوق الخدمات المصغرة">
                  <ShoppingBag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform"/> السوق
              </a>
          );
          case 'training': return (
              <a key="training" href="/training" onClick={(e) => handleNavClick(e, 'training', onOpenTraining)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" title="الدورات التدريبية المعتمدة">
                  <GraduationCap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform"/> التدريب
              </a>
          );
          default: return null;
      }
  };

  return (
    <header className={`${headerClass} ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2">
                <Menu className="w-6 h-6"/>
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => handleNavClick(e, 'landing', onNewChat)}>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center border border-white/10">
                        <span className="font-black text-white text-xl">M</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white font-black text-lg leading-none tracking-tight">ميلاف <span className="text-amber-500">مراد</span></h1>
                    <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">National Platform</span>
                </div>
            </div>
        </div>

        {/* DESKTOP NAV (Adaptive Order) */}
        <nav className="hidden lg:flex items-center gap-1">
            {menuOrder.map(id => renderNavButton(id))}
            <a href="/meta" onClick={(e) => handleNavClick(e, 'meta')} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" title="أدوات الملفات PDF">
                <FileText className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform"/> مراد ميتا
            </a>
        </nav>

        {/* ACTIONS AREA */}
        <div className="flex items-center gap-3">
            <button onClick={onOpenOmni} className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 px-3 py-2 rounded-xl text-xs transition-all w-32 justify-between group">
                <span className="group-hover:text-white">بحث شامل...</span>
                <span className="bg-white/10 px-1.5 rounded text-[10px]">⌘K</span>
            </button>

            <div className="h-6 w-px bg-white/10 hidden md:block"></div>

            {user ? (
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsPartnerOpen(true)} className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-lg hover:scale-105 transition-transform" title="لوحة الشركاء">
                        <Gift className="w-4 h-4"/>
                    </button>
                    
                    <div className="relative group cursor-pointer" onClick={() => setIsProfileHubOpen(true)}>
                         <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 pl-1 pr-3 py-1 rounded-full border border-white/10 transition-all">
                             <div className="relative">
                                 <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-8 h-8 rounded-full border border-white/20"/>
                                 {user.isIdentityVerified && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-[#0f172a]"><Fingerprint className="w-2 h-2"/></div>}
                             </div>
                             <div className="flex flex-col items-start">
                                 <span className="text-xs font-bold text-white max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                                 <span className="text-[9px] text-emerald-400 font-mono">{user.wallet?.balance || 0} SAR</span>
                             </div>
                         </div>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5"
                >
                    <LogIn className="w-4 h-4"/> دخول
                </button>
            )}
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-[#0f172a] border-b border-white/10 shadow-2xl animate-fade-in-up">
              <div className="p-4 space-y-2">
                  <a href="/jobs" onClick={(e) => handleNavClick(e, 'jobs', onOpenJobs)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white">
                      <Briefcase className="w-5 h-5 text-blue-400"/> بوابة الوظائف
                  </a>
                  <a href="/academy" onClick={(e) => handleNavClick(e, 'academy', onOpenTraining)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white">
                      <GraduationCap className="w-5 h-5 text-purple-400"/> التدريب
                  </a>
                  <a href="/market" onClick={(e) => handleNavClick(e, 'market', onOpenMarket)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white">
                      <ShoppingBag className="w-5 h-5 text-emerald-400"/> السوق
                  </a>
                  <a href="/haraj" onClick={(e) => handleNavClick(e, 'haraj', onOpenHaraj)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white">
                      <Gavel className="w-5 h-5 text-amber-400"/> الحراج
                  </a>
                  <a href="/murad-clock" onClick={(e) => handleNavClick(e, 'murad-clock', onOpenMuradClock)} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white">
                      <Clock className="w-5 h-5 text-blue-400"/> مراد كلوك
                  </a>
                  <a href="/meta" onClick={(e) => handleNavClick(e, 'meta')} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white">
                      <FileText className="w-5 h-5 text-red-400"/> مراد ميتا (PDF Tools)
                  </a>
              </div>
          </div>
      )}
      
      {/* Modals */}
      {isPartnerOpen && <PartnerCommandCenter onClose={() => setIsPartnerOpen(false)} />}
      {isPassportOpen && user && <DigitalPassport user={user} onClose={() => setIsPassportOpen(false)} />}
      {isTribunalOpen && <TribunalCourt onClose={() => setIsTribunalOpen(false)} />}
      {isPrimeOpen && <PrimeDashboard onClose={() => setIsPrimeOpen(false)} />}
      <UniversalProfileHub isOpen={isProfileHubOpen} onClose={() => setIsProfileHubOpen(false)} />

    </header>
  );
};

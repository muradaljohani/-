
import React, { useState, useEffect } from 'react';
import { Crown, Gavel, UploadCloud, Landmark, Menu, X, GraduationCap, Briefcase, ShoppingBag, DownloadCloud, Command, Wallet, Gift, Building2, Fingerprint, Scale, Zap, LogIn, User, Globe } from 'lucide-react';
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
  isLanding?: boolean; 
}

export const Header: React.FC<HeaderProps> = ({ onNewChat, onOpenJobs, onOpenAcademy, onOpenHaraj, onOpenMarket, onOpenPublish, onOpenTraining, onOpenOmni, onOpenBusiness, onOpenDomains, isLanding = false }) => {
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
          // Fallback if no action provided (should typically not happen with correct props)
          window.history.pushState({}, '', `/${id === 'training' ? 'academy' : id}`);
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
              <a key="training" href="/training" onClick={(e) => handleNavClick(e, 'training', onOpenTraining)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" title="دورات تدريبية معتمدة">
                  <GraduationCap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform"/> التدريب
              </a>
          );
          case 'academy': return (
              <a key="academy" href="/academy" onClick={(e) => handleNavClick(e, 'academy', onOpenAcademy)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all font-bold text-xs lg:text-sm whitespace-nowrap" title="القبول الموحد للأكاديمية">
                  <Landmark className="w-4 h-4"/> القبول الموحد
              </a>
          );
          default: return null;
      }
  };

  const renderMobileNavItem = (id: string) => {
      switch(id) {
          case 'jobs': return <button key="m_jobs" onClick={(e) => handleNavClick(e, 'jobs', onOpenJobs)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold"><Briefcase className="w-5 h-5 text-blue-400"/> بوابة الوظائف</button>;
          case 'haraj': return <button key="m_haraj" onClick={(e) => handleNavClick(e, 'haraj', onOpenHaraj)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold"><Gavel className="w-5 h-5 text-amber-400"/> الحراج الإلكتروني</button>;
          case 'market': return <button key="m_market" onClick={(e) => handleNavClick(e, 'market', onOpenMarket)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold"><ShoppingBag className="w-5 h-5 text-emerald-400"/> سوق الخدمات</button>;
          case 'training': return <button key="m_training" onClick={(e) => handleNavClick(e, 'training', onOpenTraining)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold"><GraduationCap className="w-5 h-5 text-purple-400"/> مركز التدريب</button>;
          default: return null;
      }
  };

  return (
    <>
    <header className={headerClass} role="banner">
      <div className={`${bgClass} px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 cursor-pointer shrink-0 z-50 no-underline" onClick={(e) => { e.preventDefault(); if(onNewChat) onNewChat(); }} aria-label="Mylaf Murad Home">
            <div className="relative bg-gradient-to-br from-blue-900 to-[#0f172a] border border-white/10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg group">
              <span className="text-lg sm:text-xl font-black text-white group-hover:scale-110 transition-transform">M</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base sm:text-lg font-black text-white leading-none tracking-tight flex items-center gap-1">
                ميلاف مراد
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
              </h1>
              <span className="text-[8px] sm:text-[10px] text-gray-400 font-mono tracking-widest uppercase">National Academy</span>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md absolute left-1/2 transform -translate-x-1/2" role="navigation">
              <button onClick={onOpenOmni} className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all font-mono text-xs" title="Universal Search (Cmd+K)">
                  <Command className="w-4 h-4"/>
              </button>
              <div className="w-px h-6 bg-white/10 mx-1"></div>
              {/* Murad Domain Link - Placed in header as requested */}
              <a href="/domains" onClick={(e) => handleNavClick(e, 'domains', onOpenDomains)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap border-l border-white/10 ml-1 pl-3">
                  <Globe className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform"/> 
                  نطاقات
              </a>
              {menuOrder.map(id => renderNavButton(id))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                  {user && (
                      <>
                        <button onClick={() => setIsPrimeOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all text-xs font-bold">
                            <Crown className="w-4 h-4"/> Elite
                        </button>
                        <button onClick={() => setIsProfileHubOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white text-xs font-bold shadow-lg hover:shadow-blue-600/30 transition-all">
                            <User className="w-4 h-4"/> حسابي
                        </button>
                      </>
                  )}
                  {!user && (
                      <button 
                        onClick={() => setShowLoginModal(true)} 
                        className="px-5 py-2.5 bg-[#1e3a8a] text-amber-400 border border-amber-500/50 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-[#172554] hover:border-amber-400 flex items-center gap-2"
                      >
                          <LogIn className="w-4 h-4"/> دخول / تسجيل
                      </button>
                  )}
              </div>

              <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="lg:hidden p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg border border-white/5 z-50 relative"
                  aria-label="Toggle Menu"
              >
                  {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay - High Z-Index to cover everything */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] bg-[#0f172a] lg:hidden animate-fade-in-up pt-20 px-6 pb-8 overflow-y-auto">
              <div className="space-y-2">
                  <div className="pb-4 mb-4 border-b border-white/10">
                      <button onClick={() => { onOpenAcademy?.(); setMobileMenuOpen(false); }} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                          <Landmark className="w-5 h-5"/> القبول الموحد
                      </button>
                  </div>
                  
                  {menuOrder.map(id => renderMobileNavItem(id))}
                  
                  {/* Mobile Domain Link */}
                  <button onClick={() => { onOpenDomains?.(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold">
                      <Globe className="w-5 h-5 text-emerald-400"/> مراد دومين
                  </button>

                  <div className="pt-4 mt-4 border-t border-white/10">
                       <button onClick={() => { onOpenPublish?.(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold"><UploadCloud className="w-5 h-5 text-pink-400"/> بوابة النشر</button>
                       <button onClick={() => { onOpenBusiness?.(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 text-sm font-bold"><Building2 className="w-5 h-5 text-blue-400"/> قطاع الأعمال</button>
                  </div>

                  {!user ? (
                      <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full mt-6 py-3 border border-amber-500/50 text-amber-400 rounded-xl font-bold">
                          تسجيل الدخول
                      </button>
                  ) : (
                      <button onClick={() => { setIsProfileHubOpen(true); setMobileMenuOpen(false); }} className="w-full mt-6 py-3 bg-blue-600/20 text-blue-300 border border-blue-500/50 rounded-xl font-bold flex items-center justify-center gap-2">
                          <User className="w-5 h-5"/> حسابي
                      </button>
                  )}
              </div>
          </div>
      )}
    </header>
    <UniversalProfileHub isOpen={isProfileHubOpen} onClose={() => setIsProfileHubOpen(false)} />
    {isPartnerOpen && <PartnerCommandCenter onClose={() => setIsPartnerOpen(false)} />}
    {user && isPassportOpen && <DigitalPassport user={user} onClose={() => setIsPassportOpen(false)} />}
    {isTribunalOpen && <TribunalCourt onClose={() => setIsTribunalOpen(false)} />}
    {user && isPrimeOpen && <PrimeDashboard onClose={() => setIsPrimeOpen(false)} />}
    </>
  );
};

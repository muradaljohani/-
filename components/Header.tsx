
import React, { useState, useEffect } from 'react';
import { Crown, Gavel, UploadCloud, Landmark, Menu, X, GraduationCap, Briefcase, ShoppingBag, DownloadCloud, Command, Wallet, Gift, Building2, Fingerprint, Scale, Zap, LogIn, User } from 'lucide-react';
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
  isLanding?: boolean; 
}

export const Header: React.FC<HeaderProps> = ({ onNewChat, onOpenJobs, onOpenAcademy, onOpenHaraj, onOpenMarket, onOpenPublish, onOpenTraining, onOpenOmni, onOpenBusiness, isLanding = false }) => {
  const { user, brain, setShowLoginModal } = useAuth();
  
  // Modals Local State (Only for specific header features not global ones)
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

  const handleNavClick = (id: string, action?: () => void) => {
      brain.trackMenuClick(id);
      if (action) action();
  };

  const headerClass = isLanding ? "fixed top-0 w-full z-50 transition-all duration-300" : "sticky top-0 z-50 transition-all duration-300";
  const bgClass = isLanding ? "bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10" : "bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg";

  const renderNavButton = (id: string) => {
      switch(id) {
          case 'jobs': return (
              <button key="jobs" onClick={() => handleNavClick('jobs', onOpenJobs)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" data-prefetch="jobs">
                  <Briefcase className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform"/> 
                  <span className="hidden lg:inline">بوابة </span>الوظائف
              </button>
          );
          case 'haraj': return (
              <button key="haraj" onClick={() => handleNavClick('haraj', onOpenHaraj)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" data-prefetch="haraj">
                  <Gavel className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform"/> الحراج
              </button>
          );
          case 'market': return (
              <button key="market" onClick={() => handleNavClick('market', onOpenMarket)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" data-prefetch="market">
                  <ShoppingBag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform"/> السوق
              </button>
          );
          case 'training': return (
              <button key="training" onClick={() => handleNavClick('training', onOpenTraining)} className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-bold text-xs lg:text-sm group whitespace-nowrap" data-prefetch="training">
                  <GraduationCap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform"/> التدريب
              </button>
          );
          case 'academy': return (
              <button key="academy" onClick={() => handleNavClick('academy', onOpenAcademy)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all font-bold text-xs lg:text-sm whitespace-nowrap" data-prefetch="academy">
                  <Landmark className="w-4 h-4"/> القبول الموحد
              </button>
          );
          default: return null;
      }
  };

  return (
    <>
    <header className={headerClass}>
      <div className={`${bgClass} px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0 z-50" onClick={onNewChat}>
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
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md absolute left-1/2 transform -translate-x-1/2">
              <button onClick={onOpenOmni} className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all font-mono text-xs" title="Universal Search (Cmd+K)">
                  <Command className="w-4 h-4"/>
              </button>
              <div className="w-px h-6 bg-white/10 mx-1"></div>
              {menuOrder.map(id => renderNavButton(id))}
          </nav>

          {/* Right Actions & Mobile Toggle */}
          <div className="flex items-center gap-3">
              
              <div className="hidden lg:flex items-center gap-3">
                  {user && (
                      <>
                        <button onClick={() => setIsPrimeOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all text-xs font-bold">
                            <Crown className="w-4 h-4"/> Elite
                        </button>
                        <button onClick={() => setIsPartnerOpen(true)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Partners">
                            <Gift className="w-4 h-4"/>
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

              {/* Mobile Toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg border border-white/5 z-50 relative">
                  {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
          </div>

        </div>
      </div>

      {/* Mobile Off-Canvas Menu */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-300 lg:hidden flex flex-col pt-20 px-6 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-4 animate-fade-in-up">
              
              {user ? (
                  <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-2xl border border-white/10 mb-4" onClick={() => { setIsProfileHubOpen(true); setMobileMenuOpen(false); }}>
                      <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-blue-500"/>
                      <div>
                          <h3 className="text-white font-bold">{user.name}</h3>
                          <p className="text-xs text-gray-400">الملف الشخصي الموحد</p>
                      </div>
                  </div>
              ) : (
                  <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="w-full py-4 bg-[#1e3a8a] text-amber-400 border border-amber-500/50 rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2 shadow-lg">
                      <LogIn className="w-5 h-5"/> تسجيل الدخول
                  </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { handleNavClick('jobs', onOpenJobs); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center hover:bg-white/10">
                      <Briefcase className="w-6 h-6 text-blue-400 mx-auto mb-2"/>
                      <span className="text-sm font-bold text-gray-200">الوظائف</span>
                  </button>
                  <button onClick={() => { handleNavClick('haraj', onOpenHaraj); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center hover:bg-white/10">
                      <Gavel className="w-6 h-6 text-amber-400 mx-auto mb-2"/>
                      <span className="text-sm font-bold text-gray-200">الحراج</span>
                  </button>
                  <button onClick={() => { handleNavClick('market', onOpenMarket); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center hover:bg-white/10">
                      <ShoppingBag className="w-6 h-6 text-emerald-400 mx-auto mb-2"/>
                      <span className="text-sm font-bold text-gray-200">السوق</span>
                  </button>
                  <button onClick={() => { handleNavClick('training', onOpenTraining); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl border border-white/5 text-center hover:bg-white/10">
                      <GraduationCap className="w-6 h-6 text-purple-400 mx-auto mb-2"/>
                      <span className="text-sm font-bold text-gray-200">التدريب</span>
                  </button>
              </div>

              <button onClick={() => { handleNavClick('academy', onOpenAcademy); setMobileMenuOpen(false); }} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg mt-2">
                  <Landmark className="w-5 h-5"/> بوابة القبول الموحد
              </button>

              {user && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                      <button onClick={() => { setIsPrimeOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300">
                          <Crown className="w-5 h-5 text-amber-400"/> اشتراك Elite
                      </button>
                      <button onClick={() => { setIsPartnerOpen(true); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300">
                          <Gift className="w-5 h-5 text-pink-400"/> مركز الشركاء
                      </button>
                  </div>
              )}
          </div>
      </div>
    </header>

    <UniversalProfileHub isOpen={isProfileHubOpen} onClose={() => setIsProfileHubOpen(false)} />
    {isPartnerOpen && <PartnerCommandCenter onClose={() => setIsPartnerOpen(false)} />}
    
    {/* Governance Modals */}
    {user && isPassportOpen && <DigitalPassport user={user} onClose={() => setIsPassportOpen(false)} />}
    {isTribunalOpen && <TribunalCourt onClose={() => setIsTribunalOpen(false)} />}
    {user && isPrimeOpen && <PrimeDashboard onClose={() => setIsPrimeOpen(false)} />}
    </>
  );
};


import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Menu, LogOut, LayoutDashboard, User, Wallet, BookOpen, Settings, ShieldCheck } from 'lucide-react';
import { SmartIDCard } from '../Identity/SmartIDCard';
import { AcademicTranscript } from '../Academy/AcademicTranscript';
import { DigitalPassport } from '../Governance/DigitalPassport';
import { IdentityCenter } from './IdentityCenter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const UniversalProfileHub: React.FC<Props> = ({ isOpen, onClose, initialTab = 'overview' }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showIdentityCenter, setShowIdentityCenter] = useState(false);

  const handleLogout = async () => {
      await logout();
      onClose();
  };

  if (!isOpen || !user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
           <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                  {/* ID Card */}
                  <div className="flex-1">
                      <h3 className="text-white font-bold mb-4">الهوية الأكاديمية</h3>
                      <SmartIDCard user={user} />
                  </div>
                  {/* Quick Stats */}
                  <div className="w-full md:w-64 space-y-4">
                      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5">
                          <div className="text-gray-400 text-xs">المستوى</div>
                          <div className="text-xl font-bold text-white">Lv. {Math.floor(Math.sqrt(user.xp || 0))}</div>
                      </div>
                      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5">
                          <div className="text-gray-400 text-xs">نقاط الكارما</div>
                          <div className="text-xl font-bold text-amber-400">{user.karma || 500}</div>
                      </div>
                      <button onClick={() => setShowPassport(true)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors">
                          عرض الجواز الرقمي
                      </button>
                      <button onClick={() => setShowIdentityCenter(true)} className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors">
                          مركز التوثيق
                      </button>
                  </div>
              </div>
           </div>
        );
      case 'academy':
        return <AcademicTranscript />;
      case 'wallet':
        return (
            <div className="text-center py-20 text-gray-400">
                <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                <p>يرجى استخدام المحفظة من القائمة الرئيسية للوصول الكامل.</p>
            </div>
        );
      default:
        return <div className="text-white">Select a tab</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a] flex flex-col font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1e293b] shrink-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><X className="w-5 h-5"/></button>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-blue-500"/> الملف الموحد
                </h2>
            </div>
            <div className="flex items-center gap-3">
                 <div className="hidden md:flex items-center gap-2 text-white">
                     <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-8 h-8 rounded-full border border-white/20 object-cover"/>
                     <span className="text-sm font-bold">{user.name}</span>
                 </div>
                 <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg" title="تسجيل الخروج"><LogOut className="w-5 h-5 rtl:rotate-180"/></button>
                 <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white bg-white/10 rounded-lg hover:bg-white/20"><Menu className="w-6 h-6"/></button>
            </div>
        </div>

        {/* Mobile Header Overlay Content */}
        {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-[#1e293b] border-b border-white/10 p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-10 h-10 rounded-full border border-white/20 object-cover"/>
                    <div>
                        <h2 className="text-white font-bold text-sm">{user.name}</h2>
                        <p className="text-xs text-gray-400">لوحة التحكم المركزية</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg text-sm font-bold transition-colors"
                >
                    <LogOut className="w-4 h-4 rtl:rotate-180"/> تسجيل الخروج
                </button>
            </div>
        )}

        <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            <div className={`
                absolute md:relative z-30 w-64 bg-[#0b1120] h-full border-l border-white/10 transition-transform duration-300
                ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                <nav className="p-4 space-y-2">
                    <button onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='overview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <User className="w-5 h-5"/> نظرة عامة
                    </button>
                    <button onClick={() => { setActiveTab('academy'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='academy' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <BookOpen className="w-5 h-5"/> السجل الأكاديمي
                    </button>
                    <button onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='wallet' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Wallet className="w-5 h-5"/> المحفظة
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0f172a]">
                {renderContent()}
            </div>
        </div>

        {showPassport && <DigitalPassport user={user} onClose={() => setShowPassport(false)} />}
        <IdentityCenter isOpen={showIdentityCenter} onClose={() => setShowIdentityCenter(false)} />
    </div>
  );
};

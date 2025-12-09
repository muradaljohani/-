
import React, { useState } from 'react';
import { X, LogOut, LayoutDashboard, User, BookOpen, Wallet, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SmartIDCard } from './Identity/SmartIDCard';
import { AcademicTranscript } from './Academy/AcademicTranscript';
import { DigitalPassport } from './Governance/DigitalPassport';
import { IdentityCenter } from './Nexus/IdentityCenter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialView?: string;
}

export const UserProfileModal: React.FC<Props> = ({ isOpen, onClose, initialView = 'overview' }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialView);
  const [showPassport, setShowPassport] = useState(false);
  const [showIdentityCenter, setShowIdentityCenter] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
      await logout();
      onClose();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'academy': // Map legacy academy view to overview or specific component if needed
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
              
              {activeTab === 'academy' && (
                  <div className="mt-8">
                      <h3 className="text-white font-bold mb-4">السجل الأكاديمي</h3>
                      <AcademicTranscript />
                  </div>
              )}
           </div>
        );
      case 'transcript':
        return <AcademicTranscript />;
      default:
        return <div className="text-white text-center py-10">Select a tab</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col font-sans text-right" dir="rtl">
        {/* TOP BAR */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f172a]/95 backdrop-blur-md z-20 shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg flex items-center gap-2 transition-all hover:bg-white/10">
                    <X className="w-5 h-5"/>
                    <span className="text-xs font-bold hidden sm:inline">إغلاق البوابة</span>
                </button>
                <div className="h-6 w-px bg-white/10"></div>
                <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4 rtl:rotate-180"/> تسجيل الخروج
                </button>
            </div>
            <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-blue-500"/> ملف المتدرب الموحد
                </h2>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white bg-white/10 rounded-lg ml-2">
                    <Menu className="w-5 h-5"/>
                </button>
            </div>
        </div>

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
                        <BookOpen className="w-5 h-5"/> الأكاديمية
                    </button>
                    <button onClick={() => { setActiveTab('transcript'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='transcript' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <ShieldCheck className="w-5 h-5"/> السجل الرسمي
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

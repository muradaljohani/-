
import React, { useState, useEffect } from 'react';
import { X, User, LayoutDashboard, LogOut, CheckCircle2, Award, Clock, BookOpen, Settings, Bell, ChevronRight, Briefcase, GraduationCap, Printer, Share2, QrCode, Search, Globe, ShieldCheck, FileText, MonitorPlay, Video, Fingerprint, FileWarning, Linkedin, Sparkles, Library, PlayCircle, Loader2, Database, Server, HardDrive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AboutAcademyGallery } from './AboutAcademyGallery';
import { TraineeJourney } from './TraineeJourney';
import { UnifiedDashboard } from './Nexus/UnifiedDashboard';

type ViewMode = 'dashboard' | 'academy' | 'certificates' | 'jobs_portal' | 'settings' | 'notifications';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialView?: ViewMode;
}

export const UserProfileModal: React.FC<Props> = ({ isOpen, onClose, initialView }) => {
  const { user, logout } = useAuth();
  
  // New Modal States
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate connecting to the massive backend
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (!user) return null;

  // --- RIGHT SIDEBAR (Admission Banner) ---
  const AdmissionSidebar = () => (
      <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-l border-white/10 p-8 flex flex-col h-full relative overflow-hidden shadow-2xl w-full md:w-96 shrink-0 text-right">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center mt-6">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-xl">
                  <GraduationCap className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">بوابة القبول الموحد</h2>
              <p className="text-blue-200 text-sm mb-8 font-light">سجلك الأكاديمي الرقمي المعتمد عالمياً</p>

              {/* Student ID Card Preview */}
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-8 relative group cursor-default hover:bg-white/10 transition-colors">
                  <div className="absolute top-3 left-3">
                      {user?.isIdentityVerified ? <ShieldCheck className="w-5 h-5 text-emerald-400"/> : <ShieldCheck className="w-5 h-5 text-gray-500"/>}
                  </div>
                  <div className="w-20 h-20 mx-auto rounded-full p-1 border-2 border-amber-500/50 mb-3 relative">
                      <img src={user?.avatar} alt="Student" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{user?.name}</h3>
                  <div className="bg-black/30 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 inline-block border border-emerald-500/20">
                      {user?.trainingId}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-gray-300">
                      <div className="text-center">
                          <div className="font-bold text-white">{user?.level}</div>
                          <div className="text-[10px]">المستوى</div>
                      </div>
                      <div className="text-center">
                          <div className="font-bold text-white">{user?.certificates?.length || 0}</div>
                          <div className="text-[10px]">الشهادات</div>
                      </div>
                      <div className="text-center">
                          <div className="font-bold text-white">Active</div>
                          <div className="text-[10px]">الحالة</div>
                      </div>
                  </div>
              </div>

              {/* Call to Action / Info */}
              <div className="space-y-4 w-full text-right">
                  <div className="flex items-center gap-3 p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0"/>
                      <div>
                          <h4 className="text-white font-bold text-xs">شهادات معتمدة</h4>
                          <p className="text-[10px] text-gray-400">جميع دوراتك موثقة برقم مرجعي دولي.</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/>
                      <div>
                          <h4 className="text-white font-bold text-xs">تحديث فوري للبيانات</h4>
                          <p className="text-[10px] text-gray-400">اربط ملفك مباشرة مع جهات التوظيف.</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="mt-auto relative z-10 pt-6 border-t border-white/10 space-y-2">
              <button onClick={() => window.print()} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4"/> طباعة البطاقة الأكاديمية
              </button>
          </div>
      </div>
  );

  // --- LOADING VIEW ---
  const LoadingView = () => (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f172a] text-center p-8 h-full">
          <div className="relative mb-10">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative z-10 w-24 h-24 bg-[#1e293b] rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                  <Database className="w-10 h-10 text-blue-400 animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                      <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0f172a]"></span>
                      </span>
                  </div>
              </div>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">جاري الاتصال بالمكتبة المركزية...</h2>
          <p className="text-blue-300/60 text-xs font-mono mb-8 uppercase tracking-widest">Secure Connection | 256-bit Encryption</p>

          <div className="space-y-3 w-full max-w-xs text-xs font-bold text-gray-400">
              <div className="flex justify-between items-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <span className="flex items-center gap-2"><Server className="w-3 h-3 text-blue-500"/> مزامنة الدورات</span>
                  <span className="text-emerald-400">تم</span>
              </div>
              <div className="flex justify-between items-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <span className="flex items-center gap-2"><Library className="w-3 h-3 text-amber-500"/> تحميل 1000+ كتاب</span>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-500"/>
              </div>
              <div className="flex justify-between items-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                  <span className="flex items-center gap-2"><HardDrive className="w-3 h-3 text-purple-500"/> تحديث السجل الأكاديمي</span>
                  <span className="text-gray-600">انتظار...</span>
              </div>
          </div>

          <div className="mt-10 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500 animate-[loading_1.5s_ease-in-out_infinite]" style={{width: '60%'}}></div>
          </div>
          
          <style>{`
            @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
          `}</style>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 animate-fade-in-up">
      {/* Background Dim */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Main Container - Full Screen Page Feel */}
      <div className="relative w-full h-full bg-[#0f172a] shadow-2xl flex flex-col md:flex-row overflow-hidden font-sans text-right" dir="rtl">
          
          {/* RIGHT ZONE: Professional Admission Banner */}
          <div className="hidden md:block relative z-20 h-full border-l border-white/10">
              <AdmissionSidebar />
          </div>

          {/* LEFT ZONE: Main Content */}
          <div className="flex-1 flex flex-col h-full relative">
              
              {/* TOP BAR */}
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f172a]/95 backdrop-blur-md z-20 shrink-0">
                  <div className="flex items-center gap-3">
                      <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg flex items-center gap-2 transition-all hover:bg-white/10">
                          <X className="w-5 h-5"/>
                          <span className="text-xs font-bold hidden sm:inline">إغلاق البوابة</span>
                      </button>
                      <div className="h-6 w-px bg-white/10"></div>
                      <button onClick={logout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                          <LogOut className="w-4 h-4"/> تسجيل الخروج
                      </button>
                  </div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-blue-500"/> ملف المتدرب الموحد
                  </h2>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 overflow-auto flex flex-col">
                  {isLoading ? <LoadingView /> : (
                      <>
                        <div className="p-8">
                            <UnifiedDashboard />
                        </div>
                      </>
                  )}
              </div>
          </div>

          {/* OVERLAYS */}
          {isJourneyOpen && <TraineeJourney onClose={() => setIsJourneyOpen(false)} />}
      </div>
    </div>
  );
};

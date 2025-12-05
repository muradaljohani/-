
import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, Shield, Users, Building2, FileCheck, MapPin, Calendar, Radio, AlertOctagon, UserCheck, Lock, X } from 'lucide-react';
import { getWadhefaJobs, getJobStats, SECTIONS_LINKS } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from './UserProfileModal';

interface Job {
  jobTitle: string;
  company: string;
  location?: string;
  url?: string;
  date?: string;
  type?: string;
  logoUrl?: string;
  description?: string;
}

interface CategoryStat {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
  url: string;
}

interface JobsSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const JobsSidebar: React.FC<JobsSidebarProps> = ({ isOpen: externalIsOpen, onClose: externalOnClose }) => {
  const { user, checkProfileCompleteness } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<CategoryStat[]>([
    { id: 'military', label: 'عسكرية', icon: <Shield className="w-4 h-4" />, count: 0, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', url: SECTIONS_LINKS.MILITARY },
    { id: 'civil', label: 'مدنية', icon: <Users className="w-4 h-4" />, count: 0, color: 'text-blue-400', bgColor: 'bg-blue-500/10', url: SECTIONS_LINKS.CIVIL },
    { id: 'companies', label: 'شركات', icon: <Building2 className="w-4 h-4" />, count: 0, color: 'text-purple-400', bgColor: 'bg-purple-500/10', url: SECTIONS_LINKS.COMPANIES },
    { id: 'courses', label: 'تدريب', icon: <FileCheck className="w-4 h-4" />, count: 0, color: 'text-pink-400', bgColor: 'bg-pink-500/10', url: SECTIONS_LINKS.COURSES },
    { id: 'universities', label: 'جامعات', icon: <Building2 className="w-4 h-4" />, count: 0, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', url: SECTIONS_LINKS.UNIVERSITIES },
    { id: 'results', label: 'نتائج', icon: <FileCheck className="w-4 h-4" />, count: 0, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', url: SECTIONS_LINKS.NEWS },
  ]);
  const [loading, setLoading] = useState(true);
  
  // Internal state handles the floating button toggle if no external props are used, 
  // but if props are used, they override.
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Determine effective state: use external if provided (not undefined), else internal
  const isVisible = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleClose = externalOnClose || (() => setInternalIsOpen(false));

  // Profile Modal Control for incomplete profiles
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchAllData = async () => {
    if (jobs.length === 0) setLoading(true);
    try {
      const [jobsData, statsData] = await Promise.all([
        getWadhefaJobs(),
        getJobStats()
      ]);
      if (Array.isArray(jobsData) && jobsData.length > 0) setJobs(jobsData);
      if (Array.isArray(statsData)) {
        setStats(prev => prev.map(cat => {
          const found = statsData.find((s: any) => s.category === cat.id);
          return found ? { ...cat, count: found.count } : cat;
        }));
      }
    } catch (error) { } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAllData();
    const fetchInterval = setInterval(() => fetchAllData(), 5000); 
    return () => clearInterval(fetchInterval);
  }, []);

  // --- JOB APPLICATION & FRAUD DETECTION LOGIC ---
  const handleApply = (e: React.MouseEvent, job: Job) => {
    e.preventDefault(); 

    // 1. Strict Fraud Detection
    const suspiciousKeywords = [
        'رسوم', 'دفع', 'تحويل', 'استثمار', 'ربح سريع', 'فوري', 'fees', 'payment', 'invest', 
        'تداول', 'فوركس', 'رسوم ملف', 'عمولة', 'بيتكوين', 'crypto'
    ];
    const jobText = (job.jobTitle + ' ' + (job.description || '')).toLowerCase();
    const isSuspicious = suspiciousKeywords.some(kw => jobText.includes(kw));

    if (isSuspicious) {
       alert("🚫 تحذير أمني: هذه الوظيفة غير موثوقة أو تتطلب رسوم مالية. للحفاظ على أمنك، يرجى عدم التقديم.");
       return;
    }

    // 2. Check Login
    if (!user) {
       alert("يجب تسجيل الدخول أولاً للتقديم.");
       return;
    }

    // 3. Check Profile Completeness (Strict 80%)
    const completeness = checkProfileCompleteness();
    if (completeness < 80) {
        if (window.confirm(`⚠️ ملفك الشخصي غير مكتمل (${completeness}%). للتقديم على الوظائف الموثوقة، يجب إكمال ملفك وتفعيل 'جاهز أتوظف'. هل تريد التحديث الآن؟`)) {
            setShowProfileModal(true);
        }
        return;
    }

    // 4. Ready to Work Check
    if (!user.isReadyToWork) {
       if (window.confirm("⚠️ يجب تفعيل وضع 'جاهز أتوظف' في ملفك الشخصي للتقديم. هل تريد تفعيله الآن؟")) {
           setShowProfileModal(true);
       }
       return;
    }

    // 5. Proceed to Source
    if (job.url) {
        window.open(job.url, '_blank');
    }
  };

  const tickerJobs = jobs.length > 0 ? [...jobs, ...jobs] : [];

  return (
    <>
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      <aside className={`
        fixed inset-y-0 right-0 w-full sm:w-80
        bg-[#0f172a]/95 backdrop-blur-3xl border-l border-white/10 
        shadow-[0_0_80px_rgba(0,0,0,0.7)] z-[55] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        flex flex-col
        ${isVisible ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        <div className="pt-6 pb-4 px-4 border-b border-white/10 bg-gradient-to-b from-[#0f172a] to-transparent flex-shrink-0 relative z-20">
          <button onClick={handleClose} className="absolute top-4 left-4 text-gray-400 hover:text-white p-2 bg-white/5 rounded-lg">
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/30">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-100 text-lg leading-none">بوابة الوظائف</h2>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    الأضخم والأكثر تحديثاً
                  </span>
                </div>
             </div>
             
             <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">LIVE</span>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((cat) => (
              <a key={cat.id} href={cat.url} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center p-2 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300 group relative overflow-hidden ${cat.bgColor}`}>
                 <div className={`mb-1 ${cat.color} group-hover:scale-110 transition-transform duration-300`}>{cat.icon}</div>
                 <span className="text-[9px] font-bold text-gray-200 text-center leading-tight">{cat.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative group/list">
           <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0f172a] to-transparent z-10 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0f172a] to-transparent z-10 pointer-events-none"></div>

           {loading && jobs.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 animate-pulse">
               <Briefcase className="w-8 h-8 opacity-50" />
               <span className="text-xs">جاري سحب البيانات الضخمة...</span>
             </div>
           ) : (
             <div className="animate-scroll-vertical hover:pause flex flex-col gap-3 p-4 pb-20" style={{ animationDuration: `${Math.max(60, tickerJobs.length * 3.5)}s` }}>
               {tickerJobs.map((job, index) => (
                 <div key={`${index}-${job.jobTitle}`} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 rounded-xl p-3 transition-all duration-200 group/card relative overflow-hidden">
                   <div className="relative flex gap-3">
                     <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden bg-white">
                       {job.logoUrl ? <img src={job.logoUrl} alt={job.company} className="w-full h-full object-contain p-0.5" onError={(e) => e.currentTarget.style.display = 'none'} /> : <Building2 className="w-5 h-5 text-gray-400" />}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-start justify-between gap-2">
                         <h3 className="text-sm font-bold text-gray-100 leading-tight line-clamp-2">{job.jobTitle}</h3>
                         {job.type && <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap bg-white/5 text-gray-300`}>{job.type}</span>}
                       </div>
                       <p className="text-[11px] text-gray-400 mt-1 truncate flex items-center gap-1"><Building2 className="w-3 h-3" />{job.company}</p>
                       <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                         {job.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.location}</span>}
                         {job.date && <span className="flex items-center gap-0.5 text-blue-400/80"><Calendar className="w-3 h-3" />{job.date}</span>}
                       </div>
                       
                       {/* Apply Button */}
                       <button 
                          onClick={(e) => handleApply(e, job)}
                          className="mt-3 w-full bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                       >
                          {user && user.isReadyToWork ? <UserCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          تقديم الآن
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>
        
        <div className="p-3 border-t border-white/10 bg-[#0f172a] text-[10px] text-gray-500 text-center z-20">
            <div className="flex items-center justify-center gap-2">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>تم التحديث: الآن (تلقائي)</span>
            </div>
            <div className="mt-1 opacity-60">المصدر: بوابة وظيفة.كوم</div>
        </div>

      </aside>
    </>
  );
};

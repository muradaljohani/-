
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Shield, Search, MapPin, Filter, RefreshCw, Briefcase, 
  Building2, Clock, CheckCircle2, Lock, ArrowRight, ExternalLink, 
  Server, Eye, Globe, ChevronUp, ChevronDown, Layout, PlusCircle, Trash2, X,
  Sparkles, History, Zap, TrendingUp, User, Share2, Camera, Edit2, BookOpen
} from 'lucide-react';
import { fetchJoobleJobs } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { SEOHelmet } from './SEOHelmet'; // Updated Import
import { Singularity_Core } from '../services/SingularityCore';
import { Synapse } from '../services/AutoMedic/Synapse';
import { Optimizer } from '../services/AutoMedic/Optimizer';
import { Enterprise } from '../services/Enterprise/EnterpriseCore';
import { NexusBrain } from '../services/Nexus/NexusBrain';
import { CrowdTicker } from './Nexus/CrowdTicker';

interface Props {
  onBack: () => void;
}

const ENTITIES = [
  "وزارة الدفاع", "وزارة الصحة", "أرامكو السعودية", "SABIC", "NEOM", 
  "الهيئة الملكية", "وزارة التعليم", "STC", "البنك المركزي", "هيئة البيانات والذكاء الاصطناعي"
];

const ROLES = [
  "أخصائي أمن سيبراني", "مهندس برمجيات", "محلل بيانات", "مدير مشاريع", 
  "طبيب مقيم", "معلم لغة إنجليزية", "محاسب عام", "فني شبكات", 
  "مسؤول موارد بشرية", "ضابط أمن وسلامة", "مدخل بيانات", "مستشار قانوني"
];

const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "الجبيل", "ينبع", "تبوك", "الخبر", "أبها"];

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string;
  type: string;
  source: string;
  isOfficial: boolean;
  logoUrl?: string;
  isGoogleJob?: boolean;
  url?: string;
  isFeatured?: boolean; 
  isSmartSuggestion?: boolean; 
  score?: number; 
}

const SideBanners: React.FC<{ recentlyViewed: Job[] }> = ({ recentlyViewed }) => (
  <>
    <div className="fixed top-24 right-4 w-[160px] z-30 hidden 2xl:flex flex-col gap-4 max-h-[80vh] overflow-y-auto pb-10 scrollbar-hide">
       {recentlyViewed.length > 0 && (
         <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-2">
            <div className="bg-blue-50 p-2 text-[10px] font-bold text-blue-800 flex items-center gap-1 border-b border-blue-100">
                <History className="w-3 h-3"/> شاهدت مؤخراً
            </div>
            <div className="flex flex-col">
                {recentlyViewed.slice(0, 3).map((job, i) => (
                    <div key={`recent-${i}`} className="p-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="text-[10px] font-bold text-gray-800 line-clamp-1">{job.title}</div>
                        <div className="text-[9px] text-gray-500">{job.company}</div>
                    </div>
                ))}
            </div>
         </div>
       )}
       {[...Array(3)].map((_, i) => (
         <div key={`r-${i}`} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:scale-105 group h-[160px]">
            <div className="h-full w-full bg-white flex flex-col items-center justify-center relative overflow-hidden p-2">
                <img src={`https://source.unsplash.com/random/150x150?company,logo&sig=${i + 10}`} alt="Company" className="w-16 h-16 object-contain mb-2 rounded-full border border-gray-100 p-1"/>
                <span className="text-xs font-bold text-gray-800 text-center leading-tight">Global Corp {i+1}</span>
            </div>
         </div>
       ))}
    </div>
  </>
);

export const NationalJobsPortal: React.FC<Props> = ({ onBack }) => {
  const { manualJobs, addManualJob, editManualJob, deleteManualJob, isAdmin, adminLogin, adminLogout, user, brain, healer } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', location: '', sort: 'relevance' });
  const [recentlyViewed, setRecentlyViewed] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'foryou' | 'all'>('foryou');
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  
  // Admin states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState({ title: '', company: '', description: '', url: '', location: 'الرياض' });

  // Job Fetching with Autonomic Healer Protection
  const fetchJobs = async () => {
    setLoading(true);
    
    const localJobs: Job[] = Array.from({ length: 20 }).map((_, i) => {
        const company = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
        const role = ROLES[Math.floor(Math.random() * ROLES.length)];
        return {
          id: `JOB-${1000 + i}`,
          title: role,
          company: company,
          location: CITIES[Math.floor(Math.random() * CITIES.length)],
          date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
          description: `تعلن ${company} عن توفر وظيفة شاغرة بمسمى ${role} للعمل ضمن فريقنا المتميز.`,
          type: i % 3 === 0 ? 'دوام كامل' : 'عقد',
          source: 'بوابة التوظيف الموحدة',
          isOfficial: true
        };
    });

    try {
        // FLUID: Using SafeFetch (Healer) to prevent freezing
        const jooblePromise = Optimizer.getInstance().smartFetch('jobs_feed', () => fetchJoobleJobs("All Jobs", "Saudi Arabia"));
        const joobleData = await healer.safeFetch('external_jobs', jooblePromise, [], 2500); // 2.5s Timeout
        
        let convertedJoobleJobs: Job[] = [];
        if (joobleData && Array.isArray(joobleData)) {
             convertedJoobleJobs = joobleData.map((j: any, idx: number) => ({
                id: `JOOBLE-${j.id || idx}`,
                title: j.title,
                company: j.company || 'شركة سعودية',
                location: j.location,
                date: j.updated || new Date().toISOString(),
                description: j.snippet,
                type: j.type || 'Full-time',
                source: 'Jooble',
                isOfficial: false,
                url: j.link
            }));
        }
        setJobs([...convertedJoobleJobs, ...localJobs]);
    } catch (error) {
        setJobs(localJobs);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
        // Track Search Input for Neural Bridge
        if (filters.search.length > 2) {
            NexusBrain.getInstance().trackSearch(filters.search, 'Jobs');
        }
  }, [filters.search]);

  // --- SMART SORTING (FLUID BRAIN) ---
  const filteredJobs = useMemo(() => {
    let all = [...manualJobs.map((mj: any) => ({ ...mj, isFeatured: true })), ...jobs];

    // 1. FLUID: Sanitize Search Input
    const safeSearch = healer.sanitize(filters.search.toLowerCase());

    // 2. Filter
    all = all.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(safeSearch) || job.company.toLowerCase().includes(safeSearch);
      const matchLocation = filters.location ? job.location.includes(filters.location) : true;
      return matchSearch && matchLocation;
    });

    // 3. FLUID: Cognitive Sorting (Interest Graph)
    if (activeTab === 'foryou') {
        // Sort using the Brain's tracked interests
        all = brain.personalizeList(all, (job) => `${job.title} ${job.description} ${job.location}`);
    } else {
        // Default sort (Date)
        all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return all;
  }, [jobs, filters, manualJobs, activeTab]);

  const handleJobClick = (job: Job) => {
      // FLUID: Track Interest
      brain.trackInteraction(job.title, 2);
      brain.trackInteraction(job.company, 1);
      
      // SEO: Inject Schema instantly on click
      Enterprise.SchemaGen.inject('Job', job);

      setRecentlyViewed(prev => [job, ...prev.filter(j => j.id !== job.id)].slice(0, 5));
      if(job.url) window.open(job.url, '_blank');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = adminLogin(adminUsername, adminPassword);
      if(success) { setShowAdminLogin(false); setAdminUsername(''); setAdminPassword(''); } 
      else alert('بيانات الدخول غير صحيحة');
  };

  const handlePostJob = (e: React.FormEvent) => {
      e.preventDefault();
      const jobData = { ...newJob, location: newJob.location || 'Saudi Arabia' };
      if (editingJobId) editManualJob(editingJobId, jobData); else {
          addManualJob({ ...jobData, date: new Date().toISOString(), isOfficial: true });
          // ENTERPRISE: GoogleBridge Trigger - Instant Indexing
          const slug = jobData.title.replace(/\s+/g, '-');
          Enterprise.GoogleBridge.notifyUpdate(`/jobs/${slug}`, 'URL_UPDATED');
      }
      setNewJob({ title: '', company: '', description: '', url: '', location: 'الرياض' });
      setEditingJobId(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f3f4f6] flex flex-col font-sans text-right animate-fade-in-up" dir="rtl">
      {/* Dynamic SEO Injection */}
      <SEOHelmet 
        title="بوابة الوظائف الوطنية" 
        description="أضخم بوابة للوظائف الحكومية والخاصة في السعودية. تحديث لحظي للفرص الوظيفية."
        path="/jobs"
      />

      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-lg shrink-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg border border-white/20"><Briefcase className="w-6 h-6 text-white"/></div>
            <div><h1 className="text-lg md:text-xl font-bold">أكاديمية ميلاف مراد — بوابة الوظائف</h1></div>
          </div>
          <div className="flex items-center gap-3">
              {isAdmin && <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded font-bold">وضع المشرف</span>}
              <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rtl:rotate-180"/> خروج
              </button>
          </div>
        </div>
      </header>

      <SideBanners recentlyViewed={recentlyViewed} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {isAdmin && (
              <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
                  <h3 className="font-bold mb-4">{editingJobId ? 'تعديل وظيفة' : 'إضافة وظيفة'}</h3>
                  <form onSubmit={handlePostJob} className="grid gap-4">
                      <input placeholder="المسمى" value={newJob.title} onChange={e=>setNewJob({...newJob, title: e.target.value})} className="border p-2 rounded"/>
                      <input placeholder="الشركة" value={newJob.company} onChange={e=>setNewJob({...newJob, company: e.target.value})} className="border p-2 rounded"/>
                      <textarea placeholder="الوصف" value={newJob.description} onChange={e=>setNewJob({...newJob, description: e.target.value})} className="border p-2 rounded"/>
                      <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold">حفظ ونشر (Google Indexing)</button>
                  </form>
              </div>
          )}

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400"/>
                    <input type="text" placeholder="ابحث..." className="w-full bg-gray-50 border p-2.5 pr-10 rounded-lg outline-none focus:border-blue-500"
                        value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
                </div>
                <select className="bg-gray-50 border p-2.5 rounded-lg" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
                    <option value="">كل المناطق</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <button onClick={fetchJobs} className="bg-gray-100 p-2.5 rounded-lg"><RefreshCw className={`w-5 h-5 ${loading?'animate-spin':''}`}/></button>
            </div>
          </div>

          <div className="flex gap-4 border-b border-gray-200 mb-4">
              <button onClick={() => setActiveTab('foryou')} className={`pb-3 text-sm font-bold flex gap-2 border-b-2 ${activeTab === 'foryou' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                  <Sparkles className="w-4 h-4"/> لك (AI)
              </button>
              <button onClick={() => setActiveTab('all')} className={`pb-3 text-sm font-bold flex gap-2 border-b-2 ${activeTab === 'all' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500'}`}>
                  <Layout className="w-4 h-4"/> الكل
              </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">جاري التحديث...</div>
          ) : filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all relative group">
                {job.isFeatured && <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">FEATURED</div>}
                
                {/* CROWD TICKER */}
                <div className="absolute top-4 left-4">
                    <CrowdTicker context="Jobs" itemId={job.id} />
                </div>

                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100"><Briefcase className="w-6 h-6 text-blue-500"/></div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">{job.title}</h3>
                            <div className="text-xs text-gray-500">{job.company} - {job.location}</div>
                        </div>
                    </div>
                    {isAdmin && job.isFeatured && (
                        <div className="flex gap-2">
                            <button onClick={() => { setEditingJobId(job.id); setNewJob({title:job.title, company:job.company, description:job.description, url:job.url||'', location:job.location}); }} className="text-blue-500"><Edit2 className="w-4 h-4"/></button>
                            <button onClick={() => deleteManualJob(job.id)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>
                <div className="flex justify-between items-center border-t pt-4">
                    <div className="text-xs text-gray-400">{new Date(job.date).toLocaleDateString('ar-SA')}</div>
                    <button onClick={() => handleJobClick(job)} className="bg-blue-600 text-white text-xs font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">تفاصيل</button>
                </div>
            </div>
          ))}
        </div>
      </main>

      {/* Admin Login Modal */}
      {showAdminLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
                  <h3 className="font-bold mb-4">دخول المشرف</h3>
                  <form onSubmit={handleAdminLogin}>
                      <input placeholder="Username" className="w-full border p-2 rounded mb-3" value={adminUsername} onChange={e => setAdminUsername(e.target.value)}/>
                      <input type="password" placeholder="Password" className="w-full border p-2 rounded mb-4" value={adminPassword} onChange={e => setAdminPassword(e.target.value)}/>
                      <div className="flex gap-2">
                          <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 border p-2 rounded">إلغاء</button>
                          <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded font-bold">دخول</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0b1220] border-t border-gray-800 text-gray-500 p-4 text-center text-xs relative z-20">
          <div onClick={() => setIsFooterOpen(!isFooterOpen)} className="cursor-pointer mb-2 font-bold hover:text-white">
              {isFooterOpen ? <ChevronDown className="mx-auto w-4 h-4"/> : <ChevronUp className="mx-auto w-4 h-4"/>}
          </div>
          <div className={`transition-all overflow-hidden ${isFooterOpen ? 'max-h-40' : 'max-h-0'}`}>
              <p>حقوق النشر © 2025 أكاديمية ميلاف مراد</p>
              {!isAdmin && <button onClick={() => setShowAdminLogin(true)} className="mt-2 text-gray-700 hover:text-gray-500"><Lock className="w-3 h-3 inline"/> Admin</button>}
          </div>
      </footer>
    </div>
  );
};

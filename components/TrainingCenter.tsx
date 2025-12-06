
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Clock, X, Award, Lock, GraduationCap, PlayCircle, 
  Video, FileText, CheckCircle2, List, Play, ShieldCheck, ChevronRight, 
  Book, MonitorPlay, FileCheck, HelpCircle, Search, Filter, 
  PlusCircle, Settings, Save, Trash2, Eye, Download, Layout,
  Activity, AlertTriangle, BrainCircuit, Users, RefreshCw, Briefcase, Key, Shield, Map, Tv, SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, CourseCategory } from '../types';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { generateMockCourses, generateMockVideos, CATEGORIES, VideoContent } from '../services/geminiService';
import { BehaviorObserver, RelevanceEngine } from '../services/LMS_Brain';
import { GamificationHUD, LeaderboardWidget, DiscussionPanel, LevelUpOverlay } from './GamificationComponents';
import { GamificationCore } from '../services/GamificationCore';
import { YouTubeService } from '../services/YouTubeService';
import { ArabicQuiz } from './ArabicQuiz';
import { CertificateGenerator } from './CertificateGenerator';
import { MentorConnect } from './Synapse/MentorConnect';
import { NexusBrain } from '../services/Nexus/NexusBrain';
import { CrowdTicker } from './Nexus/CrowdTicker';

// --- POWER ENGINE IMPORTS ---
import { LiveClassroom } from './Academy/Power/LiveClassroom';
import { CorporateDashboard } from './Academy/Power/CorporateDashboard';
import { VerifyPortal } from './Academy/Power/VerifyPortal';
import { AdaptiveTutor } from '../services/Academy/Power/AdaptiveTutor';

// --- GROWTH ENGINE IMPORTS ---
import { InstructorDashboard } from './Academy/Growth/InstructorDashboard';
import { CareerRoadmap } from './Academy/Growth/CareerRoadmap';

// --- VIDEO VAULT ---
import { VideoGallery } from './Academy/VideoVault/VideoGallery';

// --- TYPES FOR LMS ---
interface LMSCourse extends Course {
  priceType: 'Free' | 'Paid';
  trailerUrl?: string;
  progress?: number;
}

export const TrainingCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, enrollCourse, completeCourse, isAdmin } = useAuth();
    
    // --- STATE: MODULES ---
    const [viewMode, setViewMode] = useState<'courses' | 'roadmap' | 'instructor' | 'vault'>('courses');
    const [adminMode, setAdminMode] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
    // --- POWER MODALS ---
    const [liveClassOpen, setLiveClassOpen] = useState(false);
    const [corporateOpen, setCorporateOpen] = useState(false);
    const [verifyOpen, setVerifyOpen] = useState(false);
    
    // --- STATE: DATA ---
    const [courses, setCourses] = useState<LMSCourse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [filterType, setFilterType] = useState<'All' | 'Free' | 'Paid'>('All');
    const [isSyncing, setIsSyncing] = useState(false);
    
    // --- STATE: BRAIN ALERTS ---
    const [brainAlerts, setBrainAlerts] = useState<string[]>([]);
    
    // --- STATE: CINEMA MODE & EXAMS ---
    const [cinemaCourse, setCinemaCourse] = useState<LMSCourse | null>(null);
    const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
    const [videoStartTime, setVideoStartTime] = useState<number>(0); 
    const [showQuiz, setShowQuiz] = useState(false);
    const [showCertGen, setShowCertGen] = useState(false);

    // --- STATE: GAMIFICATION ---
    const [showLevelUp, setShowLevelUp] = useState<{show: boolean, level: number}>({show: false, level: 1});
    const [showDiscussion, setShowDiscussion] = useState(false);

    // --- STATE: ADMIN ARCHITECT ---
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [newCourse, setNewCourse] = useState<Partial<LMSCourse>>({
        title: '',
        category: 'AI',
        skillLevel: 'Beginner',
        priceType: 'Free',
        hours: 5,
        description: '',
        thumbnail: '',
        lessons: []
    });

    const observer = BehaviorObserver.getInstance();
    const brain = RelevanceEngine.getInstance();
    const gameEngine = GamificationCore.getInstance();
    const ytService = YouTubeService.getInstance();
    const aiTutor = AdaptiveTutor.getInstance();

    // --- INITIALIZATION & SELF-LEARNING ---
    useEffect(() => {
        // Load initial mock data + local storage data
        const mocks = generateMockCourses(50).map(c => ({
            ...c,
            priceType: Math.random() > 0.3 ? 'Free' : 'Paid',
            progress: Math.floor(Math.random() * 100)
        })) as LMSCourse[];
        
        const stored = JSON.parse(localStorage.getItem('mylaf_custom_courses') || '[]');
        let allCourses = [...stored, ...mocks];

        // 2. The 'Algorithmic' Brain: Dynamic Re-ordering
        const scoredCourses = brain.analyzeCoursePerformance(allCourses);
        setCourses(scoredCourses as LMSCourse[]);

        if (isAdmin) {
            setBrainAlerts(brain.getContentGaps());
        }

    }, [isAdmin]); 

    useEffect(() => {
        // Track Search Input for Neural Bridge
        if (searchQuery.length > 2) {
            NexusBrain.getInstance().trackSearch(searchQuery, 'Academy');
        }
    }, [searchQuery]);

    // --- SYSTEM 1: AUTO-SYNC ENGINE ---
    const handleSyncContent = async () => {
        setIsSyncing(true);
        // Using a sample playlist ID (e.g., Google Career Certs)
        const syncedCourses = await ytService.syncPlaylistToCourses('PLDoPjvoNmBAyE_gei5d18qKfIe-Z8mocs');
        
        const newCourses = syncedCourses.map(c => ({...c, priceType: 'Free', progress: 0} as LMSCourse));
        
        setCourses(prev => [...newCourses, ...prev]);
        setIsSyncing(false);
        alert(`✅ تم تحديث المحتوى بنجاح! تمت إضافة ${newCourses.length} دورة جديدة من يوتيوب.`);
    };

    // --- MODULE 1: COURSE ARCHITECT (ADMIN) ---
    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminUser === 'MURAD' && adminPass === 'MURAD123@A') {
            setAdminMode(true);
            setShowAdminLogin(false);
        } else {
            alert('Invalid Credentials');
        }
    };

    const handleCreateCourse = () => {
        const course: LMSCourse = {
            ...newCourse as LMSCourse,
            id: `C_CUSTOM_${Date.now()}`,
            provider: 'Murad Academy',
            skills: ['Custom'],
            lessons: newCourse.lessons || [
                { id: 'l1', title: 'Intro', durationSeconds: 300, orderIndex: 0, courseId: 'temp', videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' }
            ]
        };
        
        const updated = [course, ...courses];
        setCourses(updated);
        localStorage.setItem('mylaf_custom_courses', JSON.stringify(updated.filter(c => c.id.startsWith('C_CUSTOM'))));
        setAdminMode(false);
        alert('Course Created Successfully');
    };

    // --- MODULE 2: VISUAL GRID ---
    const filteredCourses = useMemo(() => {
        return courses.filter(c => {
            const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCat = activeCategory === 'All' || c.category === activeCategory;
            const matchType = filterType === 'All' || c.priceType === filterType;
            return matchSearch && matchCat && matchType;
        });
    }, [courses, searchQuery, activeCategory, filterType]);

    // --- MODULE 3: STUDENT BRAIN ---
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleEnroll = (course: LMSCourse) => {
        if (!user) { alert('Please Login First'); return; }
        observer.trackVideoEvent(course.id, 'video_start', 0, user.id);
        setVideoStartTime(Date.now());
        setCinemaCourse(course);
        setCurrentLessonIdx(0);
        localStorage.setItem(`progress_${user.id}_${course.id}`, 'started');
    };

    const handleNextLesson = () => {
        if (!cinemaCourse || !user) return;
        const duration = (Date.now() - videoStartTime) / 1000;
        observer.trackVideoEvent(cinemaCourse.id, 'video_complete', duration, user.id);
        const xpResult = gameEngine.awardXP(user.id, 50, 'video_complete');
        if (xpResult.newLevel) setShowLevelUp({ show: true, level: xpResult.level });

        const nextIdx = currentLessonIdx + 1;
        if (nextIdx < cinemaCourse.lessons.length) {
            setCurrentLessonIdx(nextIdx);
            setVideoStartTime(Date.now()); 
        } else {
            // End of Course -> Trigger Exam
            setShowQuiz(true);
        }
    };

    const handleQuizPass = (score: number) => {
        setShowQuiz(false);
        if (cinemaCourse) {
            completeCourse(cinemaCourse, score, 'A');
            setShowCertGen(true); // Show Certificate
        }
    };

    // POWER ENGINE: Adaptive Learning Injection
    const handleQuizFail = async () => {
        setShowQuiz(false);
        if (cinemaCourse) {
            alert("⚠️ لم تجتز الاختبار. يقوم المعلم الذكي (AI Tutor) بإعداد خطة علاجية مخصصة لك...");
            // Generate Remedial Path
            const remedial = await aiTutor.generateRemedialPlan(cinemaCourse.category, 45);
            // Inject into view
            setCinemaCourse(remedial as LMSCourse);
            setCurrentLessonIdx(0);
        }
    };

    const handleExitCinema = () => {
        if (cinemaCourse) {
            const duration = (Date.now() - videoStartTime) / 1000;
            observer.trackVideoEvent(cinemaCourse.id, 'video_pause', duration, user?.id || 'guest');
        }
        setCinemaCourse(null);
        setShowDiscussion(false);
        setShowQuiz(false);
        setShowCertGen(false);
    };

    // --- RENDERERS ---

    const AdminOverlay = () => (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-blue-900/20">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-400"/> Course Architect
                    </h2>
                    <button onClick={() => setAdminMode(false)}><X className="w-5 h-5 text-gray-400"/></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    {brainAlerts.length > 0 && (
                        <div className="bg-black/40 border border-green-500/30 p-4 rounded-xl mb-4 font-mono text-xs">
                            <h4 className="text-green-400 font-bold flex items-center gap-2 mb-2"><BrainCircuit className="w-4 h-4"/> LMS Intelligence Report</h4>
                            <ul className="space-y-1 text-green-300/80">
                                {brainAlerts.map((alert, i) => <li key={i}>&gt; {alert}</li>)}
                            </ul>
                        </div>
                    )}
                    <button onClick={handleSyncContent} disabled={isSyncing} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 mb-6">
                        {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Video className="w-5 h-5"/>}
                        {isSyncing ? 'جاري السحب...' : 'Auto-Sync YouTube Content'}
                    </button>
                    {/* Simplified Form */}
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Course Title" className="bg-black/30 border border-white/10 rounded-xl p-3 text-white" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})}/>
                        <select className="bg-black/30 border border-white/10 rounded-xl p-3 text-white" value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value as any})}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button onClick={handleCreateCourse} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                        <Save className="w-5 h-5"/> Publish Course
                    </button>
                </div>
            </div>
        </div>
    );

    const CinemaModal = () => {
        if (!cinemaCourse) return null;
        if (showQuiz) return <ArabicQuiz courseTitle={cinemaCourse.title} onPass={handleQuizPass} onFail={handleQuizFail} onClose={handleExitCinema} />;
        if (showCertGen) {
            return (
                <>
                    <CertificateGenerator courseName={cinemaCourse.title} studentName={user?.name || 'Student'} date={new Date().toLocaleDateString()} onClose={handleExitCinema} />
                    {/* Mentor Connect appears after graduation */}
                    <MentorConnect skill={cinemaCourse.category} onClose={() => {}} />
                </>
            );
        }

        const lesson = cinemaCourse.lessons[currentLessonIdx];
        const vidId = getYouTubeId(lesson.videoUrl);
        const suggestions = brain.getCollaborativeSuggestions(cinemaCourse.id, courses);

        return (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in-up" dir="rtl">
                <div className="h-16 bg-[#0f172a] border-b border-white/10 flex justify-between items-center px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={handleExitCinema} className="text-gray-400 hover:text-white flex items-center gap-2">
                            <ChevronRight className="w-5 h-5"/> خروج
                        </button>
                        <div className="h-6 w-px bg-white/10"></div>
                        <h3 className="text-white font-bold">{cinemaCourse.title}</h3>
                        
                        <CrowdTicker context="Academy" itemId={cinemaCourse.id} className="hidden md:inline-flex" />
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-4">
                        <GamificationHUD />
                        <span>درس {currentLessonIdx + 1} من {cinemaCourse.lessons.length}</span>
                    </div>
                </div>

                <div className="flex-1 flex">
                    <div className="flex-1 bg-black flex flex-col relative">
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#111] shadow-2xl relative">
                            {vidId ? (
                                <iframe 
                                    width="100%" height="100%" 
                                    src={`https://www.youtube.com/embed/${vidId}?autoplay=1&modestbranding=1&rel=0`}
                                    title="Lesson" frameBorder="0" allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">Video Source Not Available</div>
                            )}
                        </div>
                        
                        <div className="h-12 bg-[#0f172a] border-t border-white/10 flex items-center justify-between px-4">
                            <button 
                                onClick={() => setShowDiscussion(!showDiscussion)} 
                                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${showDiscussion ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Users className="w-4 h-4"/> النقاشات
                            </button>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleNextLesson}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-900/50 flex items-center gap-2 transition-all"
                                >
                                    {currentLessonIdx === cinemaCourse.lessons.length - 1 ? 'الاختبار النهائي' : 'الدرس التالي'} <ChevronLeft className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>

                        {showDiscussion && (
                            <div className="h-64 border-t border-white/10 bg-[#0f172a] relative z-20">
                                <DiscussionPanel lessonId={lesson.id} />
                            </div>
                        )}
                    </div>

                    <div className="w-80 bg-[#0f172a] border-r border-white/10 flex flex-col hidden md:flex">
                        <div className="p-4 border-b border-white/10 bg-[#1e293b]">
                            <h4 className="text-white font-bold text-sm">محتوى الدورة</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {cinemaCourse.lessons.map((l, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setCurrentLessonIdx(i)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors ${i === currentLessonIdx ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5'}`}
                                >
                                    <div className="text-xs font-mono opacity-50">{i + 1}.</div>
                                    <div className="truncate text-sm font-medium">{l.title}</div>
                                    {i < currentLessonIdx && <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-auto"/>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-[#0f172a] relative font-sans" dir="rtl">
            
            {/* POWER ENGINE OVERLAYS */}
            {liveClassOpen && <LiveClassroom onClose={() => setLiveClassOpen(false)} sessionTitle="أساسيات الأمن السيبراني" />}
            {corporateOpen && <CorporateDashboard onClose={() => setCorporateOpen(false)} />}
            <VerifyPortal isOpen={verifyOpen} onClose={() => setVerifyOpen(false)} />

            {/* MAIN HEADER */}
            <div className="bg-[#1e293b] border-b border-white/10 p-4 shadow-lg shrink-0 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5"/>
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-white flex items-center gap-2">
                                <GraduationCap className="w-6 h-6 text-blue-500"/>
                                أكاديمية ميلاف (LMS)
                            </h1>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <BrainCircuit className="w-3 h-3 text-emerald-500"/> Adaptive Learning Engine v3.0
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="md:hidden p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300">
                        <SlidersHorizontal className="w-5 h-5"/>
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                    {/* View Switchers - Responsive */}
                    <div className="bg-black/30 p-1 rounded-lg flex items-center shrink-0">
                        <button onClick={() => setViewMode('courses')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${viewMode === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            الكل
                        </button>
                        <button onClick={() => setViewMode('vault')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${viewMode === 'vault' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            <Tv className="w-3 h-3"/> فيديو
                        </button>
                        <button onClick={() => setViewMode('roadmap')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${viewMode === 'roadmap' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            <Map className="w-3 h-3"/> مسارات
                        </button>
                        <button onClick={() => setViewMode('instructor')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${viewMode === 'instructor' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            <Video className="w-3 h-3"/> تدريس
                        </button>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>

                    {/* NEW POWER BUTTONS - UNLOCKED FOR MOBILE */}
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => setVerifyOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3"/> الشهادات
                        </button>
                        <button onClick={() => setCorporateOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-colors whitespace-nowrap">
                            <Briefcase className="w-3 h-3"/> للشركات
                        </button>
                        <button onClick={() => setLiveClassOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold animate-pulse hover:bg-red-500 transition-colors shadow-lg shadow-red-900/50 whitespace-nowrap">
                            <Video className="w-3 h-3"/> مباشر
                        </button>
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>
                    <div className="hidden md:block"><GamificationHUD /></div>
                    
                    <button onClick={() => setShowAdminLogin(true)} className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
                        <Lock className="w-3 h-3"/> Admin
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Filters Sidebar - Responsive */}
                {viewMode !== 'vault' && (
                    <aside className={`
                        fixed inset-y-0 right-0 w-64 bg-[#0b1120] border-l border-white/10 p-6 overflow-y-auto z-30 transition-transform duration-300
                        ${showMobileFilters ? 'translate-x-0' : 'translate-x-full'}
                        md:relative md:translate-x-0 md:block
                    `}>
                        <div className="md:hidden flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold">تصفية</h3>
                            <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5 text-gray-400"/></button>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">التصنيف</h3>
                            <div className="space-y-2">
                                {['All', ...CATEGORIES].map((cat) => (
                                    <button key={cat as any} onClick={() => { setActiveCategory(cat as any); setShowMobileFilters(false); }} className={`w-full text-right text-sm py-2 px-3 rounded-lg transition-all ${activeCategory === cat ? 'bg-blue-600 text-white font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:hidden">
                            <LeaderboardWidget />
                        </div>
                    </aside>
                )}
                
                {/* Desktop Sidebar - Leaderboard Only (if space allows) */}
                 {viewMode !== 'vault' && (
                    <aside className="w-64 bg-[#0b1120] border-l border-white/10 p-6 hidden lg:block overflow-y-auto shrink-0">
                        <LeaderboardWidget />
                    </aside>
                 )}

                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative">
                    {/* Backdrop for mobile filter */}
                    {showMobileFilters && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setShowMobileFilters(false)}></div>}

                    {viewMode === 'instructor' && <InstructorDashboard />}
                    {viewMode === 'roadmap' && <CareerRoadmap />}
                    {viewMode === 'vault' && <VideoGallery />}
                    {viewMode === 'courses' && (
                        <div className="p-4 md:p-6">
                            <div className="relative max-w-2xl mx-auto mb-8">
                                <input type="text" placeholder="ابحث عن دورة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white shadow-xl focus:border-blue-500 outline-none transition-all"/>
                                <Search className="absolute right-4 top-4.5 w-5 h-5 text-gray-400"/>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                {filteredCourses.map(course => (
                                    <div key={course.id} onMouseEnter={() => observer.trackHoverStart(course.id)} onMouseLeave={() => observer.trackHoverEnd(course.id, user?.id)} className="group relative bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col">
                                        <div className="aspect-video relative overflow-hidden bg-black">
                                            <img src={course.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity duration-300"/>
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${course.priceType === 'Free' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-black'}`}>{course.priceType}</span>
                                            </div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                                <button onClick={() => handleEnroll(course)} className="bg-white text-blue-900 rounded-full p-4 shadow-xl hover:scale-110 transition-transform mb-3">
                                                    <Play className="w-6 h-6 fill-current ml-1"/>
                                                </button>
                                                <span className="text-white font-bold text-sm drop-shadow-md">معاينة سريعة</span>
                                            </div>
                                            {course.progress !== undefined && course.progress > 0 && (
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                                    <div className="h-full bg-emerald-500" style={{width: `${course.progress}%`}}></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-white font-bold text-base mb-2 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                                <Clock className="w-3 h-3"/> <span>{course.hours} ساعة</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                <span>{course.skillLevel}</span>
                                            </div>
                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white font-bold">{course.provider.charAt(0)}</div>
                                                    <span className="text-xs text-gray-400 truncate max-w-[80px]">{course.provider}</span>
                                                </div>
                                                <button onClick={() => handleEnroll(course)} className="text-blue-400 text-xs font-bold hover:text-white transition-colors">{course.progress ? 'متابعة' : 'سجل الآن'}</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {adminMode && <AdminOverlay />}
            {cinemaCourse && <CinemaModal />}
            {showLevelUp.show && <LevelUpOverlay level={showLevelUp.level} onClose={() => setShowLevelUp({show: false, level: 1})} />}
            
            {showAdminLogin && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl text-right">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">دخول المشرف</h3>
                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <input type="text" placeholder="اسم المستخدم" className="w-full border p-3 rounded-lg text-right" value={adminUser} onChange={e => setAdminUser(e.target.value)}/>
                            <input type="password" placeholder="كلمة المرور" className="w-full border p-3 rounded-lg text-right" value={adminPass} onChange={e => setAdminPass(e.target.value)}/>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">إلغاء</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">دخول</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

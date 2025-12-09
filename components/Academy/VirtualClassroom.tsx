
import React, { useState, useEffect } from 'react';
import { X, PlayCircle, FileText, CheckCircle2, Award, BookOpen, ChevronRight, Video, Star, ThumbsUp } from 'lucide-react';
import { CourseExtended, Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ExamEngine } from './ExamEngine';
import { CertificateGenerator } from '../CertificateGenerator';

interface Props {
    course: CourseExtended;
    onClose: () => void;
}

export const VirtualClassroom: React.FC<Props> = ({ course, onClose }) => {
    const { user, updateCourseProgress } = useAuth();
    const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showExam, setShowExam] = useState(false);
    const [showCert, setShowCert] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // --- REVIEW SYSTEM STATES ---
    const [activeTab, setActiveTab] = useState<'modules' | 'reviews'>('modules');
    const [reviews, setReviews] = useState<Review[]>(course.reviews || []);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');

    const modules = course.modules || [];
    const currentModule = modules[currentModuleIdx];

    // Simulate video progress
    useEffect(() => {
        let interval: any;
        if (isPlaying && progress < 100) {
            interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 1;
                    if (next >= 100) {
                        setIsPlaying(false);
                        handleModuleComplete();
                        return 100;
                    }
                    return next;
                });
            }, 100); 
        }
        return () => clearInterval(interval);
    }, [isPlaying, progress]);

    const handleModuleComplete = () => {
        updateCourseProgress(course.id, Math.floor(((currentModuleIdx + 1) / modules.length) * 100));
        if (currentModuleIdx < modules.length - 1) {
            setCurrentModuleIdx(prev => prev + 1);
            setProgress(0); 
            setIsPlaying(false);
        }
    };

    const handleExamPass = () => {
        setShowExam(false);
        setShowCert(true);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (userRating === 0 || !userComment.trim()) return alert("يرجى اختيار التقييم وكتابة تعليق");
        
        const newReview: Review = {
            id: `rev_${Date.now()}`,
            reviewerName: user?.name || 'زائر',
            rating: userRating,
            comment: userComment,
            date: new Date().toISOString().split('T')[0]
        };
        
        setReviews([newReview, ...reviews]);
        setUserRating(0);
        setUserComment('');
    };

    const renderStars = (rating: number, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                        key={star} 
                        type="button" 
                        onClick={() => interactive && setUserRating(star)}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    >
                        <Star 
                            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                        />
                    </button>
                ))}
            </div>
        );
    };

    // --- MASSIVE TEXT GENERATOR (Simulating 5000 Words) ---
    const generateDeepText = (seedTitle: string) => {
        const sections = [
            "المقدمة والأهداف", "الخلفية النظرية", "الأدوات والتقنيات", "منهجية العمل", 
            "التحليل والتصميم", "التنفيذ البرمجي", "الاختبار والتحقق", "النتائج والمناقشة", 
            "التحديات والحلول", "الخاتمة والتوصيات"
        ];

        // This creates a visually long, structured document
        return (
            <div className="space-y-12">
                <div className="bg-blue-50 border-r-4 border-blue-600 p-6 rounded-l-lg">
                    <h3 className="font-bold text-xl text-blue-900 mb-2">ملخص الوحدة</h3>
                    <p className="text-blue-800 leading-relaxed">
                        تعتبر هذه الوحدة هي الحجر الأساس في فهم <strong>{seedTitle}</strong>. سنستعرض هنا المفاهيم العميقة التي ستمكنك من بناء أنظمة متطورة قابلة للتوسع. يغطي هذا النص ما يعادل 50 ساعات من البحث المكثف.
                    </p>
                </div>

                {sections.map((sec, i) => (
                    <section key={i}>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">{i+1}</span>
                            {sec}
                        </h2>
                        <div className="prose prose-lg text-gray-700 leading-loose text-justify font-serif">
                            <p>
                                في سياق {seedTitle}، نجد أن {sec} يلعب دوراً محورياً. إن الفهم العميق لهذه الجزئية يتطلب منا النظر في عدة عوامل مترابطة. 
                                أولاً، البنية التحتية التقنية التي تدعم هذا المفهوم تعتمد بشكل كبير على الخوارزميات المتقدمة.
                                ثانياً، التكامل مع الأنظمة الأخرى يتطلب بروتوكولات اتصال موحدة وواضحة.
                            </p>
                            <p>
                                تشير الدراسات الحديثة في مجال <strong>{seedTitle}</strong> إلى أن تطبيق معايير الجودة العالمية في مرحلة {sec} يؤدي إلى تحسين الأداء بنسبة تصل إلى 40%. 
                                ومن الأمثلة العملية على ذلك ما قامت به كبرى الشركات التقنية عند تبني هذه المنهجية.
                            </p>
                            <ul className="list-disc pr-6 my-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <li>تحليل المتطلبات الوظيفية وغير الوظيفية بدقة عالية.</li>
                                <li>تصميم هيكلية قابلة للتوسع (Scalable Architecture).</li>
                                <li>ضمان أمن المعلومات وحماية البيانات في جميع المراحل.</li>
                                <li>استخدام أدوات القياس والمراقبة المستمرة.</li>
                            </ul>
                            <p>
                                وبالانتقال إلى الجانب التطبيقي، نجد أن التحديات التي تواجه المطورين في {sec} غالباً ما تكون مرتبطة بـ إدارة الموارد وتحسين الكفاءة. 
                                وللتغلب على هذه التحديات، نوصي باتباع أفضل الممارسات (Best Practices) الموضحة في المراجع المعتمدة لهذه الدورة.
                            </p>
                        </div>
                    </section>
                ))}

                <div className="bg-gray-900 text-white p-8 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-4">نهاية المحتوى النصي</h3>
                    <p className="text-gray-400">لقد أتممت قراءة المادة العلمية المكثفة لهذه الوحدة. يمكنك الآن الانتقال للاختبار.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[11000] bg-[#020617] flex font-sans" dir="rtl">
            {/* Sidebar */}
            <div className="w-80 bg-[#0f172a] border-l border-white/10 flex flex-col hidden md:flex shrink-0">
                <div className="p-6 border-b border-white/10">
                    <button onClick={onClose} className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold">
                        <ChevronRight className="w-4 h-4"/> خروج من الفصل
                    </button>
                    <h2 className="text-white font-bold text-lg leading-tight">{course.title}</h2>
                    <div className="mt-4 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${((currentModuleIdx) / modules.length) * 100}%` }}></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {modules.map((mod, idx) => (
                        <button 
                            key={mod.id}
                            onClick={() => { setCurrentModuleIdx(idx); setProgress(0); setIsPlaying(false); }}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-all ${
                                idx === currentModuleIdx 
                                ? 'bg-blue-600/10 border border-blue-600/30 text-white' 
                                : 'text-gray-400 hover:bg-white/5'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] border ${
                                idx < currentModuleIdx ? 'bg-emerald-500 border-emerald-500 text-black' : 
                                idx === currentModuleIdx ? 'border-blue-500 text-blue-500' : 'border-gray-600 text-gray-600'
                            }`}>
                                {idx < currentModuleIdx ? <CheckCircle2 className="w-3 h-3"/> : idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{mod.title}</div>
                                <div className="flex items-center gap-2 text-[10px] opacity-60 mt-0.5">
                                    {mod.duration}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative bg-black overflow-hidden">
                <div className="md:hidden h-14 bg-[#0f172a] flex items-center justify-between px-4 shrink-0 z-20">
                    <h3 className="text-white font-bold text-sm truncate max-w-[200px]">{course.title}</h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400"/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-[#f8fafc]">
                    
                    {/* VIDEO RENDERER */}
                    {currentModule.type === 'video' ? (
                        <div className="w-full max-w-5xl self-center aspect-video bg-[#1e293b] rounded-xl overflow-hidden relative shadow-2xl">
                             <img src={course.thumbnail} className="w-full h-full object-cover opacity-50"/>
                             <div className="absolute inset-0 flex items-center justify-center">
                                {!isPlaying && progress < 100 && (
                                    <button onClick={() => setIsPlaying(true)} className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                                        <PlayCircle className="w-10 h-10 fill-white"/>
                                    </button>
                                )}
                                {progress >= 100 && <div className="bg-black/80 px-6 py-3 rounded-full flex items-center gap-2 text-emerald-400"><CheckCircle2/> مكتمل</div>}
                            </div>
                        </div>
                    ) : (
                        /* MASSIVE TEXT RENDERER */
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden my-auto min-h-min pb-20">
                             {/* Dynamic Banner */}
                             <div className="w-full h-64 md:h-80 relative">
                                 <img src={(currentModule as any).banner || course.thumbnail} className="w-full h-full object-cover"/>
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                     <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">{currentModule.title}</h1>
                                 </div>
                             </div>
                             
                             <div className="p-8 md:p-16">
                                {/* The 5000 Words Simulation */}
                                {generateDeepText(course.title)}

                                <div className="mt-12 flex justify-center border-t pt-12">
                                    <button onClick={handleModuleComplete} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-xl transition-all flex items-center gap-3 transform hover:scale-105">
                                        <CheckCircle2 className="w-6 h-6"/> 
                                        إتمام الوحدة والانتقال
                                    </button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Exam Overlay */}
            {showExam && (
                <div className="absolute inset-0 z-[11050] bg-[#0f172a] flex items-center justify-center">
                    <ExamEngine 
                        courseId={course.id} 
                        courseName={course.title} 
                        onPass={handleExamPass} 
                        onClose={() => setShowExam(false)}
                    />
                </div>
            )}

            {/* Certificate Overlay */}
            {showCert && (
                <CertificateGenerator 
                    courseName={course.title}
                    studentName={user?.name || 'Student'}
                    date={new Date().toLocaleDateString()}
                    onClose={() => { setShowCert(false); onClose(); }}
                />
            )}
        </div>
    );
};

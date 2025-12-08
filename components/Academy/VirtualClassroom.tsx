
import React, { useState, useEffect, useRef } from 'react';
import { X, PlayCircle, FileText, CheckCircle2, Lock, Award, BookOpen, ChevronRight, Clock, Video, List, Trophy, Star, MessageSquare, Send, ThumbsUp } from 'lucide-react';
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
    const [reviews, setReviews] = useState<Review[]>(course.reviews || [
        { id: 'r1', reviewerName: 'محمد العتيبي', rating: 5, comment: 'دورة ممتازة وشرح واضح جداً', date: '2023-11-01' },
        { id: 'r2', reviewerName: 'سارة', rating: 4, comment: 'محتوى جيد لكن يحتاج تفصيل أكثر في الجزء العملي', date: '2023-10-25' }
    ]);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');

    // Mock Modules if not present
    const modules = course.modules || [
        { id: 'm1', title: 'مقدمة في المنهج', type: 'video', duration: '05:00', isCompleted: true },
        { id: 'm2', title: 'أساسيات النظرية', type: 'video', duration: '15:00', isCompleted: false },
        { id: 'm3', title: 'التطبيق العملي الأول', type: 'video', duration: '20:00', isCompleted: false },
        { id: 'm4', title: 'ملخص بصيغة PDF', type: 'pdf', duration: '10:00', isCompleted: false },
        { id: 'm5', title: 'المشروع النهائي', type: 'assignment', duration: '45:00', isCompleted: false },
    ];

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
            }, 100); // Fast simulation
        }
        return () => clearInterval(interval);
    }, [isPlaying, progress]);

    const handleModuleComplete = () => {
        updateCourseProgress(course.id, Math.floor(((currentModuleIdx + 1) / modules.length) * 100));
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

    return (
        // FIXED Z-INDEX: Increased to z-[11000] to ensure it appears above UniversalProfileHub (z-9000)
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
                    <p className="text-xs text-gray-500 mt-2 text-left">{currentModuleIdx} / {modules.length} مكتمل</p>

                    {/* TABS SWITCHER */}
                    <div className="flex mt-6 bg-black/20 p-1 rounded-lg">
                        <button onClick={()=>setActiveTab('modules')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab==='modules' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>المحتوى</button>
                        <button onClick={()=>setActiveTab('reviews')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab==='reviews' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>التقييمات ({reviews.length})</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                    {activeTab === 'modules' ? (
                        modules.map((mod, idx) => (
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
                                        {mod.type === 'video' ? <Video className="w-3 h-3"/> : mod.type === 'text' ? <BookOpen className="w-3 h-3"/> : <FileText className="w-3 h-3"/>}
                                        {mod.duration}
                                    </div>
                                </div>
                                {idx === currentModuleIdx && isPlaying && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                            </button>
                        ))
                    ) : (
                        <div className="space-y-4 p-2">
                            {/* Review Form */}
                            {user && (
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
                                    <h4 className="text-white text-xs font-bold mb-2">أضف تقييمك</h4>
                                    <div className="flex justify-center mb-2">
                                        {renderStars(userRating, true)}
                                    </div>
                                    <textarea 
                                        value={userComment}
                                        onChange={(e) => setUserComment(e.target.value)}
                                        placeholder="اكتب تعليقك..."
                                        className="w-full bg-black/20 text-white text-xs p-2 rounded-lg border border-white/10 outline-none mb-2 min-h-[60px]"
                                    />
                                    <button 
                                        onClick={handleSubmitReview}
                                        disabled={!userRating || !userComment}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                                    >
                                        نشر التقييم
                                    </button>
                                </div>
                            )}

                            {/* Reviews List */}
                            {reviews.map((rev) => (
                                <div key={rev.id} className="bg-[#1e293b] p-3 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-white text-xs font-bold">{rev.reviewerName}</span>
                                        {renderStars(rev.rating)}
                                    </div>
                                    <p className="text-gray-400 text-xs leading-relaxed">{rev.comment}</p>
                                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-between text-[10px] text-gray-500">
                                        <span>{rev.date}</span>
                                        <button className="flex items-center gap-1 hover:text-white"><ThumbsUp className="w-3 h-3"/> مفيد</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {activeTab === 'modules' && (
                    <div className="p-4 border-t border-white/10">
                        <button 
                            onClick={() => setShowExam(true)}
                            // Only allow exam if at least one module is done (relaxed for demo)
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:scale-105`}
                        >
                            <Award className="w-5 h-5"/>
                            الاختبار النهائي
                        </button>
                    </div>
                )}
            </div>

            {/* Main Stage */}
            <div className="flex-1 flex flex-col relative bg-black overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden h-14 bg-[#0f172a] flex items-center justify-between px-4 shrink-0 z-20">
                    <h3 className="text-white font-bold text-sm truncate max-w-[200px]">{course.title}</h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400"/></button>
                </div>

                {/* Content Player - Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center bg-[#020617]">
                    
                    {/* VIDEO TYPE */}
                    {currentModule.type === 'video' ? (
                        <div className="w-full max-w-4xl self-center aspect-video bg-[#1e293b] rounded-xl overflow-hidden relative shadow-2xl border border-white/5">
                            {/* Video Placeholder */}
                            <img src={course.thumbnail} className="w-full h-full object-cover opacity-50"/>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {!isPlaying && progress < 100 && (
                                    <button onClick={() => setIsPlaying(true)} className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:scale-110 transition-transform">
                                        <PlayCircle className="w-10 h-10 fill-white"/>
                                    </button>
                                )}
                                {progress >= 100 && (
                                    <div className="bg-black/80 px-6 py-3 rounded-full flex items-center gap-2 text-emerald-400 border border-emerald-500/30">
                                        <CheckCircle2 className="w-6 h-6"/> مكتمل
                                        <button onClick={() => {if(currentModuleIdx < modules.length-1) { setCurrentModuleIdx(prev => prev+1); setProgress(0); }}} className="ml-4 text-white hover:underline">التالي</button>
                                    </div>
                                )}
                            </div>
                            
                            {/* Controls Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="text-white font-bold mb-2">{currentModule.title}</div>
                                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                                    <div className="h-full bg-blue-500" style={{width: `${progress}%`}}></div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
                                    <span>{Math.floor((progress/100) * parseInt(currentModule.duration))}:00</span>
                                    <span>{currentModule.duration}</span>
                                </div>
                            </div>
                        </div>
                    ) : currentModule.type === 'text' ? (
                        /* TEXT ARTICLE TYPE (Fixed layout and styling) */
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto min-h-min">
                             {/* Banner */}
                             {(currentModule as any).banner && (
                                 <div className="w-full h-64 md:h-80 relative">
                                     <img src={(currentModule as any).banner} className="w-full h-full object-cover" alt="Module Banner"/>
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                         <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{currentModule.title}</h1>
                                     </div>
                                 </div>
                             )}
                             
                             <div className="p-8 md:p-12">
                                <div 
                                    className="prose prose-lg prose-slate max-w-none text-gray-800 leading-loose text-justify font-serif"
                                    dangerouslySetInnerHTML={{ __html: (currentModule as any).content }}
                                />

                                <div className="mt-12 flex justify-center border-t pt-8">
                                    <button onClick={() => handleModuleComplete()} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 transform hover:scale-105">
                                        <CheckCircle2 className="w-5 h-5"/> إتمام قراءة الوحدة
                                    </button>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 self-center">
                            <FileText className="w-20 h-20 mx-auto mb-4 opacity-20"/>
                            <p>محتوى للاختبار / التحميل</p>
                            <button onClick={() => setProgress(100)} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">تحديد كمقمل</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlays */}
            {showExam && (
                <div className="absolute inset-0 z-[11050] bg-[#0f172a] flex items-center justify-center">
                    <ExamEngine 
                        courseId={course.id} 
                        courseName={course.title} 
                        onPass={handleExamPass} 
                        onClose={() => setShowExam(false)}
                        unlockPermission={course.unlocksPermission}
                    />
                </div>
            )}

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


import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Briefcase, GraduationCap, ShoppingBag, 
    Wallet, Settings, LogOut, CheckCircle2, 
    Clock, Trophy, TrendingUp, Download, ArrowUpRight, BookOpen, Play,
    CreditCard, Save, MapPin, Phone, Mail, Edit3, Loader2, FileText,
    Menu, X, Camera, Award, Shield, FileCheck, Star, PlayCircle, Grid, List
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AcademicTranscript } from '../Academy/AcademicTranscript';
import { VirtualClassroom } from '../Academy/VirtualClassroom';
import { SmartIDCard } from '../Identity/SmartIDCard'; 
import { CommunityPulse } from '../Social/CommunityPulse';
import { InstallPrompt } from '../Mobile/InstallPrompt'; 
import { ExperienceValidationModal } from '../ExperienceValidationModal';
import { CertificatePreviewModal } from '../CertificatePreviewModal';
import { CertificateGenerator } from '../CertificateGenerator';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const UniversalProfileHub: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, logout, updateProfile } = useAuth();
    const [activeSection, setActiveSection] = useState<'overview' | 'academy' | 'wallet' | 'experience' | 'documents' | 'settings'>('overview');
    const [activeCourse, setActiveCourse] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Modals
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showCertPreview, setShowCertPreview] = useState(false);
    const [showGenCert, setShowGenCert] = useState(false);

    // Editing State
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        phone: '',
        currentJobTitle: '',
        address: '',
        skills: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                phone: user.phone || '',
                currentJobTitle: user.currentJobTitle || '',
                address: user.address || '',
                skills: user.skills ? user.skills.join(', ') : ''
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    // --- Aggregated Data ---
    const walletBalance = user.wallet?.balance || 0;
    const certsCount = user.certificates?.length || 0;
    
    // Status colors
    const statusColor = user.isIdentityVerified ? 'text-emerald-400' : 'text-amber-400';
    const statusBg = user.isIdentityVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20';

    const SidebarItem = ({ id, icon, label }: any) => (
        <button 
            onClick={() => { setActiveSection(id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeSection === id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            <span className="text-sm font-bold">{label}</span>
        </button>
    );

    const handleStartCourse = (courseId: number) => {
        // Simulate course object for VirtualClassroom
        const mockCourse = {
            id: `c_${courseId}`,
            title: `الحقيبة التدريبية الشاملة رقم ${courseId}`,
            description: 'دورة شاملة تغطي المهارات الأساسية والمتقدمة.',
            modules: [
                { id: 'm1', title: 'مقدمة في المنهج', type: 'video', duration: '10:00', isCompleted: true },
                { id: 'm2', title: 'المحتوى الأساسي النظري', type: 'video', duration: '45:00', isCompleted: false },
                { id: 'm3', title: 'تطبيقات عملية ومشاريع', type: 'video', duration: '30:00', isCompleted: false },
                { id: 'm4', title: 'الاختبار النهائي للحقيبة', type: 'quiz', duration: '15:00', isCompleted: false }
            ],
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
            unlocksPermission: 'none'
        };
        setActiveCourse(mockCourse);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    updateProfile({ avatar: ev.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800)); // Simulate delay
        updateProfile({
            name: formData.name,
            bio: formData.bio,
            phone: formData.phone,
            currentJobTitle: formData.currentJobTitle,
            address: formData.address,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        });
        setIsSaving(false);
        alert("✅ تم تحديث البيانات الشخصية بنجاح!");
    };

    return (
        <>
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-0 md:p-4 bg-[#0f172a]/95 backdrop-blur-xl font-sans animate-fade-in-up" dir="rtl">
            <div className="relative w-full h-full bg-[#0f172a] md:rounded-3xl shadow-2xl border border-white/10 flex overflow-hidden flex-col md:flex-row">
                
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-white/10 shrink-0 z-30">
                    <div className="flex items-center gap-3">
                        <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-10 h-10 rounded-full border border-white/20 object-cover"/>
                        <div>
                            <h2 className="text-white font-bold text-sm">{user.name}</h2>
                            <p className="text-xs text-gray-400">لوحة التحكم</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/10 rounded-lg text-white">
                             {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                         </button>
                         <button onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><LogOut className="w-5 h-5 rtl:rotate-180"/></button>
                    </div>
                </div>

                {/* Sidebar (Desktop & Mobile Drawer) */}
                <div className={`
                    fixed md:relative inset-0 z-20 md:z-auto bg-[#0b1120] md:bg-transparent md:w-72 md:border-l border-white/10 flex flex-col p-6 transition-transform duration-300 overflow-y-auto
                    ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    {/* Close Mobile Menu */}
                    <button onClick={() => setMobileMenuOpen(false)} className="md:hidden absolute top-4 left-4 p-2 text-gray-400"><X className="w-6 h-6"/></button>

                    {/* Desktop User Card */}
                    <div className="text-center mb-8 hidden md:block">
                        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={() => setActiveSection('settings')}>
                            <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full rounded-full border-4 border-[#1e293b] shadow-xl object-cover"/>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Edit3 className="w-6 h-6 text-white"/>
                            </div>
                            {user.isIdentityVerified && <div className="absolute bottom-0 right-0 bg-emerald-500 border-4 border-[#0b1120] rounded-full p-1"><CheckCircle2 className="w-4 h-4 text-white"/></div>}
                        </div>
                        <h2 className="text-white font-bold text-lg mb-1">{user.name}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBg} ${statusColor}`}>
                            {user.isIdentityVerified ? 'هوية موثقة' : 'غير موثق'}
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 space-y-2">
                        <SidebarItem id="overview" icon={<User className="w-5 h-5"/>} label="النظرة العامة" />
                        <SidebarItem id="academy" icon={<BookOpen className="w-5 h-5 text-purple-400"/>} label="أكاديمية ميلاف (الحقائب)" />
                        <SidebarItem id="experience" icon={<Award className="w-5 h-5 text-amber-400"/>} label="اشتري خبرتك" />
                        <SidebarItem id="documents" icon={<FileCheck className="w-5 h-5 text-blue-400"/>} label="الوثائق والشهادات" />
                        <SidebarItem id="wallet" icon={<Wallet className="w-5 h-5 text-emerald-400"/>} label="المحفظة المالية" />
                        <SidebarItem id="settings" icon={<Settings className="w-5 h-5"/>} label="الإعدادات وتعديل الملف" />
                        <div className="pt-4"><InstallPrompt /></div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-white/10">
                        <button onClick={() => { logout(); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold">
                            <LogOut className="w-5 h-5 rtl:rotate-180"/> تسجيل الخروج
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4 md:p-10 relative scrollbar-thin scrollbar-thumb-white/10">
                    
                    {/* Desktop Close */}
                    <button onClick={onClose} className="hidden md:block absolute top-6 left-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-20">
                        <X className="w-5 h-5"/>
                    </button>

                    {/* VIEW: OVERVIEW */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-white mb-2">لوحة التحكم المركزية</h1>
                                    <p className="text-gray-400 text-sm">مرحباً بك في نظام ميلاف الموحد. تحكم في مسارك المهني والتعليمي من هنا.</p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <CommunityPulse />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-12 h-12 text-emerald-500"/></div>
                                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">الرصيد</div>
                                    <div className="text-2xl font-black text-white">{walletBalance} <span className="text-sm font-normal text-gray-500">SAR</span></div>
                                </div>
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><GraduationCap className="w-12 h-12 text-purple-500"/></div>
                                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">الشهادات</div>
                                    <div className="text-2xl font-black text-white">{certsCount}</div>
                                </div>
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer hover:bg-white/5" onClick={() => setActiveSection('experience')}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="w-12 h-12 text-amber-500"/></div>
                                    <div className="text-amber-400 text-xs font-bold uppercase mb-1">توثيق الخبرة</div>
                                    <div className="text-sm font-bold text-white mt-2 flex items-center gap-1">ابدأ التوثيق <ArrowUpRight className="w-4 h-4"/></div>
                                </div>
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer hover:bg-white/5" onClick={() => setActiveSection('academy')}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-12 h-12 text-blue-500"/></div>
                                    <div className="text-blue-400 text-xs font-bold uppercase mb-1">الحقائب التدريبية</div>
                                    <div className="text-sm font-bold text-white mt-2 flex items-center gap-1">تصفح (50) حقيبة <ArrowUpRight className="w-4 h-4"/></div>
                                </div>
                            </div>
                            
                            {/* Smart ID Card Mini */}
                            <div className="mt-8">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-400"/> بطاقتي الرقمية</h3>
                                <SmartIDCard user={user} />
                            </div>
                        </div>
                    )}

                    {/* VIEW: ACADEMY (Integrated Courses) */}
                    {activeSection === 'academy' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-purple-400"/> أكاديمية ميلاف (الحقائب التدريبية)
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">تصفح وابدأ الدورات التدريبية المعتمدة.</p>
                                </div>
                                <div className="bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-500/20 text-purple-300 text-xs font-bold">
                                    50 حقيبة تدريبية متاحة
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                {Array.from({ length: 50 }, (_, i) => i + 1).map((i) => (
                                    <div key={i} className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden group hover:shadow-xl hover:border-purple-500/30 transition-all flex flex-col">
                                        <div className="h-32 bg-gradient-to-br from-purple-900 to-blue-900 relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                            <span className="text-5xl font-black text-white/10 absolute right-2 bottom-0">{i}</span>
                                            <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform"/>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-white font-bold text-sm mb-2">الحقيبة التدريبية رقم {i}</h3>
                                            <p className="text-gray-400 text-xs mb-4 flex-1 line-clamp-2">دورة شاملة لتطوير المهارات التقنية والإدارية المطلوبة في سوق العمل السعودي.</p>
                                            <button 
                                                onClick={() => handleStartCourse(i)}
                                                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <Play className="w-3 h-3 fill-current"/> دخول الدورة
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VIEW: EXPERIENCE (Buy Experience) */}
                    {activeSection === 'experience' && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in-up">
                            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
                                <Award className="w-12 h-12 text-amber-500"/>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2">خدمة توثيق الخبرة (اشتري خبرتك)</h2>
                                <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
                                    خدمة حصرية تتيح لك معادلة مهاراتك وخبراتك السابقة بشهادة خبرة رسمية معتمدة من الأكاديمية، لتعزيز سيرتك الذاتية وزيادة فرصك الوظيفية.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowExperienceModal(true)}
                                className="px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                            >
                                <Shield className="w-5 h-5"/> بدء توثيق الخبرة
                            </button>
                            <p className="text-xs text-gray-500">تطبق الشروط والأحكام • رسوم رمزية للتوثيق</p>
                        </div>
                    )}

                    {/* VIEW: DOCUMENTS (Unified Docs) */}
                    {activeSection === 'documents' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">مركز الوثائق والشهادات</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Academic Transcript */}
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400"/> السجل الأكاديمي</h3>
                                    <AcademicTranscript />
                                </div>
                                
                                {/* Certificates Section */}
                                <div className="space-y-6">
                                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 text-center">
                                        <h3 className="text-white font-bold mb-4 flex items-center justify-center gap-2"><Award className="w-5 h-5 text-emerald-400"/> نموذج الشهادة المعتمد</h3>
                                        <p className="text-xs text-gray-400 mb-6">شاهد نموذجاً حياً لشكل الشهادات التي تصدرها الأكاديمية.</p>
                                        <button onClick={() => setShowCertPreview(true)} className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm transition-colors mb-2">
                                            معاينة النموذج
                                        </button>
                                        <div className="mt-2">
                                            <button onClick={() => setShowGenCert(true)} className="px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm transition-colors">
                                                إصدار شهادة تجريبية
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-white font-bold mb-4">شهاداتي المكتسبة</h3>
                                        {user.certificates && user.certificates.length > 0 ? (
                                            <div className="space-y-2">
                                                {user.certificates.map(cert => (
                                                    <div key={cert.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-emerald-500/20 p-2 rounded-lg"><Award className="w-4 h-4 text-emerald-400"/></div>
                                                            <div>
                                                                <span className="text-sm text-gray-200 block font-bold">{cert.courseName}</span>
                                                                <span className="text-[10px] text-gray-500 block">{cert.id}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-emerald-500 font-mono">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">لا توجد شهادات حتى الآن.</p>
                                        )}
                                    </div>
                                    
                                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-white font-bold mb-4">الإفادات الإدارية</h3>
                                        <div className="space-y-2">
                                             <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg opacity-60">
                                                <span className="text-sm text-gray-400">إفادة انتظام بالدراسة</span>
                                                <button disabled className="text-xs bg-white/5 px-2 py-1 rounded text-gray-500">قريباً</button>
                                             </div>
                                             <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg opacity-60">
                                                <span className="text-sm text-gray-400">إفادة تخرج</span>
                                                <button disabled className="text-xs bg-white/5 px-2 py-1 rounded text-gray-500">قريباً</button>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIEW: WALLET (Basic placeholder for now) */}
                    {activeSection === 'wallet' && (
                        <div className="space-y-6 animate-fade-in-up">
                             <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">المحفظة المالية</h2>
                             <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet className="w-32 h-32"/></div>
                                 <div className="relative z-10">
                                     <p className="text-emerald-200 text-sm font-bold uppercase mb-2">الرصيد الحالي</p>
                                     <h3 className="text-5xl font-black">{walletBalance.toFixed(2)} <span className="text-xl font-normal">ر.س</span></h3>
                                 </div>
                             </div>
                             <p className="text-gray-400 text-center">المزيد من تفاصيل العمليات قريباً...</p>
                        </div>
                    )}

                    {/* VIEW: SETTINGS (Edit Profile) */}
                    {activeSection === 'settings' && (
                         <div className="space-y-8 animate-fade-in-up max-w-3xl mx-auto pb-20">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">إعدادات الحساب والملف الشخصي</h2>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center gap-4 mb-8">
                                    <div className="relative w-32 h-32 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full rounded-full border-4 border-blue-500/30 object-cover group-hover:opacity-50 transition-opacity"/>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white"/>
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload}/>
                                    </div>
                                    <p className="text-xs text-gray-400">اضغط على الصورة للتغيير</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2">الاسم الكامل</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2">المسمى الوظيفي</label>
                                        <input type="text" value={formData.currentJobTitle} onChange={e => setFormData({...formData, currentJobTitle: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="مثال: مطور برمجيات" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2">رقم الهاتف</label>
                                        <div className="relative">
                                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-blue-500 outline-none transition-colors text-right" dir="ltr" />
                                            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2">العنوان</label>
                                        <div className="relative">
                                            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-blue-500 outline-none transition-colors" />
                                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-500"/>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 mb-2">المهارات (افصل بفاصلة)</label>
                                        <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="HTML, CSS, JavaScript..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 mb-2">نبذة عنك</label>
                                        <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors h-24 resize-none" placeholder="اكتب نبذة مختصرة..." />
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                                    <div className="min-w-fit mt-1"><AlertCircle className="w-5 h-5 text-yellow-500"/></div>
                                    <div className="text-xs text-yellow-200">
                                        <p className="font-bold mb-1">تنبيه هام</p>
                                        <p>يرجى التأكد من صحة البيانات المدخلة حيث ستظهر في الشهادات الرسمية والوثائق.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-white/10">
                                    <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                                        حفظ التعديلات
                                    </button>
                                </div>
                            </form>
                         </div>
                    )}
                    
                </div>
            </div>
        </div>

        {/* OVERLAYS */}
        {activeCourse && <VirtualClassroom course={activeCourse} onClose={() => setActiveCourse(null)} />}
        <ExperienceValidationModal isOpen={showExperienceModal} onClose={() => setShowExperienceModal(false)} />
        <CertificatePreviewModal isOpen={showCertPreview} onClose={() => setShowCertPreview(false)} />
        {showGenCert && (
            <CertificateGenerator 
                courseName="إدارة المشاريع الاحترافية"
                studentName={user.name || 'Student Name'}
                date={new Date().toLocaleDateString()}
                onClose={() => setShowGenCert(false)}
            />
        )}
        </>
    );
};

// Helper components for missing imports if any
function AlertCircle({className}: {className?: string}) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
}

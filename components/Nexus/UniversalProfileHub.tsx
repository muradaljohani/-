
import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Briefcase, GraduationCap, ShoppingBag, 
    Wallet, Settings, LogOut, CheckCircle2, 
    Clock, Trophy, TrendingUp, Download, ArrowUpRight, BookOpen, Play,
    CreditCard, Save, MapPin, Phone, Mail, Edit3, Loader2, FileText,
    Menu, X, Camera, Award, Shield, FileCheck, Star, PlayCircle, Grid, List,
    Home, FileInput, Users, HeartHandshake, CheckSquare, AlertTriangle, Ban, Megaphone, ChevronDown, ChevronUp, Building2,
    FileSignature, UserX, GitMerge, ChevronLeft, ChevronRight, ClipboardList, Briefcase as BriefcaseIcon, Database, Cpu, Globe, Server, Lock, Wifi, Code, Layers, Trash2, Search, Droplet, Calendar, Flag, Fingerprint, Image as ImageIcon,
    Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AcademicTranscript } from '../Academy/AcademicTranscript';
import { VirtualClassroom } from '../Academy/VirtualClassroom';
import { SmartIDCard } from '../Identity/SmartIDCard'; 
import { CommunityPulse } from '../Social/CommunityPulse';
import { ExperienceValidationModal } from '../ExperienceValidationModal';
import { CertificatePreviewModal } from '../CertificatePreviewModal';
import { CertificateGenerator } from '../CertificateGenerator';
import { EnrollmentCertificateModal } from '../Documents/EnrollmentCertificateModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// --- ACADEMY DATA GENERATOR ---
const ACADEMY_CATEGORIES = [
    { id: 'ai', title: 'الذكاء الاصطناعي (Artificial Intelligence)', icon: <Cpu/>, color: 'text-purple-400' },
    { id: 'dev', title: 'البرمجيات والتطوير (Software Eng)', icon: <Code/>, color: 'text-blue-400' },
    { id: 'networks', title: 'الشبكات والبنية التحتية (Networks)', icon: <Wifi/>, color: 'text-cyan-400' },
    { id: 'cyber', title: 'أمن المعلومات (Information Security)', icon: <Shield/>, color: 'text-emerald-400' },
    { id: 'data', title: 'علم البيانات (Data Science)', icon: <Database/>, color: 'text-amber-400' },
    { id: 'cloud', title: 'الحوسبة السحابية (Cloud)', icon: <Server/>, color: 'text-indigo-400' },
    { id: 'blockchain', title: 'البلوك تشين (Blockchain)', icon: <Layers/>, color: 'text-orange-400' },
    { id: 'iot', title: 'إنترنت الأشياء (IoT)', icon: <Globe/>, color: 'text-pink-400' },
    ...Array.from({ length: 42 }, (_, i) => ({
        id: `tech_${i+9}`,
        title: `تخصصات تقنية دقيقة - مسار ${i+1}`,
        icon: <BriefcaseIcon/>,
        color: 'text-gray-400'
    }))
];

export const UniversalProfileHub: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, logout, updateProfile } = useAuth();
    const [activeSection, setActiveSection] = useState<'overview' | 'academy' | 'wallet' | 'experience' | 'documents' | 'settings'>('overview');
    
    // Theme State
    const [themeMode, setThemeMode] = useState<'default' | 'twitter'>('default');

    // Academy Navigation State
    const [academyView, setAcademyView] = useState<'categories' | 'topics'>('categories');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [activeCourse, setActiveCourse] = useState<any>(null);
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isRecordDropdownOpen, setIsRecordDropdownOpen] = useState(false);

    // Modals
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showCertPreview, setShowCertPreview] = useState(false);
    const [showGenCert, setShowGenCert] = useState(false);
    const [showEnrollmentCert, setShowEnrollmentCert] = useState(false);
    const [showExamGuide, setShowExamGuide] = useState(false);

    // Editing State
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        phone: '',
        currentJobTitle: '',
        major: '',
        address: '',
        skills: '',
        birthDate: '',
        bloodType: '',
        nationalId: '',
        nationality: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                bio: user.bio || '',
                phone: user.phone || '',
                currentJobTitle: user.currentJobTitle || '',
                major: user.major || '',
                address: user.address || '',
                skills: user.skills ? user.skills.join(', ') : '',
                birthDate: user.birthDate || '',
                bloodType: user.bloodType || 'A+',
                nationalId: user.nationalId || '',
                nationality: user.nationality || ''
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const walletBalance = user.wallet?.balance || 0;
    const certsCount = user.certificates?.length || 0;
    const statusColor = user.isIdentityVerified ? 'text-emerald-400' : 'text-amber-400';
    const statusBg = user.isIdentityVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20';

    const calculateAge = (dobString: string): string => {
        if (!dobString) return '--';
        const dob = new Date(dobString);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970).toString();
    };

    // --- THEME CONFIGURATION ---
    const themes = {
        default: {
            bg: 'bg-[#0f172a]',
            card: 'bg-[#1e293b]',
            sidebar: 'bg-[#0b1120]',
            textMain: 'text-white',
            textSub: 'text-gray-400',
            border: 'border-white/10',
            hover: 'hover:bg-white/5',
            activeNav: 'bg-blue-600 text-white shadow-lg shadow-blue-900/20',
            mobileBar: 'bg-[#1e293b]/90 border-white/10'
        },
        twitter: {
            bg: 'bg-[#000000]', // Lights Out
            card: 'bg-[#16181c]', // Twitter Card Color
            sidebar: 'bg-[#000000]',
            textMain: 'text-[#e7e9ea]',
            textSub: 'text-[#71767b]',
            border: 'border-[#2f3336]',
            hover: 'hover:bg-[#181818]',
            activeNav: 'text-[#1d9bf0] bg-transparent', // Twitter Style Active
            mobileBar: 'bg-[#000000]/95 border-[#2f3336]'
        }
    };

    const currentTheme = themes[themeMode];

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'default' ? 'twitter' : 'default');
    };

    const SidebarItem = ({ id, icon, label, onClick }: any) => (
        <button 
            onClick={() => { 
                if (onClick) onClick();
                else setActiveSection(id); 
                setMobileMenuOpen(false); 
            }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all font-bold ${
                activeSection === id 
                ? currentTheme.activeNav
                : `${currentTheme.textSub} ${currentTheme.hover} hover:text-white`
            }`}
        >
            {React.cloneElement(icon, { className: `w-6 h-6 ${activeSection === id && themeMode === 'twitter' ? 'text-[#1d9bf0]' : ''}` })}
            <span className="text-lg hidden md:block">{label}</span>
            <span className="text-sm md:hidden">{label}</span>
        </button>
    );

    // Bottom Navigation Item (Mobile)
    const BottomNavItem = ({ id, icon, label, onClick }: any) => {
        const isActive = activeSection === id;
        return (
            <button 
                onClick={() => { 
                    if (onClick) onClick();
                    else setActiveSection(id);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all relative ${
                    isActive 
                    ? (themeMode === 'twitter' ? 'text-[#1d9bf0]' : 'text-blue-400') 
                    : 'text-gray-500'
                }`}
            >
                {React.cloneElement(icon, { 
                    className: `w-6 h-6 ${isActive && themeMode === 'twitter' ? 'fill-current' : ''}`, 
                    strokeWidth: isActive && themeMode === 'twitter' ? 0 : 2 
                })}
                {/* Twitter style indicator */}
                {isActive && themeMode === 'twitter' && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-[#1d9bf0] rounded-full"></span>
                )}
            </button>
        );
    };

    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setAcademyView('topics');
    };

    const handleTopicClick = (topicId: number, categoryTitle: string) => {
        const topicName = `${categoryTitle}: الحقيبة التدريبية رقم ${topicId}`;
        let bannerUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000';
        if (categoryTitle.includes('AI')) bannerUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000';
        if (categoryTitle.includes('Cyber')) bannerUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000';
        if (categoryTitle.includes('Code') || categoryTitle.includes('Soft')) bannerUrl = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000';

        const modules = Array.from({ length: 30 }, (_, i) => ({
            id: `m_${i + 1}`,
            title: `الشابتر ${i + 1}: ${getChapterTitle(categoryTitle, i)}`,
            type: i % 5 === 0 ? 'video' : 'text',
            duration: i % 5 === 0 ? '60:00' : '120 دقيقة',
            isCompleted: false,
            contentLength: '5000+ كلمة'
        }));

        setActiveCourse({
            id: `course_${selectedCategory.id}_${topicId}`,
            title: topicName,
            description: `حقيبة تدريبية شاملة ومتكاملة في ${categoryTitle}.`,
            thumbnail: bannerUrl,
            category: selectedCategory.title,
            modules: modules,
            unlocksPermission: 'certified'
        });
    };

    const getChapterTitle = (cat: string, index: number) => {
        const basics = ["المقدمة والأهداف", "الإطار النظري", "المفاهيم الأساسية", "التاريخ والنشأة", "الأدوات اللازمة"];
        const advanced = ["التحليل المتقدم", "التطبيقات العملية", "دراسة الحالة", "المشكلات والحلول", "المعايير العالمية"];
        const expert = ["البحث والتطوير", "المستقبل والابتكار", "الخلاصة والتوصيات", "المشروع النهائي", "المراجعة الشاملة"];
        if (index < 5) return basics[index] || `أساسيات ${cat} - جزء ${index+1}`;
        if (index > 25) return expert[index - 26] || `خاتمة ${cat} - جزء ${index+1}`;
        return `محور ${cat} التفصيلي رقم ${index + 1}`;
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

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    updateProfile({ coverImage: ev.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleRemoveAvatar = () => {
        if (confirm("هل أنت متأكد من حذف الصورة الشخصية؟")) {
            updateProfile({ avatar: "" });
        }
    };

    const handleRemoveCover = () => {
        if (confirm("هل أنت متأكد من حذف صورة الغلاف؟")) {
            updateProfile({ coverImage: "" });
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        updateProfile({
            name: formData.name,
            username: formData.username,
            bio: formData.bio,
            phone: formData.phone,
            currentJobTitle: formData.currentJobTitle,
            major: formData.major,
            address: formData.address,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            birthDate: formData.birthDate,
            bloodType: formData.bloodType,
            nationalId: formData.nationalId,
            nationality: formData.nationality
        });
        setIsSaving(false);
        alert("✅ تم تحديث البيانات الشخصية بنجاح!");
    };

    // Nav Button Component for the Quick Links bar (Inside Profile Card)
    const NavButton = ({ label, icon: Icon, onClick, active }: any) => (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${active ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : `${currentTheme.card} ${currentTheme.border} ${currentTheme.textSub} hover:${currentTheme.textMain}`}`}
        >
            <Icon className={`w-5 h-5 mb-1 ${active ? 'text-blue-400' : ''}`} />
            <span className="text-xs font-bold">{label}</span>
        </button>
    );

    return (
        <>
        <div className={`fixed inset-0 z-[9000] flex items-center justify-center p-0 md:p-4 ${currentTheme.bg}/95 backdrop-blur-xl font-sans animate-fade-in-up`} dir="rtl">
            <div className={`relative w-full h-full ${currentTheme.bg} md:rounded-3xl shadow-2xl border ${currentTheme.border} flex overflow-hidden flex-col md:flex-row transition-colors duration-300`}>
                
                {/* Mobile Header (Top Bar) */}
                <div className={`md:hidden flex items-center justify-between p-4 ${currentTheme.card} border-b ${currentTheme.border} shrink-0 z-30`}>
                    <div className="flex items-center gap-3">
                        <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-8 h-8 rounded-full border border-white/20 object-cover"/>
                        <span className={`font-bold text-sm ${currentTheme.textMain}`}>{user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={toggleTheme} className={`p-2 rounded-full ${currentTheme.hover} ${currentTheme.textSub}`}>
                            {themeMode === 'default' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                         </button>
                         <button onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20"><LogOut className="w-5 h-5 rtl:rotate-180"/></button>
                    </div>
                </div>

                {/* Sidebar (Desktop Only) */}
                <div className={`
                    hidden md:flex w-72 ${currentTheme.sidebar} border-l ${currentTheme.border} flex-col p-6 overflow-y-auto
                `}>
                    <div className="text-center mb-8">
                        <div className="relative w-24 h-24 mx-auto mb-4 group">
                            <div className={`w-full h-full rounded-full border-4 ${currentTheme.border} shadow-xl overflow-hidden cursor-pointer`} onClick={() => fileInputRef.current?.click()}>
                                <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover"/>
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none">
                                <Edit3 className="w-6 h-6 text-white"/>
                            </div>

                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload}/>
                            {user.isIdentityVerified && <div className={`absolute bottom-0 right-0 bg-emerald-500 border-4 ${currentTheme.sidebar} rounded-full p-1 pointer-events-none`}><CheckCircle2 className="w-4 h-4 text-white"/></div>}
                        </div>

                        <h2 className={`${currentTheme.textMain} font-bold text-lg mb-1`}>{user.name}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBg} ${statusColor}`}>
                            {user.isIdentityVerified ? 'هوية موثقة' : 'غير موثق'}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <SidebarItem id="overview" icon={<Home className="w-5 h-5"/>} label="الرئيسية" />
                        <SidebarItem id="academy" icon={<BriefcaseIcon className="w-5 h-5"/>} label="الأكاديمية" />
                        <SidebarItem id="wallet" icon={<Wallet className="w-5 h-5"/>} label="المحفظة" />
                        <SidebarItem id="experience" icon={<Award className="w-5 h-5"/>} label="اعتماد الخبرة" onClick={() => setShowExperienceModal(true)} />
                        <SidebarItem id="documents" icon={<FileText className="w-5 h-5"/>} label="السجل الأكاديمي" onClick={() => { setActiveSection('documents'); }} />
                        <SidebarItem id="settings" icon={<Settings className="w-5 h-5"/>} label="الإعدادات" />
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-3">
                         <button onClick={toggleTheme} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentTheme.textSub} ${currentTheme.hover}`}>
                            {themeMode === 'default' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5"/>}
                            <span className="text-sm font-bold">المظهر {themeMode === 'default' ? 'الداكن' : 'تويتر'}</span>
                        </button>

                        <button onClick={() => { logout(); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold">
                            <LogOut className="w-5 h-5 rtl:rotate-180"/> تسجيل الخروج
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 overflow-y-auto bg-gradient-to-br ${themeMode === 'default' ? 'from-[#0f172a] to-[#1e293b]' : 'from-black to-[#050505]'} p-4 md:p-10 relative scrollbar-thin scrollbar-thumb-white/10 pb-24 md:pb-10`}>
                    <button onClick={onClose} className="hidden md:block absolute top-6 left-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-20">
                        <X className="w-5 h-5"/>
                    </button>

                    {/* VIEW: ACADEMY */}
                    {activeSection === 'academy' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b ${currentTheme.border} pb-4`}>
                                <div>
                                    <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.textMain} flex items-center gap-2`}>
                                        <BookOpen className="w-6 h-6 text-purple-400"/>
                                        {academyView === 'categories' ? 'الحقائب التدريبية (التخصصات)' : selectedCategory.title}
                                    </h2>
                                    {academyView === 'topics' && (
                                        <button onClick={() => setAcademyView('categories')} className="text-sm text-blue-400 hover:text-white mt-1 flex items-center gap-1">
                                            <ChevronRight className="w-4 h-4 rtl:rotate-180"/> العودة للمنصة
                                        </button>
                                    )}
                                </div>
                            </div>

                            {academyView === 'categories' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {ACADEMY_CATEGORIES.map((cat, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`${currentTheme.card} p-5 rounded-2xl border ${currentTheme.border} hover:border-purple-500/50 ${currentTheme.hover} transition-all cursor-pointer group`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 rounded-lg bg-black/30 ${cat.color}`}>{cat.icon}</div>
                                                <h3 className={`${currentTheme.textMain} font-bold text-sm line-clamp-1`}>{cat.title}</h3>
                                            </div>
                                            <p className={`text-xs ${currentTheme.textSub} mb-3`}>50 حقيبة تدريبية متخصصة</p>
                                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-purple-600 h-full w-[0%] group-hover:w-[100%] transition-all duration-700"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {academyView === 'topics' && selectedCategory && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array.from({ length: 50 }, (_, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => handleTopicClick(i + 1, selectedCategory.title)}
                                            className={`${currentTheme.card} p-4 rounded-xl border ${currentTheme.border} ${currentTheme.hover} transition-all cursor-pointer flex justify-between items-center group relative overflow-hidden`}
                                        >
                                            <div className="absolute -left-2 -bottom-4 text-6xl font-black text-white/5 z-0">{i+1}</div>
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className={`${currentTheme.textMain} font-bold text-sm line-clamp-1`}>{selectedCategory.title} - حقيبة {i + 1}</h4>
                                                    <p className={`text-[10px] ${currentTheme.textSub} flex items-center gap-1`}>
                                                        <FileText className="w-3 h-3"/> 30 شابتر • 5000 كلمة
                                                    </p>
                                                </div>
                                            </div>
                                            <PlayCircle className="w-6 h-6 text-gray-500 group-hover:text-purple-400 transition-colors z-10"/>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: OVERVIEW */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-fade-in-up">
                            
                            {/* --- DIGITAL ID CARD (SOCIAL PROFILE STYLE) --- */}
                            <div className={`relative w-full rounded-2xl overflow-hidden ${currentTheme.card} border ${currentTheme.border} shadow-xl`}>
                                
                                {/* 1. Cover Image Header */}
                                <div className="h-40 w-full relative bg-gradient-to-r from-blue-900 to-slate-900 overflow-hidden">
                                    {user.coverImage ? (
                                        <img src={user.coverImage} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    )}
                                    
                                    {/* Header Actions (Title & Search) */}
                                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                                        <div className={`flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border ${currentTheme.border}`}>
                                            <User className="w-4 h-4 text-blue-400"/>
                                            <span className="text-sm font-bold text-white">معلوماتي</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Profile Content Area */}
                                <div className="px-6 pb-6 relative">
                                    
                                    {/* Avatar & Edit Button Row */}
                                    <div className="flex justify-between items-end -mt-12 mb-4">
                                        {/* Avatar (Overlapping Cover) */}
                                        <div className="relative group cursor-pointer" onClick={() => setActiveSection('settings')}>
                                            <div className={`w-24 h-24 rounded-full border-4 ${themeMode === 'twitter' ? 'border-black' : 'border-[#1e293b]'} overflow-hidden bg-black shadow-lg`}>
                                                <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
                                            </div>
                                            <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-3 h-3 text-white"/>
                                            </div>
                                        </div>

                                        {/* Edit Profile Button */}
                                        <div className="flex gap-2 mb-2">
                                            <button 
                                                onClick={() => setActiveSection('settings')} 
                                                className={`px-4 py-1.5 rounded-full border ${currentTheme.border} font-bold text-sm ${currentTheme.hover} transition-colors ${currentTheme.textMain}`}
                                            >
                                                تعديل الملف
                                            </button>
                                        </div>
                                    </div>

                                    {/* User Info Block */}
                                    <div className="mb-4">
                                        <h1 className={`text-xl font-black ${currentTheme.textMain} flex items-center gap-2`}>
                                            {user.name}
                                            {user.isIdentityVerified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-black"/>}
                                        </h1>
                                        <p className={`${currentTheme.textSub} text-sm font-mono dir-ltr text-right`}>@{user.username || user.trainingId}</p>
                                    </div>

                                    {/* Bio / Major */}
                                    <div className="mb-4">
                                         <p className={`${currentTheme.textSub} text-sm leading-relaxed mb-2`}>
                                            {user.bio || 'طالب في أكاديمية ميلاف مراد الوطنية.'}
                                         </p>
                                         <div className={`flex flex-wrap gap-x-4 gap-y-2 text-xs ${currentTheme.textSub}`}>
                                             <span className="flex items-center gap-1"><BriefcaseIcon className="w-3 h-3"/> {user.major || 'مسار عام'}</span>
                                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {user.nationality || 'المملكة العربية السعودية'}</span>
                                             <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3"/> {user.nationalId || '---'}</span>
                                             <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {user.birthDate || '---'}</span>
                                             <span className="flex items-center gap-1"><Droplet className="w-3 h-3"/> {user.bloodType || '---'}</span>
                                         </div>
                                    </div>

                                    {/* Vitals Stats */}
                                    <div className={`flex gap-6 border-t ${currentTheme.border} pt-4 mt-4`}>
                                        <div className="flex items-center gap-1">
                                            <span className={`font-bold ${currentTheme.textMain}`}>{calculateAge(user.birthDate || '')}</span>
                                            <span className={`text-xs ${currentTheme.textSub}`}>سنة (العمر)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-red-500">{user.bloodType || '---'}</span>
                                            <span className={`text-xs ${currentTheme.textSub}`}>فصيلة الدم</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className={`font-bold ${currentTheme.textMain}`}>{user.trainingId}</span>
                                            <span className={`text-xs ${currentTheme.textSub}`}>الرقم الأكاديمي</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            
                            {/* --- QUICK NAVIGATION BAR (Desktop Only) --- */}
                            <div className="hidden md:grid grid-cols-4 gap-2">
                                <NavButton 
                                    label="معلوماتي" 
                                    icon={User} 
                                    onClick={() => setActiveSection('overview')} 
                                    active={true}
                                />
                                <NavButton 
                                    label="شهادتي" 
                                    icon={Award} 
                                    onClick={() => setActiveSection('documents')} 
                                    active={false}
                                />
                                <NavButton 
                                    label="مستنداتي" 
                                    icon={FileText} 
                                    onClick={() => setActiveSection('documents')} 
                                    active={false}
                                />
                                <NavButton 
                                    label="سيرتي" 
                                    icon={BriefcaseIcon} 
                                    onClick={() => setActiveSection('settings')} 
                                    active={false}
                                />
                            </div>

                            <div className="w-full">
                                <CommunityPulse />
                            </div>

                            {/* Stats & Services */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`${currentTheme.card} p-6 rounded-2xl border ${currentTheme.border} relative overflow-hidden group hover:border-emerald-500/30 transition-all`}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-12 h-12 text-emerald-500"/></div>
                                            <div className={`${currentTheme.textSub} text-xs font-bold uppercase mb-1`}>الرصيد</div>
                                            <div className={`text-2xl font-black ${currentTheme.textMain}`}>{walletBalance} <span className="text-sm font-normal text-gray-500">SAR</span></div>
                                        </div>
                                        <div className={`${currentTheme.card} p-6 rounded-2xl border ${currentTheme.border} relative overflow-hidden group hover:border-purple-500/30 transition-all`}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><GraduationCap className="w-12 h-12 text-purple-500"/></div>
                                            <div className={`${currentTheme.textSub} text-xs font-bold uppercase mb-1`}>الشهادات</div>
                                            <div className={`text-2xl font-black ${currentTheme.textMain}`}>{certsCount}</div>
                                        </div>
                                        <div className={`${currentTheme.card} p-6 rounded-2xl border ${currentTheme.border} relative overflow-hidden group cursor-pointer ${currentTheme.hover}`} onClick={() => setShowExperienceModal(true)}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="w-12 h-12 text-amber-500"/></div>
                                            <div className="text-amber-400 text-xs font-bold uppercase mb-1">توثيق الخبرة</div>
                                            <div className={`text-sm font-bold ${currentTheme.textMain} mt-2 flex items-center gap-1`}>ابدأ التوثيق <ArrowUpRight className="w-4 h-4"/></div>
                                        </div>
                                        <div className={`${currentTheme.card} p-6 rounded-2xl border ${currentTheme.border} relative overflow-hidden group cursor-pointer ${currentTheme.hover}`} onClick={() => setActiveSection('academy')}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-12 h-12 text-blue-500"/></div>
                                            <div className="text-blue-400 text-xs font-bold uppercase mb-1">الحقائب التدريبية</div>
                                            <div className={`text-sm font-bold ${currentTheme.textMain} mt-2 flex items-center gap-1`}>تصفح (2500) حقيبة <ArrowUpRight className="w-4 h-4"/></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <h3 className={`${currentTheme.textMain} font-bold mb-4 flex items-center gap-2`}><CreditCard className="w-5 h-5 text-gray-400"/> بطاقتي الرقمية (Classic)</h3>
                                        <SmartIDCard user={user} />
                                    </div>
                                </div>

                                <div className="xl:col-span-1">
                                    <div className={`${currentTheme.card} rounded-2xl border ${currentTheme.border} p-6 h-full`}>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-6">
                                            <span>القائمة الرئيسية</span>
                                            <ChevronLeft className="w-3 h-3"/>
                                            <span className="text-blue-400 font-bold">الضوابط والأدلة</span>
                                        </div>
                                        <h3 className={`${currentTheme.textMain} font-bold text-lg mb-6 border-b ${currentTheme.border} pb-4 flex items-center gap-2`}>
                                            <Building2 className="w-5 h-5 text-blue-500"/> خدمات الشؤون الأكاديمية
                                        </h3>
                                        <div className="space-y-4">
                                            <div 
                                                className={`bg-white/5 p-4 rounded-xl border ${currentTheme.border} ${currentTheme.hover} transition-colors cursor-pointer group hover:border-blue-500/30`}
                                                onClick={() => setShowExamGuide(true)}
                                            >
                                                 <div className="flex gap-4">
                                                     <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400 h-fit group-hover:scale-110 transition-transform">
                                                         <FileSignature className="w-6 h-6"/>
                                                     </div>
                                                     <div>
                                                         <h4 className={`${currentTheme.textMain} font-bold text-sm mb-2 group-hover:text-blue-400 transition-colors`}>دليل الاختبارات</h4>
                                                         <p className={`text-xs ${currentTheme.textSub} leading-relaxed`}>
                                                             جداول الاختبارات، تعليمات الاختبارات عن بعد، وضوابط الغياب.
                                                         </p>
                                                     </div>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* VIEW: SETTINGS */}
                    {activeSection === 'settings' && (
                        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400"><Settings className="w-6 h-6"/></div>
                                <h2 className={`text-2xl font-bold ${currentTheme.textMain}`}>إعدادات الملف الشخصي</h2>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-8">
                                {/* Personal Info */}
                                <div className={`${currentTheme.card} p-6 rounded-2xl border ${currentTheme.border}`}>
                                    <h3 className={`${currentTheme.textMain} font-bold mb-4 flex items-center gap-2 border-b ${currentTheme.border} pb-2`}>
                                        <User className="w-4 h-4 text-emerald-400"/> المعلومات الشخصية
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>الاسم الكامل</label>
                                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>اسم المستخدم (Username)</label>
                                            <div className="relative" dir="ltr">
                                                <span className="absolute left-3 top-3 text-gray-500">@</span>
                                                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 pl-8 ${currentTheme.textMain} focus:border-blue-500 outline-none placeholder-gray-600`}/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>رقم الجوال</label>
                                            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>المسمى الوظيفي</label>
                                            <input type="text" value={formData.currentJobTitle} onChange={e => setFormData({...formData, currentJobTitle: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        {/* Added Major */}
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>التخصص (Major)</label>
                                            <input type="text" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        {/* Added Skills */}
                                        <div className="md:col-span-2">
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>المهارات (افصل بفاصلة)</label>
                                            <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`} placeholder="React, Marketing, Design..."/>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>نبذة عني (Bio)</label>
                                            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none h-24 resize-none`}/>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Identity */}
                                <div className={`${currentTheme.card} p-6 rounded-2xl border ${currentTheme.border}`}>
                                    <h3 className={`${currentTheme.textMain} font-bold mb-4 flex items-center gap-2 border-b ${currentTheme.border} pb-2`}>
                                        <MapPin className="w-4 h-4 text-red-400"/> الموقع والهوية
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>الدولة / الجنسية</label>
                                            <input type="text" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>المدينة / العنوان</label>
                                            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>رقم الهوية</label>
                                            <input type="text" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>تاريخ الميلاد</label>
                                            <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none`}/>
                                        </div>
                                        {/* Added Blood Type */}
                                        <div>
                                            <label className={`block text-xs font-bold ${currentTheme.textSub} mb-2`}>فصيلة الدم</label>
                                            <select value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})} className={`w-full bg-black/20 border ${currentTheme.border} rounded-xl p-3 ${currentTheme.textMain} focus:border-blue-500 outline-none appearance-none`}>
                                                <option className="bg-[#0f172a] text-white" value="">اختر الفصيلة</option>
                                                <option className="bg-[#0f172a] text-white" value="A+">A+</option>
                                                <option className="bg-[#0f172a] text-white" value="A-">A-</option>
                                                <option className="bg-[#0f172a] text-white" value="B+">B+</option>
                                                <option className="bg-[#0f172a] text-white" value="B-">B-</option>
                                                <option className="bg-[#0f172a] text-white" value="AB+">AB+</option>
                                                <option className="bg-[#0f172a] text-white" value="AB-">AB-</option>
                                                <option className="bg-[#0f172a] text-white" value="O+">O+</option>
                                                <option className="bg-[#0f172a] text-white" value="O-">O-</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setActiveSection('overview')} className={`px-6 py-3 bg-white/5 hover:bg-white/10 ${currentTheme.textMain} rounded-xl font-bold transition-all`}>إلغاء</button>
                                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg">
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                                        حفظ التغييرات
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* VIEW: DOCUMENTS (Added basic placeholder for navigation completeness) */}
                    {activeSection === 'documents' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h2 className={`text-2xl font-bold ${currentTheme.textMain} mb-4`}>المستندات والشهادات</h2>
                            <AcademicTranscript />
                        </div>
                    )}

                </div>

                {/* BOTTOM NAVIGATION (Twitter Style - Mobile Only) */}
                <div className={`md:hidden fixed bottom-0 w-full ${currentTheme.mobileBar} border-t backdrop-blur-xl flex justify-around items-center py-2 z-40 safe-pb`}>
                    <BottomNavItem id="overview" icon={<Home/>} label="الرئيسية" onClick={() => setActiveSection('overview')}/>
                    <BottomNavItem id="academy" icon={<BriefcaseIcon/>} label="أكاديمية" onClick={() => setActiveSection('academy')}/>
                    <BottomNavItem id="wallet" icon={<Wallet/>} label="المحفظة" onClick={() => setActiveSection('wallet')}/>
                    <BottomNavItem id="documents" icon={<FileText/>} label="سجلي" onClick={() => setActiveSection('documents')}/>
                    <BottomNavItem id="settings" icon={<Settings/>} label="إعدادات" onClick={() => setActiveSection('settings')}/>
                </div>

            </div>
        </div>
        </>
    );
};

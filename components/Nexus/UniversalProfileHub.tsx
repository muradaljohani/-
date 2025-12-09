
import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Briefcase, GraduationCap, ShoppingBag, 
    Wallet, Settings, LogOut, CheckCircle2, 
    Clock, Trophy, TrendingUp, Download, ArrowUpRight, BookOpen, Play,
    CreditCard, Save, MapPin, Phone, Mail, Edit3, Loader2, FileText,
    Menu, X, Camera, Award, Shield, FileCheck, Star, PlayCircle, Grid, List,
    Home, FileInput, Users, HeartHandshake, CheckSquare, AlertTriangle, Ban, Megaphone, ChevronDown, ChevronUp, Building2,
    FileSignature, UserX, GitMerge, ChevronLeft, ChevronRight, ClipboardList, Briefcase as BriefcaseIcon, Database, Cpu, Globe, Server, Lock, Wifi, Code, Layers, Trash2, Search, Droplet, Calendar, Flag, Fingerprint, Image as ImageIcon
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
    const [activeSection, setActiveSection] = useState<'overview' | 'academy' | 'wallet' | 'experience' | 'documents' | 'settings' | 'certificates'>('overview');
    
    // UI State
    const [showInfoDropdown, setShowInfoDropdown] = useState(false);
    
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
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };

    const SidebarItem = ({ id, icon, label, onClick }: any) => (
        <button 
            onClick={() => { 
                if (onClick) onClick();
                else setActiveSection(id); 
                setMobileMenuOpen(false); 
            }}
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

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        updateProfile({
            name: formData.name,
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

    const NavButton = ({ label, icon: Icon, onClick, active }: any) => (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${active ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-[#1e293b] border-white/5 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/20'}`}
        >
            <div className={`p-1.5 rounded-full mb-1 ${active ? 'bg-blue-500 text-white' : 'bg-white/5'}`}>
                <Icon className={`w-4 h-4`} />
            </div>
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    );

    // Navigation Handler
    const handleNavClick = (section: string) => {
        if (section === 'info') {
            setShowInfoDropdown(!showInfoDropdown);
        } else {
            setShowInfoDropdown(false);
            setActiveSection(section as any);
        }
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
                            <p className="text-xs text-gray-400">لوحة التحكم المركزية</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                             {mobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                         </button>
                         <button onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"><LogOut className="w-5 h-5 rtl:rotate-180"/></button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={`
                    absolute md:relative inset-0 z-20 md:z-auto bg-[#0b1120] md:bg-transparent md:w-72 md:border-l border-white/10 flex flex-col p-6 transition-transform duration-300 overflow-y-auto
                    ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <button onClick={() => setMobileMenuOpen(false)} className="md:hidden absolute top-4 left-4 p-2 text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>

                    <div className="text-center mb-8 hidden md:block">
                        <div className="relative w-24 h-24 mx-auto mb-4 group">
                            <div className="w-full h-full rounded-full border-4 border-[#1e293b] shadow-xl overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover"/>
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none">
                                <Edit3 className="w-6 h-6 text-white"/>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload}/>
                            {user.isIdentityVerified && <div className="absolute bottom-0 right-0 bg-emerald-500 border-4 border-[#0b1120] rounded-full p-1 pointer-events-none"><CheckCircle2 className="w-4 h-4 text-white"/></div>}
                        </div>

                        <h2 className="text-white font-bold text-lg mb-1">{user.name}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBg} ${statusColor}`}>
                            {user.isIdentityVerified ? 'هوية موثقة' : 'غير موثق'}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <SidebarItem id="overview" icon={<Home className="w-5 h-5"/>} label="الرئيسية (معلوماتي)" />
                        <SidebarItem id="settings" icon={<Settings className="w-5 h-5 text-gray-300"/>} label="إعدادات الحساب" />
                        <SidebarItem id="academy" icon={<BriefcaseIcon className="w-5 h-5 text-blue-400"/>} label="الحقائب التدريبية" />
                        <SidebarItem id="wallet" icon={<Wallet className="w-5 h-5 text-emerald-400"/>} label="المحفظة الرقمية" />
                        <SidebarItem id="experience" icon={<Award className="w-5 h-5 text-amber-500"/>} label="اشتري خبرتك" onClick={() => setShowExperienceModal(true)} />
                        
                        <div className="space-y-1">
                            <button 
                                onClick={() => setIsRecordDropdownOpen(!isRecordDropdownOpen)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 ${isRecordDropdownOpen ? 'bg-white/5 text-white' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5"/>
                                    <span className="text-sm font-bold">السجل الاكاديمي</span>
                                </div>
                                {isRecordDropdownOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                            </button>
                            
                            {isRecordDropdownOpen && (
                                <div className="pr-10 space-y-1 animate-fade-in-up">
                                    <button onClick={() => { setActiveSection('documents'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5">المقررات المتبقية</button>
                                    <button onClick={() => { setActiveSection('documents'); setMobileMenuOpen(false); }} className="w-full text-right p-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5">السجل الاكاديمي</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 hidden md:block">
                        <button onClick={() => { logout(); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold">
                            <LogOut className="w-5 h-5 rtl:rotate-180"/> تسجيل الخروج
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4 md:p-10 relative scrollbar-thin scrollbar-thumb-white/10">
                    <button onClick={onClose} className="hidden md:block absolute top-6 left-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-20">
                        <X className="w-5 h-5"/>
                    </button>

                    {/* VIEW: ACADEMY */}
                    {activeSection === 'academy' && (
                        <div className="space-y-6 animate-fade-in-up pb-20">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-purple-400"/>
                                        {academyView === 'categories' ? 'الحقائب التدريبية (التخصصات)' : selectedCategory.title}
                                    </h2>
                                    {academyView === 'topics' && (
                                        <button onClick={() => setAcademyView('categories')} className="text-sm text-blue-400 hover:text-white mt-1 flex items-center gap-1">
                                            <ChevronRight className="w-4 h-4 rtl:rotate-180"/> العودة للأقسام
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
                                            className="bg-[#1e293b] p-5 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 rounded-lg bg-black/30 ${cat.color}`}>{cat.icon}</div>
                                                <h3 className="text-white font-bold text-sm line-clamp-1">{cat.title}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">50 حقيبة تدريبية متخصصة</p>
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
                                            className="bg-[#1e293b] p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer flex justify-between items-center group relative overflow-hidden"
                                        >
                                            <div className="absolute -left-2 -bottom-4 text-6xl font-black text-white/5 z-0">{i+1}</div>
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm line-clamp-1">{selectedCategory.title} - حقيبة {i + 1}</h4>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
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
                        <div className="space-y-8 animate-fade-in-up pb-20">
                            
                            {/* --- DIGITAL ID CARD (SOCIAL PROFILE STYLE) --- */}
                            <div className="relative w-full rounded-2xl overflow-hidden bg-[#1e293b] border border-white/10 shadow-xl mb-6">
                                
                                {/* 1. Cover Image Header */}
                                <div className="h-48 w-full relative bg-gray-800 group">
                                    {user.coverImage ? (
                                        <img src={user.coverImage} className="absolute inset-0 w-full h-full object-cover" alt="Cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        </div>
                                    )}
                                    
                                    {/* Action Icons Top Left */}
                                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setActiveSection('settings')} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors" title="إعدادات الغلاف">
                                            <Settings className="w-4 h-4"/>
                                        </button>
                                        <button onClick={() => setActiveSection('settings')} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors" title="تعديل">
                                            <Edit3 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Profile Content Area */}
                                <div className="px-6 pb-6 relative">
                                    
                                    {/* Avatar & Edit Row */}
                                    <div className="flex justify-between items-end -mt-16 mb-4">
                                        {/* Avatar */}
                                        <div className="relative group cursor-pointer" onClick={() => setActiveSection('settings')}>
                                            <div className="w-32 h-32 rounded-full border-4 border-[#1e293b] overflow-hidden bg-black shadow-lg">
                                                <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
                                            </div>
                                            <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-[#1e293b] shadow-sm group-hover:scale-110 transition-transform">
                                                <Camera className="w-3 h-3"/>
                                            </div>
                                        </div>

                                        {/* Search & Info Title */}
                                        <div className="flex-1 mr-6 mb-2 hidden md:block">
                                            <div className="flex items-center justify-between">
                                                 <div className="flex items-center gap-2">
                                                    <h2 className="text-xl font-black text-white">معلوماتي</h2>
                                                    <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Personal Data</span>
                                                 </div>
                                                 <div className="relative group/search w-64">
                                                    <input 
                                                        type="text" 
                                                        placeholder="بحث في البيانات..." 
                                                        className="w-full bg-black/30 backdrop-blur-sm text-white text-xs px-4 py-2 pl-8 rounded-full border border-white/10 focus:border-blue-500 outline-none transition-all placeholder-gray-500"
                                                    />
                                                    <Search className="w-3 h-3 text-gray-400 absolute left-3 top-2.5 group-focus-within/search:text-blue-500"/>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Search & Info Title Fallback */}
                                    <div className="md:hidden mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-xl font-black text-white">معلوماتي</h2>
                                            <button onClick={() => setActiveSection('settings')} className="text-xs text-blue-400 font-bold border border-blue-500/30 px-3 py-1 rounded-full">تعديل</button>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="بحث في البيانات..." 
                                                className="w-full bg-black/30 backdrop-blur-sm text-white text-xs px-4 py-2 pl-8 rounded-full border border-white/10 focus:border-blue-500 outline-none"
                                            />
                                            <Search className="w-3 h-3 text-gray-400 absolute left-3 top-2.5"/>
                                        </div>
                                    </div>

                                    {/* User Info Block */}
                                    <div className="mb-6">
                                        <h1 className="text-2xl font-black text-white flex items-center gap-2">
                                            {user.name}
                                            {user.isIdentityVerified && <CheckCircle2 className="w-5 h-5 text-blue-500 fill-white"/>}
                                        </h1>
                                        <p className="text-gray-500 text-sm font-mono dir-ltr text-right">@{user.trainingId}</p>
                                        <p className="text-gray-300 text-sm mt-2 max-w-2xl leading-relaxed">
                                            {user.bio || 'طالب في أكاديمية ميلاف مراد الوطنية.'}
                                        </p>
                                    </div>

                                    {/* Vitals Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                         <div className="text-center p-2 border-l border-white/5 last:border-0">
                                            <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">العمر (Age)</span>
                                            <span className="font-bold text-white text-lg">{calculateAge(user.birthDate || '')}</span>
                                         </div>
                                         <div className="text-center p-2 border-l border-white/5 last:border-0">
                                            <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">فصيلة الدم</span>
                                            <div className="flex items-center justify-center gap-1">
                                                <Droplet className="w-3 h-3 text-red-500 fill-current"/>
                                                <span className="font-bold text-white text-lg">{user.bloodType || '--'}</span>
                                            </div>
                                         </div>
                                         <div className="text-center p-2 border-l border-white/5 last:border-0">
                                            <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">التخصص</span>
                                            <span className="font-bold text-white text-sm block truncate">{user.major || 'عام'}</span>
                                         </div>
                                         <div className="text-center p-2">
                                            <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">الرقم الوطني</span>
                                            <span className="font-bold text-white text-sm font-mono">{user.nationalId || '---'}</span>
                                         </div>
                                    </div>

                                </div>
                            </div>

                            {/* --- NAVIGATION STRIP --- */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                <NavButton 
                                    label="معلوماتي" 
                                    icon={User} 
                                    onClick={() => handleNavClick('info')} 
                                    active={showInfoDropdown}
                                />
                                <NavButton 
                                    label="شهادتي" 
                                    icon={Award} 
                                    onClick={() => handleNavClick('certificates')}
                                    active={activeSection === 'certificates'}
                                />
                                <NavButton 
                                    label="مستنداتي" 
                                    icon={FileText} 
                                    onClick={() => handleNavClick('documents')} 
                                    active={activeSection === 'documents'}
                                />
                                <NavButton 
                                    label="سيرتي" 
                                    icon={BriefcaseIcon} 
                                    onClick={() => handleNavClick('settings')} 
                                    active={activeSection === 'settings'}
                                />
                            </div>

                            {/* --- MY INFO DROPDOWN --- */}
                            {showInfoDropdown && (
                                <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 mb-8 animate-fade-in-down shadow-xl relative z-10">
                                    <div className="absolute -top-2 right-[12%] w-4 h-4 bg-[#1e293b] border-t border-r border-white/10 transform -rotate-45"></div>
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide border-b border-white/10 pb-2">
                                        <Fingerprint className="w-4 h-4 text-blue-400"/> البيانات الأساسية الكاملة
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">الاسم الكامل:</span>
                                            <span className="text-white font-bold">{user.name}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">رقم الهوية:</span>
                                            <span className="text-white font-mono">{user.nationalId || '---'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">تاريخ الميلاد:</span>
                                            <span className="text-white font-mono">{user.birthDate || '---'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">الجنسية:</span>
                                            <span className="text-white">{user.nationality || '---'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">فصيلة الدم:</span>
                                            <span className="text-red-400 font-bold">{user.bloodType || '---'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">رقم الهاتف:</span>
                                            <span className="text-white font-mono dir-ltr">{user.phone || '---'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">العنوان:</span>
                                            <span className="text-white truncate max-w-[200px]">{user.address || '---'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-400">المسمى الوظيفي:</span>
                                            <span className="text-white">{user.currentJobTitle || '---'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/10 text-center">
                                        <button onClick={() => setActiveSection('settings')} className="text-xs text-blue-400 hover:text-white transition-colors">
                                            تحديث البيانات
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="w-full">
                                <CommunityPulse />
                            </div>

                            {/* Stats & Services */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer hover:bg-white/5" onClick={() => setShowExperienceModal(true)}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="w-12 h-12 text-amber-500"/></div>
                                            <div className="text-amber-400 text-xs font-bold uppercase mb-1">توثيق الخبرة</div>
                                            <div className="text-sm font-bold text-white mt-2 flex items-center gap-1">ابدأ التوثيق <ArrowUpRight className="w-4 h-4"/></div>
                                        </div>
                                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group cursor-pointer hover:bg-white/5" onClick={() => setActiveSection('academy')}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-12 h-12 text-blue-500"/></div>
                                            <div className="text-blue-400 text-xs font-bold uppercase mb-1">الحقائب التدريبية</div>
                                            <div className="text-sm font-bold text-white mt-2 flex items-center gap-1">تصفح (2500) حقيبة <ArrowUpRight className="w-4 h-4"/></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-400"/> بطاقتي الرقمية (Classic)</h3>
                                        <SmartIDCard user={user} />
                                    </div>
                                </div>

                                <div className="xl:col-span-1">
                                    <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 h-full">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-6">
                                            <span>القائمة الرئيسية</span>
                                            <ChevronLeft className="w-3 h-3"/>
                                            <span className="text-blue-400 font-bold">الضوابط والأدلة</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-500"/> خدمات الشؤون الأكاديمية
                                        </h3>
                                        <div className="space-y-4">
                                            <div 
                                                className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group hover:border-blue-500/30"
                                                onClick={() => setShowExamGuide(true)}
                                            >
                                                 <div className="flex gap-4">
                                                     <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400 h-fit group-hover:scale-110 transition-transform">
                                                         <FileSignature className="w-6 h-6"/>
                                                     </div>
                                                     <div>
                                                         <h4 className="text-white font-bold text-sm mb-2 group-hover:text-blue-400 transition-colors">دليل الاختبارات</h4>
                                                         <p className="text-xs text-gray-400 leading-relaxed">
                                                             جداول الاختبارات، تعليمات دخول القاعات، الممنوعات أثناء الاختبار، وطريقة توزيع الدرجات.
                                                         </p>
                                                     </div>
                                                 </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group hover:border-amber-500/30">
                                                 <div className="flex gap-4">
                                                     <div className="p-3 bg-amber-600/20 rounded-lg text-amber-400 h-fit group-hover:scale-110 transition-transform">
                                                         <UserX className="w-6 h-6"/>
                                                     </div>
                                                     <div>
                                                         <h4 className="text-white font-bold text-sm mb-2 group-hover:text-amber-400 transition-colors">ضوابط تقديم الأعذار</h4>
                                                         <p className="text-xs text-gray-400 leading-relaxed">
                                                             شروط قبول الأعذار الطبية والقهرية، المستندات المطلوبة، والمهلة الزمنية للتقديم.
                                                         </p>
                                                     </div>
                                                 </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group hover:border-emerald-500/30">
                                                 <div className="flex gap-4">
                                                     <div className="p-3 bg-emerald-600/20 rounded-lg text-emerald-400 h-fit group-hover:scale-110 transition-transform">
                                                         <GitMerge className="w-6 h-6"/>
                                                     </div>
                                                     <div>
                                                         <h4 className="text-white font-bold text-sm mb-2 group-hover:text-emerald-400 transition-colors">الإجراءات الأكاديمية</h4>
                                                         <p className="text-xs text-gray-400 leading-relaxed">
                                                             نظام الحرمان، حساب المعدل التراكمي، الانتقال بين المستويات، والحقوق والواجبات.
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

                    {/* VIEW: CERTIFICATES (Grid of Passed Certificates) */}
                    {activeSection === 'certificates' && (
                        <div className="space-y-8 animate-fade-in-up pb-20">
                            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">الشهادات المجتازة</h2>
                            
                            {user.certificates && user.certificates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {user.certificates.map(cert => (
                                        <div key={cert.id} className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <Award className="w-24 h-24 text-white"/>
                                            </div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-6 h-6"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg leading-tight">{cert.courseName}</h3>
                                                        <span className="text-xs text-gray-400">{cert.provider}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 text-sm text-gray-300 mb-6">
                                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                                        <span>تاريخ الإصدار:</span>
                                                        <span className="font-mono text-emerald-400">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                                        <span>الدرجة:</span>
                                                        <span className="font-bold text-white">{cert.finalScore}% ({cert.grade})</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>رقم المرجع:</span>
                                                        <span className="font-mono text-xs">{cert.id}</span>
                                                    </div>
                                                </div>

                                                <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-white/10">
                                                    <Download className="w-4 h-4"/> تحميل الشهادة
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-[#1e293b] rounded-3xl border border-white/5">
                                    <Award className="w-16 h-16 text-gray-600 mx-auto mb-4"/>
                                    <h3 className="text-white font-bold text-lg mb-2">لا توجد شهادات مجتازة بعد</h3>
                                    <p className="text-gray-400 text-sm mb-6">أكمل الدورات التدريبية واجتز الاختبارات لتحصل على شهاداتك هنا.</p>
                                    <button onClick={() => setActiveSection('academy')} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">
                                        تصفح الدورات
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: DOCUMENTS (Academic Transcript) */}
                    {activeSection === 'documents' && (
                        <div className="space-y-8 animate-fade-in-up pb-20">
                            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6">مركز الوثائق والسجل الأكاديمي</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400"/> السجل الأكاديمي</h3>
                                    <AcademicTranscript />
                                </div>
                                
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
                                        <h3 className="text-white font-bold mb-4">الإفادات الإدارية</h3>
                                        <div className="space-y-2">
                                             <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg hover:bg-white/5 transition-colors">
                                                <span className="text-sm text-gray-300">إفادة انتظام بالدراسة</span>
                                                <button onClick={() => setShowEnrollmentCert(true)} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white font-bold transition-all">طباعة الإفادة</button>
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

                    {/* VIEW: WALLET */}
                    {activeSection === 'wallet' && (
                        <div className="space-y-6 animate-fade-in-up pb-20">
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

                    {/* VIEW: SETTINGS */}
                    {activeSection === 'settings' && (
                         <div className="space-y-8 animate-fade-in-up max-w-3xl mx-auto pb-20">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">إعدادات الحساب والملف الشخصي</h2>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                {/* Cover Image Upload */}
                                <div className="flex flex-col gap-2 mb-4">
                                    <label className="block text-xs font-bold text-gray-400">صورة الغلاف (Header)</label>
                                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-black/30 border border-white/10 group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                                        {user.coverImage ? (
                                            <img src={user.coverImage} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-blue-900/40 to-slate-900/40"></div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ImageIcon className="w-8 h-8 text-white" />
                                        </div>
                                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload}/>
                                    </div>
                                    <p className="text-[10px] text-gray-500">يفضل صورة بالعرض (1500x500)</p>
                                </div>

                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center gap-4 mb-8">
                                    <div className="relative w-32 h-32 group">
                                        <div className="w-full h-full rounded-full border-4 border-blue-500/30 overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                             <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"/>
                                        </div>
                                        
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <Camera className="w-8 h-8 text-white"/>
                                        </div>
                                        
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload}/>
                                    </div>
                                    <p className="text-xs text-gray-400">اضغط على الصورة للتغيير</p>
                                </div>

                                <div className="bg-[#1e293b] p-6 rounded-xl border border-white/5 mb-6">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-400"/> البيانات الأساسية
                                    </h3>
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
                                            <label className="block text-xs font-bold text-gray-400 mb-2">نبذة عنك</label>
                                            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors h-24 resize-none" placeholder="اكتب نبذة مختصرة..." />
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Information Section */}
                                <div className="bg-[#1e293b] p-6 rounded-xl border border-white/5 mb-6">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <ActivityDot/> المعلومات الحيوية والديموغرافية
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2">رقم الهوية الوطنية / الإقامة</label>
                                            <input type="text" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors font-mono" placeholder="10xxxxxxxxx"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2">الجنسية</label>
                                            <input type="text" value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2">تاريخ الميلاد</label>
                                            <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 mb-2">فصيلة الدم</label>
                                            <select value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors">
                                                <option value="">اختر الفصيلة</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-400 mb-2">التخصص الجامعي (يظهر في البطاقة)</label>
                                            <input 
                                                type="text" 
                                                value={formData.major} 
                                                onChange={e => setFormData({...formData, major: e.target.value})} 
                                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                                                placeholder="مثال: علوم الحاسب، إدارة أعمال" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                                    <div className="min-w-fit mt-1"><AlertTriangle className="w-5 h-5 text-yellow-500"/></div>
                                    <div className="text-xs text-yellow-200">
                                        <p className="font-bold mb-1">تنبيه هام</p>
                                        <p>يرجى التأكد من صحة البيانات المدخلة حيث ستظهر في الشهادات الرسمية والوثائق والبطاقة الجامعية.</p>
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

        {/* EXAM GUIDE MODAL */}
        {showExamGuide && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up" onClick={() => setShowExamGuide(false)}>
              <div className="bg-[#1e293b] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f172a]">
                     <h2 className="text-xl font-bold text-white flex items-center gap-2">
                         <FileSignature className="w-6 h-6 text-blue-400"/> دليل الاختبارات والواجبات
                     </h2>
                     <button onClick={() => setShowExamGuide(false)} className="p-2 hover:bg-white/10 rounded-full text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-8 overflow-y-auto text-right text-gray-300 space-y-6 leading-relaxed">
                     <h1 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">سياسة ودليل الواجبات والاختبارات - أكاديمية ميلاف مراد</h1>
                     <p>سياسة الاختبارات والواجبات تضمن النزاهة الأكاديمية.</p>
                </div>
              </div>
            </div>
        )}

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
        <EnrollmentCertificateModal isOpen={showEnrollmentCert} onClose={() => setShowEnrollmentCert(false)} />
        </>
    );
};

const ActivityDot = () => (
  <span className="relative flex h-2 w-2 mr-1">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
  </span>
);

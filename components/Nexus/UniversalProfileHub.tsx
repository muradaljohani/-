import React, { useState, useEffect, useRef } from 'react';
import { 
    User, Briefcase, ShoppingBag, 
    Wallet, Settings, LogOut, CheckCircle2, 
    Clock, Trophy, BookOpen, Play,
    CreditCard, MapPin, Edit3, FileText,
    X, Camera, Shield, PlayCircle,
    Home, Users, ChevronLeft, ChevronRight, Briefcase as BriefcaseIcon, Database, Cpu, Globe, Server, Code, Layers, Calendar, 
    Moon, Sun, MoreHorizontal, Bell, Mail, Search, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SmartIDCard } from '../Identity/SmartIDCard'; 
import { CommunityPulse } from '../Social/CommunityPulse';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

// --- ACADEMY DATA GENERATOR ---
const ACADEMY_CATEGORIES = [
    { id: 'ai', title: 'الذكاء الاصطناعي', icon: <Cpu/> },
    { id: 'dev', title: 'هندسة البرمجيات', icon: <Code/> },
    { id: 'networks', title: 'الشبكات', icon: <Globe/> },
    { id: 'cyber', title: 'أمن المعلومات', icon: <Shield/> },
    { id: 'data', title: 'علم البيانات', icon: <Database/> },
];

export const UniversalProfileHub: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<'overview' | 'academy' | 'wallet' | 'settings'>('overview');
    const [isDarkMode, setIsDarkMode] = useState(false); 
    
    // Academy Navigation State
    const [academyView, setAcademyView] = useState<'categories' | 'topics'>('categories');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        location: '',
        website: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || user.id.slice(0,8),
                bio: user.bio || 'طموح يعانق السماء 🇸🇦 | مهتم بالتقنية والذكاء الاصطناعي',
                location: user.address || 'الرياض، المملكة العربية السعودية',
                website: 'murad-group.com'
            });
        }
    }, [user]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    if (!isOpen || !user) return null;

    const walletBalance = user.wallet?.balance || 0;
    const certsCount = user.certificates?.length || 0;

    // --- TWITTER STYLE COMPONENTS ---

    const SidebarItem = ({ id, icon, label, active, onClick }: any) => (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 p-3 rounded-full transition-all w-fit xl:w-full group ${
                active 
                ? 'font-black' 
                : 'font-medium hover:bg-gray-100 dark:hover:bg-[#181818]'
            }`}
        >
            <div className="relative">
                {active ? (
                    <div className="text-black dark:text-white">{icon}</div> // Bold/Filled would go here
                ) : (
                    <div className="text-black dark:text-white">{icon}</div>
                )}
            </div>
            <span className={`hidden xl:block text-xl ${active ? 'text-black dark:text-white' : 'text-[#0f1419] dark:text-[#e7e9ea]'}`}>
                {label}
            </span>
        </button>
    );

    const BottomNavItem = ({ id, icon, active, onClick }: any) => (
        <button 
            onClick={onClick}
            className="flex-1 flex items-center justify-center p-3 hover:bg-gray-50 dark:hover:bg-zinc-900/50"
        >
            <div className={`p-1 ${active ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                {/* Clone icon with stroke width adjustment for active state simulation */}
                {React.cloneElement(icon, { strokeWidth: active ? 3 : 2 })}
            </div>
        </button>
    );

    // --- MAIN RENDER ---
    return (
        <div className={`fixed inset-0 z-[9000] font-sans ${isDarkMode ? 'dark' : ''}`} dir="rtl">
            <div className="absolute inset-0 bg-white dark:bg-black text-[#0f1419] dark:text-[#e7e9ea] flex transition-colors duration-200">
                
                {/* --- LEFT SIDEBAR (DESKTOP) --- */}
                {/* Hidden on mobile, visible on md+ */}
                <div className="hidden md:flex w-[88px] xl:w-[275px] h-full flex-col items-center xl:items-start px-2 border-l border-gray-100 dark:border-[#2f3336] bg-white dark:bg-black z-20 shrink-0">
                    <div className="py-4 xl:px-3">
                        <div className="w-12 h-12 rounded-full hover:bg-gray-100 dark:hover:bg-[#181818] flex items-center justify-center cursor-pointer transition-colors" onClick={onClose}>
                            <X className="w-7 h-7 text-black dark:text-white"/>
                        </div>
                    </div>
                    
                    <nav className="flex-1 space-y-2 w-full">
                        <SidebarItem 
                            id="overview" 
                            icon={<User className="w-7 h-7"/>} 
                            label="الملف الشخصي" 
                            active={activeSection === 'overview'}
                            onClick={() => setActiveSection('overview')}
                        />
                        <SidebarItem 
                            id="academy" 
                            icon={<BookOpen className="w-7 h-7"/>} 
                            label="الأكاديمية" 
                            active={activeSection === 'academy'}
                            onClick={() => setActiveSection('academy')}
                        />
                        <SidebarItem 
                            id="wallet" 
                            icon={<Wallet className="w-7 h-7"/>} 
                            label="المحفظة" 
                            active={activeSection === 'wallet'}
                            onClick={() => setActiveSection('wallet')}
                        />
                        <SidebarItem 
                            id="settings" 
                            icon={<Settings className="w-7 h-7"/>} 
                            label="الإعدادات" 
                            active={activeSection === 'settings'}
                            onClick={() => setActiveSection('settings')}
                        />
                    </nav>

                    <div className="py-4 w-full">
                        <button onClick={toggleTheme} className="w-12 h-12 xl:w-full xl:h-12 rounded-full hover:bg-gray-100 dark:hover:bg-[#181818] flex items-center justify-center xl:justify-start xl:px-4 gap-4 transition-colors mb-4">
                            {isDarkMode ? <Sun className="w-6 h-6"/> : <Moon className="w-6 h-6"/>}
                            <span className="hidden xl:block font-bold">المظهر</span>
                        </button>

                        <div className="flex items-center justify-center xl:justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#181818] rounded-full cursor-pointer transition-colors w-full">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover"/>
                                <div className="hidden xl:block text-right">
                                    <p className="font-bold text-sm truncate w-24">{user.name}</p>
                                    <p className="text-gray-500 text-sm dir-ltr">@{formData.username}</p>
                                </div>
                            </div>
                            <MoreHorizontal className="hidden xl:block w-5 h-5"/>
                        </div>
                    </div>
                </div>

                {/* --- MAIN FEED CONTENT --- */}
                <div className="flex-1 flex flex-col min-w-0 border-l border-gray-100 dark:border-[#2f3336] relative bg-white dark:bg-black">
                    
                    {/* Header (Mobile & Desktop sticky) */}
                    <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-[#2f3336] px-4 h-[53px] flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="font-bold text-lg leading-tight">{activeSection === 'overview' ? user.name : 
                                                                             activeSection === 'academy' ? 'الأكاديمية' :
                                                                             activeSection === 'wallet' ? 'المحفظة' : 'الإعدادات'}</h2>
                            {activeSection === 'overview' && <span className="text-xs text-gray-500">240 مشاركة</span>}
                        </div>
                        {/* Mobile Close */}
                        <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#181818]">
                            <X className="w-5 h-5"/>
                        </button>
                    </div>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                        
                        {/* --- PROFILE SECTION --- */}
                        {activeSection === 'overview' && (
                            <div>
                                {/* Cover Image */}
                                <div className="h-[150px] md:h-[200px] bg-[#cfd9de] dark:bg-[#333639] relative group cursor-pointer">
                                    {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover"/>}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="w-6 h-6 text-white"/>
                                    </div>
                                    <input type="file" ref={coverInputRef} className="hidden" />
                                </div>

                                {/* Profile Action Bar */}
                                <div className="px-4 flex justify-between items-start relative h-[70px]">
                                    {/* Avatar - Negative Margin to overlap cover */}
                                    <div className="absolute -top-[50px] md:-top-[75px] right-4">
                                        <div className="w-[100px] h-[100px] md:w-[134px] md:h-[134px] rounded-full p-1 bg-white dark:bg-black cursor-pointer group relative">
                                            <img src={user.avatar} className="w-full h-full rounded-full object-cover border border-gray-100 dark:border-black"/>
                                            <div className="absolute inset-1 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white"/>
                                            </div>
                                            <input type="file" ref={fileInputRef} className="hidden" />
                                        </div>
                                    </div>
                                    
                                    {/* Edit Button */}
                                    <div className="mr-auto mt-3">
                                        <button 
                                            onClick={() => setActiveSection('settings')}
                                            className="px-4 py-1.5 rounded-full border border-gray-300 dark:border-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-[#181818] transition-colors text-sm"
                                        >
                                            تعديل الملف الشخصي
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="px-4 mt-2">
                                    <h1 className="text-xl font-black leading-tight flex items-center gap-1">
                                        {user.name}
                                        {user.isIdentityVerified && <CheckCircle2 className="w-5 h-5 text-black dark:text-white fill-current" />}
                                    </h1>
                                    <p className="text-gray-500 text-sm dir-ltr text-right">@{formData.username}</p>
                                    
                                    <p className="mt-3 text-[15px] leading-normal whitespace-pre-wrap">
                                        {formData.bio}
                                    </p>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-gray-500 text-sm">
                                        {formData.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {formData.location}</span>}
                                        {formData.website && <span className="flex items-center gap-1"><Globe className="w-4 h-4"/> <a href="#" className="text-[#1d9bf0] hover:underline">{formData.website}</a></span>}
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> انضم {new Date(user.createdAt).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'})}</span>
                                    </div>

                                    <div className="flex gap-4 mt-3 text-sm">
                                        <span className="hover:underline cursor-pointer"><strong className="text-black dark:text-white">142</strong> <span className="text-gray-500">متابِعاً</span></span>
                                        <span className="hover:underline cursor-pointer"><strong className="text-black dark:text-white">58</strong> <span className="text-gray-500">متابَعاً</span></span>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex mt-4 border-b border-gray-100 dark:border-[#2f3336] overflow-x-auto scrollbar-hide">
                                    {['التغريدات', 'الردود', 'الوسائط', 'الإعجابات'].map((tab, i) => (
                                        <button key={tab} className={`flex-1 min-w-[80px] hover:bg-gray-100 dark:hover:bg-[#181818] py-4 text-sm font-bold relative transition-colors ${i===0 ? 'text-black dark:text-white' : 'text-gray-500'}`}>
                                            {tab}
                                            {i===0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#1d9bf0] rounded-full"></div>}
                                        </button>
                                    ))}
                                </div>

                                {/* Pinned Content / Feed */}
                                <div className="p-4 border-b border-gray-100 dark:border-[#2f3336] hover:bg-gray-50 dark:hover:bg-[#080808] transition-colors cursor-pointer">
                                    <div className="flex gap-1 text-gray-500 text-xs font-bold mb-1 items-center">
                                        <CreditCard className="w-3 h-3 fill-current"/> مثبت
                                    </div>
                                    <SmartIDCard user={user} />
                                </div>

                                <div className="p-4 border-b border-gray-100 dark:border-[#2f3336]">
                                    <CommunityPulse />
                                </div>
                            </div>
                        )}

                        {/* --- ACADEMY SECTION --- */}
                        {activeSection === 'academy' && (
                            <div className="pb-10">
                                {academyView === 'categories' ? (
                                    <div className="divide-y divide-gray-100 dark:divide-[#2f3336]">
                                        {ACADEMY_CATEGORIES.map((cat, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => { setSelectedCategory(cat); setAcademyView('topics'); }}
                                                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#080808] cursor-pointer transition-colors"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#16181C] flex items-center justify-center text-black dark:text-white">
                                                    {cat.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-bold text-[15px]">{cat.title}</h3>
                                                        <span className="text-xs text-gray-500">2h ago</span>
                                                    </div>
                                                    <p className="text-gray-500 text-sm mt-0.5">50 حقيبة تدريبية متاحة للتسجيل الفوري.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-4 p-3 border-b border-gray-100 dark:border-[#2f3336] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#080808]" onClick={() => setAcademyView('categories')}>
                                            <ChevronRight className="w-5 h-5 rtl:rotate-180"/>
                                            <span className="font-bold text-lg">{selectedCategory.title}</span>
                                        </div>
                                        <div className="divide-y divide-gray-100 dark:divide-[#2f3336]">
                                            {Array.from({ length: 8 }, (_, i) => (
                                                <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-[#080808] cursor-pointer flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold text-sm">
                                                        {i+1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <h4 className="font-bold text-[15px] hover:underline">مقدمة في {selectedCategory.title}</h4>
                                                            <MoreHorizontal className="w-4 h-4 text-gray-500"/>
                                                        </div>
                                                        <p className="text-gray-500 text-sm mt-1">محاضرة مسجلة • 45 دقيقة</p>
                                                        
                                                        {/* Video Placeholder */}
                                                        <div className="mt-3 w-full aspect-video bg-gray-200 dark:bg-[#16181C] rounded-xl flex items-center justify-center relative border border-gray-100 dark:border-[#2f3336]">
                                                            <PlayCircle className="w-12 h-12 text-[#1d9bf0] fill-white dark:fill-black opacity-80"/>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-8 mt-3 text-gray-500">
                                                            <button className="flex items-center gap-1 text-sm group">
                                                                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#1d9bf0] transition-colors">
                                                                    <Play className="w-4 h-4"/>
                                                                </div>
                                                                <span className="group-hover:text-[#1d9bf0]">مشاهدة</span>
                                                            </button>
                                                            <button className="flex items-center gap-1 text-sm group">
                                                                <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-500 transition-colors">
                                                                    <CheckCircle2 className="w-4 h-4"/>
                                                                </div>
                                                                <span className="group-hover:text-green-500">إتمام</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- VIEW: WALLET --- */}
                        {activeSection === 'wallet' && (
                            <div className="p-4">
                                <div className="bg-black dark:bg-[#16181C] text-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-200 dark:border-[#2f3336]">
                                    <div className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-widest">Available Balance</div>
                                    <div className="text-4xl font-black mb-6">{walletBalance.toFixed(2)} <span className="text-lg text-gray-500">SAR</span></div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-white text-black py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">إيداع</button>
                                        <button className="flex-1 bg-[#2f3336] text-white py-2 rounded-full font-bold text-sm hover:bg-[#404449] transition-colors">سحب</button>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-lg mb-4 px-2">العمليات الأخيرة</h3>
                                <div className="space-y-0 divide-y divide-gray-100 dark:divide-[#2f3336] border border-gray-100 dark:border-[#2f3336] rounded-2xl overflow-hidden">
                                    {user.wallet?.ledger.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 text-sm">لا توجد عمليات مسجلة</div>
                                    ) : (
                                        user.wallet?.ledger.map(entry => (
                                            <div key={entry.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#080808] flex justify-between items-center transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${entry.type === 'CREDIT' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                                                        {entry.type === 'CREDIT' ? <ArrowUpRight className="w-4 h-4"/> : <LogOut className="w-4 h-4"/>}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-black dark:text-white">{entry.description}</div>
                                                        <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <span className={`font-bold font-mono ${entry.type === 'CREDIT' ? 'text-green-600' : 'text-black dark:text-white'}`}>
                                                    {entry.type === 'CREDIT' ? '+' : '-'}{entry.amount}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                         {/* --- VIEW: SETTINGS --- */}
                         {activeSection === 'settings' && (
                            <div className="p-4">
                                <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-[#2f3336] overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 dark:border-[#2f3336] bg-gray-50 dark:bg-[#16181C]">
                                        <h3 className="font-bold text-lg">تعديل الملف الشخصي</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">الاسم</label>
                                            <input type="text" value={formData.name} className="w-full bg-transparent border border-gray-200 dark:border-[#2f3336] rounded p-2 text-sm focus:border-blue-500 focus:outline-none transition-colors" readOnly/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">النبذة التعريفية</label>
                                            <textarea className="w-full bg-transparent border border-gray-200 dark:border-[#2f3336] rounded p-2 text-sm focus:border-blue-500 focus:outline-none transition-colors h-24" placeholder="أضف نبذة عنك..."></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">الموقع</label>
                                            <input type="text" className="w-full bg-transparent border border-gray-200 dark:border-[#2f3336] rounded p-2 text-sm focus:border-blue-500 focus:outline-none transition-colors" placeholder="الرياض"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">الموقع الإلكتروني</label>
                                            <input type="text" className="w-full bg-transparent border border-gray-200 dark:border-[#2f3336] rounded p-2 text-sm focus:border-blue-500 focus:outline-none transition-colors" placeholder="https://"/>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t border-gray-100 dark:border-[#2f3336] flex justify-end">
                                        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:opacity-90">
                                            حفظ
                                        </button>
                                    </div>
                                </div>
                            </div>
                         )}

                    </div>
                </div>

                {/* --- RIGHT COLUMN (SUGGESTIONS / SEARCH) --- */}
                {/* Hidden on mobile/tablet, visible on large screens */}
                <div className="hidden lg:flex w-[350px] flex-col border-l border-gray-100 dark:border-[#2f3336] p-4 shrink-0 bg-white dark:bg-black h-full overflow-y-auto">
                    
                    {/* Search Bar */}
                    <div className="sticky top-0 bg-white dark:bg-black pb-4 z-10">
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-500 group-focus-within:text-[#1d9bf0]"/>
                            </div>
                            <input 
                                type="text" 
                                placeholder="بحث في ميلاف" 
                                className="w-full bg-gray-100 dark:bg-[#202327] border-none rounded-full py-3 pr-12 pl-4 text-sm focus:ring-1 focus:ring-[#1d9bf0] focus:bg-white dark:focus:bg-black transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Trending Box */}
                    <div className="bg-gray-50 dark:bg-[#16181C] rounded-2xl overflow-hidden mb-4">
                        <div className="p-4">
                            <h3 className="font-black text-xl mb-4">ماذا يحدث</h3>
                            {[
                                { cat: 'التقنية · متداول', title: '#الذكاء_الاصطناعي', tweets: '12.5K' },
                                { cat: 'المملكة العربية السعودية', title: 'رؤية 2030', tweets: '54.2K' },
                                { cat: 'تعليم', title: 'أكاديمية_ميلاف', tweets: '2,431' },
                                { cat: 'تكنولوجيا', title: 'الأمن السيبراني', tweets: '8,900' },
                            ].map((topic, i) => (
                                <div key={i} className="py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1d1f23] -mx-4 px-4 transition-colors">
                                    <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                                        <span>{topic.cat}</span>
                                        <MoreHorizontal className="w-4 h-4 hover:text-[#1d9bf0]"/>
                                    </div>
                                    <div className="font-bold text-sm mb-0.5 text-black dark:text-white">{topic.title}</div>
                                    <div className="text-xs text-gray-500">{topic.tweets} مشاركة</div>
                                </div>
                            ))}
                            <div className="text-[#1d9bf0] text-sm mt-4 cursor-pointer hover:underline">عرض المزيد</div>
                        </div>
                    </div>

                    {/* Who to follow */}
                    <div className="bg-gray-50 dark:bg-[#16181C] rounded-2xl overflow-hidden">
                        <div className="p-4">
                            <h3 className="font-black text-xl mb-4">اقتراحات المتابعة</h3>
                            {[1,2,3].map(i => (
                                <div key={i} className="flex items-center gap-3 mb-4 last:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm truncate text-black dark:text-white">مستخدم {i}</div>
                                        <div className="text-gray-500 text-xs truncate">@user_{i}</div>
                                    </div>
                                    <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-bold hover:opacity-90">
                                        متابعة
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 text-xs text-gray-500 leading-relaxed">
                        <span className="hover:underline cursor-pointer">شروط الخدمة</span> • <span className="hover:underline cursor-pointer">سياسة الخصوصية</span> • <span className="hover:underline cursor-pointer">سياسة الكوكيز</span> • <span className="hover:underline cursor-pointer">سهولة الوصول</span> • <span className="hover:underline cursor-pointer">معلومات الإعلانات</span> • © 2025 Murad Corp.
                    </div>
                </div>
            </div>

            {/* --- MOBILE BOTTOM NAVIGATION (FIXED STICKY) --- */}
            {/* Visible ONLY on md and below */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[53px] bg-white dark:bg-black border-t border-gray-100 dark:border-[#2f3336] flex justify-around items-center z-50 pb-safe">
                <BottomNavItem 
                    id="overview" 
                    icon={<Home className="w-6 h-6"/>} 
                    active={activeSection === 'overview'}
                    onClick={() => setActiveSection('overview')}
                />
                <BottomNavItem 
                    id="academy" 
                    icon={<Search className="w-6 h-6"/>} 
                    active={activeSection === 'academy'}
                    onClick={() => setActiveSection('academy')}
                />
                <BottomNavItem 
                    id="wallet" 
                    icon={<Wallet className="w-6 h-6"/>} 
                    active={activeSection === 'wallet'}
                    onClick={() => setActiveSection('wallet')}
                />
                <BottomNavItem 
                    id="settings" 
                    icon={<Mail className="w-6 h-6"/>} 
                    active={activeSection === 'settings'}
                    onClick={() => setActiveSection('settings')}
                />
            </div>
        </div>
    );
};
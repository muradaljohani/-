
import React, { useState } from 'react';
import { 
    Home, Search, Bell, Mail, User, Plus, X, Image as ImageIcon, Video, 
    MoreHorizontal, ArrowLeft, Moon, Sun, Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../App';
import { Feed } from './Feed';
import { ReelsFeed } from './ReelsFeed';
import { SocialAdmin } from './SocialAdmin';
import { InstallPrompt } from '../Mobile/InstallPrompt';
import { SocialService } from '../../services/SocialService';
import { ProfileHeader } from './ProfileHeader';

interface Props {
    onBack: () => void;
}

export type ViewState = 'feed' | 'reels' | 'admin' | 'messages' | 'profile';

export const SocialLayout: React.FC<Props> = ({ onBack }) => {
    const { user } = useAuth();
    const { theme, cycleTheme } = useTheme();
    const [view, setView] = useState<ViewState>('feed');
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeText, setComposeText] = useState('');
    const [toastMsg, setToastMsg] = useState<{msg: string, type: 'success'|'error'} | null>(null);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    // Global Toast Handler
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg({ msg, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    // Handle Post
    const handlePostSubmit = async () => {
        if (!composeText.trim()) return;

        if (!user) {
            alert("يرجى تسجيل الدخول لنشر منشور.");
            return;
        }
        
        const success = await SocialService.createPost(user, composeText);
        if (success) {
            showToast('تم النشر بنجاح!', 'success');
            setComposeText('');
            setIsComposeOpen(false);
        } else {
            showToast('فشل النشر، حاول مرة أخرى', 'error');
        }
    };

    const ThemeIcon = () => {
        if (theme === 'light') return <Sun className="w-6 h-6" />;
        if (theme === 'dim') return <Moon className="w-6 h-6" />;
        return <Monitor className="w-6 h-6" />; // Lights out
    };

    return (
        <div className={`min-h-screen font-sans flex justify-center selection:bg-[var(--accent-color)] selection:text-white bg-[var(--bg-primary)] text-[var(--text-primary)]`} dir="rtl">
            
            {/* --- GLOBAL TOAST --- */}
            {toastMsg && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[6000] animate-fade-in-up">
                    <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${
                        toastMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                        {toastMsg.msg}
                    </div>
                </div>
            )}

            {/* --- LIGHTBOX OVERLAY --- */}
            {lightboxSrc && (
                <div className="fixed inset-0 z-[7000] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setLightboxSrc(null)}>
                    <button className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                        <X className="w-6 h-6"/>
                    </button>
                    <img 
                        src={lightboxSrc} 
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}

            {/* --- LEFT SIDEBAR (Desktop Only) --- */}
            <div className="hidden md:flex flex-col w-20 xl:w-72 h-screen sticky top-0 px-2 xl:px-4 border-l border-[var(--border-color)] justify-between py-4 z-50 bg-[var(--bg-primary)]">
                <div className="space-y-1">
                    {/* BRAND LOGO */}
                    <div className="px-3 py-3 w-fit mb-2 hover:bg-[var(--bg-secondary)] rounded-full cursor-pointer transition-colors" onClick={onBack}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--text-primary)] rounded-full flex items-center justify-center">
                                 <span className="font-black text-[var(--bg-primary)] text-lg">M</span>
                            </div>
                            <span className="hidden xl:block text-xl font-extrabold tracking-wide text-[var(--text-primary)]">مجتمع ميلاف</span>
                        </div>
                    </div>
                    
                    <SidebarLink icon={Home} label="الرئيسية" active={view==='feed'} onClick={() => setView('feed')} />
                    <SidebarLink icon={Search} label="استكشف" onClick={() => {}} />
                    <SidebarLink icon={Bell} label="التنبيهات" notify />
                    <SidebarLink icon={Mail} label="الرسائل" active={view==='messages'} onClick={() => setView('messages')} />
                    <SidebarLink icon={User} label="الملف الشخصي" active={view==='profile'} onClick={() => setView('profile')} />
                    
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="bg-[var(--accent-color)] hover:opacity-90 text-white rounded-full p-3 xl:px-8 xl:py-3.5 font-bold mt-4 w-fit xl:w-full transition-all shadow-lg text-lg flex items-center justify-center gap-2"
                    >
                        <Plus className="w-6 h-6 xl:hidden"/>
                        <span className="hidden xl:block">نشر</span>
                    </button>
                </div>
                
                <div className="space-y-2">
                     <InstallPrompt />
                     
                     {/* THEME TOGGLE */}
                     <div 
                        onClick={cycleTheme}
                        className="flex items-center gap-3 p-3 rounded-full hover:bg-[var(--bg-secondary)] cursor-pointer xl:w-full transition-colors group"
                        title="Change Theme"
                     >
                         <ThemeIcon />
                         <span className="hidden xl:block font-bold text-sm">المظهر: {theme === 'lights-out' ? 'ليلي' : theme === 'dim' ? 'خافت' : 'نهاري'}</span>
                     </div>

                     {user && (
                        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-[var(--bg-secondary)] cursor-pointer xl:w-full transition-colors">
                            <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-800 object-cover"/>
                            <div className="hidden xl:block flex-1 min-w-0 text-right">
                                <div className="font-bold text-[var(--text-primary)] text-sm truncate">{user.name}</div>
                                <div className="text-[var(--text-secondary)] text-xs truncate">@{user.username || 'user'}</div>
                            </div>
                            <MoreHorizontal className="hidden xl:block w-5 h-5 text-[var(--text-secondary)]"/>
                        </div>
                     )}
                </div>
            </div>

            {/* --- CENTER CONTENT --- */}
            <main className={`flex-1 max-w-[600px] w-full min-h-screen pb-20 md:pb-0 relative border-r border-[var(--border-color)] bg-[var(--bg-primary)]`}>
                {view === 'feed' && (
                    <Feed 
                        onOpenLightbox={setLightboxSrc} 
                        showToast={showToast} 
                        onBack={onBack}
                    />
                )}
                {view === 'reels' && <ReelsFeed />}
                {view === 'admin' && <SocialAdmin />}
                {view === 'profile' && user && (
                    <div className="min-h-screen">
                        <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 flex items-center gap-6">
                            <button onClick={() => setView('feed')} className="hover:bg-[var(--bg-secondary)] p-2 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 rtl:rotate-180"/>
                            </button>
                            <div>
                                <h2 className="font-bold text-lg">{user.name}</h2>
                                <p className="text-xs text-[var(--text-secondary)]">{user.publisherStats?.totalSales || 0} منشور</p>
                            </div>
                        </div>
                        <ProfileHeader user={user} isOwnProfile={true} />
                        <div className="p-10 text-center text-[var(--text-secondary)] text-sm">
                            لا توجد منشورات بعد.
                        </div>
                    </div>
                )}
                {view === 'messages' && <div className="p-10 text-center text-[var(--text-secondary)]">الرسائل (قيد التطوير)</div>}
            </main>

            {/* --- RIGHT SIDEBAR (Desktop Only - Trending) --- */}
            <div className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 px-6 py-4 border-r border-[var(--border-color)] z-40 bg-[var(--bg-primary)]">
                <div className="relative mb-6 group">
                    <input 
                        type="text" 
                        placeholder="بحث في مراد سوشل..." 
                        className="w-full bg-[var(--bg-secondary)] border-none focus:ring-1 focus:ring-[var(--accent-color)] rounded-full py-3 pr-12 pl-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all"
                    />
                    <Search className="absolute right-4 top-3 w-5 h-5 text-[var(--text-secondary)]"/>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden mb-4">
                    <div className="p-4">
                        <h3 className="font-black text-lg text-[var(--text-primary)]">المتداول لك</h3>
                    </div>
                    <div className="">
                        {[
                            { tag: '#مجتمع_ميلاف', posts: '15.4K' },
                            { tag: '#رؤية_2030', posts: '89.2K' },
                            { tag: '#موسم_الرياض', posts: '240K' }
                        ].map((trend, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                                <div className="font-bold text-[var(--text-primary)]">{trend.tag}</div>
                                <div className="text-xs text-[var(--text-secondary)] mt-0.5">{trend.posts} منشور</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-t border-[var(--border-color)] flex justify-around p-3 pb-safe z-50">
                <NavButton icon={Home} active={view === 'feed'} onClick={() => setView('feed')} />
                <NavButton icon={Search} active={false} onClick={() => {}} />
                <button 
                    onClick={() => setIsComposeOpen(true)}
                    className="bg-[var(--accent-color)] text-white p-3 rounded-full shadow-lg transform -translate-y-4 border-4 border-[var(--bg-primary)] active:scale-95 transition-transform"
                >
                    <Plus className="w-6 h-6"/>
                </button>
                <NavButton icon={Bell} active={false} onClick={() => {}} notify />
                <NavButton icon={Mail} active={view === 'messages'} onClick={() => setView('messages')} />
            </div>

            {/* --- COMPOSE MODAL --- */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col p-4 animate-in slide-in-from-bottom-10 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setIsComposeOpen(false)} className="text-[var(--text-primary)] font-bold">إلغاء</button>
                        <button 
                            onClick={handlePostSubmit}
                            disabled={!composeText.trim()}
                            className="bg-[var(--accent-color)] text-white px-6 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            نشر
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-800">
                            <img src={user?.avatar} className="w-full h-full object-cover"/>
                        </div>
                        <textarea 
                            className="flex-1 bg-transparent text-[var(--text-primary)] text-lg placeholder-[var(--text-secondary)] outline-none resize-none h-[40vh]"
                            placeholder="ماذا يحدث؟"
                            value={composeText}
                            onChange={(e) => setComposeText(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="mt-auto border-t border-[var(--border-color)] pt-4 flex gap-6 text-[var(--accent-color)]">
                        <ImageIcon className="w-6 h-6"/>
                        <Video className="w-6 h-6"/>
                        <div className="flex-1"></div>
                    </div>
                </div>
            )}

        </div>
    );
};

const SidebarLink = ({ icon: Icon, label, active, onClick, notify }: any) => (
    <button 
        onClick={onClick}
        className={`relative flex items-center gap-4 px-4 py-3 rounded-full text-xl transition-all w-fit xl:w-full group ${active ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}`}
    >
        <div className="relative">
            <Icon className={`w-7 h-7 ${active ? 'fill-current' : ''}`} />
            {notify && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--accent-color)] rounded-full border-2 border-[var(--bg-primary)]"></span>}
        </div>
        <span className="hidden xl:block font-medium text-lg">{label}</span>
    </button>
);

const NavButton = ({ icon: Icon, active, onClick, notify }: any) => (
    <button 
        onClick={onClick} 
        className={`p-2 rounded-xl relative transition-colors ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
    >
        <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`}/>
        {notify && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black"></span>}
    </button>
);

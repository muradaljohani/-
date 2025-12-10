
import React, { useState, useEffect } from 'react';
import { 
    Home, Search, Bell, Mail, User, Plus, X, Image as ImageIcon, Video, 
    MessageCircle, Heart, Share2, MoreHorizontal, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Feed } from './Feed';
import { ReelsFeed } from './ReelsFeed';
import { SocialAdmin } from './SocialAdmin';
import { InstallPrompt } from '../Mobile/InstallPrompt';
import { SocialService } from '../../services/SocialService';

interface Props {
    onBack: () => void;
}

export type ViewState = 'feed' | 'reels' | 'admin' | 'messages' | 'profile';

export const SocialLayout: React.FC<Props> = ({ onBack }) => {
    const { user } = useAuth();
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
        if (!composeText.trim() || !user) return;
        
        const success = await SocialService.createPost(user, composeText);
        if (success) {
            showToast('تم النشر بنجاح!', 'success');
            setComposeText('');
            setIsComposeOpen(false);
            // Trigger refresh in Feed via event or context (simplified here by relying on Feed's auto-refresh)
        } else {
            showToast('فشل النشر، حاول مرة أخرى', 'error');
        }
    };

    return (
        <div className={`min-h-screen bg-black text-slate-100 font-sans flex justify-center selection:bg-blue-500 selection:text-white`} dir="rtl">
            
            {/* --- GLOBAL TOAST --- */}
            {toastMsg && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[6000] animate-fade-in-up">
                    <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${
                        toastMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                        {toastMsg.type === 'success' ? <CheckCircleIcon /> : <AlertIcon />}
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
            <div className="hidden md:flex flex-col w-20 xl:w-72 h-screen sticky top-0 px-2 xl:px-4 border-l border-slate-800 justify-between py-4 z-50 bg-black">
                <div className="space-y-1">
                    <div className="px-3 py-3 w-fit mb-2 hover:bg-slate-900 rounded-full cursor-pointer transition-colors" onClick={onBack}>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                             <span className="font-black text-black text-lg">M</span>
                        </div>
                    </div>
                    
                    <SidebarLink icon={Home} label="الرئيسية" active={view==='feed'} onClick={() => setView('feed')} />
                    <SidebarLink icon={Search} label="استكشف" onClick={() => {}} />
                    <SidebarLink icon={Bell} label="التنبيهات" notify />
                    <SidebarLink icon={Mail} label="الرسائل" active={view==='messages'} onClick={() => setView('messages')} />
                    <SidebarLink icon={User} label="الملف الشخصي" active={view==='profile'} onClick={() => setView('profile')} />
                    
                    {user?.role === 'admin' && (
                        <SidebarLink icon={LockIcon} label="الإدارة" active={view==='admin'} onClick={() => setView('admin')} />
                    )}

                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 xl:px-8 xl:py-3.5 font-bold mt-4 w-fit xl:w-full transition-all shadow-lg shadow-blue-500/20 text-lg flex items-center justify-center gap-2"
                    >
                        <Plus className="w-6 h-6 xl:hidden"/>
                        <span className="hidden xl:block">نشر</span>
                    </button>
                </div>
                
                <div className="space-y-4">
                     <InstallPrompt />
                     {user && (
                        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-slate-900 cursor-pointer xl:w-full transition-colors mb-2">
                            <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-800 object-cover"/>
                            <div className="hidden xl:block flex-1 min-w-0 text-right">
                                <div className="font-bold text-white text-sm truncate">{user.name}</div>
                                <div className="text-slate-500 text-xs truncate">@{user.username || 'user'}</div>
                            </div>
                            <MoreHorizontal className="hidden xl:block w-5 h-5 text-slate-500"/>
                        </div>
                     )}
                </div>
            </div>

            {/* --- CENTER CONTENT --- */}
            <main className={`flex-1 max-w-[600px] w-full min-h-screen pb-20 md:pb-0 relative border-r border-slate-800 bg-black`}>
                {view === 'feed' && (
                    <Feed 
                        onOpenLightbox={setLightboxSrc} 
                        showToast={showToast} 
                        onBack={onBack}
                    />
                )}
                {view === 'reels' && <ReelsFeed />}
                {view === 'admin' && <SocialAdmin />}
                {view === 'profile' && <div className="p-10 text-center text-slate-500">الملف الشخصي (قيد التطوير)</div>}
                {view === 'messages' && <div className="p-10 text-center text-slate-500">الرسائل (قيد التطوير)</div>}
            </main>

            {/* --- RIGHT SIDEBAR (Desktop Only - Trending) --- */}
            <div className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 px-6 py-4 border-r border-slate-800 z-40 bg-black">
                <div className="relative mb-6 group">
                    <input 
                        type="text" 
                        placeholder="بحث في مراد سوشل..." 
                        className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-full py-3 pr-12 pl-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:bg-black"
                    />
                    <Search className="absolute right-4 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-500"/>
                </div>

                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden mb-4">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="font-black text-lg text-white">المتداول لك</h3>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {[
                            { tag: '#Murad_Social', posts: '15.4K' },
                            { tag: '#Vision2030', posts: '89.2K' },
                            { tag: '#Riyadh_Season', posts: '240K' }
                        ].map((trend, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                                <div className="font-bold text-white">{trend.tag}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{trend.posts} posts</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MOBILE BOTTOM NAVIGATION --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-3 pb-safe z-50">
                <NavButton icon={Home} active={view === 'feed'} onClick={() => setView('feed')} />
                <NavButton icon={Search} active={false} onClick={() => {}} />
                <button 
                    onClick={() => setIsComposeOpen(true)}
                    className="bg-blue-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/30 transform -translate-y-4 border-4 border-black active:scale-95 transition-transform"
                >
                    <Plus className="w-6 h-6"/>
                </button>
                <NavButton icon={Bell} active={false} onClick={() => {}} notify />
                <NavButton icon={Mail} active={view === 'messages'} onClick={() => setView('messages')} />
            </div>

            {/* --- COMPOSE MODAL (Mobile & Desktop Overlay) --- */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col p-4 animate-in slide-in-from-bottom-10 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setIsComposeOpen(false)} className="text-slate-300 font-bold">إلغاء</button>
                        <button 
                            onClick={handlePostSubmit}
                            disabled={!composeText.trim()}
                            className="bg-blue-500 text-white px-6 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            نشر
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-800">
                            <img src={user?.avatar} className="w-full h-full object-cover"/>
                        </div>
                        <textarea 
                            className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none resize-none h-[40vh]"
                            placeholder="ماذا يحدث؟"
                            value={composeText}
                            onChange={(e) => setComposeText(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="mt-auto border-t border-slate-800 pt-4 flex gap-6 text-blue-500">
                        <ImageIcon className="w-6 h-6"/>
                        <Video className="w-6 h-6"/>
                        <div className="flex-1"></div>
                        <div className="text-xs text-slate-500 font-bold self-center">{composeText.length}/280</div>
                    </div>
                </div>
            )}

        </div>
    );
};

// --- SUB COMPONENTS ---

const SidebarLink = ({ icon: Icon, label, active, onClick, notify }: any) => (
    <button 
        onClick={onClick}
        className={`relative flex items-center gap-4 px-4 py-3 rounded-full text-xl transition-all w-fit xl:w-full group ${active ? 'font-bold text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
    >
        <div className="relative">
            <Icon className={`w-7 h-7 ${active ? 'fill-current' : ''}`} />
            {notify && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black"></span>}
        </div>
        <span className="hidden xl:block font-medium text-lg">{label}</span>
    </button>
);

const NavButton = ({ icon: Icon, active, onClick, notify }: any) => (
    <button 
        onClick={onClick} 
        className={`p-2 rounded-xl relative transition-colors ${active ? 'text-white' : 'text-slate-500'}`}
    >
        <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`}/>
        {notify && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black"></span>}
    </button>
);

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const LockIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

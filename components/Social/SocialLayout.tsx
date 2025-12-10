
import React, { useState, useEffect } from 'react';
import { 
    Home, Search, Bell, Mail, User, Plus, Image as ImageIcon, Video, 
    MoreHorizontal, ArrowLeft, Moon, Sun, Monitor, X, LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Feed } from './Feed';
import { ReelsFeed } from './ReelsFeed';
import { SocialAdmin } from './SocialAdmin';
import { InstallPrompt } from '../Mobile/InstallPrompt';
import { SocialService } from '../../services/SocialService';
import { ProfileHeader } from './ProfileHeader';
import { MobileSidebar } from './MobileSidebar';
import { PostDetail } from './PostDetail';
import { ChatWindow } from './ChatWindow';
import { Notifications } from './Notifications'; 
import { Explore } from './Explore'; 
import { collection, query, where, onSnapshot, db } from '../../src/lib/firebase';

interface Props {
    onBack: () => void;
}

export type ViewState = 'feed' | 'reels' | 'admin' | 'messages' | 'profile' | 'post-detail' | 'chat' | 'notifications' | 'explore';

export const SocialLayout: React.FC<Props> = ({ onBack }) => {
    const { user, signInWithGoogle } = useAuth();
    const { theme, cycleTheme } = useTheme();
    const [view, setView] = useState<ViewState>('feed');
    
    // Navigation Params
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeText, setComposeText] = useState('');
    const [toastMsg, setToastMsg] = useState<{msg: string, type: 'success'|'error'} | null>(null);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- REAL-TIME NOTIFICATION LISTENER ---
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        
        const notifsRef = collection(db, 'users', user.id, 'notifications');
        const q = query(notifsRef, where('read', '==', false));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return () => unsubscribe();
    }, [user]);

    // Global Toast Handler
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg({ msg, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    // --- NAVIGATION HANDLERS ---
    const handlePostClick = (postId: string) => {
        setSelectedPostId(postId);
        setView('post-detail');
        window.scrollTo(0, 0);
    };

    const handleChatClick = (chatId: string) => {
        setSelectedChatId(chatId);
        setView('chat');
        window.scrollTo(0, 0);
    };

    const handleBackToFeed = () => {
        setView('feed');
        setSelectedPostId(null);
    };

    const handleBackToMessages = () => {
        setView('messages');
        setSelectedChatId(null);
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
        return <Monitor className="w-6 h-6" />; 
    };

    return (
        <div className={`min-h-screen font-sans flex justify-center selection:bg-[var(--accent-color)] selection:text-white bg-white dark:bg-black text-black dark:text-[#e7e9ea]`} dir="rtl">
            
            <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} unreadCount={unreadCount} />

            {toastMsg && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[6000] animate-fade-in-up">
                    <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${
                        toastMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                        {toastMsg.msg}
                    </div>
                </div>
            )}

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

            {/* Sidebar Desktop */}
            <div className={`hidden md:flex flex-col w-20 xl:w-72 h-screen sticky top-0 px-2 xl:px-4 border-l border-gray-200 dark:border-[#2f3336] justify-between py-4 z-50 bg-white dark:bg-black`}>
                <div className="space-y-1">
                    <div className="px-3 py-3 w-fit mb-2 hover:bg-gray-100 dark:hover:bg-[#16181c] rounded-full cursor-pointer transition-colors" onClick={onBack}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                                 <span className="font-black text-white dark:text-black text-lg">M</span>
                            </div>
                            <span className="hidden xl:block text-xl font-extrabold tracking-wide text-black dark:text-[#e7e9ea]">مجتمع ميلاف</span>
                        </div>
                    </div>
                    
                    <SidebarLink icon={Home} label="الرئيسية" active={view==='feed'} onClick={() => setView('feed')} />
                    <SidebarLink icon={Search} label="استكشف" active={view==='explore'} onClick={() => setView('explore')} />
                    <SidebarLink icon={Bell} label="التنبيهات" active={view==='notifications'} onClick={() => setView('notifications')} notifyCount={unreadCount} />
                    <SidebarLink icon={Mail} label="الرسائل" active={view==='messages'} onClick={() => setView('messages')} />
                    <SidebarLink icon={User} label="الملف الشخصي" active={view==='profile'} onClick={() => setView('profile')} />
                    
                    <button 
                        onClick={() => user ? setIsComposeOpen(true) : signInWithGoogle()}
                        className="bg-[var(--accent-color)] hover:opacity-90 text-white rounded-full p-3 xl:px-8 xl:py-3.5 font-bold mt-4 w-fit xl:w-full transition-all shadow-lg text-lg flex items-center justify-center gap-2"
                    >
                        <Plus className="w-6 h-6 xl:hidden"/>
                        <span className="hidden xl:block">{user ? 'نشر' : 'تسجيل دخول'}</span>
                    </button>
                </div>
                
                <div className="space-y-2">
                     <InstallPrompt />
                     
                     <div 
                        onClick={cycleTheme}
                        className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] cursor-pointer xl:w-full transition-colors group text-black dark:text-[#e7e9ea]"
                        title="Change Theme"
                     >
                         <ThemeIcon />
                         <span className="hidden xl:block font-bold text-sm">المظهر: {theme === 'lights-out' ? 'ليلي' : theme === 'dim' ? 'خافت' : 'نهاري'}</span>
                     </div>

                     {user ? (
                        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] cursor-pointer xl:w-full transition-colors">
                            <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-800 object-cover"/>
                            <div className="hidden xl:block flex-1 min-w-0 text-right">
                                <div className="font-bold text-black dark:text-[#e7e9ea] text-sm truncate">{user.name}</div>
                                <div className="text-gray-500 dark:text-[#71767b] text-xs truncate">@{user.username || 'user'}</div>
                            </div>
                            <MoreHorizontal className="hidden xl:block w-5 h-5 text-gray-500 dark:text-[#71767b]"/>
                        </div>
                     ) : (
                        <button 
                            onClick={() => signInWithGoogle()}
                            className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] cursor-pointer xl:w-full transition-colors border border-gray-200 dark:border-[#2f3336]"
                        >
                            <LogIn className="w-6 h-6 text-black dark:text-[#e7e9ea]"/>
                            <div className="hidden xl:block text-right">
                                <div className="font-bold text-black dark:text-[#e7e9ea] text-sm">تسجيل الدخول</div>
                                <div className="text-gray-500 dark:text-[#71767b] text-xs">Google Account</div>
                            </div>
                        </button>
                     )}
                </div>
            </div>

            {/* Main Content Area */}
            <main className={`flex-1 max-w-[600px] w-full min-h-screen pb-20 md:pb-0 relative border-r border-gray-200 dark:border-[#2f3336] bg-white dark:bg-black`}>
                
                {/* Mobile Top Bar */}
                {(view === 'feed' || view === 'profile' || view === 'messages' || view === 'notifications' || view === 'explore') && (
                    <div className="md:hidden sticky top-0 z-30 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-gray-200 dark:border-[#2f3336] px-4 py-3 flex justify-between items-center text-black dark:text-[#e7e9ea]">
                        <div onClick={() => setIsSidebarOpen(true)} className="cursor-pointer relative">
                            <img 
                                src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                                className="w-8 h-8 rounded-full object-cover" 
                                alt="Menu"
                            />
                            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                        </div>
                        <div className="font-black text-lg">M</div>
                        <div className="w-8"></div>
                    </div>
                )}

                {/* VIEWS */}
                {view === 'feed' && (
                    <Feed 
                        onOpenLightbox={setLightboxSrc} 
                        showToast={showToast} 
                        onBack={onBack}
                        onPostClick={handlePostClick}
                    />
                )}
                
                {view === 'post-detail' && selectedPostId && (
                    <PostDetail 
                        postId={selectedPostId} 
                        onBack={handleBackToFeed} 
                    />
                )}

                {view === 'chat' && selectedChatId && (
                    <ChatWindow 
                        chatId={selectedChatId} 
                        onBack={handleBackToMessages} 
                    />
                )}

                {view === 'notifications' && <Notifications />}
                {view === 'explore' && <Explore onPostClick={handlePostClick} />}

                {view === 'reels' && <ReelsFeed />}
                {view === 'admin' && <SocialAdmin />}
                
                {view === 'profile' && user && (
                    <div className="min-h-screen bg-white dark:bg-black">
                        <div className="sticky top-0 z-30 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-gray-200 dark:border-[#2f3336] px-4 py-3 flex items-center gap-6 hidden md:flex">
                            <button onClick={() => setView('feed')} className="hover:bg-gray-100 dark:hover:bg-[#16181c] p-2 rounded-full transition-colors text-black dark:text-[#e7e9ea]">
                                <ArrowLeft className="w-5 h-5 rtl:rotate-180"/>
                            </button>
                            <div>
                                <h2 className="font-bold text-lg text-black dark:text-[#e7e9ea]">{user.name}</h2>
                                <p className="text-xs text-gray-500 dark:text-[#71767b]">{user.publisherStats?.totalSales || 0} منشور</p>
                            </div>
                        </div>
                        <ProfileHeader user={user} isOwnProfile={true} />
                        <div className="p-10 text-center text-gray-500 dark:text-[#71767b] text-sm">
                            لا توجد منشورات بعد.
                        </div>
                    </div>
                )}
                
                {view === 'messages' && (
                    <div className="min-h-screen bg-white dark:bg-black">
                        <div className="p-4 border-b border-gray-200 dark:border-[#2f3336] font-bold text-xl flex justify-between items-center text-black dark:text-[#e7e9ea]">
                            <span>الرسائل</span>
                            <Mail className="w-5 h-5"/>
                        </div>
                        {/* Mock Chat List */}
                        {[1, 2, 3].map(id => (
                            <div key={id} onClick={() => handleChatClick(id.toString())} className="flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-[#16181c] cursor-pointer transition-colors border-b border-gray-100 dark:border-[#2f3336]">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${id}`} className="w-12 h-12 rounded-full border border-gray-200 dark:border-[#2f3336]"/>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-black dark:text-[#e7e9ea]">مستخدم {id}</span>
                                        <span className="text-xs text-gray-500 dark:text-[#71767b]">10:00 AM</span>
                                    </div>
                                    <p className="text-gray-500 dark:text-[#71767b] text-sm truncate">مرحباً، هل الخدمة متاحة؟</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Right Sidebar Desktop */}
            <div className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 px-6 py-4 border-r border-gray-200 dark:border-[#2f3336] z-40 bg-white dark:bg-black">
                <div className="relative mb-6 group">
                    <input 
                        type="text" 
                        placeholder="بحث في مراد سوشل..." 
                        className="w-full bg-gray-100 dark:bg-[#202327] border-none focus:ring-1 focus:ring-[var(--accent-color)] rounded-full py-3 pr-12 pl-4 text-sm text-black dark:text-[#e7e9ea] placeholder-gray-500 dark:placeholder-[#71767b] outline-none transition-all"
                    />
                    <Search className="absolute right-4 top-3 w-5 h-5 text-gray-500 dark:text-[#71767b]"/>
                </div>

                <div className="bg-gray-50 dark:bg-[#16181c] rounded-2xl overflow-hidden mb-4">
                    <div className="p-4">
                        <h3 className="font-black text-lg text-black dark:text-[#e7e9ea]">المتداول لك</h3>
                    </div>
                    <div>
                        {[
                            { tag: '#مجتمع_ميلاف', posts: '15.4K' },
                            { tag: '#رؤية_2030', posts: '89.2K' },
                            { tag: '#موسم_الرياض', posts: '240K' }
                        ].map((trend, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                <div className="font-bold text-black dark:text-[#e7e9ea]">{trend.tag}</div>
                                <div className="text-xs text-gray-500 dark:text-[#71767b] mt-0.5">{trend.posts} منشور</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            {view !== 'post-detail' && view !== 'chat' && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-200 dark:border-[#2f3336] flex justify-around p-3 pb-safe z-50">
                    <NavButton icon={Home} active={view === 'feed'} onClick={() => setView('feed')} />
                    <NavButton icon={Search} active={view === 'explore'} onClick={() => setView('explore')} />
                    <button 
                        onClick={() => user ? setIsComposeOpen(true) : signInWithGoogle()}
                        className="bg-[var(--accent-color)] text-white p-3 rounded-full shadow-lg transform -translate-y-4 border-4 border-white dark:border-black active:scale-95 transition-transform"
                    >
                        <Plus className="w-6 h-6"/>
                    </button>
                    <NavButton icon={Bell} active={view === 'notifications'} onClick={() => setView('notifications')} notifyCount={unreadCount} />
                    <NavButton icon={Mail} active={view === 'messages'} onClick={() => setView('messages')} />
                </div>
            )}

            {isComposeOpen && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col p-4 animate-in slide-in-from-bottom-10 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setIsComposeOpen(false)} className="text-black dark:text-white font-bold">إلغاء</button>
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
                            className="flex-1 bg-transparent text-black dark:text-white text-lg placeholder-gray-500 dark:placeholder-[#71767b] outline-none resize-none h-[40vh]"
                            placeholder="ماذا يحدث؟"
                            value={composeText}
                            onChange={(e) => setComposeText(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="mt-auto border-t border-gray-200 dark:border-[#2f3336] pt-4 flex gap-6 text-[var(--accent-color)]">
                        <ImageIcon className="w-6 h-6"/>
                        <Video className="w-6 h-6"/>
                        <div className="flex-1"></div>
                    </div>
                </div>
            )}

        </div>
    );
};

const SidebarLink = ({ icon: Icon, label, active, onClick, notifyCount }: any) => (
    <button 
        onClick={onClick}
        className={`relative flex items-center gap-4 px-4 py-3 rounded-full text-xl transition-all w-fit xl:w-full group ${active ? 'font-bold text-black dark:text-[#e7e9ea]' : 'text-black dark:text-[#e7e9ea] hover:bg-gray-100 dark:hover:bg-[#16181c]'}`}
    >
        <div className="relative">
            <Icon className={`w-7 h-7 ${active ? 'fill-current' : ''}`} />
            {notifyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--accent-color)] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white dark:border-black">
                    {notifyCount > 9 ? '9+' : notifyCount}
                </span>
            )}
        </div>
        <span className="hidden xl:block font-medium text-lg">{label}</span>
    </button>
);

const NavButton = ({ icon: Icon, active, onClick, notifyCount }: any) => (
    <button 
        onClick={onClick} 
        className={`p-2 rounded-xl relative transition-colors ${active ? 'text-black dark:text-[#e7e9ea]' : 'text-gray-500 dark:text-[#71767b]'}`}
    >
        <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`}/>
        {notifyCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
        )}
    </button>
);

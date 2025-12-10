
import React, { useState, useEffect } from 'react';
import { 
    Home, Search, Bell, Mail, Image as ImageIcon, Video, X, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Feed } from './Feed';
import { ReelsFeed } from './ReelsFeed';
import { SocialAdmin } from './SocialAdmin';
import { SocialService } from '../../services/SocialService';
import { MobileSidebar } from './MobileSidebar';
import { Sidebar } from './Sidebar'; // NEW IMPORT
import { PostDetail } from './PostDetail';
import { ChatWindow } from './ChatWindow';
import { Notifications } from './Notifications'; 
import { Explore } from './Explore'; 
import { collection, query, where, onSnapshot, db } from '../../src/lib/firebase';
import { MuradAI } from './MuradAI';
import { ProfilePage } from './ProfilePage'; // NEW IMPORT

// IMPORT NEW SECONDARY PAGES
import { ElitePage, CreatorStudioPage, CirclesPage, LiveRoomsPage, CollectionsPage, SavedPage } from './SecondaryPages';
import { SettingsPage } from './SettingsPage';

interface Props {
    onBack: () => void;
    initialView?: string; 
}

export type ViewState = 
    'feed' | 'reels' | 'admin' | 'messages' | 'profile' | 'post-detail' | 'chat' | 'notifications' | 'explore' |
    'elite' | 'creator-studio' | 'circles' | 'live' | 'collections' | 'saved' | 'settings' | 'user-profile';

export const SocialLayout: React.FC<Props> = ({ onBack, initialView = 'feed' }) => {
    const { user, signInWithGoogle } = useAuth();
    const [view, setView] = useState<ViewState>(initialView as ViewState);
    
    // Navigation Params
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [visitedUserId, setVisitedUserId] = useState<string | null>(null); // For visiting other profiles

    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
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
    const handleNavigation = (route: string) => {
        window.history.pushState({}, '', `/social/${route}`);
        
        // Special case for 'profile' -> Go to My Profile
        if (route === 'profile' && user) {
            setVisitedUserId(user.id);
            setView('user-profile');
        } else {
            setView(route as ViewState);
        }
        setIsSidebarOpen(false); 
    };

    const handleVisitProfile = (userId: string) => {
        setVisitedUserId(userId);
        setView('user-profile');
        window.scrollTo(0, 0);
    };

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

    const isDeepPage = ['elite', 'creator-studio', 'circles', 'live', 'collections', 'saved', 'settings', 'user-profile'].includes(view);

    return (
        <div className={`flex-1 w-full min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans flex justify-center selection:bg-[var(--accent-color)] selection:text-white transition-colors duration-200`} dir="rtl">
            
            <MobileSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                unreadCount={unreadCount} 
                onNavigate={handleNavigation}
            />
            
            <MuradAI isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

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

            {/* NEW EXTRACTED SIDEBAR */}
            {!isDeepPage && (
                <Sidebar 
                    activeView={view} 
                    onNavigate={handleNavigation} 
                    onBackToHome={onBack} 
                    onCompose={() => setIsComposeOpen(true)}
                    unreadCount={unreadCount}
                />
            )}

            {/* Main Content Area */}
            <main className={`flex-1 w-full min-h-screen pb-20 md:pb-0 relative border-r border-gray-100 dark:border-[#2f3336] bg-white dark:bg-black ${isDeepPage ? 'max-w-full' : 'max-w-2xl'}`}>
                
                {/* Mobile Top Bar */}
                {(!isDeepPage && view !== 'chat' && view !== 'post-detail') && (
                    <div className="md:hidden sticky top-0 z-50 bg-white/80 dark:bg-black/85 backdrop-blur-md border-b border-gray-200 dark:border-[#2f3336] px-4 py-3 flex justify-between items-center text-black dark:text-[#e7e9ea]">
                        <div onClick={() => setIsSidebarOpen(true)} className="cursor-pointer relative">
                            {user ? (
                                <img 
                                    src={user.avatar} 
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-[#2f3336]" 
                                    alt="Menu"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#202327] flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-black"></span>}
                        </div>
                        <div className="font-black text-lg tracking-wider">M</div>
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
                        onUserClick={handleVisitProfile} // Pass profile nav handler
                    />
                )}

                {/* The Dynamic Profile View */}
                {view === 'user-profile' && visitedUserId && (
                    <ProfilePage 
                        userId={visitedUserId} 
                        onBack={() => { setView('feed'); setVisitedUserId(null); }} 
                    />
                )}
                
                {/* Other Pages */}
                {view === 'elite' && <ElitePage onBack={() => handleNavigation('feed')} />}
                {view === 'creator-studio' && <CreatorStudioPage onBack={() => handleNavigation('feed')} />}
                {view === 'circles' && <CirclesPage onBack={() => handleNavigation('feed')} />}
                {view === 'live' && <LiveRoomsPage onBack={() => handleNavigation('feed')} />}
                {view === 'collections' && <CollectionsPage onBack={() => handleNavigation('feed')} />}
                {view === 'saved' && <SavedPage onBack={() => handleNavigation('feed')} />}
                {view === 'settings' && <SettingsPage onBack={() => handleNavigation('feed')} />}

                {view === 'post-detail' && selectedPostId && (
                    <PostDetail 
                        postId={selectedPostId} 
                        onBack={() => handleNavigation('feed')} 
                        onUserClick={handleVisitProfile}
                    />
                )}

                {view === 'chat' && selectedChatId && (
                    <ChatWindow chatId={selectedChatId} onBack={() => handleNavigation('messages')} />
                )}

                {view === 'notifications' && <Notifications />}
                {view === 'explore' && <Explore onPostClick={handlePostClick} />}

                {view === 'reels' && <ReelsFeed />}
                {view === 'admin' && <SocialAdmin />}
                
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
            {!isDeepPage && (
            <div className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 px-6 py-4 border-r border-gray-100 dark:border-[#2f3336] z-40 bg-white dark:bg-black">
                <div className="relative mb-6 group">
                    <input 
                        type="text" 
                        placeholder="بحث في مراد سوشل..." 
                        className="w-full bg-gray-100 dark:bg-[#202327] border-none focus:ring-1 focus:ring-[var(--accent-color)] rounded-full py-3 pr-12 pl-4 text-sm text-black dark:text-[#e7e9ea] placeholder-gray-500 dark:placeholder-[#71767b] outline-none transition-all"
                    />
                    <Search className="absolute right-4 top-3 w-5 h-5 text-gray-400 dark:text-[#71767b]"/>
                </div>
                <div className="bg-gray-50 dark:bg-[#16181c] rounded-2xl overflow-hidden mb-4 border border-gray-100 dark:border-[#2f3336]">
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
            )}

            {/* Mobile Bottom Nav */}
            {!isDeepPage && view !== 'post-detail' && view !== 'chat' && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200 dark:border-[#2f3336] flex justify-around items-center px-2 pb-safe z-50 h-[60px]">
                    <NavButton icon={Home} active={view === 'feed'} onClick={() => handleNavigation('feed')} />
                    <NavButton icon={Search} active={view === 'explore'} onClick={() => handleNavigation('explore')} />
                    
                    <button 
                        onClick={() => setIsAIOpen(true)}
                        className="relative -top-4 bg-black dark:bg-white text-white dark:text-black p-1 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)] border-[4px] border-white dark:border-black transition-transform active:scale-95"
                    >
                        <div className="w-10 h-10 bg-black dark:bg-black rounded-full flex items-center justify-center">
                            <span className="font-black text-white text-xl">M</span>
                        </div>
                    </button>
                    
                    <NavButton icon={Bell} active={view === 'notifications'} onClick={() => handleNavigation('notifications')} notifyCount={unreadCount} />
                    <NavButton icon={Mail} active={view === 'messages'} onClick={() => handleNavigation('messages')} />
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
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
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

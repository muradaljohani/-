
import React, { useState, useEffect } from 'react';
import { 
    Home, Search, Bell, Mail, Image as ImageIcon, Video, X, User, PlusCircle, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Feed } from './Feed';
import { ReelsFeed } from './ReelsFeed';
import { SocialAdmin } from './SocialAdmin';
import { SocialService } from '../../services/SocialService';
import { MobileSidebar } from './MobileSidebar';
import { Sidebar } from './Sidebar';
import { PostDetail } from './PostDetail';
import { ChatWindow } from './ChatWindow';
import { Notifications } from './Notifications'; 
import { Explore } from './Explore'; 
import { collection, query, where, onSnapshot, db, addDoc, serverTimestamp, getDocs, or } from '../../src/lib/firebase';
import { MuradAI } from './MuradAI';
import { ProfilePage } from './ProfilePage';
import { SettingsLayout } from './SettingsLayout';
import { NewChatModal } from './NewChatModal';

// IMPORT NEW SECONDARY PAGES
import { ElitePage, CreatorStudioPage, CirclesPage, LiveRoomsPage, CollectionsPage, SavedPage } from './SecondaryPages';
import { User as UserType } from '../../types';

interface Props {
    onBack: () => void;
    initialView?: string; 
}

export type ViewState = 
    'feed' | 'reels' | 'admin' | 'messages' | 'profile' | 'post-detail' | 'chat' | 'notifications' | 'explore' |
    'elite' | 'creator-studio' | 'circles' | 'live' | 'collections' | 'saved' | 'user-profile' | string; 

export const SocialLayout: React.FC<Props> = ({ onBack, initialView = 'feed' }) => {
    const { user } = useAuth();
    const [view, setView] = useState<ViewState>(initialView as ViewState);
    
    // Navigation Params
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedChatRecipient, setSelectedChatRecipient] = useState<UserType | null>(null); // Store recipient info
    const [visitedUserId, setVisitedUserId] = useState<string | null>(null);

    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false); // For NewChatModal

    const [composeText, setComposeText] = useState('');
    const [toastMsg, setToastMsg] = useState<{msg: string, type: 'success'|'error'} | null>(null);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- REAL-TIME DATA ---
    const [unreadCount, setUnreadCount] = useState(0);
    const [chats, setChats] = useState<any[]>([]); // List of active chats

    // 1. Notifications Listener
    useEffect(() => {
        if (!user || !db) return;
        
        try {
            const notifsRef = collection(db, 'users', user.id, 'notifications');
            const q = query(notifsRef, where('read', '==', false));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setUnreadCount(snapshot.size);
            });

            return () => unsubscribe();
        } catch (e) {
            console.error("Notifications Setup Error:", e);
        }
    }, [user]);

    // 2. Chats List Listener (For Messages Tab)
    useEffect(() => {
        if (!user || !db) return;
        
        // Query chats where user is a participant
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participants', 'array-contains', user.id));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Client-side sort by lastUpdated
            chatList.sort((a: any, b: any) => {
                const tA = a.lastUpdated?.toMillis ? a.lastUpdated.toMillis() : 0;
                const tB = b.lastUpdated?.toMillis ? b.lastUpdated.toMillis() : 0;
                return tB - tA;
            });
            
            setChats(chatList);
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
        if (route.startsWith('settings')) {
            window.history.pushState({}, '', `/social/${route}`);
            setView(route);
        } else {
            window.history.pushState({}, '', `/social/${route}`);
            if (route === 'profile' && user) {
                setVisitedUserId(user.id);
                setView('user-profile');
            } else {
                setView(route as ViewState);
            }
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

    // Open existing chat or set context
    const handleChatClick = (chat: any) => {
        setSelectedChatId(chat.id);
        
        // Find recipient info for the header
        const recipientId = chat.participants.find((id: string) => id !== user?.id);
        // We might need to fetch user details if not stored in chat doc. 
        // For optimization, we usually store basic participant info in the chat doc.
        // Assuming chat.participantsData exists map { uid: {name, avatar...} }
        if (chat.participantsData && recipientId) {
             setSelectedChatRecipient(chat.participantsData[recipientId]);
        } else {
            // Fallback mock or fetch
            setSelectedChatRecipient({ id: recipientId, name: 'User', avatar: '' } as UserType);
        }

        setView('chat');
        window.scrollTo(0, 0);
    };

    // Logic to create or open a chat with a specific user
    const handleStartChat = async (targetUser: UserType) => {
        if (!user) return;
        setIsNewChatOpen(false);

        // 1. Check if chat already exists
        // Firestore limitation: cannot query array for exact match of [a, b].
        // We filter the existing 'chats' state which we already loaded.
        const existingChat = chats.find(c => c.participants.includes(targetUser.id) && c.participants.length === 2);
        
        if (existingChat) {
            handleChatClick(existingChat);
        } else {
            // 2. Create new chat
            try {
                const newChatRef = await addDoc(collection(db, 'chats'), {
                    participants: [user.id, targetUser.id],
                    participantsData: {
                        [user.id]: { name: user.name, avatar: user.avatar, username: user.username },
                        [targetUser.id]: { name: targetUser.name, avatar: targetUser.avatar, username: targetUser.username }
                    },
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp(),
                    lastMessage: 'Started a new conversation'
                });
                
                setSelectedChatId(newChatRef.id);
                setSelectedChatRecipient(targetUser);
                setView('chat');
            } catch (e) {
                console.error("Error creating chat:", e);
                showToast('فشل إنشاء المحادثة', 'error');
            }
        }
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

    const isDeepPage = false; 

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans transition-colors duration-200" dir="rtl">
            
            {/* Mobile Sidebar Overlay */}
            <MobileSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                unreadCount={unreadCount} 
                onNavigate={handleNavigation}
            />
            
            <MuradAI isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
            
            <NewChatModal 
                isOpen={isNewChatOpen}
                onClose={() => setIsNewChatOpen(false)}
                currentUserId={user?.id || ''}
                onUserSelect={handleStartChat}
            />

            {/* Toast Notifications */}
            {toastMsg && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[6000] animate-fade-in-up">
                    <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 ${
                        toastMsg.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                        {toastMsg.msg}
                    </div>
                </div>
            )}

            {/* Image Lightbox */}
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

            {/* --- MASTER GRID LAYOUT (X.com Style) --- */}
            <div className="flex justify-center max-w-[1265px] mx-auto h-full min-h-screen">

                {/* 1. LEFT COLUMN (Navigation) */}
                <header className="hidden md:flex flex-col items-end shrink-0 w-[88px] xl:w-[275px]">
                    <div className="fixed top-0 w-[88px] xl:w-[275px] h-screen overflow-y-auto px-2">
                        <Sidebar 
                            activeView={view} 
                            onNavigate={handleNavigation} 
                            onBackToHome={onBack} 
                            onCompose={() => setIsComposeOpen(true)}
                            unreadCount={unreadCount}
                        />
                    </div>
                </header>

                {/* 2. MIDDLE COLUMN (Main Content) */}
                <main className="flex-grow w-full max-w-[600px] border-x border-gray-100 dark:border-[#2f3336] min-h-screen relative">
                    
                    {/* Mobile Top Header (Hidden on Desktop) */}
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
                    
                    {/* View Switcher */}
                    {view === 'feed' && (
                        <Feed 
                            onOpenLightbox={setLightboxSrc} 
                            showToast={showToast} 
                            onBack={onBack}
                            onPostClick={handlePostClick}
                            onUserClick={handleVisitProfile}
                        />
                    )}

                    {view.startsWith('settings') && (
                        <SettingsLayout 
                            subSection={view.split('/')[1]} 
                            onNavigate={handleNavigation}
                            onBack={() => handleNavigation('feed')}
                        />
                    )}

                    {view === 'user-profile' && visitedUserId && (
                        <ProfilePage 
                            userId={visitedUserId} 
                            onBack={() => { setView('feed'); setVisitedUserId(null); }} 
                        />
                    )}
                    
                    {view === 'elite' && <ElitePage onBack={() => handleNavigation('feed')} />}
                    {view === 'creator-studio' && <CreatorStudioPage onBack={() => handleNavigation('feed')} />}
                    {view === 'circles' && <CirclesPage onBack={() => handleNavigation('feed')} />}
                    {view === 'live' && <LiveRoomsPage onBack={() => handleNavigation('feed')} />}
                    {view === 'collections' && <CollectionsPage onBack={() => handleNavigation('feed')} />}
                    {view === 'saved' && <SavedPage onBack={() => handleNavigation('feed')} />}

                    {view === 'post-detail' && selectedPostId && (
                        <PostDetail 
                            postId={selectedPostId} 
                            onBack={() => handleNavigation('feed')} 
                            onUserClick={handleVisitProfile}
                        />
                    )}

                    {view === 'chat' && selectedChatId && selectedChatRecipient && (
                        <ChatWindow 
                            chatId={selectedChatId} 
                            recipient={selectedChatRecipient}
                            onBack={() => handleNavigation('messages')} 
                        />
                    )}

                    {view === 'notifications' && <Notifications />}
                    {view === 'explore' && <Explore onPostClick={handlePostClick} />}

                    {view === 'reels' && <ReelsFeed />}
                    {view === 'admin' && <SocialAdmin />}
                    
                    {view === 'messages' && (
                        <div className="min-h-screen bg-white dark:bg-black">
                            <div className="p-4 border-b border-gray-200 dark:border-[#2f3336] font-bold text-xl flex justify-between items-center text-black dark:text-[#e7e9ea] sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-30">
                                <span>الرسائل</span>
                                <div className="flex gap-4">
                                    <button onClick={() => setIsNewChatOpen(true)} className="hover:bg-gray-200 dark:hover:bg-[#16181c] p-2 rounded-full transition-colors">
                                        <PlusCircle className="w-6 h-6"/>
                                    </button>
                                    <Mail className="w-6 h-6"/>
                                </div>
                            </div>
                            
                            {/* Chat List */}
                            <div className="pb-20">
                                {chats.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#16181c] rounded-full flex items-center justify-center mb-4">
                                            <MessageSquare className="w-8 h-8 text-gray-500"/>
                                        </div>
                                        <h3 className="font-bold text-xl mb-2">مرحباً بك في الرسائل</h3>
                                        <p className="text-gray-500 text-sm mb-6 max-w-xs">ابدأ محادثة خاصة مع الأصدقاء أو زملاء العمل في المجتمع.</p>
                                        <button 
                                            onClick={() => setIsNewChatOpen(true)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            ابدأ محادثة جديدة
                                        </button>
                                    </div>
                                ) : (
                                    chats.map(chat => {
                                        // Determine Other User
                                        const otherId = chat.participants.find((p: string) => p !== user?.id);
                                        const otherUser = chat.participantsData?.[otherId] || { name: 'Unknown', avatar: '', username: 'unknown' };
                                        
                                        return (
                                            <div key={chat.id} onClick={() => handleChatClick(chat)} className="flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-[#16181c] cursor-pointer transition-colors border-b border-gray-100 dark:border-[#2f3336]">
                                                <img src={otherUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${otherId}`} className="w-12 h-12 rounded-full border border-gray-200 dark:border-[#2f3336] object-cover"/>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <span className="font-bold text-black dark:text-[#e7e9ea] truncate">{otherUser.name}</span>
                                                        <span className="text-xs text-gray-500 dark:text-[#71767b] whitespace-nowrap">
                                                            {chat.lastUpdated?.toDate ? new Date(chat.lastUpdated.toDate()).toLocaleDateString() : ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 dark:text-[#71767b] text-sm truncate dir-rtl text-right">
                                                        {chat.lastMessage || 'بدأ محادثة'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* 3. RIGHT COLUMN (Search & Trends) */}
                <div className="hidden lg:block w-[350px] shrink-0 pl-8">
                    <div className="sticky top-0 h-screen overflow-y-auto py-4 space-y-4 no-scrollbar">
                        
                        {/* Search Bar */}
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="بحث في مجتمع ميلاف..." 
                                className="w-full bg-gray-100 dark:bg-[#202327] border-none focus:ring-1 focus:ring-[var(--accent-color)] rounded-full py-3 pr-12 pl-4 text-sm text-black dark:text-[#e7e9ea] placeholder-gray-500 dark:placeholder-[#71767b] outline-none transition-all"
                            />
                            <Search className="absolute right-4 top-3 w-5 h-5 text-gray-400 dark:text-[#71767b]"/>
                        </div>

                        {/* Trends */}
                        <div className="bg-gray-50 dark:bg-[#16181c] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#2f3336]">
                            <div className="p-4">
                                <h3 className="font-black text-lg text-black dark:text-[#e7e9ea]">المتداول لك</h3>
                            </div>
                            <div>
                                {[
                                    { tag: '#مجتمع_ميلاف', posts: '15.4K' },
                                    { tag: '#رؤية_2030', posts: '89.2K' },
                                    { tag: '#موسم_الرياض', posts: '240K' },
                                    { tag: '#الذكاء_الاصطناعي', posts: '12K' },
                                    { tag: '#وظائف_شاغرة', posts: '5.2K' }
                                ].map((trend, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                                        <div className="font-bold text-black dark:text-[#e7e9ea] dir-ltr text-right">{trend.tag}</div>
                                        <div className="text-xs text-gray-500 dark:text-[#71767b] mt-0.5">{trend.posts} منشور</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 px-4">
                             <a href="#" className="hover:underline">شروط الخدمة</a>
                             <a href="#" className="hover:underline">سياسة الخصوصية</a>
                             <a href="#" className="hover:underline">سياسة الكوكيز</a>
                             <span>© 2025 Murad Group</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mobile Bottom Navigation */}
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

            {/* Compose Modal */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col p-4 animate-in slide-in-from-bottom-10 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setIsComposeOpen(false)} className="text-black dark:text-white font-bold">إلغاء</button>
                        <button 
                            onClick={handlePostSubmit}
                            disabled={!composeText.trim()}
                            className="bg-[#1d9bf0] text-white px-6 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 flex items-center gap-2"
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
                    <div className="mt-auto border-t border-gray-200 dark:border-[#2f3336] pt-4 flex gap-6 text-[#1d9bf0]">
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

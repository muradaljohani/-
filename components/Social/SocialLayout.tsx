
import React, { useState } from 'react';
import { 
    Home, Search, Bell, Mail, User, MoreHorizontal, 
    Image as ImageIcon, Smile, Send, Heart, MessageCircle, 
    Repeat, Share2, ArrowLeft, MoreVertical, Plus, CheckCircle2, Pin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    onBack: () => void;
}

// --- HELPER: Number Formatting ---
const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

// --- MOCK DATA ---
const POSTS = [
    {
        id: 'post-0',
        user: {
            name: 'Murad Al-Juhani',
            handle: '@IpMurad',
            avatar: '/murad-car-selfie.jpg',
            verified: true
        },
        time: 'Just now',
        content: 'مرحبا بكم في مجتمع ميلاف .........................اول منشور .. ياسلام اخير صرت انافس ايلون ماسك ...',
        image: '/murad-car-selfie.jpg',
        likes: 50000,
        comments: 12500, // Replaces replies
        reposts: 5000000, // Replaces retweets
        isPinned: true
    },
    {
        id: 2,
        user: { name: 'Sarah Tech', handle: '@sarah_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', verified: false },
        time: '5h',
        content: 'مين جرب خدمة الذكاء الاصطناعي الجديدة في المنصة؟ بصراحة النتائج مبهرة جداً في تحليل البيانات.',
        likes: 85,
        comments: 20,
        reposts: 5
    },
    {
        id: 3,
        user: { name: 'Khaled Design', handle: '@k_art', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khaled', verified: false },
        time: '1d',
        content: 'نصيحة للمصممين: دائماً وثق أعمالك في معرض الأعمال، هذا يزيد من فرص حصولك على مشاريع.',
        likes: 240,
        comments: 32,
        reposts: 40
    }
];

const CHATS = [
    { id: 1, name: 'فريق التطوير', msg: 'هل تم تحديث السيرفر؟', time: '10:30 AM', unread: 2, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Dev' },
    { id: 2, name: 'سارة محمد', msg: 'شكراً لك على المساعدة!', time: 'Yesterday', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 3, name: 'عبدالله العتيبي', msg: 'بخصوص المشروع القادم...', time: 'Yesterday', unread: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah' },
];

export const SocialLayout: React.FC<Props> = ({ onBack }) => {
    const { user } = useAuth();
    const [view, setView] = useState<'feed' | 'explore' | 'messages' | 'profile'>('feed');
    const [composeText, setComposeText] = useState('');

    // --- SUB-COMPONENTS ---

    const SidebarLink = ({ icon: Icon, label, active, onClick }: any) => (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-medium transition-all w-fit xl:w-full ${active ? 'font-bold text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
        >
            <Icon className={`w-7 h-7 ${active ? 'fill-current' : ''}`} />
            <span className="hidden xl:block">{label}</span>
        </button>
    );

    const PostCard = ({ post }: any) => (
        <div className="p-4 border-b border-slate-800 hover:bg-slate-900/30 transition-colors cursor-pointer">
            {post.isPinned && (
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-2 mr-12">
                    <Pin className="w-3 h-3 fill-current rotate-45" />
                    <span>Pinned Post</span>
                </div>
            )}
            <div className="flex gap-3">
                <img 
                    src={post.user.avatar} 
                    className="w-10 h-10 rounded-full bg-slate-800 object-cover border border-slate-700" 
                    alt={post.user.name} 
                    onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${post.user.name}`;
                    }}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-bold text-white hover:underline truncate flex items-center gap-1">
                            {post.user.name}
                            {post.user.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-white" />}
                        </span>
                        <span className="text-slate-500 text-sm truncate">{post.user.handle}</span>
                        <span className="text-slate-500 text-sm">· {post.time}</span>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base whitespace-pre-line mb-3 leading-relaxed">
                        {post.content}
                    </p>
                    {post.image && (
                        <div className="mb-3 rounded-xl overflow-hidden border border-slate-800">
                            <img src={post.image} className="w-full h-auto object-cover max-h-[400px]" alt="Post content" />
                        </div>
                    )}
                    <div className="flex justify-between text-slate-500 max-w-md">
                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10"><MessageCircle className="w-4 h-4"/></div>
                            <span className="text-xs">{formatNumber(post.comments)}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10"><Repeat className="w-4 h-4"/></div>
                            <span className="text-xs">{formatNumber(post.reposts)}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-pink-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10"><Heart className="w-4 h-4"/></div>
                            <span className="text-xs">{formatNumber(post.likes)}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10"><Share2 className="w-4 h-4"/></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const FeedView = () => (
        <div className="flex-1 min-h-screen border-x border-slate-800 max-w-[600px] w-full">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                <h2 className="text-lg font-bold text-white">الرئيسية</h2>
                <div className="md:hidden" onClick={onBack}><ArrowLeft className="w-5 h-5 text-white rtl:rotate-180"/></div>
            </div>
            
            {/* Compose Box */}
            <div className="p-4 border-b border-slate-800 hidden md:block">
                <div className="flex gap-4">
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-10 h-10 rounded-full bg-slate-800" />
                    <div className="flex-1">
                        <textarea 
                            value={composeText}
                            onChange={(e) => setComposeText(e.target.value)}
                            placeholder="ماذا يحدث؟" 
                            className="w-full bg-transparent text-xl text-white placeholder-slate-500 outline-none resize-none h-12 min-h-[50px]"
                        />
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
                            <div className="flex gap-2 text-blue-400">
                                <button className="p-2 hover:bg-blue-500/10 rounded-full"><ImageIcon className="w-5 h-5"/></button>
                                <button className="p-2 hover:bg-blue-500/10 rounded-full"><Smile className="w-5 h-5"/></button>
                            </div>
                            <button disabled={!composeText} className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full disabled:opacity-50 text-sm">
                                نشر
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div>
                {POSTS.map(post => <PostCard key={post.id} post={post} />)}
            </div>
        </div>
    );

    const MessagesView = () => (
        <div className="flex-1 min-h-screen border-x border-slate-800 max-w-[600px] w-full">
            <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">الرسائل</h2>
                <div className="flex gap-4 text-slate-400">
                    <SettingsIcon className="w-5 h-5 hover:text-white cursor-pointer"/>
                    <Mail className="w-5 h-5 hover:text-white cursor-pointer"/>
                </div>
            </div>
            
            <div className="p-2">
                <div className="relative mb-4 px-2">
                    <Search className="absolute right-5 top-3 w-4 h-4 text-slate-500"/>
                    <input type="text" placeholder="بحث في الرسائل" className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pr-10 pl-4 text-white text-sm outline-none focus:border-blue-500"/>
                </div>

                {CHATS.map(chat => (
                    <div key={chat.id} className="flex gap-3 p-3 hover:bg-slate-900 rounded-xl cursor-pointer transition-colors relative group">
                        <img src={chat.avatar} className="w-12 h-12 rounded-full bg-slate-800"/>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-white truncate">{chat.name}</span>
                                <span className="text-xs text-slate-500">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-slate-400 truncate">{chat.msg}</p>
                                {chat.unread > 0 && (
                                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 min-w-[20px] h-5 rounded-full flex items-center justify-center">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ProfileView = () => (
        <div className="flex-1 min-h-screen border-x border-slate-800 max-w-[600px] w-full">
            <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-slate-800">
                <button onClick={() => setView('feed')}><ArrowLeft className="w-5 h-5 text-white rtl:rotate-180"/></button>
                <div>
                    <h2 className="text-lg font-bold text-white leading-none">{user?.name}</h2>
                    <p className="text-xs text-slate-500">145 منشور</p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-blue-900 to-slate-800 relative">
                {user?.coverImage && <img src={user.coverImage} className="w-full h-full object-cover"/>}
            </div>

            {/* Profile Info */}
            <div className="px-4 relative mb-4">
                <div className="flex justify-between items-end -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-950 bg-slate-900 overflow-hidden">
                        <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover"/>
                    </div>
                    <button className="px-4 py-2 rounded-full border border-slate-600 text-white font-bold hover:bg-white/10 transition-colors text-sm">
                        تعديل الملف
                    </button>
                </div>
                
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-1">
                        {user?.name}
                        {user?.isIdentityVerified && <CheckCircle2 className="w-5 h-5 text-blue-500 fill-white"/>}
                    </h2>
                    <p className="text-slate-500 text-sm mb-3">@{user?.username || user?.name.replace(/\s+/g,'')}</p>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        {user?.bio || "مهتم بالتقنية والبرمجة. طالب في أكاديمية ميلاف."}
                    </p>
                    <div className="flex gap-4 text-sm mb-4">
                        <div className="text-slate-500"><span className="font-bold text-white">1,240</span> متابع</div>
                        <div className="text-slate-500"><span className="font-bold text-white">450</span> يتابع</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                {['المنشورات', 'الوسائط', 'الإعجابات'].map((tab, i) => (
                    <button key={tab} className={`flex-1 py-4 text-sm font-bold hover:bg-slate-900 transition-colors relative ${i===0 ? 'text-white' : 'text-slate-500'}`}>
                        {tab}
                        {i===0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>}
                    </button>
                ))}
            </div>

            {/* Sample Content */}
            <div className="p-8 text-center text-slate-500">
                جاري تحميل المنشورات...
            </div>
        </div>
    );

    // --- MAIN RENDER ---

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex justify-center" dir="rtl">
            
            {/* Left Sidebar (Nav) */}
            <div className="hidden md:flex flex-col w-20 xl:w-72 h-screen sticky top-0 px-2 xl:px-4 border-l border-slate-800 justify-between py-4">
                <div className="space-y-1">
                    {/* Logo */}
                    <div className="px-3 py-3 w-fit mb-4 hover:bg-slate-900 rounded-full cursor-pointer transition-colors" onClick={() => onBack()}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white fill-white"/>
                        </div>
                    </div>
                    
                    <SidebarLink icon={Home} label="الرئيسية" active={view==='feed'} onClick={() => setView('feed')} />
                    <SidebarLink icon={Search} label="استكشف" active={view==='explore'} onClick={() => setView('explore')} />
                    <SidebarLink icon={Bell} label="التنبيهات" />
                    <SidebarLink icon={Mail} label="الرسائل" active={view==='messages'} onClick={() => setView('messages')} />
                    <SidebarLink icon={User} label="الملف الشخصي" active={view==='profile'} onClick={() => setView('profile')} />
                    
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 xl:px-8 xl:py-3 font-bold mt-4 w-fit xl:w-full transition-all shadow-lg shadow-blue-500/20">
                        <Plus className="w-6 h-6 xl:hidden"/>
                        <span className="hidden xl:block">نشر</span>
                    </button>
                </div>
                
                {user && (
                    <div className="flex items-center gap-3 p-3 rounded-full hover:bg-slate-900 cursor-pointer xl:w-full">
                        <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-800"/>
                        <div className="hidden xl:block flex-1 min-w-0 text-right">
                            <div className="font-bold text-white text-sm truncate">{user.name}</div>
                            <div className="text-slate-500 text-xs truncate">@{user.username || user.name.replace(/\s+/g,'')}</div>
                        </div>
                        <MoreHorizontal className="hidden xl:block w-5 h-5 text-slate-500"/>
                    </div>
                )}
            </div>

            {/* Center Content */}
            <main className="flex-1 max-w-[600px] w-full min-h-screen pb-16 md:pb-0">
                {view === 'feed' && <FeedView />}
                {view === 'messages' && <MessagesView />}
                {view === 'profile' && <ProfileView />}
                {view === 'explore' && <div className="p-8 text-center text-slate-500 mt-20">جاري بناء قسم الاستكشاف...</div>}
            </main>

            {/* Right Sidebar (Trends) */}
            <div className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 px-6 py-4 border-r border-slate-800">
                <div className="relative mb-6 group">
                    <input 
                        type="text" 
                        placeholder="بحث في مراد سوشيال" 
                        className="w-full bg-slate-900 border border-transparent focus:border-blue-500 rounded-full py-3 pr-12 pl-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:bg-black"
                    />
                    <Search className="absolute right-4 top-3 w-5 h-5 text-slate-500 group-focus-within:text-blue-500"/>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 mb-4">
                    <h3 className="font-black text-xl mb-4 text-white">المتداول في السعودية</h3>
                    <div className="space-y-4">
                        {['#وظائف_السعودية', '#أكاديمية_ميلاف', '#الرياض_الآن', '#الذكاء_الاصطناعي', '#موسم_الرياض'].map((tag, i) => (
                            <div key={i} className="cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded transition-colors">
                                <div className="text-xs text-slate-500 flex justify-between">
                                    <span>المتداول • السعودية</span>
                                    <MoreHorizontal className="w-4 h-4"/>
                                </div>
                                <div className="font-bold text-white mt-0.5">{tag}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{10 + i}.5K منشور</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4">
                    <h3 className="font-black text-xl mb-4 text-white">اقتراحات المتابعة</h3>
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-white text-sm">مستخدم مقترح</div>
                                    <div className="text-slate-500 text-xs">@suggested_user</div>
                                </div>
                                <button className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200">
                                    متابعة
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 flex justify-around p-3 pb-safe z-50">
                <button onClick={() => setView('feed')} className={`p-2 rounded-lg ${view==='feed'?'text-white':'text-slate-500'}`}><Home className="w-6 h-6"/></button>
                <button onClick={() => setView('explore')} className={`p-2 rounded-lg ${view==='explore'?'text-white':'text-slate-500'}`}><Search className="w-6 h-6"/></button>
                <button className="p-2 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 transform -translate-y-2"><Plus className="w-6 h-6"/></button>
                <button onClick={() => setView('messages')} className={`p-2 rounded-lg ${view==='messages'?'text-white':'text-slate-500'}`}><Mail className="w-6 h-6"/></button>
                <button onClick={() => setView('profile')} className={`p-2 rounded-lg ${view==='profile'?'text-white':'text-slate-500'}`}><User className="w-6 h-6"/></button>
            </div>

        </div>
    );
};

// Helper Icon
const SettingsIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

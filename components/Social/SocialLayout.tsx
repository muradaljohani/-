
import React, { useState, useEffect, useRef } from 'react';
import { 
    Home, Search, Bell, Mail, User, MoreHorizontal, 
    Image as ImageIcon, Smile, Send, Heart, MessageCircle, 
    Repeat, Share2, ArrowLeft, MoreVertical, Plus, CheckCircle2, Pin,
    Calendar, MapPin, Check, ChevronLeft, Mic, Paperclip, Lock, 
    BarChart2, Play, Pause, Wallet, TrendingUp, Hash, Award, Crown,
    Film, ShieldAlert, EyeOff, Coins, Trophy, Download, Smartphone,
    Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { conversations, stories, SocialPost } from '../../dummyData';
import { ReelsFeed } from './ReelsFeed';
import { SocialAdmin } from './SocialAdmin';
import { InstallPrompt } from '../Mobile/InstallPrompt';
import { SocialService } from '../../services/SocialService';

interface Props {
    onBack: () => void;
}

// Simple Sound Hook
const useSound = (src: string) => {
    const audio = useRef(new Audio(src));
    const play = () => {
        audio.current.currentTime = 0;
        audio.current.play().catch(() => {});
    };
    return play;
};

export const SocialLayout: React.FC<Props> = ({ onBack }) => {
    const { user } = useAuth();
    const [view, setView] = useState<'feed' | 'reels' | 'admin' | 'wallet' | 'leaderboard' | 'messages' | 'profile'>('feed');
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [composeText, setComposeText] = useState('');
    const [isIncognito, setIsIncognito] = useState(false);
    
    // Real Data State
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    // Fetch Posts & Seed
    const loadPosts = async () => {
        setIsLoadingPosts(true);
        // 1. Check & Seed if empty
        await SocialService.checkAndSeed();
        // 2. Fetch sorted posts
        const data = await SocialService.getPosts();
        setPosts(data);
        setIsLoadingPosts(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);
    
    // Drafts
    useEffect(() => {
        const savedDraft = localStorage.getItem('social_draft');
        if (savedDraft) setComposeText(savedDraft);
    }, []);

    const handleComposeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComposeText(e.target.value);
        localStorage.setItem('social_draft', e.target.value);
    };

    const handlePostSubmit = async () => {
        if (!composeText.trim() || !user) return;
        
        setIsPosting(true);
        const success = await SocialService.createPost(user, composeText);
        
        if (success) {
            playSwoosh();
            setComposeText('');
            localStorage.removeItem('social_draft');
            loadPosts(); // Refresh feed
        } else {
            alert("فشل النشر، حاول مرة أخرى");
        }
        setIsPosting(false);
    };

    // Sound FX (Using generic URLs for demo)
    const playPop = useSound('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3');
    const playSwoosh = useSound('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3');

    // Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActivePostId(null);
                setActiveChatId(null);
            }
            if (e.key === 'n' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                // Focus compose
                document.getElementById('compose-area')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- SUB-COMPONENTS ---

    const StoriesRail = () => {
        return (
            <div className="flex gap-3 overflow-x-auto pt-4 pb-2 px-4 scrollbar-hide border-b border-slate-800 bg-black/40 backdrop-blur-md sticky top-[53px] z-20">
                {/* Add Story */}
                <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]">
                    <div className="w-[60px] h-[60px] rounded-full border border-slate-800 relative">
                        <img 
                            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-full h-full rounded-full object-cover opacity-60"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-black">
                            <Plus className="w-3 h-3"/>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500">قصتك</span>
                </div>

                {stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px] group">
                        <div className={`w-[64px] h-[64px] rounded-full p-[2px] ${story.isViewed ? 'bg-slate-800' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}`}>
                            <div className="w-full h-full bg-black rounded-full p-0.5 border-2 border-black">
                                <img 
                                    src={story.user.avatar} 
                                    className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-300 w-16 truncate text-center">{story.user.name}</span>
                    </div>
                ))}
            </div>
        );
    };

    const WalletPage = () => (
        <div className="p-6 text-white min-h-screen">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Wallet className="w-6 h-6 text-blue-500"/> المحفظة الرقمية</h2>
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 mb-8 border border-white/10 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <p className="text-blue-200 mb-2 font-bold">إجمالي الرصيد</p>
                    <h3 className="text-5xl font-black mb-4">1,250.50 <span className="text-lg font-normal text-blue-300">SAR</span></h3>
                    <div className="flex items-center gap-2 bg-black/20 w-fit px-3 py-1 rounded-full border border-white/10">
                        <Coins className="w-4 h-4 text-amber-400"/>
                        <span className="font-mono text-amber-400 font-bold">50,000 Coins</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="bg-white text-black py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors">إيداع</button>
                <button className="bg-slate-800 border border-slate-700 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors">سحب</button>
            </div>

            <h3 className="font-bold text-lg mb-4">تحويل سريع</h3>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex gap-2 mb-4">
                    <input placeholder="@username" className="bg-black border border-slate-700 rounded-lg p-3 flex-1 outline-none text-sm"/>
                    <input placeholder="Amount" type="number" className="bg-black border border-slate-700 rounded-lg p-3 w-24 outline-none text-sm"/>
                </div>
                <button className="w-full bg-blue-600 py-3 rounded-lg font-bold text-sm hover:bg-blue-500">إرسال الآن</button>
            </div>
        </div>
    );

    const LeaderboardPage = () => {
        // Mock data sorted by reputation
        const leaders = [
            { name: 'Murad', rep: 9500, avatar: 'https://ui-avatars.com/api/?name=Murad&background=0D8ABC&color=fff' },
            { name: 'Sarah Tech', rep: 8200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            { name: 'Crypto King', rep: 5000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Crypto' },
        ];

        return (
            <div className="p-6 text-white min-h-screen">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-500"/> قائمة الأوائل</h2>
                <div className="space-y-4">
                    {leaders.map((l, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${i === 0 ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-slate-800'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${i===0?'bg-amber-500 text-black':'bg-slate-800 text-slate-400'}`}>{i+1}</div>
                                <img src={l.avatar} className="w-12 h-12 rounded-full"/>
                                <span className="font-bold text-lg">{l.name}</span>
                            </div>
                            <div className="font-mono text-emerald-400 font-bold">{l.rep} Rep</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- TWITTER STYLE POST CARD (Mobile Optimized) ---
    const PostCard = ({ post, detailed = false }: { post: SocialPost, detailed?: boolean }) => {
        const [liked, setLiked] = useState(false);
        
        const formatNumber = (num: number) => {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toString();
        };

        const renderBadge = () => {
            if (post.user.isGold) return <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1" />;
            if (post.user.isPremium) return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 ml-1" />;
            if (post.user.verified) return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 ml-1" />;
            return null;
        };

        const highlightText = (text: string) => {
            if (!text) return null;
            return text.split(/(\s+)/).map((word, i) => {
                if (word.startsWith('#')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{word}</span>;
                if (word.startsWith('@')) return <span key={i} className="text-blue-400 hover:underline cursor-pointer">{word}</span>;
                return word;
            });
        };

        return (
            <div 
                className={`flex gap-3 p-4 border-b border-slate-800 hover:bg-white/[0.02] transition-colors cursor-pointer ${post.isPinned ? 'bg-slate-900/20' : ''}`}
                onClick={() => !detailed && setActivePostId(post.id)}
            >
                {/* Avatar Column */}
                <div className="shrink-0">
                    <img 
                        src={post.user.avatar} 
                        className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity bg-slate-700" 
                        alt={post.user.name} 
                        onClick={(e) => { e.stopPropagation(); setView('profile'); }}
                    />
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between text-slate-500 text-[15px] leading-tight mb-1">
                        <div className="flex items-center gap-1 overflow-hidden">
                            <span className="font-bold text-white truncate hover:underline">{post.user.name}</span>
                            {renderBadge()}
                            <span className="truncate ltr text-slate-500 ml-1" dir="ltr">{post.user.handle}</span>
                            <span className="text-slate-600 px-1">·</span>
                            <span className="text-slate-500 whitespace-nowrap">{post.timestamp}</span>
                        </div>
                        <button className="text-slate-500 hover:text-blue-400 p-1 -mr-2 rounded-full hover:bg-blue-500/10 transition-colors group">
                            <MoreHorizontal className="w-4 h-4"/>
                        </button>
                    </div>

                    {/* Post Text */}
                    <div className="text-[15px] text-white whitespace-pre-wrap leading-normal mt-0.5 dir-auto" style={{ wordBreak: 'break-word' }}>
                        {post.type === 'premium_locked' ? (
                            <div className="mt-2 relative rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900/50 p-4">
                                <div className="filter blur-sm select-none opacity-50 text-sm">
                                    هذا المحتوى حصري للمشتركين. يرجى الترقية للوصول الكامل.
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                    <div className="flex items-center gap-2 text-amber-500 font-bold mb-2">
                                        <Lock className="w-4 h-4"/> محتوى حصري
                                    </div>
                                    <button className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200">
                                        اشتراك
                                    </button>
                                </div>
                            </div>
                        ) : (
                            highlightText(post.content || '')
                        )}
                    </div>

                    {/* Media / Special Content - EDGE TO EDGE ON MOBILE */}
                    {post.type === 'poll' && post.pollOptions && (
                        <div className="mt-3 space-y-2">
                           {post.pollOptions.map((opt) => (
                               <div key={opt.id} className="relative h-8 rounded border border-slate-700 overflow-hidden">
                                   <div className="absolute inset-0 flex items-center px-3 z-10 text-sm font-bold text-slate-200 justify-between">
                                       <span>{opt.text}</span>
                                       <span>{Math.floor(Math.random() * 100)}%</span>
                                   </div>
                                   <div className="h-full bg-slate-800 w-[40%]"></div>
                               </div>
                           ))}
                        </div>
                    )}
                    
                    {post.images && post.images.length > 0 && (
                        <div className={`mt-3 overflow-hidden border-slate-800 ${post.images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''} -mx-4 md:mx-0 md:rounded-2xl rounded-none w-[calc(100%+2rem)] md:w-full border-y md:border`}>
                            {post.images.map((img, i) => (
                                <img key={i} src={img} className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
                            ))}
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex justify-between items-center mt-3 text-slate-500 max-w-md pr-2">
                        <div className="flex items-center gap-1 group cursor-pointer hover:text-blue-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2"><MessageCircle className="w-4.5 h-4.5"/></div>
                            <span className="text-xs">{post.replies > 0 ? formatNumber(post.replies) : ''}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 group cursor-pointer hover:text-green-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 -ml-2"><Repeat className="w-4.5 h-4.5"/></div>
                            <span className="text-xs">{post.retweets > 0 ? formatNumber(post.retweets) : ''}</span>
                        </div>
                        
                        <div 
                            className={`flex items-center gap-1 group cursor-pointer transition-colors ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                            onClick={(e) => { e.stopPropagation(); setLiked(!liked); playPop(); }}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-600/10 -ml-2 relative">
                                <Heart className={`w-4.5 h-4.5 ${liked ? 'fill-current' : ''}`}/>
                            </div>
                            <span className="text-xs">{post.likes > 0 ? formatNumber(post.likes + (liked ? 1 : 0)) : ''}</span>
                        </div>

                        <div className="flex items-center gap-1 group cursor-pointer hover:text-blue-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2"><BarChart2 className="w-4.5 h-4.5"/></div>
                            <span className="text-xs">{post.views}</span>
                        </div>

                        <div className="flex items-center gap-1 group cursor-pointer hover:text-blue-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2"><Share2 className="w-4.5 h-4.5"/></div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    // --- VIEWS ---

    const FeedView = () => (
        <div className="flex-1 min-h-screen border-x border-slate-800 max-w-[600px] w-full bg-black">
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center cursor-pointer h-[53px]" onClick={() => window.scrollTo(0,0)}>
                <h2 className="text-lg font-bold text-white">الرئيسية</h2>
                {isIncognito && <EyeOff className="w-4 h-4 text-gray-500"/>}
                <div className="md:hidden" onClick={onBack}><ArrowLeft className="w-5 h-5 text-white rtl:rotate-180"/></div>
            </div>

            <StoriesRail />
            
            {/* Compose */}
            <div className="p-4 border-b border-slate-800 hidden md:block">
                <div className="flex gap-3">
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-10 h-10 rounded-full bg-slate-800 object-cover" />
                    <div className="flex-1">
                        <textarea 
                            id="compose-area"
                            value={composeText}
                            onChange={handleComposeChange}
                            placeholder="ماذا يحدث؟" 
                            className="w-full bg-transparent text-xl text-white placeholder-slate-500 outline-none resize-none min-h-[50px] mt-2"
                        />
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
                            <div className="flex gap-0.5 text-blue-400">
                                <button className="p-2 hover:bg-blue-500/10 rounded-full"><ImageIcon className="w-5 h-5"/></button>
                                <button className="p-2 hover:bg-blue-500/10 rounded-full"><BarChart2 className="w-5 h-5"/></button>
                                <button className="p-2 hover:bg-blue-500/10 rounded-full"><Mic className="w-5 h-5"/></button>
                                <button className="p-2 hover:bg-blue-500/10 rounded-full"><Smile className="w-5 h-5"/></button>
                            </div>
                            <button 
                                onClick={handlePostSubmit}
                                disabled={!composeText || isPosting} 
                                className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full disabled:opacity-50 text-sm flex items-center gap-2 transition-colors"
                            >
                                {isPosting ? <Loader2 className="w-4 h-4 animate-spin"/> : 'نشر'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isLoadingPosts ? (
                <div className="p-10 text-center text-slate-500"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>
            ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
            )}
        </div>
    );

    const ChatSystem = () => {
        const activeChat = conversations.find(c => c.id === activeChatId);
        
        return (
            <div className="flex-1 min-h-screen border-x border-slate-800 max-w-[1000px] w-full flex bg-black">
                {/* Chat List */}
                <div className={`flex-col border-l border-slate-800 ${activeChatId ? 'hidden md:flex w-full md:w-[350px]' : 'flex w-full'}`}>
                    <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex justify-between items-center h-[53px]">
                        <h2 className="text-lg font-bold text-white">الرسائل</h2>
                        <Mail className="w-5 h-5 text-slate-400"/>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(chat => (
                            <div 
                                key={chat.id} 
                                onClick={() => setActiveChatId(chat.id)}
                                className={`flex gap-3 p-4 hover:bg-slate-900 cursor-pointer transition-colors border-b border-slate-800 ${activeChatId === chat.id ? 'bg-slate-900 border-r-2 border-r-blue-500' : ''}`}
                            >
                                <div className="relative">
                                    <img src={chat.avatar} className="w-12 h-12 rounded-full bg-slate-800"/>
                                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="font-bold text-white truncate">{chat.name}</span>
                                        <span className="text-xs text-slate-500">{chat.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate ${chat.unread ? 'text-white font-bold' : 'text-slate-400'}`}>{chat.lastMsg}</p>
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

                {/* Chat Window */}
                <div className={`flex-col flex-1 bg-black relative ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            {/* Header */}
                            <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 border-b border-slate-800 flex items-center gap-4 h-[53px]">
                                <button onClick={() => setActiveChatId(null)} className="md:hidden"><ArrowLeft className="w-5 h-5 text-white rtl:rotate-180"/></button>
                                <img src={activeChat.avatar} className="w-9 h-9 rounded-full"/>
                                <div>
                                    <span className="font-bold text-white block leading-none">{activeChat.name}</span>
                                    {activeChat.online && <span className="text-[10px] text-emerald-500">متصل الآن</span>}
                                </div>
                                <MoreVertical className="w-5 h-5 text-slate-400 mr-auto cursor-pointer"/>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
                                {activeChat.messages.map(msg => (
                                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                            msg.sender === 'me' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-slate-800 text-slate-100 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 px-1">
                                            <span>{msg.time}</span>
                                            {msg.sender === 'me' && msg.read && <div className="flex"><Check className="w-3 h-3 text-blue-500"/><Check className="w-3 h-3 text-blue-500 -ml-1.5"/></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-slate-800 bg-black">
                                <div className="flex items-center gap-2 bg-slate-900 rounded-2xl px-3 py-2 border border-slate-800 focus-within:border-blue-500 transition-colors">
                                    <button className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><Paperclip className="w-5 h-5"/></button>
                                    <input placeholder="اكتب رسالتك..." className="flex-1 bg-transparent text-white outline-none text-sm dir-rtl" />
                                    <button className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><Mic className="w-5 h-5"/></button>
                                    <button className="text-blue-500 p-1 hover:bg-blue-500/10 rounded-full"><Send className="w-5 h-5 rtl:rotate-180"/></button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-black">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                                <Send className="w-8 h-8 text-slate-600"/>
                            </div>
                            <h2 className="text-xl font-bold mb-2 text-white">الرسائل المباشرة</h2>
                            <p className="text-sm">اختر محادثة أو ابدأ رسالة جديدة</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- LEFT SIDEBAR ---
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

    return (
        <div className={`min-h-screen bg-black text-slate-100 font-sans flex justify-center selection:bg-blue-500 selection:text-white ${isIncognito ? 'grayscale' : ''}`} dir="rtl">
            
            {/* Left Nav */}
            <div className="hidden md:flex flex-col w-20 xl:w-72 h-screen sticky top-0 px-2 xl:px-4 border-l border-slate-800 justify-between py-4 z-50 bg-black">
                <div className="space-y-1">
                    <div className="px-3 py-3 w-fit mb-2 hover:bg-slate-900 rounded-full cursor-pointer transition-colors" onClick={() => onBack()}>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                             <span className="font-black text-black text-lg">M</span>
                        </div>
                    </div>
                    
                    <SidebarLink icon={Home} label="الرئيسية" active={view==='feed'} onClick={() => { setView('feed'); setActivePostId(null); }} />
                    <SidebarLink icon={Film} label="Reels" active={view==='reels'} onClick={() => setView('reels')} />
                    <SidebarLink icon={Bell} label="التنبيهات" notify />
                    <SidebarLink icon={Mail} label="الرسائل" active={view==='messages'} onClick={() => setView('messages')} />
                    <SidebarLink icon={Trophy} label="الأوائل" active={view==='leaderboard'} onClick={() => setView('leaderboard')} />
                    <SidebarLink icon={Wallet} label="المحفظة" active={view==='wallet'} onClick={() => setView('wallet')} />
                    
                    {user?.role === 'admin' && (
                        <SidebarLink icon={ShieldAlert} label="الإدارة" active={view==='admin'} onClick={() => setView('admin')} />
                    )}

                    <SidebarLink icon={User} label="الملف الشخصي" active={view==='profile'} onClick={() => setView('profile')} />
                    
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 xl:px-8 xl:py-3.5 font-bold mt-4 w-fit xl:w-full transition-all shadow-lg shadow-blue-500/20 text-lg">
                        <Plus className="w-6 h-6 xl:hidden"/>
                        <span className="hidden xl:block">نشر</span>
                    </button>
                </div>
                
                <div className="space-y-4">
                     <InstallPrompt />
                     <button onClick={() => setIsIncognito(!isIncognito)} className="flex items-center gap-2 text-slate-500 text-xs px-4">
                         {isIncognito ? <EyeOff className="w-4 h-4 text-red-500"/> : <EyeOff className="w-4 h-4"/>}
                         <span className="hidden xl:block">{isIncognito ? 'وضع التخفي (نشط)' : 'وضع التخفي'}</span>
                     </button>

                    {user && (
                        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-slate-900 cursor-pointer xl:w-full transition-colors mb-2">
                            <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-800 object-cover"/>
                            <div className="hidden xl:block flex-1 min-w-0 text-right">
                                <div className="font-bold text-white text-sm truncate">{user.name}</div>
                                <div className="text-slate-500 text-xs truncate">@{user.username || user.name.replace(/\s+/g,'')}</div>
                            </div>
                            <MoreHorizontal className="hidden xl:block w-5 h-5 text-slate-500"/>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Content */}
            <main className={`flex-1 max-w-[600px] w-full min-h-screen pb-16 md:pb-0 relative border-r border-slate-800 ${view === 'reels' ? 'max-w-md border-none' : ''}`}>
                {view === 'feed' && !activePostId && <FeedView />}
                {view === 'reels' && <ReelsFeed />}
                {view === 'wallet' && <WalletPage />}
                {view === 'leaderboard' && <LeaderboardPage />}
                {view === 'admin' && <SocialAdmin />}
                {view === 'messages' && <ChatSystem />}
                {activePostId && <FeedView />} 
                {view === 'profile' && <div className="p-8 text-center text-slate-500 mt-20 font-bold bg-black h-full">الملف الشخصي (قيد التطوير)</div>}
            </main>

            {/* Right Sidebar (Hidden on Reels) */}
            {view !== 'reels' && (
                <div className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 px-6 py-4 border-r border-slate-800 z-40 bg-black">
                    <div className="relative mb-6 group">
                        <input 
                            type="text" 
                            placeholder="بحث..." 
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
                                { tag: '#Murad_Social', posts: '15.4K', cat: 'Technology' },
                                { tag: '#AI_Future', posts: '12.1K', cat: 'Science' },
                                { tag: '#Vision2030', posts: '89.2K', cat: 'Politics' },
                                { tag: '#Riyadh_Season', posts: '240K', cat: 'Entertainment' }
                            ].map((trend, i) => (
                                <div key={i} className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                                    <div className="flex justify-between text-xs text-slate-500 mb-0.5">
                                        <span>{trend.cat} · Trending</span>
                                        <MoreHorizontal className="w-4 h-4 hover:text-blue-500"/>
                                    </div>
                                    <div className="font-bold text-white">{trend.tag}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{trend.posts} posts</div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 text-blue-400 text-sm cursor-pointer hover:bg-white/5 transition-colors">
                            عرض المزيد
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 px-2">
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <span>© 2025 Murad Social</span>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-slate-800 flex justify-around p-3 pb-safe z-50">
                <button onClick={() => { setView('feed'); setActivePostId(null); }} className={`p-2 rounded-lg transition-colors ${view==='feed' && !activePostId ? 'text-white' : 'text-slate-500'}`}><Home className="w-6 h-6"/></button>
                <button onClick={() => setView('reels')} className={`p-2 rounded-lg transition-colors ${view==='reels'?'text-white':'text-slate-500'}`}><Film className="w-6 h-6"/></button>
                <button className="p-3 bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 transform -translate-y-4 border-4 border-black"><Plus className="w-6 h-6"/></button>
                <button onClick={() => setView('messages')} className={`p-2 rounded-lg transition-colors ${view==='messages'?'text-white':'text-slate-500'}`}><Mail className="w-6 h-6"/></button>
                <button onClick={() => setView('profile')} className={`p-2 rounded-lg transition-colors ${view==='profile'?'text-white':'text-slate-500'}`}><User className="w-6 h-6"/></button>
            </div>
        </div>
    );
};

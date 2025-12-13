
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, MoreHorizontal, ArrowUpDown, Heart, 
  Image as ImageIcon, MapPin, X, Calendar, Gift, Trash2, Eye, Upload, BarChart2, Bot
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, query, onSnapshot, serverTimestamp, db } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils';
import { getGeminiResponse } from '../../services/geminiService';

interface Props {
    postId: string;
    onBack: () => void;
    onUserClick?: (userId: string) => void;
}

// --- Custom Icons ---
const ReplyIconM = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {/* Stylized M representing Message/Murad */}
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeOpacity="0.5" />
        <path d="M22 6l-10 7L2 6" />
    </svg>
);

// --- MURAD AI PROFILE CONSTANT ---
const MURAD_AI_PROFILE_DATA = {
    id: "murad-ai-bot-id",
    name: "Murad AI",
    username: "MURAD",
    handle: "@MURAD",
    email: "ai@murad-group.com",
    avatar: "https://ui-avatars.com/api/?name=Murad+AI&background=000000&color=ffffff&size=512&bold=true&length=1&font-size=0.6", 
    verified: true,
    isGold: true,
    role: 'bot'
};

export const PostDetail: React.FC<Props> = ({ postId, onBack, onUserClick }) => {
    const { user } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [replyText, setReplyText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch Post & Real-time Replies
    useEffect(() => {
        if (!postId) return;

        // 1. Fetch Main Post
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'posts', postId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (e) {
                console.error("Error fetching post", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();

        // 2. Listen to Replies
        try {
            const repliesRef = collection(db, 'posts', postId, 'replies');
            const q = query(repliesRef);
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedReplies = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                
                // Client side sort
                fetchedReplies.sort((a: any, b: any) => {
                    const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
                    const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
                    return tA - tB;
                });

                setReplies(fetchedReplies);
            }, (error) => {
                console.error("Replies Listener Error:", error);
            });

            return () => unsubscribe();
        } catch (e) {
             console.error("Replies Setup Error:", e);
        }
    }, [postId]);

    // --- INSTANT BOT TRIGGER LOGIC ---
    const handleBotTrigger = (content: string, userName: string) => {
        // Run as non-blocking async (Fire & Forget)
        (async () => {
            try {
                const aiResponse = await getGeminiResponse(
                    `SYSTEM: You are "Murad AI", the intelligent assistant of the Milaf platform. 
                     A user named "${userName}" mentioned you (@MURAD) in a comment.
                     Comment: "${content}".
                     
                     Task: Reply immediately, briefly, and helpfully in Arabic.
                     Context: Be witty, professional, and concise.`,
                    'expert',
                    userName
                );

                const repliesRef = collection(db, 'posts', postId, 'replies');
                await addDoc(repliesRef, {
                    text: aiResponse,
                    user: {
                        name: MURAD_AI_PROFILE_DATA.name,
                        handle: MURAD_AI_PROFILE_DATA.handle,
                        avatar: MURAD_AI_PROFILE_DATA.avatar,
                        verified: true,
                        isGold: true,
                        uid: MURAD_AI_PROFILE_DATA.id
                    },
                    timestamp: serverTimestamp(),
                    likes: 0,
                    isBotReply: true
                });
            } catch (e) {
                console.error("Bot failed:", e);
            }
        })();
    };

    const handleReply = async () => {
        if (!user) return alert("يجب تسجيل الدخول للرد على المنشور.");
        if (!replyText.trim()) return;
        
        const contentToSend = replyText;
        setReplyText(''); // Clear UI immediately for speed perception

        try {
            const repliesRef = collection(db, 'posts', postId, 'replies');
            await addDoc(repliesRef, {
                text: contentToSend,
                user: {
                    name: user.name,
                    handle: user.username ? `@${user.username}` : `@${user.id.slice(0,5)}`,
                    avatar: user.avatar,
                    uid: user.id
                },
                timestamp: serverTimestamp(),
                likes: 0
            });

            // Trigger Bot if mentioned
            if (/@murad/i.test(contentToSend)) {
                handleBotTrigger(contentToSend, user.name);
            }

        } catch (e) {
            console.error("Reply failed", e);
            setReplyText(contentToSend); // Restore if failed
        }
    };

    const handleLike = () => {
        const newState = !isLiked;
        setIsLiked(newState);
        if(newState) {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 300);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#71767b]">جاري التحميل...</div>;
    if (!post) return <div className="min-h-screen bg-black flex items-center justify-center text-[#71767b]">المنشور غير موجود</div>;

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-32 relative" dir="rtl">
            
            {/* 1. Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-[#2f3336]">
                <button onClick={onBack} className="p-2 -mr-2 hover:bg-[#18191c] rounded-full transition-colors">
                    <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
                </button>
                <h2 className="text-xl font-bold">منشور</h2>
            </div>

            {/* 2. Main Post */}
            <div className="px-4 pt-4">
                {/* User Info Row */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                        <img 
                            src={post.user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            alt={post.user?.name} 
                            className="w-10 h-10 rounded-full object-cover border border-[#2f3336] cursor-pointer hover:opacity-80"
                            onClick={() => onUserClick && post.user?.uid && onUserClick(post.user.uid)}
                        />
                        <div className="flex flex-col leading-tight">
                            <span 
                                className="font-bold text-[15px] text-[#e7e9ea] cursor-pointer hover:underline"
                                onClick={() => onUserClick && post.user?.uid && onUserClick(post.user.uid)}
                            >
                                {post.user?.name}
                            </span>
                            <span className="text-[#71767b] text-[14px] dir-ltr text-right">{post.user?.handle}</span>
                        </div>
                    </div>
                    <button className="text-[#71767b] hover:bg-[#031018] hover:text-[#1d9bf0] p-1.5 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="text-xl leading-normal whitespace-pre-wrap mb-3 text-[#e7e9ea] font-normal">
                    {post.content}
                </div>

                {/* Image */}
                {post.image && (
                    <div className="rounded-2xl overflow-hidden border border-[#2f3336] mb-3 w-full">
                        <img src={post.image} className="w-full h-full object-cover" />
                    </div>
                )}
                {post.images && post.images.length > 0 && (
                     <div className="rounded-2xl overflow-hidden border border-[#2f3336] mb-3 w-full">
                        <img src={post.images[0]} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Date & Views */}
                <div className="py-4 border-b border-[#2f3336] text-[#71767b] text-[15px] flex items-center gap-1 font-normal">
                    <span>{new Date(post.createdAt?.toDate ? post.createdAt.toDate() : Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>·</span>
                    <span>{new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                    <span>·</span>
                    <span className="text-white font-bold">{post.views || '12K'}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> مشاهدة</span>
                </div>

                {/* Stats Row */}
                <div className="py-3 border-b border-[#2f3336] flex gap-6 text-[14px]">
                    <div className="flex gap-1">
                        <span className="font-bold text-[#e7e9ea]">{post.retweets || 0}</span>
                        <span className="text-[#71767b]">إعادة نشر</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="font-bold text-[#e7e9ea]">{post.likes || 0}</span>
                        <span className="text-[#71767b]">إعجاب</span>
                    </div>
                </div>

                {/* Action Icons Row */}
                <div className="flex justify-around items-center py-2 border-b border-[#2f3336] text-[#71767b]">
                    <button className="p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] rounded-full transition-colors"><ReplyIconM className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-[#00ba7c]/10 hover:text-[#00ba7c] rounded-full transition-colors"><ArrowUpDown className="w-5 h-5" /></button>
                    <button onClick={handleLike} className={`p-2 hover:bg-[#f91880]/10 hover:text-[#f91880] rounded-full transition-colors ${isLiked ? 'text-[#f91880]' : ''}`}>
                        <Heart className={`w-5 h-5 transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : ''} ${isLikeAnimating ? 'scale-150' : ''}`} />
                    </button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] rounded-full transition-colors"><Upload className="w-5 h-5" /></button>
                </div>
            </div>

            {/* 3. Replies Feed - Enhanced Visibility */}
            <div className="pb-20">
                {replies.length > 0 ? (
                    replies.map((reply) => {
                        const isBot = reply.user?.id === 'murad-ai-bot-id';
                        
                        return (
                            <div key={reply.id} className={`flex gap-3 p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors ${isBot ? 'bg-purple-900/10' : ''}`}>
                                <img 
                                    src={reply.user.avatar} 
                                    className={`w-10 h-10 rounded-full object-cover border ${isBot ? 'border-purple-500' : 'border-[#2f3336]'} cursor-pointer hover:opacity-80`}
                                    onClick={() => onUserClick && reply.user.uid && onUserClick(reply.user.uid)}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-[15px] mb-0.5">
                                        <span 
                                            className={`font-bold cursor-pointer hover:underline ${isBot ? 'text-purple-400' : 'text-[#e7e9ea]'}`}
                                            onClick={() => onUserClick && reply.user.uid && onUserClick(reply.user.uid)}
                                        >
                                            {reply.user.name}
                                        </span>
                                        {isBot && <Bot className="w-3 h-3 text-purple-400"/>}
                                        <span className="text-[#71767b] dir-ltr text-sm">{reply.user.handle}</span>
                                        <span className="text-[#71767b] text-sm">· {formatRelativeTime(reply.timestamp)}</span>
                                    </div>
                                    <div className="text-[#e7e9ea] text-[15px] leading-relaxed">
                                        {reply.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-[#71767b] text-sm">
                        كن أول من يرد على هذا المنشور!
                    </div>
                )}
            </div>

            {/* 4. Fixed Reply Input - Accessible for any Member */}
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#2f3336] px-4 py-2 pb-safe z-50">
                 <div className="flex gap-3 items-end">
                    <div className="flex flex-col items-center justify-end h-full pb-2">
                         <img 
                            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-10 h-10 rounded-full object-cover border border-[#2f3336]"
                         />
                    </div>
                    
                    <div className="flex-1">
                         {/* Input Area */}
                         <div className="relative">
                            <textarea 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={user ? "غرد ردك" : "سجل دخول للرد"}
                                disabled={!user}
                                className="w-full bg-transparent text-xl text-white placeholder-[#71767b] outline-none resize-none min-h-[40px] max-h-32 py-3 disabled:cursor-not-allowed"
                                rows={1}
                            />
                        </div>

                        {/* Toolbar Row */}
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex gap-4 text-[#1d9bf0]">
                                <ImageIcon className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full" />
                                <Gift className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full" />
                                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full" />
                                <MapPin className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full opacity-50" />
                            </div>
                            <button 
                                onClick={handleReply}
                                disabled={!replyText.trim() || !user}
                                className={`font-bold rounded-full px-5 py-1.5 text-sm transition-colors ${
                                    (!replyText.trim() || !user) 
                                    ? 'bg-[#1d9bf0]/50 text-white/50 cursor-not-allowed' 
                                    : 'bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white'
                                }`}
                            >
                                رد
                            </button>
                        </div>
                    </div>
                 </div>
            </div>

        </div>
    );
};

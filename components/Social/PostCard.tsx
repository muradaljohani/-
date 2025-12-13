
import React, { useState, useEffect } from 'react';
import { 
    ArrowUpDown, Heart, MoreHorizontal, 
    CheckCircle2, Crown, Pin, Bookmark, Trash2, X, Bot,
    Eye, Upload
} from 'lucide-react';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, db, deleteDoc, query, orderBy, limit, onSnapshot } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils';

interface PostCardProps {
    post: any;
    onOpenLightbox?: (src: string) => void;
    onShare?: (msg: string) => void;
    onClick?: () => void;
    isFocusMode?: boolean;
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

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenLightbox, onShare, onClick, isFocusMode = false, onUserClick }) => {
    const { user, isAdmin } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post?.likes || 0);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    
    const [retweeted, setRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post?.retweets || 0);

    // --- AI REPLY STATE ---
    const [botReply, setBotReply] = useState<any>(null);

    // Defensive check
    if (!post || Object.keys(post).length === 0) return null;
    
    const postUser = post.user || {};
    const userName = postUser.name || 'Unknown User';
    const userHandle = postUser.handle || '@unknown';
    const userAvatar = postUser.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Unknown";
    const userUid = postUser.uid || postUser.id || 'unknown';

    const isOwner = user && userUid !== 'unknown' && user.id ? user.id === userUid : false;
    const canDelete = isAdmin || isOwner;

    // --- DETECT @MURAD MENTION & LISTEN FOR REPLY ---
    useEffect(() => {
        if (post.content && /@murad/i.test(post.content)) {
            const repliesRef = collection(db, 'posts', post.id, 'replies');
            const q = query(repliesRef, orderBy('timestamp', 'asc'), limit(5));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const botDoc = snapshot.docs.find(d => d.data().user?.id === 'murad-ai-bot-id');
                if (botDoc) {
                    setBotReply({ id: botDoc.id, ...botDoc.data() });
                }
            });

            return () => unsubscribe();
        }
    }, [post.id, post.content]);

    const getYouTubeId = (text: string) => {
        if (!text) return null;
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = text.match(regex);
        return match ? match[1] : null;
    };

    const youtubeId = post.content ? getYouTubeId(post.content) : null;
    const displayContent = youtubeId && post.content
        ? post.content.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}).*/, '').trim()
        : post.content;

    const formatNumber = (num: number) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canDelete) return;
        if (window.confirm("هل أنت متأكد من حذف هذا المنشور؟")) {
            try { await deleteDoc(doc(db, 'posts', post.id)); } catch (err) {}
        }
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (onUserClick && userUid && userUid !== 'unknown') {
            onUserClick(userUid);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert("يرجى تسجيل الدخول للإعجاب");
        
        const isNowLiked = !liked;
        setLiked(isNowLiked);
        setLikeCount((prev: number) => isNowLiked ? prev + 1 : prev - 1);
        
        // Trigger Animation
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 300); // 300ms burst

        try { await updateDoc(doc(db, 'posts', post.id), { likes: increment(isNowLiked ? 1 : -1) }); } catch (err) {}
    };

    const handleRetweet = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert("يرجى تسجيل الدخول لإعادة النشر");
        if (retweeted) return;
        
        setRetweeted(true);
        setRetweetCount((prev: number) => prev + 1);
        try {
            await addDoc(collection(db, 'posts'), {
                type: 'repost',
                originalPostId: post.id,
                originalContent: post.content,
                originalUser: postUser,
                user: { name: user.name, handle: user.username ? `@${user.username}` : `@${user.id.slice(0,5)}`, avatar: user.avatar, verified: user.isIdentityVerified, isGold: user.primeSubscription?.status === 'active', uid: user.id },
                createdAt: serverTimestamp(), likes: 0, retweets: 0, replies: 0, views: '0'
            });
            await updateDoc(doc(db, 'posts', post.id), { retweets: increment(1) });
        } catch (err) {}
    };

    const handleLightbox = (e: React.MouseEvent, img: string) => {
        e.stopPropagation();
        if (onOpenLightbox) onOpenLightbox(img);
    };

    const renderBadge = (u: any) => {
        if (!u) return null;
        if (u.isGold) return <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1" />;
        if (u.verified) return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 ml-1" />;
        return null;
    };

    const highlightText = (text: string) => {
        if (!text) return null;
        return text.split(/(\s+)/).map((word, i) => {
            if (word.match(/@murad/i)) {
                return (
                    <span 
                        key={i} 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onUserClick) onUserClick('murad-ai-bot-id');
                        }}
                        className="text-purple-400 font-bold cursor-pointer bg-purple-500/10 px-1 rounded hover:bg-purple-500/20 transition-colors"
                    >
                        {word}
                    </span>
                );
            }
            if (word.startsWith('#') || word.startsWith('@')) {
                return <span key={i} className="text-[#1d9bf0] hover:underline cursor-pointer">{word}</span>;
            }
            return word;
        });
    };

    const renderImages = () => {
        let images = post.images || [];
        if (!images.length && post.image) images = [post.image];
        if (images.length === 0) return null;
        const count = images.length;
        return (
            <div className={`mt-3 rounded-2xl overflow-hidden border border-[#2f3336] grid gap-0.5 ${count === 1 ? 'grid-cols-1 aspect-[16/9]' : 'grid-cols-2 aspect-[16/9]'} bg-[#16181c]`} onClick={(e) => e.stopPropagation()}>
                {images.slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="relative bg-[#16181c] overflow-hidden cursor-pointer" onClick={(e) => handleLightbox(e, img)}>
                        <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                ))}
            </div>
        );
    };

    if (post.type === 'repost') {
        return null; 
    }

    return (
        <div 
            className={`flex gap-3 p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer ${post.isPinned ? 'bg-[#16181c]/50' : ''} font-sans`} 
            onClick={onClick} 
            dir="rtl"
        >
            <div className="shrink-0" onClick={handleProfileClick}>
                <img src={userAvatar} className="w-11 h-11 rounded-full object-cover border border-[#2f3336] hover:opacity-80 transition-opacity" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[#71767b] text-[15px] leading-tight mb-1">
                    <div className="flex items-center gap-1 overflow-hidden">
                        {post.isPinned && <Pin className="w-3 h-3 text-[#71767b] fill-current mr-1" />}
                        <span className="font-bold text-[#e7e9ea] truncate hover:underline" onClick={handleProfileClick}>{userName}</span>
                        {renderBadge(postUser)}
                        <span className="truncate text-[#71767b] ml-1 text-sm" dir="ltr">{userHandle}</span>
                        <span className="text-[#71767b] px-1">·</span>
                        <span className="text-[#71767b] text-sm hover:underline">{formatRelativeTime(post.createdAt || post.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {canDelete && <button className="p-1.5 -mr-1 rounded-full text-gray-500 hover:bg-red-500/10 hover:text-red-500" onClick={handleDelete}><Trash2 className="w-4 h-4"/></button>}
                        <button className="p-1 -mr-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="w-4 h-4"/></button>
                    </div>
                </div>

                <div className="text-[15px] text-[#e7e9ea] whitespace-pre-wrap leading-relaxed mt-0.5" style={{ wordBreak: 'break-word' }}>
                    {highlightText(displayContent || '')}
                </div>

                {youtubeId && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336] aspect-video w-full bg-black">
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`} frameBorder="0" allowFullScreen></iframe>
                    </div>
                )}

                {renderImages()}

                {/* --- MURAD AI INSTANT REPLY BOX --- */}
                {botReply && (
                    <div className="mt-3 bg-[#1e1e24] border border-purple-500/30 rounded-2xl p-3 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                        <div className="flex gap-2">
                            <div className="shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center border border-purple-400 shadow-lg shadow-purple-900/50">
                                    <Bot className="w-5 h-5 text-white"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-purple-400 font-bold text-sm">Murad AI</span>
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 rounded font-mono">BOT</span>
                                </div>
                                <p className="text-[#e7e9ea] text-sm leading-relaxed whitespace-pre-wrap">{botReply.text}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-3 text-[#71767b] max-w-md">
                    {/* Reply Icon */}
                    <button className="flex items-center gap-1 group hover:text-[#1d9bf0]" onClick={(e) => e.stopPropagation()} title="رد">
                        <ReplyIconM className="w-5 h-5"/>
                        <span className="text-xs">{formatNumber(post.replies || (botReply ? 1 : 0))}</span>
                    </button>
                    
                    {/* Retweet Icon */}
                    <button className={`flex items-center gap-1 group hover:text-[#00ba7c] ${retweeted ? 'text-[#00ba7c]' : ''}`} onClick={handleRetweet} title="إعادة نشر">
                        <ArrowUpDown className="w-5 h-5"/>
                        <span className="text-xs">{formatNumber(retweetCount)}</span>
                    </button>
                    
                    {/* Like Icon */}
                    <button 
                        className={`flex items-center gap-1 group hover:text-[#f91880] ${liked ? 'text-[#f91880]' : ''}`} 
                        onClick={handleLike}
                        title="إعجاب"
                    >
                        <Heart 
                            className={`w-4.5 h-4.5 transition-transform duration-300 ${liked ? 'fill-current scale-110' : ''} ${isLikeAnimating ? 'scale-150' : ''}`}
                        />
                        <span className="text-xs">{formatNumber(likeCount)}</span>
                    </button>
                    
                    {/* View Icon (Eye) */}
                    <button className="flex items-center gap-1 group hover:text-[#1d9bf0]" onClick={(e) => e.stopPropagation()}>
                        <Eye className="w-5 h-5"/>
                        <span className="text-xs">{post.views || '0'}</span>
                    </button>
                    
                    {/* Share Icon (Upload style) */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:text-[#1d9bf0]" onClick={(e) => e.stopPropagation()}><Upload className="w-4.5 h-4.5"/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

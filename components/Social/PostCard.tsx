
import React, { useState } from 'react';
import { 
    MessageCircle, Repeat, Heart, Share2, MoreHorizontal, 
    CheckCircle2, Crown, Pin, BarChart2, Bookmark, Trash2, X
} from 'lucide-react';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, db, deleteDoc } from '../../src/lib/firebase';
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

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenLightbox, onShare, onClick, isFocusMode = false, onUserClick }) => {
    const { user, isAdmin } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const [retweeted, setRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post.retweets || 0);

    const isOwner = user && post.user?.uid ? user.id === post.user.uid : false;
    const canDelete = isOwner || isAdmin;

    const getYouTubeId = (text: string) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = text.match(regex);
        return match ? match[1] : null;
    };

    const youtubeId = post.content ? getYouTubeId(post.content) : null;
    
    const displayContent = youtubeId && post.content
        ? post.content.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}).*/, '').trim()
        : post.content;

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const playSound = () => {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'); 
        audio.volume = 0.2;
        audio.play().catch(() => {});
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canDelete) return;

        const confirmMessage = isAdmin && !isOwner 
            ? "تنبيه إداري: هل أنت متأكد من حذف منشور هذا العضو؟" 
            : "هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.";

        if (window.confirm(confirmMessage)) {
            try {
                await deleteDoc(doc(db, 'posts', post.id));
            } catch (err) {
                console.error("Error deleting post:", err);
                alert("حدث خطأ أثناء محاولة الحذف.");
            }
        }
    };

    const handleUserClick = (e: React.MouseEvent, uid: string) => {
        e.stopPropagation();
        if (onUserClick && uid) {
            onUserClick(uid);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return; 

        const isNowLiked = !liked;
        setLiked(isNowLiked);
        setLikeCount((prev: number) => isNowLiked ? prev + 1 : prev - 1);
        
        if (isNowLiked) {
            setIsAnimating(true);
            playSound();
            setTimeout(() => setIsAnimating(false), 1000);
        }

        try {
            const postRef = doc(db, 'posts', post.id);
            await updateDoc(postRef, {
                likes: increment(isNowLiked ? 1 : -1)
            });

            if (isNowLiked && post.user?.uid && post.user.uid !== user.id) {
                const notificationsRef = collection(db, 'users', post.user.uid, 'notifications');
                await addDoc(notificationsRef, {
                    type: 'like',
                    actorId: user.id,
                    actorName: user.name,
                    actorAvatar: user.avatar,
                    postId: post.id,
                    content: post.content?.substring(0, 50) + '...',
                    read: false,
                    timestamp: serverTimestamp()
                });
            }
        } catch (err) {
            console.error("Like failed", err);
            setLiked(!isNowLiked);
            setLikeCount((prev: number) => isNowLiked ? prev - 1 : prev + 1);
        }
    };

    const handleRetweet = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            alert("يرجى تسجيل الدخول لإعادة النشر");
            return;
        }
        if (retweeted) return;

        setRetweeted(true);
        setRetweetCount((prev: number) => prev + 1);

        try {
            await addDoc(collection(db, 'posts'), {
                type: 'repost',
                originalPostId: post.id,
                originalContent: post.content,
                originalUser: post.user,
                user: {
                    name: user.name,
                    handle: user.username ? `@${user.username}` : `@${user.id.slice(0,5)}`,
                    avatar: user.avatar,
                    verified: user.isIdentityVerified,
                    isGold: user.primeSubscription?.status === 'active',
                    uid: user.id
                },
                createdAt: serverTimestamp(),
                likes: 0,
                retweets: 0,
                replies: 0,
                views: '0'
            });

            const postRef = doc(db, 'posts', post.id);
            await updateDoc(postRef, {
                retweets: increment(1)
            });
            
        } catch (err) {
            console.error("Retweet failed", err);
            setRetweeted(false);
            setRetweetCount((prev: number) => prev - 1);
        }
    };

    const handleLightbox = (e: React.MouseEvent, img: string) => {
        e.stopPropagation();
        if (onOpenLightbox) onOpenLightbox(img);
    };

    const renderBadge = (postUser: any) => {
        if (!postUser) return null;
        if (postUser.isGold) return <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1" />;
        if (postUser.verified) return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 ml-1" />;
        return null;
    };

    const highlightText = (text: string) => {
        if (!text) return null;
        return text.split(/(\s+)/).map((word, i) => {
            if (word.startsWith('#') || word.startsWith('@')) {
                return <span key={i} className="text-[#1d9bf0] hover:underline cursor-pointer font-medium">{word}</span>;
            }
            if (word.match(/https?:\/\/[^\s]+/)) {
                return <a key={i} href={word} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline break-all" onClick={e => e.stopPropagation()}>{word}</a>;
            }
            return word;
        });
    };

    const renderImages = () => {
        let images = post.images || [];
        if (!images.length && post.image) images = [post.image];
        
        if (images.length === 0) return null;
        
        const count = images.length;
        let gridLayout = '';
        
        if (count === 1) gridLayout = 'grid-cols-1 aspect-[16/9]';
        else if (count === 2) gridLayout = 'grid-cols-2 aspect-[16/9]';
        else if (count === 3) gridLayout = 'grid-cols-2 grid-rows-2 aspect-[16/9]';
        else gridLayout = 'grid-cols-2 grid-rows-2 aspect-[16/9]';

        return (
            <div className={`mt-3 rounded-2xl overflow-hidden border border-[#2f3336] grid gap-0.5 ${gridLayout} bg-[#16181c]`} onClick={(e) => e.stopPropagation()}>
                {images.slice(0, 4).map((img: string, i: number) => {
                     const isThreeLayout = count === 3;
                     const isFirstOfThree = isThreeLayout && i === 0;
                     
                     return (
                        <div 
                            key={i} 
                            className={`relative bg-[#16181c] overflow-hidden cursor-pointer ${isFirstOfThree ? 'row-span-2' : ''}`}
                            onClick={(e) => handleLightbox(e, img)}
                        >
                            <img 
                                src={img} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                loading="lazy" 
                                alt="Post content"
                            />
                            {count > 4 && i === 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                                    +{count - 4}
                                </div>
                            )}
                        </div>
                     );
                })}
            </div>
        );
    };

    if (post.type === 'repost') {
        return (
            <div className="p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer" onClick={onClick} dir="rtl">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#71767b] text-xs font-bold">
                        <Repeat className="w-3 h-3"/>
                        <span onClick={(e) => handleUserClick(e, post.user?.uid)} className="hover:underline cursor-pointer">{post.user?.name} أعاد النشر</span>
                    </div>
                    {canDelete && (
                        <button 
                            className="text-gray-500 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-500/10"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="border border-[#2f3336] rounded-2xl p-3 mt-1 hover:bg-[#16181c] transition-colors">
                    <div className="flex gap-3">
                         <div className="shrink-0" onClick={(e) => handleUserClick(e, post.originalUser?.uid)}>
                            <img 
                                src={post.originalUser?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                                className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity" 
                            />
                        </div>
                        <div>
                             <div className="flex items-center gap-1 text-[14px]">
                                <span className="font-bold text-[#e7e9ea] hover:underline" onClick={(e) => handleUserClick(e, post.originalUser?.uid)}>{post.originalUser?.name}</span>
                                {renderBadge(post.originalUser)}
                                <span className="text-[#71767b] dir-ltr text-sm" dir="ltr">{post.originalUser?.handle}</span>
                            </div>
                            <div className="text-[14px] text-[#e7e9ea] mt-1">
                                {highlightText(post.originalContent || '')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`flex gap-3 p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer ${post.isPinned ? 'bg-[#16181c]/50' : ''} font-sans`}
            onClick={onClick}
            dir="rtl"
        >
            <div className="shrink-0" onClick={(e) => handleUserClick(e, post.user?.uid)}>
                <img 
                    src={post.user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                    className="w-11 h-11 rounded-full object-cover border border-[#2f3336] hover:opacity-80 transition-opacity" 
                    alt={post.user?.name} 
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[#71767b] text-[15px] leading-tight mb-1">
                    <div className="flex items-center gap-1 overflow-hidden">
                        {post.isPinned && <Pin className="w-3 h-3 text-[#71767b] fill-current mr-1" />}
                        <span className="font-bold text-[#e7e9ea] truncate hover:underline" onClick={(e) => handleUserClick(e, post.user?.uid)}>{post.user?.name}</span>
                        {renderBadge(post.user)}
                        <span className="truncate ltr text-[#71767b] ml-1 text-sm" dir="ltr">{post.user?.handle}</span>
                        <span className="text-[#71767b] px-1">·</span>
                        <span className="text-[#71767b] text-sm hover:underline">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {canDelete && (
                            <button 
                                className="p-1.5 -mr-1 rounded-full text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                onClick={handleDelete}
                            >
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        )}
                        <button className="p-1 -mr-2 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="w-4 h-4"/>
                        </button>
                    </div>
                </div>

                <div className="text-[15px] text-[#e7e9ea] whitespace-pre-wrap leading-relaxed mt-0.5" style={{ wordBreak: 'break-word' }}>
                    {highlightText(displayContent || '')}
                </div>

                {youtubeId && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-[#2f3336] aspect-video w-full bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                )}

                {renderImages()}

                <div className="flex justify-between items-center mt-3 text-[#71767b] max-w-md">
                    <button className="flex items-center gap-1 group transition-colors hover:text-[#1d9bf0]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                            <MessageCircle className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{isFocusMode ? '' : formatNumber(post.replies || 0)}</span>
                    </button>

                    <button 
                        className={`flex items-center gap-1 group transition-colors ${retweeted ? 'text-[#00ba7c]' : 'hover:text-[#00ba7c]'}`}
                        onClick={handleRetweet}
                    >
                        <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 transition-colors">
                            <Repeat className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{isFocusMode ? '' : formatNumber(retweetCount)}</span>
                    </button>

                    <button 
                        className={`flex items-center gap-1 group transition-colors ${liked ? 'text-[#f91880]' : 'hover:text-[#f91880]'}`}
                        onClick={handleLike}
                    >
                        <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 transition-colors relative">
                            <Heart className={`w-4.5 h-4.5 transition-transform ${liked ? 'fill-current' : ''} ${isAnimating ? 'animate-bounce' : ''}`}/>
                        </div>
                        <span className="text-xs font-medium">{isFocusMode ? '' : formatNumber(likeCount)}</span>
                    </button>

                    <button className="flex items-center gap-1 group transition-colors hover:text-[#1d9bf0]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 transition-colors">
                            <BarChart2 className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{isFocusMode ? '' : (post.views || '0')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Bookmark className="w-4.5 h-4.5"/>
                        </button>
                        <button className="p-2 rounded-full hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 transition-colors" onClick={(e) => {
                            e.stopPropagation();
                            if(onShare) onShare('Share clicked');
                        }}>
                            <Share2 className="w-4.5 h-4.5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

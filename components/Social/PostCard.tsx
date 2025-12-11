
import React, { useState } from 'react';
import { 
    MessageCircle, Repeat, Heart, Share2, MoreHorizontal, 
    CheckCircle2, Crown, Pin, BarChart2, Bookmark, Trash2, X
} from 'lucide-react';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, db, deleteDoc } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils';
import { VerificationModal } from './VerificationModal';

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
    const [likeCount, setLikeCount] = useState(post?.likes || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const [retweeted, setRetweeted] = useState(false);
    const [retweetCount, setRetweetCount] = useState(post?.retweets || 0);

    // Modal State for Verification Info
    const [showVerifyInfo, setShowVerifyInfo] = useState(false);

    // Defensive check: If post is null or empty object, return nothing
    if (!post || Object.keys(post).length === 0) return null;
    
    // Ensure post.user exists and has default values if missing
    const postUser = post.user || {};
    const userName = postUser.name || 'Unknown User';
    const userHandle = postUser.handle || '@unknown';
    const userAvatar = postUser.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Unknown";
    // Fallback for UID to ensure clickable even if data is slightly malformed
    const userUid = postUser.uid || postUser.id || 'unknown';

    // Ensure uid exists before comparison
    const isOwner = user && userUid !== 'unknown' && user.id ? user.id === userUid : false;
    const canDelete = isAdmin || isOwner;

    // --- FOUNDER CHECK LOGIC ---
    const isFounder = userHandle === '@IpMurad' || userUid === 'admin-fixed-id';

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
            try {
                await deleteDoc(doc(db, 'posts', post.id));
            } catch (err) {
                console.error("Error deleting post:", err);
                alert("حدث خطأ أثناء الحذف.");
            }
        }
    };

    // --- CRITICAL FIX: PROFILE NAVIGATION HANDLER ---
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening post details
        if (onUserClick && userUid && userUid !== 'unknown') {
            onUserClick(userUid);
        }
    };

    const handleBadgeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowVerifyInfo(true);
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return; 

        const isNowLiked = !liked;
        setLiked(isNowLiked);
        setLikeCount((prev: number) => isNowLiked ? prev + 1 : prev - 1);
        
        if (isNowLiked) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
        }

        try {
            const postRef = doc(db, 'posts', post.id);
            await updateDoc(postRef, {
                likes: increment(isNowLiked ? 1 : -1)
            });
        } catch (err) {
            setLiked(!isNowLiked);
            setLikeCount((prev: number) => isNowLiked ? prev - 1 : prev + 1);
        }
    };

    const handleRetweet = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;
        if (retweeted) return;

        setRetweeted(true);
        setRetweetCount((prev: number) => prev + 1);

        try {
            await addDoc(collection(db, 'posts'), {
                type: 'repost',
                originalPostId: post.id,
                originalContent: post.content,
                originalUser: postUser,
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
            setRetweeted(false);
            setRetweetCount((prev: number) => prev - 1);
        }
    };

    const handleLightbox = (e: React.MouseEvent, img: string) => {
        e.stopPropagation();
        if (onOpenLightbox) onOpenLightbox(img);
    };

    const renderBadge = (u: any) => {
        if (!u) return null;
        if (u.isGold) return (
            <span onClick={handleBadgeClick} className="cursor-pointer hover:opacity-80 transition-opacity ml-1 inline-flex">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </span>
        );
        if (u.verified) return (
            <span onClick={handleBadgeClick} className="cursor-pointer hover:opacity-80 transition-opacity ml-1 inline-flex">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
            </span>
        );
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
        const originalUser = post.originalUser || { name: 'Unknown', handle: '@unknown', uid: 'unknown' };
        // Determine original user UID safely
        const origUid = originalUser.uid || originalUser.id || 'unknown';
        const isOriginalFounder = originalUser.handle === '@IpMurad' || origUid === 'admin-fixed-id';
        
        return (
            <>
            <div className="p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer" onClick={onClick} dir="rtl">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#71767b] text-xs font-bold">
                        <Repeat className="w-3 h-3"/>
                        <span onClick={handleProfileClick} className="hover:underline cursor-pointer">{userName} أعاد النشر</span>
                    </div>
                    {canDelete && (
                        <button className="text-gray-500 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-500/10" onClick={handleDelete}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="border border-[#2f3336] rounded-2xl p-3 mt-1 hover:bg-[#16181c] transition-colors">
                    <div className="flex gap-3">
                         <div className="shrink-0" onClick={(e) => { e.stopPropagation(); if (onUserClick && origUid !== 'unknown') onUserClick(origUid); }}>
                            <img src={originalUser.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity" />
                        </div>
                        <div>
                             <div className="flex items-center gap-1 text-[14px]">
                                <span className="font-bold text-[#e7e9ea] hover:underline" onClick={(e) => { e.stopPropagation(); if (onUserClick && origUid !== 'unknown') onUserClick(origUid); }}>{originalUser.name}</span>
                                {renderBadge(originalUser)}
                                {isOriginalFounder && (
                                    <span onClick={handleBadgeClick} className="flex items-center gap-1 px-2 py-0.5 mx-1 bg-yellow-500/10 border border-yellow-500/40 rounded-full cursor-pointer hover:bg-yellow-500/20 transition-colors">
                                        <span className="text-[10px] font-bold text-yellow-500 leading-none pb-0.5">
                                            حساب المؤسس الرسمي
                                        </span>
                                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 00-.556.834c-.045.722-1.133.722-1.178 0a1 1 0 00-.556-.834A3.989 3.989 0 017.333 15 3.989 3.989 0 015 13.97a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L10 4.323V3a1 1 0 011-1z" />
                                        </svg>
                                    </span>
                                )}
                                <span className="text-[#71767b] text-sm" dir="ltr">{originalUser.handle}</span>
                            </div>
                            <div className="text-[14px] text-[#e7e9ea] mt-1">
                                {highlightText(post.originalContent || '')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Render */}
            <VerificationModal 
                isOpen={showVerifyInfo} 
                onClose={() => setShowVerifyInfo(false)} 
                user={post.originalUser} // Use original user data for modal content
            />
            </>
        );
    }

    return (
        <>
        <div 
            className={`flex gap-3 p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer ${post.isPinned ? 'bg-[#16181c]/50' : ''} font-sans`}
            onClick={onClick}
            dir="rtl"
        >
            <div className="shrink-0" onClick={handleProfileClick}>
                <img 
                    src={userAvatar} 
                    className="w-11 h-11 rounded-full object-cover border border-[#2f3336] hover:opacity-80 transition-opacity" 
                    alt={userName} 
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[#71767b] text-[15px] leading-tight mb-1">
                    <div className="flex items-center gap-1 overflow-hidden">
                        {post.isPinned && <Pin className="w-3 h-3 text-[#71767b] fill-current mr-1" />}
                        <span className="font-bold text-[#e7e9ea] truncate hover:underline" onClick={handleProfileClick}>{userName}</span>
                        {renderBadge(postUser)}
                        {isFounder && (
                            <span onClick={handleBadgeClick} className="flex items-center gap-1 px-2 py-0.5 mx-1 bg-yellow-500/10 border border-yellow-500/40 rounded-full shrink-0 cursor-pointer hover:bg-yellow-500/20 transition-colors">
                                <span className="text-[10px] font-bold text-yellow-500 leading-none pb-0.5">
                                    حساب المؤسس الرسمي
                                </span>
                                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 00-.556.834c-.045.722-1.133.722-1.178 0a1 1 0 00-.556-.834A3.989 3.989 0 017.333 15 3.989 3.989 0 015 13.97a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L10 4.323V3a1 1 0 011-1z" />
                                </svg>
                            </span>
                        )}
                        <span className="truncate text-[#71767b] ml-1 text-sm" dir="ltr">{userHandle}</span>
                        <span className="text-[#71767b] px-1">·</span>
                        <span className="text-[#71767b] text-sm hover:underline">{formatRelativeTime(post.createdAt || post.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {canDelete && (
                            <button className="p-1.5 -mr-1 rounded-full text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors" onClick={handleDelete}>
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
            
            {/* Modal */}
            <VerificationModal 
                isOpen={showVerifyInfo} 
                onClose={() => setShowVerifyInfo(false)} 
                user={postUser} 
            />
        </div>
        </>
    );
};

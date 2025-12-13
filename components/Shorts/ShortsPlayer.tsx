
import React, { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, db } from '../../src/lib/firebase';
import { ShortsSidebar } from './ShortsSidebar';
import { Music } from 'lucide-react';

interface ShortsPlayerProps {
    post: any;
    isActive: boolean;
    onOpenComments?: (postId: string) => void;
    onUserClick?: (userId: string) => void;
    activeFilter?: string;
}

export const ShortsPlayer: React.FC<ShortsPlayerProps> = ({ post, isActive, onOpenComments, onUserClick, activeFilter = 'none' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user, followUser, unfollowUser } = useAuth();
    
    // --- LOCAL STATE ---
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Interaction State (Optimistic UI)
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Animation State (For double tap heart center screen)
    const [showBigHeart, setShowBigHeart] = useState(false);

    // --- DATA EXTRACTION ---
    const rawHandle = post.username || post.user?.username || post.user?.handle || 'user';
    const displayHandle = rawHandle.replace(/^@/, '');
    const creatorName = post.user?.name || displayHandle; 
    const creatorAvatar = post.user?.avatar || post.userPhoto || "https://api.dicebear.com/7.x/initials/svg?seed=User";
    const creatorId = post.user?.uid || post.userId || post.user?.id;
    const caption = post.content || post.caption || '';
    
    // Determine Media Type
    const isVideo = post.type === 'video' || (post.images && post.images.some((url: string) => url.includes('.mp4') || url.includes('.webm'))) || post.videoUrl;
    const mediaUrl = post.videoUrl || (post.images && post.images.length > 0 ? post.images[0] : post.image);

    // --- INITIALIZATION ---
    useEffect(() => {
        if (user) {
            const hasLiked = post.likedBy?.includes(user.id) || false;
            setIsLiked(hasLiked);
            const isFollowingUser = user.following?.includes(creatorId) || false;
            setIsFollowing(isFollowingUser);
        }
        setLikeCount(post.likes || 0);
    }, [user, post.id, creatorId]);

    // --- VIDEO CONTROL ---
    useEffect(() => {
        if (!isVideo) return; 
        if (isActive) {
            videoRef.current?.play().then(() => setIsPlaying(true)).catch(e => console.log("Autoplay blocked", e));
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
            if (videoRef.current) videoRef.current.currentTime = 0;
        }
    }, [isActive, isVideo]);

    const togglePlay = () => {
        if (!isVideo) return;
        if (isPlaying) {
            videoRef.current?.pause();
            setIsPlaying(false);
        } else {
            videoRef.current?.play();
            setIsPlaying(true);
        }
    };

    // --- INTERACTION HANDLERS ---
    const handleLike = async () => {
        if (!user) return alert("يرجى تسجيل الدخول للإعجاب");

        // 1. Optimistic Update
        const newStatus = !isLiked;
        setIsLiked(newStatus);
        setLikeCount((prev: number) => newStatus ? prev + 1 : prev - 1);

        // 2. Firebase Update
        const postRef = doc(db, 'posts', post.id);
        try {
            if (newStatus) {
                await updateDoc(postRef, { likes: increment(1), likedBy: arrayUnion(user.id) });
            } else {
                await updateDoc(postRef, { likes: increment(-1), likedBy: arrayRemove(user.id) });
            }
        } catch (error) {
            console.error("Like failed:", error);
            setIsLiked(!newStatus);
            setLikeCount((prev: number) => newStatus ? prev - 1 : prev + 1);
        }
    };

    const handleDoubleTap = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLiked) handleLike();
        setShowBigHeart(true);
        setTimeout(() => setShowBigHeart(false), 800);
    };

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert("يرجى تسجيل الدخول للمتابعة");
        if (user.id === creatorId) return; 

        const newStatus = !isFollowing;
        setIsFollowing(newStatus);

        try {
            if (newStatus) await followUser(creatorId);
            else await unfollowUser(creatorId);
        } catch (error) {
            console.error("Follow failed:", error);
            setIsFollowing(!newStatus);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: `شاهد هذا المنشور من @${displayHandle} على ميلاف`,
            text: caption,
            url: window.location.href 
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (err) {}
        } else {
            navigator.clipboard.writeText(shareData.url);
            alert("تم نسخ الرابط للحافظة!");
        }
    };

    const handleComments = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onOpenComments) onOpenComments(post.id);
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onUserClick && creatorId) onUserClick(creatorId);
    };

    const getFilterStyle = (): React.CSSProperties => {
        switch(activeFilter) {
            case 'pale': return { filter: 'sepia(20%) contrast(85%) brightness(110%)' };
            case 'vibrant': return { filter: 'saturate(150%) contrast(110%)' };
            case 'bnw': return { filter: 'grayscale(100%)' };
            default: return {};
        }
    };

    // --- RENDER ---
    if (!mediaUrl) return <div className="h-full w-full bg-black flex items-center justify-center text-white">No Media</div>;

    return (
        <div className="relative h-full w-full snap-start shrink-0 bg-black overflow-hidden select-none">
            
            {/* 1. Media Layer */}
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={mediaUrl}
                    className="h-full w-full object-cover cursor-pointer"
                    style={getFilterStyle()}
                    loop
                    playsInline
                    preload="metadata"
                    onClick={togglePlay}
                    onDoubleClick={handleDoubleTap}
                />
            ) : (
                <div className="relative w-full h-full cursor-pointer" onDoubleClick={handleDoubleTap}>
                    <div 
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                        style={{ backgroundImage: `url(${mediaUrl})`, ...getFilterStyle() }}
                    ></div>
                    <img 
                        src={mediaUrl} 
                        className="absolute inset-0 w-full h-full object-contain z-10"
                        style={getFilterStyle()}
                        alt="Post Content"
                    />
                </div>
            )}

            {/* Play Icon Overlay */}
            {isVideo && !isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm animate-pulse">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* Big Heart Animation (Center) */}
            {showBigHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32 text-red-600 drop-shadow-2xl animate-ping-once">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <style>{`
                        @keyframes pingOnce {
                            0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
                            50% { transform: scale(1.2) rotate(-15deg); opacity: 1; }
                            100% { transform: scale(1) rotate(-15deg); opacity: 0; }
                        }
                        .animate-ping-once { animation: pingOnce 0.8s cubic-bezier(0, 0, 0.2, 1) forwards; }
                    `}</style>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none z-10"></div>

            {/* 3. NEW RIGHT SIDEBAR (Custom Icons) */}
            <ShortsSidebar 
                creatorId={creatorId}
                creatorAvatar={creatorAvatar}
                creatorName={creatorName}
                isFollowing={isFollowing}
                isLiked={isLiked}
                likeCount={likeCount}
                commentCount={post.replies || 0}
                onLike={handleLike}
                onComment={handleComments}
                onShare={handleShare}
                onFollow={handleFollow}
                onProfileClick={handleProfileClick}
                isPlaying={isPlaying}
            />

            {/* 4. CREATOR INFO OVERLAY (Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-full p-4 pb-6 z-30 text-white pointer-events-none">
                <div className="flex flex-col items-start max-w-[75%] pointer-events-auto text-right" dir="rtl">
                    <div onClick={handleProfileClick} className="cursor-pointer mb-3 flex items-center gap-2 group">
                        <h3 className="text-white font-bold text-sm drop-shadow-md break-words whitespace-normal leading-tight group-hover:underline">
                            @{displayHandle}
                        </h3>
                        {post.user?.verified && <div className="bg-blue-500 rounded-full p-0.5"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                    </div>
                    <p className="text-sm font-light leading-relaxed mb-4 line-clamp-2 drop-shadow-md dir-rtl">{caption}</p>
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 w-fit max-w-full">
                        <Music className="w-3 h-3 animate-spin-slow shrink-0"/>
                        <div className="overflow-hidden whitespace-nowrap mask-linear-fade">
                            <span className="inline-block animate-marquee pl-4">الصوت الأصلي - {creatorName} • Original Sound</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

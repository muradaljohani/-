
import React, { useRef, useState, useEffect } from 'react';
import { Music, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ShortsSidebar } from './ShortsSidebar';
import { FloatingHeart } from './FloatingHeart';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, db } from '../../src/lib/firebase';

interface ShortsPlayerProps {
    post: any;
    isActive: boolean;
    onOpenComments?: (postId: string) => void;
    onUserClick?: (userId: string) => void;
    activeFilter?: string;
}

export const ShortsPlayer: React.FC<ShortsPlayerProps> = ({ post, isActive, onOpenComments, onUserClick, activeFilter = 'none' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user, followUser } = useAuth();
    
    // --- STATE ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [floatingHearts, setFloatingHearts] = useState<{id: number, x: number, y: number}[]>([]);
    
    // --- DATA EXTRACTION ---
    const rawHandle = post.username || post.user?.username || post.user?.handle || 'user';
    const displayHandle = rawHandle.replace(/^@/, '');
    const creatorName = post.user?.name || displayHandle; 
    const creatorId = post.user?.uid || post.userId || post.user?.id;
    const caption = post.content || post.caption || '';
    
    // Determine Media Type
    const isVideo = post.type === 'video' || (post.images && post.images.some((url: string) => url.includes('.mp4') || url.includes('.webm'))) || post.videoUrl;
    const mediaUrl = post.videoUrl || (post.images && post.images.length > 0 ? post.images[0] : post.image);

    // Initialize states
    const isFollowing = user?.following?.includes(creatorId);

    useEffect(() => {
        setIsLiked(post.likedBy?.includes(user?.id) || false);
        setLikeCount(post.likes || 0);
    }, [post.id, user?.id]);

    // --- VIDEO CONTROL ---
    useEffect(() => {
        if (!isVideo) return; 

        if (isActive) {
            // Check if user has interacted with document, otherwise mute or handle promise
            videoRef.current?.play().then(() => setIsPlaying(true)).catch(e => {
                console.log("Autoplay blocked, waiting for interaction", e);
                setIsPlaying(false);
            });
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

    // --- LIKE LOGIC ---
    const handleLike = async (forceLike: boolean = false) => {
        if (!user) return alert("يرجى تسجيل الدخول للإعجاب");

        // If forceLike is true, we only action if not already liked
        if (forceLike && isLiked) return;

        const newStatus = forceLike ? true : !isLiked;
        
        // Optimistic Update
        setIsLiked(newStatus);
        setLikeCount(prev => newStatus ? prev + 1 : prev - 1);

        const postRef = doc(db, 'posts', post.id);
        try {
            if (newStatus) {
                await updateDoc(postRef, { likes: increment(1), likedBy: arrayUnion(user.id) });
            } else {
                await updateDoc(postRef, { likes: increment(-1), likedBy: arrayRemove(user.id) });
            }
        } catch (error) {
            console.error("Like failed", error);
            // Revert
            setIsLiked(!newStatus);
            setLikeCount(prev => newStatus ? prev - 1 : prev + 1);
        }
    };

    // --- FOLLOW LOGIC ---
    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert("سجل دخول للمتابعة");
        try {
            await followUser(creatorId);
        } catch (error) {
            console.error(error);
        }
    };

    // --- DOUBLE TAP LOGIC ---
    const lastClickTime = useRef<number>(0);
    const clickTimeout = useRef<any>(null);

    const handleContainerClick = (e: React.MouseEvent) => {
        const now = Date.now();
        const timeDiff = now - lastClickTime.current;
        
        if (timeDiff < 300) {
            // --- DOUBLE TAP DETECTED ---
            if (clickTimeout.current) clearTimeout(clickTimeout.current);
            
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setFloatingHearts(prev => [...prev, { id: now, x, y }]);
            handleLike(true);
            
        } else {
            // --- SINGLE TAP (WAIT) ---
            clickTimeout.current = setTimeout(() => {
                if (isVideo) togglePlay();
            }, 300);
        }

        lastClickTime.current = now;
    };

    const removeFloatingHeart = (id: number) => {
        setFloatingHearts(prev => prev.filter(h => h.id !== id));
    };

    // --- NAVIGATION LOGIC ---
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (onUserClick && creatorId) {
            onUserClick(creatorId);
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
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share canceled");
            }
        } else {
            navigator.clipboard.writeText(shareData.url);
            alert("تم نسخ الرابط للحافظة!");
        }
    };

    const getFilterStyle = (): React.CSSProperties => {
        switch(activeFilter) {
            case 'pale': return { filter: 'sepia(20%) contrast(85%) brightness(110%)' };
            case 'vibrant': return { filter: 'saturate(150%) contrast(110%)' };
            case 'bnw': return { filter: 'grayscale(100%)' };
            default: return {};
        }
    };

    if (!mediaUrl) return <div className="h-full w-full bg-black flex items-center justify-center text-white">No Media</div>;

    return (
        <div 
            className="relative h-full w-full snap-start shrink-0 bg-black overflow-hidden select-none touch-manipulation"
            onClick={handleContainerClick}
        >
            
            {/* FLOATING HEARTS LAYER */}
            {floatingHearts.map(heart => (
                <FloatingHeart 
                    key={heart.id} 
                    x={heart.x} 
                    y={heart.y} 
                    onComplete={() => removeFloatingHeart(heart.id)} 
                />
            ))}

            {/* 1. Media Layer */}
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={mediaUrl}
                    className="h-full w-full object-cover pointer-events-none" 
                    style={getFilterStyle()}
                    loop
                    playsInline
                    preload="metadata"
                />
            ) : (
                <div className="relative w-full h-full pointer-events-none">
                    <div 
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                        style={{ 
                            backgroundImage: `url(${mediaUrl})`,
                            ...getFilterStyle() 
                        }}
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

            {/* 2. Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none z-10"></div>

            {/* 3. Right Sidebar (Custom Icons) */}
            <ShortsSidebar 
                post={post}
                onOpenComments={onOpenComments}
                onUserClick={onUserClick}
                handleShare={handleShare}
                isLiked={isLiked}
                likeCount={likeCount}
                onLike={(e) => handleLike(false)}
            />

            {/* 4. CREATOR INFO OVERLAY (Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-full p-4 pb-6 z-30 text-white pointer-events-none">
                <div className="flex flex-col items-start max-w-[75%] pointer-events-auto text-right" dir="rtl">
                    
                    {/* Row 1: Identity & Follow */}
                    <div className="mb-3 flex items-center gap-3">
                        <div onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer group">
                             <h3 className="text-white font-bold text-sm drop-shadow-md break-words whitespace-normal leading-tight group-hover:underline">
                                @{displayHandle}
                             </h3>
                             {post.user?.verified && <div className="bg-blue-500 rounded-full p-0.5"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                        </div>
                        
                        {!isFollowing && user?.id !== creatorId && (
                            <button 
                                onClick={handleFollow}
                                className="mr-2 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full hover:bg-gray-200 transition-all opacity-90 hover:opacity-100"
                            >
                                متابعة
                            </button>
                        )}
                    </div>
                    
                    {/* Row 2: Caption */}
                    <p className="text-sm font-light leading-relaxed mb-4 line-clamp-2 drop-shadow-md dir-rtl">
                        {caption}
                    </p>

                    {/* Row 3: Audio */}
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 w-fit max-w-full">
                        <Music className="w-3 h-3 animate-spin-slow shrink-0"/>
                        <div className="overflow-hidden whitespace-nowrap mask-linear-fade">
                            <span className="inline-block animate-marquee pl-4">
                                الصوت الأصلي - {creatorName} • Original Sound
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

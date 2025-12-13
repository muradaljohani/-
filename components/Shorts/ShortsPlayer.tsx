
import React, { useRef, useState, useEffect } from 'react';
import { Music, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ShortsSidebar } from './ShortsSidebar';

interface ShortsPlayerProps {
    post: any;
    isActive: boolean;
    onOpenComments?: (postId: string) => void;
    onUserClick?: (userId: string) => void;
    activeFilter?: string;
}

export const ShortsPlayer: React.FC<ShortsPlayerProps> = ({ post, isActive, onOpenComments, onUserClick, activeFilter = 'none' }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user } = useAuth();
    
    // --- STATE ---
    const [isPlaying, setIsPlaying] = useState(false);
    
    // --- DATA EXTRACTION ---
    // Handle Priority: post.username > post.user.username > post.user.handle > 'user'
    const rawHandle = post.username || post.user?.username || post.user?.handle || 'user';
    const displayHandle = rawHandle.replace(/^@/, '');
    
    const creatorName = post.user?.name || displayHandle; 
    const creatorId = post.user?.uid || post.userId || post.user?.id;
    const caption = post.content || post.caption || '';
    
    // Determine Media Type
    const isVideo = post.type === 'video' || (post.images && post.images.some((url: string) => url.includes('.mp4') || url.includes('.webm'))) || post.videoUrl;
    const mediaUrl = post.videoUrl || (post.images && post.images.length > 0 ? post.images[0] : post.image);

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

    // --- CRITICAL: NAVIGATION LOGIC ---
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent video pause
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

    // --- FILTER STYLES ---
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
                    onDoubleClick={(e) => e.stopPropagation()} // Could implement double tap like here later
                />
            ) : (
                <div className="relative w-full h-full cursor-pointer">
                    {/* Blurred Background */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                        style={{ 
                            backgroundImage: `url(${mediaUrl})`,
                            ...getFilterStyle() 
                        }}
                    ></div>
                    {/* Main Image */}
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
            />

            {/* 4. CREATOR INFO OVERLAY (Bottom Left) */}
            <div className="absolute bottom-0 left-0 w-full p-4 pb-6 z-30 text-white pointer-events-none">
                <div className="flex flex-col items-start max-w-[75%] pointer-events-auto text-right" dir="rtl">
                    
                    {/* Row 1: Identity */}
                    <div 
                        onClick={handleProfileClick} 
                        className="cursor-pointer mb-3 flex items-center gap-2 group"
                    >
                        <h3 className="text-white font-bold text-sm drop-shadow-md break-words whitespace-normal leading-tight group-hover:underline">
                            @{displayHandle}
                        </h3>
                        {post.user?.verified && <div className="bg-blue-500 rounded-full p-0.5"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
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

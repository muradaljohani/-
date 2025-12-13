
import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove, increment, db } from '../../src/lib/firebase';

interface ShortsSidebarProps {
    post: any;
    onOpenComments?: (postId: string) => void;
    onUserClick?: (userId: string) => void;
    handleShare: (e: React.MouseEvent) => void;
}

export const ShortsSidebar: React.FC<ShortsSidebarProps> = ({ post, onOpenComments, onUserClick, handleShare }) => {
    const { user, followUser, unfollowUser } = useAuth();
    
    // --- STATE ---
    const [isLiked, setIsLiked] = useState(post.likedBy?.includes(user?.id) || false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isAnimatingLike, setIsAnimatingLike] = useState(false);

    // Data Extraction
    const creatorAvatar = post.user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User";
    const creatorId = post.user?.uid || post.userId;

    // --- HANDLERS ---
    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert("يرجى تسجيل الدخول للإعجاب");

        const newStatus = !isLiked;
        setIsLiked(newStatus);
        setLikeCount((prev: number) => newStatus ? prev + 1 : prev - 1);
        
        // Trigger Bounce Animation
        setIsAnimatingLike(true);
        setTimeout(() => setIsAnimatingLike(false), 600);

        const postRef = doc(db, 'posts', post.id);
        try {
            if (newStatus) {
                await updateDoc(postRef, { likes: increment(1), likedBy: arrayUnion(user.id) });
            } else {
                await updateDoc(postRef, { likes: increment(-1), likedBy: arrayRemove(user.id) });
            }
        } catch (error) {
            console.error("Like failed", error);
            setIsLiked(!newStatus);
            setLikeCount((prev: number) => newStatus ? prev - 1 : prev + 1);
        }
    };

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert("سجل دخول للمتابعة");
        const newStatus = !isFollowing;
        setIsFollowing(newStatus);
        try {
            newStatus ? await followUser(creatorId) : await unfollowUser(creatorId);
        } catch(e) { setIsFollowing(!newStatus); }
    };

    return (
        <div className="absolute bottom-20 right-2 z-40 flex flex-col items-center gap-6 pb-4 w-[60px]">
            
            {/* 1. CREATOR AVATAR (Spinning Record Style) */}
            <div className="relative mb-2 cursor-pointer group" onClick={(e) => { e.stopPropagation(); onUserClick && onUserClick(creatorId); }}>
                <div className="w-12 h-12 rounded-full border-[2px] border-white p-[1px] bg-black overflow-hidden relative shadow-lg">
                    <img 
                        src={creatorAvatar} 
                        className="w-full h-full rounded-full object-cover animate-[spin_8s_linear_infinite]"
                        alt="Creator"
                    />
                </div>
                {!isFollowing && user?.id !== creatorId && (
                    <div 
                        onClick={handleFollow}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF0050] rounded-full p-0.5 cursor-pointer hover:scale-110 transition-transform shadow-md border border-white"
                    >
                        <Plus className="w-3 h-3 text-white stroke-[4]"/>
                    </div>
                )}
                 {isFollowing && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-0.5 shadow-md">
                        <CheckCircle2 className="w-3 h-3 text-[#FF0050]"/>
                    </div>
                )}
            </div>

            {/* 2. THE 'M-HEART' (Melaf Branded Like) */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleLike}>
                <div className={`transition-transform duration-300 ${isAnimatingLike ? 'scale-125' : 'group-hover:scale-110'}`}>
                    <svg 
                        width="36" 
                        height="36" 
                        viewBox="0 0 24 24" 
                        className={`drop-shadow-lg ${isLiked ? 'filter drop-shadow-[0_0_8px_rgba(255,0,80,0.6)]' : ''}`}
                    >
                         {/* Custom 'M' Heart Path */}
                         <path 
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill={isLiked ? "#FF0050" : "transparent"}
                            stroke={isLiked ? "none" : "white"}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                         />
                    </svg>
                </div>
                <span className="text-white text-xs font-black shadow-black drop-shadow-md">{likeCount}</span>
            </div>

            {/* 3. THE 'M-CHAT' (Melaf Branded Comment) */}
            <div 
                className="flex flex-col items-center gap-1 cursor-pointer group" 
                onClick={(e) => { e.stopPropagation(); onOpenComments && onOpenComments(post.id); }}
            >
                <div className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                    <svg width="34" height="34" viewBox="0 0 24 24" className="drop-shadow-lg">
                        {/* Chat Bubble with 'M' dip at top */}
                        <path 
                            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                            fill="white"
                            fillOpacity={0.9}
                            stroke="white"
                            strokeWidth={1}
                        />
                        {/* 3 Dots inside */}
                        <circle cx="8" cy="12" r="1.5" fill="#0f172a" />
                        <circle cx="12" cy="12" r="1.5" fill="#0f172a" />
                        <circle cx="16" cy="12" r="1.5" fill="#0f172a" />
                    </svg>
                </div>
                <span className="text-white text-xs font-black shadow-black drop-shadow-md">{post.replies || 0}</span>
            </div>

            {/* 4. THE 'M-SHARE' (Melaf Branded Share) */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleShare}>
                <div className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <svg width="34" height="34" viewBox="0 0 24 24" className="drop-shadow-lg" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* Sharp Angular Arrow (M-Leg Style) */}
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" fillOpacity={0.2} />
                    </svg>
                </div>
                <span className="text-white text-xs font-black shadow-black drop-shadow-md">Share</span>
            </div>

            {/* Music Disc (Rotating) */}
            <div className="mt-4 relative cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border-[3px] border-[#2f2f2f] flex items-center justify-center overflow-hidden animate-[spin_5s_linear_infinite] group-hover:animate-none">
                    <img src={creatorAvatar} className="w-6 h-6 rounded-full object-cover opacity-80"/>
                </div>
                
                {/* Floating Music Notes */}
                <div className="absolute -top-4 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white" className="animate-bounce">
                        <path d="M9 18V5l12-2v13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="6" cy="18" r="3" fill="white"/>
                        <circle cx="18" cy="16" r="3" fill="white"/>
                    </svg>
                </div>
            </div>

        </div>
    );
};

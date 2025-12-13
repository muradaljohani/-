
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Music, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    creatorId: string;
    creatorAvatar: string;
    creatorName: string; // Used for alt text or fallback
    isFollowing: boolean;
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
    shareCount?: number;
    onLike: (e: React.MouseEvent) => void;
    onComment: (e: React.MouseEvent) => void;
    onShare: (e: React.MouseEvent) => void;
    onFollow: (e: React.MouseEvent) => void;
    onProfileClick: (e: React.MouseEvent) => void;
    isPlaying: boolean;
}

// --- CUSTOM ICON COMPONENTS ---

const MHeartIcon = ({ isLiked }: { isLiked: boolean }) => (
    <motion.svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={false}
        animate={isLiked ? "liked" : "idle"}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
    >
        {/* The "M" Heart Shape */}
        <motion.path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.5 4.5 3 7.5 3c1.5 0 3 .5 4.5 2 1.5-1.5 3-2 4.5-2 3 0 5.5 2.5 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke={isLiked ? "#FF0050" : "white"}
            strokeWidth={2}
            variants={{
                idle: { fill: "transparent", scale: 1 },
                liked: { fill: "#FF0050", scale: 1.1, stroke: "#FF0050" }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
        {isLiked && (
            <motion.path
                d="M12 6 C12 6 9 8 7 8 M12 6 C12 6 15 8 17 8" // Inner "M" Accent
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
            />
        )}
    </motion.svg>
);

const MChatIcon = () => (
    <motion.svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
    >
        {/* Bubble with "M" dip on top */}
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="rgba(255,255,255,0.1)" />
        {/* "M" stylized detail inside */}
        <path d="M8 10l4 3 4-3" stroke="white" strokeWidth="1.5" />
    </motion.svg>
);

const MShareIcon = () => (
    <motion.svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        whileTap={{ x: 5, y: -5 }}
        style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
    >
        {/* Paper Plane / M-Legs Hybrid */}
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="rgba(255,255,255,0.1)"/>
    </motion.svg>
);

export const ShortsSidebar: React.FC<Props> = ({
    creatorId,
    creatorAvatar,
    creatorName,
    isFollowing,
    isLiked,
    likeCount,
    commentCount,
    onLike,
    onComment,
    onShare,
    onFollow,
    onProfileClick,
    isPlaying
}) => {
    const { user } = useAuth();
    const isOwner = user?.id === creatorId;

    return (
        <div className="absolute bottom-24 right-2 z-40 flex flex-col items-center gap-6 pb-4 pointer-events-auto">
            
            {/* 1. Avatar & Follow */}
            <div className="relative mb-2 cursor-pointer group" onClick={onProfileClick}>
                <div className="w-12 h-12 rounded-full border-2 border-white p-[1px] hover:scale-105 transition-transform bg-black overflow-hidden relative">
                    <img 
                        src={creatorAvatar} 
                        className="w-full h-full rounded-full object-cover"
                        alt={creatorName}
                    />
                </div>
                
                {/* Follow Plus Button (M-Styled) */}
                {!isFollowing && !isOwner && (
                    <motion.div 
                        onClick={onFollow}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileTap={{ scale: 0.8 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF0050] rounded-full p-0.5 cursor-pointer shadow-md border border-white flex items-center justify-center w-5 h-5"
                    >
                        <Plus className="w-3 h-3 text-white stroke-[4]"/>
                    </motion.div>
                )}
                 {isFollowing && !isOwner && (
                    <div 
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-0.5 shadow-sm w-5 h-5 flex items-center justify-center"
                    >
                        <CheckCircle2 className="w-3 h-3 text-[#FF0050]"/>
                    </div>
                )}
            </div>

            {/* 2. Like (M-Heart) */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onLike}>
                <div className="relative">
                    <MHeartIcon isLiked={isLiked} />
                    {isLiked && (
                         <motion.div 
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-[#FF0050] rounded-full blur-lg opacity-50 z-[-1]"
                         />
                    )}
                </div>
                <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{likeCount}</span>
            </div>

            {/* 3. Comment (M-Chat) */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onComment}>
                <MChatIcon />
                <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{commentCount}</span>
            </div>

            {/* 4. Share (M-Share) */}
            <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onShare}>
                <MShareIcon />
                <span className="text-white text-xs font-bold shadow-black drop-shadow-md">Share</span>
            </div>

            {/* 5. Music Disc (Spinning) */}
            <div className="mt-4 relative" onClick={onProfileClick}>
                <div className={`w-10 h-10 rounded-full bg-[#1a1a1a] border-[3px] border-[#222] flex items-center justify-center overflow-hidden ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                    <img src={creatorAvatar} className="w-full h-full object-cover opacity-70 scale-75 rounded-full"/>
                </div>
                <div className="absolute -right-2 bottom-0">
                    <Music className="w-4 h-4 text-white drop-shadow-md animate-bounce" />
                </div>
            </div>
        </div>
    );
};


import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, UserPlus, Play, Pause } from 'lucide-react';
import { reels, Reel } from '../../dummyData';

interface ReelItemProps {
    reel: Reel;
    isActive: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ reel, isActive }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="h-full w-full snap-start relative flex items-center justify-center bg-gray-900 border-b border-gray-800/20">
            {/* Video Player */}
            <video
                ref={videoRef}
                src={reel.url}
                className="h-full w-full object-cover md:rounded-xl cursor-pointer"
                loop
                playsInline
                onClick={togglePlay}
            />

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                    <Play className="w-16 h-16 text-white/80 fill-white/80 animate-pulse"/>
                </div>
            )}

            {/* Right Sidebar Actions */}
            <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6 z-20">
                <div className="relative group">
                    <img src={reel.user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-lg" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-0.5 cursor-pointer">
                        <UserPlus className="w-3 h-3 text-white"/>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setLiked(!liked)}>
                    <Heart className={`w-8 h-8 ${liked ? 'fill-red-500 text-red-500' : 'text-white'} drop-shadow-md transition-all active:scale-125`} />
                    <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{reel.likes + (liked ? 1 : 0)}</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <MessageCircle className="w-8 h-8 text-white drop-shadow-md" />
                    <span className="text-white text-xs font-bold shadow-black drop-shadow-md">{reel.comments}</span>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <Share2 className="w-8 h-8 text-white drop-shadow-md" />
                    <span className="text-white text-xs font-bold shadow-black drop-shadow-md">Share</span>
                </div>

                 <div className="w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-900 overflow-hidden animate-[spin_5s_linear_infinite]">
                    <img src={reel.user.avatar} className="w-full h-full object-cover opacity-70"/>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-16 z-20 text-left text-white">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm shadow-black drop-shadow-md">@{reel.user.handle.replace('@','')}</h3>
                    {reel.user.verified && <span className="bg-blue-500 rounded-full p-0.5"><div className="w-2 h-2 bg-white rounded-full"></div></span>}
                </div>
                <p className="text-sm mb-3 shadow-black drop-shadow-md">{reel.caption}</p>
                <div className="flex items-center gap-2 text-xs font-bold">
                    <Music className="w-3 h-3 animate-pulse"/>
                    <span className="marquee">{reel.song}</span>
                </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"></div>
        </div>
    );
};

export const ReelsFeed: React.FC = () => {
    const [currentReelIndex, setCurrentReelIndex] = useState(0);

    return (
        <div className="h-full w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative rounded-xl">
            {reels.map((reel, index) => (
                <ReelItem key={reel.id} reel={reel} isActive={index === currentReelIndex} />
            ))}
        </div>
    );
};

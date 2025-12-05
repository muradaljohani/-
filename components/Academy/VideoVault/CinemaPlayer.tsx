
import React from 'react';
import { X, Share2, ThumbsUp, Flag } from 'lucide-react';
import { VaultVideo } from '../../../services/Academy/VideoVault/VideoAggregator';

interface Props {
    video: VaultVideo;
    onClose: () => void;
}

export const CinemaPlayer: React.FC<Props> = ({ video, onClose }) => {
    // In real scenario, extract real ID. Here we mock for stability.
    const videoId = "PkZNo7MFNFg"; // Default FreeCodeCamp placeholder

    return (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="text-white">
                    <h2 className="text-lg font-bold">{video.title}</h2>
                    <p className="text-xs text-gray-400">{video.channel}</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <X className="w-6 h-6"/>
                </button>
            </div>

            {/* The Embed */}
            <div className="w-full max-w-5xl aspect-video bg-black shadow-2xl relative border border-white/10 rounded-xl overflow-hidden">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                    title="Murad Video Vault"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0"
                ></iframe>
            </div>

            {/* Controls */}
            <div className="w-full max-w-5xl mt-6 flex justify-between items-center px-4">
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <ThumbsUp className="w-5 h-5"/> <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5"/> <span className="text-sm">Share</span>
                    </button>
                </div>
                <button className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-xs">
                    <Flag className="w-4 h-4"/> Report
                </button>
            </div>
        </div>
    );
};

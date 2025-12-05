import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Search, Zap } from 'lucide-react';
import { VideoAggregator, VaultVideo } from '../../../services/Academy/VideoVault/VideoAggregator';
import { CinemaPlayer } from './CinemaPlayer';

interface VideoCardProps {
    video: VaultVideo;
    onSelect: (video: VaultVideo) => void;
    className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect, className = "" }) => (
    <div 
        onClick={() => onSelect(video)}
        className={`group relative aspect-video shrink-0 bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 shadow-lg border border-white/5 ${className}`}
    >
        <img src={video.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div className="mb-2">
                <button className="bg-red-600 text-white p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Play className="w-5 h-5 fill-white"/>
                </button>
            </div>
            <h4 className="text-white font-bold text-sm line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform delay-75">{video.title}</h4>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-300 translate-y-4 group-hover:translate-y-0 transition-transform delay-100">
                <span className="text-emerald-400 font-bold">98% Match</span>
                <span>{video.duration}</span>
                <span className="border border-white/20 px-1 rounded">HD</span>
            </div>
        </div>
        
        {/* Default Badge */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono group-hover:opacity-0 transition-opacity">
            {video.channel}
        </div>
    </div>
);

export const VideoGallery: React.FC = () => {
    const aggregator = VideoAggregator.getInstance();
    const [search, setSearch] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<VaultVideo | null>(null);
    const [rows, setRows] = useState<{title: string, videos: VaultVideo[]}[]>([]);

    useEffect(() => {
        // Initialize Rows (Netflix Style)
        const categories = ['Programming', 'Business', 'Science & Math', 'General Knowledge'];
        const data = categories.map(cat => ({
            title: cat,
            videos: aggregator.getByCategory(cat).slice(0, 20) // Top 20 per row
        }));
        setRows(data);
    }, []);

    const filtered = search ? aggregator.search(search).slice(0, 50) : [];

    return (
        <div className="min-h-screen bg-[#0b1120] text-white pb-20 font-sans" dir="rtl">
            {/* Search Bar */}
            <div className="sticky top-0 z-30 bg-[#0b1120]/95 backdrop-blur-xl border-b border-white/10 p-4">
                <div className="max-w-4xl mx-auto relative group">
                    <div className="absolute inset-0 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-600/30 transition-colors"></div>
                    <div className="relative flex items-center bg-[#1e293b] border border-white/10 rounded-full px-6 py-3 shadow-2xl">
                        <Search className="w-5 h-5 text-gray-400 ml-4"/>
                        <input 
                            type="text" 
                            placeholder="ابحث في المكتبة المليونية (Python, Marketing, Physics...)" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent w-full outline-none text-white placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 space-y-12">
                {search ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filtered.map(v => <VideoCard key={v.id} video={v} onSelect={setSelectedVideo} className="w-full" />)}
                    </div>
                ) : (
                    rows.map((row, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 px-2 border-r-4 border-red-600 mr-2">
                                {row.title}
                            </h3>
                            <div className="relative group/slider">
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 px-2 snap-x">
                                    {row.videos.map(v => (
                                        <div key={v.id} className="snap-start">
                                            <VideoCard video={v} onSelect={setSelectedVideo} className="w-64 md:w-80" />
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute top-0 right-0 bottom-8 w-20 bg-gradient-to-l from-[#0b1120] to-transparent pointer-events-none"></div>
                                <div className="absolute top-0 left-0 bottom-8 w-20 bg-gradient-to-r from-[#0b1120] to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedVideo && <CinemaPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
        </div>
    );
};
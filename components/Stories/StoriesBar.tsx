
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StoryEngine } from '../../services/Stories/StoryEngine';
import { StoryCreator } from './StoryCreator';
import { StoryViewer } from './StoryViewer';

export const StoriesBar: React.FC = () => {
    const { user } = useAuth();
    const engine = StoryEngine.getInstance();
    
    // State
    const [feed, setFeed] = useState<any[]>([]);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [startUserIndex, setStartUserIndex] = useState(0);

    useEffect(() => {
        // Initial Fetch
        setFeed(engine.getStoryFeed(user));
        
        // Polling for updates (Simulated Real-time)
        const interval = setInterval(() => {
            setFeed(engine.getStoryFeed(user));
        }, 5000);
        return () => clearInterval(interval);
    }, [user, isCreatorOpen, viewerOpen]); // Refresh when modals close

    const handleStoryClick = (index: number) => {
        setStartUserIndex(index);
        setViewerOpen(true);
    };

    return (
        <div className="bg-white border-b border-gray-100 py-3 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-max">
                
                {/* My Story / Create Button */}
                <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setIsCreatorOpen(true)}>
                    <div className="relative w-16 h-16">
                        <div className="w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-gray-300">
                            <img 
                                src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Guest"} 
                                className="w-full h-full rounded-full object-cover opacity-80"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white">
                            <Plus className="w-3 h-3"/>
                        </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">قصتك</span>
                </div>

                {/* Feed Items */}
                {feed.map((item, idx) => (
                    <div 
                        key={item.userId} 
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                        onClick={() => handleStoryClick(idx)}
                    >
                        <div className={`w-16 h-16 rounded-full p-[2px] ${
                            item.isBoosted ? 'bg-gradient-to-tr from-yellow-400 to-amber-600' :
                            item.hasUnwatched ? 'bg-gradient-to-tr from-blue-500 to-purple-500' : 
                            'bg-gray-200'
                        }`}>
                            <div className="w-full h-full bg-white rounded-full p-0.5">
                                <img src={item.userAvatar} className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-95"/>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-600 font-medium max-w-[64px] truncate">{item.userName}</span>
                    </div>
                ))}
            </div>

            <StoryCreator isOpen={isCreatorOpen} onClose={() => setIsCreatorOpen(false)} />
            
            {viewerOpen && (
                <StoryViewer 
                    feed={feed} 
                    initialUserIndex={startUserIndex} 
                    onClose={() => setViewerOpen(false)} 
                />
            )}
        </div>
    );
};

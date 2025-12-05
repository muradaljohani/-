
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ChevronUp, MoreHorizontal, Heart } from 'lucide-react';
import { Story, User } from '../../types';
import { StoryEngine } from '../../services/Stories/StoryEngine';
import { useAuth } from '../../context/AuthContext';

interface Props {
    feed: { userId: string, userAvatar: string, userName: string, stories: Story[] }[];
    initialUserIndex: number;
    onClose: () => void;
}

export const StoryViewer: React.FC<Props> = ({ feed, initialUserIndex, onClose }) => {
    const { user } = useAuth();
    const [currentUserIdx, setCurrentUserIdx] = useState(initialUserIndex);
    const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [replyText, setReplyText] = useState('');

    const currentUserData = feed[currentUserIdx];
    const currentStory = currentUserData.stories[currentStoryIdx];
    const engine = StoryEngine.getInstance();

    // Mark as watched on load
    useEffect(() => {
        engine.watchStory(currentStory.id);
        setProgress(0);
    }, [currentUserIdx, currentStoryIdx]);

    // Timer Logic
    useEffect(() => {
        if (isPaused) return;
        
        const duration = currentStory.duration * 1000;
        const intervalTime = 50;
        const step = (intervalTime / duration) * 100;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + step;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [currentUserIdx, currentStoryIdx, isPaused]);

    const handleNext = () => {
        if (currentStoryIdx < currentUserData.stories.length - 1) {
            setCurrentStoryIdx(prev => prev + 1);
        } else {
            if (currentUserIdx < feed.length - 1) {
                setCurrentUserIdx(prev => prev + 1);
                setCurrentStoryIdx(0);
            } else {
                onClose();
            }
        }
    };

    const handlePrev = () => {
        if (currentStoryIdx > 0) {
            setCurrentStoryIdx(prev => prev - 1);
        } else {
            if (currentUserIdx > 0) {
                setCurrentUserIdx(prev => prev - 1);
                setCurrentStoryIdx(feed[currentUserIdx - 1].stories.length - 1);
            }
        }
    };

    const handleSwipeUp = () => {
        setIsPaused(true);
        // Simulate Action (Buy/Apply)
        if (currentStory.overlays.some(o => o.type === 'PRICE')) {
            alert("Open Product Checkout...");
        } else if (currentStory.overlays.some(o => o.type === 'JOB')) {
            alert("Applying to Job...");
        } else {
            alert("More details...");
        }
    };

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Reply sent: ${replyText}`);
        setReplyText('');
        setIsPaused(false);
    };

    return (
        <div className="fixed inset-0 z-[600] bg-black flex flex-col font-sans" dir="rtl">
            
            {/* Top Overlay UI */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent">
                {/* Progress Bars */}
                <div className="flex gap-1 mb-3">
                    {currentUserData.stories.map((s, i) => (
                        <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{ 
                                    width: i < currentStoryIdx ? '100%' : i === currentStoryIdx ? `${progress}%` : '0%' 
                                }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* User Info */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={currentUserData.userAvatar} className="w-8 h-8 rounded-full border border-white/50"/>
                        <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{currentUserData.userName}</span>
                        <span className="text-gray-300 text-xs">{new Date(currentStory.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button><MoreHorizontal className="w-6 h-6 text-white"/></button>
                        <button onClick={onClose}><X className="w-6 h-6 text-white"/></button>
                    </div>
                </div>
            </div>

            {/* Main Content (Touch Area) */}
            <div 
                className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden"
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Media */}
                {currentStory.mediaType === 'image' ? (
                    <img src={currentStory.mediaUrl} className="w-full h-full object-cover" />
                ) : (
                    <video src={currentStory.mediaUrl} className="w-full h-full object-cover" autoPlay muted playsInline />
                )}

                {/* Overlays */}
                {currentStory.overlays.map((ov, i) => (
                    <div 
                        key={i} 
                        className={`absolute px-4 py-2 rounded-lg font-bold text-white shadow-xl text-sm transform -translate-x-1/2 -translate-y-1/2 animate-bounce-slow cursor-pointer active:scale-95 transition-transform ${ov.type === 'PRICE' ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ top: `${ov.y}%`, left: `${ov.x}%` }}
                        onClick={(e) => { e.stopPropagation(); handleSwipeUp(); }}
                    >
                        {ov.text}
                    </div>
                ))}

                {/* Navigation Hotspots */}
                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNext}></div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                
                {/* Swipe Up Hint */}
                {(currentStory.overlays.length > 0 || currentStory.swipeLink) && (
                    <div className="flex flex-col items-center justify-center mb-4 cursor-pointer" onClick={handleSwipeUp}>
                        <ChevronUp className="w-5 h-5 text-white animate-bounce"/>
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest shadow-black drop-shadow-md">
                            {currentStory.overlays.some(o => o.type === 'PRICE') ? 'اسحب للشراء' : 'المزيد من التفاصيل'}
                        </span>
                    </div>
                )}

                {/* Reply Input */}
                <div className="flex items-center gap-3">
                    <form onSubmit={handleReply} className="flex-1">
                        <input 
                            type="text" 
                            placeholder="رد على القصة..." 
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => setIsPaused(false)}
                            className="w-full bg-transparent border border-white/30 rounded-full px-4 py-3 text-white placeholder-white/70 outline-none focus:border-white transition-colors text-sm backdrop-blur-sm"
                        />
                    </form>
                    <button className="p-3"><Heart className="w-7 h-7 text-white hover:fill-red-500 hover:text-red-500 transition-colors"/></button>
                    <button className="p-3"><Send className="w-6 h-6 text-white rtl:rotate-180"/></button>
                </div>
            </div>

        </div>
    );
};

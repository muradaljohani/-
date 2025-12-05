
import React, { useState, useEffect } from 'react';
import { DollarSign, User, TrendingUp } from 'lucide-react';
import { ViralEngine } from '../../services/Expansion/ViralEngine';

export const ViralTicker: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const leaderboard = ViralEngine.getInstance().getViralLeaderboard();

    // Show ticker every few seconds to avoid annoyance
    useEffect(() => {
        // Show after 5 seconds initially
        const timer = setTimeout(() => setIsVisible(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % leaderboard.length);
        }, 6000); // Change every 6 seconds

        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    const user = leaderboard[currentIndex];

    return (
        <div className="fixed bottom-4 left-4 z-40 hidden md:block animate-fade-in-up">
            <div className="bg-[#0f172a]/90 backdrop-blur-md border border-amber-500/30 rounded-full py-2 pl-6 pr-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-3 max-w-sm">
                <div className="relative">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-amber-500" alt="User" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border border-black">
                        <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400">نشاط الأرباح المباشر</p>
                    <p className="text-xs text-white font-bold flex items-center gap-1">
                        <span className="text-amber-400">{user.name}</span> ربح 
                        <span className="bg-green-500/20 text-green-400 px-1 rounded font-mono">{user.earned} ريال</span>
                    </p>
                </div>
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="ml-2 text-gray-600 hover:text-white"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

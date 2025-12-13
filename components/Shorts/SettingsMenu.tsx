
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CheckCircle2, X } from 'lucide-react';

interface Props {
    onClose: () => void;
}

export const SettingsMenu: React.FC<Props> = ({ onClose }) => {
    // Settings State (Persisted in LocalStorage)
    const [autoPlay, setAutoPlay] = useState(() => localStorage.getItem('shorts_autoplay') !== 'false');

    const toggleAutoplay = () => {
        const newState = !autoPlay;
        setAutoPlay(newState);
        localStorage.setItem('shorts_autoplay', String(newState));
    };

    return (
        <div className="bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 w-64 animate-in fade-in slide-in-from-top-5">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h3 className="text-white font-bold text-sm">إعدادات العرض</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="space-y-2">
                <button 
                    onClick={toggleAutoplay}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-right transition-colors"
                >
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                        {autoPlay ? <Volume2 className="w-4 h-4 text-green-400"/> : <VolumeX className="w-4 h-4 text-red-400"/>}
                        التشغيل التلقائي
                    </span>
                    {autoPlay && <CheckCircle2 className="w-3 h-3 text-green-500"/>}
                </button>
            </div>
            
            <div className="mt-4 pt-2 border-t border-white/10 text-center">
                <span className="text-[10px] text-gray-500 font-mono">Murad Shorts v2.1</span>
            </div>
        </div>
    );
};

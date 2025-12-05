
import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Zap, Lightbulb } from 'lucide-react';
import { BridgeRecommendation } from '../../services/Nexus/NexusBrain';

interface Props {
    recommendation: BridgeRecommendation | null;
    onClose: () => void;
    onAction: (targetLink: string) => void;
}

export const BridgeToast: React.FC<Props> = ({ recommendation, onClose, onAction }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (recommendation) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 10000); // Auto hide after 10s
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [recommendation]);

    if (!recommendation || !isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:right-auto md:w-96 z-[9000] animate-fade-in-up">
            <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                
                {/* Glow Effect */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

                <button onClick={() => { setIsVisible(false); onClose(); }} className="absolute top-2 left-2 text-gray-500 hover:text-white">
                    <X className="w-4 h-4"/>
                </button>

                <div className="flex gap-4 pr-2">
                    <div className="mt-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                            <Zap className="w-6 h-6 text-white fill-white"/>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Nexus Suggestion</span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span className="text-[10px] text-gray-400">Based on "{recommendation.trigger}"</span>
                        </div>
                        <p className="text-white text-sm font-medium leading-snug mb-3">
                            {recommendation.message}
                        </p>
                        <button 
                            onClick={() => onAction(recommendation.targetLink)}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-2 transition-all w-fit group-hover:bg-blue-600"
                        >
                            تحقق الآن <ArrowRight className="w-3 h-3 rtl:rotate-180"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { Activity, Heart, Star, Award, Zap } from 'lucide-react';

interface PulseItem {
    id: string;
    user: string;
    action: string;
    icon: React.ReactNode;
    time: string;
    color: string;
}

const MOCK_NAMES = ['علي.م', 'سارة.ج', 'فهد.ع', 'نورة.س', 'خالد.ط', 'ريم.أ', 'محمد.ص'];
const ACTIONS = [
    { text: 'أتم دورة الأمن السيبراني 🎓', icon: <Award className="w-3 h-3"/>, color: 'text-blue-400' },
    { text: 'حصل على وظيفة مطور ويب 💼', icon: <Zap className="w-3 h-3"/>, color: 'text-purple-400' },
    { text: 'باع أول خدمة في السوق 💰', icon: <Star className="w-3 h-3"/>, color: 'text-emerald-400' },
    { text: 'حصل على تقييم 5 نجوم ⭐', icon: <Star className="w-3 h-3"/>, color: 'text-yellow-400' },
    { text: 'وصل للمستوى الماسي 💎', icon: <Award className="w-3 h-3"/>, color: 'text-cyan-400' },
];

export const CommunityPulse: React.FC = () => {
    const [feed, setFeed] = useState<PulseItem[]>([]);

    const addEvent = () => {
        const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
        const act = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        
        const newItem: PulseItem = {
            id: Date.now().toString(),
            user: name,
            action: act.text,
            icon: act.icon,
            time: 'الآن',
            color: act.color
        };

        setFeed(prev => [newItem, ...prev].slice(0, 5)); // Keep last 5
    };

    useEffect(() => {
        // Initial population
        addEvent();
        addEvent();

        const interval = setInterval(() => {
            if (Math.random() > 0.4) addEvent();
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const handleCelebrate = (e: React.MouseEvent) => {
        const btn = e.currentTarget;
        btn.classList.add('scale-125', 'text-red-500');
        setTimeout(() => btn.classList.remove('scale-125', 'text-red-500'), 300);
    };

    return (
        <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-4 overflow-hidden">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse"/> مجتمع ميلاف (Live)
            </h3>
            
            <div className="space-y-3">
                {feed.map((item) => (
                    <div key={item.id} className="flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                {item.user.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-300 truncate">
                                    <span className="font-bold text-white">{item.user}</span> {item.action}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleCelebrate}
                            className="text-gray-600 hover:text-red-400 transition-all p-1"
                            title="تهنئة"
                        >
                            <Heart className="w-3 h-3"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

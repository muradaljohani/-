
import React, { useState, useEffect } from 'react';
import { CrowdPulse } from '../../services/Nexus/CrowdPulse';

interface Props {
    context: 'Academy' | 'Market' | 'Jobs' | 'General';
    itemId?: string;
    className?: string;
}

export const CrowdTicker: React.FC<Props> = ({ context, itemId, className }) => {
    const [stats, setStats] = useState({ icon: '', text: '', count: 0 });

    useEffect(() => {
        setStats(CrowdPulse.getInstance().getLiveStats(context, itemId));
        
        // Update every 10 seconds to simulate life
        const interval = setInterval(() => {
            setStats(CrowdPulse.getInstance().getLiveStats(context, itemId));
        }, 10000);

        return () => clearInterval(interval);
    }, [context, itemId]);

    return (
        <div className={`inline-flex items-center gap-2 bg-black/5 border border-black/10 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-600 animate-pulse ${className}`}>
            <span className="text-base">{stats.icon}</span>
            <span>{stats.text}</span>
        </div>
    );
};

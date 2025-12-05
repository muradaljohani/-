
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, Binary, Cpu } from 'lucide-react';

interface Props {
    isActive: boolean;
}

export const CyberPreloader: React.FC<Props> = ({ isActive }) => {
    const [log, setLog] = useState<string>('Initializing...');
    
    useEffect(() => {
        if (!isActive) return;

        const logs = [
            "Connecting to Secure Gateway...",
            "Encrypting Session Data (256-bit)...",
            "Verifying User Biometrics...",
            "Checking Iron Dome Status...",
            "Establishing Neural Link...",
            "ACCESS GRANTED."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setLog(logs[i]);
                i++;
            }
        }, 200); // Fast cycle

        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono">
            
            {/* Logo Pulsing */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-24 h-24 bg-[#0f172a] border-2 border-cyan-500/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                    <ShieldCheck className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
            </div>

            {/* Matrix Text */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white tracking-[0.2em] mb-4">SECURITY CHECK</h2>
                <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm h-6">
                    <Binary className="w-4 h-4 animate-spin" />
                    <span>{log}</span>
                </div>
            </div>

            {/* Loading Bar */}
            <div className="w-64 h-1 bg-gray-900 rounded-full mt-8 overflow-hidden border border-gray-800">
                <div className="h-full bg-cyan-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { width: 0%; transform: translateX(-100%); }
                    100% { width: 100%; transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

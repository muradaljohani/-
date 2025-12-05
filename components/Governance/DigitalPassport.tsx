
import React, { useRef } from 'react';
import { User } from '../../types';
import { GovernanceCore } from '../../services/Governance/GovernanceCore';
import { X, Share2, Download, ShieldCheck, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
    user: User;
    onClose: () => void;
}

export const DigitalPassport: React.FC<Props> = ({ user, onClose }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const engine = GovernanceCore.getInstance();
    const karma = user.karma || 500;
    const theme = engine.getPassportTheme(karma);
    const status = engine.getCitizenshipStatus(karma);
    const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB');
    const citizenshipId = user.citizenshipId || `CIT-${user.id.substring(0, 8).toUpperCase()}`;

    const getThemeStyles = () => {
        switch (theme) {
            case 'gold': return 'bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-700 border-yellow-300';
            case 'blue': return 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-800 border-blue-300';
            case 'red': return 'bg-gradient-to-br from-red-700 via-red-500 to-red-900 border-red-400';
            default: return 'bg-gradient-to-br from-gray-600 via-gray-500 to-gray-800 border-gray-400';
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `Murad_Passport_${user.name}.png`;
        link.click();
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="flex flex-col items-center gap-6">
                
                {/* PASSPORT CARD */}
                <div 
                    ref={cardRef}
                    className={`relative w-[400px] h-[250px] rounded-3xl shadow-2xl overflow-hidden text-white border-2 ${getThemeStyles()}`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Holographic Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <ShieldCheck className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h2 className="font-black text-lg tracking-wider uppercase">Murad Group</h2>
                                    <p className="text-[8px] font-mono tracking-[0.2em] opacity-80">DIGITAL CITIZENSHIP</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] opacity-70 uppercase">Karma Score</div>
                                <div className="text-2xl font-black font-mono leading-none">{karma}</div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex items-end gap-4 mt-2">
                            <div className="w-24 h-24 rounded-xl border-2 border-white/50 overflow-hidden bg-black/20 shadow-lg">
                                <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Guest"} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 mb-1">
                                <h3 className="text-xl font-bold mb-1 truncate">{user.name}</h3>
                                <div className="text-[10px] opacity-80 font-mono mb-2">{citizenshipId}</div>
                                <div className="inline-block px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-bold shadow-sm">
                                    {status}
                                </div>
                            </div>
                            <div className="mb-1">
                                <div className="bg-white p-1 rounded">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${citizenshipId}`} className="w-12 h-12" />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end text-[9px] opacity-70 font-mono uppercase tracking-widest mt-auto">
                            <span>Since: {joinDate}</span>
                            <span>Verified Identity</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all">
                        <Download className="w-5 h-5"/> تحميل الهوية
                    </button>
                    <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
                        إغلاق
                    </button>
                </div>
                
                <p className="text-gray-400 text-xs mt-2 max-w-sm text-center">
                    هذه الهوية الرقمية تمثل مكانتك في مجتمع ميلاف. حافظ على نقاط الكارما للحصول على الشارة الذهبية والامتيازات الحصرية.
                </p>
            </div>
        </div>
    );
};

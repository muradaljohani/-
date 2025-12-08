
import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { Download, RefreshCw, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AssetProcessor } from '../../services/System/AssetProcessor';

interface Props {
    user: User;
}

export const SmartIDCard: React.FC<Props> = ({ user }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const assetProcessor = AssetProcessor.getInstance();

    const handleDownload = async () => {
        if (!cardRef.current) return;
        
        // Capture the currently visible side
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 4, // High resolution for printing
            useCORS: true,
            logging: false
        });
        
        const link = document.createElement("a");
        link.download = `University_ID_${user.trainingId}_${isFlipped ? 'Back' : 'Front'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Dates Logic
    const issueDate = new Date(user.joinDate || Date.now());
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 4); // 4 Years for University

    const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });

    return (
        <div className="flex flex-col items-center gap-6 my-6 font-sans">
            {/* Custom Styles for 3D Flip */}
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .flip-card-inner { transition: transform 0.8s; }
            `}</style>
            
            {/* CARD CONTAINER (ISO 7810 ID-1 Standard Ratio) */}
            {/* Scaled: 85.6mm x 54mm -> Approx 342px x 216px */}
            <div className="group w-[342px] h-[216px] perspective-1000">
                
                {/* INNER CARD (Transform Wrapper) */}
                <div 
                    ref={cardRef} 
                    className={`relative w-full h-full transform-style-3d flip-card-inner ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                    
                    {/* --- FRONT FACE: Student Info + Photo --- */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-white/20">
                        
                        {/* Background Texture */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10 mix-blend-overlay"></div>
                        
                        {/* Front Content */}
                        <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                            
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-black text-[#0f172a] text-lg shadow-lg border border-amber-400">M</div>
                                    <div className="leading-tight">
                                        <h3 className="text-[10px] font-black text-white tracking-wider uppercase">أكاديمية ميلاف الوطنية</h3>
                                        <p className="text-[8px] text-amber-400 font-bold">University Student Card</p>
                                    </div>
                                </div>
                                <div className="w-8 h-6 bg-yellow-200/20 rounded border border-yellow-200/40 flex items-center justify-center">
                                    <div className="w-6 h-4 border border-yellow-500/50 rounded-sm"></div>
                                </div>
                            </div>

                            {/* Middle: Photo & Data */}
                            <div className="flex items-center gap-4 mt-2">
                                {/* User Photo */}
                                <div className="w-20 h-24 bg-white rounded-md border-2 border-white/30 shadow-lg overflow-hidden shrink-0">
                                    <img 
                                        src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                                        alt="Student" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Student Data */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <div>
                                        <p className="text-[7px] text-gray-400 uppercase tracking-widest mb-0.5">Student Name</p>
                                        <h2 className="text-sm font-bold text-white tracking-wide truncate">{user.name}</h2>
                                    </div>
                                    <div>
                                        <p className="text-[7px] text-gray-400 uppercase tracking-widest mb-0.5">Academic ID</p>
                                        <p className="text-xs font-mono font-bold text-amber-400 tracking-widest">{user.trainingId}</p>
                                    </div>
                                    <div>
                                        <p className="text-[7px] text-gray-400 uppercase tracking-widest mb-0.5">Major</p>
                                        <p className="text-[10px] font-bold text-white truncate">{user.major || 'Computer Science'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Dates & QR Code */}
                            <div className="flex justify-between items-end border-t border-white/10 pt-1 mt-1">
                                <div className="text-[7px] font-mono text-gray-300 flex flex-col">
                                    <span>ISS: {formatDate(issueDate)}</span>
                                    <span>EXP: <span className="text-white font-bold">{formatDate(expiryDate)}</span></span>
                                </div>
                                {/* Barcode Reader / QR */}
                                <div className="bg-white p-0.5 rounded shadow-lg">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STU:${user.trainingId}`} 
                                        className="w-8 h-8"
                                        crossOrigin="anonymous"
                                        alt="QR"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BACK FACE: Academy Name + Signature + Seal --- */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#f8f9fa] rounded-xl overflow-hidden shadow-2xl border border-gray-300 text-black">
                        
                        {/* Magnetic Strip */}
                        <div className="w-full h-8 bg-[#1a1a1a] mt-4"></div>

                        <div className="p-5 flex flex-col h-[calc(100%-32px)] justify-between relative">
                            
                            {/* Academy Name on Back */}
                            <div className="text-center pt-2">
                                <h2 className="text-sm font-black text-[#1e3a8a] uppercase tracking-wide border-b-2 border-[#1e3a8a] inline-block pb-1">
                                    أكاديمية ميلاف مراد العالمية
                                </h2>
                                <p className="text-[8px] text-gray-500 font-bold mt-1">Mylaf Murad International Academy</p>
                            </div>

                            <div className="flex flex-1 justify-between items-end px-4 pb-2">
                                {/* Executive Signature Block */}
                                <div className="text-center relative z-10 flex flex-col items-center">
                                     <div className="h-12 relative flex items-end justify-center mb-1">
                                        <img 
                                            src={assetProcessor.getOfficialSignature()} 
                                            className="h-full object-contain" 
                                            alt="CEO Signature"
                                            style={{ filter: 'brightness(0)' }} 
                                        />
                                     </div>
                                     <div className="border-t border-black w-24 pt-1">
                                         <p className="text-[7px] font-bold uppercase tracking-wider">المدير التنفيذي</p>
                                         <p className="text-[8px] font-bold">م. مراد الجهني</p>
                                     </div>
                                </div>

                                {/* Official Seal */}
                                <div className="relative z-0">
                                     <img 
                                        src={assetProcessor.getOfficialSeal()} 
                                        className="w-20 h-20 object-contain mix-blend-multiply opacity-90 transform rotate-[-12deg]" 
                                        alt="Seal"
                                     />
                                </div>
                            </div>

                            {/* Terms / Warning */}
                            <div className="text-center border-t border-gray-300 pt-1">
                                <p className="text-[6px] text-gray-400">
                                    هذه البطاقة وثيقة رسمية للأغراض الأكاديمية. في حال العثور عليها يرجى تسليمها للإدارة.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsFlipped(!isFlipped)} 
                    className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 text-sm font-bold transition-all border border-white/10"
                >
                    <RefreshCw className="w-4 h-4"/> اقلب البطاقة
                </button>
                <button 
                    onClick={handleDownload} 
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold shadow-lg transition-all"
                >
                    <Download className="w-4 h-4"/> تحميل البطاقة
                </button>
            </div>
            
        </div>
    );
};

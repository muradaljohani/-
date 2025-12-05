
import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { QrCode, Download, RefreshCw, ShieldCheck, Wifi } from 'lucide-react';
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
        
        // Temporarily remove flip transform for clean capture if needed, 
        // but html2canvas captures visible state. We capture the current face.
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 2, // High Res
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `Mylaf_ID_${user.trainingId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const joinYear = new Date(user.joinDate || Date.now()).getFullYear();
    const expiryYear = joinYear + 2;

    return (
        <div className="flex flex-col items-center gap-6 my-6 font-sans">
            
            {/* CARD CONTAINER (Perspective) */}
            <div className="group w-[340px] h-[215px] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                
                {/* INNER CARD (Transform) */}
                <div ref={cardRef} className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* --- FRONT FACE --- */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/50">
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-20"></div>
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none z-0"></div>

                        {/* Content */}
                        <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                            
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-[#0f172a]">M</div>
                                    <div>
                                        <h3 className="text-xs font-bold tracking-widest uppercase">Mylaf Academy</h3>
                                        <p className="text-[8px] text-amber-400">STUDENT MEMBERSHIP</p>
                                    </div>
                                </div>
                                <Wifi className="w-6 h-6 text-white/50 rotate-90" />
                            </div>

                            {/* Middle */}
                            <div className="flex items-center gap-4 mt-2">
                                <div className="w-20 h-20 rounded-xl border-2 border-amber-500 overflow-hidden bg-black">
                                    <img src={user.avatar} className="w-full h-full object-cover" crossOrigin="anonymous" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold leading-tight">{user.name}</h2>
                                    <p className="text-[10px] text-gray-300 font-mono mt-1">{user.trainingId}</p>
                                    <div className="mt-2 inline-flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/50">
                                        <ShieldCheck className="w-3 h-3 text-amber-400"/>
                                        <span className="text-[9px] text-amber-400 font-bold uppercase">{user.studentLevelTitle || 'Member'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] text-gray-400 uppercase">Valid Thru</p>
                                    <p className="text-xs font-mono font-bold">12/{expiryYear}</p>
                                </div>
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${user.trainingId}`} 
                                    className="w-12 h-12 bg-white p-1 rounded"
                                    crossOrigin="anonymous"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- BACK FACE --- */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-bl from-[#0f172a] to-[#111827] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                        {/* Magnetic Strip */}
                        <div className="w-full h-10 bg-black mt-6 relative">
                            <div className="absolute inset-0 bg-white/10 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)'}}></div>
                        </div>

                        <div className="p-5 flex flex-col h-[calc(100%-40px)] justify-between">
                            <div className="flex justify-between items-center">
                                <div className="bg-white w-40 h-8 flex items-center px-2 font-script text-black text-sm relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20 bg-repeat-x text-[8px] leading-[8px] flex items-center">Authorized Authorized</div>
                                    <img src={assetProcessor.getOfficialSignature()} className="h-12 absolute -top-2 left-2 opacity-80" />
                                </div>
                                <div className="text-[10px] font-mono text-gray-400">CVC: ***</div>
                            </div>

                            <div className="text-[8px] text-gray-500 leading-tight text-justify mt-2">
                                This card is the property of Mylaf Murad Academy. It must be returned upon request. Misuse of this ID for fraudulent activities will result in immediate suspension.
                                <br/><br/>
                                <span className="text-amber-500">Official Campus ID • Not a Credit Card</span>
                            </div>

                            <div className="flex justify-center mt-2">
                                <img src={assetProcessor.getOfficialSeal()} className="w-16 h-16 opacity-50 grayscale" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsFlipped(!isFlipped)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 text-xs font-bold transition-all"
                >
                    <RefreshCw className="w-4 h-4"/> قلب البطاقة
                </button>
                <button 
                    onClick={handleDownload} 
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full text-xs font-bold shadow-lg transition-all"
                >
                    <Download className="w-4 h-4"/> تحميل للهاتف
                </button>
            </div>
        </div>
    );
};

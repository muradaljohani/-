
import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { Download, RefreshCw, Wifi, Cpu, ShieldCheck } from 'lucide-react';
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
        
        // Capture the current visible face with high resolution
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 4, // Ultra High Res for Print
            useCORS: true,
            logging: false
        });
        
        const link = document.createElement("a");
        link.download = `University_ID_${user.trainingId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Dates Logic
    const issueDate = new Date(user.joinDate || Date.now());
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 Years Validity

    const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { month: '2-digit', year: '2-digit' }); // MM/YY

    return (
        <div className="flex flex-col items-center gap-6 my-6 font-sans">
            
            {/* CARD CONTAINER (Standard Credit Card Ratio) */}
            {/* Width: 342px, Height: 216px (approx ISO 7810 ID-1 scaled) */}
            <div className="group w-[342px] h-[216px] perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                
                {/* INNER CARD (Transform Wrapper) */}
                <div ref={cardRef} className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* --- FRONT FACE (Official ID - No Photo) --- */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-white/20">
                        
                        {/* Security Patterns & Noise */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20"></div>

                        {/* Content Grid */}
                        <div className="relative z-10 p-5 h-full flex flex-col justify-between text-white">
                            
                            {/* Header: Logo & Title */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-black text-[#0f172a] text-xl shadow-lg border border-amber-400">M</div>
                                    <div className="leading-tight">
                                        <h3 className="text-xs font-black text-white tracking-wider uppercase">Mylaf National Academy</h3>
                                        <p className="text-[9px] text-amber-400 font-bold">بطاقة طالب جامعي | University ID</p>
                                    </div>
                                </div>
                                {/* Smart Chip Simulation */}
                                <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md border border-yellow-700 flex items-center justify-center opacity-90 shadow-sm">
                                    <Cpu className="w-6 h-6 text-yellow-900 opacity-60" strokeWidth={1} />
                                </div>
                            </div>

                            {/* Middle: Student Details (Centered/Larger since photo is gone) */}
                            <div className="flex flex-col gap-1 mt-2 pr-1">
                                <div className="mb-2">
                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">Student Name</p>
                                    <h2 className="text-lg font-black text-white leading-tight tracking-wide">{user.name}</h2>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">Academic ID</p>
                                        <p className="text-base font-mono font-bold text-amber-400 tracking-widest drop-shadow-sm">{user.trainingId}</p>
                                    </div>
                                    <div className="text-left">
                                         <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">Major</p>
                                         <p className="text-xs font-bold text-white">{user.major || 'General Studies'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Dates */}
                            <div className="flex justify-between items-end border-t border-white/10 pt-2 mt-auto">
                                <div className="flex gap-6 text-[10px] font-mono">
                                    <div>
                                        <span className="block text-[7px] text-gray-400 uppercase">Issue Date</span>
                                        <span className="font-bold">{formatDate(issueDate)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[7px] text-gray-400 uppercase">Expiry Date</span>
                                        <span className="text-amber-400 font-bold">{formatDate(expiryDate)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-50">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[8px] text-emerald-400 font-bold uppercase">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BACK FACE (Signature, Stamp, Warning) --- */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl border border-gray-600">
                        
                        {/* Magnetic Strip */}
                        <div className="w-full h-10 bg-[#000] mt-4 relative">
                             <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#111_2px,#111_4px)] opacity-50"></div>
                        </div>

                        <div className="p-4 flex flex-col h-[calc(100%-40px)] justify-between relative">
                            
                            {/* Signature & Stamp Row */}
                            <div className="flex justify-between items-center mt-2 px-2">
                                {/* QR Code */}
                                <div className="bg-white p-1 rounded-md shadow-md">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STU:${user.trainingId}`} 
                                        className="w-16 h-16"
                                        crossOrigin="anonymous"
                                        alt="QR"
                                    />
                                </div>

                                {/* Official Authorization Block */}
                                <div className="text-center relative">
                                    {/* Seal Background */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-30 pointer-events-none">
                                        <img 
                                            src={assetProcessor.getOfficialSeal()} 
                                            className="w-full h-full object-contain" 
                                            alt="Seal"
                                        />
                                    </div>
                                    
                                    {/* Signature */}
                                    <div className="relative z-10 mb-1">
                                         <img 
                                            src={assetProcessor.getOfficialSignature()} 
                                            className="h-10 object-contain filter brightness-0 invert opacity-90 mx-auto" 
                                            alt="Signature"
                                        />
                                    </div>
                                    <div className="text-[7px] text-gray-400 uppercase tracking-widest border-t border-gray-500 pt-0.5">
                                        Executive Director
                                    </div>
                                    <div className="text-[8px] font-bold text-white mt-0.5">م. مراد الجهني</div>
                                </div>
                            </div>

                            {/* Warning Text */}
                            <div className="text-center mt-auto">
                                <p className="text-[10px] font-bold text-amber-500 mb-1">
                                    ⚠ هذه بطاقة رسمية يجب المحافظة عليها
                                </p>
                                <p className="text-[7px] text-gray-500 leading-tight">
                                    This card is an official document of Mylaf National Academy. Use by anyone other than the registered student is prohibited. If found, please return to the nearest campus.
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
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 text-xs font-bold transition-all"
                >
                    <RefreshCw className="w-4 h-4"/> قلب البطاقة
                </button>
                <button 
                    onClick={handleDownload} 
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full text-xs font-bold shadow-lg transition-all"
                >
                    <Download className="w-4 h-4"/> طباعة / حفظ
                </button>
            </div>
            
            <p className="text-[10px] text-gray-500 max-w-xs text-center">
                ملاحظة: يمكنك طباعة هذه البطاقة واستخدامها كبطاقة تعريفية رسمية.
            </p>
        </div>
    );
};

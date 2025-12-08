
import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { Download, RefreshCw, Wifi, Cpu } from 'lucide-react';
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
        
        const link = document.createElement('a');
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
                    
                    {/* --- FRONT FACE (Official ID) --- */}
                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-white/20">
                        
                        {/* Security Patterns & Noise */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20"></div>

                        {/* Content Grid */}
                        <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                            
                            {/* Header: Logo & Title */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-black text-[#0f172a] text-lg shadow-lg">M</div>
                                    <div className="leading-none">
                                        <h3 className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">Mylaf National Academy</h3>
                                        <p className="text-[8px] text-gray-300 font-serif">بطاقة طالب جامعي | University ID</p>
                                    </div>
                                </div>
                                {/* Smart Chip Simulation */}
                                <div className="w-9 h-7 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md border border-yellow-700 flex items-center justify-center opacity-90 shadow-sm">
                                    <Cpu className="w-6 h-6 text-yellow-900 opacity-60" strokeWidth={1} />
                                </div>
                            </div>

                            {/* Middle: Photo & Details */}
                            <div className="flex items-end gap-3 mt-1">
                                {/* Student Photo */}
                                <div className="w-20 h-24 bg-white/10 rounded-lg border-2 border-white/30 overflow-hidden shadow-inner relative shrink-0">
                                    <img src={user.avatar} className="w-full h-full object-cover" crossOrigin="anonymous" alt="Student" />
                                </div>
                                
                                {/* Student Data */}
                                <div className="flex-1 min-w-0">
                                    <div className="mb-2">
                                        <p className="text-[8px] text-gray-400 uppercase tracking-wider">Student Name</p>
                                        <h2 className="text-sm font-bold text-white truncate leading-tight">{user.name}</h2>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-[8px] text-gray-400 uppercase tracking-wider">Academic ID</p>
                                        <p className="text-sm font-mono font-bold text-amber-400 tracking-widest drop-shadow-sm">{user.trainingId}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] text-gray-400 uppercase tracking-wider">Major / Program</p>
                                        <p className="text-[10px] text-white truncate">{user.major || 'Computer Science & IT'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Signatures & Dates */}
                            <div className="flex justify-between items-end mt-1 relative">
                                {/* Dates (Left) */}
                                <div className="flex gap-3 text-[9px] font-mono">
                                    <div>
                                        <span className="block text-[6px] text-gray-400 uppercase">Issue</span>
                                        <span>{formatDate(issueDate)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[6px] text-gray-400 uppercase">Expiry</span>
                                        <span className="text-amber-400 font-bold">{formatDate(expiryDate)}</span>
                                    </div>
                                </div>

                                {/* Signatures & Seal (Right) */}
                                <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 opacity-80 pointer-events-none mix-blend-screen">
                                     <img 
                                        src={assetProcessor.getOfficialSeal()} 
                                        className="w-full h-full object-contain transform rotate-[-15deg] opacity-60" 
                                        alt="Seal"
                                     />
                                </div>
                                <div className="relative z-10 text-center mr-8">
                                    <img 
                                        src={assetProcessor.getOfficialSignature()} 
                                        className="h-8 object-contain filter brightness-0 invert" 
                                        alt="Signature"
                                    />
                                    <p className="text-[6px] text-gray-400 uppercase tracking-widest border-t border-gray-600 mt-0.5 pt-0.5">Executive Director</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- BACK FACE (Magnetic Strip & QR) --- */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#1e293b] rounded-xl overflow-hidden shadow-2xl border border-gray-600">
                        
                        {/* Magnetic Strip */}
                        <div className="w-full h-10 bg-[#000] mt-4 relative">
                             <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#111_2px,#111_4px)] opacity-50"></div>
                        </div>

                        <div className="p-4 flex gap-4 h-[calc(100%-56px)]">
                            
                            {/* QR Code Area */}
                            <div className="w-24 flex flex-col justify-center items-center">
                                <div className="bg-white p-1 rounded-md">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=STU:${user.trainingId}`} 
                                        className="w-20 h-20"
                                        crossOrigin="anonymous"
                                        alt="QR"
                                    />
                                </div>
                                <p className="text-[8px] text-gray-500 mt-1 font-mono">{user.trainingId}</p>
                            </div>

                            {/* Terms */}
                            <div className="flex-1 flex flex-col justify-between text-[8px] text-gray-400 leading-tight text-justify">
                                <p>
                                    هذه البطاقة وثيقة رسمية صادرة عن أكاديمية ميلاف مراد. يجب إبرازها عند الطلب داخل الحرم الجامعي أو عند الاختبارات.
                                </p>
                                <p>
                                    This card is the property of Mylaf Murad Academy. If found, please return to the nearest campus office or contact support.
                                </p>
                                
                                <div className="mt-2 border-t border-gray-600 pt-1 flex justify-between items-center">
                                    <span className="text-white font-bold">Authorized Signature</span>
                                    <Wifi className="w-4 h-4 text-gray-600 rotate-90"/>
                                </div>
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
                ملاحظة: يمكنك طباعة هذه البطاقة واستخدامها كبطاقة تعريفية رسمية في مرافق الأكاديمية والجهات الشريكة.
            </p>
        </div>
    );
};

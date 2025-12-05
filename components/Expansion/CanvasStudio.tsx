
import React, { useRef, useState } from 'react';
import { X, Download, Share2, Loader2, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { ProductListing } from '../../types';
import { ViralEngine } from '../../services/Expansion/ViralEngine';
import { useAuth } from '../../context/AuthContext';

interface Props {
    product: ProductListing;
    isOpen: boolean;
    onClose: () => void;
}

export const CanvasStudio: React.FC<Props> = ({ product, isOpen, onClose }) => {
    const { user } = useAuth();
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const username = user?.name.replace(/\s+/g, '') || 'Guest';
    const refLink = ViralEngine.getInstance().generateRefLink(username, `/market`);

    const handleDownload = async () => {
        if (!canvasRef.current) return;
        setIsGenerating(true);
        
        try {
            // Add a small delay to ensure images render
            await new Promise(r => setTimeout(r, 500));
            
            const canvas = await html2canvas(canvasRef.current, { 
                scale: 2, 
                useCORS: true,
                backgroundColor: '#0f172a' 
            });
            
            const image = canvas.toDataURL("image/jpeg", 0.9);
            const link = document.createElement("a");
            link.href = image;
            link.download = `Story_${product.title.replace(/\s/g, '_').substring(0, 10)}.jpg`;
            link.click();
        } catch (err) {
            console.error("Canvas Gen Failed", err);
            alert("حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center h-full">
                
                {/* 1. PREVIEW AREA (The Canvas) */}
                <div className="relative shadow-2xl rounded-2xl overflow-hidden transform scale-75 md:scale-90 transition-transform origin-center border border-white/10">
                    
                    {/* THIS IS THE RENDER TARGET - 9:16 Aspect Ratio */}
                    <div 
                        ref={canvasRef}
                        className="w-[400px] h-[711px] bg-gradient-to-b from-[#0f172a] to-[#1e293b] relative flex flex-col text-white overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]"></div>

                        {/* Top Bar */}
                        <div className="p-6 relative z-10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">M</div>
                                <span className="font-bold text-sm">سوق ميلاف</span>
                            </div>
                            <span className="bg-white/10 px-2 py-1 rounded text-[10px]">@{username}</span>
                        </div>

                        {/* Main Product Image */}
                        <div className="mx-6 h-[350px] bg-white p-2 rounded-2xl shadow-xl transform rotate-2 relative z-10">
                            <img 
                                src={product.images[0]} 
                                className="w-full h-full object-cover rounded-xl"
                                crossOrigin="anonymous" // Crucial for html2canvas
                            />
                            <div className="absolute -bottom-4 -left-4 bg-amber-500 text-black font-black text-xl px-4 py-2 rounded-lg shadow-lg transform -rotate-2">
                                {product.price} ر.س
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-8 text-center relative z-10 mt-4">
                            <h2 className="text-2xl font-black mb-2 line-clamp-2 leading-tight">{product.title}</h2>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                            
                            {/* QR & CTA */}
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                <div className="bg-white p-1 rounded-lg">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(refLink)}`} 
                                        className="w-16 h-16"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                                <div className="text-right flex-1">
                                    <p className="font-bold text-emerald-400 mb-1">امسح الكود للشراء</p>
                                    <p className="text-[10px] text-gray-400">أو تواصل مع البائع مباشرة</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto p-4 text-center text-[10px] text-gray-500 font-mono">
                            Powered by Murad Group
                        </div>
                    </div>
                </div>

                {/* 2. CONTROLS */}
                <div className="w-full md:w-80 flex flex-col gap-4 text-center">
                    <h2 className="text-white font-bold text-xl mb-2">استوديو الإعلانات</h2>
                    <p className="text-gray-400 text-sm mb-6">صمم إعلاناً احترافياً لمنتجك بضغطة زر وانشره في قصص انستجرام أو سناب شات.</p>
                    
                    <button 
                        onClick={handleDownload} 
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5"/>}
                        تحميل الستوري (JPG)
                    </button>
                    
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold backdrop-blur-md border border-white/10">
                        إغلاق
                    </button>
                </div>

            </div>
        </div>
    );
};


import React, { useRef, useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Hand, MessageSquare, PenTool, Eraser, Crown, Users, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { PaymentGateway } from '../../PaymentGateway';

interface Props {
    onClose: () => void;
    sessionTitle: string;
}

export const LiveClassroom: React.FC<Props> = ({ onClose, sessionTitle }) => {
    const { user } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [seatType, setSeatType] = useState<'Public' | 'FrontRow'>('Public');
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    
    // Mock WebRTC State
    const [micOn, setMicOn] = useState(false);
    const [camOn, setCamOn] = useState(false);

    // --- WHITEBOARD LOGIC ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffffff';
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        if (tool === 'eraser') {
            ctx.clearRect(e.clientX - rect.left - 10, e.clientY - rect.top - 10, 20, 20);
        } else {
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleUpgrade = () => {
        setIsPaymentOpen(true);
    };

    return (
        <div className="fixed inset-0 z-[400] bg-[#0f172a] flex flex-col font-sans animate-in fade-in duration-300" dir="rtl">
            
            {/* Header */}
            <div className="h-16 bg-[#1e293b] border-b border-white/10 flex justify-between items-center px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                        <h2 className="text-white font-bold text-lg">مباشر: {sessionTitle}</h2>
                    </div>
                    <div className="bg-black/30 px-3 py-1 rounded text-xs text-gray-400 border border-white/5 flex items-center gap-2">
                        <Users className="w-3 h-3"/> 1,240 حاضر
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors">
                    <X className="w-5 h-5"/> مغادرة
                </button>
            </div>

            {/* Main Stage */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* 1. Instructor Video (Left) */}
                <div className="w-1/3 bg-black border-l border-white/10 relative flex items-center justify-center group">
                    <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-xs font-bold backdrop-blur-md">
                        د. أحمد (المحاضر)
                    </div>
                </div>

                {/* 2. Interactive Whiteboard (Center) */}
                <div className="flex-1 bg-[#0f172a] relative cursor-crosshair">
                    <canvas 
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full h-full"
                    />
                    
                    {/* Toolbar (Only visible to instructor in real app, simplified here) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1e293b] border border-white/10 rounded-full px-4 py-2 flex items-center gap-4 shadow-xl">
                        <button onClick={() => setTool('pen')} className={`p-2 rounded-full ${tool==='pen' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}><PenTool className="w-5 h-5"/></button>
                        <button onClick={() => setTool('eraser')} className={`p-2 rounded-full ${tool==='eraser' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}><Eraser className="w-5 h-5"/></button>
                    </div>
                </div>

                {/* 3. Student Interaction Panel (Right) */}
                <div className="w-80 bg-[#1e293b] border-r border-white/10 flex flex-col">
                    
                    {/* Upgrade Banner */}
                    {seatType === 'Public' && (
                        <div className="p-4 bg-gradient-to-r from-amber-600/20 to-purple-600/20 border-b border-amber-500/30">
                            <h3 className="text-amber-400 font-bold text-sm flex items-center gap-2 mb-2">
                                <Crown className="w-4 h-4"/> مقعد الصف الأمامي
                            </h3>
                            <p className="text-[10px] text-gray-300 mb-3">
                                أنت في المقعد العام (مشاهدة فقط). احجز مقعداً أمامياً لتفعيل المايك والمشاركة في النقاش.
                            </p>
                            <button onClick={handleUpgrade} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg text-xs transition-colors">
                                ترقية بـ 50 ريال
                            </button>
                        </div>
                    )}

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <div className="text-center text-xs text-gray-500 my-4">بدأ البث المباشر</div>
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-[10px] text-white">S{i}</div>
                                <div>
                                    <span className="text-[10px] text-gray-400 font-bold">Student {i}</span>
                                    <p className="text-xs text-gray-200 bg-white/5 p-2 rounded-lg rounded-tr-none">
                                        هل يمكن إعادة شرح النقطة الأخيرة يا دكتور؟
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-white/10 bg-[#0f172a]">
                        <div className="flex justify-between items-center gap-2">
                            <button 
                                disabled={seatType === 'Public'}
                                onClick={() => setMicOn(!micOn)}
                                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${seatType === 'Public' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : (micOn ? 'bg-red-500 text-white' : 'bg-white/10 text-white')}`}
                            >
                                {seatType === 'Public' ? <Lock className="w-4 h-4"/> : (micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>)}
                            </button>
                            
                            <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-500">
                                <Hand className="w-4 h-4"/> رفع اليد
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                            <input disabled={seatType === 'Public'} placeholder={seatType === 'Public' ? "الشات متاح للصف الأمامي فقط" : "اكتب سؤالك..."} className="bg-transparent w-full text-xs text-white outline-none"/>
                            <MessageSquare className="w-4 h-4 text-gray-500"/>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentGateway 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={50}
                title="حجز مقعد أمامي (Front Row)"
                onSuccess={() => { setIsPaymentOpen(false); setSeatType('FrontRow'); alert("تمت الترقية! المايك والشات متاحان الآن."); }}
            />
        </div>
    );
};

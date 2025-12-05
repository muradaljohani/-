
import React, { useState, useRef } from 'react';
import { X, Camera, Image as ImageIcon, Type, DollarSign, Briefcase, Zap, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StoryEngine } from '../../services/Stories/StoryEngine';
import { StoryOverlay } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const StoryCreator: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<'capture' | 'edit'>('capture');
    const [media, setMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [overlays, setOverlays] = useState<StoryOverlay[]>([]);
    const [isBoosted, setIsBoosted] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !user) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                setMedia(ev.target?.result as string);
                setMediaType(file.type.startsWith('video') ? 'video' : 'image');
                setStep('edit');
            };
            reader.readAsDataURL(file);
        }
    };

    const addSticker = (type: 'PRICE' | 'JOB') => {
        const text = type === 'PRICE' ? prompt("أدخل السعر (ر.س):") : prompt("أدخل المسمى الوظيفي:");
        if (text) {
            setOverlays([...overlays, { 
                type, 
                text: type === 'PRICE' ? `${text} ر.س` : text, 
                x: 50, 
                y: 50 
            }]);
        }
    };

    const handlePost = () => {
        if (!media) return;
        setIsPosting(true);
        
        // Simulate Network Delay
        setTimeout(() => {
            StoryEngine.getInstance().createStory(
                user,
                media,
                mediaType,
                overlays,
                isBoosted
            );
            setIsPosting(false);
            onClose();
            // Reset
            setMedia(null);
            setOverlays([]);
            setStep('capture');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col font-sans" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-20">
                <button onClick={onClose} className="p-2 bg-black/40 rounded-full text-white"><X className="w-6 h-6"/></button>
                {step === 'edit' && (
                    <button onClick={handlePost} disabled={isPosting} className="px-6 py-2 bg-blue-600 rounded-full text-white font-bold flex items-center gap-2">
                        {isPosting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4 rtl:rotate-180"/>}
                        نشر القصة
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                {step === 'capture' ? (
                    <div className="text-center space-y-8">
                        <div onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto cursor-pointer active:scale-90 transition-transform">
                            <Camera className="w-8 h-8 text-black"/>
                        </div>
                        <p className="text-gray-400 text-sm">اضغط لالتقاط صورة أو اختر من المعرض</p>
                        <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect}/>
                    </div>
                ) : (
                    <div className="relative w-full h-full max-w-md bg-black">
                        {mediaType === 'image' ? (
                            <img src={media!} className="w-full h-full object-cover" />
                        ) : (
                            <video src={media!} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                        )}
                        
                        {/* Overlays Layer */}
                        {overlays.map((ov, i) => (
                            <div 
                                key={i} 
                                className={`absolute px-4 py-2 rounded-lg font-bold text-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 ${ov.type === 'PRICE' ? 'bg-green-600' : 'bg-blue-600'}`}
                                style={{ top: `${ov.y}%`, left: `${ov.x}%` }}
                            >
                                {ov.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Tools */}
            {step === 'edit' && (
                <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-0 left-0 right-0 z-20">
                    <div className="flex justify-around items-center mb-6">
                        <button onClick={() => addSticker('PRICE')} className="flex flex-col items-center gap-1 text-white">
                            <div className="p-3 bg-white/10 rounded-full"><DollarSign className="w-5 h-5 text-green-400"/></div>
                            <span className="text-[10px]">سعر</span>
                        </button>
                        <button onClick={() => addSticker('JOB')} className="flex flex-col items-center gap-1 text-white">
                            <div className="p-3 bg-white/10 rounded-full"><Briefcase className="w-5 h-5 text-blue-400"/></div>
                            <span className="text-[10px]">وظيفة</span>
                        </button>
                        <button onClick={() => setIsBoosted(!isBoosted)} className={`flex flex-col items-center gap-1 ${isBoosted ? 'text-amber-400' : 'text-white'}`}>
                            <div className={`p-3 rounded-full ${isBoosted ? 'bg-amber-500/20 border border-amber-500' : 'bg-white/10'}`}>
                                <Zap className={`w-5 h-5 ${isBoosted ? 'fill-current' : ''}`}/>
                            </div>
                            <span className="text-[10px]">{isBoosted ? 'مروج' : 'ترويج'}</span>
                        </button>
                    </div>
                    {isBoosted && (
                        <div className="text-center text-[10px] text-gray-400 bg-white/5 py-1 rounded">
                            سيتم خصم 10 ريال لترويج القصة لمدة 48 ساعة
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


import React, { useState, useRef, useEffect } from 'react';
import { X, Music, Camera, Image as ImageIcon, Check, Loader2, Zap, Timer, RotateCcw, Send, Type, Wand2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage, db, ref, uploadBytes, getDownloadURL, addDoc, collection, serverTimestamp } from '../../src/lib/firebase';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateShortModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<'capture' | 'preview'>('capture');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    // Tools State (Visual Only for MVP)
    const [speed, setSpeed] = useState(1);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (mediaPreview) URL.revokeObjectURL(mediaPreview);
        };
    }, [mediaPreview]);

    if (!isOpen) return null;

    // --- LOGIC ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const isVideo = file.type.startsWith('video');

            // Duration Check for Video
            if (isVideo) {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = function() {
                    window.URL.revokeObjectURL(video.src);
                    // Allow small buffer (e.g. 31s)
                    if (video.duration > 31) {
                        alert("⚠️ الفيديو طويل جداً! الحد الأقصى هو 30 ثانية.");
                        return;
                    }
                    processFile(file, 'video');
                };
                video.src = URL.createObjectURL(file);
            } else {
                processFile(file, 'image');
            }
        }
    };

    const processFile = (file: File, type: 'video' | 'image') => {
        setMediaFile(file);
        setMediaType(type);
        setMediaPreview(URL.createObjectURL(file));
        setStep('preview');
    };

    const handlePublish = async () => {
        if (!user || !mediaFile) return;
        setIsUploading(true);

        try {
            // 1. Upload Media
            const ext = mediaFile.name.split('.').pop();
            const path = `shorts/${user.id}/${Date.now()}.${ext}`;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, mediaFile);
            const downloadUrl = await getDownloadURL(storageRef);

            // 2. Create Post Document
            await addDoc(collection(db, 'posts'), {
                user: {
                    uid: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    handle: user.username ? `@${user.username}` : `@${user.id.slice(0,5)}`,
                    verified: user.isIdentityVerified || false
                },
                content: caption,
                type: mediaType,
                videoUrl: mediaType === 'video' ? downloadUrl : null,
                image: mediaType === 'image' ? downloadUrl : null,
                images: mediaType === 'image' ? [downloadUrl] : [], // Compatibility
                isShort: true,
                duration: mediaType === 'video' ? 0 : 5, // Logic to get real duration omitted for brevity
                createdAt: serverTimestamp(),
                likes: 0,
                views: 0,
                replies: 0
            });

            // 3. Reset & Close
            setIsUploading(false);
            setStep('capture');
            setMediaFile(null);
            setMediaPreview(null);
            setCaption('');
            onClose();
            alert("تم نشر الـ Short بنجاح! 🚀");

        } catch (error) {
            console.error("Upload failed:", error);
            alert("فشل الرفع. يرجى المحاولة مرة أخرى.");
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans text-white animate-in slide-in-from-bottom duration-300">
            
            {/* TOP BAR */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X className="w-6 h-6"/>
                </button>
                
                {/* Add Sound Button */}
                <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold shadow-lg">
                    <Music className="w-3 h-3"/> <span>إضافة صوت</span>
                </button>
                
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* RIGHT SIDEBAR TOOLS */}
            <div className="absolute top-20 right-4 flex flex-col gap-6 z-20 items-center">
                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                        <RotateCcw className="w-6 h-6"/>
                    </div>
                    <span className="text-[10px] font-medium shadow-black drop-shadow-md">قلب</span>
                </button>
                
                <button onClick={() => setSpeed(speed === 1 ? 2 : 1)} className="flex flex-col items-center gap-1 group">
                    <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors font-bold font-mono">
                        {speed}x
                    </div>
                    <span className="text-[10px] font-medium shadow-black drop-shadow-md">سرعة</span>
                </button>
                
                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                        <Wand2 className="w-6 h-6"/>
                    </div>
                    <span className="text-[10px] font-medium shadow-black drop-shadow-md">تجميل</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                        <Timer className="w-6 h-6"/>
                    </div>
                    <span className="text-[10px] font-medium shadow-black drop-shadow-md">مؤقت</span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                        <Zap className="w-6 h-6"/>
                    </div>
                    <span className="text-[10px] font-medium shadow-black drop-shadow-md">فلاش</span>
                </button>
            </div>

            {/* MAIN PREVIEW AREA */}
            <div className="flex-1 bg-[#1a1a1a] relative flex items-center justify-center overflow-hidden">
                {step === 'preview' && mediaPreview ? (
                    mediaType === 'video' ? (
                        <video src={mediaPreview} autoPlay loop playsInline className="w-full h-full object-cover" />
                    ) : (
                        <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
                    )
                ) : (
                    <div className="text-center text-gray-500">
                        <Camera className="w-20 h-20 mx-auto mb-4 opacity-20"/>
                        <p className="text-sm">الكاميرا غير مفعلة (Web)</p>
                    </div>
                )}
                
                {/* Caption Overlay (Only in Preview) */}
                {step === 'preview' && (
                    <div className="absolute bottom-32 left-0 right-0 px-6 z-30">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder="وصف الفيديو... #هاشتاق"
                                className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none text-right font-medium shadow-lg"
                                autoFocus
                            />
                            <Type className="absolute left-3 top-3 w-5 h-5 text-gray-300"/>
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM BAR CONTROLS */}
            <div className="h-28 bg-gradient-to-t from-black via-black/80 to-transparent relative z-20 flex items-center justify-between px-8 pb-4">
                
                {/* Left: Gallery Picker */}
                <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border-2 border-white flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-[10px] font-bold">المعرض</span>
                    <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                {/* Center: Action Button */}
                {step === 'capture' ? (
                    <button 
                        onClick={() => fileInputRef.current?.click()} // On web, this triggers upload
                        className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center relative hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 bg-red-600 rounded-full"></div>
                    </button>
                ) : (
                    <button 
                        onClick={handlePublish}
                        disabled={isUploading}
                        className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? <Loader2 className="w-8 h-8 animate-spin"/> : <Check className="w-10 h-10"/>}
                    </button>
                )}

                {/* Right: Spacer or Effects */}
                <div className="w-10 flex flex-col items-center gap-1 opacity-0">
                     {/* Placeholder to balance layout */}
                </div>

            </div>
        </div>
    );
};

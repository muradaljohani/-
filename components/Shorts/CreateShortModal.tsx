
import React, { useState, useRef, useEffect } from 'react';
import { 
    X, Music, Camera, Image as ImageIcon, Check, Loader2, 
    Zap, Timer, RotateCcw, Send, Type, Wand2, Grid, 
    Layers, Video, Aperture, Maximize2, User, Mic, Monitor, 
    Smartphone, Film, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage, db, ref, uploadBytes, getDownloadURL, addDoc, collection, serverTimestamp } from '../../src/lib/firebase';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateShortModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [step, setStep] = useState<'capture' | 'preview'>('capture');
    
    // --- MEDIA STATE ---
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    
    // --- CAMERA TOOLS STATE ---
    const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
    const [flashMode, setFlashMode] = useState(false);
    const [isHD, setIsHD] = useState(false);
    const [directorMode, setDirectorMode] = useState(false);
    const [multiSnap, setMultiSnap] = useState(false);
    const [dualCam, setDualCam] = useState(false);
    const [timerDelay, setTimerDelay] = useState(0); // 0 = off, 3, 10
    const [stabilization, setStabilization] = useState(false);
    const [greenScreen, setGreenScreen] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [beautyMode, setBeautyMode] = useState(false);

    // --- UI LOGIC STATE ---
    const [countdown, setCountdown] = useState<number | null>(null);
    const [flashTrigger, setFlashTrigger] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (mediaPreview) URL.revokeObjectURL(mediaPreview);
        };
    }, [mediaPreview]);

    if (!isOpen) return null;

    // --- HANDLERS ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            processInputFile(file);
        }
    };

    const processInputFile = (file: File) => {
        const isVideo = file.type.startsWith('video');
        if (isVideo) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 61) {
                    alert("⚠️ الفيديو طويل جداً! الحد الأقصى هو 60 ثانية.");
                    return;
                }
                setMediaFile(file);
                setMediaType('video');
                setMediaPreview(URL.createObjectURL(file));
                setStep('preview');
            };
            video.src = URL.createObjectURL(file);
        } else {
            setMediaFile(file);
            setMediaType('image');
            setMediaPreview(URL.createObjectURL(file));
            setStep('preview');
        }
    };

    const toggleCamera = () => {
        setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
        // In a real implementation with getUserMedia, this would trigger stream re-initialization
    };

    const handleCaptureMock = () => {
        if (timerDelay > 0) {
            setCountdown(timerDelay);
            let count = timerDelay;
            const timerInterval = setInterval(() => {
                count--;
                setCountdown(count);
                if (count === 0) {
                    clearInterval(timerInterval);
                    setCountdown(null);
                    performCapture();
                }
            }, 1000);
        } else {
            performCapture();
        }
    };

    const performCapture = () => {
        if (flashMode) {
            setFlashTrigger(true);
            setTimeout(() => setFlashTrigger(false), 200);
        }
        // Trigger file input as fallback for web demo
        fileInputRef.current?.click();
    };

    const handlePublish = async () => {
        if (!user || !mediaFile) return;
        setIsUploading(true);

        try {
            const ext = mediaFile.name.split('.').pop();
            const path = `shorts/${user.id}/${Date.now()}.${ext}`;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, mediaFile);
            const downloadUrl = await getDownloadURL(storageRef);

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
                images: mediaType === 'image' ? [downloadUrl] : [],
                isShort: true,
                duration: mediaType === 'video' ? 0 : 5,
                createdAt: serverTimestamp(),
                likes: 0,
                views: 0,
                replies: 0,
                meta: {
                    isHD,
                    filter: beautyMode ? 'beauty' : 'normal',
                    speed
                }
            });

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

    // --- TOOLBAR ITEM COMPONENT ---
    const ToolButton = ({ icon: Icon, label, active, onClick, badge }: any) => (
        <button 
            onClick={onClick} 
            className={`flex flex-col items-center gap-1 group relative w-full transition-all ${active ? 'text-yellow-400' : 'text-white'}`}
        >
            <div className={`p-2.5 rounded-full transition-all ${active ? 'bg-black/60 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-black/20 hover:bg-black/40'}`}>
                <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} strokeWidth={1.5}/>
            </div>
            {label && <span className="text-[10px] font-medium shadow-black drop-shadow-md hidden group-hover:block absolute right-12 bg-black/50 px-2 py-1 rounded whitespace-nowrap">{label}</span>}
            {badge && <span className="absolute top-0 right-1 bg-red-500 text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{badge}</span>}
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans text-white animate-in slide-in-from-bottom duration-300">
            
            {/* 1. TOP BAR */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-start z-30 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={onClose} className="p-2.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md">
                    <X className="w-6 h-6"/>
                </button>
                
                {/* Add Sound Pill */}
                <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold shadow-lg hover:bg-black/60 transition-all">
                    <Music className="w-3 h-3"/> <span>إضافة صوت</span>
                </button>
                
                <div className="w-10"></div>
            </div>

            {/* 2. RIGHT SIDEBAR TOOLS (Snapchat Style) */}
            {step === 'capture' && (
                <div className="absolute top-20 right-4 flex flex-col gap-4 z-30 items-center overflow-y-auto max-h-[65vh] py-2 scrollbar-hide w-14">
                    
                    <ToolButton icon={RotateCcw} label="اقلب" onClick={toggleCamera} />
                    
                    <ToolButton 
                        icon={Zap} 
                        label="فلاش" 
                        active={flashMode} 
                        onClick={() => setFlashMode(!flashMode)} 
                    />

                    <ToolButton 
                        icon={isHD ? Monitor : Smartphone} 
                        label={isHD ? "HD مفعل" : "جودة عادية"} 
                        active={isHD} 
                        onClick={() => setIsHD(!isHD)} 
                    />

                    <ToolButton 
                        icon={Video} 
                        label="وضع الإخراج" 
                        active={directorMode} 
                        onClick={() => setDirectorMode(!directorMode)} 
                    />

                    <ToolButton 
                        icon={Layers} 
                        label="لقطات متعددة" 
                        active={multiSnap} 
                        onClick={() => setMultiSnap(!multiSnap)}
                        badge={multiSnap ? "∞" : null}
                    />

                    <ToolButton 
                        icon={Aperture} 
                        label="كاميرا مزدوجة" 
                        active={dualCam} 
                        onClick={() => setDualCam(!dualCam)} 
                    />

                    <ToolButton 
                        icon={Timer} 
                        label="المؤقت" 
                        active={timerDelay > 0} 
                        onClick={() => setTimerDelay(prev => prev === 0 ? 3 : prev === 3 ? 10 : 0)}
                        badge={timerDelay > 0 ? timerDelay : null}
                    />

                    <ToolButton 
                        icon={Activity} 
                        label="تثبيت الفيديو" 
                        active={stabilization} 
                        onClick={() => setStabilization(!stabilization)} 
                    />

                    <ToolButton 
                        icon={User} 
                        label="شاشة خضراء" 
                        active={greenScreen} 
                        onClick={() => setGreenScreen(!greenScreen)} 
                    />

                    <ToolButton 
                        icon={Grid} 
                        label="مربعات" 
                        active={showGrid} 
                        onClick={() => setShowGrid(!showGrid)} 
                    />

                     <div className="w-8 h-px bg-white/20 my-1"></div>

                     <ToolButton 
                        icon={Wand2} 
                        label="تجميل" 
                        active={beautyMode} 
                        onClick={() => setBeautyMode(!beautyMode)} 
                    />
                     <ToolButton 
                        icon={Maximize2} 
                        label="سرعة" 
                        active={speed !== 1} 
                        onClick={() => setSpeed(prev => prev === 1 ? 2 : prev === 2 ? 0.5 : 1)}
                        badge={speed !== 1 ? `${speed}x` : null}
                    />

                </div>
            )}

            {/* 3. MAIN PREVIEW AREA */}
            <div className="flex-1 bg-[#1a1a1a] relative flex items-center justify-center overflow-hidden">
                
                {/* --- OVERLAYS --- */}
                
                {/* Grid Overlay */}
                {showGrid && step === 'capture' && (
                    <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 pointer-events-none">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="border border-white/20"></div>
                        ))}
                    </div>
                )}

                {/* Flash Effect */}
                {flashTrigger && (
                    <div className="absolute inset-0 bg-white z-50 animate-pulse duration-75"></div>
                )}

                {/* Countdown Overlay */}
                {countdown !== null && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <span className="text-9xl font-black text-white animate-bounce">{countdown}</span>
                    </div>
                )}
                
                {/* Dual Cam (Mock UI) */}
                {dualCam && step === 'capture' && (
                    <div className="absolute top-24 left-4 w-28 h-40 bg-gray-800 rounded-xl border-2 border-white z-20 overflow-hidden shadow-2xl">
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">الكاميرا الخلفية</div>
                    </div>
                )}

                {/* Director Mode UI */}
                {directorMode && step === 'capture' && (
                    <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-20">
                         <span className="bg-red-600/80 px-3 py-1 rounded text-xs font-bold">REC</span>
                         <span className="bg-black/60 px-3 py-1 rounded text-xs font-mono">00:00:00:00</span>
                         <span className="bg-black/60 px-3 py-1 rounded text-xs">ISO 400</span>
                    </div>
                )}

                {/* --- MEDIA RENDERER --- */}
                {step === 'preview' && mediaPreview ? (
                    mediaType === 'video' ? (
                        <video 
                            src={mediaPreview} 
                            autoPlay 
                            loop 
                            playsInline 
                            className={`w-full h-full object-cover ${beautyMode ? 'brightness-110 contrast-95 saturate-110' : ''}`}
                            style={{ filter: activeFilterToCSS() }} // Placeholder func
                        />
                    ) : (
                        <img 
                            src={mediaPreview} 
                            className={`w-full h-full object-cover ${beautyMode ? 'brightness-110 contrast-95 saturate-110' : ''}`} 
                            alt="Preview" 
                        />
                    )
                ) : (
                    <div className="relative w-full h-full">
                        {/* Mock Camera Feed Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <Camera className="w-20 h-20 text-white/10 animate-pulse"/>
                        </div>
                        {greenScreen && (
                            <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                                <span className="bg-black/50 px-4 py-2 rounded text-sm font-bold">Green Screen Active</span>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Caption Input (Preview Mode) */}
                {step === 'preview' && (
                    <div className="absolute bottom-32 left-0 right-0 px-6 z-30">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder="وصف الفيديو... #هاشتاق"
                                className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-12 py-3 text-white placeholder-gray-300 outline-none text-right font-medium shadow-lg"
                                autoFocus
                            />
                            <Type className="absolute right-4 top-3 w-5 h-5 text-gray-300"/>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. BOTTOM BAR */}
            <div className="h-28 bg-gradient-to-t from-black via-black/60 to-transparent relative z-20 flex items-center justify-between px-8 pb-6 pt-10">
                
                {/* Left: Gallery */}
                <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 cursor-pointer group w-16">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl border-2 border-white flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-[10px] font-bold shadow-black drop-shadow-md">المعرض</span>
                    <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                {/* Center: Shutter / Action */}
                {step === 'capture' ? (
                    <button 
                        onClick={handleCaptureMock}
                        className="relative group"
                    >
                        <div className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center transition-transform group-active:scale-90">
                            <div className="w-16 h-16 bg-red-500 rounded-full group-hover:bg-red-600 transition-colors"></div>
                        </div>
                    </button>
                ) : (
                    <button 
                        onClick={handlePublish}
                        disabled={isUploading}
                        className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? <Loader2 className="w-8 h-8 animate-spin"/> : <Send className="w-8 h-8 rtl:rotate-180 ml-1"/>}
                    </button>
                )}

                {/* Right: Filters/Effects Placeholder */}
                <div className="w-16 flex flex-col items-center gap-1 cursor-pointer group">
                     {step === 'capture' && (
                        <>
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:rotate-180 transition-transform duration-500">
                                <Film className="w-5 h-5 text-white"/>
                            </div>
                            <span className="text-[10px] font-bold shadow-black drop-shadow-md">فلاتر</span>
                        </>
                     )}
                </div>
            </div>
        </div>
    );

    function activeFilterToCSS() {
        return ''; // Placeholder for advanced filter logic
    }
};

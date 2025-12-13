
import React, { useState, useRef, useEffect } from 'react';
import { X, Music, Image as ImageIcon, Check, Loader2, Zap, Timer, RotateCcw, Type, Wand2, Volume2, Scissors, Camera, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage, db, ref, uploadBytes, getDownloadURL, addDoc, collection, serverTimestamp } from '../../src/lib/firebase';
import { SoundPicker } from './SoundPicker';
import { EffectsDrawer } from './EffectsDrawer';
import * as DeepAR from 'deepar'; // Assumes 'npm i deepar' is done

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface SelectedSound {
    id: string;
    url: string;
    title: string;
    duration: number;
}

export const CreateShortModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    
    // --- STATE ---
    const [step, setStep] = useState<'capture' | 'preview'>('capture');
    const [deepAR, setDeepAR] = useState<any>(null); // DeepAR instance
    const [isArLoaded, setIsArLoaded] = useState(false);
    
    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<any>(null);

    // Media State
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
    
    // Audio State
    const [selectedSound, setSelectedSound] = useState<SelectedSound | null>(null);
    const [isSoundPickerOpen, setIsSoundPickerOpen] = useState(false);
    
    // Tools State
    const [showEffects, setShowEffects] = useState(false);
    const [activeEffect, setActiveEffect] = useState('');
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- DEEPAR INITIALIZATION ---
    useEffect(() => {
        if (isOpen && step === 'capture') {
            const initDeepAR = async () => {
                if (!canvasRef.current) return;

                try {
                    const deepARInstance = await DeepAR.initialize({
                        licenseKey: 'YOUR_PLACEHOLDER_LICENSE_KEY_HERE', // Replace with real key
                        canvas: canvasRef.current,
                        effect: '', // Start with no effect
                        additionalOptions: {
                            cameraConfig: {
                                facingMode: 'user'
                            }
                        }
                    });

                    // Start camera immediately
                    await deepARInstance.startVideo();
                    
                    setDeepAR(deepARInstance);
                    setIsArLoaded(true);
                } catch (error) {
                    console.error("DeepAR Init Failed:", error);
                    // Fallback logic could go here
                }
            };

            initDeepAR();
        }

        // Cleanup on unmount or close
        return () => {
            if (deepAR) {
                deepAR.shutdown();
                setDeepAR(null);
                setIsArLoaded(false);
            }
        };
    }, [isOpen, step]);

    // --- RECORDING LOGIC (CANVAS + AUDIO) ---
    const startRecording = async () => {
        if (!canvasRef.current) return;

        // 1. Get Canvas Stream (The AR Visuals)
        const canvasStream = canvasRef.current.captureStream(30); // 30 FPS

        // 2. Get Audio Stream (Microphone)
        let audioStream: MediaStream | null = null;
        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            console.warn("Mic access denied or unavailable");
        }

        // 3. Combine Tracks
        const combinedTracks = [
            ...canvasStream.getVideoTracks(),
            ...(audioStream ? audioStream.getAudioTracks() : [])
        ];
        const combinedStream = new MediaStream(combinedTracks);

        // 4. Setup Recorder
        const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
        mediaRecorderRef.current = recorder;

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const file = new File([blob], "ar_recording.webm", { type: 'video/webm' });
            processFile(file, 'video');
            
            // Stop tracks
            combinedStream.getTracks().forEach(track => track.stop());
            if (audioStream) audioStream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setIsRecording(true);

        // Timer
        let seconds = 0;
        timerRef.current = setInterval(() => {
            seconds++;
            setRecordingTime(seconds);
            if (seconds >= 30) stopRecording(); // Max 30s
        }, 1000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
            setRecordingTime(0);
        }
    };

    // --- EFFECT HANDLING ---
    const handleSwitchEffect = async (path: string) => {
        setActiveEffect(path);
        if (deepAR) {
            if (path) {
                await deepAR.switchEffect(path);
            } else {
                await deepAR.clearEffect();
            }
        }
        setShowEffects(false);
    };

    // --- STANDARD FILE UPLOAD LOGIC ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = file.type.startsWith('video') ? 'video' : 'image';
            
            // If video, check duration logic (omitted for brevity, same as before)
            processFile(file, type);
        }
    };

    const processFile = (file: File, type: 'video' | 'image') => {
        setMediaFile(file);
        setMediaType(type);
        setMediaPreview(URL.createObjectURL(file));
        
        // Shutdown AR to save resources
        if (deepAR) {
            deepAR.shutdown();
            setDeepAR(null);
        }
        
        setStep('preview');
    };

    const handlePublish = async () => {
        if (!user || !mediaFile) return;
        setIsUploading(true);

        try {
            const ext = mediaFile.name.split('.').pop() || 'webm';
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
                duration: mediaType === 'video' ? recordingTime : 5,
                createdAt: serverTimestamp(),
                likes: 0,
                views: 0,
                replies: 0,
                soundUrl: selectedSound ? selectedSound.url : null,
                effects: activeEffect // Save metadata
            });

            setIsUploading(false);
            onClose();
            alert("تم نشر الـ Short بنجاح! 🚀");

        } catch (error) {
            console.error("Upload failed:", error);
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans text-white animate-in slide-in-from-bottom duration-300">
            
            {/* TOP BAR */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors pointer-events-auto">
                    <X className="w-6 h-6"/>
                </button>
                
                {step === 'capture' && (
                    <button 
                        onClick={() => setIsSoundPickerOpen(true)}
                        className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold shadow-lg pointer-events-auto"
                    >
                        <Music className="w-3 h-3"/> 
                        <span className="truncate max-w-[100px]">{selectedSound ? selectedSound.title : 'إضافة صوت'}</span>
                    </button>
                )}
                
                <div className="w-10"></div>
            </div>

            {/* RIGHT SIDEBAR TOOLS */}
            {step === 'capture' && (
                <div className="absolute top-20 right-4 flex flex-col gap-6 z-20 items-center pointer-events-auto">
                    <button className="flex flex-col items-center gap-1 group" onClick={() => deepAR?.switchCamera()}>
                        <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                            <RotateCcw className="w-6 h-6"/>
                        </div>
                        <span className="text-[10px] font-medium shadow-black drop-shadow-md">قلب</span>
                    </button>
                    
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                            <Timer className="w-6 h-6"/>
                        </div>
                        <span className="text-[10px] font-medium shadow-black drop-shadow-md">مؤقت</span>
                    </button>

                    <button 
                        onClick={() => setShowEffects(!showEffects)}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className={`p-2 rounded-full transition-colors ${showEffects ? 'bg-amber-500 text-black' : 'bg-black/20 hover:bg-white/10'}`}>
                            <Wand2 className="w-6 h-6"/>
                        </div>
                        <span className="text-[10px] font-medium shadow-black drop-shadow-md">فلاتر</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 group">
                        <div className="p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors">
                            <Zap className="w-6 h-6"/>
                        </div>
                        <span className="text-[10px] font-medium shadow-black drop-shadow-md">فلاش</span>
                    </button>
                </div>
            )}

            {/* MAIN PREVIEW AREA */}
            <div className="flex-1 bg-[#1a1a1a] relative flex items-center justify-center overflow-hidden">
                
                {step === 'capture' ? (
                    <>
                        {!isArLoaded && (
                             <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
                                 <Loader2 className="w-10 h-10 text-blue-500 animate-spin"/>
                                 <p className="mt-4 text-sm text-gray-400">تحميل محرك DeepAR...</p>
                             </div>
                        )}
                        {/* THE AR CANVAS */}
                        <canvas 
                            ref={canvasRef} 
                            className="w-full h-full object-cover" 
                            width={window.innerWidth} 
                            height={window.innerHeight}
                        />
                        
                        {/* Recording Timer */}
                        {isRecording && (
                            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
                            </div>
                        )}
                    </>
                ) : (
                    /* PREVIEW MODE */
                    <div className="w-full h-full relative">
                        {mediaType === 'video' ? (
                            <video src={mediaPreview!} autoPlay loop playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={mediaPreview!} className="w-full h-full object-cover" />
                        )}
                        
                        {/* Caption Overlay */}
                        <div className="absolute bottom-32 left-0 right-0 px-6 z-30">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    placeholder="وصف الفيديو... #هاشتاق"
                                    className="w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-300 outline-none text-right font-medium shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* BOTTOM BAR */}
            <div className="h-32 bg-gradient-to-t from-black via-black/60 to-transparent relative z-20 flex items-center justify-between px-8 pb-8 pointer-events-auto">
                
                {step === 'capture' ? (
                    <>
                        {/* Left: Gallery */}
                        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-10 h-10 bg-white/10 rounded-lg border-2 border-white flex items-center justify-center overflow-hidden">
                                <ImageIcon className="w-5 h-5 text-white"/>
                            </div>
                            <span className="text-[10px] font-bold">المعرض</span>
                            <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleFileSelect} />
                        </div>

                        {/* Center: Shutter Button */}
                        <div className="relative">
                            <button 
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center relative transition-all duration-200 ${isRecording ? 'border-red-500 scale-110' : 'border-white'}`}
                            >
                                <div className={`rounded-full transition-all duration-200 ${isRecording ? 'w-8 h-8 bg-red-500 rounded-sm' : 'w-16 h-16 bg-red-500'}`}></div>
                            </button>
                            <div className="text-center text-[10px] mt-2 font-bold opacity-70">اضغط مطولاً للتسجيل</div>
                        </div>

                        {/* Right: Spacer */}
                        <div className="w-10"></div>
                    </>
                ) : (
                    /* Preview Actions */
                    <div className="w-full flex items-center justify-between">
                         <button onClick={() => { setStep('capture'); setMediaPreview(null); }} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                             <RotateCcw className="w-6 h-6"/>
                         </button>

                         <button 
                             onClick={handlePublish}
                             disabled={isUploading}
                             className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold flex items-center gap-2 shadow-lg"
                         >
                             {isUploading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Check className="w-5 h-5"/>}
                             نشر الآن
                         </button>
                    </div>
                )}
            </div>

            {/* MODALS & OVERLAYS */}
            <EffectsDrawer 
                isOpen={showEffects}
                activeEffect={activeEffect}
                onSelectEffect={handleSwitchEffect}
                onClose={() => setShowEffects(false)}
            />

            <SoundPicker 
                isOpen={isSoundPickerOpen} 
                onClose={() => setIsSoundPickerOpen(false)}
                onSelect={(sound) => setSelectedSound({ ...sound, url: sound.url, id: sound.id, title: sound.title, duration: sound.duration })}
            />
        </div>
    );
};

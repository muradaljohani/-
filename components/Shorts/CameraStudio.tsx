
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
    RotateCcw, Zap, Grid, Timer, Maximize2, 
    Aperture, X, Image as ImageIcon, CheckCircle2,
    Mic, Video, MicOff, AlertCircle
} from 'lucide-react';

interface CameraStudioProps {
    onCapture: (file: File, type: 'video' | 'image', meta?: any) => void;
    onClose: () => void;
    onGalleryClick: () => void;
}

export const CameraStudio: React.FC<CameraStudioProps> = ({ onCapture, onClose, onGalleryClick }) => {
    // --- REFS ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<any>(null);
    const pressStartTimeRef = useRef<number>(0);

    // --- STATE: CAMERA CONFIG ---
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [error, setError] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // --- STATE: TOOLS ---
    const [flashMode, setFlashMode] = useState(false); // Simulated screen flash
    const [showGrid, setShowGrid] = useState(false);
    const [timerDelay, setTimerDelay] = useState<0 | 3 | 10>(0);
    const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);
    const [isStabilized, setIsStabilized] = useState(false);

    // --- STATE: UI ---
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [triggerFlash, setTriggerFlash] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- 1. INITIALIZATION & STREAM HANDLING ---
    const initCamera = useCallback(async () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        try {
            const constraints = {
                audio: true,
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1080 },
                    height: { ideal: 1920 },
                    frameRate: { ideal: 60 }
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            setPermissionGranted(true);
            setError(null);
            
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("تعذر الوصول للكاميرا. يرجى التحقق من الأذونات.");
            setPermissionGranted(false);
        }
    }, [facingMode]);

    useEffect(() => {
        initCamera();
        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        };
    }, [initCamera]);

    // --- 2. TOOLS HANDLERS ---
    const toggleCamera = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    const toggleFlash = () => setFlashMode(!flashMode);
    const toggleGrid = () => setShowGrid(!showGrid);
    const cycleTimer = () => setTimerDelay(prev => prev === 0 ? 3 : prev === 3 ? 10 : 0);
    const cycleSpeed = () => setSpeed(prev => prev === 1 ? 2 : prev === 2 ? 0.5 : 1);
    
    // --- 3. CAPTURE LOGIC (PHOTO VS VIDEO) ---
    
    // Helper: Flash Effect
    const fireFlash = () => {
        if (flashMode && facingMode === 'user') {
            setTriggerFlash(true);
            setTimeout(() => setTriggerFlash(false), 200);
        }
    };

    const takePhoto = () => {
        if (!videoRef.current || !stream) return;
        
        fireFlash();
        setIsProcessing(true);

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Mirror if user facing
        if (facingMode === 'user') {
            ctx?.translate(canvas.width, 0);
            ctx?.scale(-1, 1);
        }

        ctx?.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });
                onCapture(file, 'image', { speed });
            }
            setIsProcessing(false);
        }, 'image/png', 1.0);
    };

    const startVideoRecording = () => {
        if (!stream) return;
        
        fireFlash();
        setIsRecording(true);
        chunksRef.current = [];
        
        const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
            ? { mimeType: 'video/webm;codecs=vp9' } 
            : { mimeType: 'video/webm' };
            
        const recorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
            onCapture(file, 'video', { speed });
            setIsRecording(false);
            setRecordingTime(0);
        };

        recorder.start(1000); // Collect chunks every second

        // Timer for UI
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopVideoRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    // --- 4. INTERACTION HANDLERS (TAP VS HOLD) ---
    const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
        // e.preventDefault(); // Prevent ghost clicks
        pressStartTimeRef.current = Date.now();
        
        // If timer is set, delay everything
        if (timerDelay > 0) {
            setCountdown(timerDelay);
            let count = timerDelay;
            const interval = setInterval(() => {
                count--;
                setCountdown(count);
                if (count === 0) {
                    clearInterval(interval);
                    setCountdown(null);
                    // Decide action after countdown based on logic (simplified to video for timer usually)
                    startVideoRecording(); 
                }
            }, 1000);
            return;
        }

        // Long press detection
        timerRef.current = setTimeout(() => {
            startVideoRecording();
        }, 400); // 400ms threshold for "Hold"
    };

    const handlePointerUp = (e: React.PointerEvent | React.TouchEvent) => {
        // e.preventDefault();
        
        // If countdown active, ignore release
        if (countdown !== null) return;

        // If recording, stop it
        if (isRecording) {
            stopVideoRecording();
            return;
        }

        // Check duration for Tap
        const duration = Date.now() - pressStartTimeRef.current;
        if (duration < 400) {
            clearTimeout(timerRef.current); // Cancel potential record start
            takePhoto();
        }
    };

    // --- RENDER ---
    return (
        <div className="absolute inset-0 bg-black text-white overflow-hidden z-50 flex flex-col font-sans">
            
            {/* 1. VIDEO PREVIEW LAYER */}
            <div className="absolute inset-0 z-0">
                {!permissionGranted && error ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4"/>
                        <p className="text-gray-300">{error}</p>
                        <button onClick={initCamera} className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold">
                            إعادة المحاولة
                        </button>
                    </div>
                ) : (
                    <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted 
                        className={`w-full h-full object-cover transition-transform duration-200 ${facingMode === 'user' ? 'scale-x-[-1]' : ''} ${isStabilized ? 'scale-105' : ''}`}
                    />
                )}
            </div>

            {/* 2. OVERLAYS (Grid, Flash, Countdown) */}
            {triggerFlash && <div className="absolute inset-0 bg-white z-[60] animate-fadeOut pointer-events-none"></div>}
            
            {showGrid && (
                <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[...Array(9)].map((_, i) => <div key={i} className="border border-white/20"></div>)}
                </div>
            )}

            {countdown !== null && (
                <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <span className="text-[150px] font-black text-white animate-bounce">{countdown}</span>
                </div>
            )}

            {/* 3. HEADER */}
            <div className="absolute top-0 left-0 w-full p-4 pt-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={onClose} className="p-2 bg-black/20 rounded-full hover:bg-black/40 backdrop-blur-md">
                    <X className="w-6 h-6"/>
                </button>
                {isRecording && (
                    <div className="flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-xs font-mono font-bold">{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</span>
                    </div>
                )}
                <div className="w-10"></div>
            </div>

            {/* 4. SIDEBAR TOOLBAR */}
            <div className="absolute top-20 right-4 z-20 flex flex-col gap-4 bg-black/20 p-2 rounded-full backdrop-blur-md">
                <button onClick={toggleCamera} className="p-2 hover:bg-white/10 rounded-full text-white">
                    <RotateCcw className="w-6 h-6"/>
                </button>
                <button onClick={toggleFlash} className={`p-2 rounded-full transition-colors ${flashMode ? 'text-yellow-400' : 'text-white'}`}>
                    <Zap className={`w-6 h-6 ${flashMode ? 'fill-current' : ''}`}/>
                </button>
                <button onClick={toggleGrid} className={`p-2 rounded-full ${showGrid ? 'text-blue-400' : 'text-white'}`}>
                    <Grid className="w-6 h-6"/>
                </button>
                <button onClick={cycleTimer} className="p-2 rounded-full relative">
                    <Timer className="w-6 h-6"/>
                    {timerDelay > 0 && <span className="absolute -top-1 -right-1 text-[10px] bg-white text-black w-4 h-4 rounded-full flex items-center justify-center font-bold">{timerDelay}s</span>}
                </button>
                <button onClick={cycleSpeed} className="p-2 rounded-full relative">
                    <Maximize2 className="w-6 h-6"/>
                    {speed !== 1 && <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1 rounded-full font-bold">{speed}x</span>}
                </button>
                 <button onClick={() => setIsStabilized(!isStabilized)} className={`p-2 rounded-full ${isStabilized ? 'text-green-400' : 'text-white'}`}>
                    <Aperture className="w-6 h-6"/>
                </button>
            </div>

            {/* 5. BOTTOM CONTROLS */}
            <div className="absolute bottom-0 left-0 w-full p-8 pb-12 z-20 flex items-center justify-around bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                
                {/* Gallery */}
                <button onClick={onGalleryClick} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 rounded-xl bg-white/20 border-2 border-white/50 overflow-hidden backdrop-blur-md flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-5 h-5"/>
                    </div>
                    <span className="text-[10px] font-bold shadow-black drop-shadow-md">المعرض</span>
                </button>

                {/* SHUTTER BUTTON */}
                <div 
                    className="relative group cursor-pointer"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp} // Safety cancel
                    onTouchStart={handlePointerDown}
                    onTouchEnd={handlePointerUp}
                >
                    <div className={`w-20 h-20 rounded-full border-4 border-white transition-all duration-200 flex items-center justify-center ${isRecording ? 'scale-125 border-red-500' : 'hover:scale-110'}`}>
                        <div className={`rounded-full transition-all duration-200 ${isRecording ? 'w-8 h-8 bg-red-500 rounded-sm' : 'w-16 h-16 bg-white'}`}></div>
                    </div>
                </div>

                {/* Filters (Mock) */}
                <button className="flex flex-col items-center gap-1 opacity-80">
                    <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-md">
                        <CheckCircle2 className="w-5 h-5"/>
                    </div>
                    <span className="text-[10px] font-bold shadow-black drop-shadow-md">فلاتر</span>
                </button>

            </div>
            
            {/* Loading Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 z-[80] bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
};

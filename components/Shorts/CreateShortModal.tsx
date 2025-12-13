
import React, { useState, useRef, useEffect } from 'react';
import { 
    X, Send, Type, Loader2, Music, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage, db, ref, uploadBytes, getDownloadURL, addDoc, collection, serverTimestamp } from '../../src/lib/firebase';
import { CameraStudio } from './CameraStudio';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateShortModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    
    // --- STATE ---
    const [step, setStep] = useState<'camera' | 'preview'>('camera');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [metaData, setMetaData] = useState<any>({});
    
    // Hidden input for gallery upload
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (mediaPreview) URL.revokeObjectURL(mediaPreview);
        };
    }, [mediaPreview]);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('camera');
            setMediaFile(null);
            setMediaPreview(null);
            setCaption('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- HANDLERS ---

    const handleCameraCapture = (file: File, type: 'video' | 'image', meta: any) => {
        setMediaFile(file);
        setMediaType(type);
        setMetaData(meta);
        setMediaPreview(URL.createObjectURL(file));
        setStep('preview');
    };

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = file.type.startsWith('video') ? 'video' : 'image';
            
            // Basic Validation
            if (type === 'video' && file.size > 50 * 1024 * 1024) { // 50MB limit
                alert("الفيديو كبير جداً. الحد الأقصى 50 ميجابايت.");
                return;
            }

            handleCameraCapture(file, type, { source: 'gallery' });
        }
    };

    const handlePublish = async () => {
        if (!user || !mediaFile) return;
        setIsUploading(true);

        try {
            const ext = mediaFile.name.split('.').pop() || (mediaType === 'video' ? 'webm' : 'png');
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
                duration: mediaType === 'video' ? 0 : 5, // Should calculate real duration if possible
                createdAt: serverTimestamp(),
                likes: 0,
                views: 0,
                replies: 0,
                meta: {
                    ...metaData,
                    filter: 'normal'
                }
            });

            setIsUploading(false);
            onClose();
            alert("تم نشر الـ Short بنجاح! 🚀");

        } catch (error) {
            console.error("Upload failed:", error);
            alert("فشل الرفع. يرجى المحاولة مرة أخرى.");
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-[100dvh] z-[9999] bg-black font-sans">
            {/* Hidden Input for Gallery */}
            <input 
                ref={galleryInputRef} 
                type="file" 
                accept="video/*,image/*" 
                className="hidden" 
                onChange={handleGallerySelect} 
            />

            {step === 'camera' && (
                <div className="relative w-full h-full">
                    <CameraStudio 
                        onCapture={handleCameraCapture}
                        onClose={onClose}
                        onGalleryClick={() => galleryInputRef.current?.click()}
                    />
                </div>
            )}

            {step === 'preview' && mediaPreview && (
                <div className="absolute inset-0 w-full h-full bg-black flex flex-col animate-in slide-in-from-right duration-300">
                    
                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-10 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                        <button onClick={() => setStep('camera')} className="p-2 bg-black/20 rounded-full text-white hover:bg-black/40 backdrop-blur-md">
                            <X className="w-6 h-6"/>
                        </button>
                        <div className="bg-black/40 px-4 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-md border border-white/10">
                            معاينة
                        </div>
                        <button className="p-2 bg-black/20 rounded-full text-white hover:bg-black/40 backdrop-blur-md">
                            <Music className="w-6 h-6"/>
                        </button>
                    </div>

                    {/* Media Display */}
                    <div className="flex-1 relative bg-[#111] flex items-center justify-center overflow-hidden">
                        {mediaType === 'video' ? (
                            <video 
                                src={mediaPreview} 
                                autoPlay 
                                loop 
                                playsInline 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img 
                                src={mediaPreview} 
                                className="w-full h-full object-cover" 
                                alt="Preview" 
                            />
                        )}
                        
                        {/* Caption Input Overlay */}
                        <div className="absolute bottom-32 left-0 right-0 px-6 z-20">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-black/40 blur-xl rounded-full"></div>
                                <input 
                                    type="text" 
                                    value={caption}
                                    onChange={e => setCaption(e.target.value)}
                                    placeholder="أضف وصفاً... #هاشتاق"
                                    className="relative w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-300 outline-none text-right font-medium shadow-2xl focus:bg-black/60 transition-all"
                                    autoFocus
                                />
                                <Type className="absolute right-4 top-4 w-5 h-5 text-gray-300 pointer-events-none"/>
                            </div>
                        </div>

                        {/* Side Tools (Edit Mode) */}
                        <div className="absolute top-24 right-4 flex flex-col gap-4 z-20">
                            <button className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10"><Type className="w-6 h-6"/></button>
                            <button className="p-3 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10"><Sparkles className="w-6 h-6"/></button>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="p-6 pb-8 bg-black flex justify-between items-center border-t border-white/10">
                        <div className="text-white text-xs font-bold">
                            سيتم النشر في: <span className="text-blue-400">قصتي (عام)</span>
                        </div>
                        <button 
                            onClick={handlePublish}
                            disabled={isUploading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5 rtl:rotate-180"/>}
                            نشر
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


import React, { useState, useRef } from 'react';
import { Settings, Music, Loader2, CheckCircle2, User, UploadCloud, Wand2, Zap, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage, db, ref, uploadBytes, getDownloadURL, doc, updateDoc, collection, addDoc, serverTimestamp } from '../../src/lib/firebase';

interface Props {
    onOpenSettings: () => void;
    isEditing?: boolean;
    onToggleEditing?: () => void;
    onOpenCreate?: () => void; // New prop
}

export const ShortsHeader: React.FC<Props> = ({ onOpenSettings, isEditing, onToggleEditing, onOpenCreate }) => {
    const { user, updateProfile: updateLocalProfile } = useAuth();
    const [isUploading, setIsUploading] = useState<'avatar' | 'sound' | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Refs for hidden inputs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const soundInputRef = useRef<HTMLInputElement>(null);

    // --- HELPER: Toast ---
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // --- LOGIC A: UPDATE AVATAR ---
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files?.[0]) return;
        
        const file = e.target.files[0];
        setIsUploading('avatar');

        try {
            // 1. Upload to Storage
            const storageRef = ref(storage, `avatars/${user.id}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Update Firestore User Document
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, { avatar: downloadURL });

            // 3. Update Local Context
            updateLocalProfile({ avatar: downloadURL });

            showToast('تم تحديث الصورة الشخصية! 📸');
        } catch (error) {
            console.error("Avatar Upload Error:", error);
            showToast('فشل تحديث الصورة.');
        } finally {
            setIsUploading(null);
        }
    };

    // --- LOGIC B: UPLOAD SOUND ---
    const handleSoundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        if (!file.type.startsWith('audio/')) {
            alert('يرجى اختيار ملف صوتي فقط (MP3/WAV).');
            return;
        }

        setIsUploading('sound');

        try {
            const storageRef = ref(storage, `sounds/${user.id}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await addDoc(collection(db, 'sounds'), {
                url: downloadURL,
                ownerId: user.id,
                ownerName: user.name,
                title: file.name.replace(/\.[^/.]+$/, ""),
                createdAt: serverTimestamp(),
                usageCount: 0
            });

            showToast('تم إضافة الصوت بنجاح! 🎵');
        } catch (error) {
            console.error("Sound Upload Error:", error);
            showToast('فشل رفع الصوت.');
        } finally {
            setIsUploading(null);
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full z-50 flex justify-between items-start p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent pointer-events-none select-none">
            
            {/* 1. LEFT: BRANDING IDENTITY */}
            <div className="flex items-center gap-3 pointer-events-auto opacity-95 hover:opacity-100 transition-opacity cursor-default">
                 {/* Logo Container: White Box with Black Text */}
                 <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center shadow-lg">
                      <span className="font-black text-black text-xl leading-none">M</span>
                 </div>
                 
                 {/* Bilingual Text Stack */}
                 <div className="flex flex-col drop-shadow-md">
                      <span className="text-[11px] font-black text-white uppercase tracking-wider leading-none font-sans">
                        Melaf Shorts
                      </span>
                      <span className="text-[10px] font-bold text-white/90 leading-none mt-1 font-sans">
                        ميلاف شورتس
                      </span>
                 </div>
            </div>

            {/* 2. RIGHT: CONTROLS & AVATAR */}
            <div className="flex items-center gap-3 pointer-events-auto">
                
                {/* NEW: CREATE BUTTON (Highlighted) */}
                <button 
                    onClick={onOpenCreate}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-600 text-white shadow-lg shadow-red-900/40 hover:scale-110 transition-transform group border border-white/20"
                    title="إنشاء Short"
                >
                    <Plus className="w-6 h-6 stroke-[3]"/>
                </button>

                <div className="w-px h-6 bg-white/20 mx-1"></div>

                {/* A. Sound Upload Button */}
                 <div className="relative">
                    <input 
                        type="file" 
                        ref={soundInputRef} 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={handleSoundUpload} 
                    />
                    <button 
                        onClick={() => user ? soundInputRef.current?.click() : alert('سجل دخولك أولاً')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-sm group"
                        title="إضافة صوت"
                    >
                         {isUploading === 'sound' ? (
                            <Loader2 className="w-5 h-5 animate-spin"/> 
                         ) : (
                            <Music className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform"/>
                         )}
                    </button>
                 </div>

                {/* B. Effects Toggle Button */}
                 <button 
                    onClick={onToggleEditing}
                    className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all shadow-sm group ${isEditing ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/30 border-white/20 text-white hover:bg-white/20'}`}
                    title="تأثيرات الفيديو"
                 >
                     <Wand2 className={`w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform ${isEditing ? 'fill-black' : ''}`}/>
                 </button>

                {/* C. Settings Button */}
                 <button 
                    onClick={onOpenSettings}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-sm group"
                    title="الإعدادات"
                 >
                     <Settings className="w-5 h-5 drop-shadow-sm group-hover:rotate-45 transition-transform"/>
                 </button>
                
                {/* Separator */}
                <div className="h-6 w-px bg-white/20 mx-1"></div>

                {/* D. Avatar (Profile/Upload) */}
                <div className="relative">
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange} 
                    />
                    <button 
                        onClick={() => user ? avatarInputRef.current?.click() : null}
                        className="w-10 h-10 rounded-full border-2 border-white/50 p-[1px] overflow-hidden relative group shadow-md bg-black/20 backdrop-blur-sm"
                        title="تغيير الصورة الشخصية"
                    >
                        {user ? (
                            <img 
                                src={user.avatar} 
                                className={`w-full h-full rounded-full object-cover ${isUploading === 'avatar' ? 'opacity-50' : ''}`} 
                                alt="Me"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-full">
                                <User className="w-5 h-5 text-gray-300"/>
                            </div>
                        )}
                        
                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                             {isUploading === 'avatar' ? (
                                <Loader2 className="w-4 h-4 text-white animate-spin"/>
                             ) : (
                                <UploadCloud className="w-4 h-4 text-white"/>
                             )}
                        </div>
                    </button>
                </div>
            </div>

            {/* TOAST NOTIFICATION (Centered Below Header) */}
            {toastMessage && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-in-up pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2 shadow-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                        {toastMessage}
                    </div>
                </div>
            )}
        </div>
    );
};

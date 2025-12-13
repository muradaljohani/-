
import React, { useState, useRef } from 'react';
import { X, Upload, Play, Pause, Music, Search, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage, ref, uploadBytes, getDownloadURL } from '../../src/lib/firebase';

interface Sound {
    id: string;
    title: string;
    author: string;
    url: string;
    duration: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (sound: Sound) => void;
}

// Mock Data
const TRENDING_SOUNDS: Sound[] = [
    { id: '1', title: 'Future Bass Energy', author: 'Mylaf Beats', url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3', duration: 30 },
    { id: '2', title: 'Chill Lo-Fi', author: 'Relax Station', url: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3', duration: 30 },
    { id: '3', title: 'Upbeat Pop', author: 'Happy Tunes', url: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3', duration: 30 },
];

export const SoundPicker: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'trending' | 'upload'>('trending');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // Audio ref for previewing
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    if (!isOpen) return null;

    const handlePlayPreview = (sound: Sound) => {
        if (playingId === sound.id) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            audioRef.current.src = sound.url;
            audioRef.current.play();
            setPlayingId(sound.id);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user) {
            const file = e.target.files[0];
            if (!file.type.startsWith('audio/')) return alert("يرجى اختيار ملف صوتي فقط");

            setIsUploading(true);
            try {
                const storageRef = ref(storage, `sounds/${user.id}/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                
                const newSound: Sound = {
                    id: `custom_${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    author: user.name,
                    url: url,
                    duration: 0 // Will be determined on load
                };
                
                onSelect(newSound);
                onClose();
            } catch (err) {
                console.error(err);
                alert("فشل الرفع");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
            
            <div className="bg-[#1e293b] w-full max-w-md h-[80vh] sm:h-[600px] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-300">
                
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Music className="w-5 h-5 text-purple-500"/> مكتبة الأصوات
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400"/></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('trending')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'trending' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500'}`}
                    >
                        المتداول
                    </button>
                    <button 
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'upload' ? 'text-white border-b-2 border-purple-500' : 'text-gray-500'}`}
                    >
                        رفع صوت
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {activeTab === 'trending' && TRENDING_SOUNDS.map(sound => (
                        <div key={sound.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 group">
                            <div 
                                onClick={() => handlePlayPreview(sound)}
                                className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center cursor-pointer hover:bg-purple-500 hover:text-white transition-colors text-purple-400"
                            >
                                {playingId === sound.id ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5 ml-0.5"/>}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-sm">{sound.title}</h4>
                                <p className="text-gray-400 text-xs">{sound.author}</p>
                            </div>
                            <button 
                                onClick={() => { audioRef.current.pause(); onSelect(sound); onClose(); }}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-full text-xs font-bold"
                            >
                                استخدام
                            </button>
                        </div>
                    ))}

                    {activeTab === 'upload' && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 transition-colors">
                            <input type="file" id="sound-upload" className="hidden" accept="audio/*" onChange={handleFileUpload} />
                            <label htmlFor="sound-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                    {isUploading ? <Loader2 className="w-8 h-8 text-purple-500 animate-spin"/> : <Upload className="w-8 h-8 text-gray-400"/>}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">رفع ملف صوتي</h4>
                                    <p className="text-gray-500 text-xs mt-1">MP3, WAV (Max 10MB)</p>
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

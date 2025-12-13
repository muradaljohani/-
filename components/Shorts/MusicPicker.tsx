
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Play, Pause, Check, Music, Loader2 } from 'lucide-react';

interface Song {
    id: number;
    title: string;
    artist: string;
    cover: string;
    previewUrl: string;
    duration: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (song: Song) => void;
}

export const MusicPicker: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [playingUrl, setPlayingUrl] = useState<string | null>(null);
    
    // Audio Reference to manage playback without re-renders causing overlaps
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Cleanup audio on unmount or close
    useEffect(() => {
        if (!isOpen) {
            stopAudio();
        }
    }, [isOpen]);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingUrl(null);
    };

    const searchSongs = async (term: string) => {
        if (!term.trim()) return;
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            // Using iTunes Search API (JSONP/CORS usually allowed for GET)
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=20`);
            
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            
            const mappedSongs: Song[] = data.results.map((item: any) => ({
                id: item.trackId,
                title: item.trackName,
                artist: item.artistName,
                cover: item.artworkUrl100, // High quality cover
                previewUrl: item.previewUrl,
                duration: item.trackTimeMillis
            }));

            setSongs(mappedSongs);
        } catch (error) {
            console.error("iTunes API Error:", error);
            // Non-blocking error handling
            setSongs([]); 
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = (song: Song) => {
        // If clicking the currently playing song, pause it
        if (playingUrl === song.previewUrl) {
            stopAudio();
            return;
        }

        // Stop previous
        stopAudio();

        // Play new
        if (song.previewUrl) {
            const audio = new Audio(song.previewUrl);
            audioRef.current = audio;
            audio.volume = 0.5;
            
            audio.play().catch(e => console.error("Playback error", e));
            setPlayingUrl(song.previewUrl);

            // Reset state when song finishes
            audio.onended = () => setPlayingUrl(null);
        }
    };

    const handleSelect = (song: Song) => {
        stopAudio();
        onSelect(song);
        onClose();
    };

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) searchSongs(query);
        }, 600);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Dummy Error state just for internal logic
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-[100] bg-[#121212] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-[#1e1e1e]">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="ابحث عن أغنية أو فنان (مثال: نانسي، Drake)..." 
                    className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-500 font-bold"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                <button onClick={() => { stopAudio(); onClose(); }} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-800">
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                {!isLoading && songs.length === 0 && query && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        لا توجد نتائج. جرب البحث بالإنجليزية.
                    </div>
                )}

                {!isLoading && !query && (
                     <div className="text-center py-20 text-gray-600 flex flex-col items-center">
                         <Music className="w-16 h-16 opacity-20 mb-4"/>
                         <p className="text-sm">ابحث لإضافة موسيقى إلى الفيديو</p>
                     </div>
                )}

                {songs.map(song => (
                    <div key={song.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group">
                        {/* Cover + Play Overlay */}
                        <div className="relative w-12 h-12 shrink-0 cursor-pointer" onClick={() => handlePreview(song)}>
                            <img src={song.cover} className="w-full h-full rounded-lg object-cover" alt={song.title}/>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors rounded-lg">
                                {playingUrl === song.previewUrl ? (
                                    <Pause className="w-5 h-5 text-white fill-white" />
                                ) : (
                                    <Play className="w-5 h-5 text-white fill-white opacity-80" />
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
                            <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                        </div>

                        {/* Select Button */}
                        <button 
                            onClick={() => handleSelect(song)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95"
                        >
                            استخدام
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

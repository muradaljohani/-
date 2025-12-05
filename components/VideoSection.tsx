import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ChevronRight } from 'lucide-react';

interface VideoSectionProps {
  videoUrl: string;
  title: string;
  subtitle: string;
  overlayColor?: string; // e.g., 'bg-blue-900/40'
  alignment?: 'left' | 'center' | 'right';
  height?: 'h-64' | 'h-80' | 'h-96' | 'h-[400px]' | 'h-[500px]' | 'min-h-screen';
  ctaText?: string;
  onCtaClick?: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ 
  videoUrl, 
  title, 
  subtitle, 
  overlayColor = 'bg-black/60',
  alignment = 'center',
  height = 'h-[500px]',
  ctaText,
  onCtaClick
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-play when in view logic using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.4 } // Play when 40% visible
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`relative w-full ${height} overflow-hidden group border-y border-white/5 bg-[#0f172a] transform translate-z-0`}>
      {/* Background Placeholder to prevent layout shift */}
      <div className="absolute inset-0 bg-gray-900 z-0"></div>

      {/* Video Background with Poster Fallback for Stability */}
      <video
        ref={videoRef}
        src={videoUrl}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-in-out scale-105 group-hover:scale-110 z-10"
        style={{ minHeight: '100%', minWidth: '100%' }} // Enforce filling
      />

      {/* Overlay Gradient */}
      <div className={`absolute inset-0 ${overlayColor} backdrop-blur-[1px] transition-opacity duration-500 z-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-[#0f172a]/80 z-20"></div>

      {/* Controls */}
      <div className="absolute bottom-6 left-6 z-30 flex gap-3">
        <button 
          onClick={toggleMute} 
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <button 
          onClick={togglePlay} 
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10 md:hidden"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col justify-center px-6 md:px-20 z-30 ${
        alignment === 'left' ? 'items-start text-left' : 
        alignment === 'right' ? 'items-end text-right' : 
        'items-center text-center'
      }`}>
        <div className={`max-w-3xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="overflow-hidden mb-4">
             <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
               {title}
             </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed mb-8 drop-shadow-md border-l-4 border-amber-500 pl-4 bg-black/20 p-2 rounded-r-lg backdrop-blur-sm">
            {subtitle}
          </p>
          
          {ctaText && onCtaClick && (
            <button 
              onClick={onCtaClick}
              className="group relative px-8 py-3 bg-white text-[#0f172a] hover:bg-amber-500 transition-colors duration-300 rounded-full font-bold text-sm md:text-base flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {ctaText} <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
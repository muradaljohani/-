
import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  onClose: () => void;
}

export const EffectsDrawer: React.FC<Props> = ({ isOpen, activeFilter, onSelectFilter, onClose }) => {
  const filters = [
    { id: 'none', label: 'أصلي', style: {} },
    { id: 'pale', label: 'باهت', style: { filter: 'sepia(20%) contrast(85%) brightness(110%)' } },
    { id: 'vibrant', label: 'حيوي', style: { filter: 'saturate(150%) contrast(110%)' } },
    { id: 'bnw', label: 'أبيض وأسود', style: { filter: 'grayscale(100%)' } },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 pb-8 animate-in slide-in-from-bottom duration-300">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-white font-bold text-sm">تأثيرات الفيديو</h3>
         <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full"><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => onSelectFilter(f.id)}
            className={`flex flex-col items-center gap-2 min-w-[80px] group snap-start`}
          >
            <div 
              className={`w-16 h-16 rounded-lg bg-gray-800 border-2 transition-all overflow-hidden ${activeFilter === f.id ? 'border-amber-500 scale-105 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'border-transparent group-hover:border-white/30'}`}
            >
               {/* Preview Thumbnail (Generic Image with filter applied) */}
               <div 
                 className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070')] bg-cover bg-center" 
                 style={f.style}
               ></div>
            </div>
            <span className={`text-[10px] font-bold ${activeFilter === f.id ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-200'}`}>
                {f.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

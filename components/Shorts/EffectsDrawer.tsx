
import React from 'react';
import { X, Sparkles, Smile, Ghost, Glasses } from 'lucide-react';

interface Props {
  isOpen: boolean;
  activeEffect: string; // Path to .deepar file
  onSelectEffect: (path: string) => void;
  onClose: () => void;
}

// REAL DeepAR Effects (Must exist in public/effects/)
const AR_EFFECTS = [
    { id: 'none', label: 'بدون', path: '', icon: <X className="w-6 h-6"/> },
    { id: 'aviators', label: 'نظارة', path: '/effects/aviators.deepar', icon: <Glasses className="w-6 h-6 text-yellow-400"/> },
    { id: 'makeup', label: 'مكياج', path: '/effects/makeup.deepar', icon: <Smile className="w-6 h-6 text-pink-400"/> },
    { id: 'lion', label: 'أسد', path: '/effects/lion.deepar', icon: <Ghost className="w-6 h-6 text-orange-400"/> },
    { id: 'dalmatian', label: 'كلب', path: '/effects/dalmatian.deepar', icon: <Sparkles className="w-6 h-6 text-white"/> },
    { id: 'flowers', label: 'زهور', path: '/effects/flowers.deepar', icon: <span className="text-xl">🌸</span> },
];

export const EffectsDrawer: React.FC<Props> = ({ isOpen, activeEffect, onSelectEffect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-32 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <div className="flex justify-center mb-2">
         <div className="bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-white border border-white/10">
             عدسات الواقع المعزز (AR)
         </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 pb-4">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x justify-start md:justify-center">
          {AR_EFFECTS.map(effect => (
            <button
              key={effect.id}
              onClick={() => onSelectEffect(effect.path)}
              className={`flex flex-col items-center gap-2 min-w-[70px] group snap-center transition-all ${activeEffect === effect.path ? 'scale-110 -translate-y-2' : 'opacity-70 hover:opacity-100'}`}
            >
              <div 
                className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-gray-800 relative overflow-hidden transition-all ${activeEffect === effect.path ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'border-white/20 group-hover:border-white'}`}
              >
                 {effect.icon}
              </div>
              <span className={`text-[10px] font-bold ${activeEffect === effect.path ? 'text-amber-500' : 'text-gray-300'}`}>
                  {effect.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex justify-center mt-2">
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X className="w-4 h-4"/>
            </button>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { AssetProcessor } from '../services/System/AssetProcessor';

export const VisionBanner: React.FC = () => {
  const assetProcessor = AssetProcessor.getInstance();

  return (
    <section className="w-full bg-gradient-to-br from-[#004aad] to-[#0a2f5a] text-white py-16 px-6 font-sans relative overflow-hidden" dir="rtl">
      {/* Optional Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        
        {/* Text Block */}
        <div className="text-center md:text-right flex-1 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight drop-shadow-md">
            رؤية عالمية للتعليم
          </h1>
          <p className="text-lg md:text-xl font-light text-blue-100 leading-relaxed max-w-2xl">
            بابتكار وعلم — نبني مستقبل مشرق للتعليم والتقنية
          </p>
          <div className="pt-6">
             <p className="text-sm md:text-base font-serif italic text-blue-200 border-t border-blue-400/30 inline-block pt-3 px-2">
               — توقيع: أكاديمية / شركة ميلاف مراد
             </p>
          </div>
        </div>

        {/* Seal Block */}
        <div className="flex-shrink-0 mt-8 md:mt-0 relative group">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-blue-400/20 blur-[60px] rounded-full"></div>
            
            <img 
              src={assetProcessor.getOfficialSeal()} 
              alt="الختم الرسمي" 
              className="w-40 md:w-48 h-auto object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
            />
        </div>

      </div>
    </section>
  );
};

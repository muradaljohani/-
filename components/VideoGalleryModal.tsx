
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, ShieldCheck, Award, Star, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    id: 1,
    image: "https://img.freepik.com/free-vector/gradient-ui-ux-elements-background_23-2149056159.jpg?w=1380",
    title: "واجهة التعلم المتطورة",
    subtitle: "بيئة تعليمية ذكية تعمل بالذكاء الاصطناعي لتخصيص تجربتك."
  },
  {
    id: 2,
    image: "https://img.freepik.com/free-photo/young-man-headset-using-laptop-working-call-center_482257-23429.jpg?w=996",
    title: "نخبة المدربين والخبراء",
    subtitle: "مدربون معتمدون من كبرى الشركات العالمية يتابعونك خطوة بخطوة."
  },
  {
    id: 3,
    image: "https://t4.ftcdn.net/jpg/02/80/79/64/360_F_280796443_3W3g3g3g3g3g3g3g3g3g3g3g3g3g3g3g.jpg",
    title: "اعتماداتنا الدولية",
    subtitle: "شهادات معتمدة من مجموعة مراد بشراكة مع مناهج Google Career Certificates."
  },
  {
    id: 4,
    image: "https://img.freepik.com/free-vector/luxury-certificate-template_23-2148939768.jpg?w=1380",
    title: "لحظة التخرج واستلام الشهادة",
    subtitle: "استلم شهادتك الموثقة فور اجتياز الاختبار النهائي."
  }
];

export const VideoGalleryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying && isOpen) {
      interval = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, isOpen]);

  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
      
      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0f172a] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 bg-[#1e293b] shrink-0 z-20">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/20">
                    <Award className="w-6 h-6 text-amber-500"/>
                </div>
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">جولة في أكاديمية ميلاف</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] md:text-xs text-emerald-400">Milaf Visual Showcase</p>
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 relative bg-black overflow-hidden group">
            
            {/* Slides */}
            {SLIDES.map((slide, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                    
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-center md:text-right">
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg transform translate-y-0 transition-transform duration-700 delay-100">{slide.title}</h3>
                        <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl bg-black/40 backdrop-blur-md p-4 rounded-xl border-r-4 border-amber-500 inline-block">
                            {slide.subtitle}
                        </p>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-20 backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-8 h-8 rtl:rotate-180" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-20 backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-8 h-8 rtl:rotate-180" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {SLIDES.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => { setCurrentSlide(i); setIsAutoPlaying(false); }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
            </div>
        </div>

        {/* Trust Badge Bar */}
        <div className="bg-[#0b1120] border-t border-white/10 p-4 md:p-6 shrink-0 z-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        <span>معتمد من: <span className="text-white font-bold">Google Education Partner</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>محمية بواسطة: <span className="text-white font-bold">Cloudflare Security</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>تصنيف: <span className="text-white font-bold">5 نجوم في سوق العمل</span></span>
                    </div>
                </div>

                {/* Call To Action */}
                <button onClick={() => { onClose(); /* Add logic to open registration if needed */ }} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/30 flex items-center gap-2 transition-all transform hover:scale-105">
                    <Zap className="w-5 h-5 fill-current" />
                    ابدأ رحلتك التعليمية الآن
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

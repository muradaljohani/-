
import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#000000] flex flex-col font-sans relative overflow-hidden text-right" dir="rtl">
      
      {/* Abstract Background Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        {/* Gradient Mesh */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="max-w-3xl">
          {/* 1. Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">المجتمع التقني الأول</span>
          </div>

          {/* 2. Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight drop-shadow-2xl animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            ابدأ رحلتك في <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              مجتمع ميلاف
            </span>
          </h1>

          {/* 3. Description with Accent Line */}
          <div className="flex border-r-4 border-yellow-500 pr-6 mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-2xl">
              شارك أفكارك، ابنِ جمهورك، وتواصل مع نخبة المبدعين في العالم العربي. 
              <br className="hidden md:block"/>
              مكانك هنا لتصنع الأثر وتبني مستقبلك المهني.
            </p>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            
            <button
              onClick={signInWithGoogle}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
            >
              <span>تسجيل الدخول بـ Google</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>

            <button className="group flex items-center justify-center gap-3 px-8 py-4 border border-gray-600 hover:bg-white/5 text-white rounded-full font-bold text-lg transition-all hover:border-gray-400">
              <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <span>شاهد فيديو تعريفي</span>
            </button>

          </div>

          {/* Trust Indicators / Stats */}
          <div className="mt-16 flex items-center gap-8 text-gray-500 text-sm font-mono animate-fade-in-up" style={{animationDelay: '0.4s'}}>
             <div className="flex items-center gap-2">
                <Globe className="w-4 h-4"/>
                <span>+120K عضو نشط</span>
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4"/>
                <span>نظام آمن وموثق</span>
             </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <p className="text-gray-500 text-sm font-medium">
          © 2025 Milaf Community. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

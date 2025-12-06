
import React from 'react';
import { Clock, CheckCircle2, Zap, BarChart3, Calendar, MessageSquare, ArrowLeft, PlayCircle, Star } from 'lucide-react';
import { Footer } from './Footer';
import { SEOHelmet } from './SEOHelmet';

export default function MuradClockLanding() {
  const features = [
    {
      title: "استجابة فورية",
      desc: "بوت ذكي يعمل على مدار الساعة للرد على استفسارات الطلاب وإدارة المواعيد.",
      icon: <Zap className="w-6 h-6 text-amber-500" />
    },
    {
      title: "جدولة أكاديمية",
      desc: "نظام تنظيم وقت متقدم يربط بين جداول المحاضرات والمهام اليومية تلقائياً.",
      icon: <Calendar className="w-6 h-6 text-blue-500" />
    },
    {
      title: "تحليل ذكي",
      desc: "تقارير أداء دقيقة تساعدك على فهم إنتاجيتك وتحسين استغلال وقتك.",
      icon: <BarChart3 className="w-6 h-6 text-emerald-500" />
    },
    {
      title: "دعم متكامل",
      desc: "مدعوم من سحابة مراد (Murad Cloud) لضمان سرعة وموثوقية البيانات.",
      icon: <Clock className="w-6 h-6 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800" dir="rtl">
      <SEOHelmet 
        title="مراد كلوك | Murad Clock" 
        description="نظام إدارة الوقت الذكي للأكاديميات. مدعوم بالذكاء الاصطناعي." 
        path="/murad-clock"
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
             <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white shadow-lg">
               <Clock className="w-6 h-6" />
             </div>
             <div className="flex flex-col">
               <span className="text-xl font-black text-[#1e3a8a] leading-none">Murad<span className="text-amber-500">Clock</span></span>
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI Powered</span>
             </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-[#1e3a8a] transition-colors">المميزات</a>
            <a href="#about" className="hover:text-[#1e3a8a] transition-colors">عن النظام</a>
            <a href="/support" className="hover:text-[#1e3a8a] transition-colors">الدعم الفني</a>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => window.dispatchEvent(new CustomEvent('open-login'))} className="text-slate-600 hover:text-[#1e3a8a] font-bold text-sm px-4">
               تسجيل الدخول
             </button>
             <button onClick={() => window.location.href = '/dopamine'} className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1">
               ابدأ التجربة
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
           <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 border border-blue-200">
                 <Star className="w-3 h-3 fill-current" />
                 الجيل الجديد من إدارة الأكاديميات
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-[#0f172a] mb-6 leading-tight">
                مراد كلوك: نبض <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">الذكاء الاصطناعي</span> لأكاديميتك
              </h1>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                مساعد ذكي متطور يدير المهام، ينظم الجداول، ويساعد الطلاب في رحلتهم التعليمية بدقة متناهية. جزء من منظومة مراد كلاود المتكاملة.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                 <button onClick={() => window.location.href = '/dopamine'} className="px-8 py-4 bg-[#1e3a8a] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
                   جرب مراد كلوك الآن <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                 </button>
                 <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                   <PlayCircle className="w-5 h-5" /> شاهد الفيديو
                 </button>
              </div>
           </div>

           <div className="relative">
              <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-3xl transform scale-90"></div>
              <img 
                src="https://cdn.dribbble.com/users/4196683/screenshots/15699742/media/6594273030d529239855b38944549f2b.jpg?resize=1000x750&vertical=center" 
                alt="Murad Clock Interface" 
                className="relative z-10 w-full rounded-3xl shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 z-20 animate-bounce-slow">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="font-bold text-slate-900">نظام فعال</div>
                    <div className="text-xs text-slate-500">جاهز للعمل 24/7</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-white">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-black text-[#0f172a] mb-4">مميزات صممت للنمو</h2>
               <p className="text-slate-500 max-w-2xl mx-auto">أدوات ذكية تساعدك على التركيز على ما يهم: التعليم والتطوير.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {features.map((feat, idx) => (
                 <div key={idx} className="group p-8 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                       {feat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-[#0f172a] text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
         <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="w-20 h-20 mx-auto bg-white/10 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
               <Clock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black mb-6">جزء من منظومة مراد كلاود</h2>
            <p className="text-xl text-blue-100 font-light leading-relaxed mb-10">
               يعمل مراد كلوك بتكامل تام مع باقي خدماتنا السحابية، مما يوفر تجربة سلسة وموحدة لإدارة العمليات الأكاديمية والتقنية. نحن نبني البنية التحتية لمستقبل التعليم.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-400">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> أمان عالي</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> تحديثات مستمرة</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> دعم فني مباشر</span>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}

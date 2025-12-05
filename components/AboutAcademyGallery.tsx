
import React from 'react';
import { X, Server, Shield, Cloud, Activity, Cpu, Globe, Monitor, Database, Terminal, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GALLERY_ITEMS = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000&auto=format&fit=crop",
    title: "مركز البيانات الرئيسي (Main Data Center)",
    category: "البنية التحتية",
    desc: "خوادم سحابية متقدمة تعمل على مدار الساعة لضمان استقرار النظام.",
    icon: <Server className="w-4 h-4 text-blue-400" />
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    title: "لوحة الأمن السيبراني (CyberSecurity)",
    category: "الأمان",
    desc: "أنظمة مراقبة وحماية لحظية للتصدي للهجمات السيبرانية وتشفير البيانات.",
    icon: <Shield className="w-4 h-4 text-emerald-400" />
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    title: "البنية السحابية (Cloud Infrastructure)",
    category: "الشبكات",
    desc: "شبكة عالمية موزعة لضمان سرعة الوصول للمحتوى من أي مكان.",
    icon: <Cloud className="w-4 h-4 text-cyan-400" />
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    title: "غرفة العمليات الافتراضية (Virtual Ops)",
    category: "الإدارة",
    desc: "مركز تحكم رقمي لإدارة العمليات الأكاديمية والتقنية عن بعد.",
    icon: <Activity className="w-4 h-4 text-red-400" />
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    title: "نظام الذكاء الاصطناعي (Mylaf AI Core)",
    category: "الذكاء الاصطناعي",
    desc: "العقل المدبر للمنصة، يقوم بتحليل المسارات التعليمية واقتراح المحتوى.",
    icon: <Cpu className="w-4 h-4 text-purple-400" />
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1507842217121-ad957e7f6d2a?q=80&w=1000&auto=format&fit=crop",
    title: "المكتبة الرقمية (Digital Archives)",
    category: "المصادر",
    desc: "أرفف رقمية لا نهائية تضم آلاف الكتب والمراجع المفتوحة المصدر.",
    icon: <Database className="w-4 h-4 text-amber-400" />
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop",
    title: "وحدة الدعم الذكي (AI Support Hub)",
    category: "الدعم الفني",
    desc: "أنظمة رد آلي ومعالجة لغات طبيعية لخدمة المتدربين فورياً.",
    icon: <Zap className="w-4 h-4 text-yellow-400" />
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    title: "لوحة تحليل التعلم (ML Dashboard)",
    category: "التحليلات",
    desc: "رسوم بيانية وتحليلات دقيقة لتقدم الطلاب ومستويات الأداء.",
    icon: <Terminal className="w-4 h-4 text-green-400" />
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    title: "واجهة المنصة التعليمية (LMS Interface)",
    category: "المنصة",
    desc: "تجربة مستخدم انسيابية مصممة للتركيز على المحتوى التعليمي.",
    icon: <Monitor className="w-4 h-4 text-blue-500" />
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    title: "الشبكة العالمية (Global Network)",
    category: "التوسع",
    desc: "خريطة تفاعلية تظهر تواجد خوادم وخدمات الأكاديمية حول العالم.",
    icon: <Globe className="w-4 h-4 text-indigo-400" />
  }
];

export const AboutAcademyGallery: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up">
      <div className="relative w-full h-full md:max-w-7xl md:h-[95vh] bg-[#0f172a] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#1e293b] shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Server className="w-6 h-6 text-blue-500"/>
                    البنية التقنية للأكاديمية
                </h2>
                <p className="text-sm text-gray-400 mt-1">جولة في مرافق الأكاديمية الرقمية وأنظمة التشغيل الذكية</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0f172a]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {GALLERY_ITEMS.map((item) => (
                    <div key={item.id} className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-white/5 shadow-lg hover:shadow-blue-900/20 transition-all duration-500 hover:-translate-y-1">
                        
                        {/* Placeholder Background (Prevents Layout Shift) */}
                        <div className="absolute inset-0 bg-gray-800 animate-pulse z-0"></div>

                        {/* Image with Loading Optimization */}
                        <img 
                            src={item.src} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 relative z-10"
                            loading="lazy"
                            width="600"
                            height="400"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90 z-20"></div>
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-30">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600/90 text-[10px] text-white font-bold mb-2 backdrop-blur-sm border border-blue-400/30">
                                {item.icon} {item.category}
                            </span>
                            <h3 className="text-white font-bold text-sm md:text-base leading-snug drop-shadow-md mb-1">
                                {item.title}
                            </h3>
                            <p className="text-[10px] text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#1e293b] text-center text-xs text-gray-500 shrink-0">
            جميع الصور تمثل البيئة الافتراضية والبنية التحتية الرقمية لأكاديمية ميلاف مراد &copy; 2025
        </div>

      </div>
    </div>
  );
};

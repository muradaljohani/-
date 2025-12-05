
import React, { useState } from 'react';
import { MapPin, Briefcase, BookOpen, ShoppingBag, Tag, ChevronDown, ChevronUp, Cloud, Globe, Cpu, Building2 } from 'lucide-react';

const CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 
  'الأحساء', 'الطائف', 'تبوك', 'بريدة', 'عنيزة', 'الرس', 'حائل', 'نجران', 
  'جازان', 'أبها', 'خميس مشيط', 'الباحة', 'سكاكا', 'عرعر', 'الجبيل', 'ينبع', 
  'الخرج', 'حفر الباطن', 'الدوادمي', 'شرورة', 'القريات', 'بيشة', 'الزلفي'
];

const JOB_ROLES = [
  'مهندس مدني', 'مهندس معماري', 'مهندس برمجيات', 'مطور ويب', 'محلل بيانات', 
  'أخصائي أمن سيبراني', 'محاسب', 'مدير مالي', 'مسوق رقمي', 'مدير مبيعات', 
  'موظف استقبال', 'خدمة عملاء', 'حارس أمن', 'سائق', 'طبيب عام', 'ممرض', 
  'صيدلي', 'معلم لغة إنجليزية', 'معلم رياضيات', 'مدير مشروع', 'مترجم', 
  'كاتب محتوى', 'مصمم جرافيك', 'مونتير', 'فني شبكات', 'دعم فني', 'مدير موارد بشرية',
  'أخصائي توظيف', 'قانوني', 'محامي', 'طباخ', 'شيف', 'عامل إنتاج'
];

const COURSE_TOPICS = [
  'الذكاء الاصطناعي', 'تعلم الآلة', 'علوم البيانات', 'البرمجة بلغة بايثون', 
  'تطوير تطبيقات الجوال', 'تصميم واجهات المستخدم', 'التسويق الإلكتروني', 
  'إدارة المشاريع PMP', 'الأمن السيبراني', 'القرصنة الأخلاقية', 'الحوسبة السحابية', 
  'إدارة الموارد البشرية', 'المحاسبة المالية', 'اللغة الإنجليزية للأعمال', 
  'تصميم الجرافيك', 'الفوتوشوب', 'المونتاج', 'التصوير الفوتوغرافي', 
  'التجارة الإلكترونية', 'العمل الحر', 'كتابة المحتوى', 'SEO', 'إدارة سلاسل الإمداد'
];

const MARKET_CATEGORIES = [
  'سيارات للبيع', 'عقارات للبيع', 'شقق للإيجار', 'أجهزة إلكترونية', 'جوالات', 
  'لابتوبات', 'أثاث منزلي', 'خدمات عامة', 'مقاولات', 'نقل عفش', 'تنظيف منازل', 
  'حيوانات أليفة', 'مواشي', 'معدات ثقيلة', 'قطع غيار', 'أسر منتجة', 'مستلزمات أطفال'
];

const CLOUD_TOPICS = [
    'تقنيات البلوك تشين', 'الميتافيرس', 'الويب 3.0', 'الحوسبة الكمومية', 
    'البيانات الضخمة', 'انترنت الأشياء IoT', 'الجيل الخامس 5G', 'المدن الذكية',
    'الطاقة المتجددة', 'السيارات الكهربائية', 'التقنية المالية FinTech'
];

export const SEODirectory: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Navigation Handler (SPA Aware)
  const handleNav = (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
  };

  return (
    <section className="bg-[#0b1120] border-t border-white/5 py-16 px-6 font-sans text-right heavy-render relative overflow-hidden" dir="rtl" aria-label="دليل الموقع الشامل">
      
      {/* Background Noise */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-200 mb-2 flex items-center justify-center gap-2">
                <Globe className="w-6 h-6 text-blue-500"/> الدليل الوطني الشامل (SEO Index)
            </h2>
            <p className="text-xs text-gray-500 max-w-xl mx-auto">
                فهرس الروابط السريعة لجميع مدن ومناطق المملكة، يغطي الوظائف، التدريب، الخدمات، والمقالات التقنية.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* COLUMN 1: JOBS BY CITY (The Geo-Trap) */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 border-b border-blue-900/30 pb-2">
                    <MapPin className="w-4 h-4"/> وظائف حسب المدينة
                </h3>
                <nav className={`flex flex-col gap-1 ${isExpanded ? '' : 'max-h-60 overflow-hidden'}`}>
                    {CITIES.map((city, i) => (
                        <a 
                            key={i} 
                            href={`/jobs?location=${encodeURIComponent(city)}`}
                            onClick={(e) => handleNav(e, `/jobs?location=${city}`)}
                            className="text-[11px] text-gray-400 hover:text-white hover:translate-x-1 transition-transform block py-0.5"
                            title={`وظائف شاغرة في ${city}`}
                        >
                            وظائف في {city}
                        </a>
                    ))}
                </nav>
            </div>

            {/* COLUMN 2: JOBS BY ROLE */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-emerald-900/30 pb-2">
                    <Briefcase className="w-4 h-4"/> المسميات الوظيفية
                </h3>
                <nav className={`flex flex-col gap-1 ${isExpanded ? '' : 'max-h-60 overflow-hidden'}`}>
                    {JOB_ROLES.map((role, i) => (
                        <a 
                            key={i} 
                            href={`/jobs?role=${encodeURIComponent(role)}`}
                            onClick={(e) => handleNav(e, `/jobs?search=${role}`)}
                            className="text-[11px] text-gray-400 hover:text-white hover:translate-x-1 transition-transform block py-0.5"
                            title={`فرص عمل ${role}`}
                        >
                            وظيفة {role}
                        </a>
                    ))}
                </nav>
            </div>

            {/* COLUMN 3: COURSES */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2 border-b border-purple-900/30 pb-2">
                    <BookOpen className="w-4 h-4"/> دورات تدريبية
                </h3>
                <nav className={`flex flex-col gap-1 ${isExpanded ? '' : 'max-h-60 overflow-hidden'}`}>
                    {COURSE_TOPICS.map((topic, i) => (
                        <a 
                            key={i} 
                            href={`/academy?topic=${encodeURIComponent(topic)}`}
                            onClick={(e) => handleNav(e, `/academy?search=${topic}`)}
                            className="text-[11px] text-gray-400 hover:text-white hover:translate-x-1 transition-transform block py-0.5"
                            title={`دورة ${topic} معتمدة`}
                        >
                            دورة {topic}
                        </a>
                    ))}
                </nav>
            </div>

            {/* COLUMN 4: MARKET */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-amber-900/30 pb-2">
                    <ShoppingBag className="w-4 h-4"/> سوق المملكة
                </h3>
                <nav className={`flex flex-col gap-1 ${isExpanded ? '' : 'max-h-60 overflow-hidden'}`}>
                    {MARKET_CATEGORIES.map((cat, i) => (
                        <a 
                            key={i} 
                            href={`/haraj?cat=${encodeURIComponent(cat)}`}
                            onClick={(e) => handleNav(e, `/haraj?search=${cat}`)}
                            className="text-[11px] text-gray-400 hover:text-white hover:translate-x-1 transition-transform block py-0.5"
                            title={`حراج ${cat}`}
                        >
                            {cat}
                        </a>
                    ))}
                </nav>
            </div>

            {/* COLUMN 5: CLOUD ARTICLES (New) */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 border-b border-cyan-900/30 pb-2">
                    <Cloud className="w-4 h-4"/> مقالات تقنية
                </h3>
                <nav className={`flex flex-col gap-1 ${isExpanded ? '' : 'max-h-60 overflow-hidden'}`}>
                    {CLOUD_TOPICS.map((topic, i) => (
                        <a 
                            key={i} 
                            href={`/cloud?topic=${encodeURIComponent(topic)}`}
                            onClick={(e) => handleNav(e, `/cloud?search=${topic}`)}
                            className="text-[11px] text-gray-400 hover:text-white hover:translate-x-1 transition-transform block py-0.5"
                            title={`مقالات عن ${topic}`}
                        >
                            {topic}
                        </a>
                    ))}
                </nav>
            </div>

        </div>
        
        <div className="mt-8 text-center">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1 mx-auto bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-colors"
            >
                {isExpanded ? 'عرض أقل' : 'عرض كامل الفهرس'} 
                {isExpanded ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
            </button>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-4">
                <Tag className="w-3 h-3"/> كلمات بحث شائعة (Trending Keywords)
            </h3>
            <div className="flex flex-wrap gap-2">
                {['جدارة', 'ساعد', 'مسار', 'الخدمة المدنية', 'طاقات', 'هدف', 'العمل الحر', 'التأمينات', 'نفاذ', 'أبشر', 'توكلنا', 'مدارس', 'جامعات', 'بعثات', 'ابتعاث', 'وظائف عن بعد', 'دوام جزئي', 'ريادة الأعمال', 'التحول الرقمي', 'رؤية 2030', 'نيوم', 'القدية', 'البحر الأحمر'].map((tag, i) => (
                    <span key={i} className="text-[10px] text-gray-500 bg-white/5 px-3 py-1.5 rounded-full cursor-default hover:text-gray-300 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        <div className="mt-8 text-center">
             <div className="inline-flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                <Cpu className="w-3 h-3"/>
                <span>Generated by Murad SEO Engine v5.0 | 1.5M Links Indexed</span>
             </div>
        </div>

      </div>
    </section>
  );
};


import React, { useMemo, useState } from 'react';
import { MapPin, Briefcase, BookOpen, ShoppingBag, Car, Home, Smartphone, Tag, ArrowLeft, Globe, Database, Cpu, Filter, Search, ExternalLink, LayoutGrid } from 'lucide-react';
import { SEOHelmet } from './SEOHelmet';

interface Props {
    onBack: () => void;
}

// --- MASSIVE DATASETS FOR SEO PERMUTATION (THE MATRIX) ---
const CITIES = [
  'الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الظهران', 
  'الأحساء', 'الطائف', 'تبوك', 'بريدة', 'عنيزة', 'حائل', 'نجران', 'جازان', 'أبها', 
  'خميس-مشيط', 'الباحة', 'عرعر', 'الجبيل', 'ينبع', 'حفر-الباطن', 'الخرج', 'الثقبة'
];

const JOB_ROLES = [
  'مهندس-مدني', 'مهندس-معماري', 'مهندس-برمجيات', 'مطور-ويب', 'أخصائي-أمن-سيبراني', 
  'مدير-مشاريع', 'محاسب-عام', 'مسوق-رقمي', 'كاتب-محتوى', 'مصمم-جرافيك', 
  'مترجم-قانوني', 'معلم-لغة-إنجليزية', 'طبيب-عام', 'ممرض', 'صيدلي', 'فني-شبكات', 
  'دعم-فني', 'مدخل-بيانات', 'خدمة-عملاء', 'حارس-أمن', 'سائق', 'مندوب-مبيعات'
];

const SKILLS = [
  'Python', 'Java', 'JavaScript', 'React', 'Nodejs', 'SQL', 'AWS', 'Docker',
  'Photoshop', 'Illustrator', 'Figma', 'UI-UX', 'Marketing', 'SEO', 'Excel', 'PMP'
];

export const VisualSitemap: React.FC<Props> = ({ onBack }) => {
  const [filter, setFilter] = useState('');

  // Generate Massive Link Matrix
  const linkMatrix = useMemo(() => {
      const matrix: { href: string, text: string, category: string, icon: any, priority: number }[] = [];
      
      // 1. JOBS MATRIX (City x Role)
      CITIES.forEach(city => {
          JOB_ROLES.forEach(role => {
              matrix.push({
                  href: `/jobs/${city}/${role}`,
                  text: `وظائف ${role.replace(/-/g, ' ')} في ${city}`,
                  category: 'jobs',
                  icon: Briefcase,
                  priority: 0.9
              });
          });
      });

      // 2. ACADEMY MATRIX (Skill x Level)
      SKILLS.forEach(skill => {
          ['مبتدئ', 'متقدم', 'خبير'].forEach(level => {
              matrix.push({
                  href: `/academy/course/${skill}/${level}`,
                  text: `دورة ${skill} مستوى ${level}`,
                  category: 'academy',
                  icon: BookOpen,
                  priority: 0.8
              });
          });
      });

      // 3. MARKET & HARAJ MATRIX
      ['سيارات', 'عقارات', 'أجهزة', 'أثاث'].forEach(cat => {
          CITIES.slice(0, 10).forEach(city => {
              matrix.push({
                  href: `/haraj/${city}/${cat}`,
                  text: `حراج ${cat} في ${city}`,
                  category: 'haraj',
                  icon: Car,
                  priority: 0.7
              });
          });
      });

      return matrix;
  }, []);

  const filteredLinks = filter 
    ? linkMatrix.filter(l => l.text.includes(filter))
    : linkMatrix;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans p-4 md:p-8" dir="rtl">
        <SEOHelmet 
            title="خريطة الموقع الشاملة | فهرس الروابط" 
            description="تصفح خريطة الموقع الكاملة لمنصة ميلاف. وصول سريع لآلاف الوظائف، الدورات، والمنتجات في جميع مدن المملكة."
            path="/sitemap"
        />

        <div className="max-w-7xl mx-auto">
            
            {/* SEO Header */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-600 p-2 rounded-lg text-white"><Globe className="w-8 h-8"/></div>
                            <h1 className="text-3xl md:text-4xl font-black text-[#0f172a]">الفهرس الوطني الشامل</h1>
                        </div>
                        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
                            نظام أرشفة هرمي متقدم يربط ملايين الصفحات في منصة ميلاف. مصمم خصيصاً لتسهيل الوصول للمحتوى عبر محركات البحث وتوفير تجربة تصفح سلسة للمستخدمين.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="بحث سريع في 5000+ رابط..." 
                                className="pl-4 pr-12 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none w-full md:w-80 text-sm font-bold shadow-sm transition-all"
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-4"/>
                        </div>
                        <button onClick={onBack} className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0f172a] text-white rounded-xl font-bold hover:bg-[#1e293b] transition-colors shadow-lg">
                            <ArrowLeft className="w-4 h-4"/> العودة للمنصة
                        </button>
                    </div>
                </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex-1 min-w-[150px] bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Briefcase className="w-5 h-5"/></div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">{linkMatrix.filter(l => l.category === 'jobs').length}</div>
                        <div className="text-xs text-gray-500 font-bold">رابط وظيفة</div>
                    </div>
                </div>
                <div className="flex-1 min-w-[150px] bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BookOpen className="w-5 h-5"/></div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">{linkMatrix.filter(l => l.category === 'academy').length}</div>
                        <div className="text-xs text-gray-500 font-bold">مسار تعليمي</div>
                    </div>
                </div>
                <div className="flex-1 min-w-[150px] bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Car className="w-5 h-5"/></div>
                    <div>
                        <div className="text-2xl font-black text-gray-900">{linkMatrix.filter(l => l.category === 'haraj').length}</div>
                        <div className="text-xs text-gray-500 font-bold">قسم حراج</div>
                    </div>
                </div>
            </div>

            {/* THE MATRIX GRID */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-blue-600"/>
                        <h2 className="text-xl font-black text-gray-800">خريطة الروابط النشطة</h2>
                    </div>
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Generated: {new Date().toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredLinks.slice(0, 600).map((link, i) => (
                        <a 
                            key={i} 
                            href={link.href}
                            className={`group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                                link.category === 'jobs' ? 'bg-blue-50/30 border-blue-100 hover:border-blue-300' :
                                link.category === 'academy' ? 'bg-purple-50/30 border-purple-100 hover:border-purple-300' :
                                'bg-amber-50/30 border-amber-100 hover:border-amber-300'
                            }`}
                        >
                            <div className={`mt-1 ${
                                link.category === 'jobs' ? 'text-blue-500' :
                                link.category === 'academy' ? 'text-purple-500' :
                                'text-amber-500'
                            }`}>
                                <link.icon className="w-4 h-4"/>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs font-bold text-gray-800 group-hover:text-black leading-relaxed mb-1">{link.text}</h3>
                                <div className="text-[9px] text-gray-400 font-mono truncate flex items-center gap-1">
                                    <ExternalLink className="w-2 h-2"/>
                                    {link.href}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                
                {filteredLinks.length > 600 && (
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                            تحميل المزيد من الروابط ({filteredLinks.length - 600}+)
                        </button>
                    </div>
                )}
            </div>

            {/* SEO Keywords Footer */}
            <div className="mt-12 p-8 bg-[#1e293b] rounded-3xl text-center">
                <h3 className="text-white font-bold mb-6 text-lg">الكلمات المفتاحية الأكثر بحثاً</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {['وظائف عن بعد', 'جدارة', 'نظام نور', 'الضمان الاجتماعي', 'تسجيل دخول نفاذ', 'دعم ريف', 'ساند', 'هدف', 'تمهير', 'دروب', 'العمل الحر', 'أبشر', 'توكلنا', 'منصة مدرستي', 'بوابة القبول الموحد', 'حساب المواطن'].map((tag, i) => (
                        <span key={i} className="text-xs text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-blue-500 hover:text-white transition-colors cursor-default">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-500 font-mono">
                    Dynamic Sitemap Generator v4.0 | Optimized for Googlebot
                </div>
            </div>

        </div>
    </div>
  );
};

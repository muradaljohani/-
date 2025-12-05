
import React, { useState } from 'react';
import { X, Award, Globe, Cpu, BookOpen, ShieldCheck, Landmark, CheckCircle2, Building2, FileWarning } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'arab', label: 'جهات عربية', icon: <Landmark className="w-4 h-4" /> },
  { id: 'global', label: 'جهات دولية', icon: <Globe className="w-4 h-4" /> },
  { id: 'tech', label: 'تحالفات تقنية', icon: <Cpu className="w-4 h-4" /> },
  { id: 'academic', label: 'عضويات مهنية', icon: <BookOpen className="w-4 h-4" /> },
];

// Helper Icon
const UsersIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const ACCREDITATIONS = [
  // Arab Entities
  {
    id: 1, category: 'arab', title: 'اتحاد المدربين العرب', org: 'Arab Trainers Union',
    desc: 'عضوية مهنية لضمان جودة التدريب والمدربين في الوطن العربي.',
    icon: <UsersIcon className="w-8 h-8 text-amber-500" />
  },
  {
    id: 2, category: 'arab', title: 'المجلس العربي للتعليم والتدريب', org: 'ACET',
    desc: 'اعتماد البرامج التدريبية وفق معايير الجودة العربية الموحدة.',
    icon: <Building2 className="w-8 h-8 text-amber-500" />
  },
  {
    id: 3, category: 'arab', title: 'مركز الجودة العربي', org: 'Arab Quality Center',
    desc: 'شهادة جودة في تصميم الحقائب التدريبية والمحتوى التعليمي.',
    icon: <ShieldCheck className="w-8 h-8 text-amber-500" />
  },
  
  // International Entities
  {
    id: 4, category: 'global', title: 'مجلس معايير التدريب الدولي', org: 'ITSB',
    desc: 'اعتماد دولي لمعايير التدريب المهني والاحترافي (International Training Standards Board).',
    icon: <Globe className="w-8 h-8 text-blue-400" />
  },
  {
    id: 5, category: 'global', title: 'المجلس العالمي لتطوير المهارات', org: 'GSDC',
    desc: 'شراكة لتطوير المهارات الرقمية والتقنية (Global Skills Development Council).',
    icon: <Award className="w-8 h-8 text-blue-400" />
  },
  {
    id: 6, category: 'global', title: 'البورد الأوروبي للتدريب', org: 'EBTD',
    desc: 'اعتماد مهني أوروبي للبرامج التدريبية المتخصصة (European Board for Training & Development).',
    icon: <Landmark className="w-8 h-8 text-blue-400" />
  },

  // Tech
  {
    id: 7, category: 'tech', title: 'Microsoft Gold Partner', org: 'Microsoft Education',
    desc: 'شريك ذهبي في حلول التعليم السحابي والذكاء الاصطناعي.',
    icon: <Cpu className="w-8 h-8 text-purple-400" />
  },
  {
    id: 8, category: 'tech', title: 'Google Cloud Authorized', org: 'Google Cloud',
    desc: 'شريك تدريبي معتمد لتقنيات السحابة والبيانات.',
    icon: <Cpu className="w-8 h-8 text-orange-400" />
  },
  
  // Professional Memberships
  {
    id: 9, category: 'academic', title: 'الرابطة الدولية لجودة التدريب', org: 'IAQT',
    desc: 'عضوية الرابطة الدولية لضمان جودة التدريب (International Association for Quality Training).',
    icon: <BookOpen className="w-8 h-8 text-emerald-400" />
  },
  {
    id: 10, category: 'academic', title: 'IEEE Education Society', org: 'IEEE',
    desc: 'عضوية مؤسسية في جمعية هندسة التعليم الدولية.',
    icon: <Award className="w-8 h-8 text-blue-600" />
  }
];

export const AccreditationsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('arab');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-xl transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0f172a] md:rounded-3xl shadow-2xl border border-amber-500/20 flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 p-8 border-b border-amber-500/30 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4"/> Global Accreditation
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">اعتمادات أكاديمية ميلاف مراد الدولية</h1>
                    <p className="text-blue-200 max-w-xl text-sm leading-relaxed">
                        تفخر الأكاديمية بحصولها على عدد من الاعتمادات المهنية والتحالفات التعليمية من جهات عربية ودولية، مما يعزز جودة البرامج ويضمن توافقها مع معايير التدريب العالمية.
                    </p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#0f172a] border-b border-white/10 px-6 py-2 flex gap-4 overflow-x-auto shrink-0">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                        activeTab === cat.id 
                        ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {cat.icon}
                    {cat.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-[#0f172a] to-slate-900">
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {ACCREDITATIONS.filter(item => item.category === activeTab).map(item => (
                    <div key={item.id} className="group bg-[#1e293b]/50 border border-white/5 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-1 relative overflow-hidden">
                        
                        {/* Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-colors">
                                    {item.icon}
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                            <div className="text-xs text-amber-500 font-mono mb-4 uppercase tracking-wider">{item.org}</div>
                            
                            <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                {item.desc}
                            </p>
                            
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                                <span className="text-gray-500">Ref: {item.category.toUpperCase()}-{item.id}002</span>
                                <span className="text-amber-500 font-bold group-hover:underline cursor-pointer">تحقق</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Why Us Section */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400"/> ما يميز اعتماد الأكاديمية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-black/20 p-4 rounded-xl">
                        <h4 className="text-amber-400 font-bold text-sm mb-2">عالمي غير مقيد</h4>
                        <p className="text-xs text-gray-400">اعتماد مهني دولي غير مرتبط بنظام دولة واحدة.</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl">
                        <h4 className="text-amber-400 font-bold text-sm mb-2">مقبول عربياً</h4>
                        <p className="text-xs text-gray-400">صالح للاستخدام في أغلب الدول العربية كتدريب مهني.</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl">
                        <h4 className="text-amber-400 font-bold text-sm mb-2">تقييم مهني</h4>
                        <p className="text-xs text-gray-400">يعتمد على الجدارات المهنية لا النظام الأكاديمي التقليدي.</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl">
                        <h4 className="text-amber-400 font-bold text-sm mb-2">قابل للتحقق</h4>
                        <p className="text-xs text-gray-400">شهادات ذكية قابلة للتحقق الفوري عبر QR Code.</p>
                    </div>
                </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-xl flex gap-4 items-start">
                <FileWarning className="w-8 h-8 text-amber-500 shrink-0 mt-1"/>
                <div>
                    <h4 className="text-amber-400 font-bold text-sm mb-2">تنويه قانوني هام</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        الشهادات والبرامج المقدمة عبر أكاديمية ميلاف هي برامج تدريبية مهنية، وليست درجات أكاديمية جامعية (مثل البكالوريوس أو الماجستير الأكاديمي)، وتعتمد على تطوير المهارات الوظيفية. قد تختلف قابلية استخدامها والاعتراف بها حسب الأنظمة واللوائح الداخلية في كل دولة أو جهة عمل. يتحمل المتدرب مسؤولية التأكد من مدى قبول البرنامج في الجهة التي يرغب بتقديم الشهادة لها.
                    </p>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0f172a] text-center text-[10px] text-gray-500">
            تعتمد الأكاديمية معايير (ITSB) و (GSDC) في ضمان جودة التدريب.
        </div>

      </div>
    </div>
  );
};

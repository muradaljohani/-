
import React, { useState } from 'react';
import { X, Globe, ArrowRight, Clock, Award, Star, CheckCircle2, Layout, BookOpen, ChevronLeft, MapPin } from 'lucide-react';
import { CertificatePreviewModal } from './CertificatePreviewModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PROGRAMS = [
  {
    id: 1,
    title: 'Global Mini-MBA',
    titleAr: 'ماجستير إدارة الأعمال المصغر الدولي',
    category: 'Business',
    level: 'Advanced',
    duration: '3 Months',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070', // Architecture/Business
    desc: 'برنامج تنفيذي مكثف مصمم للقادة والمدراء، يغطي استراتيجيات الإدارة الحديثة، القيادة الرقمية، والابتكار المؤسسي وفق المعايير الدولية.',
    modules: ['الإدارة الاستراتيجية', 'القيادة الرقمية', 'التسويق الدولي', 'الإدارة المالية'],
    certType: 'Professional Diploma'
  },
  {
    id: 2,
    title: 'Artificial Intelligence Masterclass',
    titleAr: 'الماجستير المهني في الذكاء الاصطناعي',
    category: 'Technology',
    level: 'Expert',
    duration: '6 Months',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1965', // Abstract AI
    desc: 'برنامج متقدم يدمج بين النظريات العميقة والتطبيق العملي لبناء نماذج الذكاء الاصطناعي التوليدي والتعلم العميق.',
    modules: ['الشبكات العصبية', 'معالجة اللغات الطبيعية', 'الرؤية الحاسوبية', 'أخلاقيات AI'],
    certType: 'Master Certificate'
  },
  {
    id: 3,
    title: 'Cybersecurity Defense Analyst',
    titleAr: 'محلل دفاع الأمن السيبراني الدولي',
    category: 'Security',
    level: 'Advanced',
    duration: '4 Months',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=2000', // Server/Tech
    desc: 'تأهيل شامل في عمليات مراكز الدفاع الأمني (SOC) والاستجابة للحوادث السيبرانية باستخدام أحدث التقنيات العالمية.',
    modules: ['تحليل التهديدات', 'الطب الشرعي الرقمي', 'تأمين الشبكات', 'الهاكر الأخلاقي'],
    certType: 'Professional Certification'
  },
  {
    id: 4,
    title: 'Digital Transformation Leadership',
    titleAr: 'قيادة التحول الرقمي',
    category: 'Management',
    level: 'Executive',
    duration: '2 Months',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070', // Tech/Team
    desc: 'كيف تقود مؤسستك نحو المستقبل الرقمي؟ برنامج يركز على استراتيجيات التغيير والتبني التقني في المؤسسات الكبرى.',
    modules: ['استراتيجيات التحول', 'الحوسبة السحابية', 'إدارة التغيير', 'الابتكار المفتوح'],
    certType: 'Executive Certificate'
  }
];

export const InternationalProgramsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [showCertPreview, setShowCertPreview] = useState(false);

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[#0f172a] transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full h-full md:max-w-[95vw] md:h-[95vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        
        {/* TOP BAR */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
             <div className="pointer-events-auto">
                 <button onClick={onClose} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                     <X className="w-6 h-6"/>
                 </button>
             </div>
             {selectedProgram && (
                 <button onClick={() => setSelectedProgram(null)} className="pointer-events-auto px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold text-sm flex items-center gap-2 hover:bg-white/20">
                     <ChevronLeft className="w-4 h-4 rtl:rotate-180"/> العودة للقائمة
                 </button>
             )}
        </div>

        {selectedProgram ? (
            /* --- DETAIL VIEW --- */
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-gray-50">
                {/* Hero Side */}
                <div className="w-full md:w-1/2 h-64 md:h-full relative shrink-0">
                    <img src={selectedProgram.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0f172a]/40"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent text-white">
                         <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">{selectedProgram.category}</span>
                         <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{selectedProgram.titleAr}</h2>
                         <p className="text-lg text-gray-300 font-light">{selectedProgram.title}</p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-xl mx-auto space-y-10">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">تفاصيل البرنامج</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">{selectedProgram.desc}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                 <Clock className="w-5 h-5 text-blue-600 mb-2"/>
                                 <div className="text-xs text-gray-500 uppercase">المدة</div>
                                 <div className="font-bold text-gray-900">{selectedProgram.duration}</div>
                             </div>
                             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                 <Award className="w-5 h-5 text-amber-500 mb-2"/>
                                 <div className="text-xs text-gray-500 uppercase">الشهادة</div>
                                 <div className="font-bold text-gray-900">{selectedProgram.certType}</div>
                             </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">الوحدات الدراسية</h3>
                            <ul className="space-y-3">
                                {selectedProgram.modules.map((mod: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">{idx+1}</div>
                                        <span className="text-gray-700 font-medium">{mod}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#0f172a] rounded-2xl p-6 text-white flex justify-between items-center shadow-xl">
                            <div>
                                <h4 className="font-bold text-lg mb-1">الشهادة الدولية المعتمدة</h4>
                                <p className="text-xs text-gray-400">شاهد نموذج الشهادة التي ستحصل عليها</p>
                            </div>
                            <button onClick={() => setShowCertPreview(true)} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-bold transition-colors">
                                استعراض الشهادة
                            </button>
                        </div>

                        <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all">
                            التسجيل في البرنامج الآن
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            /* --- CATALOG VIEW --- */
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0f172a]">
                {/* Hero Banner */}
                <div className="h-64 md:h-80 relative shrink-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-[#0f172a]/20 to-[#0f172a]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <span className="text-amber-400 font-bold tracking-[0.3em] uppercase text-xs mb-4 border border-amber-500/30 px-4 py-1 rounded-full backdrop-blur-md">Global Education</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 shadow-black drop-shadow-2xl">برامج دولية للعالم العربي</h1>
                        <p className="text-gray-300 max-w-xl text-lg">ارتقِ بمسارك المهني مع برامج تدريبية مُصممة وفق أرقى المعايير العالمية.</p>
                    </div>
                </div>

                {/* Programs Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
                        {PROGRAMS.map(prog => (
                            <div key={prog.id} onClick={() => setSelectedProgram(prog)} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg border border-white/5">
                                <img src={prog.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity"></div>
                                
                                <div className="absolute top-4 left-4">
                                     <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">{prog.category}</span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                    <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Globe className="w-3 h-3"/> International Program
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{prog.titleAr}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{prog.desc}</p>
                                    
                                    <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:text-blue-400 transition-colors">
                                        تفاصيل البرنامج <ArrowRight className="w-4 h-4 rtl:rotate-180"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
    
    <CertificatePreviewModal isOpen={showCertPreview} onClose={() => setShowCertPreview(false)} />
    </>
  );
};

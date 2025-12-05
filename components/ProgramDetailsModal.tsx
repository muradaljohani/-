
import React from 'react';
import { X, CheckCircle2, Globe, AlertTriangle, BookOpen, GraduationCap, MapPin, Scale, FileWarning } from 'lucide-react';

interface Program {
    id: string;
    title: string;
    level: string;
    description: string;
    image: string;
    modules: string[];
}

interface Props {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProgramDetailsModal: React.FC<Props> = ({ program, isOpen, onClose }) => {
  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Hero Image */}
        <div className="h-48 md:h-64 relative shrink-0">
             <img src={program.image} className="w-full h-full object-cover" alt={program.title} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
             <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors"><X className="w-6 h-6"/></button>
             <div className="absolute bottom-6 right-6 md:right-8">
                 <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">{program.level}</span>
                 <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">{program.title}</h2>
             </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"><BookOpen className="text-blue-600"/> وصف البرنامج</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{program.description}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">محاور الدراسة</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {program.modules.map((mod, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> {mod}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><GraduationCap/> الاعتماد المهني الدولي</h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            تعتمد أكاديمية ميلاف الدولية نموذج التعليم المفتوح المعتمد على التحالفات المهنية والاعتمادات التدريبية من جهات عربية ودولية متخصصة. نقدم جميع برامجنا بصفتها برامج تدريبية ومهنية تهدف لتطوير المهارات، وقد تختلف طريقة الاعتراف بها حسب قوانين كل دولة.
                        </p>
                    </div>
                </div>

                {/* Sidebar: LEGAL DISCLAIMER */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Scale className="w-5 h-5"/> سياسة الاعتماد</h3>
                        
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex gap-3">
                                <Globe className="w-5 h-5 text-blue-500 shrink-0"/>
                                <div>
                                    <span className="block font-bold text-gray-800">نطاق البرنامج</span>
                                    <p>برنامج تدريبي مهني (Professional Training) يهدف لرفع الكفاءة الوظيفية والمهارية.</p>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-200"></div>

                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-2 text-amber-800 text-xs mt-4 items-start">
                                <FileWarning className="w-5 h-5 shrink-0 mt-0.5"/>
                                <div>
                                    <span className="font-bold block mb-1">تنويه هام:</span>
                                    <p>الشهادات المقدمة هي شهادات إتمام تدريب مهني وليست درجات أكاديمية جامعية. يتحمل المتدرب مسؤولية التأكد من قبولها في جهة عمله.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                        إغلاق
                    </button>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

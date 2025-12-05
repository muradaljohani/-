
import React, { useState } from 'react';
import { X, Printer, ChevronRight, QrCode, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AssetProcessor } from '../services/System/AssetProcessor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PROGRAMS = [
  { id: 'ai', title: 'Professional Diploma in AI', titleAr: 'الدبلوم المهني في الذكاء الاصطناعي', code: 'AI-DIP-2025' },
  { id: 'cyber', title: 'Cybersecurity Expert', titleAr: 'خبير الأمن السيبراني', code: 'CYB-EXP-2025' },
  { id: 'mba', title: 'Mini-MBA Program', titleAr: 'برنامج إدارة الأعمال المصغر', code: 'MBA-EXE-2025' },
];

export const CertificatePreviewModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { adminConfig } = useAuth();
  const [activeProgram, setActiveProgram] = useState(SAMPLE_PROGRAMS[0]);
  const assetProcessor = AssetProcessor.getInstance();

  if (!isOpen) return null;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-0 md:p-4 print:p-0">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      {/* Main Container */}
      <div className="relative w-full h-full md:max-w-7xl md:h-[95vh] bg-[#0f172a] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row print:w-full print:h-full print:bg-white print:static">
        
        {/* Sidebar (Hidden in Print) */}
        <div className="w-full md:w-80 bg-gray-900 border-b md:border-b-0 md:border-l border-white/10 flex flex-col print:hidden shadow-2xl z-20 shrink-0">
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-slate-900 to-[#0f172a]">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="text-amber-500 w-6 h-6" /> نماذج الشهادات
                </h2>
                <p className="text-xs text-gray-400 mt-2">اختر نموذجاً للمعاينة الحية.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {SAMPLE_PROGRAMS.map((prog) => (
                    <button
                        key={prog.id}
                        onClick={() => setActiveProgram(prog)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            activeProgram.id === prog.id 
                            ? 'bg-blue-900/40 border-amber-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        <div className="text-right">
                            <div className="font-bold text-sm">{prog.titleAr}</div>
                            <div className="text-[10px] opacity-70 font-mono mt-0.5">{prog.title}</div>
                        </div>
                        {activeProgram.id === prog.id && <ChevronRight className="w-4 h-4 text-amber-500 rtl:rotate-180" />}
                    </button>
                ))}
            </div>

            <div className="p-4 bg-black/20 border-t border-white/10">
                <button onClick={onClose} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                    إغلاق المعاينة
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1e293b] relative overflow-hidden flex flex-col print:w-full print:h-full print:bg-white items-center justify-center p-4">
            
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-50 flex gap-2 print:hidden">
                 <button onClick={handlePrint} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 transition-all">
                     <Printer className="w-4 h-4" /> طباعة
                 </button>
                 <button onClick={onClose} className="p-2 bg-black/50 text-white rounded-lg hover:bg-white/10 md:hidden">
                     <X className="w-5 h-5"/>
                 </button>
            </div>

            {/* SCALABLE WRAPPER */}
            <div className="relative w-full flex justify-center h-[230px] xs:h-[280px] sm:h-[400px] md:h-[550px] lg:h-[700px] xl:h-[794px] transition-all duration-300 print:h-full print:block">
            
                {/* CERTIFICATE CANVAS */}
                <div 
                    className="absolute top-0 shadow-2xl print:shadow-none origin-top transform transition-transform duration-300
                               scale-[0.28] xs:scale-[0.34] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.85] xl:scale-100 print:scale-100 print:relative print:transform-none"
                    style={{ 
                        width: '1123px', 
                        height: '794px',
                        backgroundColor: '#fdfbf7',
                        color: '#1f2937',
                        fontFamily: "'Tajawal', 'Amiri', serif",
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* LAYERS */}
                    <div className="absolute top-[10mm] left-[10mm] right-[10mm] bottom-[10mm] border-2 border-[#1e3a8a] z-10 pointer-events-none"></div>
                    <div className="absolute top-[12mm] left-[12mm] right-[12mm] bottom-[12mm] border-4 border-double border-[#d97706] z-10 pointer-events-none"></div>
                    <div className="absolute top-[10mm] right-[10mm] w-[40mm] h-[40mm] border-t-8 border-r-8 border-[#1e3a8a] rounded-tr-[15px] z-20"></div>
                    <div className="absolute top-[10mm] left-[10mm] w-[40mm] h-[40mm] border-t-8 border-l-8 border-[#1e3a8a] rounded-tl-[15px] z-20"></div>
                    <div className="absolute bottom-[10mm] right-[10mm] w-[40mm] h-[40mm] border-b-8 border-r-8 border-[#1e3a8a] rounded-br-[15px] z-20"></div>
                    <div className="absolute bottom-[10mm] left-[10mm] w-[40mm] h-[40mm] border-b-8 border-l-8 border-[#1e3a8a] rounded-bl-[15px] z-20"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-[400px] font-black text-[#1e3a8a] z-0 pointer-events-none select-none">M</div>

                    {/* CONTENT */}
                    <div className="relative z-30 h-full flex flex-col px-[80px] py-[60px] justify-between">
                        
                        {/* Header */}
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center gap-[15px] mb-[10px]">
                                <div className="w-[50px] h-[50px] bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-[28px] font-bold border-4 border-[#d97706]">M</div>
                                <div className="text-right">
                                    <div className="font-black text-[#1e3a8a] text-[16px]">أكاديمية ميلاف مراد</div>
                                    <div className="text-[10px] text-[#d97706] tracking-[1px] font-bold uppercase">MYLAF MURAD ACADEMY</div>
                                </div>
                            </div>
                            <h1 className="text-[42px] text-[#1e3a8a] m-0 font-bold" style={{fontFamily: 'Amiri, serif'}}>شهادة معتمدة</h1>
                            <div className="text-[12px] tracking-[5px] text-[#d97706] uppercase font-bold mt-[2px]">CERTIFICATE OF COMPLETION</div>
                        </div>

                        {/* Body Text */}
                        <div className="flex flex-col items-center text-center gap-[15px] flex-grow justify-center">
                            <p className="text-[20px] text-[#666] m-0 font-medium font-serif">تشهد أكاديمية ميلاف مراد للتدريب والتطوير بأن المتدرب/ة:</p>
                            
                            <div className="text-[40px] text-[#1f2937] font-bold border-b border-[#ddd] pb-[5px] px-8 min-w-[300px]" style={{fontFamily: 'Amiri, serif'}}>
                                [اسم المتدرب هنا]
                            </div>
                            
                            <div className="text-[18px] text-[#4b5563] leading-[1.8] font-serif max-w-[800px]">
                                قد أتم/ت بنجاح متطلبات البرنامج التدريبي بعنوان:
                                <div className="text-[#1e3a8a] font-black text-[24px] my-[8px]">{activeProgram.titleAr}</div>
                                وذلك خلال الفترة من <b>2025/01/01</b> إلى <b>2025/06/01</b>، بواقع (120) ساعة تدريبية.
                                <br/>
                                وقد مُنح هذه الشهادة اجتيازاً لكافة المتطلبات المقررة، متمنين له/لها دوام التوفيق والنجاح.
                            </div>
                        </div>

                        {/* Footer */}
                        <div>
                            <div className="flex justify-between items-end mb-[20px] px-[20px]">
                                {/* Right */}
                                <div className="text-center w-[220px]">
                                    <div className="h-[60px] mb-[5px] flex items-end justify-center relative">
                                        <img 
                                            src={assetProcessor.getOfficialSignature()} 
                                            alt="Signature" 
                                            className="h-full object-contain absolute bottom-0"
                                            style={{...assetProcessor.getSignatureStyle(), zIndex: 2}} 
                                        />
                                    </div>
                                    <div className="border-t-2 border-[#1e3a8a] pt-[5px]">
                                        <div className="font-bold text-[#1e3a8a] text-[14px]">المدير التنفيذي</div>
                                        <div className="text-[16px] text-[#1f2937] font-bold font-serif">أ. مراد الجهني</div>
                                    </div>
                                </div>

                                {/* Center */}
                                <div className="text-center w-[180px]">
                                    <div className="h-[100px] flex items-center justify-center">
                                        <img 
                                            src={assetProcessor.getOfficialSeal()} 
                                            alt="Stamp"
                                            className="w-[120px] opacity-90 mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="text-[10px] text-[#d97706] font-bold mt-1 uppercase tracking-widest">Official Stamp</div>
                                </div>

                                {/* Left */}
                                <div className="text-center w-[220px]">
                                    <div className="h-[60px] mb-[5px] flex items-end justify-center">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PREVIEW_MODE`} className="w-[60px] h-[60px] border border-[#ddd] p-[2px] bg-white block" alt="QR Code" />
                                    </div>
                                    <div className="border-t-2 border-[#1e3a8a] pt-[5px]">
                                        <div className="font-bold text-[#1e3a8a] text-[12px]">حرر بتاريخ: 2025/12/04م</div>
                                        <div className="text-[10px] text-[#666]">رمز التحقق (Scan to Verify)</div>
                                    </div>
                                </div>
                            </div>

                            {/* Partners */}
                            <div className="border-t border-[#ddd] pt-[10px]">
                                <p className="text-[10px] text-[#666] mb-[5px] font-bold text-center">شركاء النجاح الاستراتيجيين:</p>
                                <div className="flex justify-center items-center gap-[40px] opacity-70 grayscale">
                                    <div className="text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[14px]">🇸🇦</span> وزارة الموارد البشرية</div>
                                    <div className="text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[14px]">🎯</span> هدف (Hadaf)</div>
                                    <div className="text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[14px]">👁️</span> رؤية 2030</div>
                                    <div className="text-[10px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[14px]">🛡️</span> الأمن السيبراني</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

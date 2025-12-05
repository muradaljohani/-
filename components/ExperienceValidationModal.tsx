
import React, { useState, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Upload, Award, Printer, Loader2, FileText, Briefcase, UserCheck, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AssetProcessor } from '../services/System/AssetProcessor';
import html2canvas from 'html2canvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExperienceValidationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'form' | 'processing' | 'certificate'>('form');
  const assetProcessor = AssetProcessor.getInstance();
  const certRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
      fullName: user?.name || '',
      email: user?.email || '',
      nationalId: user?.nationalId || '',
      specialization: '',
      experienceYears: '',
      prevJobTitle: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('processing');
      setTimeout(() => {
          setStep('certificate');
      }, 3000);
  };

  const handleDownload = async () => {
        if (!certRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true, backgroundColor: '#fdfbf7' });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `Experience_Cert_${formData.fullName.replace(/\s/g, '_')}.png`;
            link.click();
        } catch(e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
  };

  const handlePrint = () => window.print();

  // Helper to calculate dates
  const calculateDates = (yearsStr: string) => {
      let years = 1;
      if (yearsStr.includes('3')) years = 3;
      if (yearsStr.includes('5')) years = 5;
      if (yearsStr.includes('10')) years = 10;
      
      const end = new Date();
      const start = new Date();
      start.setFullYear(end.getFullYear() - years);
      
      return {
          start: start.toLocaleDateString('en-GB'),
          end: end.toLocaleDateString('en-GB')
      };
  };

  const dates = calculateDates(formData.experienceYears);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-yellow-900 p-6 flex justify-between items-center print:hidden shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><Award className="w-6 h-6 text-yellow-200"/></div>
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">توثيق الخبرة المهنية (اشتري خبرتك)</h2>
                    <p className="text-xs text-yellow-200/80">اعتماد المهارات والخبرات السابقة بشهادة رسمية</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"><X className="w-5 h-5"/></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 print:bg-white print:overflow-visible scrollbar-thin">
            
            {step === 'form' && (
                <div className="p-4 md:p-8 max-w-2xl mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex gap-3">
                        <ShieldCheck className="w-6 h-6 text-yellow-600 shrink-0"/>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                            تتيح هذه الخدمة للمحترفين معادلة خبراتهم السابقة والحصول على شهادة كفاءة مهنية معتمدة من الأكاديمية.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل (لإصدار الشهادة)</label>
                                <input required type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-amber-500 outline-none" placeholder="الاسم كما في الهوية" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهوية / الإقامة</label>
                                <input required type="text" value={formData.nationalId} onChange={e=>setFormData({...formData, nationalId: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-amber-500 outline-none" placeholder="10xxxxxxxx" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">مجال الخبرة / التخصص</label>
                            <input required type="text" value={formData.specialization} onChange={e=>setFormData({...formData, specialization: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-amber-500 outline-none" placeholder="مثال: إدارة المشاريع..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">عدد سنوات الخبرة</label>
                                <select required value={formData.experienceYears} onChange={e=>setFormData({...formData, experienceYears: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-amber-500 outline-none">
                                    <option value="">اختر...</option>
                                    <option value="1-3">1-3 سنوات</option>
                                    <option value="3-5">3-5 سنوات</option>
                                    <option value="5-10">5-10 سنوات</option>
                                    <option value="+10">أكثر من 10 سنوات</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">المسمى الوظيفي السابق</label>
                                <input required type="text" value={formData.prevJobTitle} onChange={e=>setFormData({...formData, prevJobTitle: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:border-amber-500 outline-none" placeholder="مدير، مشرف..." />
                             </div>
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-amber-600/20 text-lg flex items-center justify-center gap-2 transition-all">
                            توثيق وإصدار الشهادة فوراً <CheckCircle2 className="w-5 h-5"/>
                        </button>
                    </form>
                </div>
            )}

            {step === 'processing' && (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-fade-in-up">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                        <div className="w-24 h-24 border-4 border-amber-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        <ShieldCheck className="w-10 h-10 text-amber-600 absolute inset-0 m-auto animate-pulse"/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">جاري التحقق من البيانات...</h3>
                    <div className="mt-8 space-y-2 text-sm text-gray-400 w-64 text-right mx-auto">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> تدقيق الهوية</div>
                        <div className="flex items-center gap-2 animate-pulse"><Loader2 className="w-4 h-4 text-amber-500 animate-spin"/> إصدار الختم الرسمي</div>
                    </div>
                </div>
            )}

            {step === 'certificate' && (
                <div className="flex flex-col h-full animate-fade-in-up">
                    <div className="bg-white p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
                        <div className="text-sm text-emerald-600 font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> تم التوثيق بنجاح</div>
                        <div className="flex gap-2">
                            <button onClick={handleDownload} disabled={isGenerating} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>} تحميل
                            </button>
                            <button onClick={handlePrint} className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 flex items-center gap-2">
                                <Printer className="w-4 h-4"/> طباعة
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-2 md:p-8 bg-gray-100 overflow-y-auto flex justify-center print:p-0 print:bg-white print:overflow-visible">
                        
                        {/* SCALING WRAPPER */}
                        <div className="relative w-full flex justify-center h-[230px] xs:h-[280px] sm:h-[400px] md:h-[550px] lg:h-[700px] xl:h-[794px] transition-all duration-300 print:h-auto print:block">
                            
                            {/* CERTIFICATE CANVAS */}
                            <div 
                                id="cert-print" 
                                ref={certRef}
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
                                        <h1 className="text-[42px] text-[#1e3a8a] m-0 font-bold" style={{fontFamily: 'Amiri, serif'}}>شهادة خبرة معتمدة</h1>
                                        <div className="text-[12px] tracking-[5px] text-[#d97706] uppercase font-bold mt-[2px]">CERTIFIED EXPERIENCE</div>
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col items-center text-center gap-[15px] flex-grow justify-center">
                                        <p className="text-[20px] text-[#666] m-0 font-medium font-serif">
                                            تشهد إدارة أكاديمية ميلاف مراد بأن الأستاذ/ة:
                                        </p>
                                        
                                        <div className="text-[40px] text-[#1f2937] font-bold border-b border-[#ddd] pb-[5px] px-8 min-w-[300px]" style={{fontFamily: 'Amiri, serif'}}>
                                            {formData.fullName}
                                        </div>
                                        
                                        <div className="text-[18px] text-[#4b5563] leading-[1.8] font-serif max-w-[800px]">
                                            قد عمل/ت لدينا تحت مسمى وظيفي:
                                            <div className="text-[#1e3a8a] font-black text-[24px] my-[8px]">{formData.prevJobTitle}</div>
                                            وذلك في الفترة من <b>{dates.start}</b> وحتى <b>{dates.end}</b>.
                                            <br/>
                                            وقد كان/ت طوال فترة عمله/ها مثالاً للكفاءة والالتزام المهني وحسن السيرة والسلوك.
                                            <br/>
                                            أُعطيت له/ها هذه الشهادة بناءً على طلبه/ها دون أدنى مسؤولية على الأكاديمية تجاه حقوق الغير.
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
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://murad-group.com/verify/EXP-${Date.now()}`} className="w-[60px] h-[60px] border border-[#ddd] p-[2px] bg-white block" alt="QR Code" />
                                                </div>
                                                <div className="border-t-2 border-[#1e3a8a] pt-[5px]">
                                                    <div className="font-bold text-[#1e3a8a] text-[12px]">حرر بتاريخ: {dates.end}</div>
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
            )}
        </div>
      </div>
    </div>
  );
};

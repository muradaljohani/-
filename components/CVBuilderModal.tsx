
import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Upload, Briefcase, User, GraduationCap, Layout, CreditCard, ChevronLeft, ChevronRight, Download, Loader2, Star, Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentGateway } from './PaymentGateway';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES = [
    { id: 'modern', name: 'الاحترافي الحديث', desc: 'تصميم نظيف وعصري يناسب الشركات التقنية والناشئة.', color: 'from-blue-600 to-blue-800' },
    { id: 'classic', name: 'الكلاسيكي الرسمي', desc: 'تصميم تقليدي يناسب القطاعات الحكومية والأكاديمية.', color: 'from-slate-700 to-slate-900' },
    { id: 'creative', name: 'الإبداعي المبتكر', desc: 'تصميم جريء يناسب المصممين والمسوقين.', color: 'from-purple-600 to-pink-700' },
];

export const CVBuilderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, submitCVRequest } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      jobTitle: '',
      summary: '',
      experience: '',
      skills: '',
      templateId: 'modern'
  });
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const PRICE = 49; // SAR

  const handleNext = () => {
      if (step === 1 && (!formData.fullName || !formData.jobTitle)) return alert("يرجى إكمال البيانات الأساسية");
      if (step < 3) setStep(step + 1);
  };

  const handlePaymentSuccess = (txn: any) => {
      setIsPaymentOpen(false);
      setStep(4);
      setIsProcessing(true);
      
      // Simulate Processing Delay
      setTimeout(() => {
          submitCVRequest({
              fullName: formData.fullName,
              jobTitle: formData.jobTitle,
              templateId: formData.templateId,
              paymentReceipt: txn.id
          });
          setIsProcessing(false);
          setIsCompleted(true);
      }, 3000);
  };

  return (
    <>
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full md:max-w-5xl bg-[#0f172a] border border-white/10 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full md:h-[90vh] animate-fade-in-up font-sans text-right" dir="rtl">
        
        {/* Header */}
        <div className="bg-[#1e293b]/50 border-b border-white/10 p-6 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <FileText className="w-6 h-6"/>
                </div>
                <div>
                    <h2 className="text-white font-bold text-xl">بناء السيرة الذاتية الاحترافية</h2>
                    <p className="text-blue-300 text-xs font-medium">تصميم وتنسيق تلقائي مع خبراء التوظيف</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6"/></button>
        </div>

        {/* Steps Progress */}
        <div className="bg-black/20 p-6 flex justify-center border-b border-white/5">
            <div className="flex items-center w-full max-w-2xl relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -z-10 rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step-1)/3)*100}%` }}></div>

                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex-1 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all duration-300 ${step >= s ? 'border-blue-500 bg-[#0f172a] text-blue-400 scale-110' : 'border-gray-700 bg-[#0f172a] text-gray-500'}`}>
                            {step > s ? <CheckCircle2 className="w-6 h-6"/> : s}
                        </div>
                        <span className={`text-[10px] mt-2 font-bold ${step >= s ? 'text-blue-400' : 'text-gray-600'}`}>
                            {s===1 ? 'البيانات' : s===2 ? 'القالب' : s===3 ? 'الدفع' : 'الاستلام'}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
            
            {step === 1 && (
                <div className="max-w-4xl mx-auto animate-fade-in-up">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><User className="w-6 h-6 text-blue-400"/> البيانات الشخصية والمهنية</h3>
                        <p className="text-gray-400 text-sm">أدخل بياناتك بدقة، وسيقوم نظامنا بتنسيقها بشكل احترافي.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">الاسم الكامل</label>
                                <input type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="مثال: محمد عبدالله"/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">المسمى الوظيفي المستهدف</label>
                                <input type="text" value={formData.jobTitle} onChange={e=>setFormData({...formData, jobTitle: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="مثال: مدير مشاريع، محاسب..."/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 pl-10 text-white outline-none focus:border-blue-500 transition-all shadow-inner"/>
                                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-500"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">رقم الجوال</label>
                                <div className="relative">
                                    <input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 pl-10 text-white outline-none focus:border-blue-500 transition-all shadow-inner"/>
                                    <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-500"/>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">الملخص المهني (Summary)</label>
                                <textarea value={formData.summary} onChange={e=>setFormData({...formData, summary: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all h-32 resize-none shadow-inner" placeholder="نبذة مختصرة عن خبراتك وأهدافك المهنية..."/>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-300 mb-2 block">المهارات (افصل بينها بفاصلة)</label>
                                <textarea value={formData.skills} onChange={e=>setFormData({...formData, skills: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all h-24 resize-none shadow-inner" placeholder="إدارة الوقت، القيادة، البرمجة، التصميم..."/>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-5xl mx-auto animate-fade-in-up">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-white mb-2">اختر القالب المثالي</h3>
                        <p className="text-gray-400">تصاميم معتمدة من قبل خبراء الموارد البشرية (HR Approved)</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TEMPLATES.map(tmpl => (
                            <div 
                                key={tmpl.id} 
                                onClick={() => setFormData({...formData, templateId: tmpl.id})}
                                className={`group cursor-pointer rounded-3xl border-2 p-4 transition-all duration-300 relative overflow-hidden ${formData.templateId === tmpl.id ? 'border-blue-500 bg-white/5 shadow-2xl scale-105' : 'border-white/10 hover:border-white/30 bg-[#0f172a]'}`}
                            >
                                <div className={`aspect-[1/1.4] bg-gradient-to-br ${tmpl.color} rounded-2xl mb-6 shadow-lg relative overflow-hidden transform group-hover:scale-[1.02] transition-transform`}>
                                    {/* Abstract CV Visual */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-[2px]"></div>
                                    <div className="absolute top-6 left-6 w-16 h-16 bg-white/20 rounded-full backdrop-blur-md shadow-lg"></div>
                                    <div className="absolute top-8 right-6 w-32 h-4 bg-white/20 rounded-full"></div>
                                    <div className="absolute top-14 right-6 w-20 h-3 bg-white/10 rounded-full"></div>
                                    
                                    <div className="absolute top-32 left-6 right-6 bottom-6 bg-white/90 rounded-xl p-4 shadow-xl">
                                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                                        <div className="w-3/4 h-2 bg-gray-200 rounded mb-4"></div>
                                        <div className="w-full h-32 bg-gray-100 rounded"></div>
                                    </div>
                                    
                                    {formData.templateId === tmpl.id && (
                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-sm transition-all">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5"/> تم الاختيار
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center px-2">
                                    <h4 className="font-bold text-white text-lg mb-2">{tmpl.name}</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed">{tmpl.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-lg mx-auto text-center space-y-8 animate-fade-in-up py-10">
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 mb-6">
                        <CreditCard className="w-16 h-16 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white mb-3">ملخص الطلب</h3>
                        <p className="text-gray-400 text-lg">احصل على سيرتك الذاتية الاحترافية بصيغة PDF عالية الجودة فوراً.</p>
                    </div>
                    
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-xl backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
                            <span className="text-gray-300 font-medium">تصميم سيرة ذاتية (قالب {TEMPLATES.find(t=>t.id===formData.templateId)?.name})</span>
                            <span className="text-white font-bold text-lg">{PRICE} ر.س</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-amber-400">
                            <span>الإجمالي المستحق</span>
                            <span>{PRICE} ر.س</span>
                        </div>
                    </div>
                    
                    <button onClick={() => setIsPaymentOpen(true)} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 group">
                        ادفع الآن واستلم السيرة <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform"/>
                    </button>
                    
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-3 h-3"/> ضمان الرضا 100%
                    </p>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up py-10">
                    {isProcessing ? (
                        <>
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-gray-700"></div>
                                <div className="w-32 h-32 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
                                <Loader2 className="w-12 h-12 text-blue-500 absolute inset-0 m-auto animate-pulse"/>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">جاري إنشاء السيرة الذاتية...</h3>
                                <p className="text-gray-400">يقوم الذكاء الاصطناعي بتنسيق بياناتك في القالب المختار.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce-slow">
                                <CheckCircle2 className="w-16 h-16 text-white"/>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white mb-4">تمت العملية بنجاح!</h3>
                                <p className="text-gray-300 max-w-md mx-auto text-lg leading-relaxed">
                                    سيرتك الذاتية جاهزة الآن. تم إرسال نسخة أيضاً إلى بريدك الإلكتروني 
                                    <span className="text-blue-400 font-bold block mt-1">{formData.email}</span>
                                </p>
                            </div>
                            <div className="flex gap-4 w-full max-w-md">
                                <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-600/30 transition-all">
                                    <Download className="w-6 h-6"/> تحميل PDF
                                </button>
                                <button onClick={onClose} className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all">
                                    إغلاق
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

        </div>

        {/* Footer Actions */}
        {step < 3 && (
            <div className="p-6 border-t border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex justify-between">
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="px-8 py-3 rounded-xl text-gray-400 hover:bg-white/10 font-bold transition-all flex items-center gap-2">
                        <ChevronRight className="w-5 h-5"/> السابق
                    </button>
                ) : <div></div>}
                
                <button onClick={handleNext} className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                    التالي <ChevronLeft className="w-5 h-5"/>
                </button>
            </div>
        )}

      </div>
    </div>

    <PaymentGateway 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={PRICE}
        title="خدمة السيرة الذاتية"
        description="تصميم سيرة ذاتية احترافية"
        onSuccess={handlePaymentSuccess}
    />
    </>
  );
};

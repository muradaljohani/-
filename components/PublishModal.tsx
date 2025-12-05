
import React, { useState, useRef } from 'react';
import { X, Upload, BookOpen, Briefcase, ShoppingBag, CheckCircle2, Building2, ChevronRight, FileText, Banknote, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type PublishType = 'Course' | 'Project' | 'Service';

export const PublishModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, publishUserContent } = useAuth();
  const [step, setStep] = useState<'select' | 'form' | 'payment' | 'success'>('select');
  const [selectedType, setSelectedType] = useState<PublishType | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'General',
      level: 'Intermediate',
      price: '',
      imageUrl: '',
      files: [] as File[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --- HANDLERS ---
  const handleTypeSelect = (type: PublishType) => {
      setSelectedType(type);
      setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!formData.title || !formData.description) return alert("يرجى إكمال جميع الحقول");
      setStep('payment');
  };

  const handlePaymentSubmit = async () => {
      if(!receiptFile) return alert("يرجى إرفاق إيصال التحويل");
      
      setIsProcessing(true);
      // Simulate API call
      const res = await publishUserContent(selectedType!, {
          ...formData,
          price: parseFloat(formData.price || '0'),
          receipt: receiptFile
      });
      setIsProcessing(false);

      if(res.success) {
          setStep('success');
      } else {
          alert(res.error);
      }
  };

  // --- RENDER STEPS ---

  // Step 1: Select Type
  const renderSelection = () => (
      <div className="p-8">
          <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2">انشر محتواك الآن</h2>
              <p className="text-gray-400 text-sm">اختر نوع المحتوى الذي تود نشره في منصة ميلاف الموحدة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Option 1: Course */}
              <button onClick={() => handleTypeSelect('Course')} className="bg-[#1e293b] border border-white/5 hover:border-blue-500 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-2 group shadow-xl hover:shadow-blue-900/20">
                  <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/30">
                      <BookOpen className="w-8 h-8"/>
                  </div>
                  <div className="text-center">
                      <h3 className="text-lg font-bold text-white mb-1">انشر دورتك</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">للمدربين والمعلمين. شارك معرفتك وقم ببيع دوراتك التدريبية.</p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      البدء الآن <ChevronRight className="w-3 h-3 rtl:rotate-180"/>
                  </div>
              </button>

              {/* Option 2: Project */}
              <button onClick={() => handleTypeSelect('Project')} className="bg-[#1e293b] border border-white/5 hover:border-blue-500 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-2 group shadow-xl hover:shadow-blue-900/20">
                  <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/30">
                      <Briefcase className="w-8 h-8"/>
                  </div>
                  <div className="text-center">
                      <h3 className="text-lg font-bold text-white mb-1">انشر مشروعك</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">للطلاب والباحثين. وثق مشاريعك الأكاديمية وأبحاثك.</p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      البدء الآن <ChevronRight className="w-3 h-3 rtl:rotate-180"/>
                  </div>
              </button>

              {/* Option 3: Service */}
              <button onClick={() => handleTypeSelect('Service')} className="bg-[#1e293b] border border-white/5 hover:border-blue-500 rounded-3xl p-6 flex flex-col items-center gap-4 transition-all hover:-translate-y-2 group shadow-xl hover:shadow-blue-900/20">
                  <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/30">
                      <ShoppingBag className="w-8 h-8"/>
                  </div>
                  <div className="text-center">
                      <h3 className="text-lg font-bold text-white mb-1">انشر خدمتك</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">للمستقلين والمحترفين. قدم خدماتك في سوق العمل.</p>
                  </div>
                  <div className="mt-2 text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      البدء الآن <ChevronRight className="w-3 h-3 rtl:rotate-180"/>
                  </div>
              </button>
          </div>

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"/>
              <p className="text-xs text-blue-200">
                  <span className="font-bold">تنبيه هام:</span> يتطلب نشر أي محتوى وجود حساب موثق وإتمام التحويل البنكي لرسوم النشر عبر حساب المؤسسة المعتمد (بنك الجزيرة) لضمان المصداقية.
              </p>
          </div>
      </div>
  );

  // Step 2: Details Form
  const renderForm = () => (
      <form onSubmit={handleFormSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setStep('select')} className="text-gray-400 hover:text-white"><ChevronRight className="w-5 h-5"/></button>
              <h2 className="text-xl font-bold text-white">تفاصيل {selectedType === 'Course' ? 'الدورة' : selectedType === 'Project' ? 'المشروع' : 'الخدمة'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm text-gray-400 mb-2">العنوان</label>
                  <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="اكتب عنواناً جذاباً..." />
              </div>
              <div>
                  <label className="block text-sm text-gray-400 mb-2">السعر (ر.س)</label>
                  <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="0 = مجاني" />
              </div>
          </div>

          <div>
              <label className="block text-sm text-gray-400 mb-2">الوصف التفصيلي</label>
              <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 h-32 resize-none" placeholder="اشرح التفاصيل، المميزات، وما سيحصل عليه المشتري..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="block text-sm text-gray-400 mb-2">التصنيف</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none">
                      <option>Tech & Programming</option>
                      <option>Design & Art</option>
                      <option>Business & Marketing</option>
                      <option>Writing & Translation</option>
                      <option>Other</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm text-gray-400 mb-2">المستوى</label>
                  <select value={formData.level} onChange={e=>setFormData({...formData, level: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                  </select>
              </div>
          </div>

          <div>
              <label className="block text-sm text-gray-400 mb-2">ملفات ومرفقات (صور، PDF، فيديو)</label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple onChange={e => { if(e.target.files) setFormData({...formData, files: Array.from(e.target.files)}) }} />
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <span className="text-sm text-gray-300">اضغط لرفع الملفات</span>
                  {formData.files.length > 0 && <div className="mt-2 text-xs text-emerald-400">{formData.files.length} ملفات تم اختيارها</div>}
              </div>
          </div>

          <button type="submit" className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white py-4 rounded-xl font-bold shadow-lg transition-all">
              التالي: الدفع والتوثيق
          </button>
      </form>
  );

  // Step 3: Bank Transfer
  const renderPayment = () => (
      <div className="p-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep('form')} className="text-gray-400 hover:text-white"><ChevronRight className="w-5 h-5"/></button>
              <h2 className="text-xl font-bold text-white">إتمام النشر</h2>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500"><Building2 className="w-6 h-6"/></div>
                  <div>
                      <h3 className="font-bold text-white text-lg mb-1">التحويل البنكي الإلزامي</h3>
                      <p className="text-xs text-gray-300 mb-4">لتفعيل المحتوى ونشره في المنصة، يرجى تحويل رسوم النشر إلى الحساب الرسمي المعتمد.</p>
                      
                      <div className="space-y-3 bg-black/30 p-4 rounded-xl font-mono text-sm text-gray-300">
                          <div className="flex justify-between">
                              <span className="text-gray-500">البنك:</span>
                              <span className="text-white font-bold">بنك الجزيرة (Bank AlJazira)</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">اسم الحساب:</span>
                              <span className="text-white font-bold">شركة ميلاف مراد للتدريب</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-gray-500">رقم الآيبان:</span>
                              <span className="text-emerald-400 font-bold select-all">SA55 6080 1000 0098 7654 3210</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
              <label className="block text-sm text-gray-400">إرفاق إيصال التحويل</label>
              <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${receiptFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/30 bg-black/20'}`}
              >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
                  {receiptFile ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-8 h-8"/>
                          <span className="font-bold text-sm">تم إرفاق الإيصال: {receiptFile.name}</span>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Banknote className="w-8 h-8 opacity-50"/>
                          <span className="text-sm">اضغط هنا لرفع صورة الإيصال</span>
                      </div>
                  )}
              </div>
          </div>

          <button 
              onClick={handlePaymentSubmit} 
              disabled={!receiptFile || isProcessing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!receiptFile || isProcessing ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'}`}
          >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShieldCheck className="w-5 h-5"/>}
              تأكيد التحويل والنشر
          </button>
      </div>
  );

  // Step 4: Success
  const renderSuccess = () => (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400"/>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-400 max-w-md mx-auto text-lg mb-8">
              جاري التحقق من الحوالة البنكية ومراجعة المحتوى. سيتم النشر تلقائياً فور الاعتماد وإشعارك بذلك في لوحة تحكم الناشر.
          </p>
          <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
              إغلاق
          </button>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:h-[85vh] animate-fade-in-up font-sans text-right" dir="rtl">
          
          {/* Header */}
          <div className="bg-[#1e293b] p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400"/> مركز النشر الموحد
                  </h3>
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
          </div>

          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
              {step === 'select' && renderSelection()}
              {step === 'form' && renderForm()}
              {step === 'payment' && renderPayment()}
              {step === 'success' && renderSuccess()}
          </div>

      </div>
    </div>
  );
};

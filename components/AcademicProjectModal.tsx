
import React, { useState } from 'react';
import { X, Upload, BookOpen, CheckCircle2, Award, Send, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentGateway } from './PaymentGateway';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicProjectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addAcademicProject, user } = useAuth();
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    specialization: 'Computer Science',
    level: 'Intermediate',
    description: '',
    attachments: [] as string[]
  });

  const PROJECT_FEE = 50; // SAR

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.title.length < 5 || formData.description.length < 20) {
          alert("يرجى كتابة تفاصيل كافية للمشروع.");
          return;
      }
      setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (txn: any) => {
      setIsPaymentOpen(false);
      const success = addAcademicProject({
        title: formData.title,
        description: formData.description,
        specialization: formData.specialization,
        level: formData.level as any,
        attachments: formData.attachments,
        fee: PROJECT_FEE,
        transactionId: txn.id
      });

      if (success) {
        alert('تم الدفع واعتماد المشروع بنجاح! تمت إضافته لسجلك الأكاديمي.');
        onClose();
        setFormData({ title: '', specialization: 'Computer Science', level: 'Intermediate', description: '', attachments: [] });
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if(e.target.files && e.target.files.length > 0) {
         setFormData(prev => ({...prev, attachments: [...prev.attachments, 'Uploaded File']}));
     }
  };

  return (
    <>
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up">
        
        {/* Left Sidebar: Guidance */}
        <div className="w-full md:w-1/3 bg-black/20 border-b md:border-b-0 md:border-l border-white/10 p-6 flex flex-col">
            <div className="mb-6">
                <div className="bg-blue-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">إضافة خبرة أكاديمية</h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    توثيق مشاريعك وخبراتك يعزز ملفك الأكاديمي الموحد (UPPS) ويتيح لك عرضها للبيع في السوق الاحترافي.
                </p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> التوثيق الرسمي
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        يتم مراجعة واعتماد الخبرة وإضافتها رسمياً للسجل التدريبي بعد سداد رسوم التوثيق الإدارية ({PROJECT_FEE} ر.س).
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Award className="w-4 h-4 text-blue-500" />
                    مرتبط بالرقم الأكاديمي: <span className="font-mono text-blue-400">{user?.trainingId}</span>
                </div>
            </div>
        </div>

        {/* Right Content: Form */}
        <div className="flex-1 bg-white/5 flex flex-col">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-white">نموذج تقديم المشروع</h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <form id="projectForm" onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">عنوان المشروع / الخبرة</label>
                            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="مثال: تصميم هوية بصرية لشركة ناشئة..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">المجال الأكاديمي</label>
                                <div className="relative">
                                    <select value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none appearance-none">
                                        <option value="Computer Science">علوم الحاسب</option>
                                        <option value="Engineering">الهندسة</option>
                                        <option value="Business">إدارة الأعمال</option>
                                        <option value="Design">التصميم والفنون</option>
                                        <option value="Data Science">علم البيانات</option>
                                        <option value="Marketing">التسويق</option>
                                        <option value="Other">أخرى</option>
                                    </select>
                                    <Layers className="absolute left-4 top-4 w-5 h-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">مستوى الإنجاز</label>
                                <div className="relative">
                                    <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none appearance-none">
                                        <option value="Novice">مبتدئ (Novice)</option>
                                        <option value="Intermediate">متوسط (Intermediate)</option>
                                        <option value="Advanced">متقدم (Advanced)</option>
                                        <option value="Expert">خبير (Expert)</option>
                                    </select>
                                    <Award className="absolute left-4 top-4 w-5 h-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">وصف تفصيلي</label>
                            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-32 resize-none"
                                placeholder="اشرح أهداف المشروع، المنهجية المتبعة، والنتائج التي تم تحقيقها..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">ملفات داعمة (صور، مستندات)</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer group relative">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} multiple />
                                <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <p className="text-sm text-gray-300 font-medium">اضغط لرفع الملفات</p>
                                {formData.attachments.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                                        {formData.attachments.map((_, idx) => (
                                            <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> ملف {idx + 1}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                    <button onClick={onClose} type="button" className="px-6 py-3 rounded-xl text-gray-400 hover:bg-white/10 font-medium transition-all">إلغاء</button>
                    <button onClick={(e) => handleFormSubmit(e as any)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all">
                        التالي: التوثيق والدفع <Send className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </div>
        </div>

      </div>
    </div>

    <PaymentGateway 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={PROJECT_FEE}
        title="توثيق خبرة أكاديمية"
        description={`اعتماد مشروع: ${formData.title}`}
        onSuccess={handlePaymentSuccess}
    />
    </>
  );
};

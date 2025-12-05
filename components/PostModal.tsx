
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, CheckCircle2, ChevronLeft, ChevronRight, UploadCloud, Tag, DollarSign, MapPin, Sparkles, Loader2, Hand, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductCategory, ProductCondition, AuctionType } from '../types';
import { QualityCore } from '../services/Quality/QualityCore';
import { AutoMod } from '../services/Market/AutoMod';
import { HARAJ_OATH, HARAJ_CITIES, HARAJ_TAG_TREE } from '../services/Replica/HarajCore';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const { createProduct, user } = useAuth();
  const [step, setStep] = useState(0); // 0 = Oath
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: '' as ProductCategory,
      subCategory: '',
      condition: 'Used - Good' as ProductCondition,
      location: 'الرياض',
      type: 'Fixed' as AuctionType,
      price: '', 
      images: [] as string[],
      tags: ''
  });

  const qualityCore = QualityCore.getInstance();

  useEffect(() => {
      if (isOpen) {
          setStep(0);
          setShowConfetti(false);
          setFormData(prev => ({ ...prev, images: [], title: '', price: '', description: '' }));
      }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  // --- HANDLERS ---

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setIsProcessing(true);
          const files = Array.from(e.target.files) as File[];
          const processed: string[] = [];

          for (const file of files) {
              try {
                  const optimized = await qualityCore.processImage(file);
                  processed.push(optimized);
              } catch (err) {
                  console.error(err);
              }
          }
          setFormData(prev => ({ ...prev, images: [...prev.images, ...processed] }));
          setIsProcessing(false);
      }
  };

  const handlePublish = async () => {
      if (!formData.title || !formData.category) {
          alert("يرجى إكمال البيانات الأساسية");
          return;
      }

      setIsProcessing(true);

      const modResult = AutoMod.validatePost(user, formData.title, formData.description);
      
      if (modResult.status === 'rejected') {
          setIsProcessing(false);
          alert(`⛔ تم رفض الإعلان: ${modResult.reason}`);
          return;
      }

      setTimeout(() => {
          const res = createProduct({
              ...formData,
              price: formData.price ? parseFloat(formData.price) : 0,
              isNegotiable: true,
              status: modResult.status === 'review' ? 'pending_payment' : 'active',
              tags: [formData.location, formData.category, formData.subCategory, ...formData.tags.split(',').map(t => t.trim())].filter(Boolean)
          });

          setIsProcessing(false);

          if (res.success) {
              if (modResult.status === 'review') {
                  alert(`⚠️ الإعلان قيد المراجعة: ${modResult.reason}`);
                  onClose();
              } else {
                  setShowConfetti(true);
                  setTimeout(() => { onClose(); }, 2500);
              }
          } else {
              alert(res.error);
          }
      }, 800); 
  };

  if (showConfetti) {
      return (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in-up">
              <div className="text-center">
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
                      <CheckCircle2 className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2">تم النشر بنجاح!</h2>
                  <p className="text-emerald-400 font-bold text-lg">إعلانك متاح الآن للجميع</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans text-right" dir="rtl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#1e293b]">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-blue-500"/>
                    إضافة إعلان
                </h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* STEP 0: THE OATH (Haraj Replica) */}
            {step === 0 && (
                <div className="space-y-8 animate-fade-in-up text-center pt-8">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500 animate-pulse">
                        <Hand className="w-10 h-10 text-amber-500"/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white mb-4">قسم التعهد</h3>
                        <div className="bg-black/30 p-6 rounded-2xl border border-white/10 text-lg leading-relaxed text-amber-100 font-serif relative">
                            <span className="absolute -top-3 right-6 text-4xl text-amber-600">"</span>
                            {HARAJ_OATH}
                            <span className="absolute -bottom-6 left-6 text-4xl text-amber-600">"</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setStep(1)}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all"
                    >
                        أتعهد وأقسم بالله
                    </button>
                </div>
            )}

            {/* STEP 1: IMAGES */}
            {step === 1 && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="text-center space-y-2">
                        <h3 className="text-white font-bold text-lg">أضف صور الإعلان</h3>
                        <p className="text-xs text-gray-400">اسحب الصور هنا أو اضغط للاختيار</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative min-h-[200px]">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        <Camera className="w-12 h-12 text-gray-400 mb-4"/>
                        <span className="text-blue-400 font-bold">اضغط لإضافة صور</span>
                        {formData.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-2 w-full">
                                {formData.images.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/20 relative">
                                        <img src={img} className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isProcessing && <Loader2 className="w-8 h-8 text-blue-500 animate-spin absolute"/>}
                    </div>

                    <button 
                        onClick={() => formData.images.length > 0 ? setStep(2) : alert("أضف صورة واحدة على الأقل")}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                    >
                        التالي <ChevronLeft className="w-5 h-5"/>
                    </button>
                </div>
            )}

            {/* STEP 2: TAGGING & DETAILS */}
            {step === 2 && (
                <div className="space-y-4 animate-fade-in-up">
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">عنوان الإعلان</label>
                        <input 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            placeholder="مثال: تويوتا كامري 2023 نظيفة..."
                            className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-1 block">القسم الرئيسي</label>
                            <select 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white outline-none"
                            >
                                <option value="">اختر القسم...</option>
                                {Object.keys(HARAJ_TAG_TREE).map(key => (
                                    <option key={key} value={key}>{HARAJ_TAG_TREE[key].label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-1 block">المدينة</label>
                            <select 
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white outline-none"
                            >
                                {HARAJ_CITIES.slice(1).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">السعر (اختياري)</label>
                        <div className="relative">
                            <input 
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none pl-8"
                                placeholder="اتركه فارغاً للسوم"
                            />
                            <DollarSign className="absolute left-2 top-3 w-4 h-4 text-gray-500"/>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1 block">التفاصيل</label>
                        <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white h-24 outline-none resize-none"
                            placeholder="اكتب وصف السلعة..."
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button onClick={() => setStep(1)} className="px-4 bg-white/5 rounded-xl text-gray-400 hover:text-white"><ChevronRight/></button>
                        <button onClick={handlePublish} disabled={isProcessing} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle2 className="w-5 h-5"/>}
                            نشر الإعلان
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

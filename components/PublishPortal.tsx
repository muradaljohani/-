
import React, { useState, useRef } from 'react';
import { 
    X, Upload, BookOpen, Briefcase, ShoppingBag, CheckCircle2, 
    Building2, ChevronRight, FileText, Banknote, ShieldCheck, 
    Loader2, ArrowLeft, PenTool, Layout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PaymentGateway } from './PaymentGateway';
import { AuthModal } from './AuthModal';
import { IdentityVerificationModal } from './IdentityVerificationModal';
import { Enterprise } from '../services/Enterprise/EnterpriseCore'; // Import Enterprise

interface PublishPortalProps {
    onBack: () => void;
}

type PublishType = 'Course' | 'Project' | 'Service';

export const PublishPortal: React.FC<PublishPortalProps> = ({ onBack }) => {
    const { user, publishUserContent } = useAuth();
    
    // View State: 'select' | 'form' | 'payment' | 'success'
    const [step, setStep] = useState<'select' | 'form' | 'payment' | 'success'>('select');
    const [selectedType, setSelectedType] = useState<PublishType | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Modals
    const [authOpen, setAuthOpen] = useState(false);
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);

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

    // --- HANDLERS ---
    
    const handleTypeSelect = (type: PublishType) => {
        if (!user) { setAuthOpen(true); return; }
        if (!user.isIdentityVerified) { setVerifyOpen(true); return; }
        
        setSelectedType(type);
        setStep('form');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.title || !formData.description) return alert("يرجى إكمال جميع الحقول");
        setPaymentOpen(true); // Open payment gateway instead of moving to 'payment' step manually
    };

    const handlePaymentSuccess = async (txn: any) => {
        setPaymentOpen(false);
        setStep('success');
        
        // Final Publish API call
        const res = await publishUserContent(selectedType!, {
            ...formData,
            price: parseFloat(formData.price || '0'),
            transactionId: txn.id
        });

        if(res.success) {
            // SEO: Trigger Instant Indexing
            const slug = formData.title.replace(/\s+/g, '-');
            const path = selectedType === 'Course' ? `/courses/${slug}` : `/market/${slug}`;
            Enterprise.GoogleBridge.notifyUpdate(path, 'URL_UPDATED');
        } else {
            alert(res.error);
        }
    };

    // --- RENDERERS ---

    const Header = () => (
        <header className="sticky top-0 z-40 bg-[#1e293b] border-b border-blue-500/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5 rtl:rotate-180"/>
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-white flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-blue-500"/>
                            بوابة النشر الموحد
                        </h1>
                        <span className="text-[10px] text-gray-400">شارك معرفتك، مشاريعك، وخدماتك</span>
                    </div>
                </div>
                {user && (
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <img src={user.avatar} className="w-6 h-6 rounded-full"/>
                        <span className="text-xs text-white font-bold">{user.name}</span>
                    </div>
                )}
            </div>
        </header>
    );

    const SelectionView = () => (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Banner */}
            <div className="relative w-full h-[250px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-blue-500/20 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" />
                
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
                    <h2 className="text-4xl font-black text-white mb-4">حول شغفك إلى دخل مستدام</h2>
                    <p className="text-blue-100 max-w-2xl text-lg font-light">
                        منصة موحدة تمكنك من نشر دوراتك التدريبية، مشاريعك التقنية، وخدماتك الاحترافية لجمهور واسع.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. Course */}
                <button onClick={() => handleTypeSelect('Course')} className="group bg-[#1e293b] border border-white/5 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:-translate-y-2 shadow-xl hover:shadow-blue-900/20">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-6">
                        <BookOpen className="w-10 h-10"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">انشر دورتك</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        للمدربين والمعلمين. شارك خبراتك عبر دورات مسجلة وملفات تعليمية.
                    </p>
                    <div className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        البدء الآن
                    </div>
                </button>

                {/* 2. Project */}
                <button onClick={() => handleTypeSelect('Project')} className="group bg-[#1e293b] border border-white/5 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:-translate-y-2 shadow-xl hover:shadow-emerald-900/20">
                    <div className="w-20 h-20 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-6">
                        <Briefcase className="w-10 h-10"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">انشر مشروعك</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        للطلاب والمطورين. اعرض مشاريعك البرمجية أو الهندسية للبيع أو التوثيق.
                    </p>
                    <div className="mt-auto px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        البدء الآن
                    </div>
                </button>

                {/* 3. Service */}
                <button onClick={() => handleTypeSelect('Service')} className="group bg-[#1e293b] border border-white/5 hover:border-purple-500 rounded-3xl p-8 flex flex-col items-center text-center transition-all hover:-translate-y-2 shadow-xl hover:shadow-purple-900/20">
                    <div className="w-20 h-20 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-6">
                        <ShoppingBag className="w-10 h-10"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">انشر خدمتك</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        للمستقلين. قدم خدماتك المصغرة في التصميم، البرمجة، والكتابة.
                    </p>
                    <div className="mt-auto px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        البدء الآن
                    </div>
                </button>
            </div>
        </div>
    );

    const FormView = () => (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <button onClick={() => setStep('select')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white">
                <ChevronRight className="w-5 h-5"/> تغيير النوع
            </button>
            
            <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400"><Layout className="w-6 h-6"/></div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">تفاصيل {selectedType === 'Course' ? 'الدورة' : selectedType === 'Project' ? 'المشروع' : 'الخدمة'}</h2>
                        <p className="text-sm text-gray-400">أكمل البيانات التالية للنشر في السوق</p>
                    </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">العنوان</label>
                            <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="مثال: دورة احتراف بايثون" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">السعر (ر.س)</label>
                            <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">الوصف التفصيلي</label>
                        <textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 h-32 resize-none" placeholder="اكتب وصفاً دقيقاً لما تقدمه..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">التصنيف</label>
                            <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none">
                                <option>Tech & Programming</option>
                                <option>Design & Art</option>
                                <option>Business & Marketing</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">المستوى</label>
                            <select value={formData.level} onChange={e=>setFormData({...formData, level: e.target.value})} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"/>
                        <p className="text-xs text-amber-200 leading-relaxed">
                            يتطلب النشر دفع رسوم إدارية رمزية لضمان جدية المحتوى. سيتم تحويلك لبوابة الدفع الآمن عند الضغط على "متابعة".
                        </p>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                        متابعة للدفع والنشر
                    </button>
                </form>
            </div>
        </div>
    );

    const SuccessView = () => (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-bounce-slow">
                <CheckCircle2 className="w-12 h-12 text-emerald-400"/>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">تم النشر بنجاح!</h2>
            <p className="text-gray-400 max-w-md mx-auto text-lg mb-8">
                تم استلام طلبك وتوثيق الدفع. المحتوى الآن قيد المراجعة السريعة وسيظهر في ملفك الشخصي والسوق قريباً.
            </p>
            <div className="flex gap-4">
                <button onClick={() => setStep('select')} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
                    نشر المزيد
                </button>
                <button onClick={onBack} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
                    العودة للرئيسية
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-[#0f172a] overflow-y-auto font-sans text-right" dir="rtl">
            <Header />
            
            <main className="min-h-screen bg-[#0f172a] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                {step === 'select' && <SelectionView />}
                {step === 'form' && <FormView />}
                {step === 'success' && <SuccessView />}
            </main>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
            <IdentityVerificationModal isOpen={verifyOpen} onClose={() => setVerifyOpen(false)} onSuccess={() => { setVerifyOpen(false); alert("تم التوثيق!"); }} />
            
            <PaymentGateway 
                isOpen={paymentOpen} 
                onClose={() => setPaymentOpen(false)} 
                amount={selectedType === 'Project' ? 50 : 100} 
                title="رسوم النشر والتوثيق" 
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

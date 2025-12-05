
import React, { useState } from 'react';
import { X, Crown, CheckCircle2, Zap, Shield, Truck, Briefcase, GraduationCap, AlertTriangle, HeartHandshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionCore } from '../../services/Subscription/SubscriptionCore';

interface Props {
    onClose: () => void;
}

export const PrimeDashboard: React.FC<Props> = ({ onClose }) => {
    const { user, joinPrime, updateProfile } = useAuth();
    const [step, setStep] = useState<'dashboard' | 'cancel_confirm' | 'retention'>('dashboard');
    const core = SubscriptionCore.getInstance();
    
    if (!user) return null;

    const isPrime = user.primeSubscription?.status === 'active';

    const handleJoin = async () => {
        const res = await joinPrime();
        if (res.success) {
            alert("مرحباً بك في النخبة! تم تفعيل اشتراكك بنجاح.");
            onClose();
        } else {
            alert(res.error || "فشل الاشتراك");
        }
    };

    const handleCancelClick = () => {
        setStep('retention');
    };

    const handleAcceptRetention = () => {
        // Apply retention offer
        if (user) {
            const updated = core.applyRetentionDiscount(user);
            updateProfile(updated);
            alert("تم تطبيق الخصم! شكراً لبقائك معنا.");
            onClose();
        }
    };

    const handleConfirmCancel = () => {
        if (user) {
            const updated = core.cancelSubscription(user);
            updateProfile(updated);
            alert("تم إلغاء التجديد التلقائي. ستفتقد مزايا النخبة.");
            onClose();
        }
    };

    const BenefitsList = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSignIcon className="w-5 h-5"/></div>
                <div>
                    <h4 className="text-white font-bold text-sm">0% عمولة مبيعات</h4>
                    <p className="text-xs text-gray-400">بع منتجاتك وخدماتك بدون أي رسوم للمنصة. وفر آلاف الريالات.</p>
                </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Briefcase className="w-5 h-5"/></div>
                <div>
                    <h4 className="text-white font-bold text-sm">أولوية التوظيف</h4>
                    <p className="text-xs text-gray-400">يظهر ملفك في قمة نتائج البحث للشركات مع شارة "مستعد للعمل".</p>
                </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><GraduationCap className="w-5 h-5"/></div>
                <div>
                    <h4 className="text-white font-bold text-sm">تدريب مجاني شهري</h4>
                    <p className="text-xs text-gray-400">دورة مدفوعة واحدة مجاناً كل شهر لتطوير مهاراتك.</p>
                </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400"><Truck className="w-5 h-5"/></div>
                <div>
                    <h4 className="text-white font-bold text-sm">خصم الشحن 20%</h4>
                    <p className="text-xs text-gray-400">شحن مخفض عبر ميلاف إكسبرس لجميع مشترياتك ومبيعاتك.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-4xl bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-amber-500/30">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-900/40 via-[#0f172a] to-[#0f172a] p-8 border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <button onClick={onClose} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors z-20"><X className="w-6 h-6"/></button>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)] animate-pulse-slow">
                            <Crown className="w-12 h-12 text-white fill-white"/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">Murad <span className="text-amber-500">Elite</span></h2>
                            <p className="text-gray-300 text-sm">اشتراك واحد. فوائد لا حصر لها. عالم من الامتيازات.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-[#0f172a]">
                    
                    {step === 'dashboard' && (
                        <>
                            <div className="mb-8">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-amber-500"/> مميزات العضوية
                                </h3>
                                <BenefitsList />
                            </div>

                            {!isPrime ? (
                                <div className="bg-gradient-to-r from-amber-600/20 to-transparent border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-right">
                                        <div className="text-3xl font-black text-white mb-1">49 <span className="text-sm font-normal text-gray-400">ريال / شهرياً</span></div>
                                        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">وفر أكثر من 500 ريال شهرياً</div>
                                    </div>
                                    <button onClick={handleJoin} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all w-full md:w-auto">
                                        ترقية إلى Elite الآن
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl text-center">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4"/>
                                        <h3 className="text-white font-bold text-xl mb-2">عضويتك نشطة</h3>
                                        <p className="text-gray-400 text-sm">تاريخ التجديد القادم: {new Date(user.primeSubscription!.nextBillingDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <button onClick={handleCancelClick} className="text-red-400 text-xs hover:text-red-300 border-b border-red-400/30 pb-0.5">
                                            إلغاء الاشتراك
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 'retention' && (
                        <div className="text-center py-10 animate-fade-in-up">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HeartHandshake className="w-10 h-10 text-red-500"/>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">انتظر! لا تغادرنا...</h3>
                            <p className="text-gray-300 max-w-md mx-auto mb-8 text-lg">
                                نحن نقدر وجودك معنا. ما رأيك في خصم <span className="text-amber-500 font-bold">50%</span> على الشهر القادم؟
                                <br/><span className="text-sm text-gray-500 mt-2 block">ادفع 24.5 ريال فقط واستمر في الاستمتاع بمزايا Elite.</span>
                            </p>
                            
                            <div className="flex flex-col gap-3 max-w-xs mx-auto">
                                <button onClick={handleAcceptRetention} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all">
                                    قبول العرض والبقاء
                                </button>
                                <button onClick={handleConfirmCancel} className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-bold transition-all text-sm">
                                    لا شكراً، أريد الإلغاء
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Helper
const DollarSignIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

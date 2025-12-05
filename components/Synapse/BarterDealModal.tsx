
import React, { useState } from 'react';
import { X, RefreshCw, Handshake, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentGateway } from '../PaymentGateway';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    targetUserId: string;
    targetUserName: string;
    initialOffer: string;
}

export const BarterDealModal: React.FC<Props> = ({ isOpen, onClose, targetUserId, targetUserName, initialOffer }) => {
    const { user } = useAuth();
    const [myOffer, setMyOffer] = useState('');
    const [step, setStep] = useState<'proposal' | 'payment' | 'success'>('proposal');
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    if (!isOpen) return null;

    const handlePropose = () => {
        if (!myOffer) return alert("يرجى كتابة عرضك");
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentOpen(false);
        setStep('success');
    };

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-lg bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden">
                
                <div className="bg-gradient-to-r from-blue-900 to-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-blue-400"/>
                        صفقة تبادل مهارات (Barter)
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400"/></button>
                </div>

                <div className="p-6">
                    {step === 'proposal' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-gray-400 mb-1">الطرف الثاني</div>
                                <div className="text-white font-bold">{targetUserName}</div>
                                <div className="text-sm text-blue-300 mt-2">{initialOffer}</div>
                            </div>

                            <div className="flex justify-center">
                                <RefreshCw className="w-8 h-8 text-gray-600"/>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">عرضك المقابل (ماذا ستقدم؟)</label>
                                <textarea 
                                    value={myOffer} 
                                    onChange={e => setMyOffer(e.target.value)} 
                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none h-24"
                                    placeholder="مثال: سأقوم بتصميم شعار احترافي لك..."
                                />
                            </div>

                            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20 text-[10px] text-blue-300 flex gap-2">
                                <Handshake className="w-4 h-4 shrink-0"/>
                                لضمان الجدية، يتم دفع رسوم رمزية (10 ريال) لتوثيق اتفاقية التبادل.
                            </div>

                            <button onClick={handlePropose} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all">
                                متابعة ودفع الرسوم
                            </button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400"/>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">تم إرسال العرض!</h3>
                            <p className="text-gray-400 text-sm">سيتم إشعار {targetUserName} بعرض التبادل. في حال الموافقة، سيتم فتح قناة تواصل خاصة.</p>
                            <button onClick={onClose} className="mt-6 text-gray-400 hover:text-white text-sm">إغلاق</button>
                        </div>
                    )}
                </div>
            </div>

            <PaymentGateway 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={10}
                title="رسوم توثيق التبادل"
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

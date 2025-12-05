
import React, { useState } from 'react';
import { Wallet, Building2, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, History, Loader2 } from 'lucide-react';
import { ViralStats } from '../../types';
import { ViralEngine } from '../../services/Expansion/ViralEngine';

interface Props {
    stats: ViralStats;
}

export const PayoutManager: React.FC<Props> = ({ stats }) => {
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'WALLET' | 'BANK'>('WALLET');
    const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
    const [otp, setOtp] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const MIN_THRESHOLD = 100;

    const handleRequest = () => {
        setError('');
        const val = parseFloat(amount);
        if (isNaN(val) || val < MIN_THRESHOLD) {
            setError(`الحد الأدنى للسحب هو ${MIN_THRESHOLD} ريال.`);
            return;
        }
        if (val > stats.pendingPayout) {
            setError('الرصيد غير كافٍ.');
            return;
        }
        setStep('otp');
    };

    const handleVerifyOtp = () => {
        setIsProcessing(true);
        // Simulate OTP check and API call
        setTimeout(() => {
            if (otp === '1234') { // Mock OTP
                const res = ViralEngine.getInstance().requestPayout('user', parseFloat(amount), method);
                if (res.success) {
                    setStep('success');
                } else {
                    setError(res.message || 'Error');
                }
            } else {
                setError('رمز التحقق غير صحيح');
            }
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-500"/> بوابة السحب
                    </h3>
                    <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                        رصيد قابل للسحب: {stats.pendingPayout} ريال
                    </div>
                </div>

                {step === 'input' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-xs font-bold mb-2">المبلغ المطلوب (الحد الأدنى 100 ريال)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={e => setAmount(e.target.value)} 
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white text-lg font-bold focus:border-emerald-500 outline-none"
                                    placeholder="0.00"
                                />
                                <span className="absolute left-4 top-4 text-gray-500 text-sm font-bold">SAR</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-bold mb-2">طريقة الاستلام</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setMethod('WALLET')} 
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method==='WALLET' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#0f172a] border-white/5 text-gray-500 hover:bg-white/5'}`}
                                >
                                    <Wallet className="w-6 h-6"/>
                                    <span className="text-sm font-bold">محفظة الموقع (فوري)</span>
                                </button>
                                <button 
                                    onClick={() => setMethod('BANK')} 
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method==='BANK' ? 'bg-amber-600/20 border-amber-500 text-amber-400' : 'bg-[#0f172a] border-white/5 text-gray-500 hover:bg-white/5'}`}
                                >
                                    <Building2 className="w-6 h-6"/>
                                    <span className="text-sm font-bold">تحويل بنكي (2-3 أيام)</span>
                                </button>
                            </div>
                        </div>

                        {error && <div className="text-red-400 text-xs font-bold bg-red-900/20 p-3 rounded-lg border border-red-900/50">{error}</div>}

                        <button onClick={handleRequest} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all">
                            متابعة السحب
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="space-y-6 text-center py-4">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
                            <ShieldCheck className="w-8 h-8 text-blue-400"/>
                        </div>
                        <h3 className="text-white font-bold text-lg">التحقق الأمني</h3>
                        <p className="text-gray-400 text-sm">أدخل رمز التحقق (OTP) المرسل إلى جوالك لتأكيد السحب.</p>
                        
                        <input 
                            type="text" 
                            value={otp} 
                            onChange={e => setOtp(e.target.value)} 
                            className="w-40 bg-[#0f172a] border border-white/20 rounded-xl p-3 text-white text-center text-2xl tracking-widest font-mono outline-none focus:border-blue-500 mx-auto block"
                            placeholder="----"
                            maxLength={4}
                        />

                        {error && <div className="text-red-400 text-xs font-bold">{error}</div>}

                        <button onClick={handleVerifyOtp} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin"/> : 'تأكيد العملية'}
                        </button>
                        <button onClick={() => setStep('input')} className="text-gray-500 text-xs hover:text-white">تغيير البيانات</button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500 animate-bounce-slow">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400"/>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">تم تقديم الطلب بنجاح!</h3>
                        <p className="text-gray-400 text-sm mb-6">رقم العملية: PAY-{Date.now()}<br/>سيتم معالجة الطلب وإشعارك قريباً.</p>
                        <button onClick={() => { setStep('input'); setAmount(''); setOtp(''); }} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold text-sm">
                            عودة
                        </button>
                    </div>
                )}
            </div>

            {/* Payout History Placeholder */}
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 opacity-60">
                <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-400"/> سجل العمليات السابقة
                </h3>
                <div className="text-center text-gray-500 text-xs py-4">لا توجد عمليات سحب سابقة.</div>
            </div>
        </div>
    );
};

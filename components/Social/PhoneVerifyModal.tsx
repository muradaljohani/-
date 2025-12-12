
import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { doc, updateDoc, db, auth } from '../../src/lib/firebase';
import { verifyUserPhoneNumber, confirmPhoneCode, setupRecaptcha } from '../../src/services/authService';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationResult } from 'firebase/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneVerifyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [phone, setPhone] = useState(user?.phone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState('');

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
        setStep('input');
        setPhone(user?.phone || '');
        setOtp('');
        setError('');
        setLoading(false);
        setConfirmationResult(null);

        // Cleanup on open to ensure clean slate for Recaptcha
        if ((window as any).recaptchaVerifier) {
            try { (window as any).recaptchaVerifier.clear(); } catch(e) {}
            (window as any).recaptchaVerifier = null;
        }
    }
  }, [isOpen, user]);

  const handleSendCode = async () => {
    // 1. Validation
    if (!phone) {
        alert("يرجى إدخال رقم الهاتف");
        return;
    }

    // E.164 Format Check
    if (!phone.startsWith('+')) {
        alert("تنبيه: يرجى إدخال الرقم بالصيغة الدولية.\nمثال: +966500000000");
        return;
    }

    setLoading(true);
    setError('');

    console.log("[PhoneVerify] REAL Firebase Request to:", phone);

    try {
      // 2. Initialize Recaptcha (Robust)
      const appVerifier = setupRecaptcha('recaptcha-container');
      
      // 3. Send SMS (Real Firebase Call)
      const result = await verifyUserPhoneNumber(phone, appVerifier);
      
      setConfirmationResult(result);
      setStep('otp');
      console.log("[PhoneVerify] SMS Sent Successfully via Firebase");

    } catch (err: any) {
      console.error("[PhoneVerify] SMS Error:", err);
      
      let msg = "فشل إرسال الرمز. حاول مرة أخرى.";
      if (err.code === 'auth/invalid-phone-number') msg = "رقم الهاتف غير صحيح.";
      if (err.code === 'auth/too-many-requests') msg = "تم تجاوز حد المحاولات. يرجى الانتظار.";
      if (err.code === 'auth/quota-exceeded') msg = "تم تجاوز حد الرسائل المسموح به لهذا اليوم.";
      if (err.code === 'auth/credential-already-in-use') msg = "هذا الرقم مرتبط بحساب آخر بالفعل.";
      if (err.message) msg += `\n(${err.message})`;

      alert("خطأ في الإرسال:\n" + msg);
      setError(msg);

      // Cleanup on error to allow retry
      if ((window as any).recaptchaVerifier) {
          try { (window as any).recaptchaVerifier.clear(); } catch(e) {}
          (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setLoading(true);
    setError('');

    try {
      // Real Confirmation
      await confirmPhoneCode(confirmationResult, otp);
      console.log("[PhoneVerify] OTP Confirmed");

      // Update User Profile in Firestore
      if (user && auth.currentUser) {
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
              phone: phone,
              isPhoneVerified: true
          });
      }
      
      // Update Local Context
      updateProfile({
          phone: phone,
          isPhoneVerified: true
      });

      setStep('success');
      setTimeout(() => {
          onClose();
      }, 2500);
      
    } catch (err: any) {
      console.error("[PhoneVerify] OTP Error:", err);
      
      if (err.code === 'auth/credential-already-in-use') {
          const msg = "هذا الرقم مرتبط بحساب آخر بالفعل. لا يمكن ربطه بالحساب الحالي.";
          setError(msg);
          alert(msg);
      } else if (err.code === 'auth/invalid-verification-code') {
          setError("رمز التحقق غير صحيح.");
      } else {
          setError("حدث خطأ أثناء التحقق. انتهت صلاحية الرمز أو حدث خطأ في النظام.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans" dir="rtl">
        <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500"/> توثيق رقم الجوال
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full"><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
            </div>

            <div className="p-6">
                {step === 'input' && (
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">
                            أدخل رقم الجوال بالصيغة الدولية لاستلام رمز التحقق (OTP) من Firebase.
                            <br/>
                            <span className="text-xs text-amber-500">مثال: +9665xxxxxxxx</span>
                        </p>
                        
                        <div className="relative" dir="ltr">
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full bg-black/30 border border-slate-600 rounded-xl py-3 px-4 pl-10 text-white focus:border-emerald-500 outline-none transition-colors text-lg"
                                placeholder="+9665xxxxxxxx"
                            />
                            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                        </div>
                        
                        {error && <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded">{error}</div>}
                        
                        {/* THE RECAPTCHA CONTAINER (MUST BE VISIBLE) */}
                        <div id="recaptcha-container" className="my-2"></div>
                        
                        <button 
                            onClick={handleSendCode} 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                            {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="space-y-4 text-center">
                        <p className="text-gray-400 text-sm">تم إرسال الرمز إلى <span className="text-white font-bold" dir="ltr">{phone}</span></p>
                        <input 
                            type="text" 
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full bg-black/30 border border-slate-600 rounded-xl py-3 text-center text-2xl tracking-widest text-white focus:border-emerald-500 outline-none font-mono"
                            placeholder="------"
                            maxLength={6}
                        />
                        {error && <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded">{error}</div>}
                        <button 
                            onClick={handleVerifyOtp} 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                            تأكيد الرمز
                        </button>
                        <button onClick={() => setStep('input')} className="text-gray-500 text-xs hover:text-white transition-colors underline">تغيير الرقم</button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center py-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400"/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">تم التوثيق بنجاح!</h3>
                        <p className="text-gray-400 text-sm">رقم الجوال مؤكد الآن في حسابك.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

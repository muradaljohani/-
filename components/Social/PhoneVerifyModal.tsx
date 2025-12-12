
import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { auth, RecaptchaVerifier, doc, updateDoc, db } from '../../src/lib/firebase';
import { verifyUserPhoneNumber, confirmPhoneCode } from '../../src/services/authService';
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
    }
  }, [isOpen, user]);

  const setupRecaptcha = () => {
    // Avoid re-rendering recaptcha if already exists
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
           // reCAPTCHA solved - allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendCode = async () => {
    if (!phone) return setError("يرجى إدخال رقم الهاتف");
    setLoading(true);
    setError('');
    
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await verifyUserPhoneNumber(phone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "فشل إرسال الرمز. تأكد من صحة الرقم.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !confirmationResult) return;
    setLoading(true);
    setError('');

    try {
      await confirmPhoneCode(confirmationResult, otp);
      
      // Update User Profile in Firestore
      if (user) {
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
              phone: phone,
              isPhoneVerified: true
          });
          
          // Update Local Context
          updateProfile({
              phone: phone,
              isPhoneVerified: true
          });
      }

      setStep('success');
      setTimeout(() => {
          onClose();
      }, 2500);
      
    } catch (err: any) {
      setError("رمز التحقق غير صحيح");
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
                <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-white"/></button>
            </div>

            <div className="p-6">
                {step === 'input' && (
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">أدخل رقم الجوال لاستلام رمز التحقق (OTP) عبر رسالة نصية.</p>
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
                        <div id="recaptcha-container"></div>
                        <button 
                            onClick={handleSendCode} 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                            إرسال الرمز
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
                        <p className="text-gray-400 text-sm">رقم الجوال مؤكد الآن في حسابك. يمكنك الاستفادة من جميع المزايا.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

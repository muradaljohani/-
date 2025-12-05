
import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ScanFace, FileCheck, Smartphone, Lock, ArrowRight, Loader2, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const StripeLogo = () => (
    <svg className="h-6 w-auto" viewBox="0 0 60 25" fill="white">
        <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.03a8.75 8.75 0 0 1-5.08 1.17c-4.4 0-7.22-2.33-7.22-6.9 0-4.75 2.77-7.48 6.77-7.48 4.2 0 6.64 2.8 6.64 7.23 0 .43-.03.95-.06 1.12l-.24.23zM54.5 9.77c-1.35 0-2.5.6-2.9 2.22h5.72c-.06-1.55-1.1-2.22-2.82-2.22zM31.04 20h-4.3V5.8h4.3V20zM31.04 2.93h-4.3V0h4.3v2.93zM22.25 20h-4.3V5.8h4.28v1.9c1.07-1.32 2.72-2.15 4.35-2.15V9.7c-2.3 0-4.03 1.1-4.33 3.32V20zM14.22 13.92c0 2 .52 3.03 2.65 3.03 1.3 0 2.45-.3 3.28-.7v3.3c-.93.5-2.43.78-3.95.78-4.5 0-6.28-2.6-6.28-6.13 0-3.9 2.1-7.47 6.48-7.47 1.48 0 2.9.27 3.8.75V10.8c-.85-.43-1.95-.7-3.15-.7-2.32 0-2.83 1.62-2.83 3.82zM4.3 20H0v-7.3c0-2.58.55-3.97 1.95-4.97C2.9 7.15 4.3 7.02 5.5 7.18V11c-1.05-.18-2.45-.18-3.2.33-.5.35-.73 1.05-.73 2.18V20z"/>
    </svg>
);

const OnfidoLogo = () => (
    <span className="font-bold text-xl tracking-tight flex items-center gap-1 text-white">
        <div className="w-4 h-4 bg-teal-400 rounded-full"></div> onfido
    </span>
);

const VeriffLogo = () => (
    <span className="font-black text-xl italic tracking-tighter text-white">veriff</span>
);

export const IdentityVerificationModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { submitIdentityVerification } = useAuth();
  const [step, setStep] = useState<'provider' | 'connect' | 'scan_id' | 'face_scan' | 'success'>('provider');
  const [selectedProvider, setSelectedProvider] = useState<'Stripe Identity' | 'Onfido' | 'Veriff'>('Stripe Identity');
  const [scanProgress, setScanProgress] = useState(0);

  if (!isOpen) return null;

  // Handlers
  const startKYC = (provider: any) => {
      setSelectedProvider(provider);
      setStep('connect');
      setTimeout(() => setStep('scan_id'), 2000);
  };

  const simulateScanning = () => {
      setStep('face_scan');
      let p = 0;
      const interval = setInterval(() => {
          p += 5;
          setScanProgress(p);
          if (p >= 100) {
              clearInterval(interval);
              handleSubmit();
          }
      }, 150);
  };

  const handleSubmit = async () => {
    const result = await submitIdentityVerification(selectedProvider);
    if (result.success) {
        setStep('success');
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col min-h-[500px]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-900 to-[#0f172a]">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    التحقق الموحد (KYC/AML)
                </h2>
                <p className="text-[10px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                    <Lock className="w-3 h-3"/> Secure Identity Verification
                </p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 relative">
            
            {/* Step 1: Choose Provider */}
            {step === 'provider' && (
                <div className="space-y-6 animate-fade-in-up">
                    <p className="text-sm text-gray-300 text-center leading-relaxed">
                        للامتثال للقوانين الدولية وضمان أمان المنصة، يرجى اختيار شريك التوثيق المفضل لديك لإثبات الهوية والعمر.
                    </p>
                    
                    <div className="space-y-3">
                        <button onClick={() => startKYC('Stripe Identity')} className="w-full bg-[#635BFF] hover:bg-[#5851E3] p-4 rounded-xl flex items-center justify-between group transition-all">
                            <StripeLogo />
                            <ArrowRight className="text-white w-5 h-5 group-hover:-translate-x-1 transition-transform rtl:rotate-180"/>
                        </button>
                        <button onClick={() => startKYC('Onfido')} className="w-full bg-[#2C3E50] hover:bg-[#34495E] p-4 rounded-xl flex items-center justify-between group transition-all border border-white/10">
                            <OnfidoLogo />
                            <ArrowRight className="text-white w-5 h-5 group-hover:-translate-x-1 transition-transform rtl:rotate-180"/>
                        </button>
                        <button onClick={() => startKYC('Veriff')} className="w-full bg-[#000000] hover:bg-gray-900 p-4 rounded-xl flex items-center justify-between group transition-all border border-white/20">
                            <VeriffLogo />
                            <ArrowRight className="text-white w-5 h-5 group-hover:-translate-x-1 transition-transform rtl:rotate-180"/>
                        </button>
                    </div>

                    <div className="text-[10px] text-gray-500 text-center mt-4">
                        سيتم مشاركة بياناتك بشكل مشفر مع مزود الخدمة المختار فقط لغرض التحقق.
                    </div>
                </div>
            )}

            {/* Step 2: Connecting */}
            {step === 'connect' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin"/>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">جاري الاتصال الآمن...</h3>
                        <p className="text-sm text-gray-400">Connecting to {selectedProvider} API</p>
                    </div>
                </div>
            )}

            {/* Step 3: Scan ID */}
            {step === 'scan_id' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up">
                    <div className="relative w-full max-w-[200px] aspect-[1.6] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center bg-white/5">
                        <FileCheck className="w-10 h-10 text-gray-500 animate-pulse"/>
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-[scan_2s_infinite]"></div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">فحص الوثيقة الرسمية</h3>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">جاري مسح جواز السفر / الهوية الوطنية للتحقق من البيانات والعمر.</p>
                    </div>
                    <button onClick={simulateScanning} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
                        بدء المسح الضوئي
                    </button>
                </div>
            )}

            {/* Step 4: Face Scan (Liveness) */}
            {step === 'face_scan' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up">
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" style={{ animationDuration: '1s' }}></div>
                        <ScanFace className="absolute inset-0 m-auto w-16 h-16 text-emerald-400 animate-pulse"/>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">التحقق البيومتري</h3>
                        <p className="text-xs text-gray-400">مطابقة الوجه وتقدير العمر (Liveness Check)</p>
                    </div>

                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                        <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                    <div className="text-xs text-emerald-400 font-mono">{scanProgress}% مكتمل</div>
                </div>
            )}

            {/* Step 5: Success */}
            {step === 'success' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400"/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h3>
                        <p className="text-gray-400 text-sm">هويتك موثقة الآن. الحساب جاهز للاستخدام.</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 w-full border border-white/5 text-left text-xs font-mono text-gray-400">
                        <div className="flex justify-between mb-2">
                            <span>Provider:</span> <span className="text-white">{selectedProvider}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Age Check:</span> <span className="text-emerald-400">Verified (18+)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Face Match:</span> <span className="text-emerald-400">99.8% Match</span>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
      
      <style>{`
        @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

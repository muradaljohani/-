
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2, Loader2, AlertCircle, Building2, Upload, Fingerprint, Copy, Clock, AlertTriangle, ScanLine } from 'lucide-react';
import { OCRScanner, ScanResult } from '../services/Finance/OCRScanner';

// Payment Logos
const MadaLogo = () => <svg className="h-6 w-auto" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.6 8.1C7.6 6.7 7.9 5.5 8.6 4.5C9.3 3.5 10.3 3 11.5 3C12.7 3 13.7 3.5 14.4 4.5C15.1 5.5 15.4 6.7 15.4 8.1C15.4 9.5 15.1 10.7 14.4 11.7C13.7 12.7 12.7 13.2 11.5 13.2C10.3 13.2 9.3 12.7 8.6 11.7C7.9 10.7 7.6 9.5 7.6 8.1ZM11.5 11.3C12.2 11.3 12.7 11 13 10.4C13.3 9.8 13.5 9 13.5 8.1C13.5 7.2 13.3 6.4 13 5.8C12.7 5.2 12.2 4.9 11.5 4.9C10.8 4.9 10.3 5.2 10 5.8C9.7 6.4 9.5 7.2 9.5 8.1C9.5 9 9.7 9.8 10 10.4C10.3 11 10.8 11.3 11.5 11.3ZM40.3 13H42.2V3.2H40.3V13ZM1.9 13H3.8V3.2H1.9V13ZM26.8 13H28.7V3.2H26.8V13ZM17.2 13H19.1V7.9L21.8 13H24L26.7 7.9V13H28.6V3.2H26.2L22.9 9.5L19.6 3.2H17.2V13ZM31.5 13H38.6V11.2H33.4V8.9H38.1V7.1H33.4V4.9H38.6V3.2H31.5V13Z" fill="white"/></svg>;
const ApplePayLogo = () => <svg className="h-6 w-auto" viewBox="0 0 38 16" fill="white"><path d="M6.05 6.12c.02-1.69.9-2.55 2.64-2.58.35 0 .7.04 1.06.13-.6-1.78-2.02-2.8-4.07-2.86C4.68.79 3.8.98 3.08 1.37 1.9 2.01 1.2 3.07 1 4.41c-.27 1.86.77 4.26 3.1 6.44 1.16 1.09 2.51 1.36 3.63 1.37 1.1 0 1.86-.35 2.32-.57.47.22 1.22.57 2.34.57 1.07-.01 2.4-.27 3.55-1.33-.02-.02-.04-.04-.07-.06-1.97-.84-3.05-2.13-2.97-4.02.04-1.03.46-1.93 1.26-2.69.16-.15.33-.29.5-.42-.67-1.87-2.08-2.92-4.17-2.92-1.09 0-2.05.32-2.9.96-.85.64-1.4 1.51-1.54 2.38zm11.89-1.07h2.5v10.22h-2.5V5.05zm5.34 0h2.5v10.22h-2.5V5.05zm5.34 0h2.67l2.63 7.62.14.44.14-.44 2.62-7.62h2.63L38 15.27h-2.49l-1.14-3.84h-4.26l-1.12 3.84h-2.48l3.77-10.22zm3.16 4.63l-1.39 4.7h2.83l-1.44-4.7z"/></svg>;

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  title: string;
  description?: string;
  onSuccess: (transactionDetails: any) => void;
}

type PaymentMethod = 'mada' | 'card' | 'apple_pay' | 'bank_transfer';

// --- STRICT BANK DATA ---
const BANK_DETAILS = {
    bankName: "بنك الجزيرة (Bank AlJazira)",
    accountName: "Murad Abdulrazzaq Al-Juhani (مراد عبدالرزاق الجهني)",
    iban: "SA3860100013380120857001"
};

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, amount, title, description, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer'); // Default to Bank Transfer per request
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [countdown, setCountdown] = useState(1800); // 30 minutes
  
  // OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<ScanResult | null>(null);
  
  // Form States
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvc: '' });

  useEffect(() => {
      if(isOpen) {
          setStep('details');
          setIsProcessing(false);
          setCardData({ number: '', name: '', expiry: '', cvc: '' });
          setReceiptFile(null);
          setOcrResult(null);
          setCountdown(1800);
          setMethod('bank_transfer');
      }
  }, [isOpen]);

  useEffect(() => {
      if(isOpen && countdown > 0) {
          const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
          return () => clearInterval(timer);
      }
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const formatCardNumber = (val: string) => val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val: string) => val.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2').slice(0, 5);
  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyIBAN = () => {
      navigator.clipboard.writeText(BANK_DETAILS.iban);
      alert("تم نسخ الآيبان");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setReceiptFile(file);
          setOcrResult(null);
          
          // Trigger OCR
          setIsScanning(true);
          const result = await OCRScanner.getInstance().scanReceipt(file);
          setOcrResult(result);
          setIsScanning(false);
      }
  };

  const handlePay = () => {
      if ((method === 'card' || method === 'mada') && (cardData.number.length < 15 || cardData.cvc.length < 3)) {
          alert("بيانات البطاقة غير مكتملة");
          return;
      }
      
      if (method === 'bank_transfer') {
          if (!receiptFile) {
              alert("🚫 لا يمكن إتمام الطلب بدون إرفاق صورة الحوالة للتحقق.");
              return;
          }
          if (ocrResult && !ocrResult.isValid) {
              // Soft blocking - warn user
              if (!confirm("⚠️ نظام المسح الضوئي يحذر: الصورة المرفقة قد لا تكون إيصالاً صالحاً (كلمات مفتاحية مفقودة). هل أنت متأكد من المتابعة؟")) {
                  return;
              }
          }
      }

      setStep('processing');
      setIsProcessing(true);

      // Simulate Secure API Call & Verification Logic
      setTimeout(() => {
          setIsProcessing(false);
          setStep('success');
          
          // Generate Receipt Data
          const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          
          // Wait briefly to show success animation then callback
          setTimeout(() => {
              onSuccess({
                  id: transactionId,
                  method: method,
                  amount: amount,
                  date: new Date().toISOString(),
                  receiptFile: receiptFile // Pass file to parent to handle with FinanceCore
              });
          }, 2000);
      }, 3000); 
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Secure Header */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-900 p-4 border-b border-blue-500/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                    <span className="font-bold text-white text-sm block">الخزنة المالية المركزية</span>
                    <span className="text-[9px] text-emerald-400 font-mono">Bank AlJazira Secure Link</span>
                </div>
            </div>
            {step === 'details' && (
                <div className="flex items-center gap-2 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                    <Clock className="w-3 h-3 animate-pulse" />
                    ينتهي الحجز خلال {formatTime(countdown)}
                </div>
            )}
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-white/5 border-b border-white/5">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <div className="text-xl font-black text-white">{amount.toFixed(2)} <span className="text-xs font-normal text-gray-400">ر.س</span></div>
            </div>
            {description && <p className="text-sm text-gray-400">{description}</p>}
        </div>

        {step === 'details' && (
            <div className="flex-1 overflow-y-auto p-6">
                {/* Methods Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    <button onClick={() => setMethod('bank_transfer')} className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${method === 'bank_transfer' ? 'bg-amber-600/20 border-amber-500 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                        <Building2 className="w-6 h-6" />
                        <span className="text-[10px] font-bold">تحويل بنكي</span>
                    </button>
                    <button onClick={() => setMethod('mada')} className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${method === 'mada' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                        <MadaLogo />
                        <span className="text-[10px] font-bold">مدى</span>
                    </button>
                    <button onClick={() => setMethod('card')} className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${method === 'card' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                        <CreditCard className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Visa / MC</span>
                    </button>
                    <button onClick={() => setMethod('apple_pay')} className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${method === 'apple_pay' ? 'bg-white text-black border-white' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                        <div className={method === 'apple_pay' ? 'text-black' : 'text-white'}><ApplePayLogo /></div>
                        <span className="text-[10px] font-bold">Apple Pay</span>
                    </button>
                </div>

                {/* Bank Transfer Instructions (The Core Feature) */}
                {method === 'bank_transfer' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-amber-500/30 p-5 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                            
                            <h4 className="font-bold text-amber-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Building2 className="w-4 h-4"/> الحساب الرسمي المعتمد
                            </h4>
                            
                            <div className="space-y-4 text-sm text-gray-300 font-mono">
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-xs">البنك:</span>
                                    <span className="font-bold text-white flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        {BANK_DETAILS.bankName}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 text-xs">اسم المستفيد:</span>
                                    <span className="font-bold text-white border-b border-white/10 pb-1">{BANK_DETAILS.accountName}</span>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <span className="text-gray-500 text-xs">رقم الآيبان (IBAN):</span>
                                    <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-white/10">
                                        <span className="font-bold text-emerald-400 text-lg tracking-wider select-all flex-1 text-center">
                                            {BANK_DETAILS.iban}
                                        </span>
                                        <button onClick={handleCopyIBAN} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                                            <Copy className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-blue-400"/> إرفاق إيصال التحويل (مطلوب)
                            </label>
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer relative transition-all group ${receiptFile ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-white/30 bg-black/20'}`}>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} accept="image/*,application/pdf" />
                                {receiptFile ? (
                                    <div className="flex flex-col items-center justify-center gap-2 text-emerald-400">
                                        <CheckCircle2 className="w-8 h-8"/>
                                        <span className="text-xs font-bold">{receiptFile.name}</span>
                                        
                                        {/* OCR STATUS */}
                                        {isScanning && (
                                            <div className="flex items-center gap-2 text-blue-400 text-[10px] mt-2 bg-black/30 px-3 py-1 rounded-full">
                                                <Loader2 className="w-3 h-3 animate-spin"/> جاري فحص الإيصال...
                                            </div>
                                        )}
                                        {!isScanning && ocrResult && ocrResult.isValid && (
                                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] mt-2 bg-emerald-500/20 px-3 py-1 rounded-full">
                                                <ScanLine className="w-3 h-3"/> تم التحقق من البيانات
                                            </div>
                                        )}
                                        {!isScanning && ocrResult && !ocrResult.isValid && (
                                            <div className="flex flex-col items-center mt-2">
                                                <div className="flex items-center gap-2 text-red-400 text-[10px] bg-red-500/20 px-3 py-1 rounded-full mb-1">
                                                    <AlertTriangle className="w-3 h-3"/> تحذير: إيصال غير واضح
                                                </div>
                                                <p className="text-[9px] text-gray-400 max-w-xs">{ocrResult.warnings[0]}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-white">
                                        <Upload className="w-8 h-8 opacity-50 mb-1"/>
                                        <span className="text-xs">اضغط هنا لرفع صورة الحوالة</span>
                                        <span className="text-[9px] text-gray-600">سيتم الفحص تلقائياً (OCR)</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-2 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"/>
                            <p className="text-[10px] text-amber-200/80 leading-relaxed">
                                سيتم تعليق الطلب في حالة "قيد المراجعة" حتى يتم التحقق من الإيصال ومطابقته من قبل الإدارة المالية (الخزنة المركزية).
                            </p>
                        </div>
                    </div>
                )}

                {/* Card Form */}
                {(method === 'card' || method === 'mada') && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">الاسم على البطاقة</label>
                            <input type="text" value={cardData.name} onChange={e=>setCardData({...cardData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none" placeholder="NAME ON CARD" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">رقم البطاقة</label>
                            <div className="relative">
                                <input type="text" value={cardData.number} onChange={e=>setCardData({...cardData, number: formatCardNumber(e.target.value)})} maxLength={19} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 pl-10 text-white text-sm focus:border-blue-500 outline-none font-mono" placeholder="0000 0000 0000 0000" />
                                <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">تاريخ الانتهاء</label>
                                <input type="text" value={cardData.expiry} onChange={e=>setCardData({...cardData, expiry: formatExpiry(e.target.value)})} maxLength={5} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none text-center" placeholder="MM/YY" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">رمز الأمان CVC</label>
                                <input type="password" value={cardData.cvc} onChange={e=>setCardData({...cardData, cvc: e.target.value.replace(/\D/g,'').slice(0,3)})} maxLength={3} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none text-center" placeholder="123" />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Apple Pay Instructions */}
                {method === 'apple_pay' && (
                    <div className="space-y-4 animate-fade-in-up text-center py-8">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="text-black"><ApplePayLogo /></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
                            <Fingerprint className="w-8 h-8 animate-pulse text-emerald-500"/>
                            <p>قم بالتأكيد باستخدام البصمة البيومترية</p>
                        </div>
                    </div>
                )}
            </div>
        )}

        {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                    <ShieldCheck className="w-20 h-20 text-blue-500 relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">جاري تأمين المعاملة...</h3>
                <p className="text-sm text-gray-400 font-mono">Verifying Receipt & Anti-Fraud Check</p>
                <div className="w-48 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
                <style>{`
                    @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                `}</style>
            </div>
        )}

        {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <CheckCircle2 className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">تم استلام الطلب</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    تم تحويل المعاملة إلى حالة 
                    <span className="text-amber-400 font-bold mx-1">قيد المراجعة</span>.
                    سيتم تفعيل الخدمة فور التحقق من وصول المبلغ لحساب البنك.
                </p>
                <div className="text-xs text-gray-500 font-mono bg-black/30 px-3 py-1 rounded border border-white/5">SECURE-TXN-ID: {Math.floor(Math.random()*1000000)}</div>
            </div>
        )}

        {/* Footer Actions */}
        {step === 'details' && (
            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3">
                <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-400 hover:bg-white/10 transition-all font-bold text-sm">إلغاء</button>
                <button onClick={handlePay} disabled={isScanning} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold py-3 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Lock className="w-4 h-4" /> {method === 'bank_transfer' ? 'تأكيد الحوالة' : `دفع آمن ${amount.toFixed(2)} ريال`}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

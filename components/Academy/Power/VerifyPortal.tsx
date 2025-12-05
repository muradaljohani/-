
import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, Loader2, Award, X } from 'lucide-react';
import { CertificateAuthority } from '../../../services/Academy/Power/CertificateAuthority';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const VerifyPortal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [certId, setCertId] = useState('');
    const [result, setResult] = useState<{ isValid: boolean; metadata?: any } | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    if (!isOpen) return null;

    const handleVerify = () => {
        if (!certId) return;
        setIsChecking(true);
        setResult(null);

        // Simulate Network Latency for dramatic effect
        setTimeout(() => {
            const verification = CertificateAuthority.getInstance().verifyCertificate(certId);
            setResult(verification);
            setIsChecking(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[500] bg-[#0f172a] flex flex-col font-sans animate-in fade-in duration-300" dir="rtl">
            <button onClick={onClose} className="absolute top-6 left-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50">
                <X className="w-6 h-6"/>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 w-full max-w-2xl text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-blue-900/50">
                        <ShieldCheck className="w-12 h-12 text-white"/>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">التحقق من الشهادات</h1>
                    <p className="text-gray-400 text-lg mb-12 max-w-lg mx-auto">
                        نظام التحقق المركزي لأكاديمية ميلاف. أدخل الرقم المرجعي للشهادة للتأكد من صحتها وموثوقيتها.
                    </p>

                    <div className="bg-[#1e293b] p-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2 max-w-lg mx-auto mb-12 transform transition-all focus-within:scale-105 focus-within:border-blue-500/50">
                        <input 
                            type="text" 
                            value={certId}
                            onChange={(e) => setCertId(e.target.value.toUpperCase())}
                            placeholder="CRT-2025-XXXXXXXX"
                            className="flex-1 bg-transparent text-white text-lg font-mono px-4 py-3 outline-none placeholder-gray-600 text-center uppercase tracking-widest"
                        />
                        <button 
                            onClick={handleVerify}
                            disabled={isChecking || !certId}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isChecking ? <Loader2 className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5"/>}
                            تحقق
                        </button>
                    </div>

                    {/* Result Area */}
                    {result && (
                        <div className={`rounded-3xl p-8 border-2 transition-all duration-500 transform ${result.isValid ? 'bg-emerald-900/20 border-emerald-500/50 scale-100' : 'bg-red-900/20 border-red-500/50 scale-100'}`}>
                            {result.isValid ? (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow shadow-lg shadow-emerald-500/30">
                                        <CheckCircle2 className="w-10 h-10 text-white"/>
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-2">شهادة موثقة وصحيحة</h2>
                                    <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-8">Verified Blockchain Signature</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <div>
                                            <span className="text-gray-500 text-xs block mb-1">اسم الطالب</span>
                                            <span className="text-white font-bold">{result.metadata.student}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs block mb-1">البرنامج التدريبي</span>
                                            <span className="text-white font-bold">{result.metadata.course}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs block mb-1">تاريخ الإصدار</span>
                                            <span className="text-white font-mono">{new Date(result.metadata.issueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs block mb-1">الجهة المصدرة</span>
                                            <span className="text-blue-400 font-bold">{result.metadata.issuer}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <XCircle className="w-10 h-10 text-white"/>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">شهادة غير صالحة</h2>
                                    <p className="text-red-400 text-sm">لم يتم العثور على سجل مطابق لهذا الرقم في قاعدة البيانات المركزية.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

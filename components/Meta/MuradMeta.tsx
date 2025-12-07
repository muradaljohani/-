
import React, { useState, useRef, useEffect } from 'react';
import { 
    FileUp, CheckCircle2, Download, X, FileText, 
    ArrowRight, Settings, Shield, Zap, AlertCircle 
} from 'lucide-react';
import { SEOHelmet } from '../SEOHelmet';
import { Footer } from '../Footer';

interface Props {
    onExit: () => void;
}

export const MuradMeta: React.FC<Props> = ({ onExit }) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'converting' | 'success'>('idle');
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Simulated Backend Endpoint Logic
    const handleConvert = async () => {
        if (!file) return;

        // Step 1: Upload Simulation
        setStatus('uploading');
        for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 50));
        }

        // Step 2: Conversion Simulation (Python/Flask Logic mimic)
        setStatus('converting');
        // Simulating: requests.post('/convert', data={...})
        await new Promise(r => setTimeout(r, 2000)); // 2 seconds processing

        // Step 3: Success
        setStatus('success');
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
            } else {
                alert('يرجى اختيار ملف PDF صالح');
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
            } else {
                alert('يرجى اختيار ملف PDF صالح');
            }
        }
    };

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setProgress(0);
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans text-right flex flex-col" dir="rtl">
            <SEOHelmet 
                title="مراد ميتا | تحويل PDF إلى PDF/A" 
                description="أداة تحويل الملفات المتقدمة من مجموعة مراد. حول ملفاتك بسرعة وأمان ومجاناً." 
                path="/meta" 
            />

            {/* Navbar (iLovePDF Style - White & Red) */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
                        <div className="w-10 h-10 bg-[#e53e3e] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg">
                            M
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-slate-800 tracking-tight">Murad<span className="text-[#e53e3e]">Meta</span></span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">File Intelligence</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
                        <a href="#" className="hover:text-[#e53e3e] transition-colors">دمج PDF</a>
                        <a href="#" className="hover:text-[#e53e3e] transition-colors">تقسيم PDF</a>
                        <a href="#" className="hover:text-[#e53e3e] transition-colors">ضغط PDF</a>
                        <span className="text-[#e53e3e]">تحويل PDF</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onExit} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                            العودة للمنصة
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] pointer-events-none"></div>

                <div className="w-full max-w-4xl relative z-10">
                    
                    {/* Header Text */}
                    {status === 'idle' && !file && (
                        <div className="text-center mb-10 animate-fade-in-up">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
                                تحويل PDF إلى PDF/A
                            </h1>
                            <p className="text-xl text-slate-500 font-medium">
                                حوّل مستندات PDF إلى صيغة ISO 19005 (PDF/A) للأرشفة طويلة المدى.
                            </p>
                        </div>
                    )}

                    {/* INTERACTIVE CARD */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 min-h-[400px] flex flex-col items-center justify-center relative transition-all duration-500">
                        
                        {/* 1. IDLE STATE: DROPZONE */}
                        {status === 'idle' && !file && (
                            <div 
                                className="w-full h-full p-12 flex flex-col items-center justify-center transition-colors"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer">
                                    <div className="w-32 h-32 bg-[#e53e3e]/10 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 border-2 border-[#e53e3e]/20 group-hover:border-[#e53e3e]">
                                        <FileUp className="w-16 h-16 text-[#e53e3e]" />
                                    </div>
                                    <button className="px-10 py-5 bg-[#e53e3e] hover:bg-[#c53030] text-white text-2xl font-bold rounded-2xl shadow-xl shadow-red-200 transition-all transform group-hover:-translate-y-1">
                                        اختر ملف PDF
                                    </button>
                                </div>
                                <p className="mt-8 text-gray-400 text-sm font-medium">أو اسحب الملف وأفلته هنا</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    accept=".pdf" 
                                    className="hidden" 
                                    onChange={onFileSelect}
                                />
                            </div>
                        )}

                        {/* 2. FILE SELECTED STATE */}
                        {status === 'idle' && file && (
                            <div className="w-full h-full p-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center mb-6 relative">
                                    <FileText className="w-12 h-12 text-[#e53e3e]" />
                                    <button onClick={reset} className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors">
                                        <X className="w-4 h-4"/>
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1 ltr">{file.name}</h3>
                                <p className="text-sm text-gray-500 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                
                                <button 
                                    onClick={handleConvert}
                                    className="px-12 py-4 bg-[#e53e3e] hover:bg-[#c53030] text-white text-xl font-bold rounded-xl shadow-lg transition-all flex items-center gap-3"
                                >
                                    <Zap className="w-6 h-6 fill-current"/> تحويل إلى PDF/A
                                </button>
                            </div>
                        )}

                        {/* 3. UPLOADING / CONVERTING STATE */}
                        {(status === 'uploading' || status === 'converting') && (
                            <div className="w-full h-full p-12 flex flex-col items-center justify-center">
                                <div className="w-full max-w-md">
                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                                        <span>{status === 'uploading' ? 'جاري رفع الملف...' : 'جاري المعالجة (Python Backend)...'}</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#e53e3e] transition-all duration-300 ease-out relative overflow-hidden" 
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite] transform -skew-x-12"></div>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        يتم معالجة الملف بأمان عبر خوادم Murad Meta المشفرة.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 4. SUCCESS STATE */}
                        {status === 'success' && (
                            <div className="w-full h-full p-12 flex flex-col items-center justify-center bg-emerald-50/50 animate-in fade-in duration-500">
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200 animate-bounce-slow">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-800 mb-4">تم التحويل بنجاح!</h2>
                                <p className="text-slate-500 mb-8 max-w-sm text-center">
                                    تم تحويل ملفك إلى معيار PDF/A بنجاح. الملف جاهز للتنزيل الآن.
                                </p>
                                
                                <div className="flex gap-4">
                                    <button className="px-8 py-4 bg-[#e53e3e] hover:bg-[#c53030] text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-1">
                                        <Download className="w-6 h-6"/> تنزيل الملف
                                    </button>
                                    <button onClick={reset} className="px-6 py-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-bold transition-all">
                                        ملف آخر
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Features Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
                        <div className="p-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#e53e3e]">
                                <Shield className="w-6 h-6"/>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2">آمن ومحمي</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">يتم حذف جميع الملفات تلقائياً من خوادمنا بعد ساعتين من المعالجة.</p>
                        </div>
                        <div className="p-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#e53e3e]">
                                <Settings className="w-6 h-6"/>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2">جودة عالية</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">نستخدم أفضل خوارزميات الضغط والتحويل للحفاظ على دقة المستندات.</p>
                        </div>
                        <div className="p-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#e53e3e]">
                                <AlertCircle className="w-6 h-6"/>
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2">متوافق مع ISO</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">ملفات PDF/A متوافقة تماماً مع معايير الأرشفة العالمية ISO 19005.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

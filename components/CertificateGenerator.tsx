
import React, { useRef, useState } from 'react';
import { Download, Loader2, Printer, CheckCircle2, User, FileText, Calendar, ShieldCheck, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AssetProcessor } from '../services/System/AssetProcessor';

interface Props {
    courseName: string;
    studentName: string;
    date: string;
    onClose: () => void;
}

export const CertificateGenerator: React.FC<Props> = ({ courseName, studentName, date, onClose }) => {
    const certRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const assetProcessor = AssetProcessor.getInstance();
    
    // Step state: 'details' (input) -> 'preview'
    const [step, setStep] = useState<'details' | 'preview'>('details');
    
    const [extraData, setExtraData] = useState({
        nationalId: '',
        nationality: '',
        dob: ''
    });

    const handleDownload = async () => {
        if (!certRef.current) return;
        setIsGenerating(true);
        
        try {
            // High Resolution Config for Mobile
            const canvas = await html2canvas(certRef.current, { 
                scale: 3, // 3x for Retina displays
                useCORS: true,
                logging: false,
                backgroundColor: '#fdfbf7',
                windowWidth: 1200 // Force desktop width for rendering
            });
            const image = canvas.toDataURL("image/png", 1.0);
            
            const link = document.createElement("a");
            link.href = image;
            link.download = `Certificate_${studentName.replace(/\s/g, '_')}.png`;
            link.click();
        } catch (err) {
            console.error("Certificate Generation Failed", err);
            alert("حدث خطأ أثناء إنشاء الشهادة. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans print:bg-white print:p-0" dir="rtl">
            
            {/* Close Button (Hidden on Print) */}
            <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-50 print:hidden">
                <X className="w-6 h-6"/>
            </button>

            <div className="relative w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-center justify-center h-full print:w-full print:h-full print:max-w-none">
                
                {/* STEP 1: Details Input (Hidden on Print) */}
                {step === 'details' && (
                    <div className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full print:hidden">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                             <ShieldCheck className="w-6 h-6 text-emerald-500"/> توثيق الشهادة
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">رقم الهوية / الإقامة</label>
                                <div className="flex items-center gap-2 bg-[#0f172a] rounded-xl border border-white/10 p-3">
                                    <FileText className="w-5 h-5 text-blue-500"/>
                                    <input 
                                        type="text" 
                                        value={extraData.nationalId} 
                                        onChange={e => setExtraData({...extraData, nationalId: e.target.value})}
                                        className="bg-transparent text-white outline-none w-full"
                                        placeholder="10xxxxxxxxx"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">الجنسية</label>
                                <div className="flex items-center gap-2 bg-[#0f172a] rounded-xl border border-white/10 p-3">
                                    <User className="w-5 h-5 text-emerald-500"/>
                                    <input 
                                        type="text" 
                                        value={extraData.nationality} 
                                        onChange={e => setExtraData({...extraData, nationality: e.target.value})}
                                        className="bg-transparent text-white outline-none w-full"
                                        placeholder="سعودي"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">تاريخ الميلاد</label>
                                <div className="flex items-center gap-2 bg-[#0f172a] rounded-xl border border-white/10 p-3">
                                    <Calendar className="w-5 h-5 text-amber-500"/>
                                    <input 
                                        type="date" 
                                        value={extraData.dob} 
                                        onChange={e => setExtraData({...extraData, dob: e.target.value})}
                                        className="bg-transparent text-white outline-none w-full"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    if(!extraData.nationalId || !extraData.nationality || !extraData.dob) {
                                        alert("يرجى إكمال جميع الحقول لضمان توثيق الشهادة.");
                                        return;
                                    }
                                    setStep('preview');
                                }} 
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all mt-4"
                            >
                                إصدار الشهادة الرسمية
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PREVIEW AREA */}
                {step === 'preview' && (
                <>
                <div className="relative w-full flex flex-col items-center gap-6 print:block print:w-full print:h-screen">
                    
                    {/* Toolbar (Hidden on Print) */}
                    <div className="flex gap-4 print:hidden">
                        <button onClick={handleDownload} disabled={isGenerating} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                             {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>} تحميل (PNG)
                        </button>
                        <button onClick={handlePrint} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
                             <Printer className="w-4 h-4"/> طباعة (PDF)
                        </button>
                    </div>

                    {/* SCALING WRAPPER FOR PREVIEW */}
                    <div className="relative w-full flex justify-center overflow-x-auto print:overflow-visible print:block">
                        
                        {/* CERTIFICATE CANVAS (A4 Landscape: 1123x794px) */}
                        <div 
                            ref={certRef}
                            className="bg-[#fdfbf7] text-[#1f2937] shadow-2xl relative print:shadow-none print:w-full print:h-full print:absolute print:top-0 print:left-0"
                            style={{ 
                                width: '1123px', 
                                height: '794px',
                                minWidth: '1123px', // Ensure it doesn't shrink on mobile view
                                fontFamily: "'Tajawal', 'Amiri', serif",
                                overflow: 'hidden',
                                transform: 'scale(0.6)', // Scale down for preview on desktop
                                transformOrigin: 'top center',
                            }}
                        >
                            {/* --- DESIGN LAYERS --- */}
                            <div className="absolute top-[10mm] left-[10mm] right-[10mm] bottom-[10mm] border-2 border-[#1e3a8a] z-10 pointer-events-none"></div>
                            <div className="absolute top-[12mm] left-[12mm] right-[12mm] bottom-[12mm] border-4 border-double border-[#d97706] z-10 pointer-events-none"></div>
                            
                            <div className="absolute top-[10mm] right-[10mm] w-[40mm] h-[40mm] border-t-8 border-r-8 border-[#1e3a8a] rounded-tr-[15px] z-20"></div>
                            <div className="absolute top-[10mm] left-[10mm] w-[40mm] h-[40mm] border-t-8 border-l-8 border-[#1e3a8a] rounded-tl-[15px] z-20"></div>
                            <div className="absolute bottom-[10mm] right-[10mm] w-[40mm] h-[40mm] border-b-8 border-r-8 border-[#1e3a8a] rounded-br-[15px] z-20"></div>
                            <div className="absolute bottom-[10mm] left-[10mm] w-[40mm] h-[40mm] border-b-8 border-l-8 border-[#1e3a8a] rounded-bl-[15px] z-20"></div>

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-[400px] font-black text-[#1e3a8a] z-0 pointer-events-none select-none">M</div>

                            {/* --- CONTENT LAYER --- */}
                            <div className="relative z-30 h-full flex flex-col px-[80px] py-[60px] justify-between">
                                
                                {/* 1. HEADER */}
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center gap-[15px] mb-[10px]">
                                        <div className="w-[50px] h-[50px] bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-[28px] font-bold border-4 border-[#d97706]">M</div>
                                        <div className="text-right">
                                            <div className="font-black text-[#1e3a8a] text-[20px]">أكاديمية ميلاف مراد</div>
                                            <div className="text-[10px] text-[#d97706] tracking-[1px] font-bold uppercase">MYLAF MURAD ACADEMY</div>
                                        </div>
                                    </div>
                                    <h1 className="text-[48px] text-[#1e3a8a] m-0 font-bold" style={{fontFamily: 'Amiri, serif'}}>شهادة إتمام دورة</h1>
                                    <div className="text-[12px] tracking-[5px] text-[#d97706] uppercase font-bold mt-[2px]">CERTIFICATE OF COMPLETION</div>
                                </div>

                                {/* 2. BODY TEXT */}
                                <div className="flex flex-col items-center text-center gap-[20px] flex-grow justify-center">
                                    <p className="text-[24px] text-[#666] m-0 font-medium font-serif">
                                        تشهد أكاديمية ميلاف مراد للتدريب والتطوير بأن المتدرب/ة:
                                    </p>
                                    
                                    <div className="text-[48px] text-[#1f2937] font-bold border-b-2 border-[#ddd] pb-[5px] px-8 min-w-[300px]" style={{fontFamily: 'Amiri, serif'}}>
                                        {studentName}
                                    </div>

                                    {/* Data Table Embedded in Certificate */}
                                    <div style={{
                                        border: '1px solid #1e3a8a',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        padding: '12px 35px',
                                        margin: '15px 0',
                                        display: 'flex',
                                        gap: '40px',
                                        fontSize: '18px',
                                        textAlign: 'right',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                    }}>
                                        <div><span style={{color:'#666', fontSize:'14px'}}>رقم الهوية:</span> <span style={{fontWeight:'bold', fontFamily:'monospace'}}>{extraData.nationalId}</span></div>
                                        <div><span style={{color:'#666', fontSize:'14px'}}>الجنسية:</span> <span style={{fontWeight:'bold'}}>{extraData.nationality}</span></div>
                                        <div><span style={{color:'#666', fontSize:'14px'}}>الميلاد:</span> <span style={{fontWeight:'bold', fontFamily:'monospace'}}>{extraData.dob}</span></div>
                                    </div>
                                    
                                    <div className="text-[20px] text-[#4b5563] leading-[2] font-serif max-w-[900px]">
                                        قد أتم/ت بنجاح متطلبات البرنامج التدريبي بعنوان:
                                        <div className="text-[#1e3a8a] font-black text-[28px] my-[10px]">{courseName}</div>
                                        وذلك خلال الفترة من <b>{new Date(Date.now() - 86400000 * 5).toLocaleDateString('en-GB')}</b> إلى <b>{date}</b>، بواقع (15) ساعة تدريبية.
                                        <br/>
                                        وقد مُنح هذه الشهادة اجتيازاً لكافة المتطلبات المقررة، متمنين له/لها دوام التوفيق والنجاح.
                                    </div>
                                </div>

                                {/* 3. FOOTER */}
                                <div>
                                    <div className="flex justify-between items-end mb-[20px] px-[20px]">
                                        
                                        {/* Right: Signature */}
                                        <div className="text-center w-[220px]">
                                            <div className="h-[80px] mb-[5px] flex items-end justify-center relative">
                                                <img 
                                                    src={assetProcessor.getOfficialSignature()} 
                                                    alt="Signature" 
                                                    className="h-full object-contain absolute bottom-0"
                                                    style={{...assetProcessor.getSignatureStyle(), zIndex: 2}} 
                                                />
                                            </div>
                                            <div className="border-t-2 border-[#1e3a8a] pt-[5px]">
                                                <div className="font-bold text-[#1e3a8a] text-[16px]">المدير التنفيذي</div>
                                                <div className="text-[18px] text-[#1f2937] font-bold font-serif">م. مراد الجهني</div>
                                            </div>
                                        </div>

                                        {/* Center: Stamp */}
                                        <div className="text-center w-[200px]">
                                            <div className="h-[120px] flex items-center justify-center">
                                                <img 
                                                    src={assetProcessor.getOfficialSeal()} 
                                                    alt="Stamp"
                                                    className="w-[140px] opacity-90 mix-blend-multiply transform -rotate-12"
                                                />
                                            </div>
                                            <div className="text-[10px] text-[#d97706] font-bold mt-1 uppercase tracking-widest">Official Stamp</div>
                                        </div>

                                        {/* Left: Date & Verify */}
                                        <div className="text-center w-[220px]">
                                            <div className="h-[80px] mb-[5px] flex items-end justify-center">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://murad-group.com/verify/CERT-${Date.now()}`} className="w-[80px] h-[80px] border border-[#ddd] p-[2px] bg-white block" alt="QR Code" />
                                            </div>
                                            <div className="border-t-2 border-[#1e3a8a] pt-[5px]">
                                                <div className="font-bold text-[#1e3a8a] text-[14px]">حرر بتاريخ: {date}</div>
                                                <div className="text-[10px] text-[#666]">رمز التحقق (Scan to Verify)</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Partners Strip */}
                                    <div className="border-t border-[#ddd] pt-[15px]">
                                        <p className="text-[10px] text-[#666] mb-[5px] font-bold text-center uppercase tracking-widest">Strategic Partners:</p>
                                        <div className="flex justify-center items-center gap-[40px] opacity-70 grayscale">
                                            <div className="text-[12px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[16px]">🇸🇦</span> وزارة الموارد البشرية</div>
                                            <div className="text-[12px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[16px]">🎯</span> هدف (Hadaf)</div>
                                            <div className="text-[12px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[16px]">👁️</span> رؤية 2030</div>
                                            <div className="text-[12px] font-bold text-[#1e3a8a] flex items-center gap-1"><span className="text-[16px]">🛡️</span> الأمن السيبراني</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                </>
                )}

            </div>
        </div>
    );
};

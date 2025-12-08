
import React, { useRef, useState } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useAuth } from '../../context/AuthContext';
import { AssetProcessor } from '../../services/System/AssetProcessor';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const EnrollmentCertificateModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const certRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const assetProcessor = AssetProcessor.getInstance();

    if (!isOpen || !user) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        if (!certRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `Enrollment_Certificate_${user.trainingId}.png`;
            link.click();
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB');

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-xl animate-fade-in-up font-sans print:p-0 print:bg-white print:absolute print:inset-0" dir="rtl">
            
            {/* Controls (Hidden on Print) */}
            <div className="absolute top-4 left-4 flex gap-3 print:hidden z-50">
                <button onClick={handleDownload} disabled={isGenerating} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                    <Download className="w-4 h-4"/> {isGenerating ? 'جاري التحميل...' : 'حفظ كصورة'}
                </button>
                <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
                    <Printer className="w-4 h-4"/> طباعة
                </button>
                <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 rounded-full transition-all">
                    <X className="w-6 h-6"/>
                </button>
            </div>

            {/* Certificate Container */}
            <div className="overflow-auto max-h-screen w-full flex justify-center print:overflow-visible print:max-h-none print:w-full print:block bg-gray-100 p-8 print:p-0">
                
                {/* THE CERTIFICATE CANVAS (A4) */}
                <div 
                    ref={certRef}
                    className="bg-white text-black shadow-2xl relative flex flex-col print:shadow-none print:w-full print:h-screen mx-auto"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '20mm', // Increased padding for safety margins
                        fontFamily: "'Tajawal', 'Times New Roman', serif",
                        backgroundImage: 'radial-gradient(circle at center, #fff 50%, #f8f9fa 100%)',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Border Frame */}
                    <div className="absolute top-4 left-4 right-4 bottom-4 border-double border-4 border-[#1e3a8a] pointer-events-none z-0"></div>
                    <div className="absolute top-6 left-6 right-6 bottom-6 border border-[#d97706] pointer-events-none z-0"></div>

                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                        <ShieldCheck size={400} />
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-[#1e3a8a] pb-6 mb-8 relative z-10">
                        <div className="text-right">
                            <h1 className="text-xl font-black text-[#1e3a8a] mb-1">أكاديمية ميلاف مراد</h1>
                            <h2 className="text-sm font-bold text-gray-600">للتدريب والتطوير</h2>
                            <p className="text-[10px] text-gray-500 mt-2">ترخيص رقم: 582910</p>
                        </div>
                        <div className="text-center absolute left-1/2 transform -translate-x-1/2 -top-2">
                            <div className="w-24 h-24 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto border-4 border-[#d97706] shadow-lg">M</div>
                        </div>
                        <div className="text-left" dir="ltr">
                            <h1 className="text-lg font-black text-[#1e3a8a] mb-1">Mylaf Murad Academy</h1>
                            <h2 className="text-xs font-bold text-gray-600 uppercase">Training & Development</h2>
                            <p className="text-[10px] text-gray-500 mt-2">Ref: {user.trainingId}</p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-12 relative z-10 mt-6">
                        <h1 className="text-2xl font-black text-black underline decoration-2 decoration-[#d97706] underline-offset-8 inline-block mb-2">
                            إفادة انتظام بالدراسة
                        </h1>
                        <h2 className="text-lg font-serif text-gray-600 mt-2 tracking-wide">Enrollment Certificate</h2>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 px-4 relative z-10 space-y-8">
                        
                        {/* Arabic Text */}
                        <div className="text-right text-base leading-loose font-medium text-gray-800" dir="rtl">
                            <p className="mb-4 font-bold">إلى من يهمه الأمر،</p>
                            <p className="text-justify mb-4">
                                تشهد إدارة القبول والتسجيل في <b>أكاديمية ميلاف مراد</b> بأن المتدرب/ة الموضح بياناته أدناه:
                            </p>
                            
                            <div className="bg-gray-50 border border-gray-200 p-4 my-2 rounded-lg grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="border-b border-gray-200 pb-1">
                                    <span className="text-gray-500 ml-2">الاسم:</span>
                                    <span className="font-bold">{user.name}</span>
                                </div>
                                <div className="border-b border-gray-200 pb-1">
                                    <span className="text-gray-500 ml-2">الرقم الأكاديمي:</span>
                                    <span className="font-bold font-mono">{user.trainingId}</span>
                                </div>
                                <div className="border-b border-gray-200 pb-1">
                                    <span className="text-gray-500 ml-2">رقم الهوية:</span>
                                    <span className="font-bold font-mono">{user.nationalId || '-----------'}</span>
                                </div>
                                <div className="border-b border-gray-200 pb-1">
                                    <span className="text-gray-500 ml-2">التخصص/المسار:</span>
                                    <span className="font-bold">{user.major || 'عام'}</span>
                                </div>
                            </div>

                            <p className="text-justify mt-4">
                                منتظم/ة حالياً في البرامج التدريبية للأكاديمية، وحالته/ها الأكاديمية <b>(نشط)</b>.
                                وقد أعطيت له هذه الإفادة بناءً على طلبه لتقديمها للجهات المختصة دون أدنى مسؤولية على الأكاديمية تجاه حقوق الغير.
                            </p>
                        </div>

                        {/* English Text */}
                        <div className="text-left text-base leading-loose font-serif text-gray-800 mt-8 pt-6 border-t border-dashed border-gray-300" dir="ltr">
                            <p className="mb-2 font-bold">To Whom It May Concern,</p>
                            <p className="text-justify mb-4">
                                This is to certify that the trainee mentioned above is currently an <b>Active</b> student at <b>Mylaf Murad Academy</b>.
                                This certificate is issued upon the student's request for official purposes.
                            </p>
                        </div>

                    </div>

                    {/* Footer / Signatures */}
                    <div className="mt-auto pt-8 relative z-10">
                        <div className="flex justify-between items-end px-4">
                            
                            {/* Executive Director */}
                            <div className="text-center w-1/3">
                                <div className="h-20 mb-2 flex items-end justify-center">
                                    <img 
                                        src={assetProcessor.getOfficialSignature()} 
                                        alt="Signature" 
                                        className="h-full object-contain"
                                        style={assetProcessor.getSignatureStyle()} 
                                    />
                                </div>
                                <div className="border-t border-black w-full pt-2">
                                    <p className="font-bold text-sm text-[#1e3a8a]">المدير التنفيذي</p>
                                    <p className="font-bold text-xs">Eng. Murad Aljohani</p>
                                </div>
                            </div>

                            {/* Seal */}
                            <div className="text-center w-1/3 flex justify-center">
                                <img 
                                    src={assetProcessor.getOfficialSeal()} 
                                    alt="Official Seal"
                                    className="w-32 h-32 object-contain opacity-90 mix-blend-multiply"
                                />
                            </div>

                            {/* Verification */}
                            <div className="text-center w-1/3" dir="ltr">
                                <div className="h-20 mb-2 flex items-end justify-center">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ENROLL:${user.trainingId}`} className="w-20 h-20 border p-1" alt="QR"/>
                                </div>
                                <div className="border-t border-black w-full pt-2">
                                    <p className="font-bold text-xs text-gray-600">Issue Date: {dateStr}</p>
                                </div>
                            </div>

                        </div>
                        
                        <div className="text-center text-[9px] text-gray-400 mt-6 border-t border-gray-200 pt-2">
                             Mylaf Murad Academy | Riyadh, Saudi Arabia | www.murad-group.com
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

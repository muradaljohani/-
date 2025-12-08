
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
            <div className="overflow-auto max-h-screen w-full flex justify-center print:overflow-visible print:max-h-none print:w-full print:block">
                
                {/* THE CERTIFICATE CANVAS (A4) */}
                <div 
                    ref={certRef}
                    className="bg-white text-black shadow-2xl relative flex flex-col print:shadow-none print:w-full print:h-screen"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '15mm',
                        fontFamily: "'Tajawal', 'Times New Roman', serif",
                        backgroundImage: 'radial-gradient(circle at center, #fff 50%, #f8f9fa 100%)'
                    }}
                >
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                        <ShieldCheck size={400} />
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start border-b-4 border-[#1e3a8a] pb-6 mb-8 relative z-10">
                        <div className="text-right">
                            <h1 className="text-2xl font-black text-[#1e3a8a] mb-1">أكاديمية ميلاف مراد</h1>
                            <h2 className="text-sm font-bold text-gray-600">للتعليم العالي والتدريب</h2>
                            <p className="text-xs text-gray-500 mt-2">ترخيص رقم: 582910</p>
                        </div>
                        <div className="text-center">
                            <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain opacity-0" /> {/* Placeholder spacing */}
                            <div className="w-20 h-20 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto border-4 border-[#d97706]">M</div>
                        </div>
                        <div className="text-left" dir="ltr">
                            <h1 className="text-xl font-black text-[#1e3a8a] mb-1">Mylaf Murad Academy</h1>
                            <h2 className="text-xs font-bold text-gray-600 uppercase">For Higher Education & Training</h2>
                            <p className="text-xs text-gray-500 mt-2">Ref: {user.trainingId}</p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-12 relative z-10">
                        <h1 className="text-3xl font-black text-black underline decoration-4 decoration-[#d97706] underline-offset-8 inline-block mb-2">
                            إفادة انتظام بالدراسة
                        </h1>
                        <h2 className="text-xl font-serif text-gray-600 mt-2">Study Enrollment Certificate</h2>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 px-8 relative z-10 space-y-10">
                        
                        {/* Arabic Text */}
                        <div className="text-right text-lg leading-loose font-medium text-gray-800" dir="rtl">
                            <p className="mb-4">إلى من يهمه الأمر،</p>
                            <p>
                                تشهد إدارة القبول والتسجيل في <b>أكاديمية ميلاف مراد</b> بأن الطالب/ة:
                            </p>
                            <div className="bg-gray-50 border border-gray-200 p-4 my-4 rounded-lg grid grid-cols-2 gap-4">
                                <p><b>الاسم:</b> {user.name}</p>
                                <p><b>الرقم الأكاديمي:</b> {user.trainingId}</p>
                                <p><b>رقم الهوية:</b> {user.nationalId || '-----------'}</p>
                                <p><b>التخصص:</b> {user.major || 'مسار عام'}</p>
                            </div>
                            <p>
                                منتظم/ة حالياً في الدراسة للأيكاديمية للعام الحالي، وحالته/ها الأكاديمية <b>(نشط)</b>.
                                وقد أعطيت له هذه الإفادة بناءً على طلبه لتقديمها للجهات المختصة دون أدنى مسؤولية على الأكاديمية تجاه حقوق الغير.
                            </p>
                        </div>

                        <hr className="border-gray-300 border-dashed" />

                        {/* English Text */}
                        <div className="text-left text-lg leading-loose font-serif text-gray-800" dir="ltr">
                            <p className="mb-4">To Whom It May Concern,</p>
                            <p>
                                The Admission and Registration Department at <b>Mylaf Murad Academy</b> certifies that the student:
                            </p>
                            <div className="bg-gray-50 border border-gray-200 p-4 my-4 rounded-lg grid grid-cols-2 gap-4">
                                <p><b>Name:</b> {user.name}</p>
                                <p><b>Academic ID:</b> {user.trainingId}</p>
                                <p><b>National ID:</b> {user.nationalId || '-----------'}</p>
                                <p><b>Major:</b> {user.major || 'General Path'}</p>
                            </div>
                            <p>
                                Is currently an <b>Active</b> enrolled student for the current academic year.
                                This certificate is issued upon the student's request for official purposes.
                            </p>
                        </div>

                    </div>

                    {/* Footer / Signatures */}
                    <div className="mt-auto pt-12 relative z-10">
                        <div className="flex justify-between items-end px-4">
                            
                            {/* Executive Director */}
                            <div className="text-center">
                                <div className="h-28 mb-2 flex items-end justify-center">
                                    <img 
                                        src={assetProcessor.getOfficialSignature()} 
                                        alt="Signature" 
                                        className="h-full object-contain"
                                        style={assetProcessor.getSignatureStyle()} 
                                    />
                                </div>
                                <div className="border-t-2 border-black w-48 pt-2 mx-auto">
                                    <p className="font-bold text-lg">المدير التنفيذي</p>
                                    <p className="font-serif">Executive Director</p>
                                    <p className="font-bold text-[#1e3a8a] mt-1">Eng. Murad Aljohani</p>
                                </div>
                            </div>

                            {/* Seal */}
                            <div className="text-center mb-4">
                                <img 
                                    src={assetProcessor.getOfficialSeal()} 
                                    alt="Official Seal"
                                    className="w-40 h-40 object-contain opacity-90 mix-blend-multiply"
                                />
                                <p className="text-[10px] font-bold text-[#1e3a8a] tracking-widest mt-2">OFFICIAL DOCUMENT</p>
                            </div>

                            {/* Verification */}
                            <div className="text-center" dir="ltr">
                                <div className="h-28 mb-2 flex items-end justify-center">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ENROLL:${user.trainingId}`} className="w-24 h-24 border p-1" alt="QR"/>
                                </div>
                                <div className="border-t-2 border-black w-48 pt-2 mx-auto">
                                    <p className="font-bold text-sm">Date of Issue</p>
                                    <p className="font-mono font-bold">{dateStr}</p>
                                </div>
                            </div>

                        </div>
                        
                        <div className="text-center text-[10px] text-gray-400 mt-8 border-t pt-2">
                             Mylaf Murad Academy | Riyadh, Saudi Arabia | www.murad-group.com
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

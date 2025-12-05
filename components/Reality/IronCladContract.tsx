
import React, { useRef, useState } from 'react';
import { X, FileText, PenTool, Shield, Check, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { RealityCore } from '../../services/Reality/RealityCore';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    type: 'JobOffer' | 'BillOfSale';
    partyA: string;
    partyB: string;
    terms: any;
}

export const IronCladContract: React.FC<Props> = ({ isOpen, onClose, type, partyA, partyB, terms }) => {
    const [signed, setSigned] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const contractRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleSign = () => {
        setSigned(true);
    };

    const handleDownload = async () => {
        if (!contractRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(contractRef.current, { scale: 2 });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `Contract_${type}_${Date.now()}.png`;
            link.click();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-4xl h-[90vh] bg-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Controls */}
                <div className="w-full md:w-64 bg-[#0f172a] p-6 flex flex-col justify-between shrink-0 text-right">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-500"/> العقود الذكية
                        </h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p>نوع العقد: <span className="text-white">{type === 'JobOffer' ? 'عرض عمل' : 'مبايعة'}</span></p>
                            <p>الطرف الأول: <span className="text-white">{partyA}</span></p>
                            <p>الطرف الثاني: <span className="text-white">{partyB}</span></p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {!signed ? (
                            <button onClick={handleSign} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                <PenTool className="w-4 h-4"/> توقيع رقمي
                            </button>
                        ) : (
                            <button onClick={handleDownload} disabled={isGenerating} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                                تحميل العقد
                            </button>
                        )}
                        <button onClick={onClose} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold">إلغاء</button>
                    </div>
                </div>

                {/* Contract View */}
                <div className="flex-1 overflow-y-auto bg-gray-300 p-8 flex justify-center">
                    <div ref={contractRef} className="bg-white w-full max-w-[600px] min-h-[800px] p-12 shadow-2xl relative text-black">
                        
                        {/* Header */}
                        <div className="text-center border-b-2 border-black pb-6 mb-8">
                            <h1 className="text-3xl font-serif font-bold mb-2">
                                {type === 'JobOffer' ? 'عقد عمل وظيفي' : 'اتفاقية مبايعة وتنازل'}
                            </h1>
                            <p className="text-sm font-bold text-gray-500 tracking-widest">OFFICIAL AGREEMENT</p>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 text-justify leading-relaxed font-serif">
                            <p>
                                إنه في يوم <span className="font-bold">{new Date().toLocaleDateString('ar-SA')}</span>، تم الاتفاق بين كل من:
                            </p>
                            <p>
                                <span className="font-bold">الطرف الأول:</span> {partyA}
                            </p>
                            <p>
                                <span className="font-bold">الطرف الثاني:</span> {partyB}
                            </p>
                            
                            <div className="my-6 border-t border-gray-200"></div>

                            {type === 'JobOffer' ? (
                                <div>
                                    <h4 className="font-bold underline mb-2">بنود العرض الوظيفي:</h4>
                                    <ul className="list-disc pr-5 space-y-2">
                                        <li>المسمى الوظيفي: {terms.title}</li>
                                        <li>الراتب الأساسي: {terms.salary} ريال سعودي</li>
                                        <li>مدة العقد: {terms.duration || 'سنة واحدة قابلة للتجديد'}</li>
                                        <li>يخضع هذا العقد لنظام العمل السعودي.</li>
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="font-bold underline mb-2">تفاصيل المبايعة:</h4>
                                    <ul className="list-disc pr-5 space-y-2">
                                        <li>السلعة: {terms.itemName}</li>
                                        <li>المبلغ المتفق عليه: {terms.price} ريال سعودي</li>
                                        <li>الحالة: {terms.condition}</li>
                                        <li>يقر الطرف الثاني بمعاينة السلعة وقبولها بحالتها الراهنة.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Signatures */}
                        <div className="mt-20 flex justify-between items-end">
                            <div className="text-center w-32">
                                {signed && <div className="font-script text-2xl text-blue-900 mb-2">Signed</div>}
                                <div className="border-t border-black pt-2 font-bold text-sm">الطرف الأول</div>
                            </div>
                            <div className="text-center w-32">
                                {signed && <div className="font-script text-2xl text-blue-900 mb-2">{partyB.split(' ')[0]}</div>}
                                <div className="border-t border-black pt-2 font-bold text-sm">الطرف الثاني</div>
                            </div>
                        </div>

                        {/* Stamp */}
                        {signed && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-80 mix-blend-multiply transform -rotate-12 border-4 border-blue-800 rounded-full w-32 h-32 flex items-center justify-center p-2 text-center text-xs font-bold text-blue-800">
                                <div className="border border-blue-800 rounded-full w-full h-full flex items-center justify-center border-dashed">
                                    تم التوثيق<br/>إلكترونياً<br/>MURAD GROUP
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>

            </div>
        </div>
    );
};


import React, { useState } from 'react';
import { UploadCloud, FileText, Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { CorporateEngine } from '../../services/Enterprise/CorporateEngine';
import { ProductListing } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface Props {
    onClose: () => void;
}

export const BulkUploader: React.FC<Props> = ({ onClose }) => {
    const { createProduct } = useAuth();
    const [step, setStep] = useState<'upload' | 'preview' | 'syncing'>('upload');
    const [items, setItems] = useState<Partial<ProductListing>[]>([]);
    const [progress, setProgress] = useState(0);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const parsed = await CorporateEngine.getInstance().parseCSV(file);
                setItems(parsed);
                setStep('preview');
            } catch (err) {
                alert("Error parsing CSV");
            }
        }
    };

    const handleSync = async () => {
        setStep('syncing');
        for (let i = 0; i < items.length; i++) {
            await new Promise(r => setTimeout(r, 100)); // Simulate throttle
            createProduct(items[i] as any);
            setProgress(Math.round(((i + 1) / items.length) * 100));
        }
        setTimeout(onClose, 1000);
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-sans" dir="rtl">
            <div className="bg-[#0f172a] w-full max-w-3xl rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <UploadCloud className="w-6 h-6 text-blue-500"/> سحابة المعارض (Bulk Upload)
                        </h2>
                        <p className="text-xs text-gray-400">إدارة المخزون الجماعي للشركات والمعارض</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">إغلاق</button>
                </div>

                <div className="p-8">
                    {step === 'upload' && (
                        <div className="text-center space-y-6">
                            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-10 hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer relative">
                                <input type="file" accept=".csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4"/>
                                <h3 className="text-white font-bold text-lg">ارفع ملف المخزون (Excel/CSV)</h3>
                                <p className="text-gray-400 text-sm mt-2">يدعم حتى 500 منتج في الدفعة الواحدة</p>
                            </div>
                            <div className="text-xs text-gray-500">
                                الأعمدة المطلوبة: Title, Description, Price, Category, City
                            </div>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-bold">معاينة ({items.length} عنصر)</h3>
                                <button onClick={() => setStep('upload')} className="text-sm text-red-400">إلغاء</button>
                            </div>
                            <div className="bg-black/30 rounded-xl border border-white/10 max-h-60 overflow-y-auto p-4">
                                <table className="w-full text-right text-sm text-gray-300">
                                    <thead className="text-xs uppercase text-gray-500 border-b border-white/10">
                                        <tr>
                                            <th className="pb-2">العنوان</th>
                                            <th className="pb-2">السعر</th>
                                            <th className="pb-2">التصنيف</th>
                                            <th className="pb-2">المدينة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-2">{item.title}</td>
                                                <td className="py-2 font-mono text-emerald-400">{item.price}</td>
                                                <td className="py-2">{item.category}</td>
                                                <td className="py-2">{item.location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={handleSync} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                                <Save className="w-5 h-5"/> مزامنة المخزون
                            </button>
                        </div>
                    )}

                    {step === 'syncing' && (
                        <div className="text-center py-10">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6"/>
                            <h3 className="text-xl font-bold text-white mb-2">جاري المزامنة مع السحابة...</h3>
                            <div className="w-full max-w-md mx-auto bg-gray-700 h-2 rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
                            </div>
                            <p className="text-emerald-400 font-mono mt-2">{progress}% Completed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

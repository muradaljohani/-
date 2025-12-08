import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Loader2, ArrowLeft, LayoutGrid, CheckCircle2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const UserFieldsDashboard: React.FC<Props> = ({ onBack }) => {
  const { user, saveUserFormFields, requireAuth } = useAuth();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize fields
  useEffect(() => {
    requireAuth(() => {
        if (user) {
            // Load from user object (which comes from AuthContext -> Firestore)
            const initialFields: Record<string, string> = {};
            // Populate with existing data if available, or empty string
            // We use 'f1' to 'f30' as keys
            for (let i = 1; i <= 30; i++) {
                const key = `f${i}`;
                // Check if user has this field in root or inside customFormFields
                // We prioritize customFormFields, but check root for legacy compatibility if any
                initialFields[key] = user.customFormFields?.[key] || (user as any)[key] || '';
            }
            setFields(initialFields);
        }
    });
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
    setIsSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Call context function to save to Firestore
    const success = await saveUserFormFields(fields);
    
    setIsSaving(false);
    if (success) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    } else {
        alert("حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="bg-[#1e293b] text-white p-6 sticky top-0 z-30 shadow-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <ArrowLeft className="w-5 h-5 rtl:rotate-180"/>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-blue-400"/> لوحة بيانات المستخدم
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">مرحباً: <span className="text-white font-bold">{user.email}</span></p>
                    </div>
                </div>
                {isSuccess && (
                    <div className="hidden md:flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/30 animate-fade-in-up">
                        <CheckCircle2 className="w-5 h-5"/>
                        <span className="text-sm font-bold">تم حفظ البيانات بنجاح</span>
                    </div>
                )}
            </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-6 md:p-8">
            <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((i) => (
                        <div key={i} className="group">
                            <label className="block text-xs font-bold text-gray-500 mb-2 group-focus-within:text-blue-600 transition-colors">
                                الخانة {i}
                            </label>
                            <input 
                                type="text" 
                                id={`f${i}`}
                                value={fields[`f${i}`] || ''}
                                onChange={(e) => handleChange(`f${i}`, e.target.value)}
                                placeholder={`بيانات حقل ${i}...`}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm focus:shadow-md"
                            />
                        </div>
                    ))}
                </div>

                <div className="sticky bottom-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-blue-600/20 flex items-center gap-3 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                        {isSaving ? 'جاري الحفظ...' : 'حفظ البيانات'}
                    </button>
                </div>

            </form>
        </main>
    </div>
  );
};

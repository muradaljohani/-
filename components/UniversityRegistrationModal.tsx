
import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Loader2, CheckCircle2, Server, Database, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const UniversityRegistrationModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  
  // Loading simulation state
  const [loadingText, setLoadingText] = useState('جاري الاتصال بالسيرفر الأكاديمي...');
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !major) return;
    setStep('processing');
    
    // Simulate complex system initialization
    const stages = [
        { pct: 20, text: 'جاري إنشاء الرقم الأكاديمي الموحد...' },
        { pct: 40, text: `تهيئة المسار الأكاديمي لتخصص: ${major}...` },
        { pct: 60, text: 'ربط المكتبة الرقمية (1000+ مصدر)...' },
        { pct: 80, text: 'تفعيل بوت المساعدة الذكي...' },
        { pct: 100, text: 'اكتمال النظام.' }
    ];

    let currentStage = 0;

    const interval = setInterval(() => {
        if (currentStage >= stages.length) {
            clearInterval(interval);
            
            // Actually update the user profile
            updateProfile({
                name: name,
                major: major,
                trainingId: `STU-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                studentLevelTitle: 'طالب جامعي مستجد'
            });

            setStep('success');
            setTimeout(() => {
                onComplete();
                onClose();
            }, 1500);
        } else {
            setProgress(stages[currentStage].pct);
            setLoadingText(stages[currentStage].text);
            currentStage++;
        }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0f172a]/95 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
      
      <div className="relative w-full max-w-md bg-[#1e293b] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-[#1e293b] p-6 border-b border-white/10 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400"/>
                    بوابة التسجيل الذكي
                </h2>
                <p className="text-[10px] text-blue-300/80 font-mono mt-1">University Admission System v3.0</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-8">
            {step === 'input' && (
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                            <User className="w-10 h-10 text-blue-400"/>
                        </div>
                        <h3 className="text-white font-bold">بيانات الملف الأكاديمي</h3>
                        <p className="text-xs text-gray-400 mt-1">سيقوم النظام ببناء خطة دراسية كاملة بناءً على تخصصك.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">الاسم الثلاثي</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                            placeholder="اكتب اسمك الكامل..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">التخصص الجامعي / المسار</label>
                        <select 
                            required
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                        >
                            <option value="">اختر التخصص...</option>
                            <option value="Computer Science">علوم الحاسب (Computer Science)</option>
                            <option value="Business Admin">إدارة أعمال (Business Admin)</option>
                            <option value="Engineering">هندسة (Engineering)</option>
                            <option value="Medicine">طب (Medicine)</option>
                            <option value="Law">قانون (Law)</option>
                            <option value="Other">مسار عام (General)</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all">
                        بدء تهيئة النظام <Cpu className="w-4 h-4"/>
                    </button>
                </form>
            )}

            {step === 'processing' && (
                <div className="text-center py-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        <Database className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse"/>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 animate-pulse">{loadingText}</h3>
                    <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-emerald-400 font-mono mt-2">{progress}% Completed</p>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-10 animate-fade-in-up">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400"/>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">تم إنشاء الملف الأكاديمي</h3>
                    <p className="text-gray-400 text-sm">جاري توجيهك إلى لوحة التحكم المركزية...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

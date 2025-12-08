
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, ArrowLeft, BookOpen, Lock } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const CoursesList: React.FC<Props> = ({ onBack }) => {
  const { requireAuth } = useAuth();

  const handleOpenCourse = (courseId: number) => {
      requireAuth(() => {
          // Use window.location for full navigation or router hook if available.
          // Since we use simple router in App.tsx:
          window.history.pushState({}, '', `/courses/${courseId}`);
          const event = new PopStateEvent('popstate');
          window.dispatchEvent(event);
      });
  };

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
                            <BookOpen className="w-6 h-6 text-emerald-400"/> الحقائب التدريبية
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">50 دورة تدريبية شاملة</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Grid Content */}
        <main className="max-w-7xl mx-auto p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 50 }, (_, i) => i + 1).map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col">
                        <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center relative">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                             <span className="text-4xl font-black text-white/20 absolute right-4 bottom-0">{i}</span>
                             <BookOpen className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform"/>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">الدورة التدريبية رقم {i}</h3>
                            <p className="text-xs text-gray-500 mb-4 flex-1">دورة شاملة تغطي المهارات الأساسية والمتقدمة في المجال التقني والإداري.</p>
                            
                            <button 
                                onClick={() => handleOpenCourse(i)}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <PlayCircle className="w-4 h-4"/> عرض الدورة
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    </div>
  );
};

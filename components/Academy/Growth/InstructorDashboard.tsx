
import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, DollarSign, Users, PlusCircle, TrendingUp, BarChart } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { PublishModal } from '../../PublishModal';

export const InstructorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [isPublishOpen, setIsPublishOpen] = useState(false);

    // Mock Stats based on user wallet and published items
    const earnings = user?.wallet?.ledger
        .filter(t => t.description.includes('Course Sale'))
        .reduce((sum, t) => sum + t.amount, 0) || 0;
    
    const coursesCount = user?.publishedItems?.filter(i => i.type === 'Course').length || 0;
    const totalStudents = Math.floor(earnings / 50); // Mock calculation

    return (
        <div className="space-y-8 animate-fade-in-up font-sans" dir="rtl">
            
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-16 h-16 text-emerald-500"/></div>
                    <div className="relative z-10">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">إجمالي الأرباح</div>
                        <div className="text-3xl font-black text-white">{earnings.toFixed(2)} <span className="text-sm font-normal text-gray-500">ر.س</span></div>
                        <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% هذا الشهر</div>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-16 h-16 text-blue-500"/></div>
                    <div className="relative z-10">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">الطلاب المسجلين</div>
                        <div className="text-3xl font-black text-white">{totalStudents}</div>
                        <div className="text-xs text-blue-400 mt-1">نشط حالياً</div>
                    </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BookOpen className="w-16 h-16 text-purple-500"/></div>
                    <div className="relative z-10">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">الدورات النشطة</div>
                        <div className="text-3xl font-black text-white">{coursesCount}</div>
                        <div className="text-xs text-purple-400 mt-1">جاهزة للبيع</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setIsPublishOpen(true)}>
                    <div className="bg-white/20 p-3 rounded-full mb-3"><PlusCircle className="w-8 h-8 text-white"/></div>
                    <h3 className="text-white font-bold text-lg">إنشاء دورة جديدة</h3>
                    <p className="text-blue-100 text-xs mt-1">ابدأ التدريس واربح المال</p>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-gray-400"/> إدارة المحتوى التعليمي
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm text-gray-300">
                        <thead className="bg-black/20 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="p-4">عنوان الدورة</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4">المبيعات</th>
                                <th className="p-4">التقييم</th>
                                <th className="p-4">الإيراد</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {user?.publishedItems?.filter(i => i.type === 'Course').map(course => (
                                <tr key={course.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white">{course.title}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${course.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{Math.floor(Math.random() * 50)}</td>
                                    <td className="p-4 flex items-center gap-1 text-yellow-500">4.8 <StarIcon className="w-3 h-3 fill-current"/></td>
                                    <td className="p-4 font-mono text-emerald-400">{course.price * 0.7} SAR</td>
                                </tr>
                            ))}
                            {coursesCount === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        لم تقم بنشر أي دورات بعد. اضغط على "إنشاء دورة جديدة" للبدء.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PublishModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} />
        </div>
    );
};

// Helper
const StarIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

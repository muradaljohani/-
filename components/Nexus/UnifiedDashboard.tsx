
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, BookOpen, ShoppingBag, Activity, Clock } from 'lucide-react';

export const UnifiedDashboard: React.FC = () => {
    const { user, allJobs, allServices } = useAuth();

    if (!user) return null;

    // Filter data for this user
    const myServices = allServices.filter(s => s.sellerId === user.id);
    const activeCourses = user.enrolledCourses || [];
    const completedCourses = user.certificates || [];

    return (
        <div className="p-6 bg-[#0f172a] rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg"><Activity className="w-5 h-5 text-indigo-400"/></div>
                <h2 className="text-xl font-bold text-white">لوحة القيادة الموحدة (Nexus View)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. TRAINING */}
                <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><BookOpen className="w-5 h-5"/></div>
                        <span className="text-2xl font-black text-white">{activeCourses.length}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-300">التدريب النشط</h3>
                    <div className="mt-2 space-y-1">
                        {activeCourses.slice(0, 2).map((c, i) => (
                            <div key={i} className="text-xs text-gray-500 flex justify-between">
                                <span className="truncate max-w-[70%]">{c.courseId}</span>
                                <span className="text-blue-400">{c.progress}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. MARKET */}
                <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><ShoppingBag className="w-5 h-5"/></div>
                        <span className="text-2xl font-black text-white">{myServices.length}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-300">خدماتك في السوق</h3>
                    <div className="mt-2 text-xs text-gray-500">
                        {myServices.length > 0 ? 'نشط في السوق' : 'لا توجد خدمات'}
                    </div>
                </div>

                {/* 3. JOBS */}
                <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Briefcase className="w-5 h-5"/></div>
                        <span className="text-2xl font-black text-white">0</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-300">تقديمات الوظائف</h3>
                    <div className="mt-2 text-xs text-gray-500">
                        يتم تتبع التقديمات تلقائياً
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-3 h-3"/> النشاط الأخير
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                        <div>
                            <p className="text-sm text-gray-200">تسجيل دخول للنظام الموحد</p>
                            <p className="text-[10px] text-gray-500">الآن</p>
                        </div>
                    </div>
                    {completedCourses.length > 0 && (
                        <div className="flex gap-3">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                            <div>
                                <p className="text-sm text-gray-200">إصدار شهادة: {completedCourses[0].courseName}</p>
                                <p className="text-[10px] text-gray-500">{completedCourses[0].issuedAt}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

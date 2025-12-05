
import React, { useState } from 'react';
import { 
    User, Briefcase, GraduationCap, ShoppingBag, 
    Wallet, Settings, LogOut, CheckCircle2, 
    Clock, Trophy, TrendingUp, Download, ArrowUpRight, BookOpen, Play,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AcademicTranscript } from '../Academy/AcademicTranscript';
import { VirtualClassroom } from '../Academy/VirtualClassroom';
import { SmartIDCard } from '../Identity/SmartIDCard'; // Imported
import { CommunityPulse } from '../Social/CommunityPulse'; // Imported
import { InstallPrompt } from '../Mobile/InstallPrompt'; // Imported

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const UniversalProfileHub: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState<'overview' | 'academy' | 'wallet' | 'jobs' | 'id_card'>('overview');
    const [activeCourse, setActiveCourse] = useState<any>(null);

    if (!isOpen || !user) return null;

    // --- Aggregated Data ---
    const walletBalance = user.wallet?.balance || 0;
    const coursesCount = user.enrolledCourses?.length || 0;
    const certsCount = user.certificates?.length || 0;
    const servicesCount = user.myServices?.length || 0;
    
    // Determine status color
    const statusColor = user.isIdentityVerified ? 'text-emerald-400' : 'text-amber-400';
    const statusBg = user.isIdentityVerified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20';

    const SidebarItem = ({ id, icon, label }: any) => (
        <button 
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeSection === id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {icon}
            <span className="text-sm font-bold">{label}</span>
        </button>
    );

    const handleStartCourse = (course: any) => {
        const extendedCourse = {
            ...course,
            title: course.courseId,
            id: 'c_' + Math.random(),
            unlocksPermission: 'sell_marketing'
        };
        setActiveCourse(extendedCourse);
    };

    return (
        <>
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-0 md:p-6 bg-[#0f172a]/95 backdrop-blur-xl font-sans animate-fade-in-up" dir="rtl">
            <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0f172a] md:rounded-3xl shadow-2xl border border-white/10 flex overflow-hidden">
                
                {/* Sidebar */}
                <div className="w-72 bg-[#0b1120] border-l border-white/10 flex flex-col p-6 hidden md:flex">
                    {/* User Card */}
                    <div className="text-center mb-8">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full rounded-full border-4 border-[#1e293b] shadow-xl object-cover"/>
                            {user.isIdentityVerified && <div className="absolute bottom-0 right-0 bg-emerald-500 border-4 border-[#0b1120] rounded-full p-1"><CheckCircle2 className="w-4 h-4 text-white"/></div>}
                        </div>
                        <h2 className="text-white font-bold text-lg mb-1">{user.name}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBg} ${statusColor}`}>
                            {user.isIdentityVerified ? 'هوية موثقة' : 'غير موثق'}
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="flex-1 space-y-2">
                        <SidebarItem id="overview" icon={<User className="w-5 h-5"/>} label="النظرة العامة" />
                        <SidebarItem id="id_card" icon={<CreditCard className="w-5 h-5"/>} label="بطاقتي الرقمية" />
                        <SidebarItem id="academy" icon={<GraduationCap className="w-5 h-5"/>} label="السجل الأكاديمي" />
                        <SidebarItem id="wallet" icon={<Wallet className="w-5 h-5"/>} label="المحفظة المالية" />
                        <SidebarItem id="jobs" icon={<Briefcase className="w-5 h-5"/>} label="المسار المهني" />
                        <InstallPrompt />
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/10 space-y-2">
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                            <Settings className="w-5 h-5"/> الإعدادات
                        </button>
                        <button onClick={() => { logout(); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold">
                            <LogOut className="w-5 h-5"/> تسجيل الخروج
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 md:p-10 relative">
                    
                    {/* Mobile Close */}
                    <button onClick={onClose} className="md:hidden absolute top-4 left-4 p-2 bg-white/10 rounded-full text-white z-20">
                        <LogOut className="w-5 h-5 rtl:rotate-180"/>
                    </button>

                    {/* Content Views */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-black text-white mb-2">مرحباً، {user.name.split(' ')[0]} 👋</h1>
                                    <p className="text-gray-400">إليك ملخص نشاطك في منظومة ميلاف الموحدة</p>
                                </div>
                                
                                {/* Community Widget */}
                                <div className="w-full md:w-80">
                                    <CommunityPulse />
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Wallet className="w-6 h-6"/></div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors"/>
                                    </div>
                                    <div className="text-3xl font-black text-white mb-1">{walletBalance} <span className="text-sm font-normal text-gray-500">ر.س</span></div>
                                    <div className="text-xs text-gray-400">الرصيد المتاح</div>
                                </div>

                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><GraduationCap className="w-6 h-6"/></div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors"/>
                                    </div>
                                    <div className="text-3xl font-black text-white mb-1">{coursesCount}</div>
                                    <div className="text-xs text-gray-400">الدورات النشطة</div>
                                </div>

                                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><ShoppingBag className="w-6 h-6"/></div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors"/>
                                    </div>
                                    <div className="text-3xl font-black text-white mb-1">{servicesCount}</div>
                                    <div className="text-xs text-gray-400">خدمات منشورة</div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-black/20 rounded-2xl border border-white/5 p-6">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400"/> آخر النشاطات
                                </h3>
                                <div className="space-y-4">
                                    {user.notifications?.slice(0, 3).map((notif, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-[#1e293b]/50 rounded-xl border border-white/5">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            </div>
                                            <div>
                                                <h4 className="text-white text-sm font-bold mb-1">{notif.title}</h4>
                                                <p className="text-gray-400 text-xs">{notif.message}</p>
                                                <span className="text-[10px] text-gray-600 mt-2 block">{new Date(notif.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!user.notifications || user.notifications.length === 0) && (
                                        <div className="text-center text-gray-500 text-sm py-4">لا توجد نشاطات حديثة.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'id_card' && (
                        <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
                            <h2 className="text-2xl font-black text-white mb-2">بطاقتك الجامعية الرقمية</h2>
                            <p className="text-gray-400 text-sm mb-8">اضغط على البطاقة لقلبها • استخدمها للتعريف في الفعاليات والمقررات</p>
                            <SmartIDCard user={user} />
                        </div>
                    )}

                    {activeSection === 'academy' && (
                        <div className="space-y-8 animate-fade-in-up">
                            
                            {/* Academic Header */}
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">الملف الأكاديمي</h2>
                                    <p className="text-gray-400 text-sm">تتبع مسارك التعليمي ودرجاتك</p>
                                </div>
                                <div className="bg-white/5 px-4 py-2 rounded-xl text-center">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">GPA</div>
                                    <div className="text-xl font-black text-emerald-400">{user.transcript ? 'CALC' : '4.00'}</div>
                                </div>
                            </div>

                            {/* Enrolled Courses */}
                            {user.enrolledCourses && user.enrolledCourses.length > 0 && (
                                <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 mb-8">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Play className="w-4 h-4 text-blue-500"/> متابعة الدراسة</h3>
                                    <div className="grid gap-4">
                                        {user.enrolledCourses.map((c, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400">
                                                        <BookOpen className="w-6 h-6"/>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-sm">{c.courseId}</h4>
                                                        <div className="w-32 bg-gray-700 h-1.5 rounded-full mt-2">
                                                            <div className="bg-blue-500 h-full rounded-full" style={{width: `${c.progress}%`}}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleStartCourse(c)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                                                >
                                                    {c.progress > 0 ? 'متابعة' : 'ابدأ'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Transcript */}
                            <AcademicTranscript />

                            {/* Certificates Grid */}
                            <h3 className="text-white font-bold text-lg mt-8 mb-4">الشهادات المكتسبة</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certsCount > 0 ? (
                                    user.certificates?.map(cert => (
                                        <div key={cert.id} className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 flex justify-between items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                                    <Trophy className="w-6 h-6"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-sm">{cert.courseName}</h3>
                                                    <p className="text-gray-400 text-xs">تاريخ: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors">
                                                <Download className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-10 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                        <GraduationCap className="w-10 h-10 text-gray-600 mx-auto mb-2"/>
                                        <p className="text-gray-500 text-sm">لم تحصل على شهادات بعد.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>

        {/* LMS OVERLAY */}
        {activeCourse && (
            <VirtualClassroom 
                course={activeCourse} 
                onClose={() => setActiveCourse(null)} 
            />
        )}
        </>
    );
};

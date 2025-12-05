
import React from 'react';
import { 
  X, GraduationCap, BookOpen, Clock, 
  FileText, Bot, Search, LayoutDashboard,
  Calendar, Briefcase, Award, ArrowLeft, PlayCircle,
  FileCheck, Shield, Library, CheckCircle2,
  MoreHorizontal, Download, Book
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onClose: () => void;
}

export const TraineeJourney: React.FC<Props> = ({ onClose }) => {
  const { user } = useAuth();

  // --- MOCK DATA FOR DASHBOARD ---
  const coreCourses = [
      { code: 'UNIV-101', name: 'مهارات البحث العلمي وكتابة التقارير', type: 'فيديو + PDF', instructor: 'د. أحمد (جامعة الملك سعود)', status: 'active' },
      { code: 'ENG-102', name: 'اللغة الإنجليزية للأغراض الأكاديمية', type: 'كورس تفاعلي', instructor: 'British Council', status: 'pending' },
      { code: 'CS-101', name: 'مقدمة في التحول الرقمي والذكاء الاصطناعي', type: 'فيديو عملي', instructor: 'أكاديمية ميلاف', status: 'pending' },
      { code: 'MGT-201', name: 'مبادئ الإدارة الحديثة والقيادة', type: 'ورشة عمل', instructor: 'معهد الإدارة', status: 'locked' },
  ];

  const careerPaths = [
      { title: 'الرخصة الدولية للحاسب (ICDL)', progress: 0, color: 'bg-blue-500' },
      { title: 'تطوير الذات والقيادة', progress: 15, color: 'bg-emerald-500' },
      { title: 'اللغة الإنجليزية المكثف (IELTS)', progress: 5, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-[250] bg-[#0f172a] flex flex-col font-sans text-right animate-fade-in-up overflow-hidden" dir="rtl">
      
      {/* --- HEADER (System Top Bar) --- */}
      <div className="h-16 bg-[#1e293b] border-b border-white/10 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-md z-20">
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-white"/>
                  </div>
                  <div>
                      <h1 className="text-white font-bold text-sm leading-tight">نظام إدارة التعلم (LMS)</h1>
                      <p className="text-[10px] text-blue-400 font-mono">Mylaf Academic Portal</p>
                  </div>
              </div>
              <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>
              <div className="hidden md:flex items-center gap-6 text-xs text-gray-300">
                  <span className="hover:text-white cursor-pointer">المقررات</span>
                  <span className="hover:text-white cursor-pointer">الجدول الدراسي</span>
                  <span className="hover:text-white cursor-pointer">السجل الأكاديمي</span>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs text-emerald-400 font-bold">متصل</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5"/>
              </button>
          </div>
      </div>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0f172a] scrollbar-thin scrollbar-thumb-white/10">
          <div className="max-w-7xl mx-auto space-y-6">
              
              {/* 1. STUDENT HEADER CARD */}
              <div className="bg-gradient-to-r from-blue-900 to-[#1e293b] rounded-2xl p-6 border border-blue-500/20 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-blue-500/30 p-1 bg-[#0f172a] shrink-0">
                              <img src={user?.avatar} className="w-full h-full rounded-full object-cover"/>
                          </div>
                          <div>
                              <h2 className="text-xl md:text-2xl font-black text-white mb-1">{user?.name}</h2>
                              <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="bg-white/10 px-2 py-1 rounded text-gray-300">الرقم: <span className="font-mono text-white">{user?.trainingId}</span></span>
                                  <span className="bg-white/10 px-2 py-1 rounded text-gray-300">التخصص: <span className="font-bold text-amber-400">{user?.major || 'عام'}</span></span>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-4 text-center w-full md:w-auto">
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex-1 md:flex-none">
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">الحالة الأكاديمية</div>
                              <div className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3"/> طالب نشط</div>
                          </div>
                          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex-1 md:flex-none">
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">المعدل التراكمي</div>
                              <div className="text-white font-bold text-sm font-mono">4.0 / 5.0</div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 2. DASHBOARD GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* LEFT COL: Core Courses Table */}
                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
                          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1e293b]">
                              <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base"><BookOpen className="w-5 h-5 text-blue-500"/> المقررات الأساسية</h3>
                              <button className="text-xs text-blue-400 hover:text-white">عرض الجدول الكامل</button>
                          </div>
                          
                          {/* Responsive Table Container */}
                          <div className="overflow-x-auto">
                              <table className="w-full text-right text-sm responsive-table">
                                  <thead className="bg-black/20 text-gray-400 text-xs uppercase font-bold">
                                      <tr>
                                          <th className="p-4">رمز المادة</th>
                                          <th className="p-4">اسم المقرر</th>
                                          <th className="p-4 hidden md:table-cell">النوع</th>
                                          <th className="p-4 hidden md:table-cell">المرجع</th>
                                          <th className="p-4">الإجراء</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5 text-gray-300">
                                      {coreCourses.map((c, i) => (
                                          <tr key={i} className="hover:bg-white/5 transition-colors">
                                              <td className="p-4 font-mono text-blue-300" data-label="رمز المادة">{c.code}</td>
                                              <td className="p-4 font-bold text-white" data-label="اسم المقرر">{c.name}</td>
                                              <td className="p-4 hidden md:table-cell" data-label="النوع">{c.type}</td>
                                              <td className="p-4 hidden md:table-cell text-xs opacity-70" data-label="المرجع">{c.instructor}</td>
                                              <td className="p-4" data-label="الإجراء">
                                                  {c.status === 'active' || c.status === 'pending' ? (
                                                      <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors w-full md:w-auto justify-center">
                                                          <PlayCircle className="w-3 h-3"/> ابدأ
                                                      </button>
                                                  ) : (
                                                      <span className="text-gray-500 flex items-center gap-1 text-xs justify-end md:justify-start"><Shield className="w-3 h-3"/> مغلق</span>
                                                  )}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                          <div className="p-3 bg-black/20 text-center text-[10px] text-gray-500 border-t border-white/5">
                              يوجد 50+ مادة إضافية في الأرشيف الأكاديمي
                          </div>
                      </div>

                      {/* Career Paths */}
                      <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-amber-500"/> المسارات المهنية الموصى بها</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {careerPaths.map((path, i) => (
                                  <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                      <div className="flex justify-between items-start mb-2">
                                          <Award className={`w-8 h-8 ${path.color.replace('bg-', 'text-')}`}/>
                                          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">مهني</span>
                                      </div>
                                      <h4 className="text-white font-bold text-sm mb-2 h-10">{path.title}</h4>
                                      <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-1">
                                          <div className={`${path.color} h-full`} style={{width: `${path.progress}%`}}></div>
                                      </div>
                                      <span className="text-[10px] text-gray-500">{path.progress}% مكتمل</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* RIGHT COL: Tools & Library */}
                  <div className="space-y-6">
                      
                      {/* Mega Library Stats */}
                      <div className="bg-gradient-to-br from-emerald-900/40 to-[#1e293b] rounded-2xl p-5 border border-emerald-500/20">
                          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Library className="w-5 h-5 text-emerald-400"/> المكتبة المليونية</h3>
                          <div className="space-y-3">
                              <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Book className="w-4 h-4"/></div>
                                      <div>
                                          <div className="text-white font-bold text-sm">450+</div>
                                          <div className="text-[10px] text-gray-400">كتاب تخصصي</div>
                                      </div>
                                  </div>
                                  <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white">تصفح</button>
                              </div>
                              <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><FileText className="w-4 h-4"/></div>
                                      <div>
                                          <div className="text-white font-bold text-sm">300+</div>
                                          <div className="text-[10px] text-gray-400">ملخص ومراجعة</div>
                                      </div>
                                  </div>
                                  <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white">تحميل</button>
                              </div>
                              <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><GraduationCap className="w-4 h-4"/></div>
                                      <div>
                                          <div className="text-white font-bold text-sm">250+</div>
                                          <div className="text-[10px] text-gray-400">رسالة علمية</div>
                                      </div>
                                  </div>
                                  <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white">اطلاع</button>
                              </div>
                          </div>
                          <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                              <Search className="w-3 h-3"/> بحث في المكتبة الشاملة
                          </button>
                      </div>

                      {/* Student Tools */}
                      <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-5">
                          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Bot className="w-5 h-5 text-pink-400"/> أدوات الطالب الذكية</h3>
                          <div className="grid grid-cols-2 gap-3">
                              <button className="flex flex-col items-center justify-center bg-black/20 hover:bg-white/5 p-4 rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group">
                                  <Bot className="w-6 h-6 text-pink-400 mb-2 group-hover:scale-110 transition-transform"/>
                                  <span className="text-[10px] text-white font-bold">بوت الواجبات</span>
                              </button>
                              <button className="flex flex-col items-center justify-center bg-black/20 hover:bg-white/5 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                  <Calendar className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform"/>
                                  <span className="text-[10px] text-white font-bold">الجدول الدراسي</span>
                              </button>
                              <button className="flex flex-col items-center justify-center bg-black/20 hover:bg-white/5 p-4 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all group col-span-2">
                                  <Briefcase className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition-transform"/>
                                  <span className="text-[10px] text-white font-bold">سوق ميلاف للعمل الحر (للطلاب)</span>
                              </button>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, LifeBuoy, FileText, MessageSquare, CheckCircle2, AlertCircle, ArrowRight, Globe, Lock, Activity, Server, Database, Headset, ChevronLeft, Home, Cloud } from 'lucide-react';
import { SupportTicketWizard } from './SupportTicketWizard';
import { KnowledgeBaseSEO } from './KnowledgeBaseSEO';
import { TicketTracker } from './TicketTracker';
import { SEOHelmet } from '../SEOHelmet';

interface Props {
    onExit: () => void;
}

export const SupportPortal: React.FC<Props> = ({ onExit }) => {
    const [view, setView] = useState<'home' | 'ticket' | 'track' | 'kb'>('home');
    const [searchQuery, setSearchQuery] = useState('');

    // --- DEEP LINKING HANDLER ---
    useEffect(() => {
        const handlePath = () => {
            const path = window.location.pathname;
            if (path.includes('/support/ticket')) setView('ticket');
            else if (path.includes('/support/track')) setView('track');
            else if (path.includes('/support/kb')) setView('kb');
            else setView('home');
        };
        
        handlePath();
        window.addEventListener('popstate', handlePath);
        return () => window.removeEventListener('popstate', handlePath);
    }, []);

    // --- NAVIGATION HELPER ---
    const navigateTo = (subPath: string) => {
        const fullPath = subPath === 'home' ? '/support' : `/support/${subPath}`;
        window.history.pushState({}, '', fullPath);
        const event = new PopStateEvent('popstate');
        window.dispatchEvent(event);
    };

    const handleGlobalNav = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    // Simulated "System Status"
    const systemStatus = {
        core: 'Operational',
        payments: 'Operational',
        api: 'Operational',
        support: 'High Load'
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-[#f1f5f9] overflow-y-auto font-sans text-right" dir="rtl">
            <SEOHelmet 
                title={view === 'home' ? "مركز مساعدة مجموعة مراد" : view === 'ticket' ? "فتح تذكرة جديدة | مراد كير" : view === 'kb' ? "قاعدة المعرفة | مراد كير" : "متابعة الطلبات | مراد كير"} 
                description="النظام الرسمي لاستقبال البلاغات والشكاوى والدعم الفني لمجموعة شركات ومنصات مراد. تتبع تذكرتك، تواصل مع الدعم، واطلع على قاعدة المعرفة."
                path={window.location.pathname}
            />

            {/* TOP BAR: Corporate Identity */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('home')}>
                        <div className="w-12 h-12 bg-[#0f172a] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg">M</div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-[#0f172a] flex items-center gap-2 tracking-tight">
                                Murad Care <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full uppercase tracking-wider border border-blue-100">Enterprise System</span>
                            </h1>
                            <p className="text-[10px] text-slate-500 font-mono tracking-widest">support.murad-group.com | .im-murad7</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500 border-l border-slate-200 pl-4 ml-4">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> الأنظمة تعمل</span>
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> اتصال آمن (SSL)</span>
                        </div>
                        <button onClick={onExit} className="flex items-center gap-2 text-sm font-bold text-white bg-[#0f172a] px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-md">
                             <Home className="w-4 h-4"/> المنصة الرئيسية
                        </button>
                    </div>
                </div>
            </div>

            {view === 'home' && (
                <>
                    {/* HERO SEARCH */}
                    <div className="bg-[#0f172a] py-24 px-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
                        
                        <div className="max-w-3xl mx-auto text-center relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-bold mb-6 backdrop-blur-md">
                                <Headset className="w-4 h-4"/> مركز خدمات المستفيدين الموحد
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                                كيف يمكننا <span className="text-blue-500">خدمتك</span> اليوم؟
                            </h2>
                            <div className="relative group max-w-2xl mx-auto">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl group-hover:bg-blue-500/30 transition-all"></div>
                                <div className="relative flex items-center">
                                    <input 
                                        type="text" 
                                        placeholder="ابحث عن مشكلة، كود خطأ، رقم تذكرة، أو موضوع..." 
                                        className="w-full p-5 pr-14 rounded-2xl text-lg outline-none shadow-2xl border border-white/10 bg-white/95 text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-blue-500/30 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search className="absolute right-5 w-6 h-6 text-slate-400"/>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
                                <span className="font-bold text-slate-500">شائع الآن:</span>
                                <button className="hover:text-white hover:underline decoration-blue-500 decoration-2 underline-offset-4 transition-all">استعادة كلمة المرور</button>
                                <span className="text-slate-700">•</span>
                                <button className="hover:text-white hover:underline decoration-blue-500 decoration-2 underline-offset-4 transition-all">مشكلة في الدفع</button>
                                <span className="text-slate-700">•</span>
                                <button className="hover:text-white hover:underline decoration-blue-500 decoration-2 underline-offset-4 transition-all">توثيق الحساب</button>
                            </div>
                        </div>
                    </div>

                    {/* MAIN ACTIONS */}
                    <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            <div onClick={() => navigateTo('ticket')} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:h-full transition-all duration-300"></div>
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-sm">
                                    <FileText className="w-7 h-7 text-blue-600 group-hover:text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-blue-700 transition-colors">رفع شكوى / تذكرة</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">واجهت مشكلة تقنية أو مالية؟ ارفع بلاغ رسمي وسيقوم فريقنا المختص بالرد.</p>
                                <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                    بدء الخدمة <ArrowRight className="w-4 h-4 mr-2 rtl:rotate-180"/>
                                </div>
                            </div>

                            <div onClick={() => navigateTo('track')} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:h-full transition-all duration-300"></div>
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors shadow-sm">
                                    <Activity className="w-7 h-7 text-emerald-600 group-hover:text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-emerald-700 transition-colors">متابعة الطلبات</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">أدخل رقم التذكرة (Ticket ID) لمعرفة حالتها الحالية والردود الجديدة.</p>
                                <div className="mt-6 flex items-center text-emerald-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                    تتبع الآن <ArrowRight className="w-4 h-4 mr-2 rtl:rotate-180"/>
                                </div>
                            </div>

                            <div onClick={() => navigateTo('kb')} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:h-full transition-all duration-300"></div>
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors shadow-sm">
                                    <Globe className="w-7 h-7 text-purple-600 group-hover:text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-purple-700 transition-colors">الدليل المعرفي (KB)</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">تصفح قاعدة بيانات ضخمة تحتوي على حلول فورية، شروحات، وأدلة استخدام.</p>
                                <div className="mt-6 flex items-center text-purple-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                    تصفح الحلول <ArrowRight className="w-4 h-4 mr-2 rtl:rotate-180"/>
                                </div>
                            </div>

                            <div onClick={() => handleGlobalNav('/cloud')} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 group-hover:h-full transition-all duration-300"></div>
                                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 transition-colors shadow-sm">
                                    <Cloud className="w-7 h-7 text-cyan-600 group-hover:text-white"/>
                                </div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-cyan-700 transition-colors">مراد كلاود</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">الموسوعة التقنية الشاملة. مقالات، شروحات برمجية، ووثائق النظام.</p>
                                <div className="mt-6 flex items-center text-cyan-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                    دخول الموسوعة <ArrowRight className="w-4 h-4 mr-2 rtl:rotate-180"/>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* STATUS BAR */}
                    <div className="max-w-7xl mx-auto px-6 py-16">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2">
                                <Server className="w-5 h-5 text-slate-400"/> حالة الأنظمة الحية (Live Status)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(systemStatus).map(([sys, stat]) => (
                                    <div key={sys} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="text-sm font-bold text-slate-700 capitalize">{sys}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${stat === 'Operational' ? 'text-emerald-600' : 'text-amber-600'}`}>{stat}</span>
                                            <div className={`w-2 h-2 rounded-full ${stat === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MASSIVE SEO FOOTPRINT */}
                    <div className="bg-white border-t border-slate-200 py-16">
                         <KnowledgeBaseSEO fullMode={true} />
                    </div>
                </>
            )}

            {view === 'ticket' && (
                <div className="max-w-4xl mx-auto px-6 py-10 min-h-screen">
                    <button onClick={() => navigateTo('home')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <ArrowRight className="w-4 h-4"/> العودة للقائمة
                    </button>
                    <SupportTicketWizard onComplete={() => navigateTo('track')} />
                </div>
            )}

            {view === 'track' && (
                <div className="max-w-3xl mx-auto px-6 py-10 min-h-screen">
                    <button onClick={() => navigateTo('home')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <ArrowRight className="w-4 h-4"/> العودة للقائمة
                    </button>
                    <TicketTracker />
                </div>
            )}

            {view === 'kb' && (
                <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
                    <button onClick={() => navigateTo('home')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                        <ArrowRight className="w-4 h-4"/> العودة للقائمة
                    </button>
                    <KnowledgeBaseSEO fullMode={true} />
                </div>
            )}

            {/* GLOBAL OFFICIAL FOOTER */}
            <div className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> Murad Care</h4>
                        <p className="text-xs leading-relaxed text-slate-400">
                            النظام المركزي الموحد لإدارة البلاغات والدعم الفني. يعمل وفق معايير الجودة العالمية ISO لضمان أفضل تجربة للمستفيدين.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">روابط سريعة</h4>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => navigateTo('ticket')} className="hover:text-white transition-colors">فتح تذكرة جديدة</button></li>
                            <li><button onClick={() => navigateTo('track')} className="hover:text-white transition-colors">متابعة حالة الطلب</button></li>
                            <li><button onClick={() => navigateTo('kb')} className="hover:text-white transition-colors">قاعدة المعرفة</button></li>
                            <li><a href="/policy" className="hover:text-white transition-colors">اتفاقية مستوى الخدمة (SLA)</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">تواصل معنا</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> support@murad-group.com</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> الرقم الموحد: 199099 (محاكاة)</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> الرياض، المملكة العربية السعودية</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">الاعتمادات</h4>
                        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="bg-white/10 p-2 rounded"><ShieldCheck className="w-8 h-8 text-emerald-500"/></div>
                            <div className="bg-white/10 p-2 rounded"><Database className="w-8 h-8 text-blue-500"/></div>
                            <div className="bg-white/10 p-2 rounded"><LifeBuoy className="w-8 h-8 text-amber-500"/></div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-slate-800 text-center">
                    <p className="text-sm text-slate-300 font-bold mb-2">
                        © 2025 شركة مراد الجهني لتقنية المعلومات. جميع الحقوق محفوظة.
                    </p>
                    <p className="text-xs text-slate-500">
                        إحدى شركات <span className="text-slate-300 font-bold">شركة مراد الجهني لتقنية المعلومات العالمية</span> | System ID: .im-murad7
                    </p>
                </div>
            </div>
        </div>
    );
};

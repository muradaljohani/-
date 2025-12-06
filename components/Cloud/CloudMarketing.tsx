
import React, { useState } from 'react';
import { 
    Clock, Zap, Shield, CheckCircle2, ArrowLeft, 
    Cpu, Activity, Smartphone, Globe, Menu, X, 
    PlayCircle, MessageSquare, Fingerprint, BarChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEOHelmet } from '../SEOHelmet';

interface Props {
    onNavigate: (path: string) => void;
}

export const CloudMarketing: React.FC<Props> = ({ onNavigate }) => {
    const { setShowLoginModal } = useAuth();
    const [mobileMenu, setMobileMenu] = useState(false);
    
    // Smooth Scroll Handler
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenu(false);
    };

    const triggerBot = () => {
        // Trigger the global MilafBot
        window.dispatchEvent(new CustomEvent('open-milaf-chat', { detail: { query: 'مرحباً، حدثني عن نظام مراد كلوك' } }));
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 dir-rtl" dir="rtl">
            <SEOHelmet 
                title="نظام مراد كلوك | Murad Clock System" 
                description="النظام الذكي لإدارة الوقت والمهام بدقة متناهية. الحل التقني الأمثل للأفراد والشركات." 
                path="/clock-system"
            />

            {/* 1. NAVBAR - SaaS Style */}
            <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
                        <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-300">
                            <Clock className="w-7 h-7 text-amber-400 animate-pulse"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">Murad<span className="text-amber-500">Clock</span></span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Smart Time OS</span>
                        </div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-base font-medium text-slate-600">
                        <button onClick={() => scrollTo('features')} className="hover:text-[#2563eb] transition-colors">المميزات</button>
                        <button onClick={() => scrollTo('solutions')} className="hover:text-[#2563eb] transition-colors">الحلول</button>
                        <button onClick={() => scrollTo('tips')} className="hover:text-[#2563eb] transition-colors">نصائح</button>
                        <button onClick={triggerBot} className="hover:text-[#2563eb] transition-colors flex items-center gap-2">
                            <MessageSquare className="w-4 h-4"/> اسأل كلوك
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button onClick={() => setShowLoginModal(true)} className="px-6 py-3 text-slate-600 hover:text-[#2563eb] font-bold transition-colors">
                            دخول
                        </button>
                        <button onClick={() => onNavigate('dopamine')} className="px-8 py-3 bg-[#2563eb] text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 transform hover:-translate-y-1">
                            تجربة النظام <ArrowLeft className="w-4 h-4 rtl:rotate-180"/>
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-slate-600">
                        {mobileMenu ? <X className="w-8 h-8"/> : <Menu className="w-8 h-8"/>}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenu && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-2xl absolute w-full z-50">
                        <button onClick={() => scrollTo('features')} className="text-right font-bold text-lg text-slate-600">المميزات</button>
                        <button onClick={() => scrollTo('solutions')} className="text-right font-bold text-lg text-slate-600">الحلول</button>
                        <button onClick={triggerBot} className="text-right font-bold text-lg text-[#2563eb]">المساعد الذكي</button>
                        <hr className="border-slate-100"/>
                        <button onClick={() => onNavigate('dopamine')} className="w-full py-4 bg-[#0f172a] text-white rounded-xl font-bold text-lg shadow-xl">ابدأ الآن</button>
                    </div>
                )}
            </nav>

            {/* 2. HERO SECTION */}
            <header className="relative pt-24 pb-40 overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03]"></div>
                
                {/* Abstract Blobs */}
                <div className="absolute top-20 -right-20 w-[600px] h-[600px] bg-amber-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-pulse"></div>
                <div className="absolute bottom-0 -left-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        نظام إدارة الوقت الأكثر تطوراً في الشرق الأوسط
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                        تحكم في <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-cyan-500">وقتك</span>،<br/>
                        تتحكم في <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">مستقبلك</span>.
                    </h1>
                    
                    <p className="text-2xl text-slate-500 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                        نظام مراد كلوك ليس مجرد أداة لتتبع الوقت، بل هو نظام تشغيل ذكي يدير حياتك المهنية والشخصية بدقة النانو ثانية.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button onClick={() => onNavigate('dopamine')} className="w-full sm:w-auto px-10 py-5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-slate-400/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                            اشترك في النظام <Zap className="w-5 h-5 fill-amber-400 text-amber-400"/>
                        </button>
                        <button onClick={triggerBot} className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 hover:border-blue-200 hover:bg-blue-50 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3">
                            <PlayCircle className="w-6 h-6 text-blue-600"/> تجربة البوت
                        </button>
                    </div>

                    <div className="mt-16 relative mx-auto max-w-5xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-20 bottom-0"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
                            className="w-full rounded-[2rem] shadow-2xl border-8 border-slate-900/5"
                            alt="Murad Clock Interface"
                        />
                        {/* Floating Cards */}
                        <div className="hidden md:flex absolute -right-12 top-1/3 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 items-center gap-4 animate-bounce-slow">
                            <div className="bg-emerald-100 p-3 rounded-xl"><CheckCircle2 className="w-8 h-8 text-emerald-600"/></div>
                            <div>
                                <div className="font-bold text-slate-900">تم إنجاز المهمة</div>
                                <div className="text-xs text-slate-500">قبل الموعد بـ 15 دقيقة</div>
                            </div>
                        </div>
                        <div className="hidden md:flex absolute -left-12 bottom-1/4 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 items-center gap-4 animate-pulse-slow">
                            <div className="bg-blue-100 p-3 rounded-xl"><Activity className="w-8 h-8 text-blue-600"/></div>
                            <div>
                                <div className="font-bold text-slate-900">الكفاءة الحالية</div>
                                <div className="text-xs text-slate-500">94% أداء ممتاز</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. FEATURES GRID */}
            <section id="features" className="py-32 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-6">لماذا مراد كلوك؟</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            مميزات حصرية تجعلنا الخيار الأول للشركات ورواد الأعمال في المملكة.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Cpu className="w-10 h-10 text-blue-600"/>,
                                title: "الجدولة الذكية (AI)",
                                desc: "خوارزميات ذكية تقوم بترتيب يومك تلقائياً بناءً على أولوياتك ومستويات طاقتك."
                            },
                            {
                                icon: <Shield className="w-10 h-10 text-emerald-600"/>,
                                title: "حماية البيانات",
                                desc: "تشفير عسكري لبياناتك الشخصية والمهنية. خصوصيتك هي أولويتنا القصوى."
                            },
                            {
                                icon: <Globe className="w-10 h-10 text-purple-600"/>,
                                title: "تزامن عالمي",
                                desc: "الوصول لجدولك ومهامك من أي مكان في العالم، وعلى أي جهاز وفي أي وقت."
                            },
                            {
                                icon: <Smartphone className="w-10 h-10 text-amber-600"/>,
                                title: "تطبيق متكامل",
                                desc: "تطبيق جوال فائق السرعة يبقيك على اطلاع دائم بمهامك وإشعاراتك."
                            },
                            {
                                icon: <BarChart className="w-10 h-10 text-red-600"/>,
                                title: "تحليلات الأداء",
                                desc: "تقارير أسبوعية تفصيلية تخبرك أين ذهب وقتك وكيف تزيد من إنتاجيتك."
                            },
                            {
                                icon: <Fingerprint className="w-10 h-10 text-cyan-600"/>,
                                title: "تسجيل الحضور",
                                desc: "نظام بصمة رقمي ذكي للشركات لتسجيل حضور وانصراف الموظفين بدقة."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-10 hover:shadow-2xl transition-all duration-300 border border-slate-100 group hover:-translate-y-2">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-lg">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. TIPS SECTION */}
            <section id="tips" className="py-32 bg-[#0f172a] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-bold mb-8">
                                <Clock className="w-4 h-4"/> نصائح ذهبية
                            </div>
                            <h2 className="text-5xl font-black mb-10 leading-tight">كيف تضاعف إنتاجيتك مع مراد كلوك؟</h2>
                            
                            <div className="space-y-10">
                                <div className="flex gap-8">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50 font-black text-2xl">1</div>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-2">قاعدة الدقيقتين</h4>
                                        <p className="text-slate-400 text-lg leading-relaxed">إذا كانت المهمة تستغرق أقل من دقيقتين، قم بها فوراً. نظامنا يذكرك بهذه المهام الصغيرة تلقائياً.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/50 font-black text-2xl">2</div>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-2">تقنية بومودورو المدمجة</h4>
                                        <p className="text-slate-400 text-lg leading-relaxed">استخدم مؤقت التركيز المدمج: 25 دقيقة عمل، 5 دقائق راحة. ستذهلك النتائج.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/50 font-black text-2xl">3</div>
                                    <div>
                                        <h4 className="text-2xl font-bold mb-2">تصفية الذهن</h4>
                                        <p className="text-slate-400 text-lg leading-relaxed">سجل أي فكرة تخطر ببالك فوراً في "صندوق الوارد" داخل النظام، ولا تشغل عقلك بحفظها.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 relative shadow-2xl">
                                <h3 className="text-3xl font-bold mb-8 text-center">أرقام تتحدث</h3>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="bg-[#0b1120] p-8 rounded-3xl text-center border border-white/5">
                                        <div className="text-5xl font-black text-emerald-400 mb-2">+40%</div>
                                        <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">زيادة في الإنتاجية</div>
                                    </div>
                                    <div className="bg-[#0b1120] p-8 rounded-3xl text-center border border-white/5">
                                        <div className="text-5xl font-black text-blue-400 mb-2">-2h</div>
                                        <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">توفير يومي</div>
                                    </div>
                                    <div className="bg-[#0b1120] p-8 rounded-3xl text-center border border-white/5">
                                        <div className="text-5xl font-black text-amber-400 mb-2">5M+</div>
                                        <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">مهمة منجزة</div>
                                    </div>
                                    <div className="bg-[#0b1120] p-8 rounded-3xl text-center border border-white/5">
                                        <div className="text-5xl font-black text-purple-400 mb-2">4.9/5</div>
                                        <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">تقييم المستخدمين</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-32 bg-gradient-to-b from-slate-50 to-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">هل أنت جاهز للسيطرة على وقتك؟</h2>
                    <p className="text-xl text-slate-500 mb-12">انضم إلى النخبة الذين اختاروا مراد كلوك لتنظيم حياتهم وأعمالهم.</p>
                    <button onClick={() => onNavigate('dopamine')} className="px-12 py-6 bg-[#2563eb] text-white text-2xl font-bold rounded-2xl hover:bg-blue-700 shadow-2xl hover:shadow-blue-600/40 transition-all transform hover:scale-105">
                        ابدأ رحلة النجاح الآن
                    </button>
                    <p className="mt-6 text-sm text-slate-400 font-bold">تجربة مجانية لمدة 14 يوم • لا يلزم بطاقة ائتمان</p>
                </div>
            </section>

            {/* 6. CUSTOM FOOTER */}
            <footer className="bg-[#0f172a] border-t border-slate-800 pt-20 pb-10 text-white font-sans">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0f172a]">
                                    <Clock className="w-6 h-6 fill-current"/>
                                </div>
                                <span className="text-2xl font-bold">مراد كلوك</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-sm text-lg">
                                النظام الأول عربياً في إدارة الوقت والإنتاجية. صُمم بأحدث التقنيات لخدمة الطموحين والقادة.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">روابط سريعة</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><button onClick={() => onNavigate('jobs')} className="hover:text-[#2563eb] transition-colors">وظائف</button></li>
                                <li><button onClick={() => onNavigate('academy')} className="hover:text-[#2563eb] transition-colors">أكاديمية</button></li>
                                <li><button onClick={() => onNavigate('market')} className="hover:text-[#2563eb] transition-colors">سوق</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">تواصل معنا</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li>support@murad-group.com</li>
                                <li>الرياض، المملكة العربية السعودية</li>
                                <li>92000XXXX</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-10 text-center">
                        <p className="text-slate-500 font-bold text-sm mb-2">
                            جميع الحقوق محفوظة لشركة مراد الجهني لتقنية المعلومات العالمية © {new Date().getFullYear()}
                        </p>
                        <p className="text-slate-600 text-xs font-mono">
                            Murad Aljohani Global Information Technology Company
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

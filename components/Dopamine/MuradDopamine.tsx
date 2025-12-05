import React, { useState, useEffect } from 'react';
import { 
    Zap, Globe, Layout, Monitor, Smartphone, ShoppingCart, 
    CheckCircle2, ArrowRight, Search, Loader2, CreditCard, 
    Settings, BarChart3, Image as ImageIcon, Type, Menu, X,
    Cpu, ShieldCheck, Rocket, Eye
} from 'lucide-react';
import { SEOHelmet } from '../SEOHelmet';
import { Footer } from '../Footer';

interface Props {
    onExit: () => void;
}

export const MuradDopamine: React.FC<Props> = ({ onExit }) => {
    const [view, setView] = useState<'landing' | 'builder' | 'dashboard'>('landing');
    const [domainQuery, setDomainQuery] = useState('');
    const [isSearchingDomain, setIsSearchingDomain] = useState(false);
    const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
    
    // Builder State
    const [buildStep, setBuildStep] = useState(1);
    const [siteConfig, setSiteConfig] = useState({
        name: '',
        type: 'store',
        theme: 'modern'
    });
    const [isBuilding, setIsBuilding] = useState(false);

    // --- DEEP LINKING HANDLER ---
    useEffect(() => {
        const handlePath = () => {
            const path = window.location.pathname;
            if (path.includes('/dopamine/builder')) setView('builder');
            else if (path.includes('/dopamine/dashboard')) setView('dashboard');
            else setView('landing');
        };
        
        handlePath();
        window.addEventListener('popstate', handlePath);
        return () => window.removeEventListener('popstate', handlePath);
    }, []);

    const navigateTo = (subPath: string) => {
        const fullPath = subPath === 'landing' ? '/dopamine' : `/dopamine/${subPath}`;
        window.history.pushState({}, '', fullPath);
        const event = new PopStateEvent('popstate');
        window.dispatchEvent(event);
    };

    // --- LANDING PAGE COMPONENTS ---

    const handleDomainSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainQuery) return;
        setIsSearchingDomain(true);
        setDomainAvailable(null);
        
        // Simulate API Check
        setTimeout(() => {
            setIsSearchingDomain(false);
            setDomainAvailable(true); // Always available for demo
        }, 1500);
    };

    const startBuilding = () => {
        navigateTo('builder');
        setBuildStep(1);
    };

    const SiteBuilder = () => {
        const handleFinalBuild = () => {
            setIsBuilding(true);
            setTimeout(() => {
                setIsBuilding(false);
                navigateTo('dashboard');
            }, 3000); // 3s build simulation
        };

        return (
            <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col font-sans text-white" dir="rtl">
                <SEOHelmet title="منشئ المواقع الذكي | مراد دوبامين" description="ابني موقعك في دقائق باستخدام الذكاء الاصطناعي." path="/dopamine/builder" />
                
                {/* Builder Header */}
                <div className="h-16 border-b border-white/10 flex justify-between items-center px-6 bg-[#1e293b]">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-purple-500 fill-purple-500"/>
                        <span className="font-bold text-lg">منشئ المواقع الذكي</span>
                    </div>
                    <button onClick={() => navigateTo('landing')} className="p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5"/></button>
                </div>

                {/* Builder Content */}
                <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    
                    {isBuilding ? (
                        <div className="text-center z-10">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                                <Zap className="absolute inset-0 m-auto w-12 h-12 text-purple-400 animate-pulse"/>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">جاري بناء موقعك...</h2>
                            <p className="text-gray-400 text-sm animate-pulse">تهيئة السيرفرات • تثبيت القالب • تفعيل SSL</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 animate-fade-in-up">
                            {/* Step Indicator */}
                            <div className="flex justify-between mb-8 relative">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -z-10 rounded-full"></div>
                                <div className="absolute top-1/2 right-0 h-1 bg-purple-600 -z-10 rounded-full transition-all duration-500" style={{width: `${(buildStep/3)*100}%`}}></div>
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all ${buildStep >= s ? 'bg-purple-600 border-purple-800 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            {/* Step 1: Name */}
                            {buildStep === 1 && (
                                <div className="space-y-6 text-center">
                                    <h2 className="text-2xl font-bold">ما هو اسم موقعك الجديد؟</h2>
                                    <input 
                                        type="text" 
                                        value={siteConfig.name}
                                        onChange={(e) => setSiteConfig({...siteConfig, name: e.target.value})}
                                        placeholder="مثال: متجر الأناقة" 
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-center text-xl text-white focus:border-purple-500 outline-none"
                                    />
                                    <button onClick={() => siteConfig.name && setBuildStep(2)} className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transition-all">
                                        التالي
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Type */}
                            {buildStep === 2 && (
                                <div className="space-y-6 text-center">
                                    <h2 className="text-2xl font-bold">ما هو نوع الموقع؟</h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            {id: 'store', label: 'متجر إلكتروني', icon: <ShoppingCart/>},
                                            {id: 'blog', label: 'مدونة شخصية', icon: <Type/>},
                                            {id: 'portfolio', label: 'معرض أعمال', icon: <ImageIcon/>}
                                        ].map(type => (
                                            <button 
                                                key={type.id}
                                                onClick={() => setSiteConfig({...siteConfig, type: type.id})}
                                                className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${siteConfig.type === type.id ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                            >
                                                {type.icon}
                                                <span className="font-bold text-sm">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setBuildStep(1)} className="px-6 py-4 bg-white/5 rounded-xl font-bold">رجوع</button>
                                        <button onClick={() => setBuildStep(3)} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg shadow-lg transition-all">التالي</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Theme */}
                            {buildStep === 3 && (
                                <div className="space-y-6 text-center">
                                    <h2 className="text-2xl font-bold">اختر التصميم المناسب</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {id: 'modern', label: 'عصري (Modern)', color: 'from-blue-500 to-purple-600'},
                                            {id: 'classic', label: 'كلاسيكي (Classic)', color: 'from-slate-700 to-slate-900'},
                                            {id: 'vibrant', label: 'حيوي (Vibrant)', color: 'from-orange-400 to-red-500'},
                                            {id: 'dark', label: 'ليلي (Dark)', color: 'from-gray-800 to-black'}
                                        ].map(theme => (
                                            <button 
                                                key={theme.id}
                                                onClick={() => setSiteConfig({...siteConfig, theme: theme.id})}
                                                className={`relative h-32 rounded-xl overflow-hidden border-2 transition-all group ${siteConfig.theme === theme.id ? 'border-purple-500 scale-105 shadow-xl' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${theme.color}`}></div>
                                                <span className="absolute bottom-3 right-3 font-bold text-white drop-shadow-md">{theme.label}</span>
                                                {siteConfig.theme === theme.id && <div className="absolute top-2 right-2 bg-white text-purple-600 rounded-full p-1"><CheckCircle2 className="w-4 h-4"/></div>}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={handleFinalBuild} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all animate-pulse">
                                        <Rocket className="w-5 h-5"/> إطلاق الموقع الآن
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const Dashboard = () => (
        <div className="min-h-screen bg-[#f1f5f9] font-sans flex flex-col" dir="rtl">
            <SEOHelmet title={`لوحة تحكم ${siteConfig.name}`} description="إدارة موقعك بسهولة مع مراد دوبامين" path="/dopamine/dashboard" />
            
            {/* Dashboard Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {siteConfig.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800">{siteConfig.name}</h1>
                        <a href="#" className="text-xs text-blue-600 hover:underline">{domainQuery || 'mysite'}.murad-dopamine.com</a>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200">
                        <Eye className="w-4 h-4"/> معاينة
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-500 shadow-lg shadow-purple-200">
                        <Settings className="w-4 h-4"/> لوحة التحكم
                    </button>
                    <button onClick={() => navigateTo('landing')} className="p-2 text-slate-400 hover:text-red-500"><X className="w-5 h-5"/></button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-500"/> إحصائيات سريعة
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">الزيارات اليوم</span>
                                <span className="font-bold text-slate-900">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">المبيعات</span>
                                <span className="font-bold text-slate-900">0 ر.س</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4"/> الدومين فعال (SSL Active)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">الخطة المجانية</h3>
                            <p className="text-purple-100 text-sm mb-4">أنت تستخدم النسخة التجريبية. قم بالترقية للحصول على دومين خاص (.com) ومساحة غير محدودة.</p>
                            <button className="w-full py-2 bg-white text-purple-700 font-bold rounded-lg text-sm hover:bg-purple-50">
                                ترقية الآن
                            </button>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-white opacity-10">
                            <Zap className="w-32 h-32"/>
                        </div>
                    </div>
                </div>

                {/* Main Content Area (Fake Editor) */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/web-development-2974925-2477356.png" className="w-64 mb-6 opacity-80" alt="Builder"/>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">موقعك جاهز للإطلاق!</h2>
                    <p className="text-slate-500 max-w-md mb-8">تم إعداد الهيكل الأساسي لموقعك. يمكنك الآن البدء في تخصيص المحتوى، إضافة المنتجات، وتعديل التصميم.</p>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                            دليل الاستخدام
                        </button>
                        <button className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 shadow-lg shadow-purple-200 transition-colors flex items-center gap-2">
                            <Layout className="w-4 h-4"/> فتح المحرر المرئي
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Internal Footer */}
            <div className="mt-auto border-t border-slate-200 bg-white w-full">
                <div className="max-w-7xl mx-auto">
                    <Footer compact />
                </div>
            </div>
        </div>
    );

    // --- MAIN VIEW RENDERER ---
    if (view === 'builder') return <SiteBuilder />;
    if (view === 'dashboard') return <Dashboard />;

    return (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto font-sans text-right" dir="rtl">
            <SEOHelmet title="مراد دوبامين | ابني موقعك مجاناً" description="منصة بناء المواقع والمتاجر الإلكترونية العربية الأولى." path="/dopamine" />
            
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('landing')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                            <Zap className="w-6 h-6 fill-current"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Murad <span className="text-purple-600">Dopamine</span></h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
                        <a href="#" className="hover:text-purple-600 transition-colors">القوالب</a>
                        <a href="#" className="hover:text-purple-600 transition-colors">الأسعار</a>
                        <a href="#" className="hover:text-purple-600 transition-colors">المميزات</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={onExit} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm">
                            خروج
                        </button>
                        <button onClick={startBuilding} className="px-6 py-2.5 bg-[#0f172a] text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all text-sm flex items-center gap-2">
                            ابنِ موقعك مجاناً <ArrowRight className="w-4 h-4 rtl:rotate-180"/>
                        </button>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-20 pb-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-100 rounded-full blur-[120px] -z-10 opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-pink-100 rounded-full blur-[120px] -z-10 opacity-40"></div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-bold mb-8 border border-purple-100">
                        <SparklesIcon className="w-4 h-4"/> الجيل الجديد من بناء المواقع
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
                        ابنِ موقع أحلامك في <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">دقائق معدودة</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        لا تحتاج لخبرة برمجية. اختر قالباً، خصصه بسهولة، وانطلق في عالم الإنترنت مع استضافة سريعة ودومين مجاني.
                    </p>

                    {/* Domain Search */}
                    <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 relative z-20">
                        <div className="flex-1 relative">
                            <Globe className="absolute right-4 top-4 text-slate-400 w-5 h-5"/>
                            <input 
                                type="text" 
                                placeholder="ابحث عن اسم دومين مميز..." 
                                value={domainQuery}
                                onChange={(e) => setDomainQuery(e.target.value)}
                                className="w-full h-14 pr-12 pl-4 rounded-xl bg-slate-50 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>
                        <button 
                            onClick={handleDomainSearch}
                            className="h-14 px-8 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {isSearchingDomain ? <Loader2 className="w-5 h-5 animate-spin"/> : 'بحث'}
                        </button>
                    </div>

                    {domainAvailable === true && (
                        <div className="mt-4 animate-fade-in-up inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-bold border border-emerald-100 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 fill-current"/>
                            مبروك! الدومين {domainQuery}.murad.site متاح.
                            <button onClick={startBuilding} className="underline hover:text-emerald-900 mr-2">احجزه الآن</button>
                        </div>
                    )}
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-20 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard 
                            icon={<Monitor className="w-8 h-8 text-blue-500"/>}
                            title="تصميم متجاوب"
                            desc="موقعك سيبدو مذهلاً على جميع الأجهزة، من الهواتف الذكية إلى الشاشات الكبيرة."
                        />
                        <FeatureCard 
                            icon={<ShoppingCart className="w-8 h-8 text-purple-500"/>}
                            title="متجر متكامل"
                            desc="أدوات تجارة إلكترونية قوية، بوابات دفع، وإدارة مخزون مدمجة بالكامل."
                        />
                        <FeatureCard 
                            icon={<Rocket className="w-8 h-8 text-pink-500"/>}
                            title="سيو (SEO) متقدم"
                            desc="أدوات تحسين محركات البحث مدمجة لتضمن ظهور موقعك في النتائج الأولى."
                        />
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">خطط أسعار تناسب الجميع</h2>
                        <p className="text-slate-500">ابدأ مجاناً، وقم بالترقية عندما ينمو عملك</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard 
                            title="مجانية" 
                            price="0" 
                            features={['دومين فرعي مجاني', '5 صفحات', 'دعم فني عبر البريد', 'إعلانات دوبامين']}
                        />
                        <PricingCard 
                            title="احترافية" 
                            price="49" 
                            isPopular 
                            features={['دومين خاص مجاني', 'صفحات غير محدودة', 'متجر إلكتروني (50 منتج)', 'إزالة الإعلانات', 'دعم فني مباشر']}
                        />
                        <PricingCard 
                            title="أعمال" 
                            price="99" 
                            features={['كل مميزات الاحترافية', 'منتجات غير محدودة', 'تقارير متقدمة', 'أولوية الدعم VIP', 'ربط بوابات دفع خاصة']}
                        />
                    </div>
                </div>
            </section>

            {/* CTA FOOTER */}
            <section className="py-20 bg-[#0f172a] text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-black mb-6">جاهز لإطلاق مشروعك؟</h2>
                    <p className="text-slate-400 mb-10 text-lg">انضم لأكثر من 50,000 مبدع وريادي اختاروا مراد دوبامين لبناء تواجدهم الرقمي.</p>
                    <button onClick={startBuilding} className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-bold text-xl shadow-2xl shadow-purple-900/50 transition-all transform hover:scale-105">
                        ابدأ تجربتك المجانية الآن
                    </button>
                    <p className="mt-6 text-xs text-slate-500">لا يلزم وجود بطاقة ائتمان • إلغاء في أي وقت</p>
                </div>
            </section>

            {/* Footer Integration */}
            <Footer />
        </div>
    );
};

// --- SUB COMPONENTS ---

const FeatureCard = ({icon, title, desc}: any) => (
    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const PricingCard = ({title, price, features, isPopular}: any) => (
    <div className={`relative p-8 rounded-3xl border transition-all ${isPopular ? 'bg-white border-purple-500 shadow-2xl scale-105 z-10' : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-lg'}`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                الأكثر مبيعاً
            </div>
        )}
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-slate-900">{price}</span>
            <span className="text-sm text-slate-500 font-bold">ر.س / شهرياً</span>
        </div>
        <ul className="space-y-4 mb-8">
            {features.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className={`w-5 h-5 ${isPopular ? 'text-purple-600' : 'text-slate-400'}`}/> {feat}
                </li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-xl font-bold transition-all ${isPopular ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
            اختر {title}
        </button>
    </div>
);

const SparklesIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 5H1"/><path d="M19 21v-4"/><path d="M15 19h8"/></svg>
);
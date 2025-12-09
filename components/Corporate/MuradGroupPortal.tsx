
import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Globe, Users, Briefcase, Building2, Code, Zap, 
    ChevronLeft, Target, Award, ArrowRight, Mail, Phone, MapPin, 
    X, CheckCircle2, FileText, Send, Linkedin, Twitter, Instagram, 
    BarChart3, PieChart, Server, Shield, Cpu, Landmark, Newspaper,
    ChevronDown, Search, Menu, Loader2, Download, Calendar, TrendingUp, UserCheck, Eye, Clock, Share2, LayoutGrid
} from 'lucide-react';
import { SEOHelmet } from '../SEOHelmet';
import { Footer } from '../Footer';

// --- ICONS ---
const LogoIcon = () => (
    <div className="w-10 h-10 bg-[#2563eb] text-white rounded flex items-center justify-center font-black text-xl shadow-sm">
        M
    </div>
);

interface Props {
    onNavigate: (path: string) => void;
}

const BLOG_POSTS = [
    {
        id: 'digital-economy-2030',
        title: 'الاقتصاد الرقمي في المملكة: قراءة في مستقبل رؤية 2030',
        category: 'اقتصاد رقمي',
        date: '2025-01-20',
        author: 'م. مراد الجهني',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
        excerpt: 'كيف تساهم البرمجيات الوطنية في تعزيز الناتج المحلي غير النفطي؟ نظرة تحليلية لفرص النمو.',
        content: `
            <h3 class="text-2xl font-bold text-slate-900 mb-4">مقدمة</h3>
            <p class="mb-6">لم يعد التحول الرقمي خياراً للرفاهية، بل أصبح المحرك الأساسي للاقتصادات الحديثة. في المملكة العربية السعودية، وتحديداً ضمن رؤية 2030، نرى توجهاً هائلاً نحو رقمنة الخدمات الحكومية، والقطاع المالي، والتعليم.</p>
            
            <h3 class="text-2xl font-bold text-slate-900 mb-4">دور الشركات الوطنية</h3>
            <p class="mb-6">في "شركة مراد الجهني لتقنية المعلومات العالمية"، نؤمن بأن الاعتماد على الحلول المستوردة لن يبني اقتصاداً مستداماً. الحل يكمن في بناء "مصانع برمجيات" محلية، وكوادر وطنية قادرة على ابتكار حلول تناسب بيئتنا وثقافتنا.</p>
            
            <h3 class="text-2xl font-bold text-slate-900 mb-4">الفرص القادمة</h3>
            <p class="mb-6">قطاعات مثل التقنية المالية (FinTech)، والتعليم الإلكتروني (EdTech)، والخدمات اللوجستية الذكية، تشهد نمواً متسارعاً. نحن نوفر البنية التحتية لهذه القطاعات من خلال حلولنا السحابية ومنصاتنا المتكاملة.</p>
        `
    },
    {
        id: 'remote-work-culture',
        title: 'بناء ثقافة العمل عن بعد: كيف تدير فرقاً تقنية موزعة؟',
        category: 'ريادة أعمال',
        date: '2025-01-15',
        author: 'فريق التحرير',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
        excerpt: 'الدروس المستفادة من إدارة آلاف المستقلين والموظفين عبر منصاتنا الرقمية.',
        content: `
            <p class="mb-6">العمل عن بعد ليس مجرد "عمل من المنزل"، بل هو ثقافة تعتمد على النتائج لا على عدد ساعات الحضور. في منصة "ميلاف"، قمنا بتمكين آلاف الشباب السعودي من العمل مع شركات عالمية ومحلية دون مغادرة مدنهم.</p>
            <h3 class="text-2xl font-bold text-slate-900 mb-4">الأدوات والتقنيات</h3>
            <p class="mb-6">النجاح في العمل عن بعد يتطلب أدوات إدارة مهام فعالة، وتواصلاً غير متزامن (Asynchronous Communication)، وثقة متبادلة بين الإدارة والموظف.</p>
        `
    },
    {
        id: 'ai-future-education',
        title: 'هل يستبدل الذكاء الاصطناعي المعلم؟ مستقبل التعليم التقني',
        category: 'تعليم',
        date: '2025-01-10',
        author: 'م. مراد الجهني',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000',
        excerpt: 'تحليل لدور تقنيات AI في تخصيص مسارات التعلم وتطوير المناهج الدراسية.',
        content: `
            <p class="mb-6">الذكاء الاصطناعي لن يستبدل المعلم، لكن المعلم الذي يستخدم الذكاء الاصطناعي سيستبدل ذلك الذي لا يستخدمه. في أكاديمية ميلاف، نستخدم خوارزميات التعلم الآلي لتحليل أداء الطلاب وتقديم محتوى مخصص لكل فرد.</p>
            <h3 class="text-2xl font-bold text-slate-900 mb-4">التعليم المخصص (Personalized Learning)</h3>
            <p class="mb-6">بدلاً من منهج واحد للجميع، يمكن للأنظمة الذكية اكتشاف نقاط ضعف الطالب وتقديم تدريبات علاجية فورية، مما يسرع عملية التعلم ويحقق نتائج أفضل.</p>
        `
    },
    {
        id: 'cloud-sovereignty',
        title: 'السيادة الرقمية: لماذا نحتاج إلى سحابة وطنية؟',
        category: 'تقنية',
        date: '2025-01-05',
        author: 'قسم البنية التحتية',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
        excerpt: 'أهمية توطين البيانات وحمايتها داخل الحدود الجغرافية للمملكة.',
        content: `
            <p class="mb-6">البيانات هي نفط العصر الجديد. وحماية هذه البيانات تتطلب بنية تحتية سحابية وطنية قوية ومستقلة. نعمل في شركة مراد الجهني على تقديم حلول استضافة متوافقة تماماً مع تشريعات الأمن السيبراني السعودية.</p>
        `
    }
];

const PRODUCTS = [
    {
        id: 'academy',
        name: 'أكاديمية ميلاف',
        desc: 'منصة التعليم التقني والمهني الأولى، تهدف لتأهيل الكوادر الوطنية بشهادات معتمدة.',
        icon: <Award className="w-6 h-6 text-[#2563eb]"/>,
        link: '/academy'
    },
    {
        id: 'jobs',
        name: 'بوابة التوظيف',
        desc: 'حلقة الوصل بين الكفاءات السعودية والجهات الحكومية والخاصة باستخدام الذكاء الاصطناعي.',
        icon: <Briefcase className="w-6 h-6 text-[#2563eb]"/>,
        link: '/jobs'
    },
    {
        id: 'market',
        name: 'سوق الخدمات',
        desc: 'منصة العمل الحر التي تمكن المبدعين من تقديم خدماتهم وبيع منتجاتهم الرقمية.',
        icon: <Globe className="w-6 h-6 text-[#2563eb]"/>,
        link: '/market'
    },
    {
        id: 'solutions',
        name: 'حلول الأعمال',
        desc: 'نقدم للشركات أنظمة ERP، إدارة موارد بشرية، وحلول أتمتة مخصصة.',
        icon: <Building2 className="w-6 h-6 text-[#2563eb]"/>,
        link: '/group/solutions'
    }
];

const NAV_LINKS = [
    { id: 'about', label: 'من نحن', path: '/group/about' },
    { id: 'products', label: 'منتجاتنا', path: '/group/products' },
    { id: 'blog', label: 'المدونة', path: '/group/blog' },
    { id: 'contact', label: 'اتصل بنا', path: '/group/contact' },
];

export const MuradGroupPortal: React.FC<Props> = ({ onNavigate }) => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleLocationChange = () => {
            setCurrentPath(window.location.pathname);
            window.scrollTo(0, 0);
            if (!window.location.pathname.includes('/blog/')) {
                setSelectedPost(null);
            }
        };
        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const navigateTo = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setMobileMenuOpen(false);
    };

    const openPost = (post: any) => {
        setSelectedPost(post.id);
        navigateTo(`/group/blog/${post.id}`);
    };

    // --- RENDERERS ---
    
    const Header = () => (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/group')}>
                    <LogoIcon />
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold text-slate-900 leading-none">شركة مراد الجهني</h1>
                        <span className="text-xs text-slate-500">لتقنية المعلومات العالمية</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(link => (
                        <button 
                            key={link.id} 
                            onClick={() => navigateTo(link.path)}
                            className={`text-sm font-medium transition-colors ${currentPath.includes(link.path) ? 'text-[#2563eb] font-bold' : 'text-slate-600 hover:text-[#2563eb]'}`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => onNavigate('landing')} className="hidden md:flex px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">
                        دخول المنصة
                    </button>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600">
                        {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 p-4 shadow-xl flex flex-col gap-2">
                    {NAV_LINKS.map(link => (
                        <button 
                            key={link.id} 
                            onClick={() => navigateTo(link.path)}
                            className="text-right px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                        >
                            {link.label}
                        </button>
                    ))}
                     <button onClick={() => onNavigate('landing')} className="text-right px-4 py-3 bg-slate-900 text-white rounded-lg font-bold mt-2">
                        دخول المنصة
                    </button>
                </div>
            )}
        </header>
    );

    const HeroSection = () => (
        <div className="relative bg-white py-20 md:py-32 px-6 overflow-hidden">
            {/* Ambient Background Elements for Glass Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -z-10 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] -z-10 opacity-40"></div>
            
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up relative z-10">
                
                {/* GLASSY COMPANY BADGE */}
                <div className="inline-flex items-center justify-center gap-3 px-6 py-2.5 mb-8 rounded-full bg-white/60 border border-slate-200/60 shadow-lg shadow-blue-900/5 backdrop-blur-md hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <span className="text-slate-800 font-bold text-sm tracking-wide">شركة مراد الجهني لتقنية المعلومات</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                    نطور الويب العربي، <br/>
                    <span className="text-[#2563eb]">لنبني المستقبل.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                    شركة مراد الجهني لتقنية المعلومات العالمية. نبتكر حلولاً تقنية متكاملة لتمكين الشباب، تطوير الأعمال، وتعزيز المحتوى العربي على الإنترنت.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => navigateTo('/group/products')} className="px-8 py-4 bg-[#2563eb] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-200">
                        اكتشف منتجاتنا
                    </button>
                    <button onClick={() => navigateTo('/group/about')} className="px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-colors text-lg">
                        تعرف علينا
                    </button>
                </div>
            </div>
        </div>
    );

    const ProductsSection = () => (
        <div className="bg-slate-50 py-24 px-6 border-t border-slate-200">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">منظومة الحلول</h2>
                    <p className="text-slate-500">مجموعة متكاملة من المنصات الرقمية التي تخدم الأفراد والشركات.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PRODUCTS.map(prod => (
                        <div key={prod.id} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group cursor-pointer" onClick={() => onNavigate(prod.link)}>
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                                    {prod.icon}
                                </div>
                                <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-[#2563eb] transition-colors rtl:rotate-180"/>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{prod.name}</h3>
                            <p className="text-slate-600 leading-relaxed">{prod.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const BlogSection = () => (
        <div className="bg-white py-24 px-6">
            <SEOHelmet title="المدونة التقنية | شركة مراد الجهني" description="مقالات وأخبار حول التقنية وريادة الأعمال." path="/group/blog" />
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">المدونة التقنية</h2>
                        <p className="text-slate-500">أحدث الرؤى والأفكار في عالم التقنية والأعمال.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {BLOG_POSTS.map(post => (
                        <div key={post.id} className="group cursor-pointer" onClick={() => openPost(post)}>
                            <div className="aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
                                <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={post.title}/>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                                    {post.category}
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                                <span>{post.date}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{post.author}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#2563eb] transition-colors leading-snug">
                                {post.title}
                            </h3>
                            <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                {post.excerpt}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const FounderSection = () => (
        <div className="bg-slate-50 py-24 px-6 border-t border-slate-200">
            <SEOHelmet title="عن المؤسس | مراد الجهني" description="نبذة عن المؤسس والرئيس التنفيذي مراد عبدالرزاق عبدالحميد الجهني." path="/group/about" />
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
                    <div className="bg-[#0f172a] p-12 md:w-2/5 text-white flex flex-col justify-center relative overflow-hidden">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                         <div className="relative z-10">
                             <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                 <span className="font-black text-4xl">M</span>
                             </div>
                             <h2 className="text-3xl font-bold mb-2">كلمة المؤسس</h2>
                             <p className="text-slate-400 text-sm mb-8">الرؤية، الرسالة، والمستقبل.</p>
                             <div className="mt-auto pt-8 border-t border-white/10">
                                 <p className="text-lg font-bold text-white">مراد عبدالرزاق عبدالحميد الجهني</p>
                                 <p className="text-sm text-slate-400">المؤسس والرئيس التنفيذي</p>
                                 <p className="text-xs text-blue-400 mt-2 font-mono">im_murad7@hotmail.com</p>
                             </div>
                         </div>
                    </div>
                    <div className="p-12 md:w-3/5 flex items-center">
                        <div className="prose prose-lg text-slate-600 leading-relaxed">
                            <p className="font-serif text-xl text-slate-800 italic mb-6">
                                "نحن لا نبني مجرد مواقع إلكترونية، بل نبني بنية تحتية رقمية تمكن الأجيال القادمة. هدفنا هو أن تكون التقنية العربية منافسة، منتجة، وذات سيادة."
                            </p>
                            <p>
                                تأسست شركتنا على مبدأ أساسي: <strong className="text-slate-900">الجودة أولاً</strong>. سواء في التعليم، التوظيف، أو الحلول البرمجية، نسعى لتقديم تجربة مستخدم تضاهي المنصات العالمية، ولكن بلسان وهوية عربية أصيلة.
                            </p>
                            <p>
                                التزامنا يتجاوز الربح؛ نحن نستثمر في العقول، ونبني الجسور بين الكفاءات والفرص، لنساهم بفعالية في تحقيق رؤية المملكة 2030.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ContactSection = () => (
        <div className="bg-white py-24 px-6">
             <SEOHelmet title="اتصل بنا | شركة مراد الجهني" description="تواصل مع فريقنا لمناقشة مشاريعك." path="/group/contact" />
             <div className="max-w-3xl mx-auto text-center mb-16">
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">تواصل معنا</h2>
                 <p className="text-slate-500">فريقنا جاهز للرد على استفساراتك ومناقشة مشاريعك القادمة.</p>
             </div>
             
             <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-100 hover:border-blue-500 transition-colors">
                     <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4"/>
                     <h3 className="font-bold text-slate-900 mb-2">البريد الإلكتروني</h3>
                     <p className="text-slate-500 text-sm">im_murad7@hotmail.com</p>
                     <p className="text-slate-400 text-xs mt-1">للردود الرسمية والشراكات</p>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-100 hover:border-blue-500 transition-colors">
                     <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-4"/>
                     <h3 className="font-bold text-slate-900 mb-2">المقر الرئيسي</h3>
                     <p className="text-slate-500 text-sm">المملكة العربية السعودية</p>
                     <p className="text-slate-400 text-xs mt-1">الرياض - طريق الملك فهد</p>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-2xl text-center border border-slate-100 hover:border-blue-500 transition-colors">
                     <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4"/>
                     <h3 className="font-bold text-slate-900 mb-2">الدعم الفني</h3>
                     <p className="text-slate-500 text-sm">0590113665</p>
                     <p className="text-slate-400 text-xs mt-1">خدمة العملاء</p>
                 </div>
             </div>
        </div>
    );

    // --- SINGLE POST VIEW ---
    const SinglePostView = () => {
        const post = BLOG_POSTS.find(p => p.id === selectedPost);
        if (!post) return <div className="py-20 text-center">المقال غير موجود</div>;

        return (
            <div className="bg-white min-h-screen">
                <SEOHelmet title={`${post.title} | مدونة مراد`} description={post.excerpt} path={`/group/blog/${post.id}`} image={post.image} />
                
                {/* Article Header */}
                <div className="bg-[#0f172a] text-white py-20 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                    <img src={post.image} className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"/>
                    <div className="max-w-4xl mx-auto relative z-20 text-center">
                        <div className="inline-block bg-blue-600 px-4 py-1 rounded-full text-xs font-bold mb-6">{post.category}</div>
                        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">{post.title}</h1>
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-300">
                            <span className="flex items-center gap-2"><UserCheck className="w-4 h-4"/> {post.author}</span>
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {post.date}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <button onClick={() => { setSelectedPost(null); navigateTo('/group/blog'); }} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm">
                        <ArrowRight className="w-4 h-4"/> العودة للمدونة
                    </button>
                    <div className="prose prose-lg prose-slate max-w-none leading-loose" dangerouslySetInnerHTML={{__html: post.content}}></div>
                    
                    {/* Share */}
                    <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-900">مشاركة المقال:</span>
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600"><Twitter className="w-5 h-5"/></button>
                            <button className="p-2 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700"><Linkedin className="w-5 h-5"/></button>
                            <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"><Share2 className="w-5 h-5"/></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- MAIN RENDER LOGIC ---

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans dir-rtl" dir="rtl">
            <Header />
            
            <main>
                {selectedPost ? (
                    <SinglePostView />
                ) : currentPath.includes('/products') ? (
                    <ProductsSection />
                ) : currentPath.includes('/blog') ? (
                    <BlogSection />
                ) : currentPath.includes('/about') ? (
                    <FounderSection />
                ) : currentPath.includes('/contact') ? (
                    <ContactSection />
                ) : (
                    /* HOME PAGE AGGREGATION */
                    <>
                        <HeroSection />
                        <ProductsSection />
                        <FounderSection />
                        <BlogSection />
                    </>
                )}
            </main>

            {/* CORPORATE FOOTER */}
            <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <LogoIcon />
                            <span className="font-bold text-white text-lg">شركة مراد الجهني</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm text-slate-400">
                            شركة وطنية رائدة في مجال تقنية المعلومات. نبتكر حلولاً رقمية تساهم في بناء مستقبل مستدام وذكي.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">الشركة</h4>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => navigateTo('/group/about')} className="hover:text-white transition-colors">عن الشركة</button></li>
                            <li><button onClick={() => navigateTo('/group/products')} className="hover:text-white transition-colors">المنتجات</button></li>
                            <li><button onClick={() => navigateTo('/group/blog')} className="hover:text-white transition-colors">المدونة</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">تواصل</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="mailto:im_murad7@hotmail.com" className="hover:text-white transition-colors">im_murad7@hotmail.com</a></li>
                            <li className="flex gap-4 mt-4">
                                <Twitter className="w-5 h-5 hover:text-white cursor-pointer"/>
                                <Linkedin className="w-5 h-5 hover:text-white cursor-pointer"/>
                                <Instagram className="w-5 h-5 hover:text-white cursor-pointer"/>
                            </li>
                            <li><a href="tel:0590113665" className="hover:text-white transition-colors" dir="ltr">0590113665</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    © 2025 شركة مراد الجهني لتقنية المعلومات العالمية. جميع الحقوق محفوظة.
                </div>
            </footer>
        </div>
    );
};

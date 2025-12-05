
import React, { useState, useEffect } from 'react';
import { 
    Cloud, Search, ArrowRight, Clock, Calendar, 
    Share2, Bookmark, Hash, Terminal, FileText, List, ChevronRight, Database, Globe
} from 'lucide-react';
import { ContentEngine, CloudArticle } from '../../services/Cloud/ContentEngine';
import { SEOHelmet } from '../SEOHelmet';
import { Footer } from '../Footer';

interface Props {
    onExit: () => void;
}

export const MuradCloud: React.FC<Props> = ({ onExit }) => {
    const engine = ContentEngine.getInstance();
    
    const [activeCategory, setActiveCategory] = useState('All');
    const [articles, setArticles] = useState<CloudArticle[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<CloudArticle | null>(null);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Initial Load
    useEffect(() => {
        loadFeed(1, 'All', true);
    }, []);

    const loadFeed = (pageNum: number, cat: string, reset: boolean) => {
        try {
            const data = engine.getFeed(pageNum, 24, cat); 
            if (reset) {
                setArticles(data);
            } else {
                setArticles(prev => [...prev, ...data]);
            }
        } catch (e) { console.error(e); }
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Category Change
    useEffect(() => {
        if (!selectedArticle) {
            setPage(1);
            loadFeed(1, activeCategory, true);
        }
    }, [activeCategory]);

    // Search Logic
    useEffect(() => {
        if (searchQuery.length > 2) {
            const results = engine.search(searchQuery);
            setArticles(results);
        } else if (searchQuery.length === 0 && page === 1) {
            loadFeed(1, activeCategory, true);
        }
    }, [searchQuery]);

    // Routing / Deep Linking
    useEffect(() => {
        const handlePath = () => {
            const path = window.location.pathname;
            const segments = path.split('/').filter(Boolean);
            if (segments.length >= 2 && segments[0] === 'cloud') {
                const id = segments[1];
                const article = engine.getArticleById(id);
                if (article) {
                    setSelectedArticle(article);
                    scrollToTop();
                }
            } else if (segments.length === 1 && segments[0] === 'cloud') {
                setSelectedArticle(null);
                scrollToTop();
            }
        };
        handlePath();
        window.addEventListener('popstate', handlePath);
        return () => window.removeEventListener('popstate', handlePath);
    }, []);

    const loadMore = () => {
        setLoading(true);
        const nextPage = page + 1;
        setPage(nextPage);
        setTimeout(() => {
            loadFeed(nextPage, activeCategory, false);
            setLoading(false);
        }, 300);
    };

    const openArticle = (id: string) => {
        setLoading(true);
        // Simulate massive content fetch
        setTimeout(() => {
            const article = engine.getArticleById(id);
            if (article) {
                setSelectedArticle(article);
                window.history.pushState({}, '', `/cloud/${id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
                scrollToTop();
            }
            setLoading(false);
        }, 500);
    };

    const closeArticle = () => {
        setSelectedArticle(null);
        window.history.pushState({}, '', `/cloud`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        scrollToTop();
    };

    // --- SUB-COMPONENTS ---

    const Header = () => (
        <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4 cursor-pointer" onClick={closeArticle}>
                    <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Cloud className="w-6 h-6 fill-current"/>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black tracking-tight font-mono text-slate-900">Murad<span className="text-blue-600">Cloud</span></h1>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Documentation Hub</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-xs font-mono text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <span className="flex items-center gap-2"><Database className="w-3 h-3 text-blue-500"/> 1,000,000,000 Docs</span>
                    <span className="w-px h-3 bg-slate-300"></span>
                    <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-emerald-500"/> Global CDN</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block group">
                        <input 
                            type="text" 
                            placeholder="Search 1B+ Articles..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-slate-100 border border-slate-200 rounded-lg py-2 pr-10 pl-4 text-xs w-80 text-slate-900 focus:border-blue-500 transition-all outline-none font-bold"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5"/>
                    </div>
                    <button onClick={onExit} className="text-slate-500 hover:text-red-600 font-bold text-xs whitespace-nowrap font-mono px-4 py-2 rounded hover:bg-red-50 transition-colors">
                        EXIT SYSTEM
                    </button>
                </div>
            </div>
        </header>
    );

    const ArticleView = () => {
        if (!selectedArticle) return null;
        return (
            <article className="bg-[#ffffff] min-h-screen pb-20 font-sans text-slate-900">
                <SEOHelmet title={`${selectedArticle.title} | مراد كلاود`} description={selectedArticle.excerpt} path={`/cloud/${selectedArticle.id}`} type="Article" />
                
                {/* Reading Progress */}
                <div className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 z-[60] w-full origin-left transform scale-x-0 animate-scroll-progress"></div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-12 flex flex-col lg:flex-row gap-16">
                    
                    {/* Main Content Column */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
                            <button onClick={closeArticle} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors group">
                                <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform"/> العودة للمكتبة
                            </button>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-blue-600"><Share2 className="w-5 h-5"/></button>
                                <button className="p-2 text-slate-400 hover:text-amber-500"><Bookmark className="w-5 h-5"/></button>
                            </div>
                        </div>

                        {/* Meta Header */}
                        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 mb-8">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-bold">{selectedArticle.category}</span>
                            <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100"><Calendar className="w-3 h-3"/> {selectedArticle.date}</span>
                            <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100"><Clock className="w-3 h-3"/> {selectedArticle.readTime}</span>
                            <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100"><Terminal className="w-3 h-3"/> Code Included</span>
                        </div>

                        <div 
                            className="prose prose-xl prose-slate max-w-none font-serif"
                            dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} 
                        />
                    </div>

                    {/* Sticky Sidebar (TOC & Metadata) */}
                    <aside className="w-full lg:w-96 shrink-0 space-y-8 lg:sticky lg:top-24 lg:self-start h-fit">
                        
                        <div className="bg-[#f8fafc] p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-black text-slate-900 mb-6 text-lg flex items-center gap-2">
                                <List className="w-5 h-5 text-blue-600"/> محتويات المرجع
                            </h4>
                            <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                                {Array.from({length: 20}).map((_, i) => (
                                    <a key={i} href="#" className="block text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded px-3 py-2 transition-all truncate">
                                        <span className="font-mono opacity-50 mr-2">{(i+1).toString().padStart(2,'0')}</span>
                                        الفصل {i+1}: التحليل التقني
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                            <h4 className="font-bold text-white mb-4 text-lg relative z-10">تحميل الكود المصدري</h4>
                            <p className="text-sm text-slate-400 mb-6 relative z-10">
                                يمكنك تحميل جميع الأمثلة البرمجية والمخططات الهندسية الواردة في هذا المقال.
                            </p>
                            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg relative z-10 flex items-center justify-center gap-2">
                                <Terminal className="w-4 h-4"/> تحميل (ZIP)
                            </button>
                        </div>

                        <div className="border border-slate-200 p-6 rounded-2xl text-center">
                             <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Written By</p>
                             <div className="font-bold text-slate-900 text-lg">{selectedArticle.author}</div>
                             <div className="text-xs text-blue-600 mt-1 font-mono">Senior Technical Architect</div>
                        </div>
                    </aside>
                </div>
            </article>
        );
    };

    const FeedView = () => (
        <div className="min-h-screen bg-[#f8fafc]">
            <SEOHelmet title="مراد كلاود | الموسوعة التقنية المليارية" description="أضخم مكتبة عربية للمقالات التقنية. مليار مقال، 10 تريليون كلمة، وشروحات برمجية متقدمة." path="/cloud" />
            
            {/* Hero Banner */}
            <div className="bg-[#0f172a] text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-8 backdrop-blur-md uppercase tracking-widest">
                         <Database className="w-4 h-4"/> The 1 Billion Project
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">الموسوعة التقنية <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">الشاملة</span></h2>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                        أضخم أرشيف رقمي عربي للمحتوى التقني العميق. شروحات برمجية، خوارزميات رياضية، وهندسة عكسية لأعقد الأنظمة.
                    </p>
                </div>
            </div>

            {/* Categories Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-2 h-14 overflow-x-auto no-scrollbar">
                        {engine.getAllCategories().map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-xs font-bold tracking-wide whitespace-nowrap h-full border-b-2 transition-all px-4 flex items-center ${activeCategory === cat ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2">أحدث الأوراق البحثية</h2>
                        <p className="text-slate-500 text-sm">يتم إضافة 1000 مقال جديد كل دقيقة.</p>
                    </div>
                    <div className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded">
                        Index Range: {page * 24 - 24} - {page * 24}
                    </div>
                </div>

                {/* Documentation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {articles.map((article) => (
                        <div 
                            key={article.id} 
                            onClick={() => openArticle(article.id)} 
                            className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 flex flex-col h-[400px] relative overflow-hidden"
                        >
                            {/* Decorative Code Background */}
                            <div className="absolute top-0 right-0 opacity-5 font-mono text-[8px] p-4 text-right pointer-events-none select-none">
                                {`function init() { return true; } class System { constructor(id) { this.id = id } }`}
                            </div>

                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {article.category}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">#{article.id.replace('doc-', '')}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-black text-slate-900 mb-4 leading-snug group-hover:text-blue-700 transition-colors line-clamp-3">
                                {article.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-4 mb-6 flex-1 font-serif">
                                {article.excerpt}
                            </p>

                            {/* Footer */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-[10px] border border-slate-200">
                                        M
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">Murad Core</span>
                                        <span className="text-[9px]">{article.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:gap-2 transition-all">
                                    Read <ChevronRight className="w-3 h-3 rtl:rotate-180"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center border-t border-slate-200 pt-10">
                    <p className="text-slate-400 text-xs mb-6 font-mono">Page {page} of 41,666,666</p>
                    <button 
                        onClick={loadMore} 
                        disabled={loading} 
                        className="px-16 py-4 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 mx-auto"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Load Next Batch'}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-right" dir="rtl">
            <Header />
            {loading && !articles.length ? (
                 <div className="flex h-screen items-center justify-center bg-white">
                     <div className="text-center">
                         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                         <h3 className="text-xl font-bold text-slate-900">Initializing Core...</h3>
                         <p className="text-slate-500 text-sm font-mono">Loading 1 Billion Documents</p>
                     </div>
                 </div>
            ) : selectedArticle ? <ArticleView /> : <FeedView />}
        </div>
    );
};

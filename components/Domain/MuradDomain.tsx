
import React, { useState } from 'react';
import { Search, Check, X, ShoppingCart, Globe, ShieldCheck, Lock, Server, ArrowRight, Star, Menu, Zap } from 'lucide-react';
import { DomainEngine, DomainResult } from '../../services/Domain/DomainEngine';
import { SEOHelmet } from '../SEOHelmet';
import { Footer } from '../Footer';

interface Props {
    onExit: () => void;
}

export const MuradDomain: React.FC<Props> = ({ onExit }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DomainResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [cart, setCart] = useState<DomainResult[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const engine = DomainEngine.getInstance();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        
        setIsSearching(true);
        const data = await engine.searchDomains(query);
        setResults(data);
        setIsSearching(false);
    };

    const addToCart = (domain: DomainResult) => {
        if (!cart.find(d => d.name === domain.name)) {
            setCart([...cart, domain]);
        }
    };

    const totalCart = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="min-h-screen bg-[#f5f7f9] font-sans text-right flex flex-col" dir="rtl">
            <SEOHelmet 
                title="مراد دومين | حجز نطاقات واستضافة" 
                description="سجل اسم نطاقك الآن مع مراد دومين. أسعار منافسة، حماية للخصوصية، ودعم فني 24/7. الوكيل الرسمي للنطاقات السعودية (.sa)." 
                path="/domains" 
            />

            {/* HEADER */}
            <header className="bg-[#111] text-white sticky top-0 z-50 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/domains'}>
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-black text-xl">M</div>
                        <h1 className="text-xl font-bold tracking-tighter">Murad <span className="text-emerald-500">Domain</span></h1>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                        <a href="#" className="hover:text-white">النطاقات</a>
                        <a href="#" className="hover:text-white">الاستضافة</a>
                        <a href="#" className="hover:text-white">الأمان</a>
                        <a href="#" className="hover:text-white">البريد الإلكتروني</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative cursor-pointer bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                            <ShoppingCart className="w-5 h-5 text-white"/>
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                        <button onClick={onExit} className="hidden md:block text-sm font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            عودة للأكاديمية
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                            <Menu className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#1a1a1a] p-4 border-t border-gray-800">
                        <nav className="flex flex-col gap-4 text-sm font-bold">
                            <a href="#" className="text-gray-300">النطاقات</a>
                            <a href="#" className="text-gray-300">الاستضافة</a>
                            <button onClick={onExit} className="text-emerald-400 text-right">عودة للأكاديمية</button>
                        </nav>
                    </div>
                )}
            </header>

            <div className="flex-1">
                {/* HERO SEARCH */}
                <section className="bg-[#111] text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            ابدأ مشروعك باسم <span className="text-emerald-500">مثالي</span>
                        </h2>
                        <p className="text-xl text-gray-400 mb-10">ابحث عن النطاق المثالي لمشروعك واحصل على بريد إلكتروني احترافي مجاناً.</p>

                        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
                            <div className="flex shadow-2xl rounded-full overflow-hidden p-2 bg-white">
                                <input 
                                    type="text" 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="اكتب اسم النطاق الذي تريده..." 
                                    className="flex-1 bg-transparent text-black px-6 py-4 text-lg outline-none font-bold placeholder-gray-400 text-right"
                                    dir="auto"
                                />
                                <button disabled={isSearching} className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-colors flex items-center gap-2">
                                    {isSearching ? <Zap className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5"/>}
                                    <span className="hidden sm:inline">بحث</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-mono text-gray-500">
                            {engine.getPopularTLDs().map(t => (
                                <span key={t.tld} className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-white font-bold">{t.tld}</span>
                                    <span className="text-emerald-500">{t.price} ر.س</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* RESULTS SECTION */}
                {results.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20 mb-20">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                            {/* Header Result */}
                            <div className="p-6 border-b border-gray-100 bg-emerald-50/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">نتائج البحث عن: <span className="font-bold text-black">{query}</span></p>
                                    </div>
                                    <div className="text-sm font-bold text-emerald-600">{results.length} نتائج متوفرة</div>
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y divide-gray-100">
                                {results.map((domain, idx) => (
                                    <div key={idx} className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4 flex-1 w-full">
                                            {domain.status === 'available' ? (
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                                                    <Check className="w-5 h-5"/>
                                                </div>
                                            ) : domain.status === 'premium' ? (
                                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                                    <Star className="w-5 h-5"/>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                                                    <X className="w-5 h-5"/>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className={`text-lg md:text-xl font-bold text-left ${domain.status === 'taken' ? 'text-gray-400 line-through' : 'text-gray-900'}`} dir="ltr">{domain.name}</h3>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {domain.tags?.map(tag => (
                                                        <span key={tag} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{tag}</span>
                                                    ))}
                                                    {domain.status === 'taken' && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold">غير متاح</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                            <div className="text-right">
                                                {domain.originalPrice && (
                                                    <div className="text-xs text-gray-400 line-through">{domain.originalPrice} ر.س</div>
                                                )}
                                                <div className="text-xl md:text-2xl font-black text-gray-900">
                                                    {domain.price} <span className="text-sm font-normal text-gray-500">ر.س</span>
                                                </div>
                                                <div className="text-[10px] text-gray-400">للسنة الأولى</div>
                                            </div>
                                            <button 
                                                disabled={domain.status === 'taken'}
                                                onClick={() => addToCart(domain)}
                                                className={`px-6 py-3 rounded-xl font-bold transition-all min-w-[120px] ${
                                                    domain.status === 'taken' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-black text-white hover:bg-emerald-600'
                                                }`}
                                            >
                                                {domain.status === 'taken' ? 'محجوز' : 'أضف للسلة'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* MARKETING / FEATURES */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا يختار الملايين مراد دومين؟</h2>
                            <p className="text-gray-500">نقدم أكثر من مجرد اسم نطاق. نحن شريكك في النجاح الرقمي.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                    <ShieldCheck className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">حماية الخصوصية مجاناً</h3>
                                <p className="text-gray-500 leading-relaxed">نخفي بياناتك الشخصية من سجلات WHOIS العامة لحمايتك من البريد المزعج والمتطفلين.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                                    <Server className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">ربط تلقائي بالاستضافة</h3>
                                <p className="text-gray-500 leading-relaxed">اربط نطاقك بخدمات مراد كلاود أو أي استضافة خارجية بضغطة زر واحدة ودون تعقيد.</p>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                                    <Lock className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">أمان SSL متقدم</h3>
                                <p className="text-gray-500 leading-relaxed">نضمن تشفير بيانات موقعك وزواره بأحدث شهادات الأمان SSL العالمية.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CART FLOATING BAR */}
                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100] animate-fade-in-up">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                                    <ShoppingCart className="w-6 h-6"/>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{cart.length} منتجات في السلة</div>
                                    <div className="text-sm text-gray-500">الإجمالي: <span className="text-emerald-600 font-bold">{totalCart} ر.س</span></div>
                                </div>
                            </div>
                            <button className="bg-black text-white px-6 md:px-10 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                                <span className="hidden md:inline">متابعة الشراء</span>
                                <span className="md:hidden">دفع</span>
                                <ArrowRight className="w-4 h-4 rtl:rotate-180"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

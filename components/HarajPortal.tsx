
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    X, Search, PlusCircle, MapPin, Clock, ArrowLeft, 
    MessageCircle, Phone, User, Filter, ChevronRight, Check,
    LayoutList, Tag, Car
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductListing } from '../types';
import { ExpansionCore, DiscoveryItem } from '../services/Expansion/ExpansionCore';
import { AuthModal } from './AuthModal';
import { PostModal } from './PostModal';
import { SEOHelmet } from './SEOHelmet'; 
import { CrowdTicker } from './Nexus/CrowdTicker';
import { HARAJ_CITIES, HARAJ_TAG_TREE } from '../services/Replica/HarajCore';

interface HarajPortalProps {
    onBack: () => void;
}

// CACHE CONSTANTS
const CACHE_DURATION = 300000; // 5 Minutes
const PAGE_SIZE = 15;

export const HarajPortal: React.FC<HarajPortalProps> = ({ onBack }) => {
    const { user, allProducts, allJobs, incrementProductViews } = useAuth(); 
    
    // --- REPLICA STATE ---
    const [currentCity, setCurrentCity] = useState(HARAJ_CITIES[0]); // Default: All Cities
    const [cityModalOpen, setCityModalOpen] = useState(false);
    
    // Tag Tree State (Breadcrumbs)
    const [activeTags, setActiveTags] = useState<string[]>([]); // e.g. ['Cars', 'Toyota', 'Camry']
    
    // View State
    const [view, setView] = useState<'browse' | 'detail'>('browse');
    const [selectedItem, setSelectedItem] = useState<DiscoveryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Data State
    const [displayFeed, setDisplayFeed] = useState<DiscoveryItem[]>([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    
    // Modals
    const [authOpen, setAuthOpen] = useState(false);
    const [postModalOpen, setPostModalOpen] = useState(false);
    
    const observerRef = useRef<HTMLDivElement | null>(null);

    // --- LOGIC: FILTERING & GEO-ROUTING ---
    useEffect(() => {
        // 1. Base Feed Generation (Colossus Engine)
        const cachedRaw = sessionStorage.getItem('colossus_feed_cache');
        // SAFE PARSE FOR META
        let cacheMeta = {};
        try {
            cacheMeta = JSON.parse(sessionStorage.getItem('colossus_feed_meta') || '{}');
        } catch (e) {
            cacheMeta = {};
        }

        const now = Date.now();
        let fullFeed: DiscoveryItem[] = [];

        if (cachedRaw && (cacheMeta as any).timestamp && (now - (cacheMeta as any).timestamp < CACHE_DURATION)) {
            try {
                fullFeed = JSON.parse(cachedRaw);
            } catch (e) {
                fullFeed = [];
            }
        } else {
            let courses = [];
            try {
                courses = JSON.parse(localStorage.getItem('mylaf_custom_courses') || '[]');
            } catch (e) {
                courses = [];
            }
            fullFeed = ExpansionCore.DiscoveryEngine.generateMixedFeed(user, allProducts, allJobs, courses);
            sessionStorage.setItem('colossus_feed_cache', JSON.stringify(fullFeed));
            sessionStorage.setItem('colossus_feed_meta', JSON.stringify({ timestamp: now }));
        }

        // 2. Apply Replica Filters
        const filtered = fullFeed.filter(item => {
            // A. Search
            const searchTokens = searchTerm.toLowerCase().split(' ').filter(t => t);
            const titleLower = item.title.toLowerCase();
            const matchesSearch = searchTokens.length === 0 || searchTokens.every(token => titleLower.includes(token));
            
            // B. City Filter (Geo-Router)
            let matchesCity = true;
            if (currentCity.id !== 'all') {
                // Check if tags include city name OR location text
                matchesCity = item.tags.some(t => t.includes(currentCity.name)) || 
                              (item.data.location && item.data.location.includes(currentCity.name));
            }

            // C. Tag Tree Filter
            let matchesTags = true;
            if (activeTags.length > 0) {
                // If filtering by "Cars", check if item is car. 
                // In this simplified feed, we check tags or category data.
                const category = activeTags[0]; // e.g. Cars
                const brand = activeTags[1];    // e.g. Toyota
                const model = activeTags[2];    // e.g. Camry

                // Basic mapping for demo
                if (category) {
                    if (item.type === 'Product') {
                        matchesTags = item.data.category === category || item.data.category === 'All';
                        if (brand && matchesTags) matchesTags = item.title.includes(brand) || item.tags.includes(brand);
                        if (model && matchesTags) matchesTags = item.title.includes(model) || item.tags.includes(model);
                    } else {
                        matchesTags = false; // Strict filtering for tree
                    }
                }
            }

            return matchesSearch && matchesCity && matchesTags;
        });

        setDisplayFeed(filtered);
    }, [allProducts, allJobs, user, searchTerm, currentCity, activeTags]);

    // --- INFINITE SCROLL ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && displayFeed.length > visibleCount) {
                setVisibleCount(prev => prev + PAGE_SIZE);
            }
        }, { threshold: 0.5 });

        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [displayFeed, visibleCount]);

    // --- HANDLERS ---
    const handleTagClick = (tagKey: string, level: number) => {
        const newTags = [...activeTags];
        newTags[level] = tagKey;
        // Truncate if going back up
        const finalTags = newTags.slice(0, level + 1);
        setActiveTags(finalTags);
    };

    const handleCitySelect = (city: any) => {
        setCurrentCity(city);
        setCityModalOpen(false);
    };

    const handleItemClick = (item: DiscoveryItem) => {
        if (item.type === 'Product') {
            incrementProductViews(item.id);
            setSelectedItem(item);
            setView('detail');
        } else if (item.type === 'Job') {
            window.open(item.data.url || '#', '_blank');
        }
    };

    // --- COMPONENTS ---

    const TagBar = () => {
        // Determine what to show based on activeTags
        // Level 0: Roots (Cars, etc)
        // Level 1: Children of activeTags[0]
        // Level 2: Children of activeTags[1]
        
        let currentLevel = activeTags.length;
        let options: any[] = [];
        let parentLabel = '';

        if (currentLevel === 0) {
            options = Object.keys(HARAJ_TAG_TREE).map(k => ({ key: k, label: HARAJ_TAG_TREE[k].label }));
        } else if (currentLevel === 1) {
            const root = HARAJ_TAG_TREE[activeTags[0]];
            if (root && root.children) {
                options = Object.keys(root.children).map(k => ({ key: k, label: root.children[k].label }));
                parentLabel = root.label;
            }
        } else if (currentLevel === 2) {
            const root = HARAJ_TAG_TREE[activeTags[0]];
            const brand = root?.children?.[activeTags[1]];
            if (brand && Array.isArray(brand.children)) {
                options = brand.children.map((k: string) => ({ key: k, label: k }));
                parentLabel = brand.label;
            }
        }

        return (
            <div className="bg-white border-b border-gray-200">
                {/* Active Breadcrumbs */}
                {activeTags.length > 0 && (
                    <div className="flex gap-2 px-4 py-2 overflow-x-auto text-xs whitespace-nowrap border-b border-gray-100">
                        <button onClick={() => setActiveTags([])} className="text-gray-500">الرئيسية</button>
                        {activeTags.map((tag, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <ChevronRight className="w-3 h-3 text-gray-400 rtl:rotate-180"/>
                                <button onClick={() => setActiveTags(activeTags.slice(0, i+1))} className="text-blue-600 font-bold">
                                    {/* Try to resolve label or just show tag */}
                                    {tag} 
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Selection Bar */}
                <div className="flex gap-2 p-2 overflow-x-auto scrollbar-hide bg-gray-50">
                    {activeTags.length > 0 && (
                        <button 
                            onClick={() => setActiveTags(activeTags.slice(0, -1))}
                            className="bg-gray-200 p-2 rounded-lg text-gray-600 shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 rtl:rotate-180"/>
                        </button>
                    )}
                    {options.map((opt) => (
                        <button 
                            key={opt.key}
                            onClick={() => handleTagClick(opt.key, currentLevel)}
                            className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 whitespace-nowrap shadow-sm"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const CityModal = () => {
        if (!cityModalOpen) return null;
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden font-sans text-right" dir="rtl">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800">اختر المدينة</h3>
                        <button onClick={() => setCityModalOpen(false)}><X className="w-5 h-5 text-gray-500"/></button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                        {HARAJ_CITIES.map(city => (
                            <button 
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                className={`w-full text-right p-4 border-b border-gray-100 font-bold ${currentCity.id === city.id ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {city.name}
                                {currentCity.id === city.id && <span className="float-left text-blue-600">✔</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div className="fixed inset-0 z-50 bg-[#f6f6f6] overflow-y-auto font-sans text-right" dir="rtl">
            <SEOHelmet title={`حراج ${currentCity.name} | ميلاف ماركت`} description="سوق ميلاف المفتوح" path="/market"/>
            
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#1e293b] text-white shadow-md">
                <div className="flex items-center justify-between px-4 h-14">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 -mr-2 hover:bg-white/10 rounded-full">
                            <ArrowLeft className="w-5 h-5 rtl:rotate-180"/>
                        </button>
                        <h1 className="font-black text-lg text-white">ميلاف <span className="text-amber-400">ماركت</span></h1>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setCityModalOpen(true)}
                            className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20"
                        >
                            <MapPin className="w-3 h-3 text-emerald-400"/> {currentCity.name}
                        </button>
                        <button onClick={() => { if(!user) setAuthOpen(true); else setPostModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                            <PlusCircle className="w-4 h-4"/> إضافة إعلان
                        </button>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن سلعة..." 
                            className="w-full bg-[#0f172a] border border-white/10 text-white rounded-lg py-2.5 pr-10 pl-4 text-sm focus:border-blue-500 outline-none"
                        />
                        <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400"/>
                    </div>
                </div>
            </div>

            {/* Tag Tree & Filtering */}
            <TagBar />

            {/* Main Feed */}
            {view === 'browse' && (
                <div className="max-w-3xl mx-auto pb-20">
                    {/* Live Ticker */}
                    <div className="bg-white border-b border-gray-200 p-2 flex justify-center">
                        <CrowdTicker context="Market" className="bg-blue-50 text-blue-600 border-blue-100" />
                    </div>

                    <div className="divide-y divide-gray-200 bg-white shadow-sm border-x border-gray-200 min-h-screen">
                        {displayFeed.slice(0, visibleCount).map((item) => {
                            // HARAJ STYLE LIST ITEM
                            const p = item.data;
                            const timeAgo = Math.floor((Date.now() - new Date(p.createdAt || p.date).getTime()) / 60000);
                            const timeStr = timeAgo < 60 ? `قبل ${timeAgo} دقيقة` : `قبل ${Math.floor(timeAgo/60)} ساعة`;
                            const city = item.type === 'Product' ? p.location : p.location;
                            const userName = item.type === 'Product' ? p.sellerName : p.company;

                            return (
                                <div key={item.id} onClick={() => handleItemClick(item)} className="p-3 flex gap-3 hover:bg-[#f9f9f9] cursor-pointer transition-colors group">
                                    {/* Thumbnail (Right) */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-24 bg-gray-100 rounded-md overflow-hidden shrink-0 relative border border-gray-200">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        {item.type !== 'Product' && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[9px] text-center font-bold py-0.5">
                                                {item.type === 'Job' ? 'وظيفة' : 'دورة'}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content (Left) */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                                        <div>
                                            <h3 className="text-[#11406c] font-bold text-base sm:text-lg line-clamp-2 leading-tight group-hover:text-blue-600">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.tags.slice(0,2).map((t, i) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {city}</span>
                                                <span className="hidden sm:inline">|</span>
                                                <span className="hidden sm:flex items-center gap-1"><User className="w-3 h-3"/> {userName}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium">
                                                {timeStr}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div ref={observerRef} className="h-20 flex items-center justify-center text-gray-400 text-sm">
                            {displayFeed.length > visibleCount ? 'جاري التحميل...' : 'وصلت للنهاية'}
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL VIEW (Product) */}
            {view === 'detail' && selectedItem && selectedItem.type === 'Product' && (
                <div className="max-w-3xl mx-auto bg-white min-h-screen pb-20 relative">
                    <div className="sticky top-0 bg-white border-b z-30 p-3 flex items-center gap-4">
                        <button onClick={() => setView('browse')}><ArrowLeft className="w-6 h-6 text-gray-600 rtl:rotate-180"/></button>
                        <span className="font-bold text-gray-800 line-clamp-1">{selectedItem.title}</span>
                    </div>
                    
                    <div className="bg-black aspect-video relative">
                        <img src={selectedItem.image} className="w-full h-full object-contain" />
                    </div>

                    <div className="p-4">
                        <h1 className="text-2xl font-black text-[#11406c] mb-2">{selectedItem.title}</h1>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedItem.data.location}</span>
                            <span>{new Date(selectedItem.data.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-gray-800 whitespace-pre-line leading-relaxed text-base mb-6">
                            {selectedItem.data.description}
                        </p>

                        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    {selectedItem.data.sellerName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{selectedItem.data.sellerName}</div>
                                    <div className="text-xs text-gray-500">عضو في ميلاف</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-green-500 text-white rounded-full"><Phone className="w-5 h-5"/></button>
                                <button className="p-2 bg-blue-500 text-white rounded-full"><MessageCircle className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CityModal />
            <PostModal isOpen={postModalOpen} onClose={() => setPostModalOpen(false)} />
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
};

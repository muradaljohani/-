
import React, { useState, useEffect } from 'react';
import { SocialPost, stories } from '../../dummyData';
import { SocialService } from '../../services/SocialService';
import { PostCard } from './PostCard';
import { ArrowUp, Loader2, Sparkles, Plus, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FeedProps {
    onOpenLightbox: (src: string) => void;
    showToast: (msg: string, type: 'success'|'error') => void;
    onBack: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onBack }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activePostId, setActivePostId] = useState<string | null>(null);

    // --- DATA LOADING ---
    const loadData = async () => {
        setIsLoading(true);
        try {
            await SocialService.checkAndSeed(); // Ensuring auto-seed works
            const data = await SocialService.getPosts();
            setPosts(data);
        } catch (e) {
            console.error(e);
            showToast('حدث خطأ أثناء تحميل المنشورات', 'error');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- SCROLL TO TOP LOGIC ---
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) setShowScrollTop(true);
            else setShowScrollTop(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- PULL TO REFRESH (Simulated) ---
    const handlePullRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            loadData();
        }, 1500);
    };

    return (
        <div className="relative min-h-screen">
            
            {/* 1. HEADER & BANNER */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-slate-800 transition-all">
                {/* Mobile Header Row */}
                <div className="flex justify-between items-center px-4 py-3 md:hidden">
                    <h2 className="text-lg font-bold text-white">الرئيسية</h2>
                    <button onClick={onBack} className="text-white"><ArrowLeft className="w-5 h-5 rtl:rotate-180"/></button>
                </div>

                {/* --- THE WELCOME BANNER (PACK 0) --- */}
                <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-black px-4 py-3 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <Sparkles className="w-5 h-5 text-amber-400 animate-pulse"/>
                             <div>
                                 <h1 className="text-sm font-black text-white tracking-wide">مراد سوشل ميديا | Murad Social</h1>
                                 <p className="text-[10px] text-purple-200">المنصة الاجتماعية الأولى للمبدعين</p>
                             </div>
                         </div>
                         <button className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full font-bold text-white transition-colors">
                             اكتشف المزيد
                         </button>
                    </div>
                </div>

                {/* Pull-to-Refresh Indicator */}
                {isRefreshing && (
                    <div className="flex justify-center py-2 bg-blue-900/20">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin"/>
                    </div>
                )}
            </div>

            {/* 2. STORIES RAIL */}
            <div className="flex gap-3 overflow-x-auto pt-4 pb-4 px-4 scrollbar-hide border-b border-slate-800 bg-black">
                {/* Add Story */}
                <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[64px]">
                    <div className="w-[64px] h-[64px] rounded-full border-2 border-slate-800 relative bg-slate-900">
                        <img 
                            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-full h-full rounded-full object-cover opacity-60"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-black">
                            <Plus className="w-3 h-3"/>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">قصتك</span>
                </div>

                {/* Friend Stories */}
                {stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer min-w-[64px] group">
                        <div className={`w-[68px] h-[68px] rounded-full p-[2px] ${story.isViewed ? 'bg-slate-800' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}`}>
                            <div className="w-full h-full bg-black rounded-full p-0.5 border-2 border-black">
                                <img 
                                    src={story.user.avatar} 
                                    className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-300 w-16 truncate text-center font-medium">{story.user.name}</span>
                    </div>
                ))}
            </div>

            {/* 3. POSTS FEED */}
            <div className="pb-32"> {/* Extra padding for bottom nav */}
                {isLoading ? (
                    // --- SKELETON LOADING (PACK 3) ---
                    <div className="space-y-4 p-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex gap-4">
                                <div className="rounded-full bg-slate-800 h-12 w-12 shrink-0"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-800 rounded"></div>
                                        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                                    </div>
                                    <div className="h-48 bg-slate-800 rounded-xl mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            onOpenLightbox={onOpenLightbox}
                            onShare={(text) => showToast(text, 'success')}
                        />
                    ))
                )}
                
                {!isLoading && posts.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>لا توجد منشورات حالياً.</p>
                        <button onClick={loadData} className="mt-4 text-blue-400 font-bold hover:underline">تحديث</button>
                    </div>
                )}
            </div>

            {/* 4. SCROLL TO TOP FAB */}
            {showScrollTop && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-24 left-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-500 transition-all animate-bounce-slow"
                >
                    <ArrowUp className="w-5 h-5"/>
                </button>
            )}

        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    addDoc, 
    serverTimestamp, 
    doc, 
    setDoc 
} from '../../src/lib/firebase';
import { db } from '../../src/lib/firebase';
import { SocialPost, stories } from '../../dummyData';
import { PostCard } from './PostCard';
import { ArrowUp, Loader2, Plus, Image as ImageIcon, Send, ArrowLeft, Sparkles } from 'lucide-react';
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
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    // Posting State
    const [newPostText, setNewPostText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // Time helper
    const getTimeDifference = (date: Date) => {
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000;
        if (diff < 60) return 'الآن';
        if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
        if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
        return `منذ ${Math.floor(diff / 86400)} يوم`;
    };

    // --- 1. THE SELF-HEALING ENGINE & REAL-TIME SYNC ---
    useEffect(() => {
        const initFeed = async () => {
            if (!db) {
                console.error("Firestore not initialized");
                setIsLoading(false);
                return;
            }

            // A. Self-Healing: Ensure Viral Posts Exist
            // We do this inside a try-catch to avoid crashing if offline or permission denied
            try {
                 const viralUser = {
                    name: "Murad Aljohani",
                    handle: "@IpMurad",
                    avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
                    verified: true,
                    isGold: true,
                    uid: user?.id || "admin-murad-id" // Use current user ID if available so it links to profile
                };

                // Fixed ID 1: The YouTube Story
                const viralRef = doc(db, "social_posts", "viral-youtube-story"); 
                await setDoc(viralRef, {
                    user: viralUser,
                    type: 'image',
                    content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
                    images: ["https://i.ibb.co/QjNHDv3F/images-4.jpg"],
                    createdAt: serverTimestamp(), 
                    likes: 50000,
                    retweets: 5000000,
                    replies: 12000,
                    views: '15M',
                    isPinned: true
                }, { merge: true });

                // Fixed ID 2: The Archive Memory
                const archiveRef = doc(db, "social_posts", "viral-archive-memory");
                await setDoc(archiveRef, {
                    user: viralUser,
                    type: 'image',
                    content: 'من الأرشيف.. الطموح لا يشيخ. 🦅\nكنت أعلم منذ تلك اللحظة أننا سنصل إلى هنا يوماً ما.\n\n#ذكريات #اصرار',
                    images: ["https://i.ibb.co/Hfrm9Bd4/20190220-200812.jpg"],
                    createdAt: new Date(Date.now() - 86400000), // 1 day ago
                    likes: 42000,
                    retweets: 2000000,
                    replies: 8000,
                    views: '10M',
                    isPinned: false
                }, { merge: true });
                
                console.log("Self-healing complete.");
            } catch (e) {
                console.warn("Self-healing skipped (offline or permission):", e);
            }

            // B. Real-Time Listener
            const postsCollection = collection(db, 'social_posts');
            const q = query(
                postsCollection,
                orderBy('isPinned', 'desc'),
                orderBy('createdAt', 'desc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const livePosts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Handle Firestore Timestamp
                    let timeDisplay = 'Just now';
                    if (data.createdAt) {
                        const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
                        timeDisplay = getTimeDifference(date);
                    }
                    
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: timeDisplay
                    } as SocialPost;
                });
                setPosts(livePosts);
                setIsLoading(false);
            }, (error) => {
                console.error("Stream Error:", error);
                setIsLoading(false);
            });

            return unsubscribe;
        };

        const unsubPromise = initFeed();
        return () => { unsubPromise.then(unsub => unsub && unsub()); };
    }, [user]);

    // Scroll to Top Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) setShowScrollTop(true);
            else setShowScrollTop(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handlePost = async () => {
        if (!newPostText.trim()) return;
        if (!user) return alert("يرجى تسجيل الدخول");

        setIsPosting(true);
        try {
            await addDoc(collection(db, "social_posts"), {
                user: {
                    id: user.id,
                    name: user.name,
                    handle: user.username ? `@${user.username}` : `@${user.id.substring(0,8)}`,
                    avatar: user.avatar,
                    verified: user.isIdentityVerified,
                    isGold: user.role === 'admin'
                },
                content: newPostText,
                type: 'text',
                createdAt: serverTimestamp(),
                likes: 0,
                retweets: 0,
                replies: 0,
                views: '0',
                isPinned: false
            });
            setNewPostText('');
            showToast('تم النشر!', 'success');
        } catch (e) {
            console.error(e);
            showToast('فشل النشر', 'error');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-slate-800">
                <div className="flex justify-between items-center px-4 py-3 md:hidden">
                    <h2 className="text-lg font-bold text-white">الرئيسية</h2>
                    <button onClick={onBack} className="text-white bg-slate-800 p-2 rounded-full"><ArrowLeft className="w-5 h-5 rtl:rotate-180"/></button>
                </div>
                 {/* Banner */}
                <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-black px-4 py-3 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <div className="p-1.5 bg-amber-500/20 rounded-lg">
                                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse"/>
                             </div>
                             <div>
                                 <h1 className="text-sm font-black text-white tracking-wide">مراد سوشل ميديا | Murad Social</h1>
                                 <p className="text-[10px] text-purple-200">المنصة الاجتماعية الأولى للمبدعين</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Stories Rail */}
            <div className="flex gap-3 overflow-x-auto pt-4 pb-4 px-4 scrollbar-hide border-b border-slate-800 bg-black">
                {/* Add Story */}
                <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[64px]">
                    <div className="w-[64px] h-[64px] rounded-full border-2 border-slate-800 relative bg-slate-900">
                        <img 
                            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-full h-full rounded-full object-cover opacity-60"
                        />
                        <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-black">
                            <Plus className="w-3 h-3"/>
                        </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">قصتك</span>
                </div>
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

            {/* Compose Area */}
            <div className="p-4 border-b border-slate-800 bg-black hidden md:block">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                        <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Guest"} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder={user ? "ماذا يدور في ذهنك؟" : "سجل دخولك لتشاركنا أفكارك..."}
                            className="w-full bg-transparent text-white text-lg placeholder-slate-500 outline-none resize-none h-20 scrollbar-hide"
                            disabled={!user || isPosting}
                        />
                        <div className="flex justify-between items-center mt-2 border-t border-slate-800 pt-3">
                            <div className="flex gap-2 text-blue-500">
                                <button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"><ImageIcon className="w-5 h-5"/></button>
                            </div>
                            <button 
                                onClick={handlePost}
                                disabled={!newPostText.trim() || isPosting || !user}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                            >
                                {isPosting ? <Loader2 className="w-4 h-4 animate-spin"/> : 'نشر'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="pb-32 min-h-[50vh]">
                {isLoading ? (
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
                    </div>
                )}
            </div>

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

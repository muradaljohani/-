
import React, { useState, useEffect } from 'react';
import { Search, Settings, MoreHorizontal, TrendingUp } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, db, where } from '../../src/lib/firebase';

interface Props {
    onPostClick: (id: string) => void;
}

export const Explore: React.FC<Props> = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaPosts, setMediaPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('foryou');

  // Real-time Media Feed
  useEffect(() => {
    // FIXED: Removed 'where' clause to prevent composite index error with 'orderBy'.
    // We fetch recent posts and filter for images client-side.
    // Ideally we would have a specific 'media' collection or a proper index.
    const postsRef = collection(db, 'posts');
    const q = query(
        postsRef, 
        orderBy('createdAt', 'desc'), 
        limit(50) // Fetch more to allow for filtering
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Client-side filter for media posts
        // Backward compatibility: check 'type' or 'images' array
        const mediaOnly = posts.filter((p: any) => 
            p.type === 'image' || (p.images && p.images.length > 0)
        ).slice(0, 21); // Limit display to grid size
        
        setMediaPosts(mediaOnly);
    });

    return () => unsubscribe();
  }, []);

  const TRENDS = [
    { category: 'Trending in Saudi Arabia', tag: '#RiyadhSeason', posts: '240K' },
    { category: 'Technology · Trending', tag: '#AI_Revolution', posts: '54.2K' },
    { category: 'Sports · Live', tag: '#AlHilal', posts: '120K' },
    { category: 'Business · Trending', tag: '#Vision2030', posts: '89K' },
    { category: 'Entertainment', tag: '#Mylaf_Social', posts: '15K' },
  ];

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-20">
        
        {/* Search Header */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-[#2f3336]">
             <div className="flex-1 relative group">
                <Search className="absolute right-4 top-3 w-4 h-4 text-[#71767b] group-focus-within:text-[#1d9bf0]" />
                <input 
                    type="text" 
                    placeholder="بحث في ميلاف"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#202327] text-white rounded-full py-2.5 pr-10 pl-4 outline-none focus:bg-black focus:border focus:border-[#1d9bf0] transition-all text-sm placeholder-[#71767b]"
                />
             </div>
             <Settings className="w-5 h-5 text-[#eff3f4]" />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2f3336] mt-1">
            <button 
                onClick={() => setActiveTab('foryou')}
                className={`flex-1 py-3 text-[15px] font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === 'foryou' ? 'text-white' : 'text-[#71767b]'}`}
            >
                لك
                {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#1d9bf0] rounded-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('trending')}
                className={`flex-1 py-3 text-[15px] font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === 'trending' ? 'text-white' : 'text-[#71767b]'}`}
            >
                المتداول
                {activeTab === 'trending' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('media')}
                className={`flex-1 py-3 text-[15px] font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === 'media' ? 'text-white' : 'text-[#71767b]'}`}
            >
                وسائط
                {activeTab === 'media' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#1d9bf0] rounded-full"></div>}
            </button>
        </div>

        {/* Content */}
        {activeTab === 'foryou' || activeTab === 'trending' ? (
            <div>
                {/* Visual Banner */}
                <div className="relative h-48 md:h-64 bg-[#16181c] border-b border-[#2f3336] mb-4 group cursor-pointer overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                         <span className="text-xs font-bold text-white bg-[#1d9bf0] px-2 py-0.5 rounded-sm">مباشر</span>
                         <h3 className="text-xl font-bold text-white mt-1">مؤتمر التقنية الدولي بالرياض</h3>
                     </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="font-bold text-xl px-4 py-3">المتداول في المملكة</h3>
                    {TRENDS.map((trend, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-[#16181c] cursor-pointer transition-colors relative">
                            <div className="flex justify-between items-start">
                                <div className="text-[13px] text-[#71767b]">{trend.category}</div>
                                <MoreHorizontal className="w-4 h-4 text-[#71767b]"/>
                            </div>
                            <div className="font-bold text-[15px] mt-0.5 ltr" dir="ltr">{trend.tag}</div>
                            <div className="text-[13px] text-[#71767b] mt-0.5">{trend.posts} Posts</div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                {mediaPosts.map((post) => (
                    <div 
                        key={post.id} 
                        className="aspect-square bg-[#16181c] relative cursor-pointer group overflow-hidden"
                        onClick={() => onPostClick(post.id)}
                    >
                        <img 
                            src={post.images?.[0] || post.image} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                            loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
                {mediaPosts.length === 0 && (
                    <div className="col-span-3 p-8 text-center text-gray-500">لا توجد وسائط حالياً</div>
                )}
            </div>
        )}

    </div>
  );
};

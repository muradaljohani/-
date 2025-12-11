
import React, { useState, useEffect } from 'react';
import { Search, Settings, MoreHorizontal } from 'lucide-react';
import { collection, query, limit, onSnapshot, db } from '../../src/lib/firebase';

interface Props {
    onPostClick: (id: string) => void;
}

export const Explore: React.FC<Props> = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaPosts, setMediaPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('foryou');

  // Real-time Media Feed (Safe Query)
  useEffect(() => {
    try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, limit(50)); // Removed orderBy to fix index error

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Client-side sort
            posts.sort((a: any, b: any) => {
                const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (new Date(a.createdAt || 0).getTime());
                const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (new Date(b.createdAt || 0).getTime());
                return tB - tA;
            });

            // Client-side filter
            const mediaOnly = posts.filter((p: any) => 
                p.type === 'image' || (p.images && p.images.length > 0)
            ).slice(0, 21);
            
            setMediaPosts(mediaOnly);
        }, (error) => {
            console.error("Explore Feed Error:", error);
        });

        return () => unsubscribe();
    } catch (e) {
        console.error("Explore Setup Error:", e);
    }
  }, []);

  const TRENDS = [
    { category: 'Trending in Saudi Arabia', tag: '#RiyadhSeason', posts: '240K' },
    { category: 'Technology · Trending', tag: '#AI_Revolution', posts: '54.2K' },
    { category: 'Sports · Live', tag: '#AlHilal', posts: '120K' },
  ];

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-20">
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-[#2f3336]">
             <div className="flex-1 relative group">
                <Search className="absolute right-4 top-3 w-4 h-4 text-[#71767b]" />
                <input 
                    type="text" 
                    placeholder="بحث في ميلاف"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#202327] text-white rounded-full py-2.5 pr-10 pl-4 outline-none focus:bg-black focus:border focus:border-[#1d9bf0] transition-all text-sm"
                />
             </div>
             <Settings className="w-5 h-5 text-[#eff3f4]" />
        </div>

        <div className="flex border-b border-[#2f3336] mt-1">
            {['foryou', 'trending', 'media'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-[15px] font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === tab ? 'text-white' : 'text-[#71767b]'}`}
                >
                    {tab === 'foryou' ? 'لك' : tab === 'trending' ? 'المتداول' : 'وسائط'}
                    {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
            ))}
        </div>

        {activeTab === 'media' ? (
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                {mediaPosts.map((post) => (
                    <div key={post.id} className="aspect-square bg-[#16181c] relative cursor-pointer" onClick={() => onPostClick(post.id)}>
                        <img src={post.images?.[0] || post.image} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col">
                 <h3 className="font-bold text-xl px-4 py-3">المتداول في المملكة</h3>
                 {TRENDS.map((trend, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-[#16181c] cursor-pointer border-b border-[#2f3336]">
                        <div className="text-[13px] text-[#71767b]">{trend.category}</div>
                        <div className="font-bold text-[15px] mt-0.5 dir-ltr">{trend.tag}</div>
                        <div className="text-[13px] text-[#71767b] mt-0.5">{trend.posts} Posts</div>
                    </div>
                 ))}
            </div>
        )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  setDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { db, auth } from '../../src/lib/firebase';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, Calendar } from 'lucide-react';

interface FeedProps {
    onOpenLightbox?: (src: string) => void;
    showToast?: (msg: string, type: 'success'|'error') => void;
    onBack?: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 1. Listen to Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. SELF-HEALING SEEDING LOGIC (Preserved)
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        const viralPostRef = doc(db, "social_posts", "viral-welcome-post"); 
        const viralSnap = await getDoc(viralPostRef);

        if (!viralSnap.exists()) {
          await setDoc(viralPostRef, {
            content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
            images: ['https://i.ibb.co/QjNHDv3F/images-4.jpg'],
            user: {
              name: "Murad Aljohani",
              handle: "@IpMurad",
              avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
              verified: true,
              isGold: true,
              uid: "admin-murad-fixed-id" 
            },
            type: 'image',
            likes: 50000, 
            retweets: 5000000, 
            replies: 12500,
            views: '15M',
            isPinned: true, 
            createdAt: serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Error seeding posts:", error);
      }
    };
    seedDatabase();
  }, []);

  // 3. FETCH & DISPLAY LOGIC
  useEffect(() => {
    const q = query(
      collection(db, "social_posts"), 
      orderBy("isPinned", "desc"),
      orderBy("createdAt", "desc") 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { 
              ...data, 
              id: doc.id,
              timestamp: 'الآن' 
          };
      });
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 4. HANDLE NEW USER POSTS
  const handlePost = async () => {
    if (!newPostText.trim()) return;

    try {
      const postUser = {
        name: currentUser?.displayName || "Anonymous User",
        handle: currentUser?.email ? `@${currentUser.email.split('@')[0]}` : "@user",
        avatar: currentUser?.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User",
        verified: false,
        isGold: false,
        uid: currentUser?.uid || "guest-id"
      };

      await addDoc(collection(db, "social_posts"), {
        content: newPostText,
        user: postUser,
        createdAt: serverTimestamp(),
        likes: 0,
        retweets: 0,
        replies: 0,
        views: '0',
        isPinned: false,
        type: 'text',
        images: []
      });

      setNewPostText("");
      if (showToast) showToast('تم النشر بنجاح', 'success');
    } catch (error: any) {
      console.error("Error posting:", error);
      if (showToast) showToast('فشل النشر', 'error');
    }
  };

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-0 bg-[var(--bg-primary)]">
      
      {/* 0. HEADER BRANDING (Mobile & Sticky) */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)] py-4 mb-2">
        <h1 className="text-center text-xl font-extrabold text-[var(--text-primary)] font-arabic tracking-wide">
          مجتمع ميلاف
        </h1>
      </div>

      {/* 1. COMPOSE AREA */}
      <div className="border-b border-[var(--border-color)] p-4 bg-[var(--bg-primary)]">
        <div className="flex gap-4">
          <img 
            src={currentUser?.photoURL || "https://i.ibb.co/QjNHDv3F/images-4.jpg"} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-xl placeholder-[var(--text-secondary)] text-[var(--text-primary)] border-none focus:ring-0 resize-none h-12"
              placeholder="ماذا يحدث؟"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3 border-t border-[var(--border-color)] pt-3">
              <div className="flex gap-4 text-[var(--accent-color)]">
                <Image className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content" />
                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content" />
                <Smile className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content" />
                <Calendar className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content" />
              </div>
              <button 
                onClick={handlePost}
                disabled={!newPostText.trim()}
                className="bg-[var(--accent-color)] hover:opacity-90 text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition-all"
              >
                نشر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEED LIST */}
      <div className="divide-y divide-[var(--border-color)]">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3].map((n) => (
            <div key={n} className="p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4"></div>
                  <div className="h-4 bg-[var(--bg-secondary)] rounded w-full"></div>
                  <div className="h-32 bg-[var(--bg-secondary)] rounded w-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => (
            <PostCard 
                key={post.id} 
                post={post} 
                onOpenLightbox={onOpenLightbox || (() => {})} 
                onShare={() => {}} 
            />
          ))
        )}
      </div>
    </div>
  );
};

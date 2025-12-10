
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
  getDoc,
  auth,
  db,
  onAuthStateChanged
} from '../../src/lib/firebase';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, Calendar, Loader2 } from 'lucide-react';

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
    // Correct modular usage
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. SELF-HEALING SEEDING LOGIC (Persistence Fix)
  useEffect(() => {
    const seedDatabase = async () => {
      try {
        const userUid = currentUser?.uid || "admin-murad-id";
        
        // --- Viral Post 1: YouTube Story (PINNED) ---
        const viralPostRef = doc(db, "posts", "viral-youtube-story");
        
        await setDoc(viralPostRef, {
            content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
            // Data Structure Adaptation for PostCard compatibility
            images: ['https://i.ibb.co/QjNHDv3F/images-4.jpg'],
            user: { 
                name: "Murad Aljohani", 
                handle: "@IpMurad", 
                avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg", 
                verified: true,
                isGold: true,
                uid: userUid 
            },
            likes: 50000,
            retweets: 5000000,
            replies: 12500,
            views: '15M',
            isPinned: true,
            type: 'image',
            createdAt: serverTimestamp()
        }, { merge: true });

        // --- Viral Post 2: Archive Memory (Fixed ID) ---
        const archivePostRef = doc(db, "posts", "viral-archive-memory");
        
        await setDoc(archivePostRef, {
            content: 'من الأرشيف.. الطموح لا يشيخ. 🦅\nكنت أعلم منذ تلك اللحظة أننا سنصل إلى هنا يوماً ما.\n\n#ذكريات #اصرار',
            images: ['https://i.ibb.co/Hfrm9Bd4/20190220-200812.jpg'],
            user: { 
                name: "Murad Aljohani", 
                handle: "@IpMurad", 
                avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg", 
                verified: true,
                isGold: true,
                uid: userUid
            },
            likes: 42000,
            retweets: 2000000,
            replies: 8000,
            views: '10M',
            isPinned: false,
            type: 'image',
            createdAt: serverTimestamp()
        }, { merge: true });

      } catch (error) {
        console.error("Error seeding posts:", error);
      }
    };

    // Run seed whenever user logs in or component mounts
    seedDatabase();
  }, [currentUser]);

  // 3. FETCH & DISPLAY LOGIC
  useEffect(() => {
    const q = query(
      collection(db, "posts"), 
      orderBy("isPinned", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Safe timestamp conversion
            timestamp: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('ar-SA') : 'الآن'
        };
      });
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
        console.error("Feed snapshot error:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 4. HANDLE NEW USER POSTS
  const handlePost = async () => {
    if (!newPostText.trim()) return;

    try {
      const postUser = {
        name: currentUser?.displayName || "Anonymous",
        handle: currentUser?.email ? `@${currentUser.email.split('@')[0]}` : "@guest",
        avatar: currentUser?.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User",
        verified: !!currentUser, 
        isGold: false,
        uid: currentUser?.uid || "guest"
      };

      await addDoc(collection(db, "posts"), {
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
      if(showToast) showToast('تم النشر', 'success');
    } catch (error: any) {
      if(showToast) showToast('فشل النشر: ' + error.message, 'error');
    }
  };

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-0 bg-[var(--bg-primary)]">
      
      {/* 0. HEADER BRANDING (Text Only) */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)] py-4 mb-2">
        <h1 className="text-center text-xl font-extrabold text-[var(--text-primary)] font-arabic tracking-wide">
          مراد سوشل ميديا <span className="text-[var(--accent-color)] mx-2">|</span> Murad Social
        </h1>
      </div>

      {/* 1. COMPOSE AREA */}
      <div className="border-b border-[var(--border-color)] p-4 bg-[var(--bg-primary)]">
        <div className="flex gap-4">
          <img 
            src={currentUser?.photoURL || "https://i.ibb.co/QjNHDv3F/images-4.jpg"} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)]"
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-lg placeholder-[var(--text-secondary)] text-[var(--text-primary)] border-none focus:ring-0 resize-none h-12"
              placeholder="What is happening?!"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3 border-t border-[var(--border-color)] pt-3">
              <div className="flex gap-4 text-[var(--accent-color)]">
                <Image className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
                <Smile className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
                <Calendar className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
              </div>
              <button 
                onClick={handlePost}
                disabled={!newPostText.trim()}
                className="bg-[var(--accent-color)] hover:opacity-90 text-white font-bold py-1.5 px-5 rounded-full disabled:opacity-50 transition-all shadow-md"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEED LIST */}
      <div className="divide-y divide-[var(--border-color)]">
        {loading ? (
          <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin" />
          </div>
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


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
import { Image, Send, Smile, BarChart2, Calendar } from 'lucide-react';

interface FeedProps {
    onOpenLightbox?: (src: string) => void; // Optional prop if passed from layout
    showToast?: (msg: string, type: 'success'|'error') => void; // Optional prop
    onBack?: () => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onBack }) => {
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
        // --- Viral Post 1: YouTube Story (PINNED) ---
        const viralPostRef = doc(db, "social_posts", "viral-welcome-post"); 
        // Note: We use social_posts collection based on previous context, ensuring consistency
        const viralSnap = await getDoc(viralPostRef);

        if (!viralSnap.exists()) {
          await setDoc(viralPostRef, {
            content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
            images: ['https://i.ibb.co/QjNHDv3F/images-4.jpg'], // Using images array for PostCard compatibility
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
          console.log("Recovered Viral Post 1");
        }

        // --- Viral Post 2: Archive Memory (Unpinned) ---
        const archivePostRef = doc(db, "social_posts", "archive-memory-post");
        const archiveSnap = await getDoc(archivePostRef);

        if (!archiveSnap.exists()) {
          await setDoc(archivePostRef, {
            content: 'من الأرشيف.. الطموح لا يشيخ. 🦅\nكنت أعلم منذ تلك اللحظة أننا سنصل إلى هنا يوماً ما.\n\n#ذكريات #اصرار',
            images: ['https://i.ibb.co/Hfrm9Bd4/20190220-200812.jpg'],
            user: {
              name: "Murad Aljohani",
              handle: "@IpMurad",
              avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
              verified: true,
              isGold: true,
              uid: "admin-murad-fixed-id"
            },
            type: 'image',
            likes: 42000, 
            retweets: 2000000, 
            replies: 8000,
            views: '10M',
            isPinned: false, 
            createdAt: serverTimestamp() // Will sort correctly
          });
          console.log("Recovered Archive Post 2");
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
          // Map Firestore timestamp to readable string or keep object
          // PostCard expects a string timestamp usually, but we handle it here roughly
          return { 
              ...data, 
              id: doc.id,
              timestamp: 'الآن' // Simplified for dynamic feed
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
    <div className="flex-1 min-h-screen pb-20 md:pb-0">
      {/* 0. NEW HEADER (Requested Design) */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-4 mb-4">
        <h1 className="text-center text-xl font-bold text-gray-900 dark:text-white font-arabic tracking-wide">
          مراد سوشل ميديا <span className="text-blue-500 mx-2">|</span> Murad Social
        </h1>
      </div>

      {/* 1. COMPOSE AREA */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-black">
        <div className="flex gap-4">
          <img 
            src={currentUser?.photoURL || "https://i.ibb.co/QjNHDv3F/images-4.jpg"} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-xl placeholder-gray-500 text-black dark:text-white border-none focus:ring-0 resize-none h-12"
              placeholder="What is happening?!"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-4 text-blue-400">
                <Image className="w-5 h-5 cursor-pointer hover:bg-blue-500/10 rounded-full p-1 box-content" />
                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-blue-500/10 rounded-full p-1 box-content" />
                <Smile className="w-5 h-5 cursor-pointer hover:bg-blue-500/10 rounded-full p-1 box-content" />
                <Calendar className="w-5 h-5 cursor-pointer hover:bg-blue-500/10 rounded-full p-1 box-content" />
              </div>
              <button 
                onClick={handlePost}
                disabled={!newPostText.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEED LIST */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3].map((n) => (
            <div key={n} className="p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
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

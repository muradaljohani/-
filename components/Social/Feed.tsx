
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where, 
  limit,
  db,
  doc,
  setDoc,
  getDoc,
  deleteDoc
} from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, MapPin, Loader2, X, Wand2, Feather, WifiOff, AlertTriangle } from 'lucide-react';
import { uploadImage } from '../../src/services/storageService';
import { StoriesBar } from '../Stories/StoriesBar';
import { getGeminiResponse } from '../../services/geminiService';
import { isContentSafe } from '../../utils/contentSafety';

// --- MURAD AI PROFILE CONSTANT ---
const MURAD_AI_PROFILE_DATA = {
    id: "murad-ai-bot-id",
    name: "Murad AI",
    username: "MURAD",
    handle: "@MURAD",
    email: "ai@murad-group.com",
    avatar: "https://ui-avatars.com/api/?name=Murad+AI&background=000000&color=ffffff&size=512&bold=true&length=1&font-size=0.6", 
    verified: true,
    isGold: true,
    role: 'bot'
};

interface FeedProps {
    onOpenLightbox?: (src: string) => void;
    showToast?: (msg: string, type: 'success'|'error') => void;
    onBack?: () => void;
    onPostClick?: (postId: string) => void;
    onUserClick?: (userId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onPostClick, onUserClick }) => {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SAFETY CHECK HANDLER ---
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setNewPostText(text);
      if (text.trim()) {
          const check = isContentSafe(text);
          setSafetyWarning(check.isSafe ? null : (check.reason || 'المحتوى غير آمن'));
      } else {
          setSafetyWarning(null);
      }
  };

  // --- SEEDING LOGIC (Simplified for performance) ---
  useEffect(() => {
    const forceSeedPosts = async () => {
        if (!db || !user) return; 
        try {
            // Ensure AI Bot Exists
            const aiRef = doc(db, "users", "murad-ai-bot-id");
            const aiSnap = await getDoc(aiRef);
            if (!aiSnap.exists()) {
                await setDoc(aiRef, MURAD_AI_PROFILE_DATA, { merge: true }).catch(()=>{});
            }
        } catch (e) {
            // Ignore
        }
    };
    forceSeedPosts();
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    if (!db) {
        if (isMounted) setLoading(false);
        return;
    }

    try {
        const postsRef = collection(db, "posts");
        let q = activeTab === 'foryou' 
            ? query(postsRef, limit(50)) 
            : (user ? query(postsRef, where("user.uid", "==", user.id), limit(20)) : null);

        if (!q) {
            setPosts([]);
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!isMounted) return;
          const livePosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          // Sort: Pinned first, then Newest
          livePosts.sort((a: any, b: any) => {
              if (activeTab === 'foryou') {
                  const pinA = a.isPinned ? 1 : 0;
                  const pinB = b.isPinned ? 1 : 0;
                  if (pinA !== pinB) return pinB - pinA;
              }
              const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
              const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
              return tB - tA;
          });

          setPosts(livePosts);
          setLoading(false);
        }, (err) => {
            console.warn("Feed Error:", err);
            setLoading(false);
        });

        return () => { isMounted = false; unsubscribe(); };
    } catch (err) {
        if (isMounted) setLoading(false);
    }
  }, [activeTab, user]);

  // --- BOT REPLY HANDLER (FIRE & FORGET) ---
  const handleBotTrigger = (postId: string, content: string, userName: string) => {
      // Run as non-blocking async
      (async () => {
          try {
              const aiResponse = await getGeminiResponse(
                  `SYSTEM: You are "Murad AI", the intelligent assistant of the Milaf platform. 
                   A user named "${userName}" tagged you (@MURAD).
                   User Post: "${content}".
                   
                   Task: Reply immediately, briefly, and helpfully in Arabic.
                   Context: Be witty, professional, and concise.`,
                  'expert',
                  userName
              );

              const repliesRef = collection(db, 'posts', postId, 'replies');
              await addDoc(repliesRef, {
                  text: aiResponse,
                  user: {
                      name: MURAD_AI_PROFILE_DATA.name,
                      handle: MURAD_AI_PROFILE_DATA.handle,
                      avatar: MURAD_AI_PROFILE_DATA.avatar,
                      verified: true,
                      isGold: true,
                      uid: MURAD_AI_PROFILE_DATA.id
                  },
                  timestamp: serverTimestamp(),
                  likes: 0,
                  isBotReply: true // Flag for UI
              });
          } catch (e) {
              console.error("Bot failed:", e);
          }
      })();
  };

  const handlePost = async () => {
    if (!user) return alert("يرجى تسجيل الدخول");
    if (!newPostText.trim() && !selectedFile) return;
    if (safetyWarning) return;

    setIsUploading(true);

    try {
      let imageUrls: string[] = [];
      if (selectedFile) {
         const path = `posts/${user.id}/${Date.now()}_${selectedFile.name}`;
         const url = await uploadImage(selectedFile, path);
         imageUrls.push(url);
      }

      const postsRef = collection(db, 'posts');
      const docRef = await addDoc(postsRef, {
          user: {
              name: user.name || "User",
              handle: isAdmin || user.username === 'IpMurad' ? '@IpMurad' : (user.username ? `@${user.username}` : `@${String(user.id).slice(0,8)}`),
              avatar: user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User",
              verified: isAdmin ? true : (user.isIdentityVerified || false),
              isGold: isAdmin ? true : (user.primeSubscription?.status === 'active'),
              uid: user.id
          },
          content: newPostText,
          type: imageUrls.length > 0 ? 'image' : 'text',
          images: imageUrls,
          image: imageUrls[0] || null, 
          createdAt: serverTimestamp(),
          likes: 0,
          retweets: 0,
          replies: 0,
          views: '0',
          isPinned: false
      });

      // --- INSTANT BOT TRIGGER ---
      // Trigger if text contains @murad (case insensitive)
      if (/@murad/i.test(newPostText)) {
          handleBotTrigger(docRef.id, newPostText, user.name);
      }

      setNewPostText("");
      removeImage();
      if(showToast) showToast('تم النشر!', 'success');

    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIEnhance = () => {
    if (!newPostText.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      setNewPostText(prev => prev + "\n\n#مجتمع_ميلاف ✨");
      setIsEnhancing(false);
    }, 800);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full h-full bg-white dark:bg-black font-sans" dir="rtl">
      
      {/* Header Tabs */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-[#2f3336]">
        <div className="pt-3 pb-2 px-4 md:hidden">
          <h1 className="text-center text-lg font-bold text-black dark:text-white tracking-wide">
            مجتمع ميلاف
          </h1>
        </div>
        <div className="flex justify-around mt-2">
          <button onClick={() => setActiveTab('foryou')} className={`flex-1 text-center py-3 font-bold text-sm relative ${activeTab === 'foryou' ? 'text-black dark:text-white' : 'text-gray-500'}`}>
            لك
            {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
          </button>
          <button onClick={() => setActiveTab('following')} className={`flex-1 text-center py-3 font-bold text-sm relative ${activeTab === 'following' ? 'text-black dark:text-white' : 'text-gray-500'}`}>
            منشوراتي
            {activeTab === 'following' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#1d9bf0] rounded-full"></div>}
          </button>
        </div>
      </div>

      <div className="border-b border-gray-100 dark:border-[#2f3336]">
          <StoriesBar />
      </div>

      {/* Compose Box */}
      <div className="hidden md:block border-b border-gray-100 dark:border-[#2f3336] p-4 bg-white dark:bg-black">
        <div className="flex gap-4">
          <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <textarea
              className={`w-full bg-transparent text-lg placeholder-gray-500 dark:placeholder-[#71767b] text-black dark:text-[#e7e9ea] border-none focus:ring-0 resize-none min-h-[50px] outline-none ${safetyWarning ? 'border-b-2 border-red-500' : ''}`}
              placeholder="ماذا يحدث؟ (أشر لـ @MURAD للذكاء الاصطناعي)"
              value={newPostText}
              onChange={handleTextChange}
            />
            {safetyWarning && <div className="text-red-500 text-xs font-bold mt-1">{safetyWarning}</div>}
            {previewUrl && (
              <div className="relative mt-2 mb-2">
                <img src={previewUrl} className="rounded-xl w-auto max-h-[300px] object-cover border border-gray-200 dark:border-[#2f3336]" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"><X className="w-4 h-4"/></button>
              </div>
            )}
            <div className="flex justify-between items-center mt-2 border-t border-gray-100 dark:border-[#2f3336] pt-3">
              <div className="flex gap-2 text-[#1d9bf0]">
                <label className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full"><input type="file" hidden accept="image/*" onChange={handleFileSelect} ref={fileInputRef} /><Image className="w-5 h-5" /></label>
                <div onClick={handleAIEnhance} className={`cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full ${isEnhancing ? 'animate-pulse text-purple-500' : ''}`}><Wand2 className="w-5 h-5" /></div>
                <div className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full opacity-50"><BarChart2 className="w-5 h-5" /></div>
                <div className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full opacity-50"><MapPin className="w-5 h-5" /></div>
              </div>
              <button onClick={handlePost} disabled={(!newPostText.trim() && !selectedFile) || isUploading || !!safetyWarning} className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-1.5 px-5 rounded-full disabled:opacity-50 transition-all text-sm flex items-center gap-2">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'نشر'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen">
        {loading ? (
          <div className="p-8 text-center text-[#71767b] flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1d9bf0]"/> جارِ التحميل...
          </div>
        ) : posts.length === 0 ? (
             <div className="p-12 text-center text-[#71767b]">لا توجد منشورات</div>
        ) : (
          posts.map((post) => (
            <PostCard 
                key={post.id} 
                post={post} 
                onOpenLightbox={onOpenLightbox}
                onClick={() => onPostClick && onPostClick(post.id)}
                onUserClick={onUserClick}
            />
          ))
        )}
        <div className="h-40"></div>
      </div>
    </div>
  );
};

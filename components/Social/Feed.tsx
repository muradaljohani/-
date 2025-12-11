
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where,
  limit,
  db
} from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, MapPin, Loader2, X, Wand2, Feather } from 'lucide-react';
import { uploadImage } from '../../src/services/storageService';
import { StoriesBar } from '../Stories/StoriesBar';

interface FeedProps {
    onOpenLightbox?: (src: string) => void;
    showToast?: (msg: string, type: 'success'|'error') => void;
    onBack?: () => void;
    onPostClick?: (postId: string) => void;
    onUserClick?: (userId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onPostClick, onUserClick }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Posts Logic (Client-Side Sort to avoid Index Errors)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    let q;
    const postsRef = collection(db, "posts");

    try {
        if (activeTab === 'foryou') {
            // Fetch recent 100 posts unordered, then sort in memory
            q = query(postsRef, limit(100));
        } else {
            if (user) {
                // Fetch filtered posts, sort in memory
                q = query(
                  postsRef,
                  where("user.uid", "==", user.id),
                  limit(50)
                );
            } else {
                setPosts([]);
                setLoading(false);
                return;
            }
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!isMounted) return;
          
          try {
              const livePosts = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data()
              }));

              // Robust Client-Side Sorting
              livePosts.sort((a: any, b: any) => {
                  // 1. Pinned First (Only for For You tab)
                  if (activeTab === 'foryou') {
                      const pinA = a.isPinned ? 1 : 0;
                      const pinB = b.isPinned ? 1 : 0;
                      if (pinA !== pinB) return pinB - pinA;
                  }
                  
                  // 2. Date Descending
                  const getTime = (p: any) => {
                      const val = p.createdAt || p.timestamp;
                      if (!val) return 0;
                      // Handle Firestore Timestamp
                      if (val.toMillis && typeof val.toMillis === 'function') return val.toMillis();
                      // Handle JS Date
                      if (val instanceof Date) return val.getTime();
                      // Handle ISO String
                      if (typeof val === 'string') return new Date(val).getTime();
                      return 0; 
                  };
                  
                  return getTime(b) - getTime(a);
              });

              setPosts(livePosts);
          } catch (mapError) {
              console.error("Data Mapping Error:", mapError);
          } finally {
              if (isMounted) setLoading(false);
          }
        }, (err) => {
            console.error("Firestore Feed Error:", err);
            if (isMounted) {
               // Handle permission errors silently or show a gentle message
               if (err.code !== 'permission-denied') {
                  setError("حدث خطأ أثناء تحميل المنشورات.");
               }
               setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    } catch (err) {
        console.error("Setup Feed Error:", err);
        if (isMounted) setLoading(false);
    }
  }, [activeTab, user]);

  const handlePost = async () => {
    if (!user) {
        alert("يرجى تسجيل الدخول للنشر");
        return;
    }
    if (!newPostText.trim() && !selectedFile) return;
    setIsUploading(true);

    try {
      let imageUrls: string[] = [];
      if (selectedFile) {
         const path = `posts/${user.id}/${Date.now()}_${selectedFile.name}`;
         const url = await uploadImage(selectedFile, path);
         imageUrls.push(url);
      }

      const postsRef = collection(db, 'posts');
      
      const userData = {
          name: user.name || "User",
          handle: user.username ? `@${user.username}` : (user.email ? `@${user.email.split('@')[0]}` : `@${user.id.slice(0,8)}`),
          avatar: user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User",
          verified: user.isIdentityVerified || false,
          isGold: user.primeSubscription?.status === 'active',
          uid: user.id
      };

      await addDoc(postsRef, {
          user: userData,
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

      setNewPostText("");
      removeImage();
      
      if(showToast) showToast('تم إرسال المنشور!', 'success');

    } catch (error) {
      console.error("Error posting:", error);
      if(showToast) showToast('حدث خطأ أثناء النشر', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIEnhance = () => {
    if (!newPostText.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      let enhancedText = newPostText;
      const lower = enhancedText.toLowerCase();
      if (lower.includes('code') || lower.includes('dev') || lower.includes('برمجة')) {
        enhancedText += "\n\n#Tech #Coding #برمجة";
      } else {
         enhancedText += "\n\n#مجتمع_ميلاف #السعودية";
      }
      setNewPostText(enhancedText);
      setIsEnhancing(false);
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        if (showToast) showToast('يرجى اختيار ملف صورة صحيح', 'error');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 min-h-screen bg-black text-[#e7e9ea] pb-20 md:pb-0 font-sans" dir="rtl">
      
      {/* Header & Tabs */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
        <div className="pt-3 pb-2 px-4 md:hidden">
          <h1 className="text-center text-lg font-bold text-white tracking-wide">
            مراد سوشل <span className="text-[#1d9bf0]">|</span> Murad Social
          </h1>
        </div>
        <div className="flex justify-around mt-2">
          <button 
            onClick={() => setActiveTab('foryou')}
            className={`flex-1 text-center py-3 font-bold text-sm transition-all relative ${
              activeTab === 'foryou' ? 'text-white' : 'text-[#71767b] hover:bg-white/5'
            }`}
          >
            لك
            {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className={`flex-1 text-center py-3 font-bold text-sm transition-all relative ${
              activeTab === 'following' ? 'text-white' : 'text-[#71767b] hover:bg-white/5'
            }`}
          >
            منشوراتي
            {activeTab === 'following' && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#1d9bf0] rounded-full"></div>}
          </button>
        </div>
      </div>

      {/* Stories Rail */}
      <div className="border-b border-[#2f3336]">
          <StoriesBar />
      </div>

      {/* Composer (Desktop) */}
      <div className="hidden md:block border-b border-[#2f3336] p-4 bg-black">
        <div className="flex gap-4">
          <img 
            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
            className="w-10 h-10 rounded-full object-cover" 
            alt="me"
          />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-lg placeholder-[#71767b] text-[#e7e9ea] border-none focus:ring-0 resize-none min-h-[50px] outline-none"
              placeholder="ماذا يحدث؟"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            {previewUrl && (
              <div className="relative mt-2 mb-2">
                <img src={previewUrl} className="rounded-xl w-auto max-h-[300px] object-cover border border-[#2f3336]" alt="preview" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-gray-800">
                    <X className="w-4 h-4"/>
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mt-2 border-t border-[#2f3336] pt-3">
              <div className="flex gap-2 text-[#1d9bf0]">
                <label className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full transition">
                  <input type="file" hidden accept="image/*" onChange={handleFileSelect} ref={fileInputRef} />
                  <Image className="w-5 h-5" />
                </label>
                <div onClick={handleAIEnhance} className={`cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full transition ${isEnhancing ? 'animate-pulse text-purple-500' : ''}`}>
                    <Wand2 className="w-5 h-5" />
                </div>
                <div className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full transition opacity-50"><BarChart2 className="w-5 h-5" /></div>
                <div className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full transition opacity-50"><Smile className="w-5 h-5" /></div>
                <div className="cursor-pointer hover:bg-[#1d9bf0]/10 p-2 rounded-full transition opacity-50"><MapPin className="w-5 h-5" /></div>
              </div>
              <button 
                onClick={handlePost}
                disabled={(!newPostText.trim() && !selectedFile) || isUploading}
                className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-1.5 px-5 rounded-full disabled:opacity-50 transition-all text-sm flex items-center gap-2"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin"/>}
                نشر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="w-full">
        {loading ? (
          <div className="p-8 text-center text-[#71767b] animate-pulse flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1d9bf0]"/>
              جاري الاتصال بالمجتمع...
          </div>
        ) : error ? (
            <div className="p-12 text-center text-red-400">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-blue-400 text-sm hover:underline">إعادة المحاولة</button>
            </div>
        ) : posts.length === 0 ? (
             <div className="p-12 text-center text-[#71767b]">
                 <div className="w-16 h-16 bg-[#16181c] rounded-full flex items-center justify-center mx-auto mb-4">
                     <Feather className="w-8 h-8 text-gray-500"/>
                 </div>
                 <p className="font-bold mb-1">لا توجد منشورات</p>
                 <p className="text-sm">كن أول من يشارك في هذا القسم!</p>
             </div>
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

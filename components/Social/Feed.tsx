
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  auth,
  db,
  onAuthStateChanged
} from '../../src/lib/firebase';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, Calendar, Loader2, Wand2, Eye, EyeOff, X } from 'lucide-react';
import { uploadImage } from '../../src/services/storageService';
import { useAuth } from '../../context/AuthContext';

interface FeedProps {
    onOpenLightbox?: (src: string) => void;
    showToast?: (msg: string, type: 'success'|'error') => void;
    onBack?: () => void;
    onPostClick?: (postId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onPostClick }) => {
  const { user } = useAuth(); // Use Global Auth Context
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Tabs State
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  
  // Media State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Smart Features State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // --- REAL-TIME FEED LISTENER ---
  useEffect(() => {
    if (!db) return;

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

  // --- AI WRITING ASSISTANT ---
  const handleAIEnhance = () => {
    if (!newPostText.trim()) {
      alert("Write something first!");
      return;
    }
    setIsEnhancing(true);
    setTimeout(() => {
      let enhancedText = newPostText;
      const lower = enhancedText.toLowerCase();
      if (lower.includes('code') || lower.includes('dev')) {
        enhancedText += "\n\n#Tech #Coding #Developer";
      } else {
         enhancedText += "\n\n#Community #MuradSocial";
      }
      enhancedText += " ✨";
      setNewPostText(enhancedText);
      setIsEnhancing(false);
    }, 1500);
  };

  // --- MEDIA HANDLERS ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate Image
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

  // --- POST SUBMISSION ---
  const handlePost = async () => {
    if ((!newPostText.trim() && !selectedFile) || !user) return;
    if (!db) return;

    try {
      setIsUploading(true);
      let imageUrls: string[] = [];

      // 1. Upload Native Image
      if (selectedFile) {
         const path = `posts/${user.id}/${Date.now()}_${selectedFile.name}`;
         const url = await uploadImage(selectedFile, path);
         imageUrls.push(url);
      }

      // 2. Save Post Data
      const postData = {
        content: newPostText,
        user: {
            name: user.name,
            handle: user.username ? `@${user.username}` : `@${user.id.slice(0,8)}`,
            avatar: user.avatar,
            verified: user.isIdentityVerified,
            isGold: user.primeSubscription?.status === 'active',
            uid: user.id
        },
        createdAt: serverTimestamp(),
        likes: 0,
        retweets: 0,
        replies: 0,
        views: '0',
        isPinned: false,
        type: imageUrls.length > 0 ? 'image' : 'text',
        images: imageUrls
      };

      await addDoc(collection(db, "posts"), postData);

      // 3. Cleanup
      setNewPostText("");
      removeImage();
      setIsUploading(false);
      
      if(showToast) showToast('تم النشر بنجاح!', 'success');

    } catch (error: any) {
      console.error("Error posting:", error);
      setIsUploading(false);
      if(showToast) showToast('فشل النشر: ' + error.message, 'error');
    }
  };

  // --- FILTER LOGIC ---
  const displayedPosts = activeTab === 'foryou' 
    ? posts 
    : posts.filter(p => user?.following?.includes(p.user.uid));

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-0 bg-[var(--bg-primary)]">
      
      {/* 1. Sticky Header */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
        
        {/* Brand & Focus Toggle */}
        <div className="flex justify-between items-center py-3 px-4">
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] font-arabic tracking-wide hidden md:block">
            الرئيسية
          </h1>
          <div className="md:hidden font-black text-lg">M</div>
          
          <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isFocusMode 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
            }`}
          >
            {isFocusMode ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
            <span className="hidden sm:inline">{isFocusMode ? 'Focus ON' : 'Focus OFF'}</span>
          </button>
        </div>

        {/* 2. Timeline Tabs */}
        <div className="flex w-full relative">
            <button 
                onClick={() => setActiveTab('foryou')}
                className={`flex-1 py-3 text-sm font-bold transition-colors hover:bg-[var(--bg-secondary)] ${activeTab === 'foryou' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
                لك (For You)
                {activeTab === 'foryou' && <div className="absolute bottom-0 left-[0%] w-1/2 h-1 bg-[var(--accent-color)] rounded-full transition-all duration-300"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-3 text-sm font-bold transition-colors hover:bg-[var(--bg-secondary)] ${activeTab === 'following' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
            >
                متابعة (Following)
                {activeTab === 'following' && <div className="absolute bottom-0 left-[50%] w-1/2 h-1 bg-[var(--accent-color)] rounded-full transition-all duration-300"></div>}
            </button>
        </div>
      </div>

      {/* 3. Compose Area (Only if logged in) */}
      {user && (
      <div className="border-b border-[var(--border-color)] p-4 bg-[var(--bg-primary)] hidden md:block">
        <div className="flex gap-4">
          <img 
            src={user.avatar} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)] shrink-0"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                className="w-full bg-transparent text-lg placeholder-[var(--text-secondary)] text-[var(--text-primary)] border-none focus:ring-0 resize-none h-16 disabled:opacity-50"
                placeholder={isEnhancing ? "جاري التحسين بالذكاء الاصطناعي..." : "ماذا يحدث؟"}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                disabled={isEnhancing || isUploading}
              />
              {isEnhancing && (
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                   <Loader2 className="w-5 h-5 text-purple-500 animate-spin"/>
                </div>
              )}
            </div>

            {/* Media Preview */}
            {previewUrl && (
              <div className="relative mt-2 mb-4 w-fit group">
                <img src={previewUrl} alt="Preview" className="rounded-xl max-h-64 object-cover border border-[var(--border-color)] shadow-md"/>
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4"/>
                </button>
                {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                        <Loader2 className="w-8 h-8 text-white animate-spin"/>
                    </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-2 border-t border-[var(--border-color)] pt-3">
              <div className="flex gap-2 text-[var(--accent-color)] items-center">
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-[var(--accent-color)]/10 rounded-full transition-colors"
                    title="Add Image"
                >
                    <Image className="w-5 h-5" />
                </button>
                
                {/* AI Assistant */}
                <button 
                  onClick={handleAIEnhance}
                  disabled={isEnhancing || !newPostText.trim()}
                  className="p-2 hover:bg-purple-500/10 rounded-full transition-colors disabled:opacity-30 group"
                  title="AI Enhance"
                >
                  <Wand2 className={`w-5 h-5 text-purple-500 ${isEnhancing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                </button>

                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-2 box-content transition-colors" />
                <Smile className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-2 box-content transition-colors" />
              </div>
              
              <button 
                onClick={handlePost}
                disabled={(!newPostText.trim() && !selectedFile) || isEnhancing || isUploading}
                className="bg-[var(--accent-color)] hover:opacity-90 text-white font-bold py-1.5 px-6 rounded-full disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'نشر'}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 4. Feed List */}
      <div className="divide-y divide-[var(--border-color)]">
        {loading ? (
          <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin" />
          </div>
        ) : displayedPosts.length === 0 ? (
            <div className="py-20 text-center text-[var(--text-secondary)]">
                {activeTab === 'following' 
                    ? 'أنت لا تتابع أحداً بعد. استكشف المنصة وتابع المبدعين!' 
                    : 'لا توجد منشورات حالياً.'}
            </div>
        ) : (
          displayedPosts.map((post) => (
            <PostCard 
                key={post.id} 
                post={post} 
                onOpenLightbox={onOpenLightbox || (() => {})} 
                onShare={() => {}} 
                onClick={() => onPostClick?.(post.id)}
                isFocusMode={isFocusMode}
            />
          ))
        )}
      </div>
    </div>
  );
};

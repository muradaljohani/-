
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  setDoc, 
  doc, 
  auth,
  db,
  onAuthStateChanged
} from '../../src/lib/firebase';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, Calendar, Loader2, Wand2, Eye, EyeOff, X } from 'lucide-react';
import { uploadImage } from '../../src/services/storageService';

interface FeedProps {
    onOpenLightbox?: (src: string) => void;
    showToast?: (msg: string, type: 'success'|'error') => void;
    onBack?: () => void;
    onPostClick?: (postId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onPostClick }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Media State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Smart Features State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const seedDatabase = async () => {
      if (!db) return;

      try {
        const userUid = currentUser?.uid || "admin-murad-id";
        
        const viralPostRef = doc(db, "posts", "viral-youtube-story");
        // Only seed if not exists logic would be better, but setDoc with merge is safe enough for demo
        await setDoc(viralPostRef, {
            content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
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

      } catch (error) {
        console.error("Error seeding posts:", error);
      }
    };
    // seedDatabase(); // Call sparingly
  }, [currentUser]);

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

  // --- SMART FEATURE 1: AI WRITING ASSISTANT ---
  const handleAIEnhance = () => {
    if (!newPostText.trim()) {
      alert("Write something first!");
      return;
    }

    setIsEnhancing(true);

    // Simulate AI Latency
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

  const handlePost = async () => {
    if (!newPostText.trim() && !selectedFile) return;
    if (!db) return;

    try {
      setIsUploading(true);
      let imageUrls: string[] = [];

      // 1. Upload Image if selected
      if (selectedFile) {
         const path = `posts/${currentUser?.uid}/${Date.now()}_${selectedFile.name}`;
         const url = await uploadImage(selectedFile, path);
         imageUrls.push(url);
      }

      // 2. Create Post
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
        type: imageUrls.length > 0 ? 'image' : 'text',
        images: imageUrls
      });

      // 3. Reset UI
      setNewPostText("");
      removeImage();
      setIsUploading(false);
      
      if(showToast) showToast('تم النشر بنجاح', 'success');

    } catch (error: any) {
      console.error("Error posting:", error);
      setIsUploading(false);
      if(showToast) showToast('فشل النشر: ' + error.message, 'error');
    }
  };

  return (
    <div className="flex-1 min-h-screen pb-20 md:pb-0 bg-[var(--bg-primary)]">
      
      {/* Header with Focus Mode Toggle */}
      <div className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)] py-3 px-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-[var(--text-primary)] font-arabic tracking-wide">
          مراد سوشل ميديا <span className="text-[var(--accent-color)] mx-1">|</span> Murad Social
        </h1>
        
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

      {/* Compose Area */}
      <div className="border-b border-[var(--border-color)] p-4 bg-[var(--bg-primary)]">
        <div className="flex gap-4">
          <img 
            src={currentUser?.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)]"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                className="w-full bg-transparent text-lg placeholder-[var(--text-secondary)] text-[var(--text-primary)] border-none focus:ring-0 resize-none h-12 disabled:opacity-50"
                placeholder={isEnhancing ? "Enhancing..." : "ماذا يحدث ؟"}
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

            {/* Image Preview Area */}
            {previewUrl && (
              <div className="relative mt-2 mb-2 w-fit">
                <img src={previewUrl} alt="Preview" className="rounded-xl max-h-64 object-cover border border-[var(--border-color)]"/>
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4"/>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-3 border-t border-[var(--border-color)] pt-3">
              <div className="flex gap-2 text-[var(--accent-color)] items-center">
                
                {/* File Input (Hidden) */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />

                <Image 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" 
                />
                
                {/* AI Assistant Button */}
                <button 
                  onClick={handleAIEnhance}
                  disabled={isEnhancing || !newPostText.trim()}
                  className="group relative p-1 rounded-full hover:bg-purple-500/10 transition-colors disabled:opacity-30"
                  title="AI Enhance"
                >
                  <Wand2 className={`w-5 h-5 text-purple-500 ${isEnhancing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                </button>

                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
                <Smile className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
                <Calendar className="w-5 h-5 cursor-pointer hover:bg-[var(--accent-color)]/10 rounded-full p-1 box-content transition-colors" />
              </div>
              <button 
                onClick={handlePost}
                disabled={(!newPostText.trim() && !selectedFile) || isEnhancing || isUploading}
                className="bg-[var(--accent-color)] hover:opacity-90 text-white font-bold py-1.5 px-5 rounded-full disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin"/>}
                <span>نشر</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed List */}
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
                onClick={() => onPostClick?.(post.id)}
                isFocusMode={isFocusMode}
            />
          ))
        )}
      </div>
    </div>
  );
};

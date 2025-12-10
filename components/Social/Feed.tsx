
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where,
  auth,
  db
} from '../../src/lib/firebase';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, Loader2, Wand2, Eye, EyeOff, X } from 'lucide-react';
import { uploadImage } from '../../src/services/storageService';
import { useAuth } from '../../context/AuthContext';
import { SocialService } from '../../services/SocialService';

interface FeedProps {
    onOpenLightbox?: (src: string) => void;
    showToast?: (msg: string, type: 'success'|'error') => void;
    onBack?: () => void;
    onPostClick?: (postId: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onOpenLightbox, showToast, onPostClick }) => {
  const { user } = useAuth();
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

  // --- INITIALIZATION & REAL-TIME FEED LISTENER ---
  useEffect(() => {
    if (!db) return;

    const initFeed = async () => {
        // 1. Ensure Viral Content Exists
        await SocialService.checkAndSeed();

        // 2. Setup Real-time Listener based on Tab
        let q;

        if (activeTab === 'foryou') {
            q = query(
              collection(db, "posts"), 
              orderBy("isPinned", "desc"), // Pinned first
              orderBy("createdAt", "desc") // Then newest
            );
        } else {
            // 'following' tab implementation - Currently filters by MY posts as per snippet logic request
            // In a full implementation, this would query posts where user.uid IN user.following
            if (user) {
                q = query(
                  collection(db, "posts"),
                  where("user.uid", "==", user.id),
                  orderBy("createdAt", "desc")
                );
            } else {
                setPosts([]);
                setLoading(false);
                return;
            }
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedPosts = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert timestamp dynamically for display
                timestamp: SocialService.formatDate(data.createdAt)
            };
          });
          setPosts(fetchedPosts);
          setLoading(false);
        }, (error) => {
          console.error("Feed snapshot error:", error);
          setLoading(false);
        });

        return () => unsubscribe();
    };

    const unsubscribePromise = initFeed();
    return () => { unsubscribePromise.then(unsub => unsub && unsub()); };

  }, [activeTab, user]); // Re-run when tab or user changes

  // --- AI WRITING ASSISTANT ---
  const handleAIEnhance = () => {
    if (!newPostText.trim()) {
      if(showToast) showToast("اكتب شيئاً أولاً ليتم تحسينه", 'error');
      return;
    }
    setIsEnhancing(true);
    setTimeout(() => {
      let enhancedText = newPostText;
      const lower = enhancedText.toLowerCase();
      if (lower.includes('code') || lower.includes('dev') || lower.includes('برمجة')) {
        enhancedText += "\n\n#Tech #Coding #برمجة";
      } else {
         enhancedText += "\n\n#مجتمع_ميلاف #السعودية";
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
    
    try {
      setIsUploading(true);
      let imageUrls: string[] = [];

      // 1. Upload Native Image
      if (selectedFile) {
         const path = `posts/${user.id}/${Date.now()}_${selectedFile.name}`;
         const url = await uploadImage(selectedFile, path);
         imageUrls.push(url);
      }

      // 2. Save Post Data via Service (Centralized logic)
      // Note: SocialService.createPost expects content and type, not full object. 
      // We'll adapt it or update service. Service logic handles object creation.
      
      // Update: Passing full logic as needed by Service signature, assuming update.
      // Actually SocialService.createPost takes (user, content, type). 
      // We should pass image separately or update service.
      // For now, let's just use the direct service call and handle images there if supported, 
      // OR we just manually add the doc here like before if service doesn't support images yet.
      // Looking at updated service, it just takes type/content.
      // Let's do it manually here to ensure images are saved correctly.
      
      const postsRef = collection(db, 'posts');
      const userData = {
          name: user.name,
          handle: user.username ? `@${user.username}` : `@${user.id.substr(0,8)}`,
          avatar: user.avatar,
          verified: user.isIdentityVerified || false,
          isGold: user.primeSubscription?.status === 'active',
          uid: user.id
      };

      await addDoc(postsRef, {
          user: userData,
          content: newPostText,
          type: imageUrls.length > 0 ? 'image' : 'text',
          images: imageUrls,
          image: imageUrls[0] || null, // Fallback for single image legacy
          createdAt: serverTimestamp(),
          likes: 0,
          retweets: 0,
          replies: 0,
          views: '0',
          isPinned: false
      });

      setNewPostText("");
      removeImage();
      if(showToast) showToast('تم النشر بنجاح!', 'success');

    } catch (error) {
      console.error("Error posting:", error);
      if(showToast) showToast('حدث خطأ غير متوقع', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-transparent`}>
        
        {/* --- HEADER --- */}
        <div className="sticky top-0 z-30 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-gray-100 dark:border-[#2f3336]">
            <div className="flex justify-around items-center h-[53px]">
                <div 
                    className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors relative ${activeTab === 'foryou' ? 'font-bold' : 'font-medium text-gray-500 dark:text-[#71767b]'}`}
                    onClick={() => setActiveTab('foryou')}
                >
                    لك
                    {activeTab === 'foryou' && <div className="absolute bottom-0 w-14 h-1 bg-[var(--accent-color)] rounded-full"></div>}
                </div>
                <div 
                    className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors relative ${activeTab === 'following' ? 'font-bold' : 'font-medium text-gray-500 dark:text-[#71767b]'}`}
                    onClick={() => setActiveTab('following')}
                >
                    منشوراتي
                    {activeTab === 'following' && <div className="absolute bottom-0 w-16 h-1 bg-[var(--accent-color)] rounded-full"></div>}
                </div>
                <div 
                    className="w-[53px] h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors"
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    title="Focus Mode"
                >
                    {isFocusMode ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </div>
            </div>
        </div>

        {/* --- COMPOSE AREA --- */}
        {user && !isFocusMode && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2f3336] bg-transparent hidden md:block">
            <div className="flex gap-4">
                <img 
                    src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt="User"
                />
                <div className="flex-1">
                    <textarea 
                        className="w-full bg-transparent text-lg text-black dark:text-[#e7e9ea] placeholder-gray-500 dark:placeholder-[#71767b] outline-none resize-none min-h-[50px]"
                        placeholder="ماذا يحدث؟"
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                    />
                    
                    {previewUrl && (
                        <div className="relative mt-2 mb-4">
                            <img src={previewUrl} className="rounded-2xl max-h-80 w-auto object-cover border border-gray-200 dark:border-[#2f3336]" />
                            <button 
                                onClick={removeImage}
                                className="absolute top-2 left-2 bg-black/70 hover:bg-black/90 text-white p-1 rounded-full backdrop-blur-sm transition-all"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-2 border-t border-gray-100 dark:border-[#2f3336] pt-3">
                        <div className="flex gap-1 text-[var(--accent-color)]">
                             <div className="p-2 hover:bg-blue-50 dark:hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors relative">
                                <Image className="w-5 h-5"/>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileSelect} 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                             </div>
                             <div className="p-2 hover:bg-blue-50 dark:hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><BarChart2 className="w-5 h-5"/></div>
                             <div className="p-2 hover:bg-blue-50 dark:hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors"><Smile className="w-5 h-5"/></div>
                             <div 
                                className={`p-2 hover:bg-blue-50 dark:hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors ${isEnhancing ? 'animate-pulse text-purple-500' : ''}`}
                                onClick={handleAIEnhance}
                                title="تحسين النص بالذكاء الاصطناعي"
                             >
                                <Wand2 className="w-5 h-5"/>
                             </div>
                        </div>
                        <button 
                            onClick={handlePost}
                            disabled={(!newPostText.trim() && !selectedFile) || isUploading}
                            className="bg-[var(--accent-color)] hover:opacity-90 text-white font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {isUploading && <Loader2 className="w-4 h-4 animate-spin"/>}
                            نشر
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )}

        {/* --- POSTS FEED --- */}
        <div className="min-h-screen pb-20">
            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center p-10 text-gray-500 dark:text-[#71767b]">
                    لا توجد منشورات للعرض.
                </div>
            ) : (
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onOpenLightbox={onOpenLightbox} 
                        onClick={() => onPostClick && onPostClick(post.id)}
                        isFocusMode={isFocusMode}
                    />
                ))
            )}
            
            {/* End of Feed Indicator */}
            {!loading && posts.length > 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-[#71767b] text-sm">
                    وصلت للنهاية 🎉
                </div>
            )}
        </div>
    </div>
  );
};

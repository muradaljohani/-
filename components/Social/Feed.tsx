
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  where,
  db
} from '../../src/lib/firebase';
import { PostCard } from './PostCard';
import { Image, BarChart2, Smile, Loader2, Wand2, Eye, EyeOff, X, Feather, Plus } from 'lucide-react';
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
  
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  
  // Post Creation State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false); // Controls Mobile Modal
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // --- 1. Real-Time Feed Listener ---
  useEffect(() => {
    if (!db) return;

    const initFeed = async () => {
        // Ensure viral posts are seeded (Admin/System level)
        await SocialService.checkAndSeed();

        let q;
        if (activeTab === 'foryou') {
            q = query(
              collection(db, "posts"), 
              orderBy("isPinned", "desc"),
              orderBy("createdAt", "desc")
            );
        } else {
            if (user) {
                // Simple "Following" simulation: For now, show own posts + posts where user is tagged (mock logic)
                // In a real app, you'd filter by 'following' array. 
                // For this demo, we'll show User's own posts in this tab.
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
                // Ensure timestamp doesn't break if null (latency)
                timestamp: data.createdAt ? SocialService.formatDate(data.createdAt) : 'Just now'
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

  }, [activeTab, user]);

  // --- 2. Post Logic ---
  const handlePost = async () => {
    if ((!newPostText.trim() && !selectedFile) || !user) return;
    
    try {
      setIsUploading(true);
      let imageUrls: string[] = [];

      // 1. Upload Image if exists
      if (selectedFile) {
         const path = `posts/${user.id}/${Date.now()}_${selectedFile.name}`;
         const url = await uploadImage(selectedFile, path);
         imageUrls.push(url);
      }

      const postsRef = collection(db, 'posts');
      
      // 2. Prepare User Data (Snapshot for the post)
      const userData = {
          name: user.name,
          handle: user.username ? `@${user.username}` : `@${user.id.substr(0,8)}`,
          avatar: user.avatar,
          verified: user.isIdentityVerified || false,
          isGold: user.primeSubscription?.status === 'active',
          uid: user.id
      };

      // 3. Save to Firestore
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

      // 4. Cleanup
      setNewPostText("");
      removeImage();
      setIsComposeOpen(false); // Close mobile modal
      if(showToast) showToast('تم إرسال المنشور!', 'success');

    } catch (error) {
      console.error("Error posting:", error);
      if(showToast) showToast('حدث خطأ أثناء النشر', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // --- Helpers ---
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
      enhancedText += " ✨";
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
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
  };

  return (
    <div className="w-full min-h-screen bg-black text-[#e7e9ea] relative">
        
        {/* --- HEADER --- */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
            <div className="flex justify-around items-center h-[53px]">
                <div 
                    className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:bg-[#181818] transition-colors relative ${activeTab === 'foryou' ? 'font-bold text-white' : 'font-medium text-[#71767b]'}`}
                    onClick={() => setActiveTab('foryou')}
                >
                    لك
                    {activeTab === 'foryou' && <div className="absolute bottom-0 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </div>
                <div 
                    className={`flex-1 h-full flex items-center justify-center cursor-pointer hover:bg-[#181818] transition-colors relative ${activeTab === 'following' ? 'font-bold text-white' : 'font-medium text-[#71767b]'}`}
                    onClick={() => setActiveTab('following')}
                >
                    منشوراتي
                    {activeTab === 'following' && <div className="absolute bottom-0 w-16 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </div>
                <div 
                    className="w-[53px] h-full flex items-center justify-center cursor-pointer hover:bg-[#181818] transition-colors text-[#71767b] hover:text-white"
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    title="Focus Mode"
                >
                    {isFocusMode ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </div>
            </div>
        </div>

        {/* --- DESKTOP COMPOSE AREA (Hidden on Mobile) --- */}
        {user && !isFocusMode && (
        <div className="hidden md:block px-4 py-3 border-b border-[#2f3336] max-w-2xl mx-auto">
            <div className="flex gap-4">
                <img 
                    src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt="User"
                />
                <div className="flex-1">
                    <textarea 
                        className="w-full bg-transparent text-lg text-[#e7e9ea] placeholder-[#71767b] outline-none resize-none min-h-[50px]"
                        placeholder="ماذا يحدث؟"
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                    />
                    
                    {previewUrl && (
                        <div className="relative mt-2 mb-4">
                            <img src={previewUrl} className="rounded-2xl max-h-80 w-auto object-cover border border-[#2f3336]" />
                            <button onClick={removeImage} className="absolute top-2 left-2 bg-black/70 hover:bg-black/90 text-white p-1 rounded-full backdrop-blur-sm transition-all">
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-2 border-t border-[#2f3336] pt-3">
                        <div className="flex gap-1 text-[#1d9bf0]">
                             <div className="p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors relative">
                                <Image className="w-5 h-5"/>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                             </div>
                             <div 
                                className={`p-2 hover:bg-[#1d9bf0]/10 rounded-full cursor-pointer transition-colors ${isEnhancing ? 'animate-pulse text-purple-500' : ''}`}
                                onClick={handleAIEnhance}
                             >
                                <Wand2 className="w-5 h-5"/>
                             </div>
                        </div>
                        <button 
                            onClick={handlePost}
                            disabled={(!newPostText.trim() && !selectedFile) || isUploading}
                            className="bg-[#1d9bf0] hover:opacity-90 text-white font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-50 transition-all flex items-center gap-2"
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
        <div className="min-h-screen pb-32 w-full max-w-2xl mx-auto">
            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 text-[#1d9bf0] animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-[#71767b]">
                    <div className="w-20 h-20 bg-[#16181c] rounded-full flex items-center justify-center mb-4">
                        <Smile className="w-10 h-10 text-[#2f3336]" />
                    </div>
                    <p className="text-lg font-bold text-[#e7e9ea]">لا توجد منشورات حتى الآن</p>
                    <p className="text-sm">كن أول من ينشر في مجتمع ميلاف!</p>
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
        </div>

        {/* --- MOBILE FAB (Floating Compose Button) --- */}
        {!isComposeOpen && user && (
            <button 
                onClick={() => setIsComposeOpen(true)}
                className="md:hidden fixed bottom-24 right-5 z-40 w-14 h-14 bg-[#1d9bf0] rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
                <Plus className="w-7 h-7" />
            </button>
        )}

        {/* --- MOBILE COMPOSE MODAL --- */}
        {isComposeOpen && (
            <div className="fixed inset-0 z-[6000] bg-black flex flex-col md:hidden animate-in slide-in-from-bottom duration-300">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-[#2f3336]">
                    <button onClick={() => setIsComposeOpen(false)} className="text-white text-base">إلغاء</button>
                    <button 
                        onClick={handlePost}
                        disabled={(!newPostText.trim() && !selectedFile) || isUploading}
                        className="bg-[#1d9bf0] text-white font-bold px-5 py-1.5 rounded-full text-sm disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'نشر'}
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 p-4 flex flex-col">
                    <div className="flex gap-3 mb-4">
                        <img src={user?.avatar} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 pt-2">
                             <textarea 
                                className="w-full bg-transparent text-xl text-[#e7e9ea] placeholder-[#71767b] outline-none resize-none min-h-[150px]"
                                placeholder="ماذا يحدث؟"
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="relative mb-4 rounded-xl overflow-hidden border border-[#2f3336] max-h-[300px]">
                            <img src={previewUrl} className="w-full h-full object-cover" />
                            <button 
                                onClick={removeImage}
                                className="absolute top-2 left-2 bg-black/60 p-1 rounded-full text-white"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal Toolbar (Above Keyboard) */}
                <div className="border-t border-[#2f3336] px-4 py-3 bg-black pb-safe">
                     <div className="flex gap-6 text-[#1d9bf0]">
                         <div className="relative">
                            <Image className="w-6 h-6"/>
                            <input 
                                type="file" 
                                ref={mobileFileInputRef}
                                onChange={handleFileSelect} 
                                className="absolute inset-0 opacity-0"
                                accept="image/*"
                            />
                         </div>
                         <div onClick={handleAIEnhance} className={`${isEnhancing ? 'animate-pulse' : ''}`}>
                             <Wand2 className="w-6 h-6"/>
                         </div>
                         <BarChart2 className="w-6 h-6 opacity-50"/>
                         <Smile className="w-6 h-6 opacity-50"/>
                     </div>
                </div>
            </div>
        )}
    </div>
  );
};

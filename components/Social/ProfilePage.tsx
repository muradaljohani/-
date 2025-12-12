import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Calendar, MapPin, Link as LinkIcon, Mail, 
  CheckCircle2, MoreHorizontal, Crown, ShoppingBag, PlusCircle, 
  ShieldCheck, Phone, GraduationCap, Cpu, Globe, Lock, 
  Fingerprint, Database, Bot, Github, Facebook, AtSign, Users 
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, db } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from './PostCard';
import { EditProfileModal } from './EditProfileModal';
import { AddProductModal } from './AddProductModal';
import { UserListModal } from './UserListModal';
import { User } from '../../types';
import { ProductCard, Product } from './ProductCard';
import { PaymentGateway } from '../PaymentGateway';
import { PhoneVerifyModal } from './PhoneVerifyModal';

interface Props {
    userId: string;
    onBack: () => void;
    onStartChat?: (user: User) => void;
}

// --- Custom Brand Icons for Trust Row ---
const GoogleIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);
const MicrosoftIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
);
const YahooIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#6001d2"><path d="M12 12.5L8.5 4H5.5l5 9.5V20h3v-6.5l5-9.5h-3L12 12.5z"/></svg>
);

// --- MURAD AI IDENTITY CONSTANT ---
const MURAD_AI_PROFILE = {
  uid: "murad-ai-bot-id",
  id: "murad-ai-bot-id",
  name: "Murad AI",
  username: "MURAD",
  handle: "@MURAD",
  email: "ai@murad-group.com",
  avatar: "https://ui-avatars.com/api/?name=Murad+AI&background=000000&color=ffffff&size=512&bold=true&length=1&font-size=0.6", 
  coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", 
  bio: "الذكاء الاصطناعي الرسمي لمجتمع ميلاف. 🤖✨\nأساعدك في البحث، التحليل، والإجابة على استفساراتك.\n\nPowered by Murad-Group AI Core.",
  address: "Digital World 🌐",
  role: 'bot',
  isLoggedIn: true,
  verified: true,
  isIdentityVerified: true,
  isGold: true,
  createdAt: new Date(2025, 0, 1).toISOString(),
  lastLogin: new Date().toISOString(),
  loginMethod: 'system',
  linkedProviders: [],
  xp: 1000000,
  level: 100,
  nextLevelXp: 2000000,
  followers: [], 
  following: [],
  followersCount: 450000000, 
  followingCount: 0,
  customFormFields: { 
      website: 'https://murad-group.com/ai',
      youtube: 'https://youtube.com/@MuradAI'
  },
  skills: ["Artificial Intelligence", "Deep Learning", "Data Analysis", "System Optimization"]
};

export const ProfilePage: React.FC<Props> = ({ userId, onBack, onStartChat }) => {
    const { user: currentUser, followUser, unfollowUser, purchaseService } = useAuth(); 
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false); 
    const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'store' | 'media' | 'likes'>('posts');
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [showAdminTooltip, setShowAdminTooltip] = useState(false); 
    const [userListType, setUserListType] = useState<'followers' | 'following' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
    const [isPhoneVerifyOpen, setIsPhoneVerifyOpen] = useState(false);

    const isOwnProfile = currentUser?.id === userId;
    const isFollowing = currentUser?.following?.includes(userId);

    // --- IMPORTANT: Decide which user object to render ---
    const displayUser = isOwnProfile ? currentUser : profileUser;
    
    // --- ADMIN HARDCODED DATA BYPASS ---
    const ADMIN_BYPASS_IDS = ["admin-fixed-id", "admin-murad-main-id", "admin-murad-id"];
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            let userData: User | null = null;

            if (userId === "murad-ai-bot-id" || userId.toLowerCase() === "murad") {
                userData = MURAD_AI_PROFILE as unknown as User;
                setProfileUser(userData);
            } else if (ADMIN_BYPASS_IDS.includes(userId)) {
                 // Mock admin data logic
                 setProfileUser({
                    id: userId,
                    name: "Murad Aljohani",
                    username: "IpMurad",
                    email: "mrada4231@gmail.com",
                    role: "admin",
                    isLoggedIn: true,
                    verified: true,
                    isIdentityVerified: true,
                    isGold: true, 
                    avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
                    coverImage: "https://ui-avatars.com/api/?name=M&background=000000&color=ffffff&size=1920&font-size=0.5&bold=true&length=1",
                    bio: "Founder & CEO of Milaf | مؤسس مجتمع ميلاف 🦅",
                    phone: "0590113665",
                    skills: ["Leadership", "Innovation", "Development", "AI Architecture"],
                    address: "Riyadh, Saudi Arabia",
                    createdAt: new Date(2025, 0, 1).toISOString(),
                    lastLogin: new Date().toISOString(),
                    loginMethod: 'email',
                    linkedProviders: ['google.com', 'github.com'],
                    xp: 999999,
                    level: 999,
                    nextLevelXp: 1000000,
                    followers: ['mock-follower-1'], 
                    following: [],
                    followersCount: 450000000, 
                    followingCount: 42, 
                    primeSubscription: { status: 'active' } as any,
                    customFormFields: { 
                        website: 'https://murad-group.com',
                        educationBio: 'جامعة الملك سعود - هندسة برمجيات'
                    },
                    isPhoneVerified: true,
                    isGithubVerified: true,
                    isGoogleVerified: true
                 } as any);
            } else if (isOwnProfile && currentUser) {
                // If own profile, we already have data in context
                setProfileUser(currentUser);
            } else if (db) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    if (userDoc.exists()) {
                        userData = { id: userDoc.id, ...userDoc.data() } as User;
                        setProfileUser(userData);
                    }
                } catch (error) {
                    console.error("Error fetching user doc:", error);
                }
            }
            
            // Posts loading logic...
            if (db) {
                try {
                    const postsRef = collection(db, 'posts');
                    // Query needs index, fallback to basic if fails or empty
                    const q = query(postsRef, where("user.uid", "==", userId));
                    const snapshot = await getDocs(q);
                    const userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Client sort
                    userPosts.sort((a: any, b: any) => {
                         const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                         const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                         return tB - tA;
                    });
                    setPosts(userPosts);
                } catch (e) {
                    console.error("Error loading user posts", e);
                }
            }

            setLoading(false);
        };

        fetchData();
    }, [userId, currentUser]); 

    // ... (Handlers) ...
    const handleBuyProduct = (product: Product) => {
        if (!currentUser) {
            alert("يرجى تسجيل الدخول للشراء.");
            return;
        }
        setSelectedProduct(product);
        setIsPaymentGatewayOpen(true);
    };

    const handlePaymentSuccess = (txn: any) => {
        if (selectedProduct) {
             const productWithSeller = {
                 ...selectedProduct,
                 sellerId: profileUser?.id,
                 sellerName: profileUser?.name
             };
             const res = purchaseService(productWithSeller, txn);
             if (res.success) {
                 setIsPaymentGatewayOpen(false);
                 alert("تم شراء المنتج بنجاح!");
                 setSelectedProduct(null);
             } else {
                 alert(res.error || "فشل عملية الشراء.");
             }
        }
    };
    
    const handleFollowToggle = () => {
        if (!currentUser) return alert("يرجى تسجيل الدخول");
        if (isFollowing) {
            unfollowUser(userId);
        } else {
            followUser(userId);
        }
    };

    const openUserList = (type: 'followers' | 'following') => {
        if (profileUser) {
            setUserListType(type);
        }
    };
    
    const formatCount = (num: number | undefined) => {
        if (num === undefined) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    // Helper to check if a provider is linked based on profile data
    const checkLinked = (providerId: string) => {
        if (!displayUser) return false;
        return displayUser.linkedProviders?.includes(providerId as any) || 
               displayUser.providerData?.some((p:any) => p.providerId === providerId) ||
               (providerId === 'google.com' && displayUser.isGoogleVerified) ||
               (providerId === 'github.com' && displayUser.isGithubVerified) ||
               (providerId === 'yahoo.com' && displayUser.isYahooVerified) ||
               (providerId === 'microsoft.com' && displayUser.isMicrosoftVerified);
    };

    // --- RENDER ---
    
    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;
    
    if (!displayUser) {
        return <div className="min-h-screen bg-black text-white p-4 font-sans" dir="rtl">...</div>; // Not found view
    }

    // Determine derived properties
    const isAdminUser = displayUser.role === 'admin' || ADMIN_BYPASS_IDS.includes(displayUser.id);
    const isBot = displayUser.id === 'murad-ai-bot-id';
    const websiteUrl = displayUser.customFormFields?.website || displayUser.businessProfile?.website;
    const educationBio = displayUser.customFormFields?.educationBio;
    const skillsBio = displayUser.skills;
    const displayFollowers = displayUser.followersCount !== undefined ? displayUser.followersCount : (displayUser.followers?.length || 0);
    const displayFollowing = displayUser.followingCount !== undefined ? displayUser.followingCount : (displayUser.following?.length || 0);
    
    // Calculate join date
    const joinDate = displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }) : 'يناير 2025';

    // Check linked providers for Trust Row
    const isGithubLinked = checkLinked('github.com');
    const isYahooLinked = checkLinked('yahoo.com');
    const isGoogleLinked = checkLinked('google.com');
    const isMicrosoftLinked = checkLinked('microsoft.com');

    // Simulate colleagues count for demo (or use real if available)
    const colleaguesCount = 20; 

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-20" dir="rtl">
             {/* 1. STICKY HEADER */}
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-4 py-1 flex items-center gap-6 border-b border-[#2f3336]">
                <button onClick={onBack} className="p-2 -mr-2 hover:bg-[#18191c] rounded-full transition-colors">
                    <ArrowRight className="w-5 h-5 text-white rtl:rotate-180"/>
                </button>
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg text-white leading-tight flex items-center gap-1">
                        {displayUser.name}
                        {isAdminUser && <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        {isBot && <Bot className="w-4 h-4 text-purple-500 fill-purple-500" />}
                    </h2>
                    <p className="text-xs text-[#71767b]">{posts.length} منشور</p>
                </div>
            </div>

            {/* 2. COVER IMAGE */}
            <div className="h-32 md:h-48 bg-[#333639] relative overflow-hidden">
                {displayUser.coverImage ? (
                    <img src={displayUser.coverImage} className="w-full h-full object-cover" alt="Banner"/>
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900"></div>
                )}
            </div>

            {/* 3. PROFILE DETAILS */}
            <div className="px-4 relative mb-4">
                 {/* Avatar & Action Button Row */}
                <div className="flex justify-between items-start">
                    <div className="-mt-[15%] md:-mt-[10%] mb-3 relative">
                         <div className={`w-[25vw] min-w-[80px] max-w-[130px] aspect-square rounded-full border-4 ${isAdminUser ? 'border-amber-500' : isBot ? 'border-purple-500' : 'border-black'} bg-black overflow-hidden relative`}>
                             <img 
                                src={displayUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${displayUser.id}`} 
                                className="w-full h-full object-cover"
                                alt={displayUser.name}
                            />
                         </div>
                         {/* Badges */}
                         {isAdminUser && <div className="absolute bottom-1 right-1 bg-amber-500 text-black p-1 rounded-full border-2 border-black shadow-lg"><Crown className="w-4 h-4 fill-black" /></div>}
                         {isBot && <div className="absolute bottom-1 right-1 bg-purple-600 text-white p-1 rounded-full border-2 border-black shadow-lg"><Bot className="w-4 h-4" /></div>}
                    </div>
                    <div className="mt-3">
                        {isOwnProfile ? (
                            <button 
                                onClick={() => setIsEditOpen(true)}
                                className="px-4 py-1.5 border border-[#536471] text-white rounded-full font-bold text-sm hover:bg-[#18191c] transition-colors"
                            >
                                تعديل الملف الشخصي
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => onStartChat && onStartChat(displayUser)} className="px-4 py-2 border border-[#536471] rounded-lg hover:bg-[#18191c] text-white font-bold text-sm">رسالة خاصة</button>
                                <button onClick={handleFollowToggle} className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${isFollowing ? 'border border-[#536471] text-white' : 'bg-white text-black'}`}>{isFollowing ? 'أنت تتابع' : 'متابعة'}</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name */}
                <div className="mt-1">
                    <h1 className="font-black text-xl text-white flex items-center gap-1 flex-wrap">
                        {displayUser.name}
                        {displayUser.isVerified && <CheckCircle2 className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0] text-white" />}
                        {/* Admin/Bot Tags */}
                        {isBot && <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 ml-2">BOT</span>}
                        {isAdminUser && <span onClick={() => setShowAdminTooltip(!showAdminTooltip)} className="flex items-center gap-1 bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 ml-2 cursor-pointer hover:bg-amber-500/30 transition-colors select-none"><Crown className="w-3 h-3 fill-current"/> مسؤول (Admin)</span>}
                    </h1>
                    <p className="text-[#71767b] text-sm font-mono text-right" dir="ltr">@{displayUser.username?.replace('@','') || displayUser.id.slice(0,8)}</p>
                </div>

                {/* Bio */}
                {displayUser.bio && <p className="mt-3 text-[15px] text-[#e7e9ea] leading-relaxed whitespace-pre-wrap">{displayUser.bio}</p>}

                {/* --- 4. TRUST ROW (New Implementation) --- */}
                <div className="flex items-center gap-3 my-4">
                  {displayUser.isPhoneVerified && (
                    <div className="bg-emerald-900/20 p-1.5 rounded-full border border-emerald-900/50" title="رقم هاتف موثق">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  )}
                  {isGithubLinked && (
                    <div className="bg-[#24292e]/40 p-1.5 rounded-full border border-gray-600" title="GitHub">
                      <Github className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  {isGoogleLinked && (
                    <div className="bg-white/10 p-1.5 rounded-full border border-white/20" title="Google">
                      <GoogleIcon />
                    </div>
                  )}
                  {isYahooLinked && (
                    <div className="bg-[#6001d2]/20 p-1.5 rounded-full border border-[#6001d2]/40" title="Yahoo">
                      <YahooIcon />
                    </div>
                  )}
                  {isMicrosoftLinked && (
                     <div className="bg-blue-900/20 p-1.5 rounded-full border border-blue-900/40" title="Microsoft">
                      <MicrosoftIcon />
                    </div>
                  )}
                </div>

                {/* --- 5. METADATA ROW (Education + Location + Link + Join Date) --- */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#71767b] text-[14px] items-center">
                    {/* Education */}
                    {educationBio && (
                        <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4"/>
                            <span>{educationBio}</span>
                        </div>
                    )}
                    
                    {displayUser.address && <div className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {displayUser.address}</div>}
                    
                    {websiteUrl && (
                        <div className="flex items-center gap-1">
                            <LinkIcon className="w-4 h-4"/> 
                            <a href={websiteUrl} target="_blank" className="text-[#1d9bf0] hover:underline">{websiteUrl.replace(/^https?:\/\//, '')}</a>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4"/>
                        <span>انضم في {joinDate}</span>
                    </div>
                </div>

                {/* --- 6. SKILLS BADGES --- */}
                {skillsBio && skillsBio.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 mb-2">
                      {skillsBio.map((skill, index) => (
                        <span key={index} className="flex items-center gap-1 px-3 py-1 bg-[#16181c] border border-[#2f3336] rounded-full text-xs text-gray-300">
                          <Cpu className="w-3 h-3 text-gray-500" />
                          {skill}
                        </span>
                      ))}
                    </div>
                )}

                {/* --- 7. STATS ROW (With Colleagues) --- */}
                <div className="flex gap-5 text-[14px] mt-4 text-[#71767b] border-b border-[#2f3336] pb-4">
                    <div className="hover:underline cursor-pointer flex gap-1 transition-colors hover:text-white" onClick={() => openUserList('following')}>
                        <span className="font-bold text-[#e7e9ea]">{formatCount(displayFollowing)}</span> <span>متابعة</span>
                    </div>
                    <div className="hover:underline cursor-pointer flex gap-1 transition-colors hover:text-white" onClick={() => openUserList('followers')}>
                        <span className="font-bold text-[#e7e9ea]">{formatCount(displayFollowers)}</span> <span>متابِع</span>
                    </div>
                    {/* Colleagues */}
                    <div className="hover:underline cursor-pointer flex items-center gap-1 hover:text-white">
                        <span className="font-bold text-amber-500">{colleaguesCount}</span> 
                        <span className="text-[#71767b]">زميل</span>
                        <Users className="w-3 h-3 text-[#71767b]" />
                    </div>
                </div>
            </div>

            {/* 4. TABS */}
            <div className="flex border-b border-[#2f3336] mt-2 sticky top-[53px] bg-black/95 z-30 backdrop-blur-sm overflow-x-auto no-scrollbar">
                {['posts', 'store', 'replies', 'media', 'likes'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center">
                        <span className={`font-bold text-[15px] capitalize whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-[#71767b]'}`}>{tab}</span>
                        {activeTab === tab && <div className="absolute bottom-0 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
                    </button>
                ))}
            </div>

            {/* 5. CONTENT */}
            <div className="min-h-[200px]">
                {loading ? <div className="p-8 text-center text-[#71767b]">جاري التحميل...</div> : activeTab === 'store' ? (
                     <div className="p-4">
                        {isOwnProfile && (
                            <div className="mb-4">
                                <button onClick={() => setIsAddProductOpen(true)} className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-colors">
                                    <PlusCircle className="w-5 h-5"/> إضافة منتج جديد
                                </button>
                            </div>
                        )}
                        {(userProducts.length > 0) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                                {userProducts.map(product => (
                                    <ProductCard key={product.id} product={product} onBuy={handleBuyProduct} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center border-t border-[#2f3336]">
                                <div className="w-20 h-20 bg-[#16181c] rounded-full flex items-center justify-center mb-4">
                                    <ShoppingBag className="w-10 h-10 text-[#71767b] opacity-50"/>
                                </div>
                                <h3 className="font-bold text-white text-lg mb-1">لا توجد منتجات</h3>
                                <p className="text-[#71767b] text-sm">هذا المستخدم لم يقم بإضافة أي منتجات للمتجر بعد.</p>
                            </div>
                        )}
                     </div>
                ) : activeTab === 'posts' ? (
                    posts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="font-bold text-xl text-white mb-2">لا توجد منشورات بعد</div>
                            <p className="text-[#71767b] text-sm">عندما يقوم {displayUser.name} بنشر تغريدات، ستظهر هنا.</p>
                        </div>
                    ) : (
                        posts.map(post => <PostCard key={post.id} post={post} onClick={() => {}} />)
                    )
                ) : (
                    <div className="p-12 text-center text-[#71767b]">لا يوجد محتوى في هذا القسم حالياً.</div>
                )}
            </div>

            {/* Modals */}
            {isOwnProfile && <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />}
            {isOwnProfile && <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />}
            <UserListModal isOpen={!!userListType} onClose={() => setUserListType(null)} title={userListType === 'followers' ? 'المتابِعون' : 'يتابِع'} userIds={userListType === 'followers' ? (displayUser.followers || []) : (displayUser.following || [])} />
            {selectedProduct && <PaymentGateway isOpen={isPaymentGatewayOpen} onClose={() => setIsPaymentGatewayOpen(false)} amount={selectedProduct.price} title={`شراء ${selectedProduct.title}`} onSuccess={handlePaymentSuccess} />}
            <PhoneVerifyModal isOpen={isPhoneVerifyOpen} onClose={() => setIsPhoneVerifyOpen(false)} />
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Calendar, MapPin, Link as LinkIcon, Mail, 
  CheckCircle2, MoreHorizontal, Crown, ShoppingBag, PlusCircle, 
  ShieldCheck, Phone, GraduationCap, Cpu, Globe, Lock, 
  Fingerprint, Database, Bot, Github, Facebook, AtSign, Users, Info,
  ThumbsUp, ThumbsDown, MessageCircle, Clock, Flag, AlertTriangle, Loader2, Play
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, db, addDoc, serverTimestamp, onSnapshot } from '../../src/lib/firebase';
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
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);
const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
);
const YahooIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6001d2"><path d="M12 12.5L8.5 4H5.5l5 9.5V20h3v-6.5l5-9.5h-3L12 12.5z" fill="white"/></svg>
);

// --- Custom Verified Badge (Rosette Shape) ---
const VerifiedBadge = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-label="Verified Account" className={className} fill="currentColor">
        <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" /></g>
    </svg>
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
  lastLogin: new Date().toISOString(), // Always online
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

// Map Tabs to Arabic
const TAB_LABELS: Record<string, string> = {
    'posts': 'المنشورات',
    'store': 'المتجر',
    'replies': 'الردود',
    'media': 'الوسائط',
    'shorts': 'فيديوهات قصيرة', // NEW: Added Shorts Tab Label
    'likes': 'الإعجابات'
};

export const ProfilePage: React.FC<Props> = ({ userId, onBack, onStartChat }) => {
    const { user: currentUser, followUser, unfollowUser, purchaseService } = useAuth(); 
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false); 
    const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'store' | 'media' | 'likes' | 'shorts'>('posts');
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [showAdminTooltip, setShowAdminTooltip] = useState(false); 
    const [userListType, setUserListType] = useState<'followers' | 'following' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
    const [isPhoneVerifyOpen, setIsPhoneVerifyOpen] = useState(false);
    
    // --- Report System State ---
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    // --- Credibility System State ---
    const [credibility, setCredibility] = useState({ likes: 0, dislikes: 0 });
    const [myVote, setMyVote] = useState<'like'|'dislike'|null>(null);

    const isOwnProfile = currentUser?.id === userId;
    const isFollowing = currentUser?.following?.includes(userId);

    // --- IMPORTANT: Decide which user object to render ---
    const displayUser = isOwnProfile ? currentUser : profileUser;
    
    // --- ADMIN HARDCODED DATA BYPASS ---
    const ADMIN_BYPASS_IDS = ["admin-murad-id"];
    
    useEffect(() => {
        let unsubscribeUser: any;

        const fetchData = async () => {
            setLoading(true);
            
            // 1. Handle Special Cases (Bot & Admin Mocks)
            if (userId === "murad-ai-bot-id" || userId.toLowerCase() === "murad") {
                const botData = { ...MURAD_AI_PROFILE, lastLogin: new Date().toISOString() } as unknown as User;
                setProfileUser(botData);
                setLoading(false);
                return;
            } 
            
            if (ADMIN_BYPASS_IDS.includes(userId)) {
                 const adminMock = {
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
                    isGoogleVerified: true,
                    credibilityLikes: 99999,
                    credibilityDislikes: 0
                 } as any;
                 setProfileUser(adminMock);
                 setCredibility({ likes: adminMock.credibilityLikes || 0, dislikes: adminMock.credibilityDislikes || 0 });
                 setLoading(false);
                 // Don't listen to DB for hardcoded admin
            } else {
                // 2. Real Firestore Listen (Live Update)
                if (db) {
                    try {
                        const userRef = doc(db, 'users', userId);
                        
                        // Use onSnapshot for Real-Time Updates
                        unsubscribeUser = onSnapshot(userRef, (docSnap) => {
                            if (docSnap.exists()) {
                                const userData = { id: docSnap.id, ...docSnap.data() } as User;
                                setProfileUser(userData);
                                setCredibility({ 
                                    likes: userData.credibilityLikes || 0, 
                                    dislikes: userData.credibilityDislikes || 0 
                                });
                            }
                            setLoading(false);
                        });
                    } catch (error) {
                        console.error("Error fetching user doc:", error);
                        setLoading(false);
                    }
                }
            }
            
            // 3. Fetch Posts (Standard Fetch)
            if (db) {
                try {
                    const postsRef = collection(db, 'posts');
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
        };

        fetchData();

        return () => {
            if (unsubscribeUser) unsubscribeUser();
        };

    }, [userId]); 

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
    
    // --- CREDIBILITY VOTE HANDLER ---
    const handleCredibilityVote = (type: 'like' | 'dislike') => {
        if (!currentUser) return alert("يرجى تسجيل الدخول للتقييم.");
        if (isOwnProfile) return alert("لا يمكنك تقييم نفسك.");

        // Play Sound
        const audioUrl = type === 'like' 
            ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' 
            : 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'; 
        
        try {
            const audio = new Audio(audioUrl);
            audio.play().catch(e => console.log("Audio play failed", e));
        } catch(e) {}

        // Logic Update
        setCredibility(prev => {
            const newState = { ...prev };
            if (myVote === type) {
                newState[type === 'like' ? 'likes' : 'dislikes'] -= 1;
                setMyVote(null);
            } else if (myVote) {
                const oldType = myVote === 'like' ? 'likes' : 'dislikes';
                const newType = type === 'like' ? 'likes' : 'dislikes';
                newState[oldType] -= 1;
                newState[newType] += 1;
                setMyVote(type);
            } else {
                newState[type === 'like' ? 'likes' : 'dislikes'] += 1;
                setMyVote(type);
            }
            return newState;
        });
    };

    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportReason.trim()) return;
        
        setIsReporting(true);
        try {
            // Save to secure reports collection - Admin system will pick this up
            await addDoc(collection(db, 'reports'), {
                targetUserId: userId,
                reporterId: currentUser?.id || 'guest',
                reporterName: currentUser?.name || 'Guest',
                reason: reportReason,
                timestamp: serverTimestamp(),
                type: 'profile_report',
                status: 'pending'
            });
            
            alert("تم إرسال البلاغ إلى الإدارة للمراجعة بسرية تامة.");
            setIsReportOpen(false);
            setReportReason('');
        } catch (error) {
            console.error("Report failed:", error);
            alert("فشل إرسال البلاغ. حاول مرة أخرى.");
        } finally {
            setIsReporting(false);
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
    
    // --- LAST SEEN LOGIC ---
    const getLastSeenLabel = (val: any) => {
        if (!val) return 'غير معروف';
        
        let date: Date;

        // Check if Firestore Timestamp (has toDate method)
        if (val && typeof val === 'object' && typeof val.toDate === 'function') {
            date = val.toDate();
        } else {
            // Try standard Date parsing for ISO strings or Date objects
            date = new Date(val);
        }

        if (isNaN(date.getTime())) return 'غير معروف';

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMin < 2) return 'متصل الآن';
        if (diffMin < 60) return `آخر تواجد قبل ${diffMin} دقيقة`;
        if (diffHours < 24) return `آخر تواجد قبل ${diffHours} ساعة`;
        if (diffDays === 1) return 'آخر تواجد الأمس';
        if (diffDays === 2) return 'آخر تواجد قبل يومين';
        if (diffDays < 7) return `آخر تواجد قبل ${diffDays} أيام`;
        
        return `آخر تواجد ${date.toLocaleDateString('ar-SA')}`;
    };

    const isGoogleLinked = displayUser?.isGoogleVerified || displayUser?.linkedProviders?.includes('google.com');
    const isGithubLinked = displayUser?.isGithubVerified || displayUser?.linkedProviders?.includes('github.com');
    const isYahooLinked = displayUser?.isYahooVerified || displayUser?.linkedProviders?.includes('yahoo.com');
    const isMicrosoftLinked = displayUser?.isMicrosoftVerified || displayUser?.linkedProviders?.includes('microsoft.com');

    // --- RENDER ---
    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;
    
    if (!displayUser) {
        return <div className="min-h-screen bg-black text-white p-4 font-sans" dir="rtl">...</div>;
    }

    const isAdminUser = displayUser.role === 'admin' || ADMIN_BYPASS_IDS.includes(displayUser.id);
    const isBot = displayUser.id === 'murad-ai-bot-id';
    const websiteUrl = displayUser.customFormFields?.website || displayUser.businessProfile?.website;
    const educationBio = displayUser.customFormFields?.educationBio;
    const skillsBio = displayUser.skills;
    const displayFollowers = displayUser.followersCount !== undefined ? displayUser.followersCount : (displayUser.followers?.length || 0);
    const displayFollowing = displayUser.followingCount !== undefined ? displayUser.followingCount : (displayUser.following?.length || 0);
    const joinDate = displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }) : 'يناير 2025';
    const colleaguesCount = 20; 
    
    // Last Seen
    const lastSeenText = getLastSeenLabel(displayUser.lastLogin);
    const isOnline = lastSeenText === 'متصل الآن';

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
                        {isAdminUser && <VerifiedBadge className="w-4 h-4 text-amber-500" />}
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
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-3">
                                    {/* Updated: Direct Private Message Action */}
                                    <button 
                                        onClick={() => onStartChat && onStartChat(displayUser)} 
                                        className="px-4 py-2 border border-[#536471] rounded-full hover:bg-[#18191c] text-white font-bold text-sm flex items-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        رسالة خاصة
                                    </button>
                                    <button 
                                        onClick={handleFollowToggle} 
                                        className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${isFollowing ? 'border border-[#536471] text-white' : 'bg-white text-black'}`}
                                    >
                                        {isFollowing ? 'أنت تتابع' : 'متابعة'}
                                    </button>
                                </div>
                                
                                {displayUser.phone && (
                                    <a 
                                        href={`tel:${displayUser.phone}`}
                                        className="w-full py-2 rounded-lg border border-[#536471] text-emerald-400 font-bold text-sm hover:bg-[#18191c] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-4 h-4" />
                                        اتصال
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Name */}
                <div className="mt-1">
                    <h1 className="font-black text-xl text-white flex items-center gap-1 flex-wrap">
                        {displayUser.name}
                        {displayUser.isVerified && <VerifiedBadge className="w-5 h-5 text-[#1d9bf0]" />}
                        {/* Admin/Bot Tags */}
                        {isBot && <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 ml-2">BOT</span>}
                        
                        {isAdminUser && (
                            <div className="relative inline-flex items-center">
                                <span 
                                    onClick={(e) => { e.stopPropagation(); setShowAdminTooltip(!showAdminTooltip); }} 
                                    className="flex items-center gap-1 bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 ml-2 cursor-pointer hover:bg-amber-500/30 transition-colors select-none"
                                >
                                    <Crown className="w-3 h-3 fill-current"/> مسؤول (Admin)
                                </span>
                                {/* UPDATED TOOLTIP POSITION: Bottom to Top arrow, text above */}
                                {showAdminTooltip && (
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-black border border-[#2f3336] rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] p-4 z-50 text-right animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                                        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black border-b border-l border-[#2f3336] -rotate-45"></div>
                                        <div className="relative z-10 flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-sm">حساب موثق</h3>
                                                {/* UPDATED ICON: Filled Blue Badge */}
                                                <VerifiedBadge className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <p className="text-[#e7e9ea] text-[11px] leading-relaxed font-medium">
                                                تم توثيق هذا الحساب لكونه الحساب الرسمي لمؤسس ومالك مجتمع ميلاف.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </h1>
                    <p className="text-[#71767b] text-xl font-bold font-mono text-right mt-1" dir="ltr">@{displayUser.username?.replace('@','') || displayUser.id.slice(0,8)}</p>
                </div>

                {/* Bio */}
                {displayUser.bio && <p className="mt-3 text-[15px] text-[#e7e9ea] leading-relaxed whitespace-pre-wrap">{displayUser.bio}</p>}

                {/* --- 4. CREDIBILITY & TRUST STRIP --- */}
                <div className="flex flex-wrap items-center gap-4 mt-4 mb-4 border-b border-[#2f3336] pb-3">
                  
                  {/* CREDIBILITY SECTION */}
                  <div className="flex items-center gap-3 pl-4 border-l border-[#2f3336] ml-4">
                      <span className="text-xs font-bold text-[#71767b]">المصدقات:</span>
                      
                      <button 
                        onClick={() => handleCredibilityVote('like')} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all active:scale-95 ${myVote === 'like' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400' : 'bg-transparent border-[#2f3336] text-gray-500 hover:border-emerald-500/50 hover:text-emerald-500'}`}
                      >
                          <ThumbsUp className={`w-3.5 h-3.5 ${myVote === 'like' ? 'fill-current' : ''}`}/>
                          <span>{formatCount(credibility.likes)}</span>
                      </button>

                      <button 
                        onClick={() => handleCredibilityVote('dislike')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all active:scale-95 ${myVote === 'dislike' ? 'bg-red-900/40 border-red-500 text-red-400' : 'bg-transparent border-[#2f3336] text-gray-500 hover:border-red-500/50 hover:text-red-500'}`}
                      >
                          <ThumbsDown className={`w-3.5 h-3.5 ${myVote === 'dislike' ? 'fill-current' : ''}`}/>
                          <span>{formatCount(credibility.dislikes)}</span>
                      </button>
                  </div>

                  {/* VERIFICATIONS SECTION */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#71767b] ml-1">التوثيقات:</span>
                    
                    {displayUser.isPhoneVerified && (
                        <div className="bg-emerald-900/20 p-1.5 rounded-full border border-emerald-900/50 flex items-center gap-1.5 px-3" title="رقم هاتف موثق">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] text-emerald-400 font-bold">جوال</span>
                        </div>
                    )}
                    {isGithubLinked && (
                        <div className="bg-[#24292e]/40 p-1.5 rounded-full border border-gray-600 flex items-center gap-1.5 px-3" title="GitHub Verified">
                        <Github className="w-4 h-4 text-white" />
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                    )}
                    {isGoogleLinked && (
                        <div className="bg-white/10 p-1.5 rounded-full border border-white/20 flex items-center gap-1.5 px-3" title="Google Verified">
                        <GoogleIcon />
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                    )}
                    {isYahooLinked && (
                        <div className="bg-[#6001d2]/20 p-1.5 rounded-full border border-[#6001d2]/40 flex items-center gap-1.5 px-3" title="Yahoo Verified">
                        <YahooIcon />
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                    )}
                    {isMicrosoftLinked && (
                        <div className="bg-blue-900/20 p-1.5 rounded-full border border-blue-900/40 flex items-center gap-1.5 px-3" title="Microsoft Verified">
                        <MicrosoftIcon />
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                    )}
                    
                    {!displayUser.isPhoneVerified && !isGithubLinked && !isGoogleLinked && !isYahooLinked && !isMicrosoftLinked && (
                        <span className="text-[10px] text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">حساب غير موثق</span>
                    )}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#71767b] text-[14px] items-center">
                    {/* LAST SEEN INDICATOR (Requested Feature) */}
                    <div className="flex items-center gap-1.5 bg-[#16181c] px-2 py-0.5 rounded-full border border-[#2f3336]" title={`آخر نشاط: ${new Date(displayUser.lastLogin).toLocaleString()}`}>
                        <Clock className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-500' : 'text-gray-500'}`}/>
                        <span className={`text-xs ${isOnline ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                            {lastSeenText}
                        </span>
                    </div>

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
                        
                        <div className="relative ml-2 group">
                            <div className="w-5 h-5 bg-[#0f172a] border border-blue-500/50 text-blue-500 rounded-md flex items-center justify-center text-[10px] font-black cursor-help select-none shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                M
                            </div>
                        </div>

                         {/* REPORT BUTTON (UPDATED: White & Clear) */}
                        {!isOwnProfile && (
                            <button 
                                onClick={() => setIsReportOpen(true)} 
                                className="flex items-center gap-1 text-[10px] text-white bg-white/10 hover:bg-red-500/20 transition-colors ml-3 px-3 py-1.5 rounded-full border border-white/10" 
                                title="إبلاغ عن هذا الملف"
                            >
                                <Flag className="w-3 h-3" />
                                <span>إبلاغ</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Skills */}
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

                {/* Stats */}
                <div className="flex gap-5 text-[14px] mt-4 text-[#71767b] border-b border-[#2f3336] pb-4">
                    <div className="hover:underline cursor-pointer flex gap-1 transition-colors hover:text-white" onClick={() => openUserList('following')}>
                        <span className="font-bold text-[#e7e9ea]">{formatCount(displayFollowing)}</span> <span>متابعة</span>
                    </div>
                    <div className="hover:underline cursor-pointer flex gap-1 transition-colors hover:text-white" onClick={() => openUserList('followers')}>
                        <span className="font-bold text-[#e7e9ea]">{formatCount(displayFollowers)}</span> <span>متابِع</span>
                    </div>
                    <div className="hover:underline cursor-pointer flex items-center gap-1 hover:text-white">
                        <span className="font-bold text-amber-500">{colleaguesCount}</span> 
                        <span className="text-[#71767b]">زميل</span>
                        <Users className="w-3 h-3 text-[#71767b]" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2f3336] mt-2 sticky top-[53px] bg-black/95 z-30 backdrop-blur-sm overflow-x-auto no-scrollbar">
                {['posts', 'store', 'replies', 'media', 'shorts', 'likes'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab as any)} className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center">
                        <span className={`font-bold text-[15px] capitalize whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-[#71767b]'}`}>
                            {TAB_LABELS[tab]}
                        </span>
                        {activeTab === tab && <div className="absolute bottom-0 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[200px]">
                {loading ? (
                    <div className="p-8 text-center text-[#71767b]">جاري التحميل...</div>
                ) : activeTab === 'store' ? (
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
                ) : activeTab === 'shorts' ? (
                     /* SHORTS GRID VIEW */
                     <div className="grid grid-cols-3 gap-1 animate-fade-in-up">
                         {posts.filter(p => p.type === 'video' || (p.images && p.images.some((u:string) => u.includes('.mp4') || u.includes('.webm')))).map(post => {
                             const videoSrc = post.images?.[0] || post.image || post.videoUrl;
                             return (
                                 <div 
                                    key={post.id} 
                                    className="aspect-[9/16] bg-gray-900 relative cursor-pointer group overflow-hidden"
                                    onClick={() => { window.location.hash = `/social/shorts`; }} // Simple navigation to shorts feed
                                 >
                                     <video src={videoSrc} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" muted loop playsInline />
                                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                                         <Play className="w-8 h-8 text-white opacity-80 fill-white" />
                                     </div>
                                     <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-xs font-bold drop-shadow-md">
                                         <Play className="w-3 h-3 fill-current" /> {post.views || 0}
                                     </div>
                                 </div>
                             );
                         })}
                         {posts.filter(p => p.type === 'video' || (p.images && p.images.some((u:string) => u.includes('.mp4') || u.includes('.webm')))).length === 0 && (
                             <div className="col-span-3 py-20 text-center text-[#71767b]">
                                 <div className="w-16 h-16 bg-[#16181c] rounded-full flex items-center justify-center mx-auto mb-4">
                                     <Play className="w-8 h-8 text-[#71767b] opacity-50"/>
                                 </div>
                                 <p>لا توجد مقاطع فيديو قصيرة.</p>
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
            
            {/* Report Modal */}
            {isReportOpen && (
                <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1e293b] border border-red-500/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <AlertTriangle className="w-6 h-6"/>
                            <h3 className="font-bold text-lg text-white">إبلاغ عن هذا الملف</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">يرجى كتابة سبب الإبلاغ. سيتم إرسال هذا التقرير مباشرة إلى الإدارة للمراجعة.</p>
                        <textarea 
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white text-sm outline-none mb-4 min-h-[80px]"
                            placeholder="مثال: انتحال شخصية، محتوى مسيء، احتيال..."
                        />
                        <div className="flex gap-3">
                            <button onClick={() => setIsReportOpen(false)} className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm">إلغاء</button>
                            <button 
                                onClick={handleReportSubmit} 
                                disabled={!reportReason.trim() || isReporting} 
                                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm flex justify-center gap-2 items-center"
                            >
                                {isReporting && <Loader2 className="w-4 h-4 animate-spin"/>} إرسال
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

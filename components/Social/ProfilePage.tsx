import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Link as LinkIcon, Mail, CheckCircle2, MoreHorizontal, Crown, ShoppingBag, PlusCircle, ShieldCheck, Phone, GraduationCap, Cpu, Globe, Lock, Fingerprint, Database, Bot } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, db } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from './PostCard';
import { EditProfileModal } from './EditProfileModal';
import { AddProductModal } from './AddProductModal';
import { UserListModal } from './UserListModal';
import { User } from '../../types';
import { ProductCard, Product } from './ProductCard';

interface Props {
    userId: string;
    onBack: () => void;
}

// --- MURAD AI IDENTITY CONSTANT ---
const MURAD_AI_PROFILE = {
  uid: "murad-ai-bot-id",
  id: "murad-ai-bot-id",
  name: "Murad AI",
  username: "MURAD",
  handle: "@MURAD",
  email: "ai@murad-group.com",
  avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png", 
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
  followersCount: 999000, 
  followingCount: 0,
  customFormFields: { 
      website: 'https://murad-group.com/ai',
      youtube: 'https://youtube.com/@MuradAI'
  },
  skills: ["Artificial Intelligence", "Deep Learning", "Data Analysis", "System Optimization"]
};

export const ProfilePage: React.FC<Props> = ({ userId, onBack }) => {
    const { user: currentUser, followUser, unfollowUser, allProducts } = useAuth(); 
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false); 
    const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'store' | 'media' | 'likes'>('posts');
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [showAdminTooltip, setShowAdminTooltip] = useState(false); 
    
    // User List Modal State
    const [userListType, setUserListType] = useState<'followers' | 'following' | null>(null);

    // Google Algo Location State
    const [realLocation, setRealLocation] = useState<string>('جاري التحليل (Google API)...');

    const isOwnProfile = currentUser?.id === userId;
    const isFollowing = currentUser?.following?.includes(userId);

    // --- ADMIN HARDCODED DATA BYPASS ---
    const ADMIN_BYPASS_IDS = ["admin-fixed-id", "admin-murad-main-id", "admin-murad-id"];

    // Mock Products for Admin/Creator Profile
    const MOCK_PRODUCTS: Product[] = [
        {
            id: 'p1',
            title: 'Milaf Source Code (Full System)',
            price: 5000,
            type: 'Source Code',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
            rating: 5.0
        },
        {
            id: 'p2',
            title: 'Python AI Automation Script',
            price: 150,
            type: 'Script',
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
            rating: 4.8
        },
        {
            id: 'p3',
            title: 'Exclusive Gold Badge',
            price: 50,
            type: 'Badge',
            image: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'p4',
            title: 'Ultimate UI Kit for React',
            price: 299,
            type: 'Design',
            image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
            rating: 4.9
        }
    ];

    // Fetch Real Location based on IP (Simulating Google Algorithm Detection)
    useEffect(() => {
        const fetchGeoLocation = async () => {
            try {
                // Using a public IP API to mimic algorithmic location detection
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.country_name) {
                    const country = data.country_name === "Saudi Arabia" ? "السعودية" : data.country_name;
                    setRealLocation(`${country} - ${data.city || 'الرياض'} (Google Detected)`);
                } else {
                    setRealLocation('المملكة العربية السعودية (SA) - Google');
                }
            } catch (error) {
                setRealLocation('المملكة العربية السعودية (SA)');
            }
        };

        // If viewing admin or self, fetch real location
        if (isOwnProfile || ADMIN_BYPASS_IDS.includes(userId)) {
            fetchGeoLocation();
        } else {
            // For others, use stored address or default
            setRealLocation('غير محدد (محمي بواسطة Google Privacy)');
        }
    }, [userId, isOwnProfile]);

    useEffect(() => {
        // Prepare User Products
        if (ADMIN_BYPASS_IDS.includes(userId)) {
            setUserProducts(MOCK_PRODUCTS);
        } else {
            // Filter products from global context where sellerId == userId
            const myProducts = allProducts
                .filter(p => p.sellerId === userId)
                .map(p => ({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    type: p.type || 'Product',
                    image: p.images?.[0] || 'https://via.placeholder.com/300',
                    rating: 5
                }));
            setUserProducts(myProducts);
        }
    }, [userId, allProducts]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            // 1. Fetch User Data with Bypass Logic
            let userData: User | null = null;

            if (userId === "murad-ai-bot-id") {
                // --- BOT IDENTITY BYPASS ---
                userData = MURAD_AI_PROFILE as unknown as User;
                setProfileUser(userData);
            } else if (ADMIN_BYPASS_IDS.includes(userId)) {
                // HARDCODED BYPASS FOR ADMIN
                userData = {
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
                    bio: "بجانبك هل تراني ؟",
                    phone: "0590113665",
                    skills: ["Leadership", "Innovation", "Development"],
                    address: "Digital World",
                    createdAt: new Date(2025, 0, 1).toISOString(),
                    lastLogin: new Date().toISOString(),
                    loginMethod: 'email',
                    linkedProviders: [],
                    xp: 999999,
                    level: 999,
                    nextLevelXp: 1000000,
                    followers: ['mock-follower-1'], // Pass mock IDs for list generation
                    following: [],
                    followersCount: 11711, 
                    followingCount: 42, 
                    primeSubscription: { status: 'active' } as any,
                    customFormFields: { 
                        website: 'https://murad-group.com',
                        educationBio: 'كليات الخليج'
                    }
                } as User;
                
                setProfileUser(userData);
            } else if (isOwnProfile && currentUser) {
                // Use current session user if looking at own profile
                userData = currentUser;
                setProfileUser(currentUser);
            } else if (db) {
                // Normal Firestore Query
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

            // 2. Fetch User Posts
            if (userData && db) {
                try {
                    let q;
                    if (userId === "murad-ai-bot-id") {
                         // Bot doesn't have posts in this demo, or we can fetch system posts
                         // Leaving empty for now to focus on profile identity
                         setPosts([]);
                    } else if (ADMIN_BYPASS_IDS.includes(userId)) {
                         q = query(
                            collection(db, 'posts'),
                            where('user.uid', 'in', ADMIN_BYPASS_IDS)
                        );
                    } else {
                        q = query(
                            collection(db, 'posts'),
                            where('user.uid', '==', userId)
                        );
                    }

                    if (q) {
                        const postsSnap = await getDocs(q);
                        const userPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                        
                        userPosts.sort((a: any, b: any) => {
                            const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (new Date(a.createdAt || 0).getTime());
                            const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (new Date(b.createdAt || 0).getTime());
                            return tB - tA;
                        });
                        
                        setPosts(userPosts);
                    }
                } catch (e) {
                    console.error("Error fetching posts:", e);
                }
            }

            setLoading(false);
        };

        fetchData();
    }, [userId, currentUser]); 

    const handleFollowToggle = () => {
        if (!currentUser) return alert("يرجى تسجيل الدخول");
        if (isFollowing) {
            unfollowUser(userId);
        } else {
            followUser(userId);
        }
    };

    const handleBuyProduct = (product: Product) => {
        if(!currentUser) {
            alert("يرجى تسجيل الدخول للشراء");
            return;
        }
        if(confirm(`هل تريد شراء "${product.title}" بسعر ${product.price} ريال؟`)) {
            alert("تم إضافة المنتج للسلة (محاكاة)");
        }
    };

    const formatCount = (num: number | undefined) => {
        if (num === undefined) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const openUserList = (type: 'followers' | 'following') => {
        if (profileUser) {
            setUserListType(type);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen bg-black text-white p-4 font-sans" dir="rtl">
                <button onClick={onBack} className="flex items-center gap-2 mb-4 text-blue-500">
                    <ArrowRight className="w-5 h-5 rtl:rotate-180"/> عودة
                </button>
                <div className="text-center py-20 text-gray-500">المستخدم غير موجود</div>
            </div>
        );
    }

    const joinDate = profileUser.createdAt 
        ? new Date(profileUser.createdAt).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }) 
        : 'منذ فترة';
    
    const websiteUrl = profileUser.customFormFields?.website || profileUser.businessProfile?.website;
    const educationBio = profileUser.customFormFields?.educationBio;
    const skillsBio = profileUser.skills;

    // Use count if available, otherwise array length
    const displayFollowers = profileUser.followersCount !== undefined ? profileUser.followersCount : (profileUser.followers?.length || 0);
    const displayFollowing = profileUser.followingCount !== undefined ? profileUser.followingCount : (profileUser.following?.length || 0);

    const isAdminUser = profileUser.role === 'admin' || ADMIN_BYPASS_IDS.includes(profileUser.id);
    const isBot = profileUser.id === 'murad-ai-bot-id';

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-20" dir="rtl">
            
            {/* 1. STICKY HEADER */}
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md px-4 py-1 flex items-center gap-6 border-b border-[#2f3336]">
                <button onClick={onBack} className="p-2 -mr-2 hover:bg-[#18191c] rounded-full transition-colors">
                    <ArrowRight className="w-5 h-5 text-white rtl:rotate-180"/>
                </button>
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg text-white leading-tight flex items-center gap-1">
                        {profileUser.name}
                        {isAdminUser && <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        {isBot && <Bot className="w-4 h-4 text-purple-500 fill-purple-500" />}
                    </h2>
                    <p className="text-xs text-[#71767b]">{posts.length} منشور</p>
                </div>
            </div>

            {/* 2. COVER IMAGE */}
            <div className="h-32 md:h-48 bg-[#333639] relative overflow-hidden">
                {profileUser.coverImage ? (
                    <img src={profileUser.coverImage} className="w-full h-full object-cover" alt="Banner"/>
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900"></div>
                )}
            </div>

            {/* 3. PROFILE DETAILS */}
            <div className="px-4 relative mb-4">
                
                {/* Avatar & Action Button Row */}
                <div className="flex justify-between items-start">
                    <div className="-mt-[15%] md:-mt-[10%] mb-3 relative">
                         {/* Avatar Container with Admin Crown */}
                         <div className={`w-[25vw] min-w-[80px] max-w-[130px] aspect-square rounded-full border-4 ${isAdminUser ? 'border-amber-500' : isBot ? 'border-purple-500' : 'border-black'} bg-black overflow-hidden relative`}>
                             <img 
                                src={profileUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser.id}`} 
                                className="w-full h-full object-cover"
                                alt={profileUser.name}
                            />
                         </div>
                         {/* Absolute Crown Badge */}
                         {isAdminUser && (
                             <div className="absolute bottom-1 right-1 bg-amber-500 text-black p-1 rounded-full border-2 border-black shadow-lg" title="Admin">
                                 <Crown className="w-4 h-4 fill-black" />
                             </div>
                         )}
                         {isBot && (
                             <div className="absolute bottom-1 right-1 bg-purple-600 text-white p-1 rounded-full border-2 border-black shadow-lg" title="AI Bot">
                                 <Bot className="w-4 h-4" />
                             </div>
                         )}
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
                            <div className="flex gap-2">
                                <button className="p-2 border border-[#536471] rounded-full hover:bg-[#18191c] text-white">
                                    <Mail className="w-5 h-5"/>
                                </button>
                                <button 
                                    onClick={handleFollowToggle}
                                    className={`px-5 py-1.5 rounded-full font-bold text-sm transition-colors ${
                                        isFollowing 
                                        ? 'border border-[#536471] text-white hover:bg-red-900/20 hover:text-red-500 hover:border-red-500' 
                                        : 'bg-white text-black hover:bg-[#eff3f4]'
                                    }`}
                                >
                                    {isFollowing ? 'متابعة' : 'تابع'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name & Handle */}
                <div className="mt-1">
                    <h1 className="font-black text-xl text-white flex items-center gap-1 flex-wrap">
                        {profileUser.name}
                        {profileUser.isVerified && <CheckCircle2 className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0] text-white" />}
                        {isBot && (
                             <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 ml-2 select-none">
                                <Bot className="w-3 h-3"/>
                                <span>BOT</span>
                            </span>
                        )}
                        {isAdminUser && (
                            <div className="relative inline-block">
                                <span 
                                    onClick={() => setShowAdminTooltip(!showAdminTooltip)}
                                    className="flex items-center gap-1 bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 ml-2 cursor-pointer hover:bg-amber-500/30 transition-colors select-none"
                                >
                                    <Crown className="w-3 h-3 fill-current"/>
                                    <span>مسؤول (Admin)</span>
                                </span>
                                {showAdminTooltip && (
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-[#1e293b] border border-amber-500/30 text-white text-xs p-3 rounded-xl shadow-xl z-50 text-center animate-fade-in-up">
                                        <div className="font-bold text-amber-500 mb-1 flex items-center justify-center gap-1">
                                            <ShieldCheck className="w-3 h-3"/> حساب موثَّق
                                        </div>
                                        <p className="text-gray-300">تم توثيق هذا الحساب لكونه الحساب الرسمي لمؤسس ومالك مجتمع ميلاف.</p>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e293b] border-b border-r border-amber-500/30 rotate-45"></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </h1>
                    <p className="text-[#71767b] text-sm font-mono text-right" dir="ltr">
                        @{profileUser.username?.replace('@','') || profileUser.id.slice(0,8)}
                    </p>
                </div>

                {/* Bio */}
                {profileUser.bio && (
                    <p className="mt-3 text-[15px] text-[#e7e9ea] leading-relaxed whitespace-pre-wrap">{profileUser.bio}</p>
                )}

                {/* --- New Bio Additions: Phone, Education, Skills --- */}
                <div className="mt-3 space-y-2">
                    {/* Phone Number (Verified) */}
                    {profileUser.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 bg-emerald-500/10 rounded-full">
                                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="font-mono text-[#e7e9ea] dir-ltr">{profileUser.phone}</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> رقم هاتف موثق
                            </span>
                        </div>
                    )}

                    {/* Education */}
                    {educationBio && (
                        <div className="flex items-start gap-2 text-sm">
                            <div className="p-1.5 bg-blue-500/10 rounded-full mt-0.5">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <span className="text-gray-300 leading-snug">{educationBio}</span>
                        </div>
                    )}

                    {/* Skills */}
                    {skillsBio && skillsBio.length > 0 && (
                        <div className="flex items-start gap-2 text-sm mt-1">
                            <div className="p-1.5 bg-purple-500/10 rounded-full mt-0.5">
                                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillsBio.map((skill, index) => (
                                    <span key={index} className="bg-[#16181c] border border-[#2f3336] text-gray-300 px-2 py-0.5 rounded-md text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#71767b] text-[14px] mt-4 pt-3 border-t border-[#2f3336] items-center">
                    {profileUser.address && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4"/> {profileUser.address}
                        </div>
                    )}
                    {websiteUrl && (
                         <div className="flex items-center gap-1">
                            <LinkIcon className="w-4 h-4"/> 
                            <a href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">
                                {websiteUrl.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4"/> انضم في {joinDate}
                    </div>
                    
                    {/* About Icon (M) with STRICT IMMUTABILITY INDICATION */}
                    <div className="relative group cursor-pointer">
                        <div className="w-5 h-5 rounded-full bg-[#71767b] flex items-center justify-center text-black font-black text-[10px] hover:bg-white transition-colors">
                            M
                        </div>
                        
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0f172a] border border-amber-500/30 rounded-xl p-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-right">
                             {/* STRICT HEADER */}
                             <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                                 <h3 className="text-amber-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                                     <Database className="w-3 h-3"/> سجل النظام الموحد
                                 </h3>
                                 <Lock className="w-3 h-3 text-red-500" />
                             </div>
                             
                             <div className="space-y-3 text-xs">
                                 <div className="flex justify-between items-center group/item border-b border-white/5 pb-1">
                                     <span className="text-gray-500">الاسم الكامل (رسمي):</span>
                                     <div className="flex items-center gap-1">
                                        <span className="text-gray-200 font-bold select-all">{profileUser.name}</span>
                                        <Lock className="w-2.5 h-2.5 text-gray-600 opacity-50" />
                                     </div>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-white/5 pb-1">
                                     <span className="text-gray-500">الحالة:</span>
                                     <span className={profileUser.isIdentityVerified ? "text-emerald-400 font-bold" : "text-gray-400"}>
                                        {profileUser.isIdentityVerified ? 'موثق رسمياً' : 'عضو'}
                                     </span>
                                 </div>
                                 
                                 {/* REAL-TIME LOCATION (GOOGLE ALGO) */}
                                 <div className="flex flex-col gap-1 mt-1 border-b border-white/5 pb-2">
                                     <span className="text-gray-500 flex items-center gap-1"><Globe className="w-3 h-3"/> الموقع الجغرافي (Live):</span>
                                     <span className="text-blue-400 font-mono text-[10px] flex items-center gap-1 pl-2">
                                         {realLocation}
                                     </span>
                                 </div>

                                 <div className="flex justify-between items-center">
                                     <span className="text-gray-500">تاريخ الانضمام:</span>
                                     <span className="text-gray-200 font-mono">{new Date(profileUser.createdAt).toLocaleDateString('en-GB')}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                     <span className="text-gray-500">المعرف الرقمي:</span>
                                     <span className="text-gray-200 font-mono flex items-center gap-1">
                                         <Fingerprint className="w-3 h-3 text-gray-500"/>
                                         {profileUser.trainingId || profileUser.id.substring(0,8)}
                                     </span>
                                 </div>
                             </div>

                             {/* IMMUTABILITY WARNING FOOTER */}
                             <div className="mt-3 pt-2 border-t border-red-500/20 text-[9px] text-red-500/90 font-bold text-center flex items-center justify-center gap-1 bg-red-900/10 rounded p-1">
                                 <ShieldCheck className="w-3 h-3"/>
                                 <span>سجل دائم ومحمي لا يمكن حذفه أو تعديله</span>
                             </div>
                             
                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0f172a] rotate-45 border-b border-r border-amber-500/30"></div>
                        </div>
                    </div>
                </div>

                {/* Follow Stats */}
                <div className="flex gap-5 text-[14px] mt-3 text-[#71767b]">
                    <div 
                        className="hover:underline cursor-pointer flex gap-1 transition-colors hover:text-white" 
                        onClick={() => openUserList('following')}
                    >
                        <span className="font-bold text-[#e7e9ea]">{formatCount(displayFollowing)}</span> <span>متابِعًا</span>
                    </div>
                    <div 
                        className="hover:underline cursor-pointer flex gap-1 transition-colors hover:text-white"
                        onClick={() => openUserList('followers')}
                    >
                        <span className="font-bold text-[#e7e9ea]">{formatCount(displayFollowers)}</span> <span>المتابعين</span>
                    </div>
                </div>
            </div>

            {/* 4. TABS */}
            <div className="flex border-b border-[#2f3336] mt-2 sticky top-[53px] bg-black/95 z-30 backdrop-blur-sm overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center"
                >
                    <span className={`font-bold text-[15px] whitespace-nowrap ${activeTab === 'posts' ? 'text-white' : 'text-[#71767b]'}`}>منشورات</span>
                    {activeTab === 'posts' && <div className="absolute bottom-0 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('store')}
                    className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center"
                >
                    <span className={`font-bold text-[15px] whitespace-nowrap ${activeTab === 'store' ? 'text-white' : 'text-[#71767b]'}`}>المتجر</span>
                    {activeTab === 'store' && <div className="absolute bottom-0 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('replies')}
                    className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center"
                >
                    <span className={`font-bold text-[15px] whitespace-nowrap ${activeTab === 'replies' ? 'text-white' : 'text-[#71767b]'}`}>الردود</span>
                    {activeTab === 'replies' && <div className="absolute bottom-0 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('media')}
                    className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center"
                >
                    <span className={`font-bold text-[15px] whitespace-nowrap ${activeTab === 'media' ? 'text-white' : 'text-[#71767b]'}`}>الوسائط</span>
                    {activeTab === 'media' && <div className="absolute bottom-0 w-12 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('likes')}
                    className="flex-1 min-w-[80px] hover:bg-[#18191c] transition-colors relative h-[53px] flex items-center justify-center"
                >
                    <span className={`font-bold text-[15px] whitespace-nowrap ${activeTab === 'likes' ? 'text-white' : 'text-[#71767b]'}`}>الإعجابات</span>
                    {activeTab === 'likes' && <div className="absolute bottom-0 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
            </div>

            {/* 5. CONTENT AREA */}
            <div className="min-h-[200px]">
                {loading ? (
                    <div className="p-8 text-center text-[#71767b]">جاري التحميل...</div>
                ) : activeTab === 'store' ? (
                     // STORE VIEW
                     <div className="p-4">
                        {isOwnProfile && (
                            <div className="mb-4">
                                <button 
                                    onClick={() => setIsAddProductOpen(true)}
                                    className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <PlusCircle className="w-5 h-5"/> إضافة منتج جديد
                                </button>
                            </div>
                        )}

                        {(userProducts.length > 0) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                                {userProducts.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onBuy={handleBuyProduct} 
                                    />
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
                    // POSTS VIEW
                    posts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="font-bold text-xl text-white mb-2">لا توجد منشورات بعد</div>
                            <p className="text-[#71767b] text-sm">عندما يقوم {profileUser.name} بنشر تغريدات، ستظهر هنا.</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} onClick={() => {}} />
                        ))
                    )
                ) : (
                    // OTHER TABS PLACEHOLDER
                    <div className="p-12 text-center text-[#71767b]">
                         لا يوجد محتوى في هذا القسم حالياً.
                    </div>
                )}
            </div>

            {isOwnProfile && <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />}
            {isOwnProfile && <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} />}
            
            {/* User List Modal */}
            <UserListModal 
                isOpen={!!userListType}
                onClose={() => setUserListType(null)}
                title={userListType === 'followers' ? 'المتابِعون' : 'يتابِع'}
                userIds={userListType === 'followers' ? (profileUser.followers || []) : (profileUser.following || [])}
            />
        </div>
    );
};
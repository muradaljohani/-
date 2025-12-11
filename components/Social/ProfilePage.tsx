
import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Link as LinkIcon, Mail, CheckCircle2, MoreHorizontal, Crown, ShoppingBag, PlusCircle, ShieldCheck } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, db } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from './PostCard';
import { EditProfileModal } from './EditProfileModal';
import { AddProductModal } from './AddProductModal'; // Imported new modal
import { UserListModal } from './UserListModal'; // Imported User List Modal
import { User } from '../../types';
import { ProductCard, Product } from './ProductCard';

interface Props {
    userId: string;
    onBack: () => void;
}

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

            if (ADMIN_BYPASS_IDS.includes(userId)) {
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
                    address: "Digital World",
                    createdAt: new Date(2025, 0, 1).toISOString(),
                    lastLogin: new Date().toISOString(),
                    loginMethod: 'email',
                    linkedProviders: [],
                    xp: 999999,
                    level: 999,
                    nextLevelXp: 1000000,
                    followers: ['mock-follower-1'], // Pass mock IDs
                    following: [],
                    followersCount: 450000000, 
                    followingCount: 0, 
                    primeSubscription: { status: 'active' } as any,
                    customFormFields: { website: 'https://murad-group.com' }
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
                    if (ADMIN_BYPASS_IDS.includes(userId)) {
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

                    const postsSnap = await getDocs(q);
                    const userPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    
                    userPosts.sort((a: any, b: any) => {
                        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (new Date(a.createdAt || 0).getTime());
                        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (new Date(b.createdAt || 0).getTime());
                        return tB - tA;
                    });
                    
                    setPosts(userPosts);
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
        if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
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

    const displayFollowers = profileUser.followersCount !== undefined ? profileUser.followersCount : (profileUser.followers?.length || 0);
    const displayFollowing = profileUser.followingCount !== undefined ? profileUser.followingCount : (profileUser.following?.length || 0);

    const isAdminUser = profileUser.role === 'admin' || ADMIN_BYPASS_IDS.includes(profileUser.id);
    const isFounder = profileUser.username === 'IpMurad' || profileUser.id === 'admin-fixed-id' || profileUser.id === 'admin-murad-main-id';

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
                         <div className={`w-[25vw] min-w-[80px] max-w-[130px] aspect-square rounded-full border-4 ${isAdminUser ? 'border-amber-500' : 'border-black'} bg-black overflow-hidden relative`}>
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
                        {isFounder && (
                            <span className="flex items-center gap-1 px-2 py-0.5 mx-1 bg-yellow-500/10 border border-yellow-500/40 rounded-full">
                                <span className="text-[10px] font-bold text-yellow-500 leading-none pb-0.5">
                                    حساب المؤسس الرسمي
                                </span>
                                <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 00-.556.834c-.045.722-1.133.722-1.178 0a1 1 0 00-.556-.834A3.989 3.989 0 017.333 15 3.989 3.989 0 015 13.97a1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L10 4.323V3a1 1 0 011-1z" />
                                </svg>
                            </span>
                        )}
                        {isAdminUser && !isFounder && (
                            <div className="relative inline-block">
                                <span 
                                    onClick={() => setShowAdminTooltip(!showAdminTooltip)}
                                    className="flex items-center gap-1 bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 ml-2 cursor-pointer hover:bg-amber-500/30 transition-colors select-none"
                                >
                                    <Crown className="w-3 h-3 fill-current"/>
                                    <span>مسؤول (Admin)</span>
                                </span>
                                {showAdminTooltip && (
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-[#1e293b] border border-amber-500/30 text-white text-xs p-3 rounded-xl shadow-xl z-50 text-center animate-fade-in-up">
                                        <div className="font-bold text-amber-500 mb-1 flex items-center justify-center gap-1">
                                            <ShieldCheck className="w-3 h-3"/> هذا الحساب موثَّق.
                                        </div>
                                        <p className="text-gray-300">لانه من مالك المجتمع</p>
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

                {/* Metadata */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#71767b] text-[14px] mt-3 items-center">
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

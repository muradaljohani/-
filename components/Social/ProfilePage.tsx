
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon, Mail } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, db } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from './PostCard';
import { EditProfileModal } from './EditProfileModal';
import { User } from '../../types';

interface Props {
    userId: string;
    onBack: () => void;
}

export const ProfilePage: React.FC<Props> = ({ userId, onBack }) => {
    const { user: currentUser, followUser, unfollowUser } = useAuth();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');

    const isOwnProfile = currentUser?.id === userId;
    const isFollowing = currentUser?.following?.includes(userId);

    // --- ADMIN HARDCODED DATA BYPASS ---
    const ADMIN_BYPASS_IDS = ["admin-fixed-id", "admin-murad-main-id"];

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
                    isGold: true, // Assuming this maps to isGold for UI
                    avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
                    coverImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1500&q=80",
                    bio: "Founder & CEO of Milaf | مؤسس مجتمع ميلاف 🦅",
                    address: "Saudi Arabia",
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    loginMethod: 'email',
                    linkedProviders: [],
                    xp: 99999,
                    level: 99,
                    nextLevelXp: 100000,
                    followers: Array(11711).fill('f'), // Mock array for count
                    following: Array(42).fill('f'),
                    primeSubscription: { status: 'active' } as any
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
                    const postsQuery = query(
                        collection(db, 'posts'),
                        where('user.uid', '==', userId)
                    );
                    const postsSnap = await getDocs(postsQuery);
                    const userPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    
                    // Client-side sort
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
    }, [userId, currentUser]); // Refetch if currentUser changes

    const handleFollowToggle = () => {
        if (!currentUser) return alert("يرجى تسجيل الدخول");
        if (isFollowing) {
            unfollowUser(userId);
        } else {
            followUser(userId);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>;
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen bg-black text-white p-4">
                <button onClick={onBack} className="flex items-center gap-2 mb-4 text-blue-500">
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180"/> عودة
                </button>
                <div className="text-center py-20 text-gray-500">المستخدم غير موجود</div>
            </div>
        );
    }

    const joinDate = profileUser.joinDate 
        ? new Date(profileUser.joinDate).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }) 
        : 'منذ فترة';

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-20" dir="rtl">
            
            {/* Header */}
            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md px-4 py-2 flex items-center gap-6 border-b border-[#2f3336]">
                <button onClick={onBack} className="p-2 hover:bg-[#18191c] rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white rtl:rotate-180"/>
                </button>
                <div>
                    <h2 className="font-bold text-lg text-white leading-tight">{profileUser.name}</h2>
                    <p className="text-xs text-[#71767b]">{posts.length} منشور</p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-48 bg-[#333639] relative">
                {profileUser.coverImage ? (
                    <img src={profileUser.coverImage} className="w-full h-full object-cover" alt="Banner"/>
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900"></div>
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 relative mb-4">
                <div className="flex justify-between items-start">
                    <div className="-mt-16 bg-black p-1 rounded-full">
                         <img 
                            src={profileUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser.id}`} 
                            className="w-32 h-32 rounded-full object-cover border-2 border-black bg-gray-800"
                            alt={profileUser.name}
                        />
                    </div>
                    <div className="mt-3">
                        {isOwnProfile ? (
                            <button 
                                onClick={() => setIsEditOpen(true)}
                                className="px-4 py-1.5 border border-[#536471] rounded-full font-bold text-sm hover:bg-[#18191c] transition-colors"
                            >
                                تعديل الملف الشخصي
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button className="p-2 border border-[#536471] rounded-full hover:bg-[#18191c]">
                                    <Mail className="w-5 h-5"/>
                                </button>
                                <button 
                                    onClick={handleFollowToggle}
                                    className={`px-5 py-1.5 rounded-full font-bold text-sm transition-colors ${
                                        isFollowing 
                                        ? 'border border-[#536471] hover:bg-red-900/20 hover:text-red-500 hover:border-red-500' 
                                        : 'bg-white text-black hover:bg-[#eff3f4]'
                                    }`}
                                >
                                    {isFollowing ? 'متابعة' : 'تابع'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3">
                    <h1 className="font-black text-xl text-white">{profileUser.name}</h1>
                    <p className="text-[#71767b] text-sm dir-ltr text-right font-mono">@{profileUser.username || profileUser.id.slice(0,8)}</p>
                </div>

                {profileUser.bio && (
                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{profileUser.bio}</p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#71767b] text-sm mt-3">
                    {profileUser.address && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4"/> {profileUser.address}
                        </div>
                    )}
                    {profileUser.customFormFields?.website && (
                         <div className="flex items-center gap-1">
                            <LinkIcon className="w-4 h-4"/> 
                            <a href={profileUser.customFormFields.website} target="_blank" className="text-blue-400 hover:underline">{profileUser.customFormFields.website.replace('https://','')}</a>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4"/> انضم في {joinDate}
                    </div>
                </div>

                <div className="flex gap-5 text-sm mt-3">
                    <div className="hover:underline cursor-pointer">
                        <span className="font-bold text-white">{profileUser.following?.length || 0}</span> <span className="text-[#71767b]">متابعة</span>
                    </div>
                    <div className="hover:underline cursor-pointer">
                        <span className="font-bold text-white">{profileUser.followers?.length || 0}</span> <span className="text-[#71767b]">متابِع</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2f3336] mt-2">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 text-sm font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === 'posts' ? 'text-white' : 'text-[#71767b]'}`}
                >
                    المنشورات
                    {activeTab === 'posts' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('media')}
                    className={`flex-1 py-3 text-sm font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === 'media' ? 'text-white' : 'text-[#71767b]'}`}
                >
                    الوسائط
                    {activeTab === 'media' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('likes')}
                    className={`flex-1 py-3 text-sm font-bold relative hover:bg-[#18191c] transition-colors ${activeTab === 'likes' ? 'text-white' : 'text-[#71767b]'}`}
                >
                    الإعجابات
                    {activeTab === 'likes' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>}
                </button>
            </div>

            {/* Posts Feed */}
            <div>
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onClick={() => {}} />
                ))}
                {posts.length === 0 && (
                    <div className="p-8 text-center text-[#71767b]">
                        لا توجد منشورات لعرضها
                    </div>
                )}
            </div>

            {isOwnProfile && <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />}
        </div>
    );
};

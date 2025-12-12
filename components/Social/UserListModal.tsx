
import React, { useState, useEffect } from 'react';
import { X, User as UserIcon } from 'lucide-react';
import { doc, getDoc, db } from '../../src/lib/firebase';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    userIds: string[]; // List of user IDs to fetch
}

export const UserListModal: React.FC<Props> = ({ isOpen, onClose, title, userIds }) => {
    const { user: currentUser, followUser, unfollowUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                setLoading(true);
                const fetchedUsers: User[] = [];

                // SPECIAL: If this is the "Admin" or "Murad" profile, generate high-quality mocks
                // The profile page passes 'mock-follower-1' for admin profiles
                if (userIds.includes('mock-follower-1')) {
                     // Generate distinct, high-quality mock profiles
                     const mocks = Array.from({ length: 15 }).map((_, i) => ({
                         id: `mock-admin-follower-${i}`,
                         name: i === 0 ? "سارة التقنية" : i === 1 ? "محمد المطور" : `متابع مميز ${i+1}`,
                         username: `user_${i+100}`,
                         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i+50}`,
                         bio: 'مهتم بالتقنية والبرمجة | مطور واجهات',
                         verified: i < 3 // First 3 are verified
                     } as unknown as User));
                     setUsers(mocks);
                     setLoading(false);
                     return;
                }

                // If real user list is empty
                if (!userIds || userIds.length === 0) {
                    setUsers([]);
                    setLoading(false);
                    return;
                }

                // Limit to first 20 for performance in this demo
                const idsToFetch = userIds.slice(0, 20);

                // Real Firebase Fetch
                try {
                    const promises = idsToFetch.map(id => getDoc(doc(db, 'users', id)));
                    const snapshots = await Promise.all(promises);
                    
                    snapshots.forEach(snap => {
                        if (snap.exists()) {
                            fetchedUsers.push({ id: snap.id, ...snap.data() } as User);
                        }
                    });
                    setUsers(fetchedUsers);
                } catch (error) {
                    console.error("Error fetching user list:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        }
    }, [isOpen, userIds]);

    if (!isOpen) return null;

    const handleFollowClick = (targetId: string) => {
        if (!currentUser) {
            alert("يجب تسجيل الدخول لمتابعة المستخدمين.");
            return;
        }
        const isFollowing = currentUser.following?.includes(targetId);
        if (isFollowing) {
            unfollowUser(targetId);
        } else {
            followUser(targetId);
        }
    };

    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-md bg-[#0f172a] border border-[#2f3336] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-[#2f3336] bg-[#1e293b]">
                    <h2 className="text-white font-bold text-lg">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            القائمة فارغة حالياً.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {users.map(u => {
                                const isMe = currentUser?.id === u.id;
                                const isFollowing = currentUser?.following?.includes(u.id);

                                return (
                                    <div key={u.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.id}`} 
                                                className="w-10 h-10 rounded-full object-cover border border-[#2f3336]"
                                                alt={u.name}
                                            />
                                            <div className="flex flex-col text-left">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-white font-bold text-sm truncate max-w-[150px]">{u.name}</span>
                                                    {u.verified && (
                                                        <span className="bg-blue-500 rounded-full p-0.5"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></span>
                                                    )}
                                                </div>
                                                <span className="text-gray-500 text-xs dir-ltr text-right">@{u.username || u.id.slice(0,6)}</span>
                                            </div>
                                        </div>
                                        
                                        {!isMe && (
                                            <button 
                                                onClick={() => handleFollowClick(u.id)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                                    isFollowing 
                                                    ? 'border border-gray-600 text-white hover:bg-red-900/20 hover:border-red-500 hover:text-red-500' 
                                                    : 'bg-white text-black hover:bg-gray-200'
                                                }`}
                                            >
                                                {isFollowing ? 'متابع' : 'متابعة'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

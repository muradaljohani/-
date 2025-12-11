
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

                // Limit to first 20 for performance in this demo
                // In production, use pagination
                const idsToFetch = userIds.slice(0, 20);

                if (idsToFetch.length === 0) {
                    setUsers([]);
                    setLoading(false);
                    return;
                }

                // If these are mock admin IDs, generate mock users
                if (userIds.includes('mock-follower-1')) {
                     const mocks = Array.from({ length: 5 }).map((_, i) => ({
                         id: `mock-${i}`,
                         name: `مستخدم ميلاف ${i+1}`,
                         username: `user_${i+1}`,
                         avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${i}`,
                         bio: 'عضو في مجتمع ميلاف'
                     } as User));
                     setUsers(mocks);
                     setLoading(false);
                     return;
                }

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
        if (!currentUser) return;
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
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            لا يوجد مستخدمين هنا.
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
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold text-sm">{u.name}</span>
                                                <span className="text-gray-500 text-xs dir-ltr text-right">@{u.username || u.id.slice(0,6)}</span>
                                            </div>
                                        </div>
                                        
                                        {!isMe && currentUser && (
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

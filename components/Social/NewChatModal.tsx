
import React, { useState } from 'react';
import { X, Search, User } from 'lucide-react';
import { collection, query, where, getDocs, db } from '../../src/lib/firebase';
import { User as UserType } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUserSelect: (user: UserType) => void;
    currentUserId: string;
}

export const NewChatModal: React.FC<Props> = ({ isOpen, onClose, onUserSelect, currentUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            // Simple search by exact username or email for security/privacy
            // Or prefix search if supported. Here we do a simple check.
            const usersRef = collection(db, 'users');
            // Note: Firestore doesn't support native fuzzy search easily without external tools.
            // We will search by username exact match or fetch a small batch.
            // For this demo, we'll fetch users where username >= searchTerm (prefix search simulation)
            
            const q = query(
                usersRef, 
                where('username', '>=', searchTerm),
                where('username', '<=', searchTerm + '\uf8ff')
            );
            
            const snapshot = await getDocs(q);
            const users = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as UserType))
                .filter(u => u.id !== currentUserId); // Exclude self

            setSearchResults(users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[6000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans" dir="rtl">
            <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white font-bold">رسالة جديدة</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                
                <div className="p-4">
                    <form onSubmit={handleSearch} className="relative">
                        <input 
                            type="text" 
                            placeholder="بحث باسم المستخدم..." 
                            className="w-full bg-black/30 border border-gray-600 rounded-xl py-3 px-4 pl-10 text-white focus:border-blue-500 outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {loading && <div className="text-center text-gray-500 p-4">جاري البحث...</div>}
                    
                    {!loading && searchResults.length === 0 && searchTerm && (
                        <div className="text-center text-gray-500 p-4">لم يتم العثور على مستخدمين</div>
                    )}

                    {searchResults.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => onUserSelect(user)}
                            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                        >
                            <img 
                                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.id}`} 
                                className="w-10 h-10 rounded-full object-cover border border-gray-600"
                            />
                            <div>
                                <div className="text-white font-bold text-sm">{user.name}</div>
                                <div className="text-gray-500 text-xs dir-ltr text-right">@{user.username || user.id.slice(0,6)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

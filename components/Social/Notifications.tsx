
import React, { useState, useEffect } from 'react';
import { 
  Heart, User, MessageCircle, Star, ArrowRight, Bell 
} from 'lucide-react';
import { 
  collection, query, onSnapshot, 
  doc, updateDoc, db, limit
} from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'reply' | 'mention';
  actorName: string;
  actorAvatar: string;
  content?: string;
  postId?: string;
  read: boolean;
  timestamp: any;
}

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    try {
        const notifsRef = collection(db, 'users', user.id, 'notifications');
        const q = query(notifsRef, limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Notification[];
            
            // Sort client-side
            data.sort((a, b) => {
                const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
                const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
                return tB - tA; // Newest first
            });

            setNotifications(data);
            setLoading(false);

            // Mark all as read after a short delay (UX)
            const unreadBatch = snapshot.docs.filter(doc => !doc.data().read);
            if (unreadBatch.length > 0) {
                setTimeout(() => {
                unreadBatch.forEach(docSnap => {
                    updateDoc(doc(db, 'users', user.id, 'notifications', docSnap.id), { read: true });
                });
                }, 2000);
            }
        }, (error) => {
            console.error("Notifications Page Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    } catch (e) {
        console.error("Notifications Page Setup Error:", e);
        setLoading(false);
    }
  }, [user]);

  if (loading) {
      return (
          <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#1d9bf0] border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-6 h-6 text-[#f91880] fill-[#f91880]" />;
      case 'follow': return <User className="w-6 h-6 text-[#1d9bf0] fill-[#1d9bf0]" />;
      case 'reply': return <MessageCircle className="w-6 h-6 text-[#1d9bf0]" />;
      default: return <Star className="w-6 h-6 text-[#71767b]" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-3 border-b border-[#2f3336] flex justify-between items-center">
        <h2 className="text-xl font-bold">التنبيهات</h2>
        <Bell className="w-5 h-5 text-[#e7e9ea]" />
      </div>

      {/* List */}
      <div className="divide-y divide-[#2f3336]">
        {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#71767b]">
                <p>لا توجد تنبيهات جديدة.</p>
            </div>
        ) : (
            notifications.map((notif) => (
            <div 
                key={notif.id} 
                className={`flex gap-3 p-4 transition-colors hover:bg-[#080808] ${!notif.read ? 'bg-[#16181c]' : ''}`}
            >
                <div className="mt-1 w-8 flex justify-end">
                    {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                         <img 
                            src={notif.actorAvatar} 
                            className="w-8 h-8 rounded-full object-cover" 
                            alt={notif.actorName} 
                         />
                    </div>
                    
                    <div className="text-[15px]">
                        <span className="font-bold text-white ml-1">{notif.actorName}</span>
                        <span className="text-[#71767b]">
                            {notif.type === 'like' && 'أعجب بمنشورك'}
                            {notif.type === 'follow' && 'قام بمتابعتك'}
                            {notif.type === 'reply' && 'رد على منشورك'}
                        </span>
                    </div>

                    {notif.content && (
                        <p className="text-[#71767b] text-sm leading-relaxed line-clamp-2">
                            {notif.content}
                        </p>
                    )}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

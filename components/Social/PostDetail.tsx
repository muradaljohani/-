
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, MoreHorizontal, MessageCircle, Repeat, Heart, Share2, 
  Image as ImageIcon, BarChart2, MapPin, X, Calendar, Gift
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, db } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface Props {
    postId: string;
    onBack: () => void;
}

export const PostDetail: React.FC<Props> = ({ postId, onBack }) => {
    const { user } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [replyText, setReplyText] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch Post & Real-time Replies
    useEffect(() => {
        if (!postId) return;

        // 1. Fetch Main Post
        const fetchPost = async () => {
            const docRef = doc(db, 'posts', postId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPost({ id: docSnap.id, ...docSnap.data() });
            }
            setLoading(false);
        };

        fetchPost();

        // 2. Listen to Replies
        const repliesRef = collection(db, 'posts', postId, 'replies');
        const q = query(repliesRef, orderBy('timestamp', 'asc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setReplies(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => unsubscribe();
    }, [postId]);

    const handleReply = async () => {
        if (!replyText.trim() || !user) return;
        
        try {
            const repliesRef = collection(db, 'posts', postId, 'replies');
            await addDoc(repliesRef, {
                text: replyText,
                user: {
                    name: user.name,
                    handle: user.username ? `@${user.username}` : `@${user.id.slice(0,5)}`,
                    avatar: user.avatar
                },
                timestamp: serverTimestamp(),
                likes: 0
            });
            setReplyText('');
        } catch (e) {
            console.error("Reply failed", e);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#71767b]">Loading...</div>;
    if (!post) return null;

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans pb-32 relative" dir="rtl">
            
            {/* 1. Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-[#2f3336]">
                <button onClick={onBack} className="p-2 -mr-2 hover:bg-[#18191c] rounded-full transition-colors">
                    <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
                </button>
                <h2 className="text-xl font-bold">منشور</h2>
            </div>

            {/* 2. Main Post */}
            <div className="px-4 pt-4">
                {/* User Info Row */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                        <img 
                            src={post.user?.avatar} 
                            alt={post.user?.name} 
                            className="w-10 h-10 rounded-full object-cover border border-[#2f3336]"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="font-bold text-[15px] text-[#e7e9ea]">{post.user?.name}</span>
                            <span className="text-[#71767b] text-[14px] dir-ltr text-right">{post.user?.handle}</span>
                        </div>
                    </div>
                    <button className="text-[#71767b] hover:bg-[#031018] hover:text-[#1d9bf0] p-1.5 rounded-full transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="text-xl leading-normal whitespace-pre-wrap mb-3 text-[#e7e9ea] font-normal">
                    {post.content}
                </div>

                {/* Image */}
                {post.image && (
                    <div className="rounded-2xl overflow-hidden border border-[#2f3336] mb-3 w-full">
                        <img src={post.image} className="w-full h-auto object-cover" />
                    </div>
                )}
                {post.images && post.images.length > 0 && (
                     <div className="rounded-2xl overflow-hidden border border-[#2f3336] mb-3 w-full">
                        <img src={post.images[0]} className="w-full h-auto object-cover" />
                    </div>
                )}

                {/* Date & Views */}
                <div className="py-4 border-b border-[#2f3336] text-[#71767b] text-[15px] flex items-center gap-1 font-normal">
                    <span>{new Date(post.createdAt?.toDate ? post.createdAt.toDate() : Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>·</span>
                    <span>{new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                    <span>·</span>
                    <span className="text-white font-bold">{post.views || '12K'}</span>
                    <span>مشاهدة</span>
                </div>

                {/* Stats Row */}
                <div className="py-3 border-b border-[#2f3336] flex gap-6 text-[14px]">
                    <div className="flex gap-1">
                        <span className="font-bold text-[#e7e9ea]">{post.retweets || 0}</span>
                        <span className="text-[#71767b]">إعادة نشر</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="font-bold text-[#e7e9ea]">{post.likes || 0}</span>
                        <span className="text-[#71767b]">إعجاب</span>
                    </div>
                </div>

                {/* Action Icons Row */}
                <div className="flex justify-around items-center py-2 border-b border-[#2f3336] text-[#71767b]">
                    <button className="p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] rounded-full transition-colors"><MessageCircle className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-[#00ba7c]/10 hover:text-[#00ba7c] rounded-full transition-colors"><Repeat className="w-5 h-5" /></button>
                    <button onClick={() => setIsLiked(!isLiked)} className={`p-2 hover:bg-[#f91880]/10 hover:text-[#f91880] rounded-full transition-colors ${isLiked ? 'text-[#f91880]' : ''}`}>
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
                </div>
            </div>

            {/* 3. Replies Feed */}
            <div>
                {replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 p-4 border-b border-[#2f3336] hover:bg-[#080808] transition-colors">
                        <img src={reply.user.avatar} className="w-10 h-10 rounded-full object-cover border border-[#2f3336]" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-[15px] mb-0.5">
                                <span className="font-bold text-[#e7e9ea]">{reply.user.name}</span>
                                <span className="text-[#71767b] dir-ltr text-sm">{reply.user.handle}</span>
                                <span className="text-[#71767b] text-sm">· {new Date(reply.timestamp?.toDate ? reply.timestamp.toDate() : Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="text-[#e7e9ea] text-[15px] leading-relaxed">
                                {reply.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. Fixed Reply Input */}
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#2f3336] px-4 py-2 pb-safe z-50">
                 {/* Visual Thread Connector Line */}
                 {/* Note: This simulates the visual cue requested */}
                 
                 <div className="flex gap-3 items-end">
                    <div className="flex flex-col items-center justify-end h-full pb-2">
                         <img 
                            src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} 
                            className="w-10 h-10 rounded-full object-cover border border-[#2f3336]"
                         />
                    </div>
                    
                    <div className="flex-1">
                         {/* Input Area */}
                         <div className="relative">
                            <textarea 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="انشر ردك"
                                className="w-full bg-transparent text-xl text-white placeholder-[#71767b] outline-none resize-none min-h-[40px] max-h-32 py-3"
                                rows={1}
                            />
                        </div>

                        {/* Toolbar Row */}
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex gap-4 text-[#1d9bf0]">
                                <ImageIcon className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full" />
                                <Gift className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full" />
                                <BarChart2 className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full" />
                                <MapPin className="w-5 h-5 cursor-pointer hover:bg-[#1d9bf0]/10 rounded-full opacity-50" />
                            </div>
                            <button 
                                onClick={handleReply}
                                disabled={!replyText.trim()}
                                className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full px-5 py-1.5 text-sm disabled:opacity-50 transition-colors"
                            >
                                رد
                            </button>
                        </div>
                    </div>
                 </div>
                 
                 {/* Vertical Gray Line Visual Cue (Absolute positioning to connect to "thread") */}
                 <div className="absolute left-[38px] bottom-[70px] top-[-1000px] w-[2px] bg-[#333639] -z-10 hidden"></div>
            </div>

        </div>
    );
};

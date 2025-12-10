
import React, { useState } from 'react';
import { 
    MessageCircle, Repeat, Heart, Share2, MoreHorizontal, 
    CheckCircle2, Crown, Pin, Play, Lock, BarChart2, Bookmark 
} from 'lucide-react';
import { SocialPost } from '../../dummyData';

interface PostCardProps {
    post: SocialPost;
    onOpenLightbox: (src: string) => void;
    onShare: (msg: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenLightbox, onShare }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    // --- HELPERS ---

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
        
        // Trigger generic vibration if on mobile
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleNativeShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: `Post by ${post.user.name}`,
            text: post.content,
            url: window.location.href // Ideally specific post URL
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                onShare('تمت المشاركة بنجاح!');
            } catch (err) {
                // User cancelled or error
            }
        } else {
            navigator.clipboard.writeText(shareData.url);
            onShare('تم نسخ الرابط للحافظة!');
        }
    };

    const renderBadge = () => {
        if (post.user.isGold) return (
            <div className="group relative inline-block">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1 cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    حساب ذهبي (Official)
                </div>
            </div>
        );
        if (post.user.verified) return (
             <div className="group relative inline-block">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 ml-1 cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    موثق (Affiliate)
                </div>
             </div>
        );
        return null;
    };

    const highlightText = (text: string) => {
        if (!text) return null;
        return text.split(/(\s+)/).map((word, i) => {
            if (word.startsWith('#') || word.startsWith('@')) {
                return <span key={i} className="text-blue-400 hover:underline cursor-pointer font-medium">{word}</span>;
            }
            if (word.match(/https?:\/\/[^\s]+/)) {
                return <a key={i} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all" onClick={e => e.stopPropagation()}>{word}</a>;
            }
            return word;
        });
    };

    return (
        <div className={`flex gap-3 p-4 border-b border-slate-800 hover:bg-white/[0.02] transition-colors cursor-pointer ${post.isPinned ? 'bg-slate-900/30' : ''}`}>
            
            {/* Avatar */}
            <div className="shrink-0">
                <div className="relative">
                    <img 
                        src={post.user.avatar} 
                        className="w-11 h-11 rounded-full object-cover border border-slate-700 hover:opacity-90 transition-opacity" 
                        alt={post.user.name} 
                    />
                    {post.user.isGold && <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-slate-700"><Crown className="w-3 h-3 text-amber-400 fill-amber-400"/></div>}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0">
                
                {/* Meta Header */}
                <div className="flex items-center justify-between text-slate-500 text-[15px] leading-tight mb-1">
                    <div className="flex items-center gap-1 overflow-hidden">
                        {post.isPinned && <Pin className="w-3 h-3 text-slate-400 fill-current mr-1" />}
                        <span className="font-bold text-white truncate hover:underline">{post.user.name}</span>
                        {renderBadge()}
                        <span className="truncate ltr text-slate-500 ml-1 text-sm" dir="ltr">{post.user.handle}</span>
                        <span className="text-slate-600 px-1">·</span>
                        <span className="text-slate-500 text-sm hover:underline">{post.timestamp}</span>
                    </div>
                    <button className="text-slate-500 hover:text-blue-400 p-1 -mr-2 rounded-full hover:bg-blue-500/10 transition-colors">
                        <MoreHorizontal className="w-4 h-4"/>
                    </button>
                </div>

                {/* Text Content */}
                <div className="text-[15px] text-slate-100 whitespace-pre-wrap leading-relaxed mt-0.5 dir-auto" style={{ wordBreak: 'break-word' }}>
                    {post.type === 'premium_locked' ? (
                        <div className="mt-3 relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-center">
                            <div className="filter blur-sm select-none opacity-40 text-sm mb-4">
                                هذا المحتوى حصري للمشتركين. يرجى الترقية للوصول الكامل إلى هذه المعلومات القيمة.
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <div className="p-3 bg-amber-500/20 rounded-full mb-3 border border-amber-500/50">
                                    <Lock className="w-5 h-5 text-amber-500"/>
                                </div>
                                <h4 className="text-white font-bold mb-1">محتوى حصري</h4>
                                <button className="mt-2 px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg">
                                    فتح المحتوى
                                </button>
                            </div>
                        </div>
                    ) : (
                        highlightText(post.content || '')
                    )}
                </div>

                {/* Media Grid (Twitter Style) */}
                {post.images && post.images.length > 0 && (
                    <div className={`mt-3 rounded-2xl overflow-hidden border border-slate-800 relative ${
                        post.images.length === 1 ? '' : 
                        post.images.length === 2 ? 'grid grid-cols-2 gap-0.5' :
                        post.images.length === 3 ? 'grid grid-cols-2 gap-0.5' :
                        'grid grid-cols-2 gap-0.5'
                    }`}>
                        {post.images.slice(0, 4).map((img, i) => (
                            <div 
                                key={i} 
                                className={`relative bg-slate-900 cursor-zoom-in overflow-hidden ${
                                    post.images?.length === 3 && i === 0 ? 'row-span-2 h-full' : 'aspect-[16/9] md:aspect-square'
                                }`}
                                onClick={(e) => { e.stopPropagation(); onOpenLightbox(img); }}
                            >
                                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                                {post.images!.length > 4 && i === 3 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl">
                                        +{post.images!.length - 4}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions Bar */}
                <div className="flex justify-between items-center mt-3 text-slate-500 max-w-md">
                    
                    <div className="flex items-center gap-1 group transition-colors hover:text-blue-400">
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2 transition-colors">
                            <MessageCircle className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{post.replies > 0 ? formatNumber(post.replies) : ''}</span>
                    </div>

                    <div className="flex items-center gap-1 group transition-colors hover:text-green-400">
                        <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                            <Repeat className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{post.retweets > 0 ? formatNumber(post.retweets) : ''}</span>
                    </div>

                    <div 
                        className={`flex items-center gap-1 group transition-colors cursor-pointer ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        onClick={handleLike}
                    >
                        <div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors relative">
                            <Heart className={`w-4.5 h-4.5 transition-transform ${liked ? 'fill-current scale-125' : 'group-active:scale-90'}`}/>
                        </div>
                        <span className="text-xs font-medium">{likeCount > 0 ? formatNumber(likeCount) : ''}</span>
                    </div>

                    <div className="flex items-center gap-1 group transition-colors hover:text-blue-400 hidden sm:flex">
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <BarChart2 className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{post.views || '1.2K'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div 
                             className={`p-2 rounded-full transition-colors cursor-pointer ${bookmarked ? 'text-blue-400' : 'hover:text-blue-400 hover:bg-blue-500/10'}`}
                             onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
                        >
                            <Bookmark className={`w-4.5 h-4.5 ${bookmarked ? 'fill-current' : ''}`}/>
                        </div>
                        <div 
                            className="p-2 rounded-full hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                            onClick={handleNativeShare}
                        >
                            <Share2 className="w-4.5 h-4.5"/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

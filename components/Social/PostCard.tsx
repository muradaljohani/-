import React, { useState } from 'react';
import { 
    MessageCircle, Repeat, Heart, Share2, MoreHorizontal, 
    CheckCircle2, Crown, Pin, Play, Lock, BarChart2, Bookmark 
} from 'lucide-react';
import { SocialPost } from '../../dummyData';

interface PostCardProps {
    post: SocialPost;
    onOpenLightbox?: (src: string) => void;
    onShare?: (msg: string) => void;
    onClick?: () => void;
    isFocusMode?: boolean; // New Prop for Focus Mode
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenLightbox, onShare, onClick, isFocusMode = false }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleNativeShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onShare) onShare('Opening Share...');
        
        const shareData = {
            title: `Post by ${post.user.name}`,
            text: post.content,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {}
        } else {
            navigator.clipboard.writeText(shareData.url);
            if(onShare) onShare('تم نسخ الرابط!');
        }
    };

    const handleLightbox = (e: React.MouseEvent, img: string) => {
        e.stopPropagation();
        if (onOpenLightbox) onOpenLightbox(img);
    }

    const renderBadge = () => {
        if (post.user.isGold) return (
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-1" />
        );
        if (post.user.verified) return (
             <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 ml-1" />
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

    // Helper to conditionally show metric
    const showMetric = (count: number) => {
        if (isFocusMode) return <span>•</span>;
        return count > 0 ? formatNumber(count) : '';
    };

    return (
        <div 
            className={`flex gap-3 p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer ${post.isPinned ? 'bg-[var(--bg-secondary)]/50' : ''}`}
            onClick={onClick}
        >
            <div className="shrink-0">
                <img 
                    src={post.user.avatar} 
                    className="w-11 h-11 rounded-full object-cover border border-[var(--border-color)]" 
                    alt={post.user.name} 
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[var(--text-secondary)] text-[15px] leading-tight mb-1">
                    <div className="flex items-center gap-1 overflow-hidden">
                        {post.isPinned && <Pin className="w-3 h-3 text-[var(--text-secondary)] fill-current mr-1" />}
                        <span className="font-bold text-[var(--text-primary)] truncate hover:underline">{post.user.name}</span>
                        {renderBadge()}
                        <span className="truncate ltr text-[var(--text-secondary)] ml-1 text-sm" dir="ltr">{post.user.handle}</span>
                        <span className="text-[var(--text-secondary)] px-1">·</span>
                        <span className="text-[var(--text-secondary)] text-sm">{post.timestamp}</span>
                    </div>
                    <button className="p-1 -mr-2 rounded-full hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] transition-colors" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="w-4 h-4"/>
                    </button>
                </div>

                <div className="text-[15px] text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed mt-0.5" style={{ wordBreak: 'break-word' }}>
                    {highlightText(post.content || '')}
                </div>

                {post.images && post.images.length > 0 && (
                    <div className={`mt-3 rounded-2xl overflow-hidden border border-[var(--border-color)] relative ${
                        post.images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''
                    }`}>
                        {post.images.slice(0, 4).map((img, i) => (
                            <div 
                                key={i} 
                                className={`relative bg-[var(--bg-secondary)] overflow-hidden ${
                                    post.images?.length === 3 && i === 0 ? 'row-span-2 h-full' : 'aspect-[16/9]'
                                }`}
                                onClick={(e) => handleLightbox(e, img)}
                            >
                                <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-3 text-[var(--text-secondary)] max-w-md">
                    <button className="flex items-center gap-1 group transition-colors hover:text-blue-400" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2 transition-colors">
                            <MessageCircle className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{showMetric(post.replies)}</span>
                    </button>

                    <button className="flex items-center gap-1 group transition-colors hover:text-green-400" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                            <Repeat className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{showMetric(post.retweets)}</span>
                    </button>

                    <button 
                        className={`flex items-center gap-1 group transition-colors ${liked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                        onClick={handleLike}
                    >
                        <div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors">
                            <Heart className={`w-4.5 h-4.5 transition-transform ${liked ? 'fill-current scale-125' : ''}`}/>
                        </div>
                        <span className="text-xs font-medium">{showMetric(likeCount)}</span>
                    </button>

                    <button className="flex items-center gap-1 group transition-colors hover:text-blue-400" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <BarChart2 className="w-4.5 h-4.5"/>
                        </div>
                        <span className="text-xs font-medium">{isFocusMode ? '•' : (post.views || '1K')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:text-blue-400 hover:bg-blue-500/10 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Bookmark className="w-4.5 h-4.5"/>
                        </button>
                        <button className="p-2 rounded-full hover:text-blue-400 hover:bg-blue-500/10 transition-colors" onClick={handleNativeShare}>
                            <Share2 className="w-4.5 h-4.5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
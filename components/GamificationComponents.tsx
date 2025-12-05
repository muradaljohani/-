
import React, { useState, useEffect } from 'react';
import { Trophy, Flame, MessageCircle, Send, ThumbsUp, Crown, Star, MoreHorizontal, User, ShieldCheck } from 'lucide-react';
import { GamificationCore } from '../services/GamificationCore';
import { LeaderboardEntry, Comment, UserXPProfile } from '../types/gamification';
import { useAuth } from '../context/AuthContext';

const core = GamificationCore.getInstance();

// --- 1. HEADER WIDGET (Streak & Level) ---
export const GamificationHUD: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserXPProfile | null>(null);

    useEffect(() => {
        if (user) {
            // Initial Load & Streak Check
            core.processDailyLogin(user.id);
            setProfile(core.getUserProfile(user.id));
            
            // Poll for updates (e.g. if XP changes elsewhere)
            const interval = setInterval(() => {
                setProfile(core.getUserProfile(user.id));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    if (!profile) return null;

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full" title="Daily Streak">
                <Flame className={`w-4 h-4 ${profile.currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-gray-500'}`} />
                <span className="text-xs font-bold text-orange-400">{profile.currentStreak} Day</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-blue-200">Lvl {profile.level}</span>
                <div className="w-16 h-1.5 bg-gray-700 rounded-full ml-1 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400" 
                        style={{ width: `${(profile.totalXP % 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// --- 2. LEADERBOARD WIDGET ---
export const LeaderboardWidget: React.FC = () => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        setLeaders(core.getLeaderboard());
    }, []);

    return (
        <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-4 mb-4">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> أبطال الأسبوع
            </h3>
            <div className="space-y-3">
                {leaders.map((leader, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${idx === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-black/20'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 flex items-center justify-center font-bold text-xs text-gray-400">
                                {idx + 1}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">{leader.name}</span>
                                <span className="text-[10px] text-gray-500">Level {leader.level}</span>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{leader.xp} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 3. DISCUSSION & SOCIAL PANEL ---
interface DiscussionProps {
    lessonId: string;
}

export const DiscussionPanel: React.FC<DiscussionProps> = ({ lessonId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setComments(core.getComments(lessonId));
    }, [lessonId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        
        core.postComment(lessonId, user.id, user.name, newComment);
        setComments(core.getComments(lessonId)); // Refresh
        setNewComment('');
    };

    const handleUpvote = (commentId: string) => {
        core.upvoteComment(lessonId, commentId);
        setComments(core.getComments(lessonId)); // Refresh
    };

    return (
        <div className="flex flex-col h-full bg-[#0f172a] border-t border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#1e293b] flex justify-between items-center">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-400" /> النقاشات المجتمعية
                </h3>
                <span className="text-[10px] text-gray-500 bg-black/30 px-2 py-1 rounded">{comments.length} تعليق</span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-xs">
                        كن أول من يسأل أو يشارك معلومة في هذا الدرس!
                    </div>
                )}
                {comments.map(comment => (
                    <div key={comment.id} className={`flex gap-3 ${comment.isPinned ? 'bg-amber-900/10 border border-amber-500/20 p-3 rounded-xl' : ''}`}>
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold border border-white/10">
                                {comment.userName.charAt(0)}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-white block">{comment.userName}</span>
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                        Lvl {comment.userLevel} • {new Date(comment.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                {comment.isPinned && <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />}
                            </div>
                            <p className="text-xs text-gray-300 mt-1 leading-relaxed">{comment.text}</p>
                            
                            <div className="flex items-center gap-4 mt-2">
                                <button 
                                    onClick={() => handleUpvote(comment.id)}
                                    className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-blue-400 transition-colors"
                                >
                                    <ThumbsUp className="w-3 h-3" /> {comment.upvotes || 0}
                                </button>
                                <button className="text-[10px] text-gray-500 hover:text-white transition-colors">رد</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-[#1e293b] border-t border-white/10">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "أضف سؤالاً أو تعليقاً..." : "سجل دخول للمشاركة"}
                        disabled={!user}
                        className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={!user || !newComment.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                    >
                        <Send className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- 4. LEVEL UP MODAL ---
export const LevelUpOverlay: React.FC<{ level: number, onClose: () => void }> = ({ level, onClose }) => {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-[#0f172a] border border-yellow-500/50 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] relative overflow-hidden max-w-sm w-full">
                {/* Confetti Simulated Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                    <Crown className="w-12 h-12 text-white fill-white" />
                </div>
                
                <h2 className="text-3xl font-black text-white mb-2 uppercase italic">Level Up!</h2>
                <p className="text-yellow-400 font-bold text-lg mb-6">You reached Level {level}</p>
                
                <p className="text-gray-400 text-sm mb-8">
                    Congratulations! You've unlocked new badges and higher visibility in the community.
                </p>
                
                <button onClick={onClose} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Awesome!
                </button>
            </div>
        </div>
    );
};

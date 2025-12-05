
// --- GAMIFICATION SCHEMA ---

export interface UserXPProfile {
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  lastLoginDate: string; // ISO Date
  badges: string[]; // IDs of earned badges
}

export interface XPActionLog {
  id: string;
  userId: string;
  actionType: 'video_watch' | 'quiz_pass' | 'daily_login' | 'comment' | 'upvote';
  xpGained: number;
  timestamp: string;
}

export interface Comment {
  id: string;
  courseId: string;
  lessonId: string; // Contextual linkage
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  text: string;
  upvotes: number;
  isPinned: boolean; // Admin/Instructor only
  timestamp: string;
  replies: Comment[];
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  xpThreshold?: number;
  condition?: string; // Description of logic
}


import { UserXPProfile, Comment, LeaderboardEntry } from '../types/gamification';

// --- GAMIFICATION ENGINE (The "Backend" Logic) ---
export class GamificationCore {
  private static instance: GamificationCore;
  
  // Simulated DB Tables
  private xpTable: Map<string, UserXPProfile> = new Map();
  private commentsTable: Map<string, Comment[]> = new Map(); // Key: lessonId

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): GamificationCore {
    if (!GamificationCore.instance) {
      GamificationCore.instance = new GamificationCore();
    }
    return GamificationCore.instance;
  }

  private loadFromStorage() {
    try {
      const storedXP = localStorage.getItem('gamification_xp_table');
      const storedComments = localStorage.getItem('gamification_comments_table');
      
      if (storedXP) this.xpTable = new Map(JSON.parse(storedXP));
      if (storedComments) this.commentsTable = new Map(JSON.parse(storedComments));
    } catch (e) {
      console.warn("Gamification DB reset");
    }
  }

  private saveToStorage() {
    localStorage.setItem('gamification_xp_table', JSON.stringify(Array.from(this.xpTable.entries())));
    localStorage.setItem('gamification_comments_table', JSON.stringify(Array.from(this.commentsTable.entries())));
  }

  // --- 1. THE XP ENGINE ---

  public getUserProfile(userId: string): UserXPProfile {
    if (!this.xpTable.has(userId)) {
      this.xpTable.set(userId, {
        userId,
        totalXP: 0,
        level: 1,
        currentStreak: 1,
        lastLoginDate: new Date().toISOString(),
        badges: []
      });
    }
    return this.xpTable.get(userId)!;
  }

  public awardXP(userId: string, amount: number, action: string): { newLevel: boolean, level: number } {
    const profile = this.getUserProfile(userId);
    const oldLevel = profile.level;
    
    profile.totalXP += amount;
    // Formula: Level = sqrt(XP / 100). Example: 400XP = Level 2. 900XP = Level 3.
    profile.level = Math.floor(Math.sqrt(profile.totalXP / 100)) + 1;
    
    this.xpTable.set(userId, profile);
    this.saveToStorage();

    return { newLevel: profile.level > oldLevel, level: profile.level };
  }

  public processDailyLogin(userId: string): boolean {
    const profile = this.getUserProfile(userId);
    const last = new Date(profile.lastLoginDate);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let streakIncreased = false;

    if (diffDays === 1) {
      // Consecutive day
      profile.currentStreak += 1;
      streakIncreased = true;
    } else if (diffDays > 1) {
      // Missed a day
      profile.currentStreak = 1;
    }
    // If diffDays == 0 (same day), do nothing.

    profile.lastLoginDate = now.toISOString();
    this.xpTable.set(userId, profile);
    this.saveToStorage();
    
    return streakIncreased;
  }

  public getLeaderboard(): LeaderboardEntry[] {
    // Generate mock users for competition if DB is empty
    const mockUsers: LeaderboardEntry[] = [
      { userId: 'm1', name: 'أحمد السالم', avatar: '', xp: 15400, level: 12, rank: 1 },
      { userId: 'm2', name: 'سارة علي', avatar: '', xp: 12300, level: 11, rank: 2 },
      { userId: 'm3', name: 'خالد الحربي', avatar: '', xp: 9800, level: 9, rank: 3 },
      { userId: 'm4', name: 'نورة محمد', avatar: '', xp: 8750, level: 9, rank: 4 },
    ];

    // Add current real users
    Array.from(this.xpTable.values()).forEach(p => {
        // In a real app, we'd fetch names from User DB. Here we use placeholders or passed context
        mockUsers.push({
            userId: p.userId,
            name: 'أنت (المتدرب)',
            avatar: '',
            xp: p.totalXP,
            level: p.level,
            rank: 0
        });
    });

    return mockUsers.sort((a, b) => b.xp - a.xp).map((u, i) => ({...u, rank: i + 1})).slice(0, 5);
  }

  // --- 2. COMMUNITY PULSE ---

  public getComments(lessonId: string): Comment[] {
    return this.commentsTable.get(lessonId) || [];
  }

  public postComment(lessonId: string, userId: string, userName: string, text: string): Comment {
    const comments = this.getComments(lessonId);
    const profile = this.getUserProfile(userId);
    
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      courseId: 'ctx',
      lessonId,
      userId,
      userName,
      userAvatar: '',
      userLevel: profile.level,
      text,
      upvotes: 0,
      isPinned: false,
      timestamp: new Date().toISOString(),
      replies: []
    };

    comments.unshift(newComment);
    this.commentsTable.set(lessonId, comments);
    this.saveToStorage();
    
    // Award XP for contributing
    this.awardXP(userId, 10, 'comment');
    
    return newComment;
  }

  public upvoteComment(lessonId: string, commentId: string) {
    const comments = this.getComments(lessonId);
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      comment.upvotes += 1;
      this.commentsTable.set(lessonId, comments);
      this.saveToStorage();
    }
  }

  // --- 3. ADMIN STATS ---
  public getGamificationStats() {
      const profiles = Array.from(this.xpTable.values());
      return {
          totalXPDistributed: profiles.reduce((acc, p) => acc + p.totalXP, 0),
          averageLevel: profiles.length ? Math.floor(profiles.reduce((acc, p) => acc + p.level, 0) / profiles.length) : 1,
          activeStreaks: profiles.filter(p => p.currentStreak > 3).length
      };
  }
}

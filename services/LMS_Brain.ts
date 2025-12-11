
import { Course, CourseAnalytics, SQL_UserBehavior, SQL_CourseScore } from '../types';

/**
 * ========================================================
 * MODULE 1: The 'Sensory' Tracker (Data Collection)
 * ========================================================
 * Tracks engagement "Heat": Hover duration, Video pauses, Scroll pass rate.
 */
export class BehaviorObserver {
  private static instance: BehaviorObserver;
  private activeHovers: Map<string, number> = new Map(); // courseId -> timestamp
  private sessionLogs: SQL_UserBehavior[] = [];

  private constructor() {}

  public static getInstance(): BehaviorObserver {
    if (!BehaviorObserver.instance) {
      BehaviorObserver.instance = new BehaviorObserver();
    }
    return BehaviorObserver.instance;
  }

  /**
   * Called when a user starts hovering over a course card.
   */
  public trackHoverStart(courseId: string) {
    this.activeHovers.set(courseId, Date.now());
  }

  /**
   * Called when a user stops hovering. Calculates duration.
   */
  public trackHoverEnd(courseId: string, userId: string = 'guest') {
    const start = this.activeHovers.get(courseId);
    if (start) {
      const duration = (Date.now() - start) / 1000; // seconds
      this.logBehavior(userId, courseId, 'hover', duration);
      this.activeHovers.delete(courseId);
    }
  }

  /**
   * Tracks video engagement specifically.
   */
  public trackVideoEvent(courseId: string, event: 'video_start' | 'video_pause' | 'video_complete', timeMark: number, userId: string = 'guest') {
    this.logBehavior(userId, courseId, event, timeMark, JSON.stringify({ video_minute: timeMark }));
  }

  /**
   * Internal logger that pushes to "Storage" (localStorage simulation of SQL table).
   */
  private logBehavior(userId: string, courseId: string, action: string, value: number, meta?: string) {
    const log: SQL_UserBehavior = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      user_id: userId,
      course_id: courseId,
      action_type: action as any,
      duration_seconds: value,
      timestamp: new Date().toISOString(),
      meta_data: meta
    };

    this.sessionLogs.push(log);
    
    // Simulate AJAX Sync to 'learning_logs' table
    this.syncToStorage();
  }

  private syncToStorage() {
    // In a real app, this would be `fetch('/api/logs', { method: 'POST', body: ... })`
    // Here we append to localStorage to persist across reloads for the algorithm
    try {
        const existing = JSON.parse(localStorage.getItem('learning_logs') || '[]');
        const updated = [...existing, ...this.sessionLogs];
        // Keep DB small for browser performance
        if (updated.length > 500) updated.splice(0, updated.length - 500); 
        
        localStorage.setItem('learning_logs', JSON.stringify(updated));
        this.sessionLogs = []; // Clear buffer
    } catch (e) {
        // Reset log if corrupt
        localStorage.setItem('learning_logs', '[]');
        this.sessionLogs = [];
    }
  }

  public getLogs(): SQL_UserBehavior[] {
    try {
        return JSON.parse(localStorage.getItem('learning_logs') || '[]');
    } catch (e) {
        return [];
    }
  }
}

/**
 * ========================================================
 * MODULE 2 & 3: The 'Algorithmic' Brain & Personalized Tutor
 * ========================================================
 * Calculates Relevance Scores and provides Adaptive Suggestions.
 */
export class RelevanceEngine {
  private static instance: RelevanceEngine;

  private constructor() {}

  public static getInstance(): RelevanceEngine {
    if (!RelevanceEngine.instance) {
      RelevanceEngine.instance = new RelevanceEngine();
    }
    return RelevanceEngine.instance;
  }

  /**
   * THE FORMULA: Score = (Views * 1) + (Completions * 10) + (Avg_Watch_Time * 0.5) - (Bounce_Rate * 5)
   */
  public calculateDynamicScore(stats: CourseAnalytics): number {
    const viewScore = stats.views * 1;
    const completionScore = stats.completions * 10;
    const watchScore = (stats.totalWatchTime / (stats.views || 1)) * 0.5; // Avg watch time
    const bouncePenalty = (stats.bounces / (stats.views || 1)) * 100 * 5; // Weighted bounce rate

    // Ensure score doesn't go below 0
    return Math.max(0, viewScore + completionScore + watchScore - bouncePenalty);
  }

  /**
   * Analyzes raw logs to build analytics for each course.
   */
  public analyzeCoursePerformance(courses: Course[]): Course[] {
    const logs = BehaviorObserver.getInstance().getLogs();
    
    // Map logs to analytics
    const analyticsMap = new Map<string, CourseAnalytics>();

    // Initialize
    courses.forEach(c => {
      analyticsMap.set(c.id, {
        courseId: c.id,
        views: 0,
        completions: 0,
        totalWatchTime: 0,
        bounces: 0,
        dropOffPoints: []
      });
    });

    // Process "SQL" Logs
    logs.forEach(log => {
      const stats = analyticsMap.get(log.course_id);
      if (stats) {
        if (log.action_type === 'hover') {
           // We treat hover > 3s as "Intent View"
           if (log.duration_seconds > 3) stats.views++;
        }
        if (log.action_type === 'video_start') {
           // Started video
        }
        if (log.action_type === 'video_pause' || log.action_type === 'video_complete') {
           stats.totalWatchTime += log.duration_seconds; // actually timestamp in simulation
           stats.dropOffPoints.push(log.duration_seconds);
           
           if (log.action_type === 'video_complete') stats.completions++;
           
           // Bounce logic: if watched < 10% (simulated as < 60s for now)
           if (log.duration_seconds < 60 && log.action_type !== 'video_complete') {
             stats.bounces++;
           }
        }
      }
    });

    // Apply Scoring & Sort
    return courses.map(course => {
      const stats = analyticsMap.get(course.id);
      if (!stats) return course;

      const aiScore = this.calculateDynamicScore(stats);
      const dropOffRate = stats.views > 0 ? (stats.bounces / stats.views) * 100 : 0;

      return {
        ...course,
        aiScore: parseFloat(aiScore.toFixed(2)),
        dropOffRate: parseFloat(dropOffRate.toFixed(1))
      };
    }).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)); // DESC sort
  }

  /**
   * MODULE 3: Collaborative Filtering (User A/B Logic)
   * Suggests next course based on current choice.
   */
  public getCollaborativeSuggestions(currentCourseId: string, allCourses: Course[]): Course[] {
    // In a real system, query: "SELECT course_id FROM user_behavior WHERE user_id IN (SELECT user_id FROM user_behavior WHERE course_id = ?)"
    // Here, we simulate by finding courses in the same category or with similar keywords.
    
    const target = allCourses.find(c => c.id === currentCourseId);
    if (!target) return [];

    return allCourses.filter(c => 
      c.id !== currentCourseId && 
      (c.category === target.category || c.skills.some(s => target.skills.includes(s)))
    ).slice(0, 2); // Top 2 suggestions
  }

  /**
   * MODULE 4: Content Gap Analysis (For Admin Widget)
   */
  public getContentGaps(): string[] {
    const logs = BehaviorObserver.getInstance().getLogs();
    const pausePoints: Record<string, number[]> = {};

    logs.filter(l => l.action_type === 'video_pause').forEach(l => {
      if (!pausePoints[l.course_id]) pausePoints[l.course_id] = [];
      pausePoints[l.course_id].push(l.duration_seconds);
    });

    const alerts: string[] = [];
    Object.keys(pausePoints).forEach(cId => {
      const points = pausePoints[cId];
      if (points.length > 5) {
        // Find average drop off
        const avg = points.reduce((a, b) => a + b, 0) / points.length;
        const minute = Math.floor(avg / 60);
        alerts.push(`Alert: 40% of students drop off or pause at minute ${minute}:00 of Course ${cId}. Consider re-editing.`);
      }
    });

    return alerts;
  }
}

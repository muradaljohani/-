
import { Story, User } from '../../types';

/**
 * ==============================================================================
 * EPHEMERAL CONTENT ENGINE (Stories)
 * Layer 6: The "Fear Of Missing Out" (FOMO) Generator
 * ==============================================================================
 */

export class StoryEngine {
    private static instance: StoryEngine;
    private stories: Map<string, Story> = new Map();
    private watched: Set<string> = new Set(); // Local watched set for session

    private constructor() {
        this.loadStories();
        this.cleanExpiredStories();
        // Run cleanup every minute
        setInterval(() => this.cleanExpiredStories(), 60000);
    }

    public static getInstance(): StoryEngine {
        if (!StoryEngine.instance) {
            StoryEngine.instance = new StoryEngine();
        }
        return StoryEngine.instance;
    }

    private loadStories() {
        try {
            const stored = localStorage.getItem('mylaf_stories_db');
            if (stored) {
                const parsed: Story[] = JSON.parse(stored);
                parsed.forEach(s => this.stories.set(s.id, s));
            }
            
            const watchedStored = localStorage.getItem('mylaf_watched_stories');
            if (watchedStored) {
                this.watched = new Set(JSON.parse(watchedStored));
            }
        } catch (e) { console.error("Story DB Error", e); }
    }

    private saveStories() {
        try {
            const activeStories = Array.from(this.stories.values());
            localStorage.setItem('mylaf_stories_db', JSON.stringify(activeStories));
        } catch (e) { /* Limit exceeded */ }
    }

    // --- 1. CLEANUP BOT (The Expiry Logic) ---
    private cleanExpiredStories() {
        const now = new Date().toISOString();
        let changed = false;
        
        for (const [id, story] of this.stories.entries()) {
            if (story.expiresAt < now) {
                this.stories.delete(id);
                changed = true;
            }
        }
        
        if (changed) {
            console.log("[StoryEngine] Cleaned up expired stories.");
            this.saveStories();
        }
    }

    // --- 2. CREATE STORY ---
    public createStory(
        user: User, 
        mediaUrl: string, 
        mediaType: 'image' | 'video',
        overlays: any[],
        isBoosted: boolean = false
    ): Story {
        const now = new Date();
        const expiry = new Date(now.getTime() + (isBoosted ? 48 : 24) * 60 * 60 * 1000); // 48h if boosted, else 24h

        const story: Story = {
            id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar || '',
            mediaUrl,
            mediaType,
            duration: mediaType === 'video' ? 15 : 5, // Default durations
            overlays,
            createdAt: now.toISOString(),
            expiresAt: expiry.toISOString(),
            views: 0,
            isBoosted
        };

        this.stories.set(story.id, story);
        this.saveStories();
        return story;
    }

    // --- 3. GET FEED (The FOMO Sorter) ---
    // Groups stories by User
    public getStoryFeed(currentUser: User | null): { userId: string, userAvatar: string, userName: string, stories: Story[], hasUnwatched: boolean, isBoosted: boolean }[] {
        const grouped = new Map<string, Story[]>();

        // Group by User
        this.stories.forEach(s => {
            if (!grouped.has(s.userId)) grouped.set(s.userId, []);
            grouped.get(s.userId)?.push(s);
        });

        const feed = Array.from(grouped.entries()).map(([userId, stories]) => {
            // Sort stories chronologically
            stories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            const hasUnwatched = stories.some(s => !this.watched.has(s.id));
            const isBoosted = stories.some(s => s.isBoosted);
            const userAvatar = stories[0].userAvatar;
            const userName = stories[0].userName;

            return { userId, userAvatar, userName, stories, hasUnwatched, isBoosted };
        });

        // Sorting Logic:
        // 1. Current User's Stories (Always first for them)
        // 2. Unwatched Stories
        // 3. Boosted Stories
        // 4. Followed Users (if User logged in) - Not fully implemented in simulation
        
        return feed.sort((a, b) => {
            if (currentUser && a.userId === currentUser.id) return -1;
            if (currentUser && b.userId === currentUser.id) return 1;
            
            if (a.hasUnwatched && !b.hasUnwatched) return -1;
            if (!a.hasUnwatched && b.hasUnwatched) return 1;
            
            if (a.isBoosted && !b.isBoosted) return -1;
            if (!a.isBoosted && b.isBoosted) return 1;
            
            return 0;
        });
    }

    // --- 4. WATCH STORY ---
    public watchStory(storyId: string) {
        if (!this.watched.has(storyId)) {
            this.watched.add(storyId);
            const story = this.stories.get(storyId);
            if (story) {
                story.views += 1;
                this.saveStories();
            }
            localStorage.setItem('mylaf_watched_stories', JSON.stringify(Array.from(this.watched)));
        }
    }
}

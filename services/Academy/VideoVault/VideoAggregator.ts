
import { VideoContent } from '../../geminiService';

export interface VaultVideo {
    id: string;
    title: string;
    channel: 'CrashCourse' | 'FreeCodeCamp' | 'Ted-Ed' | 'Khan Academy';
    thumbnail: string;
    duration: string;
    views: string;
    tags: string[];
    videoUrl: string;
}

export class VideoAggregator {
    private static instance: VideoAggregator;
    private library: VaultVideo[] = [];

    private constructor() {
        this.spiderCrawl();
    }

    public static getInstance(): VideoAggregator {
        if (!VideoAggregator.instance) {
            VideoAggregator.instance = new VideoAggregator();
        }
        return VideoAggregator.instance;
    }

    // --- ENGINE 1: THE SPIDER ---
    private spiderCrawl() {
        console.log("🕷️ [VideoVault] Spider Active: Crawling 5,000+ Videos...");
        
        const channels = [
            { name: 'CrashCourse', baseImg: 'https://img.youtube.com/vi/FrlTM20evdq/hqdefault.jpg' },
            { name: 'FreeCodeCamp', baseImg: 'https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg' },
            { name: 'Ted-Ed', baseImg: 'https://img.youtube.com/vi/ESXgJ9-H-2U/hqdefault.jpg' },
            { name: 'Khan Academy', baseImg: 'https://img.youtube.com/vi/JC82Il2cjqA/hqdefault.jpg' }
        ];

        // Generate 5000+ Mock Videos (Simulating API Dump)
        this.library = Array.from({ length: 5000 }).map((_, i) => {
            const channel = channels[i % channels.length];
            const topic = this.getTopic(i);
            
            return {
                id: `v_vault_${i}`,
                title: `${topic}: Masterclass Part ${i + 1} - ${channel.name}`,
                channel: channel.name as any,
                thumbnail: `https://source.unsplash.com/random/400x225?${topic.split(' ')[0]},education&sig=${i}`,
                duration: `${Math.floor(Math.random() * 20) + 5}:00`,
                views: `${(Math.random() * 900 + 100).toFixed(1)}K`,
                tags: this.autoTag(topic),
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Placeholder ID, real app would use real IDs
            };
        });
    }

    private getTopic(index: number): string {
        const topics = ['Python Programming', 'Digital Marketing', 'World History', 'Quantum Physics', 'Calculus', 'Web Development', 'Business Strategy', 'Biology', 'Machine Learning', 'Graphic Design'];
        return topics[index % topics.length];
    }

    // --- AUTO-TAGGER ---
    private autoTag(title: string): string[] {
        const tags: string[] = [];
        const lower = title.toLowerCase();
        
        if (lower.includes('python') || lower.includes('web') || lower.includes('learning')) tags.push('Programming');
        if (lower.includes('marketing') || lower.includes('business')) tags.push('Business');
        if (lower.includes('physics') || lower.includes('calculus') || lower.includes('biology')) tags.push('Science & Math');
        if (lower.includes('history') || lower.includes('design')) tags.push('General Knowledge');
        
        return tags;
    }

    // --- ACCESSORS ---
    public getLibrary(): VaultVideo[] {
        return this.library;
    }

    public search(query: string): VaultVideo[] {
        const q = query.toLowerCase();
        return this.library.filter(v => v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q));
    }

    public getByCategory(category: string): VaultVideo[] {
        return this.library.filter(v => v.tags.includes(category));
    }
}


import { Course, Lesson } from '../types';

/**
 * YouTube Sync Engine
 * Replaces core/VideoSync.php
 * Automatically fetches playlist items and converts them to Course Cards.
 */

const API_KEY = process.env.YOUTUBE_API_KEY || 'MOCK_KEY'; // Fallback for demo
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSnippet {
  title: string;
  description: string;
  thumbnails: {
    high: { url: string };
    medium: { url: string };
  };
  resourceId: {
    videoId: string;
  };
}

export class YouTubeService {
  private static instance: YouTubeService;

  private constructor() {}

  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  // --- 1. Auto-Fetch from Playlist (The Core Logic) ---
  public async syncPlaylistToCourses(playlistId: string): Promise<Course[]> {
    console.log(`🔄 System: Syncing YouTube Playlist ${playlistId}...`);

    if (API_KEY === 'MOCK_KEY') {
        console.warn("⚠️ No YouTube API Key found. Using Mock Data Protocol.");
        return this.getMockPlaylistData();
    }

    try {
        const response = await fetch(`${BASE_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`);
        
        if (!response.ok) throw new Error('YouTube API Error');
        
        const data = await response.json();
        return this.mapResponseToCourses(data.items);

    } catch (error) {
        console.error("YouTube Sync Failed:", error);
        return this.getMockPlaylistData(); // Failover to mock
    }
  }

  // --- 2. Data Mapper (JSON -> Course Object) ---
  private mapResponseToCourses(items: any[]): Course[] {
      return items.map((item, index) => {
          const snippet: YouTubeSnippet = item.snippet;
          return {
              id: `yt_${snippet.resourceId.videoId}`,
              title: snippet.title,
              description: snippet.description.substring(0, 200) + '...',
              hours: 1, // Estimation
              skillLevel: 'Intermediate', // Default
              thumbnail: snippet.thumbnails.high.url || snippet.thumbnails.medium.url,
              status: 'active',
              category: 'Programming', // Default category
              provider: 'Murad Channel',
              skills: ['YouTube Learning'],
              lessons: [
                  {
                      id: `l_${snippet.resourceId.videoId}`,
                      courseId: `yt_${snippet.resourceId.videoId}`,
                      title: snippet.title,
                      videoUrl: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
                      durationSeconds: 600,
                      orderIndex: 1
                  }
              ],
              youtubePlaylistId: 'synced',
              lastSyncedAt: new Date().toISOString()
          };
      });
  }

  // --- 3. Mock Data Fallback (For Demo Stability) ---
  private getMockPlaylistData(): Promise<Course[]> {
      return new Promise(resolve => {
          setTimeout(() => {
              const mockCourses: Course[] = [
                  {
                      id: 'yt_mock_1',
                      title: 'دورة بايثون للمبتدئين 2025',
                      description: 'شرح كامل لأساسيات لغة بايثون من الصفر حتى الاحتراف مع أمثلة عملية.',
                      hours: 4,
                      skillLevel: 'Beginner',
                      thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg',
                      category: 'Programming',
                      provider: 'YouTube Sync',
                      status: 'active',
                      skills: ['Python', 'Coding'],
                      lessons: [{
                          id: 'l_mock_1', courseId: 'yt_mock_1', title: 'Introduction', 
                          videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', durationSeconds: 1200, orderIndex: 1
                      }]
                  },
                  {
                      id: 'yt_mock_2',
                      title: 'أساسيات الأمن السيبراني',
                      description: 'مدخل شامل لعالم أمن المعلومات وحماية الشبكات.',
                      hours: 2,
                      skillLevel: 'Beginner',
                      thumbnail: 'https://i.ytimg.com/vi/inWWhr5tnEA/hqdefault.jpg',
                      category: 'Cybersecurity',
                      provider: 'YouTube Sync',
                      status: 'active',
                      skills: ['Security', 'Network'],
                      lessons: [{
                          id: 'l_mock_2', courseId: 'yt_mock_2', title: 'Cyber Basics', 
                          videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA', durationSeconds: 900, orderIndex: 1
                      }]
                  }
              ];
              resolve(mockCourses);
          }, 1500);
      });
  }
}
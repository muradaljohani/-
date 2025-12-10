
// --- ADVANCED SOCIAL DATA LAYER ---

export interface SocialUser {
  id?: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  isGold?: boolean; // Organization / VIP
  isPremium?: boolean; // Blue Tick Subscriber
  bio?: string;
  joined?: string;
  following?: number;
  followers?: number;
  location?: string;
  hasStory?: boolean; // For Stories Rail
  reputation?: number; // Gamification Score
  coins?: number; // Economy
  badges?: string[]; // 'early-adopter', 'whale', 'vip'
  isPrivate?: boolean;
  isBanned?: boolean;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface SocialPost {
  id: string;
  user: SocialUser;
  type: 'text' | 'image' | 'poll' | 'voice' | 'premium_locked';
  content?: string;
  images?: string[];
  pollOptions?: PollOption[];
  voiceDuration?: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  isPinned?: boolean;
  views?: string;
}

export interface Reel {
  id: string;
  url: string;
  user: SocialUser;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  song: string;
}

export interface AdminLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  time: string;
}

export interface Report {
  id: string;
  reporter: string;
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved';
}

export const stories = [
  { id: 's1', user: { name: 'Murad', avatar: 'https://ui-avatars.com/api/?name=Murad&background=0D8ABC&color=fff' }, isViewed: false },
  { id: 's2', user: { name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }, isViewed: false },
  { id: 's3', user: { name: 'TechNews', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Tech' }, isViewed: true },
  { id: 's4', user: { name: 'DesignHub', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Design' }, isViewed: false },
  { id: 's5', user: { name: 'CryptoKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Crypto' }, isViewed: false },
];

export const posts: SocialPost[] = [
  {
    id: 'post-0',
    user: {
      name: 'Murad Al-Juhani',
      handle: '@IpMurad',
      avatar: 'https://ui-avatars.com/api/?name=Murad+Aljohani&background=0D8ABC&color=fff',
      verified: true,
      isGold: true, 
      bio: 'Founder of Murad Group | Tech Enthusiast 🇸🇦',
      joined: 'September 2015',
      following: 450,
      followers: 12400,
      location: 'Riyadh, KSA',
      reputation: 9500,
      coins: 50000,
      badges: ['whale', 'early-adopter']
    },
    type: 'text',
    content: '🚀 The future of #SocialMedia is here.\n\nWe are introducing "Murad Social" with monetization features, stories, and advanced AI integration. Stay tuned! 🦅\n\n#Vision2030 #Tech',
    images: ['https://i.ibb.co/QjNHDv3F/images-4.jpg'],
    timestamp: '2m',
    likes: 85000,
    retweets: 5000,
    replies: 1420,
    isPinned: true,
    views: '1.2M'
  },
  {
    id: 'post-poll-1',
    user: {
      name: 'Dev Community',
      handle: '@dev_community',
      avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Dev',
      verified: true,
      isPremium: true,
      reputation: 1200,
      coins: 500
    },
    type: 'poll',
    content: 'Which framework are you using for your next project? 🤔 #coding',
    pollOptions: [
      { id: 1, text: 'React / Next.js', votes: 450 },
      { id: 2, text: 'Vue / Nuxt', votes: 120 },
      { id: 3, text: 'Svelte', votes: 80 },
      { id: 4, text: 'Angular', votes: 40 }
    ],
    timestamp: '1h',
    likes: 320,
    retweets: 45,
    replies: 120,
    views: '45K'
  },
  {
    id: 'post-locked-1',
    user: {
      name: 'Crypto Signals 💎',
      handle: '@crypto_whale',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whale',
      verified: true,
      isGold: true,
      reputation: 5000
    },
    type: 'premium_locked',
    content: '🔒 This content is for subscribers only. Subscribe to see the next 100x gem before anyone else.',
    timestamp: '3h',
    likes: 15,
    retweets: 2,
    replies: 0,
    views: '10K'
  },
  {
    id: 'post-voice-1',
    user: {
      name: 'Sarah Tech',
      handle: '@sarah_dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      verified: false,
      isPremium: true,
      reputation: 800
    },
    type: 'voice',
    content: 'Just had a crazy idea about AI agents! Listen to this 👇',
    voiceDuration: '0:45',
    timestamp: '5h',
    likes: 120,
    retweets: 15,
    replies: 34,
    views: '8K'
  }
];

export const conversations = [
    { 
        id: 1, 
        name: 'Murad Support', 
        lastMsg: 'تم إيداع الرصيد في محفظتك 💰', 
        time: '10:30 AM', 
        unread: 2, 
        online: true,
        avatar: 'https://ui-avatars.com/api/?name=Support&background=000&color=fff',
        messages: [
            { id: 1, text: 'مرحباً، واجهت مشكلة في الدفع.', sender: 'me', time: '10:00 AM', read: true },
            { id: 2, text: 'أهلاً بك، تم حل المشكلة وإضافة الرصيد.', sender: 'them', time: '10:15 AM' },
            { id: 3, text: 'شكراً لتواصلك معنا!', sender: 'them', time: '10:30 AM' }
        ]
    },
    { 
        id: 2, 
        name: 'Sarah Tech', 
        lastMsg: 'Nice code! 👍', 
        time: 'Yesterday', 
        unread: 0, 
        online: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        messages: [
            { id: 1, text: 'Hey, did you check the repo?', sender: 'them', time: 'Yesterday 4:00 PM' },
            { id: 2, text: 'Yes, looking good!', sender: 'me', time: 'Yesterday 4:05 PM', read: true },
            { id: 3, text: 'Nice code! 👍', sender: 'them', time: 'Yesterday 5:00 PM' }
        ]
    }
];

export const reels: Reel[] = [
    {
        id: 'r1',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
        user: posts[0].user,
        caption: 'Future is Neon 🔮 #Cyberpunk #Vibe',
        likes: 1200,
        comments: 45,
        shares: 120,
        song: 'Neon Lights - Future Bass'
    },
    {
        id: 'r2',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
        user: posts[3].user,
        caption: 'Nature is healing 🌱 #Spring #Saudi',
        likes: 3400,
        comments: 210,
        shares: 500,
        song: 'Morning Birds - Nature Sounds'
    },
    {
        id: 'r3',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-city-street-at-night-4008-large.mp4',
        user: posts[1].user,
        caption: 'City Lights 🌃 #Riyadh #Night',
        likes: 8900,
        comments: 450,
        shares: 1200,
        song: 'City Pop - Lofi'
    }
];

export const adminLogs: AdminLog[] = [
    { id: 'l1', admin: 'System', action: 'Auto-Ban', target: '@spambot', time: '10:00 AM' },
    { id: 'l2', admin: 'Murad', action: 'Verified', target: '@sarah_dev', time: '09:30 AM' },
    { id: 'l3', admin: 'System', action: 'Flagged Post', target: 'post-99', time: 'Yesterday' }
];

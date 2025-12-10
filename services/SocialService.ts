
import { db } from '../firebaseConfig';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    serverTimestamp
} from '../src/lib/firebase'; // Updated import source
import { SocialPost, SocialUser } from '../dummyData';

export const SocialService = {
    // Fetch posts from Firestore
    async getPosts(): Promise<SocialPost[]> {
        try {
            const postsRef = collection(db, 'social_posts');
            const q = query(postsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            
            return snapshot.docs.map((doc: any) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamp to string for UI
                    timestamp: data.createdAt ? this.formatDate(data.createdAt) : 'Just now'
                } as SocialPost;
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    },

    // Check if DB is empty and seed the Welcome Post
    async checkAndSeed(): Promise<void> {
        try {
            const postsRef = collection(db, 'social_posts');
            const snapshot = await getDocs(postsRef);
            
            if (snapshot.docs.length === 0) {
                console.log("Seeding Database with Viral Welcome Post...");
                await addDoc(postsRef, {
                    user: {
                        name: 'Murad Al-Juhani',
                        handle: '@IpMurad',
                        avatar: 'https://ui-avatars.com/api/?name=Murad+Aljohani&background=0D8ABC&color=fff',
                        verified: true,
                        isGold: true, 
                        bio: 'Founder of Murad Group | Tech Enthusiast 🇸🇦',
                    },
                    type: 'image',
                    content: '🚀 The future of #SocialMedia is here.\n\nBuilding the next digital empire to compete with the giants. 🦅\n\n#Vision2030 #Tech #MuradSocial',
                    images: ['https://i.ibb.co/QjNHDv3F/images-4.jpg'], // Viral Image
                    createdAt: serverTimestamp(),
                    likes: 85000,
                    retweets: 5000,
                    replies: 1420,
                    views: '1.2M'
                });
            }
        } catch (error) {
            console.error("Seeding failed:", error);
        }
    },

    // Create a new post
    async createPost(user: SocialUser | any, content: string, type: string = 'text'): Promise<boolean> {
        try {
            const postsRef = collection(db, 'social_posts');
            await addDoc(postsRef, {
                user: {
                    name: user.name,
                    handle: user.username ? `@${user.username}` : `@${user.name.replace(/\s+/g, '')}`,
                    avatar: user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User",
                    verified: user.isIdentityVerified || false,
                    isGold: user.isGold || false,
                    isPremium: user.isPremium || false
                },
                type,
                content,
                createdAt: serverTimestamp(),
                likes: 0,
                retweets: 0,
                replies: 0,
                views: '0'
            });
            return true;
        } catch (error) {
            console.error("Error creating post:", error);
            return false;
        }
    },

    // Helper to format timestamp
    formatDate(timestamp: any): string {
        if (!timestamp) return '';
        // Mock timestamp check
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return date.toLocaleDateString();
    }
};

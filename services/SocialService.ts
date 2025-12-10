
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

    // Check if DB is empty and seed the specific Murad posts
    async checkAndSeed(): Promise<void> {
        try {
            const postsRef = collection(db, 'social_posts');
            const snapshot = await getDocs(postsRef);
            
            if (snapshot.docs.length === 0) {
                console.log("Seeding Database with Official Murad Content...");
                
                const MURAD_USER = {
                    name: "Murad Aljohani",
                    handle: "@IpMurad",
                    avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
                    verified: true,
                    isGold: true,
                    bio: "Founder of Murad Group | Tech Enthusiast 🇸🇦"
                };

                // Post 2: The Archive (Added first so it appears below the viral one)
                await addDoc(postsRef, {
                    user: MURAD_USER,
                    type: 'image',
                    content: 'من الأرشيف.. الطموح لا يشيخ. 🦅\nكنت أعلم منذ تلك اللحظة أننا سنصل إلى هنا يوماً ما.\n\n#ذكريات #اصرار',
                    images: ["https://i.ibb.co/Hfrm9Bd4/20190220-200812.jpg"],
                    createdAt: new Date(Date.now() - 86400000), // 1 day ago
                    likes: 42000,
                    retweets: 2000000,
                    replies: 8000,
                    views: '10M'
                });

                // Post 1: The Viral Welcome (Added second so it appears on top)
                await addDoc(postsRef, {
                    user: MURAD_USER,
                    type: 'image',
                    content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
                    images: ["https://i.ibb.co/QjNHDv3F/images-4.jpg"],
                    createdAt: serverTimestamp(), // Now
                    likes: 50000,
                    retweets: 5000000,
                    replies: 12000,
                    views: '15M'
                });
                
                console.log("Seeding Complete.");
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
        // Handle Firestore Timestamp or Date object
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
};

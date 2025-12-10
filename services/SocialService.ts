
import { db } from '../firebaseConfig';
import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    serverTimestamp,
    doc,
    setDoc,
    getDoc,
    addDoc
} from 'firebase/firestore'; 
import { SocialPost } from '../dummyData';

export const SocialService = {
    // Check if specific viral posts exist, if not, create them
    async checkAndSeed(): Promise<void> {
        try {
            // Check for the main viral post by ID to avoid duplicates
            const viralDocRef = doc(db, 'posts', 'viral-welcome-post');
            const viralDocSnap = await getDoc(viralDocRef);
            
            if (!viralDocSnap.exists()) {
                console.log("Seeding Viral Content...");
                await this.forceSeed(); 
            }
        } catch (error) {
            console.error("Seeding check failed:", error);
        }
    },

    // Manual Force Seed - Creates the specific Murad posts
    async forceSeed(): Promise<void> {
        
        const MURAD_USER = {
            name: "Murad Aljohani",
            handle: "@IpMurad",
            avatar: "https://i.ibb.co/QjNHDv3F/images-4.jpg",
            verified: true,
            isGold: true,
            uid: "admin-murad-id", // Fixed ID for the owner
            bio: "Founder of Murad Group | Tech Enthusiast 🇸🇦"
        };

        // Post 1: The Viral Welcome (Pinned) - ID: viral-welcome-post
        await setDoc(doc(db, 'posts', 'viral-welcome-post'), {
            user: MURAD_USER,
            type: 'image',
            content: 'هل تعلم أن يوتيوب بدأ بمقطع فيديو مدته 18 ثانية فقط لشخص يتحدث عن "الفيلة" في حديقة الحيوان؟ والآن يشاهده المليارات يومياً! 🌍\n\nاليوم نضع حجر الأساس لـ "مجتمع ميلاف".. قد تبدو بداية بسيطة، ولكن تذكروا هذا المنشور جيداً.. لأننا قادمون لنغير قواعد اللعبة. 🚀🔥\n\n#البداية #ميلاف #المستقبل',
            images: ["https://i.ibb.co/QjNHDv3F/images-4.jpg"],
            createdAt: serverTimestamp(),
            likes: 50000,
            retweets: 5000000,
            replies: 12500,
            views: '15M',
            isPinned: true
        }, { merge: true });

        // Post 2: The Archive (Normal Post) - ID: archive-memory-post
        await setDoc(doc(db, 'posts', 'archive-memory-post'), {
            user: MURAD_USER,
            type: 'image',
            content: 'من الأرشيف.. الطموح لا يشيخ. 🦅\nكنت أعلم منذ تلك اللحظة أننا سنصل إلى هنا يوماً ما.\n\n#ذكريات #اصرار',
            images: ["https://i.ibb.co/Hfrm9Bd4/20190220-200812.jpg"],
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            likes: 42000,
            retweets: 2000000,
            replies: 8000,
            views: '10M',
            isPinned: false // Pinned under the main one visually via sort
        }, { merge: true });
        
        console.log("Viral Content Seeded Successfully.");
    },

    // Create a new post
    async createPost(user: any, content: string, type: string = 'text'): Promise<boolean> {
        try {
            const postsRef = collection(db, 'posts');
            
            // Construct dynamic user data from Auth Context User
            const userData = {
                name: user.name || "Anonymous User",
                handle: user.username ? `@${user.username}` : (user.email ? `@${user.email.split('@')[0]}` : `@${user.id.substr(0,8)}`),
                avatar: user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User",
                verified: user.isIdentityVerified || false,
                isGold: user.primeSubscription?.status === 'active',
                uid: user.id
            };

            await addDoc(postsRef, {
                user: userData,
                type,
                content,
                createdAt: serverTimestamp(),
                likes: 0,
                retweets: 0,
                replies: 0,
                views: '0',
                isPinned: false
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

        if (diff < 60) return 'الآن';
        if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
        if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
        if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
        
        return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    }
};

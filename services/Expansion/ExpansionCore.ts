
import { User, ProductListing, UserJob, Course } from '../../types';
import { CognitiveBrain } from '../Fluid/CognitiveBrain';
import { GovernanceCore } from '../Governance/GovernanceCore';

/**
 * ==============================================================================
 * THE EXPANSION CORE (Infinite Mall Architecture)
 * Layer 4: The Viral Scalability Engine
 * ==============================================================================
 */

export interface DiscoveryItem {
    type: 'Product' | 'Job' | 'Course' | 'Store';
    id: string;
    title: string;
    subtitle: string;
    image: string;
    tags: string[];
    score: number;
    data: any;
}

export interface StoreProfileData {
    userId: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    stats: {
        products: number;
        sold: number;
        rating: number;
        followers: number;
    };
    items: ProductListing[];
    tags: string[];
}

// --- ENGINE 1: MICRO-STORE GENERATOR ---
class StoreGenerator {
    
    // Automatically generate a "Store" page structure from a user ID
    public static generateStoreProfile(user: User, allProducts: ProductListing[]): StoreProfileData {
        const userProducts = allProducts.filter(p => p.sellerId === user.id);
        const tags = Array.from(new Set(userProducts.flatMap(p => p.tags || [])));
        
        return {
            userId: user.id,
            username: user.name.replace(/\s+/g, '_').toLowerCase(),
            name: user.name,
            avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
            bio: user.bio || `مرحباً بك في متجر ${user.name}. تصفح أحدث العروض والمنتجات المميزة.`,
            stats: {
                products: userProducts.length,
                sold: userProducts.filter(p => p.status === 'sold').length,
                rating: user.publisherStats?.rating || 4.5,
                followers: user.followers?.length || 0
            },
            items: userProducts,
            tags: tags
        };
    }
}

// --- ENGINE 2: ENDLESS DISCOVERY FEED (The TikTok Logic) ---
class DiscoveryEngine {
    
    public static generateMixedFeed(
        user: User | null, 
        products: ProductListing[], 
        jobs: UserJob[], 
        courses: Course[]
    ): DiscoveryItem[] {
        const brain = CognitiveBrain.getInstance();
        let feed: DiscoveryItem[] = [];

        // 1. Convert everything to DiscoveryItems & Filter Shadowbanned
        // Logic: Shadowbanned content is only visible to the owner.
        
        const productItems: DiscoveryItem[] = [];
        
        products.forEach(p => {
            // Shadowban Logic
            if (p.status === 'shadow_banned') {
                if (user && user.id === p.sellerId) {
                    // Visible to owner (Ghost Mode)
                } else {
                    return; // Hidden from everyone else
                }
            }

            productItems.push({
                type: 'Product',
                id: p.id,
                title: p.title,
                subtitle: `${p.price} SAR`,
                image: p.images[0],
                tags: p.tags || [],
                score: 0,
                data: p
            });
        });

        const jobItems: DiscoveryItem[] = jobs.map(j => ({
            type: 'Job',
            id: j.id,
            title: j.title,
            subtitle: j.company,
            image: j.logoUrl || '', // Fallback handled in component
            tags: [j.location, j.type],
            score: 0,
            data: j
        }));

        const courseItems: DiscoveryItem[] = courses.map(c => ({
            type: 'Course',
            id: c.id,
            title: c.title,
            subtitle: c.provider,
            image: c.thumbnail || '',
            tags: [c.category, c.skillLevel],
            score: 0,
            data: c
        }));

        let allItems = [...productItems, ...jobItems, ...courseItems];

        // 2. Personalize (Cognitive Sorting)
        if (user) {
            // "PersonalizeList" in CognitiveBrain expects generic objects, we adapt logic here
            // We use the item's text to query the Interest Graph
            allItems = brain.personalizeList(allItems, (item) => `${item.title} ${item.subtitle} ${item.tags.join(' ')}`);
        } else {
            // Random shuffle for guests to discover new things
            allItems = allItems.sort(() => 0.5 - Math.random());
        }

        // 3. The Mixer (Inject Variety)
        // If the user likes cars, we give them mostly cars, but inject 1 job and 1 course every 10 items.
        // For simplicity here, we just take the sorted list. In a complex app, we'd interleave.
        
        return allItems;
    }
}

// --- ENGINE 3: DYNAMIC TAGGING SYSTEM ---
class TagSystem {
    // Generates a "Landing Page" data set for a specific tag
    public static generateTagPage(tag: string, allItems: DiscoveryItem[]): DiscoveryItem[] {
        const lowerTag = tag.toLowerCase();
        return allItems.filter(item => 
            item.title.toLowerCase().includes(lowerTag) || 
            item.tags.some(t => t.toLowerCase().includes(lowerTag)) ||
            item.subtitle.toLowerCase().includes(lowerTag)
        );
    }
}

export const ExpansionCore = {
    StoreGenerator,
    DiscoveryEngine,
    TagSystem
};

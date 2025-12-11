
import { Course, ProductListing, ServiceListing, UserJob } from '../../types';

// --- NEXUS BRAIN: The Central Intelligence Unit ---

export interface SearchResult {
    id: string;
    type: 'Job' | 'Course' | 'Market' | 'Service';
    title: string;
    subtitle: string;
    image?: string;
    score: number;
    actionData: any;
}

export interface BridgeRecommendation {
    id: string;
    trigger: string;
    message: string;
    targetType: 'Job' | 'Course' | 'Market';
    targetId: string;
    targetLink: string;
}

type RecCallback = (rec: BridgeRecommendation) => void;

export class NexusBrain {
    private static instance: NexusBrain;
    private observers: RecCallback[] = [];

    private constructor() {}

    public static getInstance(): NexusBrain {
        if (!NexusBrain.instance) {
            NexusBrain.instance = new NexusBrain();
        }
        return NexusBrain.instance;
    }

    // --- OBSERVER PATTERN (For Instant Popups) ---
    public subscribe(callback: RecCallback) {
        this.observers.push(callback);
    }

    public unsubscribe(callback: RecCallback) {
        this.observers = this.observers.filter(cb => cb !== callback);
    }

    private notify(rec: BridgeRecommendation) {
        this.observers.forEach(cb => cb(rec));
    }

    // --- ENGINE 1: OMNI-SEARCH (Universal Query) ---
    public async globalQuery(term: string): Promise<SearchResult[]> {
        if (!term || term.length < 2) return [];
        term = term.toLowerCase();

        const results: SearchResult[] = [];

        // 1. Query Jobs DB
        let jobs: UserJob[] = [];
        try {
            jobs = JSON.parse(localStorage.getItem('allJobs') || '[]');
        } catch (e) {
            console.warn("NexusBrain: Failed to parse jobs", e);
            jobs = [];
        }

        jobs.forEach(j => {
            if (j.title.toLowerCase().includes(term) || j.company.toLowerCase().includes(term)) {
                results.push({
                    id: j.id,
                    type: 'Job',
                    title: j.title,
                    subtitle: j.company,
                    score: 10,
                    actionData: j
                });
            }
        });

        // 2. Query Courses (LMS)
        let storedCourses: any[] = [];
        try {
            storedCourses = JSON.parse(localStorage.getItem('mylaf_custom_courses') || '[]');
        } catch (e) {
            console.warn("NexusBrain: Failed to parse courses", e);
            storedCourses = [];
        }

        storedCourses.forEach((c: any) => {
            if (c.title.toLowerCase().includes(term)) {
                results.push({
                    id: c.id,
                    type: 'Course',
                    title: c.title,
                    subtitle: 'أكاديمية ميلاف',
                    image: c.thumbnail,
                    score: 8,
                    actionData: c
                });
            }
        });

        // 3. Query Market (Products & Services)
        let products: ProductListing[] = [];
        let services: ServiceListing[] = [];

        try {
            products = JSON.parse(localStorage.getItem('allProducts') || '[]');
        } catch (e) {
            console.warn("NexusBrain: Failed to parse products", e);
            products = [];
        }

        try {
            services = JSON.parse(localStorage.getItem('mylaf_services') || '[]');
        } catch (e) {
            console.warn("NexusBrain: Failed to parse services", e);
            services = [];
        }

        products.forEach(p => {
            if (p.title.toLowerCase().includes(term)) {
                results.push({
                    id: p.id,
                    type: 'Market',
                    title: p.title,
                    subtitle: `${p.price} SAR`,
                    image: p.images[0],
                    score: 5,
                    actionData: p
                });
            }
        });

        services.forEach(s => {
            if (s.title.toLowerCase().includes(term)) {
                results.push({
                    id: s.id,
                    type: 'Service',
                    title: s.title,
                    subtitle: s.sellerName,
                    image: s.thumbnail,
                    score: 5,
                    actionData: s
                });
            }
        });

        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }

    // --- ENGINE 2: KEYWORD DNA EXTRACTOR & JOURNEY GUIDE ---
    // The "Listener" that watches search bars
    public trackSearch(term: string, context: 'Market' | 'Jobs' | 'Academy') {
        const q = term.toLowerCase();
        console.log(`[NexusBrain] Tracking Keyword DNA: "${q}" in ${context}`);

        // SCENARIO 1: User in Market searching for "Camera" -> Suggest Course
        if (context === 'Market') {
            if (q.includes('camera') || q.includes('canon') || q.includes('sony') || q.includes('تصوير')) {
                this.notify({
                    id: 'rec_photo_course',
                    trigger: 'Interest: Photography',
                    message: '📸 تشتري كاميرا؟ خذ دورة "التصوير الاحترافي" في الأكاديمية وصر محترف!',
                    targetType: 'Course',
                    targetId: 'course_photo',
                    targetLink: 'training'
                });
            }
            if (q.includes('laptop') || q.includes('macbook') || q.includes('لابتوب')) {
                this.notify({
                    id: 'rec_code_course',
                    trigger: 'Interest: Tech',
                    message: '💻 شريت لابتوب؟ استغله في تعلم البرمجة وزد دخلك.',
                    targetType: 'Course',
                    targetId: 'course_python',
                    targetLink: 'training'
                });
            }
        }

        // SCENARIO 2: User in Jobs searching for "Driver" -> Suggest Car
        if (context === 'Jobs') {
            if (q.includes('driver') || q.includes('delivery') || q.includes('سائق') || q.includes('توصيل')) {
                this.notify({
                    id: 'rec_car_market',
                    trigger: 'Job: Delivery',
                    message: '🚗 تبي تشتغل في التوصيل؟ شيك على السيارات الاقتصادية في الحراج.',
                    targetType: 'Market',
                    targetId: 'market_cars',
                    targetLink: 'haraj'
                });
            }
        }

        // SCENARIO 3: User in Academy finishing "Accounting" -> Suggest Job
        if (context === 'Academy') {
            if (q.includes('accounting') || q.includes('محاسبة')) {
                this.notify({
                    id: 'rec_acc_job',
                    trigger: 'Skill: Accounting',
                    message: '📊 المحاسبين مطلوبين! قدم على وظائف "محاسب حديث التخرج" الآن.',
                    targetType: 'Job',
                    targetId: 'job_acc',
                    targetLink: 'jobs'
                });
            }
        }
    }

    // --- ENGINE 3: CONTEXTUAL BRIDGE (Static Analyzer) ---
    // Used when viewing an item detail
    public analyzeContext(contextType: 'Job' | 'Course' | 'Market', item: any): BridgeRecommendation | null {
        // (Existing Logic preserved for fallback)
        const keywords = (item.title + ' ' + (item.description || '')).toLowerCase();

        if (contextType === 'Market') {
            if (keywords.includes('camera')) {
                return {
                    id: 'rec_photo_static',
                    trigger: 'Item: Camera',
                    message: '📸 عزز مهاراتك بدورة تصوير احترافية.',
                    targetType: 'Course',
                    targetId: 'course_photo',
                    targetLink: 'training'
                };
            }
        }
        return null;
    }
}

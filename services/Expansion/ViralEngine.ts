
import { User, ViralStats, ReferralLog, PayoutRequest } from '../../types';

/**
 * ==============================================================================
 * VIRAL GROWTH ENGINE
 * Layer 5: The Nano-Influencer Protocol + SHERLOCK ANTI-FRAUD
 * ==============================================================================
 */

export class ViralEngine {
    private static instance: ViralEngine;
    
    // Sherlock Memory
    private click timestamps: number[] = [];
    private readonly CLICK_VELOCITY_LIMIT = 20; // Max clicks per minute before flagging IP
    private readonly CLICK_WINDOW = 60000; // 1 Minute

    private constructor() {}

    public static getInstance(): ViralEngine {
        if (!ViralEngine.instance) {
            ViralEngine.instance = new ViralEngine();
        }
        return ViralEngine.instance;
    }

    // --- 1. AFFILIATE LINK GENERATOR ---
    
    public generateRefLink(username: string, path: string = ''): string {
        // Normalize username
        const code = username.replace(/\s+/g, '').toLowerCase();
        // Base URL logic (in prod this would use window.location.origin)
        const baseUrl = window.location.origin;
        // Construct full URL
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const separator = cleanPath.includes('?') ? '&' : '?';
        return `${baseUrl}${cleanPath}${separator}ref=${code}`;
    }

    // --- 2. SMART SHARE CONTENT GENERATOR ---

    public generateShareContent(type: 'Job' | 'Course' | 'Product', data: any, username: string): { title: string, text: string, url: string } {
        const refLink = this.generateRefLink(username, this.getItemPath(type, data.id));
        let title = '';
        let text = '';

        if (type === 'Job') {
            title = `فرصة وظيفية: ${data.title}`;
            text = `🔥 لقيت وظيفة ممتازة في ${data.company}!\n\nالمسمى: ${data.title}\nالموقع: ${data.location}\n\nقدم عليها الحين قبل ما تروح عليك 👇`;
        } else if (type === 'Course') {
            title = `دورة مميزة: ${data.title}`;
            text = `📚 قاعد أتعلم ${data.title} في أكاديمية ميلاف.\n\nالمحتوى قوي والشهادة معتمدة. سجل معي ونستفيد سوا 👇`;
        } else if (type === 'Product') {
            title = `لقطة: ${data.title}`;
            text = `💰 شوف هالمنتج في سوق ميلاف: ${data.title}.\nالسعر: ${data.price} ريال.\n\nالتفاصيل كاملة هنا 👇`;
        }

        return {
            title,
            text: `${text}\n${refLink}`,
            url: refLink
        };
    }

    private getItemPath(type: string, id: string): string {
        if (type === 'Job') return `/jobs`; // In a real app with routing: `/jobs/${id}`
        if (type === 'Course') return `/academy`; 
        if (type === 'Product') return `/market`; 
        return '/';
    }

    // --- 3. REFERRAL TRACKING & SHERLOCK ANTI-FRAUD ---

    // Called when a user visits a link with ?ref=
    public processReferralClick(refCode: string, currentUser?: User): void {
        console.log(`[ViralEngine] Processing Referral: ${refCode}`);

        // --- SHERLOCK: Anti-Fraud Checks ---
        
        // 1. Self-Referral Block
        if (currentUser) {
            const userCode = currentUser.name.replace(/\s+/g, '').toLowerCase();
            if (userCode === refCode) {
                console.warn("[Sherlock] Self-referral detected. Commission blocked.");
                return; // Do not record
            }
        }

        // 2. Velocity Check (Bot Attack)
        const now = Date.now();
        this.timestamps = this.timestamps.filter(t => now - t < this.CLICK_WINDOW);
        this.timestamps.push(now);

        if (this.timestamps.length > this.CLICK_VELOCITY_LIMIT) {
            console.error("[Sherlock] Velocity limit exceeded. Flagging traffic as BOT_ATTACK.");
            return; // Block recording
        }

        // 3. Save Valid Referral
        sessionStorage.setItem('murad_ref_code', refCode);
        console.log(`[ViralEngine] Valid referral recorded: ${refCode}`);
    }

    // Called when a purchase/signup happens
    public async trackConversion(
        buyerId: string, 
        amount: number, 
        type: 'Course' | 'Product' | 'Job'
    ): Promise<ReferralLog | null> {
        const refCode = sessionStorage.getItem('murad_ref_code');
        if (!refCode) return null;

        // Calculate Commission
        let commission = 0;
        if (type === 'Course') commission = amount * 0.10; // 10%
        if (type === 'Product') commission = 0; // Usually products don't give affiliate unless dropshipping, maybe XP?
        if (type === 'Job') commission = 5; // Fixed 5 SAR per job referral (if hired, hypothetical)

        if (commission <= 0) return null; // No financial reward

        const log: ReferralLog = {
            id: `REF-${Date.now()}`,
            refCode,
            targetId: type, // Ideally the Item ID
            timestamp: new Date().toISOString(),
            converted: true,
            commissionEarned: commission
        };

        // Clear session to prevent double attribution
        sessionStorage.removeItem('murad_ref_code');

        return log;
    }

    // --- 4. BOT TRAP ---
    public triggerBotTrap(ip: string) {
        console.error(`[Sherlock] BOT TRAP TRIGGERED by IP: ${ip}. Banning ID permanently.`);
        // In real app: Add IP to firewall blacklist
        localStorage.setItem('sherlock_ban_list', JSON.stringify({ [ip]: true }));
    }

    // --- 5. LEADERBOARD GENERATOR (Mock Data) ---
    public getViralLeaderboard(): { name: string, earned: number, avatar: string }[] {
        return [
            { name: "أحمد العتيبي", earned: 4500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
            { name: "سارة محمد", earned: 3200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
            { name: "خالد الحربي", earned: 2150, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid" },
            { name: "نورة السبيعي", earned: 1800, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nora" },
            { name: "فيصل الدوسري", earned: 950, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Faisal" },
        ];
    }

    // --- 6. PAYOUT & STATS ---
    public requestPayout(userId: string, amount: number, method: 'WALLET' | 'BANK', bankDetails?: string): {success: boolean, message?: string} {
        // Validation handled in UI but double check here
        if (amount < 100) return { success: false, message: 'Minimum payout is 100 SAR' };
        
        // In real app: call API /core/Expansion/Payouts.php
        return { success: true, message: 'تم استلام طلب السحب بنجاح' };
    }

    public getChartData(timeframe: 'daily' | 'weekly'): any[] {
        // Mock data for graphs
        if (timeframe === 'weekly') {
            return [
                { label: 'Sun', clicks: 45, sales: 2 },
                { label: 'Mon', clicks: 62, sales: 5 },
                { label: 'Tue', clicks: 80, sales: 8 },
                { label: 'Wed', clicks: 55, sales: 3 },
                { label: 'Thu', clicks: 120, sales: 12 },
                { label: 'Fri', clicks: 90, sales: 9 },
                { label: 'Sat', clicks: 75, sales: 6 }
            ];
        }
        return [];
    }

    public getAssetTemplates(refLink: string): any[] {
        return [
            {
                id: 'banner1',
                title: 'خصم 50% على التدريب',
                description: 'بانر عالي التحويل للدورات التدريبية',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
                socialText: `استثمر في مستقبلك مع أكاديمية ميلاف! خصم خاص 50% على جميع الدورات التدريبية لفترة محدودة. سجل الآن: ${refLink}`
            },
            {
                id: 'banner2',
                title: 'أفضل السيارات المستعملة',
                description: 'بانر موجه لقسم الحراج والسيارات',
                image: 'https://images.unsplash.com/photo-1494905998402-395d579af905?q=80&w=1000&auto=format&fit=crop',
                socialText: `تبحث عن سيارة نظيفة وسعر ممتاز؟ تصفح حراج ميلاف الآن، آلاف السيارات بانتظارك: ${refLink}`
            },
            {
                id: 'banner3',
                title: 'فرص وظيفية عاجلة',
                description: 'بانر لجذب الباحثين عن عمل',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
                socialText: `وظائف جديدة في كبرى الشركات! قدم الآن عبر بوابة ميلاف الوطنية للتوظيف: ${refLink}`
            }
        ];
    }
}

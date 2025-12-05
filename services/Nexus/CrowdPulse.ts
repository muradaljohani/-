
/**
 * ==============================================================================
 * CROWD PULSE ENGINE (Social Proof & Live Data)
 * Generates real-time "Faux-Live" statistics to create urgency and trust.
 * ==============================================================================
 */

export class CrowdPulse {
    private static instance: CrowdPulse;

    private constructor() {}

    public static getInstance(): CrowdPulse {
        if (!CrowdPulse.instance) {
            CrowdPulse.instance = new CrowdPulse();
        }
        return CrowdPulse.instance;
    }

    public getLiveStats(context: 'Academy' | 'Market' | 'Jobs' | 'General', itemId?: string): { icon: string, text: string, count: number } {
        // Deterministic random based on itemId if provided, otherwise random
        const seed = itemId ? itemId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : Date.now();
        const rand = (n: number) => Math.floor((seed % 100) / 100 * n) + 5; 

        // Add some jitter for "liveness"
        const jitter = Math.floor(Math.random() * 5);

        if (context === 'Academy') {
            const count = 12 + jitter;
            return {
                icon: '🔥',
                text: `${count} طالب يشاهدون هذا الدرس الآن`,
                count
            };
        }

        if (context === 'Market') {
            const count = 35 + jitter;
            return {
                icon: '👀',
                text: `${count} شخص شاهد هذا الإعلان في آخر ساعة`,
                count
            };
        }

        if (context === 'Jobs') {
            const count = 120 + jitter;
            return {
                icon: '⚡',
                text: `${count} شخص تقدموا لهذه الوظيفة اليوم. عجل بالتقديم!`,
                count
            };
        }

        return { icon: '🟢', text: 'نشط الآن', count: 1 };
    }
}

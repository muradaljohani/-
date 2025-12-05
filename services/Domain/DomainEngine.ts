
export interface DomainResult {
    name: string;
    tld: string;
    status: 'available' | 'taken' | 'premium';
    price: number;
    originalPrice?: number;
    currency: 'SAR';
    tags?: string[];
}

export class DomainEngine {
    private static instance: DomainEngine;

    // Mock Pricing Database
    private readonly TLD_PRICES: Record<string, number> = {
        'com': 55,
        'net': 60,
        'org': 50,
        'sa': 120,
        'ai': 299,
        'io': 180,
        'store': 15,
        'tech': 25
    };

    private constructor() {}

    public static getInstance(): DomainEngine {
        if (!DomainEngine.instance) {
            DomainEngine.instance = new DomainEngine();
        }
        return DomainEngine.instance;
    }

    public async searchDomains(query: string): Promise<DomainResult[]> {
        // Simulate Network Latency
        await new Promise(resolve => setTimeout(resolve, 800));

        const cleanQuery = query.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (!cleanQuery) return [];

        const results: DomainResult[] = [];

        // 1. Exact Match Logic
        const mainTlds = ['com', 'sa', 'net', 'org', 'tech'];
        
        mainTlds.forEach(tld => {
            // Mock Availability Logic: 
            // If length is < 4 chars, it's taken or premium.
            // If it contains "google" or "apple", it's taken.
            const domainName = `${cleanQuery}.${tld}`;
            let status: 'available' | 'taken' | 'premium' = 'available';
            let price = this.TLD_PRICES[tld];
            
            if (cleanQuery.length <= 3) {
                status = 'premium';
                price = price * 50;
            } else if (cleanQuery.includes('google') || cleanQuery.includes('test') || cleanQuery === 'example') {
                status = 'taken';
            }

            results.push({
                name: domainName,
                tld: tld,
                status: status,
                price: price,
                originalPrice: status === 'available' ? Math.floor(price * 1.3) : undefined, // Fake discount
                currency: 'SAR',
                tags: tld === 'sa' ? ['هوية وطنية'] : tld === 'com' ? ['موصى به'] : []
            });
        });

        // 2. Suggestions / Alternatives
        if (results[0].status === 'taken') {
            results.push({
                name: `get${cleanQuery}.com`,
                tld: 'com',
                status: 'available',
                price: 55,
                currency: 'SAR',
                tags: ['بديل مميز']
            });
            results.push({
                name: `${cleanQuery}app.com`,
                tld: 'com',
                status: 'available',
                price: 55,
                currency: 'SAR',
                tags: []
            });
        }

        return results;
    }

    public getPopularTLDs() {
        return [
            { tld: '.com', price: 55, label: 'عالمي' },
            { tld: '.sa', price: 120, label: 'سعودي' },
            { tld: '.net', price: 60, label: 'تقني' },
            { tld: '.org', price: 50, label: 'مؤسسات' },
        ];
    }
}

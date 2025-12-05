
import { User, PrimeSubscription, Transaction } from '../../types';
import { WalletSystem } from '../Economy/WalletSystem';

export class SubscriptionCore {
    private static instance: SubscriptionCore;
    private readonly PRIME_PRICE = 49; // SAR

    private constructor() {}

    public static getInstance(): SubscriptionCore {
        if (!SubscriptionCore.instance) {
            SubscriptionCore.instance = new SubscriptionCore();
        }
        return SubscriptionCore.instance;
    }

    // --- 1. MEMBERSHIP ENGINE ---

    public async joinPrime(user: User): Promise<{ success: boolean; updatedUser?: User; error?: string }> {
        // 1. Check Wallet Balance
        const wallet = WalletSystem.getInstance().getOrCreateWallet(user);
        if (wallet.balance < this.PRIME_PRICE) {
            return { success: false, error: 'رصيد المحفظة غير كافٍ. يرجى شحن الرصيد.' };
        }

        // 2. Process Payment
        const txnResult = await WalletSystem.getInstance().processTransaction(
            wallet.id,
            'SUBSCRIPTION',
            this.PRIME_PRICE,
            'Murad Elite Monthly Subscription'
        );

        if (!txnResult.success) {
            return { success: false, error: txnResult.error };
        }

        // 3. Activate Subscription
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);

        const newSubscription: PrimeSubscription = {
            status: 'active',
            tier: 'Elite',
            startDate: now.toISOString(),
            nextBillingDate: nextMonth.toISOString(),
            autoRenew: true,
            price: this.PRIME_PRICE,
            benefits: {
                marketCommission: 0,
                jobBoosting: true,
                premiumCourses: 1,
                logisticsDiscount: 20
            }
        };

        const updatedUser = { ...user, primeSubscription: newSubscription, wallet: WalletSystem.getInstance().getOrCreateWallet(user) }; // Refresh wallet state in user object
        
        // Log event for Neural Network if needed (simulated via console for now)
        console.log(`[SubscriptionCore] User ${user.name} upgraded to Elite.`);

        return { success: true, updatedUser };
    }

    public cancelSubscription(user: User): User {
        if (!user.primeSubscription) return user;

        const updatedSub: PrimeSubscription = {
            ...user.primeSubscription,
            autoRenew: false,
            status: 'canceled' // In real app, keep active until billing cycle ends
        };

        return { ...user, primeSubscription: updatedSub };
    }

    // --- 2. THE MATRIX (Privilege Gate) ---

    public hasAccess(user: User | null, feature: 'ZeroCommission' | 'JobBoost' | 'PremiumCourse' | 'LogisticsDiscount'): boolean {
        if (!user || !user.primeSubscription || user.primeSubscription.status !== 'active') return false;
        
        switch (feature) {
            case 'ZeroCommission': return user.primeSubscription.benefits.marketCommission === 0;
            case 'JobBoost': return user.primeSubscription.benefits.jobBoosting;
            case 'PremiumCourse': return user.primeSubscription.benefits.premiumCourses > 0;
            case 'LogisticsDiscount': return user.primeSubscription.benefits.logisticsDiscount > 0;
            default: return false;
        }
    }

    // --- 3. NEURAL UPSELL (Contextual Trigger) ---

    public analyzeUserForUpsell(user: User): { showUpsell: boolean; reason?: 'HeavySeller' | 'JobSeeker' | 'Learner' } {
        if (user.primeSubscription?.status === 'active') return { showUpsell: false };

        // Logic based on mock user stats or behavior logs
        const salesCount = user.publisherStats?.totalSales || 0;
        const servicesCount = user.myServices?.length || 0;
        // Mock job applications count (in real app, query DB)
        const jobApps = 15; 

        if (salesCount > 2 || servicesCount > 3) {
            return { showUpsell: true, reason: 'HeavySeller' };
        }
        
        if (jobApps > 10) {
            return { showUpsell: true, reason: 'JobSeeker' };
        }

        // Default occasional trigger
        return { showUpsell: Math.random() > 0.8, reason: 'Learner' };
    }

    // --- 4. CHURN DEFENDER (Retention Logic) ---
    
    public getRetentionOffer(user: User): { hasOffer: boolean; discountPercent: number; message: string } {
        // Logic: If user has been subbed for > 3 months, offer 50%. Else 20%.
        // Simplified for demo:
        return {
            hasOffer: true,
            discountPercent: 50,
            message: "انتظر! لا تغادرنا. احصل على خصم 50% للشهر القادم إذا بقيت معنا."
        };
    }

    public applyRetentionDiscount(user: User): User {
        if (!user.primeSubscription) return user;
        // Apply logic to reduce next billing price
        const updatedSub = { 
            ...user.primeSubscription, 
            discountApplied: true,
            autoRenew: true // Re-enable if they were cancelling
        };
        return { ...user, primeSubscription: updatedSub };
    }
}
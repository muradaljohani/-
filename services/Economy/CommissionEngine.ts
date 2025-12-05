
export class CommissionEngine {
    
    public static calculateCommission(amount: number, category: string): number {
        // Standard Commission Table
        // Cars: 1% capped at 5000
        // Real Estate: 2.5%
        // Services: 10%
        // General: 1%
        
        if (category === 'Cars') return Math.min(amount * 0.01, 5000);
        if (category === 'Services') return amount * 0.10;
        
        return amount * 0.01; // Default 1%
    }

    public static generatePaymentLink(commissionAmount: number, itemId: string): string {
        // In real app, this generates a Stripe/Payment Gateway Link
        return `https://murad-group.com/pay/commission?amount=${commissionAmount}&ref=${itemId}`;
    }
}

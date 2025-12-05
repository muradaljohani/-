
import { BehaviorObserver } from '../LMS_Brain';

// THE MONETIZATION DIRECTOR
export class PricingAI {
  private static instance: PricingAI;

  private constructor() {}

  public static getInstance(): PricingAI {
    if (!PricingAI.instance) {
      PricingAI.instance = new PricingAI();
    }
    return PricingAI.instance;
  }

  // Monitor Course Interest -> Offer Dynamic Discount
  public checkAndOfferDiscount(courseId: string, userId: string): { hasDiscount: boolean; discountPercent?: number; reason?: string } {
    const observer = BehaviorObserver.getInstance();
    const logs = observer.getLogs();
    
    // Filter logs for this specific user and course
    const userInteractions = logs.filter(l => l.user_id === userId && l.course_id === courseId);
    
    // Logic: If user viewed > 3 times OR hovered > 30 seconds total, but hasn't bought
    const totalHoverTime = userInteractions
        .filter(l => l.action_type === 'hover')
        .reduce((sum, l) => sum + l.duration_seconds, 0);
    
    const viewCount = userInteractions.filter(l => l.action_type === 'view').length;

    if (totalHoverTime > 30 || viewCount >= 3) {
        console.log(`[PricingAI] Detected high interest for ${userId} on ${courseId}. Generating Flash Deal.`);
        return {
            hasDiscount: true,
            discountPercent: 20, // 20% OFF
            reason: 'High Interest Detected'
        };
    }

    return { hasDiscount: false };
  }

  public getDynamicPrice(basePrice: number, discountPercent: number): number {
      return basePrice - (basePrice * (discountPercent / 100));
  }
}

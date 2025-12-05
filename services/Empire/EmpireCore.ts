
import { User, Notification, CRMUserExtension } from '../../types';

/*
  SQL SCHEMA REPRESENTATION (Conceptual)
  
  TABLE crm_leads (
    user_id VARCHAR(50) PRIMARY KEY,
    lead_score INT DEFAULT 0,
    tags TEXT, -- JSON Array
    lifecycle_stage VARCHAR(20),
    total_spend DECIMAL(10,2) DEFAULT 0.00,
    last_action TIMESTAMP
  );

  TABLE marketing_campaigns (
    id VARCHAR(50) PRIMARY KEY,
    trigger_event VARCHAR(50),
    channel VARCHAR(20),
    template_id VARCHAR(50),
    status VARCHAR(20)
  );

  TABLE analytics_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50),
    metadata TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
*/

// --- ENGINE 1: OMNI-CRM (The Customer Relationship Manager) ---
export class CRM {
  private static instance: CRM;

  private constructor() {}

  public static getInstance(): CRM {
    if (!CRM.instance) {
      CRM.instance = new CRM();
    }
    return CRM.instance;
  }

  // initialize or update CRM data for a user
  public trackAction(user: User, action: 'login' | 'apply_job' | 'view_course' | 'purchase', metadata?: any): User {
    let crm = user.crmData || {
      leadScore: 0,
      tags: [],
      lifecycleStage: 'New',
      lastAction: new Date().toISOString(),
      totalSpend: 0
    };

    // Lead Scoring Logic
    let scoreToAdd = 0;
    switch(action) {
        case 'login': scoreToAdd = 1; break;
        case 'view_course': scoreToAdd = 2; break;
        case 'apply_job': scoreToAdd = 10; crm.tags = this.addTag(crm.tags, '#JobSeeker'); break;
        case 'purchase': scoreToAdd = 50; crm.tags = this.addTag(crm.tags, '#Customer'); crm.totalSpend += metadata?.amount || 0; break;
    }

    crm.leadScore += scoreToAdd;
    crm.lastAction = new Date().toISOString();

    // Auto-Tagging & Lifecycle
    if (crm.leadScore > 100) {
        crm.tags = this.addTag(crm.tags, '#VIP');
        crm.lifecycleStage = 'Loyal';
    } else if (crm.totalSpend > 0) {
        crm.lifecycleStage = 'Active';
    }

    // Contextual Tagging based on metadata
    if (metadata?.category) {
        crm.tags = this.addTag(crm.tags, `#InterestedIn_${metadata.category}`);
    }

    console.log(`[Empire CRM] User ${user.name} scored +${scoreToAdd}. Total: ${crm.leadScore}. Tags: ${crm.tags.join(', ')}`);
    
    // In a real app, this would save to DB. Here we return the updated user object to be saved in AuthContext.
    return { ...user, crmData: crm };
  }

  private addTag(tags: string[], newTag: string): string[] {
      if (!tags.includes(newTag)) return [...tags, newTag];
      return tags;
  }
}

// --- ENGINE 2: GROWTH HACKING (Marketing Automation) ---
export class MarketingAutomator {
    // Simulates Drip Campaigns & Recovery
    public static checkTriggers(user: User): Notification[] {
        const notifications: Notification[] = [];
        
        // 1. Cart/Interest Recovery (Simulated by checking last viewed item in session storage)
        const lastViewed = sessionStorage.getItem('last_viewed_product'); // Mocked
        if (lastViewed && Math.random() > 0.7) { // Random chance to trigger for demo
            notifications.push({
                id: `mkt_${Date.now()}`,
                userId: user.id,
                type: 'info',
                title: 'نسيت شيئاً؟',
                message: 'لاحظنا اهتمامك بمنتج في السوق. أكمل الشراء الآن واحصل على خصم 5%.',
                isRead: false,
                date: new Date().toISOString()
            });
        }

        // 2. Welcome Drip (Day 1)
        const joinDate = new Date(user.joinDate || Date.now());
        const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceJoin === 1) {
             notifications.push({
                id: `drip_1_${user.id}`,
                userId: user.id,
                type: 'success',
                title: 'مرحباً بك في العائلة!',
                message: 'نحن سعداء بانضمامك. ابدأ رحلتك بتصفح الوظائف أو الدورات التدريبية.',
                isRead: false,
                date: new Date().toISOString()
            });
        }

        // 3. Reactivation (Day 7)
        if (daysSinceJoin === 7 && (!user.crmData || user.crmData.totalSpend === 0)) {
             notifications.push({
                id: `drip_7_${user.id}`,
                userId: user.id,
                type: 'financial',
                title: 'هدية خاصة لك',
                message: 'استخدم الكود MURAD20 للحصول على خصم 20% على أول دورة تدريبية.',
                isRead: false,
                date: new Date().toISOString()
            });
        }

        return notifications;
    }
}

// --- ENGINE 3: ORACLE ANALYTICS (BI Dashboard) ---
export class OracleBI {
    // Generates the "Report" data structure
    public static generateExecutiveReport(): any {
        const keywords = ['Python', 'Project Manager', 'Cybersecurity', 'Accounting', 'HR'];
        const traffic = [120, 150, 180, 220, 300, 280, 350]; // Last 7 days
        
        return {
            reportId: `RPT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            generatedAt: new Date().toISOString(),
            metrics: {
                totalTraffic: traffic.reduce((a, b) => a + b, 0),
                mostSearched: keywords[Math.floor(Math.random() * keywords.length)],
                peakHour: '20:00 - 22:00',
                revenueForecast: 'Upward Trend (+15%)'
            },
            notes: 'Generated by Empire Oracle Intelligence Engine.'
        };
    }
}


import { SupportTicket } from '../../types';

export class SentinelBot {
    
    public static processQuery(query: string, context: string): { response: string, action?: string } {
        const q = query.toLowerCase();

        // 1. Password Reset (L1 Automation)
        if (q.includes('reset') || q.includes('password') || q.includes('pass') || q.includes('كلمة المرور') || q.includes('نسيت')) {
            return {
                response: "🔒 لإعادة تعيين كلمة المرور، يرجى زيارة الرابط التالي: murad-group.com/reset-password. هل تحتاج مساعدة أخرى؟",
                action: 'link_reset'
            };
        }

        // 2. Payment Issues (Ticket Creation)
        if (q.includes('payment') || q.includes('money') || q.includes('refund') || q.includes('دفع') || q.includes('فلوس') || q.includes('استرجاع')) {
            const ticketId = `TKT-${Math.floor(Math.random() * 10000)}`;
            return {
                response: `⚠️ يؤسفنا سماع ذلك. تم إنشاء تذكرة دعم فني عاجلة برقم #${ticketId}. سيقوم فريقنا بمراجعة العملية المالية خلال 24 ساعة.`,
                action: 'create_ticket'
            };
        }

        // 3. Context Aware - Jobs
        if (context === 'jobs' && (q.includes('apply') || q.includes('cv') || q.includes('تقديم') || q.includes('سيرة'))) {
            return {
                response: "📝 للتقديم على الوظائف، تأكد من إكمال ملفك الشخصي بنسبة 80% على الأقل. هل ترغب في تفعيل خدمة بناء السيرة الذاتية؟",
                action: 'suggest_cv'
            };
        }

        // 4. Context Aware - Market
        if (context === 'market' && (q.includes('sell') || q.includes('post') || q.includes('بيع') || q.includes('نشر'))) {
            return {
                response: "💰 يمكنك البدء في البيع فوراً بالضغط على زر 'إضافة إعلان'. تذكر أننا نستخدم نظام الدفع الآمن (Escrow) لحمايتك.",
                action: 'guide_sell'
            };
        }

        // Default AI Handoff
        return {
            response: "مرحباً! أنا الحارس الذكي (Sentinel). كيف يمكنني خدمتك اليوم في منصة ميلاف؟",
            action: 'general'
        };
    }
}


import { SupportTicket, SentinelState, SentinelIntent } from '../../types';

// --- SENTINEL PRIME ARCHITECTURE ---

export class SentinelBrain {
    
    // --- 1. KNOWLEDGE NEURAL NET (The Brain) ---
    private static knowledgeBase = {
        'Login_Error': {
            keywords: ['login', 'sign in', 'access', 'دخول', 'نسيت', 'password'],
            response: '🔒 لمساعدتك في الدخول، هل تواجه رسالة "كلمة المرور خاطئة" أم أن الحساب محظور؟',
            nextState: 'INTERROGATING_TECH'
        },
        'Financial_Issue': {
            keywords: ['money', 'refund', 'payment', 'paid', 'credit', 'فلوس', 'استرجاع', 'دفع', 'سداد', 'wallet'],
            response: '💰 أرى أن استفسارك مالي. هل يتعلق الأمر بعملية دفع لم تكتمل أم طلب استرداد؟',
            nextState: 'INTERROGATING_FINANCE'
        },
        'Scam_Report': {
            keywords: ['scam', 'fake', 'fraud', 'cheat', 'نصب', 'احتيال', 'وهمي', 'سرقة', 'suspicious'],
            response: '⛔ بلاغات الاحتيال لها أولوية قصوى. هل حدثت الواقعة داخل منصة الحراج أم عبر رسائل خاصة؟',
            nextState: 'INTERROGATING_SCAM'
        },
        'Ad_Deletion': {
            keywords: ['delete', 'remove', 'ad', 'إعلان', 'حذف', 'إلغاء'],
            response: '🗑️ لحذف إعلان، يرجى تزويدي برقم الإعلان (Ad ID) الموجود في صفحة التفاصيل.',
            nextState: 'RESOLVING'
        },
        'Course_Refund': {
            keywords: ['course refund', 'return course', 'استرجاع دورة'],
            response: '🎓 يمكن استرجاع رسوم الدورة إذا لم تمر 24 ساعة. هل يمكنك تزويدي برقم الطلب؟',
            nextState: 'RESOLVING'
        }
    };

    // --- 2. THE DIALOG STATE MACHINE (The Interrogator) ---
    public static processInput(input: string, currentState: SentinelState): { response: string, nextState: SentinelState, action?: string } {
        const text = input.toLowerCase();

        // STATE 0: IDLE / CLASSIFICATION
        if (currentState === 'IDLE' || currentState === 'CLASSIFYING') {
            const intent = this.classifyIntent(text);
            
            if (intent === 'TECH_ISSUE') {
                return { 
                    response: this.knowledgeBase['Login_Error'].response, 
                    nextState: 'INTERROGATING_TECH' 
                };
            }
            if (intent === 'FINANCIAL_ISSUE') {
                return { 
                    response: this.knowledgeBase['Financial_Issue'].response, 
                    nextState: 'INTERROGATING_FINANCE' 
                };
            }
            if (intent === 'SCAM_REPORT') {
                return { 
                    response: this.knowledgeBase['Scam_Report'].response, 
                    nextState: 'INTERROGATING_SCAM' 
                };
            }
            if (intent === 'GENERAL') {
                // Check specific direct commands (e.g. Delete Ad)
                if (text.includes('حذف') || text.includes('delete')) {
                    return { response: this.knowledgeBase['Ad_Deletion'].response, nextState: 'RESOLVING' };
                }
                return { response: "عذراً، لم أفهم تماماً. هل يمكنك الاختيار: (مشكلة تقنية، مالية، أو بلاغ)؟", nextState: 'IDLE' };
            }
        }

        // STATE 2: DRILL DOWN (TECH)
        if (currentState === 'INTERROGATING_TECH') {
            if (text.includes('code') || text.includes('error') || text.includes('رسالة')) {
                return { 
                    response: "شكراً للتوضيح. يرجى إرفاق صورة لرسالة الخطأ الآن (أو كتابة الكود).", 
                    nextState: 'ESCALATING',
                    action: 'request_upload'
                };
            }
            if (text.includes('reset') || text.includes('جديد')) {
                return {
                    response: "يمكنك إعادة تعيين كلمة المرور فوراً من هنا: murad-group.com/reset. هل تم الحل؟",
                    nextState: 'IDLE'
                };
            }
        }

        // STATE 3: DRILL DOWN (FINANCE/REFUND)
        if (currentState === 'INTERROGATING_FINANCE') {
            if (text.includes('refund') || text.includes('استرجاع')) {
                return {
                    response: "حسناً، لطلب الاسترجاع الآلي، يرجى تزويدي برقم العملية (Transaction ID).",
                    nextState: 'RESOLVING',
                    action: 'wait_for_tx_id'
                };
            }
            return {
                response: "فهمت. سأقوم برفع تذكرة للمالية. يرجى تزويدي بإيصال التحويل إن وجد.",
                nextState: 'ESCALATING'
            };
        }

        // STATE 4: RESOLUTION (AUTO-FIXER)
        if (currentState === 'RESOLVING') {
            // Simulated Logic for Refund / Delete
            if (text.startsWith('txn') || text.match(/\d+/)) {
                // Simulate checking DB
                const isEligible = Math.random() > 0.3; // 70% chance eligible for demo
                if (isEligible) {
                    return {
                        response: "✅ تم التحقق من الأهلية. قمتُ بتنفيذ عملية الاسترجاع آلياً. المبلغ الآن في محفظتك.",
                        nextState: 'IDLE',
                        action: 'execute_refund'
                    };
                } else {
                    return {
                        response: "⚠️ عذراً، النظام يظهر أن العملية تجاوزت المدة المسموحة للاسترجاع الآلي. سأفتح تذكرة للمراجعة اليدوية.",
                        nextState: 'ESCALATING',
                        action: 'escalate_ticket'
                    };
                }
            }
        }

        // Default Fallback
        return {
            response: "دعني أجمع المزيد من التفاصيل لمساعدتك. هل يمكنك وصف المشكلة بسطر واحد؟",
            nextState: 'ESCALATING'
        };
    }

    // --- 3. CLASSIFICATION ENGINE (Fuzzy Logic) ---
    private static classifyIntent(text: string): 'TECH_ISSUE' | 'FINANCIAL_ISSUE' | 'SCAM_REPORT' | 'GENERAL' {
        // Simple fuzzy match simulation
        const techKeywords = this.knowledgeBase['Login_Error'].keywords;
        const finKeywords = this.knowledgeBase['Financial_Issue'].keywords;
        const scamKeywords = this.knowledgeBase['Scam_Report'].keywords;

        if (finKeywords.some(k => text.includes(k))) return 'FINANCIAL_ISSUE';
        if (techKeywords.some(k => text.includes(k))) return 'TECH_ISSUE';
        if (scamKeywords.some(k => text.includes(k))) return 'SCAM_REPORT';
        
        return 'GENERAL';
    }

    // --- 4. TICKET MASTER (The Escalator) ---
    public static generateSmartTicket(userId: string, history: string[], category: string): SupportTicket {
        const id = `TKT-${Math.floor(Math.random() * 90000) + 10000}`;
        const summary = `Auto-Generated Summary: User reported ${category} issue. Dialogue history indicates potential system error.`;
        
        return {
            id,
            userId,
            subject: `Sentinel Report: ${category}`,
            issue: history.join('\n'), // Full chat log
            priority: category === 'SCAM_REPORT' ? 'Urgent' : 'High',
            status: 'Open',
            createdAt: new Date().toISOString(),
            category: category,
            autoSummary: summary
        };
    }
}

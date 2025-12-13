
/**
 * CONTENT SAFETY SYSTEM
 * ---------------------
 * This utility provides client-side text analysis to prevent:
 * 1. Profanity / Hate Speech
 * 2. Self-Harm keywords
 * 3. PII Leaks (Phone numbers)
 * 
 * FUTURE AI INTEGRATION:
 * To upgrade this to an AI-based system (like Twitter/OnlyFans):
 * 1. Use OpenAI Moderation API: https://platform.openai.com/docs/guides/moderation
 *    - Endpoint: POST https://api.openai.com/v1/moderations
 *    - Cost: Free (tiered)
 * 2. Or Google Perspective API (part of Jigsaw).
 * 
 * Example Implementation for Future:
 * export const checkAI = async (text) => {
 *   const res = await fetch('https://api.openai.com/v1/moderations', { body: JSON.stringify({ input: text }) ... });
 *   return res.results[0].flagged;
 * }
 */

// --- CONFIGURATION ---

// Placeholder Blocklist - Populate with real terms as needed
const FORBIDDEN_TERMS = [
    // English
    'kill', 'suicide', 'die', 'murder', 'scam', 'fraud', 'steal', 'hate', 'racist',
    // Arabic
    'انتحار', 'قتل', 'موت', 'نصب', 'احتيال', 'سرقة', 'كراهية', 'عنصرية', 'شتيمة', 'قذر', 'حقير', 'تزوير'
];

const PHONE_REGEX = /(\+966|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})/g;

// --- HELPERS ---

/**
 * Normalizes Arabic text to detect evasion attempts.
 * e.g., "مــووت" -> "موت", "أنتحار" -> "انتحار"
 */
const normalizeText = (text: string): string => {
    if (!text) return '';
    
    let normalized = text.toLowerCase();

    // 1. Remove Diacritics (Tashkeel) & Tatweel (Kashida)
    // Range \u064B-\u065F includes Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun
    // \u0640 is Tatweel (_)
    normalized = normalized.replace(/[\u064B-\u065F\u0640]/g, '');

    // 2. Normalize Alef
    normalized = normalized.replace(/[أإآ]/g, 'ا');
    
    // 3. Normalize Taa Marbuta
    normalized = normalized.replace(/ة/g, 'ه');

    // 4. Remove repeated characters (e.g. "heeeello" -> "helo" for cleaner matching, or just reduce >2 to 1)
    // Here we reduce 3+ repetitions to 1 to catch "بـــــد" -> "بد"
    normalized = normalized.replace(/(.)\1{2,}/g, '$1');

    // 5. Remove special separators often used to bypass filters (e.g. "b.a.d")
    // Note: This is aggressive, use carefully. For now, we allow spaces.
    // normalized = normalized.replace(/[._-]/g, ''); 

    return normalized;
};

// --- MAIN FUNCTION ---

export interface SafetyCheckResult {
    isSafe: boolean;
    reason?: string;
}

export const isContentSafe = (text: string): SafetyCheckResult => {
    if (!text || text.trim().length === 0) return { isSafe: true };

    const cleanText = normalizeText(text);

    // 1. Check for Phone Numbers (Privacy / Anti-Spam)
    if (PHONE_REGEX.test(text.replace(/\s/g, ''))) {
        return {
            isSafe: false,
            reason: 'يمنع نشر أرقام الهواتف الشخصية في العلن. يرجى استخدام الرسائل الخاصة.'
        };
    }

    // 2. Check Blocklist
    for (const word of FORBIDDEN_TERMS) {
        // We check both the raw text and normalized text
        if (cleanText.includes(word) || text.toLowerCase().includes(word)) {
            return {
                isSafe: false,
                reason: `يحتوي النص على كلمات مخالفة لمعايير المجتمع (${word}).`
            };
        }
    }

    return { isSafe: true };
};

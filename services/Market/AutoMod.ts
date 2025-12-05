
import { User } from '../../types';

/**
 * THE AUTO-MOD SENTINEL
 * Filters bad content and prevents spam flooding instantly.
 */
export class AutoMod {
    private static BAD_WORDS = ['احتيال', 'نصب', 'ممنوع', 'سلاح', 'مخدرات', 'scam', 'fraud', 'illegal', 'kill', 'attack'];
    private static MAX_POSTS_PER_HOUR = 5;

    public static validatePost(user: User, title: string, description: string): { status: 'active' | 'review' | 'rejected', reason?: string } {
        // 1. Content Safety Check (Lexicon Filter)
        const content = (title + ' ' + description).toLowerCase();
        const foundBadWord = this.BAD_WORDS.find(w => content.includes(w));
        
        if (foundBadWord) {
            console.warn(`[AutoMod] Blocked content containing: ${foundBadWord}`);
            return { status: 'rejected', reason: `المحتوى يحتوي على كلمات محظورة: ${foundBadWord}` };
        }

        // 2. Spam Flood Check
        // We retrieve timestamps of previous posts for this user
        const storageKey = `post_log_${user.id}`;
        const rawLog = localStorage.getItem(storageKey);
        const postTimestamps: number[] = rawLog ? JSON.parse(rawLog) : [];
        
        const oneHourAgo = Date.now() - 3600000;
        const recentPosts = postTimestamps.filter((t: number) => t > oneHourAgo);
        
        if (recentPosts.length >= this.MAX_POSTS_PER_HOUR) {
            console.warn(`[AutoMod] Rate limit exceeded for user: ${user.id}`);
            return { status: 'review', reason: 'تجاوزت حد النشر المسموح في الساعة (5 إعلانات). سيتم مراجعة الإعلان يدوياً.' };
        }

        // 3. Update Log
        recentPosts.push(Date.now());
        localStorage.setItem(storageKey, JSON.stringify(recentPosts));

        // 4. Safe
        return { status: 'active' };
    }
}

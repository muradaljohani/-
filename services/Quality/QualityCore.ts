
import { User } from '../../types';

/**
 * ==============================================================================
 * QUALITY ASSURANCE CORE (The Auto-Polish Layer)
 * Handles: Image Enhancement, Text Polishing, Trust Scoring
 * ==============================================================================
 */

export class QualityCore {
    private static instance: QualityCore;

    private constructor() {}

    public static getInstance(): QualityCore {
        if (!QualityCore.instance) {
            QualityCore.instance = new QualityCore();
        }
        return QualityCore.instance;
    }

    // --- ENGINE 1: THE 'STUDIO' IMAGE ENHANCER ---
    
    public async processImage(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { reject("Canvas error"); return; }

                    // 1. Resize (Compression Strategy)
                    const MAX_WIDTH = 1200;
                    const scale = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scale;

                    // 2. Auto-Brighten & Contrast (Visual AI)
                    // We use filter before drawing
                    ctx.filter = 'brightness(110%) contrast(105%) saturate(110%)';
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    ctx.filter = 'none'; // Reset for watermark

                    // 3. Watermark
                    const fontSize = Math.floor(canvas.width * 0.03);
                    ctx.font = `bold ${fontSize}px Tajawal, sans-serif`;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText('© Melaf Market', canvas.width - 20, canvas.height - 20);

                    // Logo overlay (Simulated with text for zero-dep)
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(canvas.width - 150, canvas.height - 50, 130, 30);

                    // 4. Export Compressed WebP
                    const dataUrl = canvas.toDataURL('image/webp', 0.8);
                    resolve(dataUrl);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    }

    // --- ENGINE 2: THE 'GRAMMARLY' TEXT POLISHER ---

    public polishTitle(title: string): string {
        if (!title) return '';
        // 1. Auto-Capitalize English
        let polished = title.replace(/\b\w/g, l => l.toUpperCase());
        
        // 2. Fix common Arabic spacing issues (basic)
        polished = polished.replace(/\s+/g, ' ').trim();
        
        // 3. Add formatting if looks like "Car Year" e.g., "Camry 2020" -> "Camry - 2020"
        if (/^[a-zA-Z\u0600-\u06FF]+\s\d{4}$/.test(polished)) {
            polished = polished.replace(/(\d{4})/, '- $1');
        }

        return polished;
    }

    public cleanDescription(text: string): { cleanText: string, flagged: boolean } {
        let clean = text;
        let flagged = false;

        // 1. Bad Word Filter / Phone Number Masking
        // Regex for potential phone numbers (SA)
        const phoneRegex = /(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})/g;
        if (phoneRegex.test(clean)) {
            clean = clean.replace(phoneRegex, ' [تم إخفاء الرقم - استخدم زر الاتصال] ');
            flagged = true;
        }

        // 2. Spell Check (Simulation)
        // In a real app, this calls an NLP API. Here we fix common typos.
        const typos: Record<string, string> = {
            'اللة': 'الله',
            'انشالله': 'إن شاء الله',
            'ذكي': 'ذكاء', // Context dependent, simplified here
        };

        Object.keys(typos).forEach(typo => {
            if (clean.includes(typo)) {
                clean = clean.replace(new RegExp(typo, 'g'), typos[typo]);
            }
        });

        return { cleanText: clean, flagged };
    }

    // --- ENGINE 3: TRUST SCORECARD ---

    public calculateTrustScore(user: User): { score: number, isTrusted: boolean, breakdown: any } {
        let score = 0;
        const breakdown = {
            email: false,
            phone: false,
            sales: false,
            response: false
        };

        // 1. Email Verified (+20)
        if (user.isEmailVerified || user.verified) {
            score += 20;
            breakdown.email = true;
        }

        // 2. Phone Verified (+30) - Heavy weight for trust
        if (user.isPhoneVerified || user.isIdentityVerified) {
            score += 30;
            breakdown.phone = true;
        }

        // 3. Completed Sales (+40)
        const sales = user.publisherStats?.totalSales || 0;
        if (sales >= 3) {
            score += 40;
            breakdown.sales = true;
        } else if (sales > 0) {
            score += 20; // Partial score
        }

        // 4. Response Time (Simulated check) (+10)
        // Assuming we track this, for now default to true for active users
        if (user.isLoggedIn) {
            score += 10;
            breakdown.response = true;
        }

        return {
            score: Math.min(100, score),
            isTrusted: score >= 90,
            breakdown
        };
    }
}

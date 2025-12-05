
import Tesseract from 'tesseract.js';

/**
 * ==============================================================================
 * OCR SCANNER (Semi-Auto Verification)
 * Layer 3: The 'Receipt' Scanner
 * ==============================================================================
 */

export interface ScanResult {
    isValid: boolean;
    text: string;
    extractedAmount?: number;
    confidence: number;
    warnings: string[];
}

export class OCRScanner {
    private static instance: OCRScanner;

    private constructor() {}

    public static getInstance(): OCRScanner {
        if (!OCRScanner.instance) {
            OCRScanner.instance = new OCRScanner();
        }
        return OCRScanner.instance;
    }

    public async scanReceipt(file: File): Promise<ScanResult> {
        console.log(`[OCR] Scanning receipt: ${file.name}`);
        
        try {
            // Recognize text (English & Arabic)
            const result = await Tesseract.recognize(
                file,
                'eng+ara', 
                { 
                    logger: m => console.log(`[OCR Progress] ${m.status}: ${Math.round(m.progress * 100)}%`) 
                }
            );

            const text = result.data.text;
            const confidence = result.data.confidence;
            const warnings: string[] = [];

            // 1. Validation Logic: Keywords
            const keywords = ['AlJazira', 'الجزيرة', 'Transfer', 'تحويل', 'Amount', 'مبلغ', 'Successful', 'ناجحة', 'Reference', 'مرجع'];
            const foundKeywords = keywords.filter(k => text.includes(k));
            
            // If less than 2 keywords found, flag as potentially invalid
            if (foundKeywords.length < 2) {
                warnings.push("⚠️ لم يتم العثور على كلمات مفتاحية بنكية (الجزيرة، تحويل، مبلغ). يرجى التأكد من وضوح الصورة.");
            }

            // 2. Amount Extraction (Simple Regex)
            let extractedAmount: number | undefined;
            // Matches: 50.00, 50 SAR, 50.00 ريال
            const amountRegex = /(\d{1,5}(?:\.\d{2})?)\s*(?:SAR|SR|ريال|ر.س)/i;
            const match = text.match(amountRegex);
            if (match) {
                extractedAmount = parseFloat(match[1]);
            }

            // 3. Bank Verification
            if (!text.includes('AlJazira') && !text.includes('الجزيرة')) {
                warnings.push("⚠️ لم يتم التعرف على اسم بنك الجزيرة في الإيصال.");
            }

            return {
                isValid: warnings.length === 0,
                text,
                extractedAmount,
                confidence,
                warnings
            };

        } catch (error) {
            console.error("[OCR] Scan Failed:", error);
            return {
                isValid: false,
                text: '',
                confidence: 0,
                warnings: ["فشل المسح الضوئي. يرجى المحاولة مرة أخرى."]
            };
        }
    }
}

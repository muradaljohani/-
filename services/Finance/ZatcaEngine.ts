
/**
 * ==============================================================================
 * ZATCA E-INVOICING ENGINE (KSA Compliance)
 * Handles: TLV Encoding for Phase 2 QR Codes
 * ==============================================================================
 */

export class ZatcaEngine {
    private static instance: ZatcaEngine;

    private constructor() {}

    public static getInstance(): ZatcaEngine {
        if (!ZatcaEngine.instance) {
            ZatcaEngine.instance = new ZatcaEngine();
        }
        return ZatcaEngine.instance;
    }

    /**
     * Generates a Base64 Encoded TLV (Tag-Length-Value) String
     * Required by ZATCA for E-Invoice QR Codes.
     */
    public generateTLVQR(
        sellerName: string,
        vatNumber: string,
        timestamp: string,
        invoiceTotal: string,
        vatTotal: string
    ): string {
        
        // 1. Seller Name
        const tag1 = this.getTLVTag(1, sellerName);
        
        // 2. VAT Registration Number
        const tag2 = this.getTLVTag(2, vatNumber);
        
        // 3. Timestamp (ISO 8601 or similar, e.g., 2023-01-01T12:00:00Z)
        const tag3 = this.getTLVTag(3, timestamp);
        
        // 4. Invoice Total (with VAT)
        const tag4 = this.getTLVTag(4, invoiceTotal);
        
        // 5. VAT Total
        const tag5 = this.getTLVTag(5, vatTotal);

        // Concatenate all tags
        const allTags = new Uint8Array([
            ...tag1,
            ...tag2,
            ...tag3,
            ...tag4,
            ...tag5
        ]);

        // Convert to Base64
        return this.toBase64(allTags);
    }

    private getTLVTag(tagNum: number, value: string): Uint8Array {
        const valBytes = this.toUTF8Array(value);
        const len = valBytes.length;
        return new Uint8Array([tagNum, len, ...valBytes]);
    }

    private toUTF8Array(str: string): Uint8Array {
        const utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            } else { // surrogate pair
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
        }
        return new Uint8Array(utf8);
    }

    private toBase64(bytes: Uint8Array): string {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}


export class CertificateAuthority {
    private static instance: CertificateAuthority;
    private readonly SECRET_SALT = "MYLAF_ACADEMY_SECURE_SALT_v1";

    private constructor() {}

    public static getInstance(): CertificateAuthority {
        if (!CertificateAuthority.instance) {
            CertificateAuthority.instance = new CertificateAuthority();
        }
        return CertificateAuthority.instance;
    }

    /**
     * Generates a deterministic, immutable hash for a certificate.
     */
    public async generateCertificateID(studentName: string, courseTitle: string, date: string): Promise<string> {
        const rawData = `${studentName.trim().toUpperCase()}|${courseTitle.trim()}|${date}|${this.SECRET_SALT}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(rawData);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Return a formatted ID: CRT-[Year]-[HashSegment]
        return `CRT-${new Date().getFullYear()}-${hashHex.substring(0, 12).toUpperCase()}`;
    }

    /**
     * Verifies a certificate ID against the ledger (Mocked Ledger for now).
     */
    public verifyCertificate(certId: string): { isValid: boolean; metadata?: any } {
        // In a real blockchain app, this would query the chain.
        // Here, we simulate verification logic.
        
        if (!certId.startsWith('CRT-')) return { isValid: false };

        // Mock verification database
        // In production, this verifies the hash signature.
        const isValidStructure = /^[A-Z0-9-]{10,}$/.test(certId);
        
        if (isValidStructure) {
            return {
                isValid: true,
                metadata: {
                    student: "Student Name (Verified)",
                    course: "Professional Certification",
                    issueDate: new Date().toISOString(),
                    issuer: "Mylaf Murad National Academy"
                }
            };
        }
        
        return { isValid: false };
    }
}

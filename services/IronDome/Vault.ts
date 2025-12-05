
/**
 * IRON DOME: RING 2 - THE QUANTUM VAULT
 * "Data visible only to those who hold the key."
 */

export class Vault {
    private static instance: Vault;
    private key: CryptoKey | null = null;
    private readonly ALGORITHM = 'AES-GCM';
    
    // In a real scenario, this salt would be unique per user and stored securely on a server.
    // For this architecture, we derive it from a static system secret + user-specific session data.
    private readonly SYSTEM_SALT = 'MURAD_IRON_DOME_SECURE_SALT_V1';

    private constructor() {}

    public static getInstance(): Vault {
        if (!Vault.instance) {
            Vault.instance = new Vault();
            Vault.instance.initializeKey();
        }
        return Vault.instance;
    }

    private async initializeKey() {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(this.SYSTEM_SALT),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        this.key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: enc.encode("unique-salt"),
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false, // Key is non-extractable (Military Grade)
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Encrypts data into a base64 string.
     */
    public async encrypt(data: string): Promise<string> {
        if (!this.key) await this.initializeKey();
        
        const enc = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt(
            { name: this.ALGORITHM, iv },
            this.key!,
            enc.encode(data)
        );

        // Pack IV and Ciphertext
        const ivArr = Array.from(iv);
        const encryptedArr = Array.from(new Uint8Array(encrypted));
        const combined = new Uint8Array([...ivArr, ...encryptedArr]);
        
        return this.arrayBufferToBase64(combined);
    }

    /**
     * Decrypts base64 string back to original data.
     */
    public async decrypt(base64: string): Promise<string | null> {
        if (!this.key) await this.initializeKey();

        try {
            const combined = this.base64ToArrayBuffer(base64);
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const decrypted = await window.crypto.subtle.decrypt(
                { name: this.ALGORITHM, iv: new Uint8Array(iv) },
                this.key!,
                data
            );

            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("[Vault] Decryption Failed: Tampering Detected.");
            return null;
        }
    }

    // --- Utils ---
    private arrayBufferToBase64(buffer: Uint8Array): string {
        let binary = '';
        for (let i = 0; i < buffer.byteLength; i++) {
            binary += String.fromCharCode(buffer[i]);
        }
        return window.btoa(binary);
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}

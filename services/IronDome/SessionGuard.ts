
/**
 * IRON DOME: RING 4 - BIOMETRIC SESSION GUARD
 * "Zero Trust. Verify Every Request."
 */

export class SessionGuard {
    private static instance: SessionGuard;
    private readonly FINGERPRINT_KEY = 'iron_dome_fingerprint';

    private constructor() {}

    public static getInstance(): SessionGuard {
        if (!SessionGuard.instance) {
            SessionGuard.instance = new SessionGuard();
        }
        return SessionGuard.instance;
    }

    /**
     * Generates a unique device fingerprint based on browser characteristics.
     */
    private generateFingerprint(): string {
        const nav = window.navigator;
        const screen = window.screen;
        
        // Components of the fingerprint
        const data = [
            nav.userAgent,
            nav.language,
            `${screen.colorDepth}`,
            `${screen.width}x${screen.height}`,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            // Hardware concurrency gives a hint about the CPU
            nav.hardwareConcurrency
        ].join('||');

        // Simple hash
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return `FP-${Math.abs(hash).toString(16)}`;
    }

    /**
     * Binds the current session to this device.
     */
    public bindSession() {
        const fp = this.generateFingerprint();
        sessionStorage.setItem(this.FINGERPRINT_KEY, fp);
        console.log(`[SessionGuard] Session bound to device: ${fp}`);
    }

    /**
     * Validates that the current user matches the bound session.
     */
    public validateSession(): boolean {
        const storedFP = sessionStorage.getItem(this.FINGERPRINT_KEY);
        // If no session is bound yet, pass (will be bound on login)
        if (!storedFP) return true;

        const currentFP = this.generateFingerprint();
        
        if (storedFP !== currentFP) {
            console.error(`🚨 [SessionGuard] SESSION HIJACK DETECTED! Expected: ${storedFP}, Got: ${currentFP}`);
            return false;
        }
        return true;
    }
}

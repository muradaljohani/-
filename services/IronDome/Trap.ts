
import { Firewall } from './Firewall';

/**
 * IRON DOME: RING 3 - THE HONEYPOT TRAP
 * "A snare for the curious and the malicious."
 */

export class Trap {
    private static instance: Trap;

    private constructor() {}

    public static getInstance(): Trap {
        if (!Trap.instance) {
            Trap.instance = new Trap();
        }
        return Trap.instance;
    }

    /**
     * Called when the hidden honeypot element is accessed or interacted with.
     */
    public activateTrap(source: string) {
        console.warn(`🐝 [Iron Dome] HONEYPOT TRIGGERED from ${source}!`);
        
        // Log fingerprint
        const fingerprint = {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            screen: `${window.screen.width}x${window.screen.height}`,
            source
        };
        
        // Store in Blacklist Log
        try {
            const logs = JSON.parse(localStorage.getItem('iron_dome_blackbox') || '[]');
            logs.push(fingerprint);
            localStorage.setItem('iron_dome_blackbox', JSON.stringify(logs));
        } catch (e) {
            // Reset if corrupt
            localStorage.setItem('iron_dome_blackbox', JSON.stringify([fingerprint]));
        }

        // Execute Immediate Ban via Firewall
        Firewall.getInstance().triggerBanHammer('HONEYPOT_BREACH', source, 'Unauthorized Access to Decoy');
    }
}

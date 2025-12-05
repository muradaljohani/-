
import { Firewall } from './Firewall';

/**
 * IRON DOME: RING 5 - THE ANOMALY WATCHDOG
 * "Predictive Security & Rate Limiting"
 */

export class Watchdog {
    private static instance: Watchdog;
    
    // Config
    private readonly MAX_CLICKS_PER_SEC = 20;
    private readonly WINDOW_MS = 1000;
    
    // State
    private clickBuffer: number[] = [];

    private constructor() {
        this.activateSentinel();
    }

    public static getInstance(): Watchdog {
        if (!Watchdog.instance) {
            Watchdog.instance = new Watchdog();
        }
        return Watchdog.instance;
    }

    private activateSentinel() {
        // Listen to all clicks globally
        document.addEventListener('click', (e) => {
            this.logInteraction();
        }, true);
    }

    private logInteraction() {
        const now = Date.now();
        
        // Clean buffer (remove clicks older than 1 sec)
        this.clickBuffer = this.clickBuffer.filter(t => now - t < this.WINDOW_MS);
        
        // Add new click
        this.clickBuffer.push(now);

        // Check threshold
        if (this.clickBuffer.length > this.MAX_CLICKS_PER_SEC) {
            this.triggerDefenseProtocol();
        }
    }

    private triggerDefenseProtocol() {
        console.error(`🚨 [Watchdog] ANOMALY DETECTED: High Velocity Interaction (${this.clickBuffer.length} req/sec)`);
        
        // Trigger Cloudflare Challenge Simulation (or direct Ban)
        const isBot = confirm("Security Check: Are you a robot? (Click OK to verify)");
        
        if (!isBot) {
            Firewall.getInstance().triggerBanHammer('DDOS_ATTEMPT', 'Global', `Rate Limit Exceeded: ${this.clickBuffer.length} cps`);
        } else {
            // Reset if they pass the "Captcha" (Confirm dialog)
            this.clickBuffer = [];
        }
    }
}

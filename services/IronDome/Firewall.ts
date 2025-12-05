
/**
 * IRON DOME: RING 1 - THE FIREWALL
 * "None shall pass without scrutiny."
 */

export class Firewall {
    private static instance: Firewall;
    private readonly BAN_KEY = 'iron_dome_ban_status';

    // Malicious Pattern Signatures
    private readonly PATTERNS = {
        SQL_INJECTION: /(\b(union|select|insert|delete|update|drop|alter)\b)|(')|(--)|(\/\*)|(\*\/)/i,
        XSS: /(<script>)|(javascript:)|(onerror=)|(onload=)|(eval\()|(\balert\()/i,
        LFI_RFI: /(\.\.\/)|(\.\.\\)|(\/etc\/passwd)|(c:\\windows)|(http:\/\/)|(https:\/\/)/i,
        SHELL_UPLOAD: /(\.php)|(\.sh)|(\.exe)|(\.bat)|(\.cmd)/i
    };

    private constructor() {}

    public static getInstance(): Firewall {
        if (!Firewall.instance) {
            Firewall.instance = new Firewall();
        }
        return Firewall.instance;
    }

    /**
     * Inspects any input string for malicious payloads.
     * Triggers immediate ban if threat detected.
     */
    public inspect(input: string, context: string = 'General'): boolean {
        if (!input) return true;

        for (const [threatType, regex] of Object.entries(this.PATTERNS)) {
            if (regex.test(input)) {
                this.triggerBanHammer(threatType, context, input);
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the current user is banned.
     */
    public isBanned(): boolean {
        return localStorage.getItem(this.BAN_KEY) === 'BANNED';
    }

    /**
     * THE BAN HAMMER
     * Permanently disables access for this client.
     */
    public triggerBanHammer(reason: string, context: string, payload: string) {
        console.error(`🚨 [IRON DOME] ATTACK DETECTED! Type: ${reason} | Context: ${context}`);
        console.error(`   Payload: ${payload}`);
        
        localStorage.setItem(this.BAN_KEY, 'BANNED');
        localStorage.setItem('iron_dome_infraction', JSON.stringify({
            timestamp: new Date().toISOString(),
            reason,
            context,
            payload
        }));

        // Force Reload to trigger lockout
        window.location.reload();
    }
}


import { Firewall } from './Firewall';
import { Vault } from './Vault';
import { SessionGuard } from './SessionGuard';
import { Watchdog } from './Watchdog';
import { Trap } from './Trap';

export const IronDome = {
    Firewall: Firewall.getInstance(),
    Vault: Vault.getInstance(),
    SessionGuard: SessionGuard.getInstance(),
    Watchdog: Watchdog.getInstance(),
    Trap: Trap.getInstance(),

    init: () => {
        console.log("%c 🛡️ IRON DOME PROTOCOL ACTIVE ", "background: #ef4444; color: #fff; font-size: 12px; font-weight: bold; padding: 4px; border-radius: 4px;");
        
        // 1. Check Ban Status
        if (Firewall.getInstance().isBanned()) {
            document.body.innerHTML = `
                <div style="height: 100vh; background: #000; color: #ef4444; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: monospace; text-align: center;">
                    <h1 style="font-size: 4rem;">ACCESS DENIED</h1>
                    <p>YOUR IP HAS BEEN PERMANENTLY FLAGGED BY THE IRON DOME SECURITY PROTOCOL.</p>
                    <p style="color: #666; margin-top: 20px;">ERR_CODE: ID_BAN_HAMMER_VIOLATION</p>
                </div>
            `;
            throw new Error("IRON DOME: ACCESS DENIED");
        }

        // 2. Validate Session Integrity
        if (!SessionGuard.getInstance().validateSession()) {
            // Nuke Session
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
        }
        
        // 3. Bind Session (if new)
        SessionGuard.getInstance().bindSession();
    }
};

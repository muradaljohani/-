
/**
 * Murad Group - Unified System Overlay
 * "The Intelligence"
 * 
 * This module injects a control layer over the application,
 * providing Admin access (Ctrl+Shift+M) simulation.
 */

class MasterOverlay {
    constructor() {
        this.init();
    }

    init() {
        console.log("%c 🚀 Murad System Kernel: Frontend Module Active. ", "background: #0f172a; color: #10b981; font-weight: bold; padding: 4px;");
        this.attachGlobalListeners();
    }

    renderAdminLogin() {
        if (document.getElementById('murad-admin-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'murad-admin-modal';
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px);
            padding: 2rem; border-radius: 1rem; border: 1px solid rgba(59, 130, 246, 0.3);
            color: white; z-index: 10000; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            font-family: 'Tajawal', sans-serif; text-align: center; width: 300px;
        `;
        
        modal.innerHTML = `
            <h2 style="margin-bottom: 1.5rem; font-size: 1.2rem; color: #60a5fa;">System Core Access</h2>
            <input type="text" id="m-user" placeholder="Identity (MURAD)" style="background: rgba(0,0,0,0.3); border: 1px solid #334155; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; margin-bottom: 0.75rem; outline: none;" />
            <input type="password" id="m-pass" placeholder="Cipher (MURAD123@A)" style="background: rgba(0,0,0,0.3); border: 1px solid #334155; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; margin-bottom: 0.75rem; outline: none;" />
            <button id="m-login-btn" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold; width: 100%;">Authenticate</button>
            <button id="m-close-btn" style="background:transparent; color:#94a3b8; margin-top: 0.5rem; border:none; cursor:pointer;">Cancel</button>
        `;
        document.body.appendChild(modal);

        document.getElementById('m-login-btn').onclick = () => {
            const user = document.getElementById('m-user').value;
            const pass = document.getElementById('m-pass').value;
            
            if (user === 'MURAD' && pass === 'MURAD123@A') {
                alert("Kernel Access Granted. Welcome, Architect.");
                localStorage.setItem('mylaf_admin_session', 'active');
                window.location.reload(); // Refresh to trigger admin mode in React
            } else {
                alert("Access Denied.");
            }
        };

        document.getElementById('m-close-btn').onclick = () => modal.remove();
    }

    attachGlobalListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
                this.renderAdminLogin();
            }
        });
    }
}

window.MuradSystem = new MasterOverlay();

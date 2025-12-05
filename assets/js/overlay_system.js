
/**
 * Murad Group - Unified System Overlay
 * "The Intelligence"
 * 
 * This module injects a control layer over the React application,
 * providing Admin access (Ctrl+Shift+M) and simulating connectivity
 * to the PHP Kernel.
 */

class MasterOverlay {
    constructor() {
        this.apiEndpoint = '/?murad_mode=api'; // Virtual Endpoint
        this.state = new Proxy({
            user: null,
            theme: 'dark',
            notifications: []
        }, {
            set: (target, key, value) => {
                target[key] = value;
                this.updateUI(key, value);
                return true;
            }
        });

        this.init();
    }

    init() {
        console.log("%c 🚀 Murad System Kernel: Frontend Module Active. ", "background: #0f172a; color: #10b981; font-weight: bold; padding: 4px;");
        this.injectStyles();
        this.restoreState();
        this.attachGlobalListeners();
    }

    /**
     * 1. State Management
     */
    restoreState() {
        const saved = localStorage.getItem('murad_kernel_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state.user = parsed.user;
        }
    }

    saveState() {
        localStorage.setItem('murad_kernel_state', JSON.stringify(this.state));
    }

    /**
     * 2. Communication with Kernel (Simulated for this Environment)
     */
    async sendCommand(action, data = {}) {
        console.log(`[Kernel Link] Sending command: ${action}`, data);
        
        // Simulating the PHP Kernel Response for the React Environment
        return new Promise(resolve => {
            setTimeout(() => {
                if (action === 'admin_login') {
                    // Check against hardcoded logic mirroring PHP
                    if (data.user === 'MURAD' && data.pass === 'MURAD123@A') {
                        resolve({ status: 'success', token: 'mock_kernel_token_' + Date.now() });
                    } else {
                        resolve({ status: 'error', message: 'Invalid Credentials' });
                    }
                } else {
                    resolve({ status: 'success' });
                }
            }, 800);
        });
    }

    /**
     * 3. DOM Injection (Zero-Destruction UI)
     */
    injectStyles() {
        const css = `
            #murad-overlay-root { position: fixed; z-index: 10000; top: 0; left: 0; pointer-events: none; width: 100%; height: 100%; }
            .murad-modal { pointer-events: auto; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(59, 130, 246, 0.3); color: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); font-family: 'Tajawal', sans-serif; text-align: center; width: 300px; }
            .murad-btn { background: #2563eb; color: white; border: none; padding: 0.75rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold; width: 100%; margin-top: 1rem; transition: background 0.2s; }
            .murad-btn:hover { background: #1d4ed8; }
            .murad-input { background: rgba(0,0,0,0.3); border: 1px solid #334155; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; margin-bottom: 0.75rem; box-sizing: border-box; outline: none; }
            .murad-input:focus { border-color: #3b82f6; }
            .murad-badge { position: fixed; bottom: 10px; right: 10px; font-size: 10px; color: #10b981; opacity: 0.5; font-family: monospace; pointer-events: none; }
        `;
        const style = document.createElement('style');
        style.innerText = css;
        document.head.appendChild(style);

        const root = document.createElement('div');
        root.id = 'murad-overlay-root';
        root.innerHTML = '<div class="murad-badge">KERNEL v1.0 ACTIVE</div>';
        document.body.appendChild(root);
    }

    renderAdminLogin() {
        const root = document.getElementById('murad-overlay-root');
        // Prevent dupes
        if (root.querySelector('.murad-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'murad-modal';
        modal.innerHTML = `
            <h2 style="margin-bottom: 1.5rem; font-size: 1.2rem; color: #60a5fa;">System Core Access</h2>
            <input type="text" id="m-user" class="murad-input" placeholder="Identity (MURAD)" />
            <input type="password" id="m-pass" class="murad-input" placeholder="Cipher (MURAD123@A)" />
            <button id="m-login-btn" class="murad-btn">Authenticate</button>
            <button id="m-close-btn" class="murad-btn" style="background:transparent; color:#94a3b8; margin-top: 0.5rem;">Cancel</button>
        `;
        root.appendChild(modal);

        document.getElementById('m-login-btn').onclick = async () => {
            const user = document.getElementById('m-user').value;
            const pass = document.getElementById('m-pass').value;
            
            const btn = document.getElementById('m-login-btn');
            btn.innerText = "Verifying...";
            
            const response = await this.sendCommand('admin_login', { user, pass });
            
            if (response && response.status === 'success') {
                alert("Kernel Access Granted.");
                this.state.user = { role: 'admin', token: response.token };
                this.saveState();
                modal.remove();
                // In a real scenario, this would redirect to /admin.php
                // Here we trigger the React God Mode if available or log success
                console.log("Admin Access Unlocked");
            } else {
                btn.innerText = "Access Denied";
                btn.style.background = "#ef4444";
                setTimeout(() => {
                    btn.innerText = "Authenticate";
                    btn.style.background = "#2563eb";
                }, 2000);
            }
        };

        document.getElementById('m-close-btn').onclick = () => modal.remove();
    }

    attachGlobalListeners() {
        // Secret hotkey for Admin (Ctrl + Shift + M)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
                this.renderAdminLogin();
            }
        });
    }

    updateUI(key, value) {
        console.log(`[Overlay] State change: ${key}`, value);
    }
}

// Boot
window.MuradSystem = new MasterOverlay();


import { EvolutionLog } from '../../types';

/**
 * ==============================================================================
 * THE DARWIN ENGINE (God-Tier Layer 1)
 * Self-Writing Code Simulation
 * ==============================================================================
 */

export class DarwinCore {
    private static instance: DarwinCore;
    private searchQueries: Map<string, number> = new Map();
    private evolutionLogs: EvolutionLog[] = [];

    private constructor() {
        this.loadLogs();
    }

    public static getInstance(): DarwinCore {
        if (!DarwinCore.instance) {
            DarwinCore.instance = new DarwinCore();
        }
        return DarwinCore.instance;
    }

    private loadLogs() {
        try {
            const stored = localStorage.getItem('darwin_logs');
            if (stored) this.evolutionLogs = JSON.parse(stored);
        } catch (e) {}
    }

    private saveLogs() {
        localStorage.setItem('darwin_logs', JSON.stringify(this.evolutionLogs));
    }

    // --- 1. THE SENSOR (Zero Result Monitor) ---
    public trackSearch(query: string) {
        const normalized = query.toLowerCase().trim();
        this.searchQueries.set(normalized, (this.searchQueries.get(normalized) || 0) + 1);
        
        // Threshold check
        if ((this.searchQueries.get(normalized) || 0) > 5) {
            this.checkEvolutionTrigger(normalized);
        }
    }

    private checkEvolutionTrigger(query: string) {
        // Logic: if users search for "dark mode" repeatedly, enable it.
        if (query.includes('dark') || query.includes('night') || query.includes('mode')) {
            this.evolve('DARK_MODE');
        }
    }

    // --- 2. THE EVOLUTION (Feature Injection) ---
    public evolve(featureKey: string) {
        // Prevent duplicate evolution
        if (this.evolutionLogs.find(l => l.feature === featureKey)) return;

        console.log(`🧬 [Darwin] Evolution Triggered: ${featureKey}`);

        if (featureKey === 'DARK_MODE') {
            this.injectDarkMode();
            this.logEvolution('Dark Mode', 'High User Demand (Search)');
        }
    }

    private injectDarkMode() {
        // Simulating writing a new CSS file by injecting style block
        const style = document.createElement('style');
        style.id = 'darwin-dark-mode';
        style.innerHTML = `
            :root { --bg-primary: #0f172a; --text-primary: #f8fafc; }
            body.dark-mode-active { background-color: #000 !important; color: #fff !important; }
        `;
        document.head.appendChild(style);
        
        // Inject Toggle UI (Simulated via Alert/Console for now, or State update)
        // In a real app, this would update a React Context or Global State
        console.log("🌑 [Darwin] Dark Mode Capability Injected. System upgraded.");
        
        // Notify Admin
        alert("🧬 Darwin Engine: I have detected 500+ searches for 'Dark Mode'. I have auto-written the CSS code and enabled this feature for you.");
    }

    private logEvolution(feature: string, trigger: string) {
        this.evolutionLogs.push({
            id: `EVO-${Date.now()}`,
            feature,
            trigger,
            deployedAt: new Date().toISOString(),
            status: 'LIVE'
        });
        this.saveLogs();
    }
}


import { TitanBlock, TitanDNA, ShadowReport, User, Transaction } from '../../types';
import { BehaviorObserver } from '../LMS_Brain';
import { FinanceCore } from '../Economy/FinanceCore';

/**
 * ==============================================================================
 * TITAN CORE INFRASTRUCTURE (Tier-0 / God Mode)
 * The Sovereign Digital Nation Architecture
 * ==============================================================================
 */

// --- 1. THE OMNI-BUS (The Nervous System) ---
type EventHandler = (data: any) => void;

export class OmniBus {
    private static instance: OmniBus;
    private subscribers: Map<string, EventHandler[]> = new Map();

    private constructor() {
        console.log("⚡ [TITAN: OmniBus] Nervous System Online.");
    }

    public static getInstance(): OmniBus {
        if (!OmniBus.instance) OmniBus.instance = new OmniBus();
        return OmniBus.instance;
    }

    public subscribe(event: string, handler: EventHandler) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event)?.push(handler);
    }

    public publish(event: string, data: any) {
        console.log(`📡 [OmniBus] Broadcast: ${event}`, data);
        
        // Log to BlackBox
        BlackBox.getInstance().addBlock({ event, payload: data }, 'SYSTEM_EVENT');

        const handlers = this.subscribers.get(event);
        if (handlers) {
            handlers.forEach(h => h(data));
        }
    }
}

// --- 2. THE BLACKBOX (The Immutable Ledger) ---
export class BlackBox {
    private static instance: BlackBox;
    private chain: TitanBlock[] = [];

    private constructor() {
        this.loadChain();
        if (this.chain.length === 0) {
            this.createGenesisBlock();
        }
    }

    public static getInstance(): BlackBox {
        if (!BlackBox.instance) BlackBox.instance = new BlackBox();
        return BlackBox.instance;
    }

    private createGenesisBlock() {
        const genesis: TitanBlock = {
            index: 0,
            timestamp: new Date().toISOString(),
            type: 'SYSTEM_EVENT',
            data: { message: "TITAN GENESIS BLOCK" },
            previousHash: "0",
            hash: "0",
            signature: "SYSTEM_INIT"
        };
        genesis.hash = this.calculateHash(genesis);
        this.chain.push(genesis);
        this.persist();
    }

    public addBlock(data: any, type: TitanBlock['type']) {
        const prevBlock = this.chain[this.chain.length - 1];
        const newBlock: TitanBlock = {
            index: prevBlock.index + 1,
            timestamp: new Date().toISOString(),
            type,
            data,
            previousHash: prevBlock.hash,
            hash: "",
            signature: `SIG_${Date.now()}` // Simulation of digital signature
        };
        newBlock.hash = this.calculateHash(newBlock);
        this.chain.push(newBlock);
        this.persist();
    }

    private calculateHash(block: TitanBlock): string {
        const str = block.index + block.previousHash + block.timestamp + JSON.stringify(block.data);
        // Simple hash for simulation performance. In real app, use SHA-256 via crypto.subtle
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    public verifyIntegrity(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i - 1];
            if (current.previousHash !== prev.hash) return false;
            if (current.hash !== this.calculateHash(current)) return false;
        }
        return true;
    }

    public getChain(): TitanBlock[] {
        return this.chain;
    }

    private persist() {
        try {
            // Keep only last 1000 blocks in simulation to avoid quota limit
            const toSave = this.chain.length > 1000 ? this.chain.slice(this.chain.length - 1000) : this.chain;
            localStorage.setItem('titan_blackbox_ledger', JSON.stringify(toSave));
        } catch (e) {}
    }

    private loadChain() {
        try {
            const stored = localStorage.getItem('titan_blackbox_ledger');
            if (stored) this.chain = JSON.parse(stored);
        } catch (e) {}
    }
}

// --- 3. THE ORACLE (The Predictive AI) ---
export class Oracle {
    private static instance: Oracle;

    private constructor() {}

    public static getInstance(): Oracle {
        if (!Oracle.instance) Oracle.instance = new Oracle();
        return Oracle.instance;
    }

    public predictDropoutRisk(userId: string): number {
        const logs = BehaviorObserver.getInstance().getLogs();
        const userLogs = logs.filter(l => l.user_id === userId);
        
        if (userLogs.length === 0) return 0; // Unknown

        // Factors: High Pause Rate, Short Sessions, No Completions
        const pauses = userLogs.filter(l => l.action_type === 'video_pause').length;
        const completions = userLogs.filter(l => l.action_type === 'video_complete').length;
        
        let risk = 0;
        if (completions === 0 && pauses > 5) risk += 50;
        if (userLogs.length < 5) risk += 20; // Low engagement

        return Math.min(100, risk);
    }

    public getDynamicPricingMultiplier(category: string): number {
        // Mock market demand logic
        const hour = new Date().getHours();
        if (hour >= 18 && hour <= 22) return 1.1; // Peak hours +10%
        return 1.0;
    }
}

// --- 4. THE USER SOUL (Holographic Identity) ---
export class UserSoul {
    private static instance: UserSoul;

    private constructor() {}

    public static getInstance(): UserSoul {
        if (!UserSoul.instance) UserSoul.instance = new UserSoul();
        return UserSoul.instance;
    }

    public generateDNA(user: User): TitanDNA {
        const xp = user.xp || 0;
        const wallet = user.walletBalance || 0;
        const sales = user.publisherStats?.totalSales || 0;

        let archetype: TitanDNA['archetype'] = 'Scholar';
        if (sales > 500) archetype = 'Trader';
        if (user.myServices && user.myServices.length > 2) archetype = 'Freelancer';
        if (user.role === 'admin') archetype = 'Commander';

        let walletTier: TitanDNA['walletTier'] = 'Bronze';
        if (wallet > 1000) walletTier = 'Silver';
        if (wallet > 10000) walletTier = 'Gold';
        
        return {
            archetype,
            learningIQ: Math.min(200, 100 + (xp / 100)),
            marketTrust: user.isIdentityVerified ? 100 : 50,
            walletTier,
            riskFactor: Oracle.getInstance().predictDropoutRisk(user.id)
        };
    }
}

// --- 5. THE SHADOW (Auto-CEO) ---
export class Shadow {
    private static instance: Shadow;

    private constructor() {
        // Run audit every minute
        setInterval(() => this.runSelfAudit(), 60000);
    }

    public static getInstance(): Shadow {
        if (!Shadow.instance) Shadow.instance = new Shadow();
        return Shadow.instance;
    }

    public runSelfAudit(): ShadowReport {
        const isSecure = BlackBox.getInstance().verifyIntegrity();
        const pending = FinanceCore.getInstance().getPendingTransactions().length;
        const blocks = BlackBox.getInstance().getChain().length;

        const report: ShadowReport = {
            generatedAt: new Date().toISOString(),
            systemHealth: 99.9,
            integrityStatus: isSecure ? 'SECURE' : 'COMPROMISED',
            blocksVerified: blocks,
            threatsBlocked: Math.floor(Math.random() * 10), // Mock
            revenueToday: 0, // Would query FinanceCore
            actionRequired: pending > 0 || !isSecure
        };

        if (report.actionRequired) {
            console.warn("⚠️ [Shadow Admin] Action Required. Presidential Briefing Updated.");
        } else {
            console.log("✅ [Shadow Admin] System Nominal.");
        }

        return report;
    }
}

// Master Export
export const Titan = {
    OmniBus: OmniBus.getInstance(),
    BlackBox: BlackBox.getInstance(),
    Oracle: Oracle.getInstance(),
    UserSoul: UserSoul.getInstance(),
    Shadow: Shadow.getInstance()
};

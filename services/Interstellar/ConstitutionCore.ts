
import { ConstitutionLaw, ReserveFund } from '../../types';

/**
 * ==============================================================================
 * THE CONSTITUTION DAO (God-Tier Layer 4)
 * Automated Governance & Immutable Rules
 * ==============================================================================
 */

export class ConstitutionCore {
    private static instance: ConstitutionCore;
    private laws: ConstitutionLaw[] = [];
    private reserveFund: ReserveFund = { balance: 0, transactions: [] };

    private constructor() {
        this.initializeConstitution();
        this.loadState();
    }

    public static getInstance(): ConstitutionCore {
        if (!ConstitutionCore.instance) {
            ConstitutionCore.instance = new ConstitutionCore();
        }
        return ConstitutionCore.instance;
    }

    private initializeConstitution() {
        this.laws = [
            { id: 'LAW-001', clause: 'Reserve Fund Allocation', type: 'FINANCIAL', value: 0.10, isImmutable: true, active: true },
            { id: 'LAW-002', clause: 'Auto-Scaling Threshold', type: 'OPERATIONAL', value: 0.90, isImmutable: true, active: true },
            { id: 'LAW-003', clause: 'Admin Override Lock', type: 'SECURITY', value: 1, isImmutable: true, active: true }
        ];
    }

    private loadState() {
        try {
            const stored = localStorage.getItem('titan_reserve_fund');
            if (stored) this.reserveFund = JSON.parse(stored);
        } catch (e) {}
    }

    private saveState() {
        localStorage.setItem('titan_reserve_fund', JSON.stringify(this.reserveFund));
    }

    // --- 1. THE LAW (Automated Enforcement) ---
    
    // Called by FinanceCore on every transaction
    public enforceTax(amount: number, source: string): number {
        const taxLaw = this.laws.find(l => l.id === 'LAW-001');
        if (!taxLaw || !taxLaw.active) return amount;

        const tax = amount * taxLaw.value;
        const net = amount - tax;

        // Move to Reserve
        this.reserveFund.balance += tax;
        this.reserveFund.transactions.unshift({
            date: new Date().toISOString(),
            amount: tax,
            source: `10% Auto-Tax from ${source}`
        });
        
        this.saveState();
        console.log(`⚖️ [Constitution] Enforced Law 001. Moved ${tax} SAR to Reserve. Net: ${net}`);
        
        return net;
    }

    // --- 2. IMMUNITY (Security) ---
    public attemptOverride(lawId: string, adminKey: string): boolean {
        const law = this.laws.find(l => l.id === lawId);
        if (!law) return false;

        if (law.isImmutable) {
            console.error(`⛔ [Constitution] ACCESS DENIED. Law ${lawId} is Immutable. Even Admin cannot break this.`);
            return false;
        }
        
        // Hypothetical 2FA check
        return true;
    }

    public getReserveBalance(): number {
        return this.reserveFund.balance;
    }
}

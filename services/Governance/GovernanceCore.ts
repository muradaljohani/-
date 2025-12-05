
import { User, TribunalCase, TribunalVerdict } from '../../types';

export class GovernanceCore {
    private static instance: GovernanceCore;
    private tribunalCases: Map<string, TribunalCase> = new Map();

    private constructor() {
        this.loadCases();
    }

    public static getInstance(): GovernanceCore {
        if (!GovernanceCore.instance) {
            GovernanceCore.instance = new GovernanceCore();
        }
        return GovernanceCore.instance;
    }

    private loadCases() {
        try {
            const stored = localStorage.getItem('mylaf_tribunal_cases');
            if (stored) {
                const parsed: TribunalCase[] = JSON.parse(stored);
                parsed.forEach(c => this.tribunalCases.set(c.id, c));
            } else {
                // Initialize Mock Cases
                this.createMockCases();
            }
        } catch (e) { console.error("Tribunal DB Error", e); }
    }

    private saveCases() {
        try {
            const cases = Array.from(this.tribunalCases.values());
            localStorage.setItem('mylaf_tribunal_cases', JSON.stringify(cases));
        } catch (e) {}
    }

    // --- ENGINE 1: MURAD PASSPORT (Identity Logic) ---
    
    public getPassportTheme(karma: number): string {
        if (karma >= 800) return 'gold';
        if (karma >= 500) return 'blue';
        if (karma < 300) return 'red'; // Warning/Shadowban
        return 'grey'; // New/Neutral
    }

    public getCitizenshipStatus(karma: number): string {
        if (karma >= 900) return 'Elite Citizen (مواطن نخبة)';
        if (karma >= 500) return 'Active Citizen (مواطن نشط)';
        if (karma < 300) return 'Under Probation (تحت المراقبة)';
        return 'New Resident (مقيم جديد)';
    }

    // --- ENGINE 2: SOCIAL CREDIT KARMA ---

    public adjustKarma(user: User, amount: number, reason: string): User {
        let currentKarma = user.karma || 500; // Start at 500 (Neutral)
        currentKarma = Math.max(0, Math.min(1000, currentKarma + amount));
        
        console.log(`[Governance] Karma Adjusted for ${user.name}: ${amount > 0 ? '+' : ''}${amount} (${reason}). New Score: ${currentKarma}`);
        
        return { ...user, karma: currentKarma };
    }

    public isShadowBanned(user: User): boolean {
        return (user.karma || 500) < 300;
    }

    public isElite(user: User): boolean {
        return (user.karma || 500) >= 800;
    }

    // --- ENGINE 3: THE TRIBUNAL (Crowdsourced Justice) ---

    private createMockCases() {
        // Create some sample disputes
        const case1: TribunalCase = {
            id: 'case_101',
            plaintiffId: 'u_1',
            plaintiffName: 'سعد (مشتري)',
            defendantId: 'u_2',
            defendantName: 'متجر الهواتف',
            productId: 'p_99',
            description: 'استلمت هاتف أيفون والشاشة مكسورة، والبائع يرفض الاسترجاع بحجة سوء الاستخدام.',
            evidence: ['https://via.placeholder.com/300x200?text=Broken+Screen'],
            createdAt: new Date().toISOString(),
            status: 'Open',
            votes: [],
            jurors: [], // Open to all elite for demo
            finalVerdict: 'Pending'
        };
        this.tribunalCases.set(case1.id, case1);
    }

    public getOpenCases(): TribunalCase[] {
        return Array.from(this.tribunalCases.values()).filter(c => c.status === 'Open');
    }

    public submitVote(caseId: string, jurorId: string, verdict: TribunalVerdict): boolean {
        const tribunalCase = this.tribunalCases.get(caseId);
        if (!tribunalCase || tribunalCase.status !== 'Open') return false;

        // Check if already voted
        if (tribunalCase.votes.some(v => v.jurorId === jurorId)) return false;

        tribunalCase.votes.push({
            jurorId,
            verdict,
            timestamp: new Date().toISOString()
        });

        // Check for Quorum (e.g., 5 votes)
        if (tribunalCase.votes.length >= 5) {
            this.resolveCase(tribunalCase);
        }

        this.saveCases();
        return true;
    }

    private resolveCase(tribunalCase: TribunalCase) {
        const guiltyCount = tribunalCase.votes.filter(v => v.verdict === 'Guilty').length;
        const innocentCount = tribunalCase.votes.filter(v => v.verdict === 'Innocent').length;

        tribunalCase.status = 'Closed';
        tribunalCase.finalVerdict = guiltyCount > innocentCount ? 'Guilty' : 'Innocent';
        
        console.log(`[Tribunal] Case ${tribunalCase.id} Closed. Verdict: ${tribunalCase.finalVerdict}`);
        
        // In real app: Trigger fine deduction or refund automatically here
    }
}

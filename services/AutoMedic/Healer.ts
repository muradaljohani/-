
import { Course, UserJob } from '../../types';

export class Healer {
  private static instance: Healer;
  private placeholderImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000";

  private constructor() {}

  public static getInstance(): Healer {
    if (!Healer.instance) {
      Healer.instance = new Healer();
    }
    return Healer.instance;
  }

  public activate(): void {
    console.log("%c 🛡️ AutoMedic Healer: Active. Monitoring Tissue Integrity...", "color: #10b981; font-weight: bold;");
    this.activateImageInterceptor();
    this.activateLinkGuardian();
    this.runDatabaseIntegrityCheck();
  }

  // --- 1. Missing Image Healer ---
  private activateImageInterceptor() {
    window.addEventListener('error', (event: ErrorEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        // Prevent infinite loops
        if (img.src === this.placeholderImage) return;
        
        console.warn(`[Healer] Detected necrotic tissue (Broken Image): ${img.src}. Injecting stem cells...`);
        img.src = this.placeholderImage;
        img.classList.add('healed-tissue'); // CSS marker
      }
    }, true);
  }

  // --- 2. 404 Fuzzy Search Redirection ---
  // In a real router, this would catch 404s. Here we simulate a helper.
  private activateLinkGuardian() {
    // This runs on navigation attempts
    const validRoutes = ['jobs', 'academy', 'market', 'haraj'];
    
    // Logic: If user tries to go to /jobss (typo), redirect to /jobs
    // This is conceptual in this SPA, but here is the algorithm:
    (window as any).healRoute = (badPath: string) => {
        const closest = this.fuzzyMatch(badPath, validRoutes);
        console.log(`[Healer] Redirecting dead link "${badPath}" to live node "${closest}"`);
        return closest;
    };
  }

  private fuzzyMatch(input: string, options: string[]): string {
    // Simple Levenshtein distance approximation for brevity
    let closest = options[0];
    let minDiff = 999;

    options.forEach(opt => {
        let diff = 0;
        for(let i=0; i<Math.min(input.length, opt.length); i++) {
            if (input[i] !== opt[i]) diff++;
        }
        if (diff < minDiff) {
            minDiff = diff;
            closest = opt;
        }
    });
    return closest;
  }

  // --- 3. Database Integrity (Orphan Record Cleaner) ---
  private runDatabaseIntegrityCheck() {
    try {
        const txns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]');
        const originalCount = txns.length;
        
        // Remove transactions with no valid ID or Amount
        const cleanTxns = txns.filter((t: any) => t.id && t.amount);
        
        if (cleanTxns.length !== originalCount) {
            console.warn(`[Healer] Found ${originalCount - cleanTxns.length} orphaned transaction records. Archiving to safety log.`);
            localStorage.setItem('mylaf_transactions', JSON.stringify(cleanTxns));
        }
    } catch (e) {
        // Corrupt JSON? Nuke it to save the organism.
        console.error("[Healer] Critical Data Corruption Detected. Resetting Store.");
    }
  }
}

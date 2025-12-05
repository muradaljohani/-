
import { User } from '../../types';

/**
 * ENGINE 1: The 'Zero-Friction' Access Gate
 * Philosophy: "The door opens before you touch the handle."
 */
export class AccessGate {
  private static instance: AccessGate;
  private prefetchCache: Set<string> = new Set();

  private constructor() {
    this.activatePredictiveLoading();
  }

  public static getInstance(): AccessGate {
    if (!AccessGate.instance) {
      AccessGate.instance = new AccessGate();
    }
    return AccessGate.instance;
  }

  /**
   * 1. Smart Remember (365 Days Persistence)
   * Saves the session token with a 1-year expiry logic.
   */
  public persistSession(user: User): void {
    const sessionData = {
      user,
      expiry: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 Year
    };
    localStorage.setItem('fluid_session_v1', JSON.stringify(sessionData));
  }

  public restoreSession(): User | null {
    try {
      const raw = localStorage.getItem('fluid_session_v1');
      if (!raw) return null;
      
      const data = JSON.parse(raw);
      if (Date.now() > data.expiry) {
        localStorage.removeItem('fluid_session_v1');
        return null;
      }
      return data.user;
    } catch (e) {
      return null;
    }
  }

  /**
   * 2. Predictive Loading (Hover Intent)
   * Tracks mouse velocity and hover time. If hover > 150ms on a clickable element,
   * it triggers a data fetch for that route BEFORE the click happens.
   */
  private activatePredictiveLoading() {
    let hoverTimer: any;

    document.addEventListener('mouseover', (e) => {
      const target = (e.target as HTMLElement).closest('[data-prefetch]');
      if (!target) return;

      const resourceKey = target.getAttribute('data-prefetch');
      if (!resourceKey || this.prefetchCache.has(resourceKey)) return;

      // If user hovers for > 150ms, we assume intent to click
      hoverTimer = setTimeout(() => {
        console.log(`[Fluid Access] 🔮 Predicting intent: Prefetching ${resourceKey}...`);
        this.prefetchResource(resourceKey);
      }, 150);
    });

    document.addEventListener('mouseout', () => {
      clearTimeout(hoverTimer);
    });
  }

  private async prefetchResource(key: string) {
    this.prefetchCache.add(key);
    // Simulation: In a real app, this would fetch() the JSON data for the next page
    // ensuring 0ms wait time upon click.
    // For this PWA, we simulate warming up the specific service.
    if (key === 'jobs') {
       // Warm up job cache
       import('../geminiService').then(m => m.getWadhefaJobs());
    }
  }
}

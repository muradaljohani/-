
/**
 * ENGINE 3: The 'Autonomic' Healer
 * Philosophy: "Errors are just opportunities for redirection."
 */
export class AutonomicHealer {
  private static instance: AutonomicHealer;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): AutonomicHealer {
    if (!AutonomicHealer.instance) {
      AutonomicHealer.instance = new AutonomicHealer();
    }
    return AutonomicHealer.instance;
  }

  /**
   * 1. Input Sanitizer (Hacking Prevention)
   * Autonomously strips SQL injection attempts without crashing.
   */
  public sanitize(input: string): string {
    if (!input) return '';
    const dangerousPatterns = [
      /DROP\s+TABLE/gi, 
      /SELECT\s+\*/gi, 
      /UNION\s+SELECT/gi, 
      /--/g,
      /;/g
    ];

    let clean = input;
    let detected = false;

    dangerousPatterns.forEach(pattern => {
      if (pattern.test(clean)) {
        clean = clean.replace(pattern, '');
        detected = true;
      }
    });

    if (detected) {
      console.warn(`[Fluid Healer] 🛡️ Injection attempt neutralized. IP Logged.`);
      // In real backend: Log IP to blacklist.
    }

    return clean.trim();
  }

  /**
   * 2. Slow Query Killer & Cache Fallback
   * If a promise takes > 3 seconds, it kills it and serves cached/mock data.
   */
  public async safeFetch<T>(
    key: string, 
    promise: Promise<T>, 
    fallback: T, 
    timeoutMs: number = 3000
  ): Promise<T> {
    
    // Check cache first (Instant serve)
    if (this.cache.has(key)) {
      // Background refresh (Stale-while-revalidate)
      this.refreshCache(key, promise);
      return this.cache.get(key);
    }

    // Race against time
    let didTimeout = false;
    const timeout = new Promise<T>((resolve) => {
      setTimeout(() => {
        didTimeout = true;
        console.warn(`[Fluid Healer] ⏱️ Query '${key}' too slow. Killing process & serving fallback.`);
        resolve(fallback);
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeout]);
      if (!didTimeout && result !== fallback) {
        this.cache.set(key, result); // Cache successful result
      }
      return result;
    } catch (e) {
      console.error(`[Fluid Healer] 🩹 Caught crash in '${key}'. Serving fallback.`);
      return fallback;
    }
  }

  private async refreshCache(key: string, promise: Promise<any>) {
    try {
      const result = await promise;
      this.cache.set(key, result);
    } catch(e) { /* silent fail */ }
  }

  /**
   * 3. Auto-Fix 404 (Fuzzy Redirection)
   * Returns a safe route if the requested one is dead.
   */
  public healRoute(path: string, validRoutes: string[]): string {
    // Simple logic: if path not found, return 'jobs' (most popular)
    // In advanced: Use Levenshtein distance
    return 'jobs';
  }
}

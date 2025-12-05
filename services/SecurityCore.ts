
export class SecurityCore {
  private static instance: SecurityCore;
  private lockoutTime: number = 15 * 60 * 1000; // 15 mins
  private maxAttempts: number = 5;

  private constructor() {}

  public static getInstance(): SecurityCore {
    if (!SecurityCore.instance) {
      SecurityCore.instance = new SecurityCore();
    }
    return SecurityCore.instance;
  }

  // --- 1. Anti-Injection Engine ---
  public sanitizeInput(input: string): string {
    if (!input) return '';
    // Remove potentially dangerous characters and patterns (SQLi / XSS)
    return input
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/['";]/g, "") // Basic SQL injection prevention
      .replace(/union\s+select/gi, "")
      .replace(/--/g, "")
      .trim();
  }

  public sanitizeObject(obj: any): any {
    if (typeof obj === 'string') return this.sanitizeInput(obj);
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = this.sanitizeObject(obj[key]);
      });
    }
    return obj;
  }

  // --- 2. Brute-Force Protection ---
  public checkLockout(email: string): { locked: boolean; timeLeft?: number } {
    const attempts = JSON.parse(localStorage.getItem(`auth_attempts_${email}`) || '{"count": 0, "last": 0}');
    const now = Date.now();

    if (attempts.count >= this.maxAttempts) {
      const timePassed = now - attempts.last;
      if (timePassed < this.lockoutTime) {
        return { locked: true, timeLeft: Math.ceil((this.lockoutTime - timePassed) / 1000 / 60) };
      } else {
        // Reset after lockout expires
        this.resetAttempts(email);
      }
    }
    return { locked: false };
  }

  public recordFailedAttempt(email: string): void {
    const attempts = JSON.parse(localStorage.getItem(`auth_attempts_${email}`) || '{"count": 0, "last": 0}');
    attempts.count += 1;
    attempts.last = Date.now();
    localStorage.setItem(`auth_attempts_${email}`, JSON.stringify(attempts));
  }

  public resetAttempts(email: string): void {
    localStorage.removeItem(`auth_attempts_${email}`);
  }

  // --- 3. Session Fingerprinting ---
  public generateSessionFingerprint(): string {
    const nav = window.navigator;
    const screen = window.screen;
    const raw = `${nav.userAgent}-${nav.language}-${screen.width}x${screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    
    // Simple hash
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `SEC-${Math.abs(hash).toString(16)}`;
  }

  public validateSession(storedFingerprint: string): boolean {
    return this.generateSessionFingerprint() === storedFingerprint;
  }
}

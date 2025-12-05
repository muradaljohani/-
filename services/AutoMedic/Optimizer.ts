
export class Optimizer {
  private static instance: Optimizer;
  private cache = new Map<string, { data: any, timestamp: number }>();
  private CACHE_DURATION = 1000 * 60 * 5; // 5 Minutes

  private constructor() {}

  public static getInstance(): Optimizer {
    if (!Optimizer.instance) {
      Optimizer.instance = new Optimizer();
    }
    return Optimizer.instance;
  }

  public activate(): void {
      // Create a Performance Observer
      const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
              // Logic: If 'Saudi Jobs' load > 2s, trigger static cache
              if (entry.name.includes('fetchJoobleJobs') && entry.duration > 2000) {
                  console.warn(`[Optimizer] Slow Network Detected (${entry.duration.toFixed(0)}ms). Engaging Predictive Cache.`);
                  this.triggerStaticCacheGeneration('jobs_feed');
              }
          });
      });

      observer.observe({ entryTypes: ["resource", "measure"] });
  }

  // --- Predictive Caching Wrapper ---
  public async smartFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
      // 1. Check Memory Cache
      const cached = this.cache.get(key);
      if (cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
          console.log(`[Optimizer] Serving ${key} from Neural Memory (0ms).`);
          return cached.data;
      }

      // 2. Check Persistent Storage (Self-Healing from previous slow loads)
      const stored = localStorage.getItem(`automedic_cache_${key}`);
      if (stored) {
          const { data, timestamp } = JSON.parse(stored);
          if (Date.now() - timestamp < this.CACHE_DURATION) {
              console.log(`[Optimizer] Serving ${key} from Static Disk Cache.`);
              this.cache.set(key, { data, timestamp }); // Rehydrate memory
              return data;
          }
      }

      // 3. Network Fetch
      console.log(`[Optimizer] Fetching fresh data for ${key}...`);
      const start = performance.now();
      const data = await fetcher();
      const duration = performance.now() - start;

      // 4. Self-Optimization Decision
      this.cache.set(key, { data, timestamp: Date.now() });
      
      // If slow, persist it for next time
      if (duration > 1500) {
          console.log(`[Optimizer] Request was slow. Crystalizing data to Static Cache.`);
          localStorage.setItem(`automedic_cache_${key}`, JSON.stringify({ data, timestamp: Date.now() }));
      }

      return data;
  }

  private triggerStaticCacheGeneration(key: string) {
      // In a real backend, this would curl the page and save HTML.
      // Here, we flag the key to be prioritized in LocalStorage next time.
      localStorage.setItem(`automedic_priority_${key}`, 'true');
  }
}

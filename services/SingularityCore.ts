
// The Singularity Core - Master Architecture for the Autonomous Organism
import React from 'react';
import html2canvas from 'html2canvas';

export class Singularity_Core {
  private static instance: Singularity_Core;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): Singularity_Core {
    if (!Singularity_Core.instance) {
      Singularity_Core.instance = new Singularity_Core();
    }
    return Singularity_Core.instance;
  }

  public activate(): void {
    if (this.isInitialized) return;
    
    console.log("🟢 Singularity Core: Online.");
    console.log("🛡️ Immune System: Active.");
    console.log("🤖 Auto-Pilot: Standing by.");

    this.activateImmuneSystem();
    this.activateSEOAutopilot();
    this.isInitialized = true;
  }

  // --- DIMENSION 4: SELF-HEALING IMMUNE SYSTEM ---
  private activateImmuneSystem() {
    // 1. Image Interceptor
    window.addEventListener('error', (event: ErrorEvent) => {
        const target = event.target as HTMLElement;
        if (target && target.tagName === 'IMG') {
            console.warn("⚠️ Immune System detected broken tissue (Image 404). Healing...");
            // Replace broken image with a high-quality fallback instantly
            (target as HTMLImageElement).src = "https://source.unsplash.com/random/800x600?technology,abstract";
            // Prevent infinite loop if fallback fails
            target.onerror = null; 
        }
    }, true);

    // 2. Link Interceptor (404 Prevention)
    // In a SPA, real 404s are handled by routing, but we can intercept external links
    document.addEventListener('click', (event) => {
        const target = (event.target as HTMLElement).closest('a');
        if (target && target.getAttribute('href')?.startsWith('http')) {
            // We could pre-flight check here, but for performance, we rely on target=_blank
            // This is a placeholder for advanced link checking logic
        }
    });
  }

  public getHoneypotField(): React.ReactNode {
      // Returns a hidden field for forms. If bots fill this, we ban them.
      // Logic handled in AuthContext or backend, this just generates the trap.
      return null; // Implemented in React Components directly for DOM access
  }

  // --- DIMENSION 3: AUTO-PILOT MARKETING AGENT ---
  
  // 1. Dynamic SEO Injection
  private activateSEOAutopilot() {
      // Observer to watch title changes and inject meta tags dynamically
      const observer = new MutationObserver(() => {
          const title = document.title;
          this.updateMetaTags(title);
      });
      
      const titleNode = document.querySelector('title');
      if(titleNode) observer.observe(titleNode, { childList: true });
  }

  private updateMetaTags(title: string) {
      // Dynamically generate OG Image based on page content/title keywords
      const keywords = title.split(' ');
      const topic = keywords.length > 2 ? keywords[2] : 'tech';
      const ogImage = `https://source.unsplash.com/random/1200x630?${topic},business`;

      this.setMeta('og:title', title);
      this.setMeta('twitter:title', title);
      this.setMeta('og:image', ogImage);
      this.setMeta('twitter:image', ogImage);
  }

  private setMeta(property: string, content: string) {
      let element = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
      }
      element.setAttribute('content', content);
  }

  // 2. Canvas Generator (Weekly Summary)
  public async generateJobSummaryImage(jobs: any[]): Promise<string> {
      // Create a virtual canvas element
      const canvas = document.createElement('div');
      canvas.style.width = '1080px';
      canvas.style.height = '1080px';
      canvas.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)';
      canvas.style.color = 'white';
      canvas.style.padding = '60px';
      canvas.style.position = 'absolute';
      canvas.style.top = '-9999px';
      canvas.style.fontFamily = 'Tajawal, sans-serif';
      canvas.dir = 'rtl';

      const jobListHtml = jobs.slice(0, 5).map(j => `
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; margin-bottom: 20px; display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.2);">
            <div style="font-size: 32px; font-weight: bold; flex: 1;">${j.title}</div>
            <div style="font-size: 24px; color: #fbbf24;">${j.company}</div>
        </div>
      `).join('');

      canvas.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="font-size: 60px; font-weight: 900; margin-bottom: 20px; text-align: center;">🔥 ملخص وظائف الأسبوع</div>
            <div style="font-size: 30px; color: #94a3b8; text-align: center; margin-bottom: 60px;">أكاديمية ميلاف مراد الوطنية</div>
            <div style="flex: 1;">
                ${jobListHtml}
            </div>
            <div style="text-align: center; font-size: 40px; background: #2563eb; color: white; padding: 30px; border-radius: 20px; margin-top: auto;">
                المزيد على: murad-group.com
            </div>
        </div>
      `;

      document.body.appendChild(canvas);
      
      try {
          const canvasEl = await html2canvas(canvas);
          document.body.removeChild(canvas);
          return canvasEl.toDataURL('image/png');
      } catch (e) {
          console.error("Auto-Pilot Canvas Error:", e);
          return '';
      }
  }
}

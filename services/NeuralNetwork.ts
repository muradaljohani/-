
// The Neural Network - Sensory System for User Behavior
export class Neural_Network {
  private static instance: Neural_Network;
  private sessionData: any[] = [];
  private isRecording = false;

  private constructor() {}

  public static getInstance(): Neural_Network {
    if (!Neural_Network.instance) {
      Neural_Network.instance = new Neural_Network();
    }
    return Neural_Network.instance;
  }

  public startSynapseRecording(): void {
    if (this.isRecording) return;
    this.isRecording = true;
    console.log("🧠 Neural Network: Synapses firing. Recording session...");

    // Track Clicks
    document.addEventListener('click', (e) => {
        this.recordEvent('click', { x: e.clientX, y: e.clientY, target: (e.target as HTMLElement).tagName });
    });

    // Track Scroll (Throttled)
    let lastScroll = 0;
    document.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScroll > 500) {
            this.recordEvent('scroll', { y: window.scrollY });
            lastScroll = now;
        }
    });
  }

  private recordEvent(type: string, data: any) {
      this.sessionData.push({
          timestamp: Date.now(),
          type,
          data,
          path: window.location.pathname
      });
      
      // Simulating "Neuromorphic Storage" in LocalStorage (In prod, send to DB)
      // Only keep last 100 events to prevent bloat
      if (this.sessionData.length > 100) this.sessionData.shift();
      localStorage.setItem('neural_session_log', JSON.stringify(this.sessionData));
  }

  public getGhostReplayData(): any[] {
      try {
          return JSON.parse(localStorage.getItem('neural_session_log') || '[]');
      } catch (e) {
          return [];
      }
  }

  public getHeatmapData(): {x: number, y: number}[] {
      const logs = this.getGhostReplayData();
      return logs.filter((l: any) => l.type === 'click').map((l: any) => l.data);
  }
}

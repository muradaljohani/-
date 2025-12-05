
/**
 * ENGINE 2: The 'Cognitive' Learning Engine
 * Philosophy: "The system learns what you love."
 */
export class CognitiveBrain {
  private static instance: CognitiveBrain;
  private interestGraph: Record<string, number> = {};
  private menuUsage: Record<string, number> = {};

  private constructor() {
    this.loadMemory();
  }

  public static getInstance(): CognitiveBrain {
    if (!CognitiveBrain.instance) {
      CognitiveBrain.instance = new CognitiveBrain();
    }
    return CognitiveBrain.instance;
  }

  private loadMemory() {
    try {
      this.interestGraph = JSON.parse(localStorage.getItem('fluid_interest_graph') || '{}');
      this.menuUsage = JSON.parse(localStorage.getItem('fluid_menu_usage') || '{}');
    } catch (e) {}
  }

  private saveMemory() {
    localStorage.setItem('fluid_interest_graph', JSON.stringify(this.interestGraph));
    localStorage.setItem('fluid_menu_usage', JSON.stringify(this.menuUsage));
  }

  /**
   * 1. The Interest Graph
   * Tags user session with interests based on interaction.
   */
  public trackInteraction(tag: string, weight: number = 1) {
    if (!tag) return;
    const normalizedTag = tag.toLowerCase();
    this.interestGraph[normalizedTag] = (this.interestGraph[normalizedTag] || 0) + weight;
    this.saveMemory();
  }

  /**
   * 2. Content Re-Ordering
   * Takes a list of items (Jobs/Courses) and sorts them based on the User's Interest Graph.
   */
  public personalizeList<T>(items: T[], textExtractor: (item: T) => string): T[] {
    if (Object.keys(this.interestGraph).length === 0) return items;

    return items.map(item => {
      const text = textExtractor(item).toLowerCase();
      let score = 0;
      
      Object.entries(this.interestGraph).forEach(([tag, weight]) => {
        if (text.includes(tag)) score += weight;
      });

      return { item, score };
    }).sort((a, b) => b.score - a.score) // High score first
      .map(wrapper => wrapper.item);
  }

  /**
   * 3. Adaptive Menu
   * Reorders the navigation menu based on usage frequency.
   * If 'Market' is visited > 50% of the time, it moves to #1.
   */
  public trackMenuClick(menuId: string) {
    this.menuUsage[menuId] = (this.menuUsage[menuId] || 0) + 1;
    this.saveMemory();
  }

  public getAdaptiveMenuOrder(defaultOrder: string[]): string[] {
    // If not enough data, return default
    const totalClicks = Object.values(this.menuUsage).reduce((a, b) => a + b, 0);
    if (totalClicks < 5) return defaultOrder;

    // Create a copy to sort
    return [...defaultOrder].sort((a, b) => {
      const valA = this.menuUsage[a] || 0;
      const valB = this.menuUsage[b] || 0;
      return valB - valA; // Most clicked first
    });
  }
}

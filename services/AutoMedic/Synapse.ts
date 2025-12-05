
import { User, UserJob, Course } from '../../types';

export class Synapse {
  private static instance: Synapse;

  private constructor() {}

  public static getInstance(): Synapse {
    if (!Synapse.instance) {
      Synapse.instance = new Synapse();
    }
    return Synapse.instance;
  }

  /**
   * THE UNIFIED ENTITY MAP
   * Logic: Modifies the Job Feed based on Academic Performance.
   */
  public adaptJobFeed(user: User | null, jobs: any[]): any[] {
    if (!user) return jobs;

    console.log("[Synapse] Analyzing Neural Pathways between User Skills and Job Market...");

    // 1. SCENARIO: Failed PHP Quiz -> Hide Senior PHP Jobs
    // We check if user has a 'failed' status on a specific topic in examAttempts
    const failedTopics = user.examAttempts
        ?.filter(a => a.status === 'failed')
        .map(a => this.extractTopicFromExamId(a.examId)) || [];

    // Filter jobs
    let adaptedJobs = jobs.filter(job => {
        const isSenior = job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('expert');
        const jobTopic = this.detectJobTopic(job);
        
        // If user failed this topic, hide senior roles
        if (failedTopics.includes(jobTopic) && isSenior) {
            console.log(`[Synapse] Hiding '${job.title}' due to skill gap in ${jobTopic}.`);
            return false;
        }
        return true;
    });

    // 2. CROSS-POLLINATION: Inject Remedial Courses into Job Feed
    if (failedTopics.length > 0) {
        failedTopics.forEach(topic => {
            // Create a "Job Card" that is actually a Course Recommendation
            adaptedJobs.unshift({
                id: `REMEDIAL-${topic}`,
                title: `⚡ فرصة تدريب: أساسيات ${topic}`,
                company: 'أكاديمية ميلاف (توصية ذكية)',
                location: 'عن بعد',
                date: new Date().toISOString(),
                description: `لاحظنا اهتمامك بمجال ${topic}. نقترح عليك هذه الدورة المكثفة لرفع فرصك في التوظيف.`,
                type: 'تدريب منتهي بالتوظيف',
                isFeatured: true,
                logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Academy Logo
                isSmartSuggestion: true // Flag for UI
            });
        });
    }

    return adaptedJobs;
  }

  private extractTopicFromExamId(examId: string): string {
      if (examId.includes('php')) return 'PHP';
      if (examId.includes('js')) return 'JavaScript';
      if (examId.includes('cyber')) return 'Cybersecurity';
      return 'General';
  }

  private detectJobTopic(job: any): string {
      const text = (job.title + job.description).toLowerCase();
      if (text.includes('php')) return 'PHP';
      if (text.includes('javascript') || text.includes('react')) return 'JavaScript';
      if (text.includes('security') || text.includes('cyber')) return 'Cybersecurity';
      return 'General';
  }
}

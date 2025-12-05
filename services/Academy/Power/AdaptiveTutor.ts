
import { YouTubeService } from '../../YouTubeService';
import { Course } from '../../../types';

export class AdaptiveTutor {
    private static instance: AdaptiveTutor;

    private constructor() {}

    public static getInstance(): AdaptiveTutor {
        if (!AdaptiveTutor.instance) {
            AdaptiveTutor.instance = new AdaptiveTutor();
        }
        return AdaptiveTutor.instance;
    }

    /**
     * The Logic: Failed Quiz -> Custom Lesson
     */
    public async generateRemedialPlan(failedTopic: string, score: number): Promise<Course> {
        console.log(`[AI Tutor] Student failed '${failedTopic}' with score ${score}%. Generating remedial path...`);

        // 1. Analyze specific weakness (Mock analysis)
        const subTopics = this.breakdownTopic(failedTopic);
        
        // 2. Fetch targeted micro-content
        const yt = YouTubeService.getInstance();
        // We simulate fetching a playlist specific to the weakness
        // In reality, we search YouTube for "Explain [Topic] for beginners"
        const remedialContent = await yt.syncPlaylistToCourses('PLDoPjvoNmBAyE_gei5d18qKfIe-Z8mocs'); // Fallback playlist
        
        // 3. Construct the Remedial Course Object
        const remedialCourse: Course = {
            id: `REMEDIAL_${Date.now()}`,
            title: `خطة علاجية: إتقان ${failedTopic}`,
            description: `لاحظنا أنك واجهت صعوبة في ${failedTopic}. قام الذكاء الاصطناعي بتجميع هذه الدروس المكثفة لسد الفجوة المعرفية لديك.`,
            hours: 2,
            skillLevel: 'Beginner',
            category: 'AI', // Dynamic based on topic
            provider: 'Mylaf AI Tutor',
            skills: [failedTopic, 'Remedial Learning'],
            status: 'active',
            thumbnail: 'https://img.freepik.com/free-vector/robot-working-laptop-artificial-intelligence_107791-168.jpg',
            lessons: remedialContent[0]?.lessons || []
        };

        return remedialCourse;
    }

    private breakdownTopic(topic: string): string[] {
        // Simple NLP simulation
        if (topic.includes('Variable')) return ['Data Types', 'Memory Allocation'];
        if (topic.includes('Loop')) return ['While Loops', 'For Loops', 'Recursion'];
        return [topic];
    }
}

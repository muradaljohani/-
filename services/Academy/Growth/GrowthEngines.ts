
import { User, Course, Wallet, Notification } from '../../../types';
import { WalletSystem } from '../../Economy/WalletSystem';
import { ConstitutionCore } from '../../Interstellar/ConstitutionCore';

/**
 * ==============================================================================
 * ACADEMY GROWTH ENGINES
 * Layer: Ecosystem Expansion (Instructor Marketplace & Career Paths)
 * ==============================================================================
 */

export interface CareerPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    totalLevels: number;
    nodes: PathNode[];
    rewardBadge: string;
}

export interface PathNode {
    id: string;
    title: string;
    type: 'Course' | 'Project' | 'Exam';
    status: 'locked' | 'unlocked' | 'completed';
    courseId?: string; // Links to actual course
}

export class GrowthManager {
    private static instance: GrowthManager;

    private constructor() {}

    public static getInstance(): GrowthManager {
        if (!GrowthManager.instance) {
            GrowthManager.instance = new GrowthManager();
        }
        return GrowthManager.instance;
    }

    // --- ENGINE 1: INSTRUCTOR MARKETPLACE (Revenue Split) ---
    
    public processCourseSale(instructorId: string, amount: number, courseTitle: string): void {
        const INSTRUCTOR_SHARE = 0.70; // 70%
        const PLATFORM_SHARE = 0.30;   // 30%

        const instructorEarnings = amount * INSTRUCTOR_SHARE;
        const platformEarnings = amount * PLATFORM_SHARE;

        // 1. Credit Instructor Wallet
        WalletSystem.getInstance().processTransaction(
            `w_${instructorId}`, 
            'COMMISSION', 
            instructorEarnings, 
            `Course Sale: ${courseTitle} (70%)`
        );

        // 2. Tax / Platform Reserve (Constitution Law)
        ConstitutionCore.getInstance().enforceTax(platformEarnings, `Platform Fee: ${courseTitle}`);

        console.log(`[GrowthManager] Split Sale ${amount} SAR -> Instructor: ${instructorEarnings}, Platform: ${platformEarnings}`);
    }

    // --- ENGINE 2: CAREER NAVIGATOR (Path Logic) ---

    public getCareerPaths(user: User): CareerPath[] {
        // Mock Paths - In real app, fetch from DB and check user progress
        return [
            {
                id: 'path_fullstack',
                title: 'Full Stack Web Developer',
                description: 'من الصفر إلى الاحتراف في تطوير الويب الشامل.',
                icon: '💻',
                totalLevels: 4,
                rewardBadge: 'Certified Developer',
                nodes: [
                    { id: 'n1', title: 'HTML & CSS Essentials', type: 'Course', status: 'completed', courseId: 'web_101' },
                    { id: 'n2', title: 'JavaScript Logic', type: 'Course', status: 'unlocked', courseId: 'js_201' },
                    { id: 'n3', title: 'React & Frontend', type: 'Course', status: 'locked', courseId: 'react_301' },
                    { id: 'n4', title: 'Backend & Database', type: 'Project', status: 'locked', courseId: 'db_401' },
                ]
            },
            {
                id: 'path_datascience',
                title: 'Data Science Specialist',
                description: 'مسار تحليل البيانات والذكاء الاصطناعي.',
                icon: '📊',
                totalLevels: 3,
                rewardBadge: 'AI Analyst',
                nodes: [
                    { id: 'd1', title: 'Python for Data', type: 'Course', status: 'unlocked', courseId: 'py_101' },
                    { id: 'd2', title: 'Data Analysis (Pandas)', type: 'Course', status: 'locked', courseId: 'pd_201' },
                    { id: 'd3', title: 'Machine Learning Basics', type: 'Exam', status: 'locked', courseId: 'ml_final' },
                ]
            }
        ];
    }

    // --- ENGINE 3: HEADHUNTER SIGNAL (Talent Detection) ---

    public checkTalentSignal(user: User, completedCourseId: string, score: number): Notification | null {
        // Logic: If score > 95% on a "Capstone" course, signal talent.
        if (score >= 95) {
            console.log(`[TalentSignal] User ${user.name} identified as TOP TALENT.`);
            
            // In a real system, this would insert into a 'talent_pool' table for recruiters.
            // For now, we return a notification for the user.
            return {
                id: `talent_${Date.now()}`,
                userId: user.id,
                type: 'success',
                title: '🌟 إشارة موهبة!',
                message: 'أداؤك الاستثنائي وضعك في قائمة "أفضل المواهب". سيظهر ملفك الآن مميزاً للشركات.',
                isRead: false,
                date: new Date().toISOString()
            };
        }
        return null;
    }
}

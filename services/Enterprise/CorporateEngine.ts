
import { ProductListing, UserJob, Applicant, User } from '../../types';

/**
 * ==============================================================================
 * CORPORATE SaaS ENGINE (The B2B Core)
 * Handles: Bulk Operations, ATS Logic, and Head-Hunting
 * ==============================================================================
 */

export class CorporateEngine {
    private static instance: CorporateEngine;

    private constructor() {}

    public static getInstance(): CorporateEngine {
        if (!CorporateEngine.instance) {
            CorporateEngine.instance = new CorporateEngine();
        }
        return CorporateEngine.instance;
    }

    // --- ENGINE 1: THE SHOWROOM CLOUD (Bulk CSV Parser) ---
    
    public parseCSV(file: File): Promise<Partial<ProductListing>[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (!text) { reject('Empty file'); return; }

                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const products: Partial<ProductListing>[] = [];

                // Simple parser logic (assumes headers match keys or close enough)
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(',');
                    const product: any = {};
                    
                    headers.forEach((header, index) => {
                        const value = values[index]?.trim();
                        // Map CSV headers to Type
                        if (header.includes('title') || header.includes('name')) product.title = value;
                        if (header.includes('desc')) product.description = value;
                        if (header.includes('price')) product.price = parseFloat(value) || 0;
                        if (header.includes('cat')) product.category = value; // Needs validation
                        if (header.includes('city') || header.includes('loc')) product.location = value;
                        if (header.includes('condition')) product.condition = value;
                    });

                    // Default Fallbacks
                    if (!product.title) continue;
                    product.images = ['https://via.placeholder.com/400?text=Bulk+Item']; // Mock image
                    product.type = 'Fixed';
                    product.status = 'active';
                    
                    products.push(product);
                }
                resolve(products);
            };
            reader.readAsText(file);
        });
    }

    // --- ENGINE 2: ATS COMMAND CENTER (Applicant Management) ---

    public getApplicantsForJob(job: UserJob): Applicant[] {
        // In real app, fetch from DB. Here we mock/return job.applicants
        return job.applicants || [];
    }

    public updateApplicantStatus(applicantId: string, newStatus: Applicant['status'], job: UserJob): UserJob {
        const updatedApplicants = job.applicants?.map(app => {
            if (app.id === applicantId) {
                return { ...app, status: newStatus };
            }
            return app;
        }) || [];
        
        return { ...job, applicants: updatedApplicants };
    }

    public generateMockApplicants(count: number): Applicant[] {
        const names = ["محمد علي", "سارة أحمد", "خالد العمري", "نورة سعد", "فهد الحربي", "عبدالله السبيعي", "منى القحطاني"];
        const skillsPool = ["لغة إنجليزية", "إكسل متقدم", "مبيعات", "إدارة مشاريع", "برمجة", "تصميم جرافيك"];
        
        return Array.from({ length: count }).map((_, i) => ({
            id: `app_${Date.now()}_${i}`,
            userId: `u_mock_${i}`,
            name: names[i % names.length],
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${names[i % names.length]}`,
            jobTitle: "متقدم للوظيفة",
            skills: [skillsPool[i % skillsPool.length], skillsPool[(i+1) % skillsPool.length]],
            experienceYears: Math.floor(Math.random() * 10),
            appliedAt: new Date().toISOString(),
            status: 'New',
            contactUnlocked: false
        }));
    }

    // --- ENGINE 4: HEAD-HUNTER SCOUT (Candidate Search) ---

    public searchCandidates(query: string, allUsers: User[]): Applicant[] {
        const lowerQuery = query.toLowerCase();
        // Convert Users to "Candidates"
        return allUsers.filter(u => 
            u.role === 'student' && // Only students/job seekers
            (u.name.toLowerCase().includes(lowerQuery) || 
             u.skills?.some(s => s.toLowerCase().includes(lowerQuery)) ||
             u.currentJobTitle?.toLowerCase().includes(lowerQuery))
        ).map(u => ({
            id: `cand_${u.id}`,
            userId: u.id,
            name: u.name,
            avatar: u.avatar || '',
            jobTitle: u.currentJobTitle || 'باحث عن عمل',
            skills: u.skills || [],
            experienceYears: parseInt(u.yearsOfExperience || '0'),
            appliedAt: '',
            status: 'New',
            contactUnlocked: false
        }));
    }
}

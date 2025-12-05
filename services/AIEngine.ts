
import { User } from '../types';

export class AIEngine {
  // --- 1. Semantic Job Matching ---
  public static scoreJobRelevance(user: User, jobTitle: string, jobDesc: string): number {
    if (!user.skills && !user.bio) return 0;
    
    let score = 0;
    const jobText = `${jobTitle} ${jobDesc}`.toLowerCase();
    
    // Skill Match
    user.skills?.forEach(skill => {
      if (jobText.includes(skill.toLowerCase())) score += 10;
    });

    // Bio Match
    if (user.bio) {
      const bioWords = user.bio.split(' ').filter(w => w.length > 4);
      bioWords.forEach(word => {
        if (jobText.includes(word.toLowerCase())) score += 2;
      });
    }

    // Role Match
    if (user.currentJobTitle && jobText.includes(user.currentJobTitle.toLowerCase())) {
        score += 15;
    }

    return score;
  }

  // --- 2. Dynamic SEO Generator (JSON-LD) ---
  public static generateJobSchema(job: any): string {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": job.date,
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company,
        "logo": job.logoUrl
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location,
          "addressCountry": "SA"
        }
      }
    };
    return JSON.stringify(schema);
  }

  // --- 3. Predictive Content Loading (Logic) ---
  // Calculates probability of click based on distance
  public static calculateClickProbability(cursorX: number, cursorY: number, element: DOMRect): number {
    const elementCenterX = element.left + element.width / 2;
    const elementCenterY = element.top + element.height / 2;
    const distance = Math.sqrt(Math.pow(cursorX - elementCenterX, 2) + Math.pow(cursorY - elementCenterY, 2));
    
    // If closer than 100px, high probability
    return distance < 150 ? (1 - distance/150) : 0;
  }
}

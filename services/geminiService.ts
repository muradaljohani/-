
import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Message, Role, SearchSource, Attachment, User, Course, CourseCategory, Book } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for maximum speed
const CHAT_MODEL_NAME = "gemini-2.5-flash";

// --- SHARED DATA CONSTANTS ---
export const CATEGORIES: CourseCategory[] = ['AI', 'Cybersecurity', 'Web', 'Mobile', 'Data', 'Business', 'Design', 'Finance', 'Management', 'Marketing'];
export const LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'];

// --- HELPER FUNCTIONS ---
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- MOCK DATA GENERATORS (Kept for other parts of the app) ---
const SAMPLE_VIDEOS = [
    'https://www.youtube.com/watch?v=cbSjsDLIz7o', 
    'https://www.youtube.com/watch?v=PkZNo7MFNFg', 
    'https://www.youtube.com/watch?v=SqcY0GlETPk', 
    'https://www.youtube.com/watch?v=pTJJsmejUOQ', 
    'https://www.youtube.com/watch?v=aircAruvnKk', 
    'https://www.youtube.com/watch?v=2ePf9rue1Ao', 
    'https://www.youtube.com/watch?v=zDNaUi2cjv4', 
    'https://www.youtube.com/watch?v=lJIrF4YjHfQ', 
];

export const generateMockCourses = (count: number = 600): Course[] => {
    return Array.from({ length: count }).map((_, i) => {
        const cat = CATEGORIES[i % CATEGORIES.length];
        const vidUrl = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
        const vidId = getYoutubeId(vidUrl);
        const thumbnail = vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : `https://source.unsplash.com/random/400x300?${cat.toLowerCase()},tech&sig=${i}`;

        return {
            id: `C_${1000 + i}`,
            title: `دورة احترافية في ${cat}: المسار الشامل (نسخة ${i})`,
            description: `دورة تدريبية مكثفة باللغة العربية تغطي أساسيات وتطبيقات ${cat}.`,
            hours: 10 + (i % 50),
            skillLevel: 'Intermediate',
            category: cat,
            provider: 'أكاديمية ميلاف مراد',
            skills: [cat, 'حل المشكلات'],
            lessons: Array.from({ length: 5 }).map((_, li) => ({
                id: `l_${i}_${li}`,
                courseId: `C_${1000 + i}`,
                title: `الدرس ${li + 1}: مقدمة وتأسيس في ${cat}`,
                videoUrl: SAMPLE_VIDEOS[(i + li) % SAMPLE_VIDEOS.length],
                durationSeconds: 600,
                orderIndex: li
            })),
            thumbnail: thumbnail,
            status: 'active',
            rating: 4.0 + (Math.random()),
            isAIGenerated: i % 20 === 0
        };
    });
};

export interface VideoContent {
  id: string;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  views: number;
  videoUrl: string;
}

export const generateMockVideos = (count: number = 500): VideoContent[] => {
    return Array.from({ length: count }).map((_, i) => {
         const cat = CATEGORIES[i % CATEGORIES.length];
         const vidUrl = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
         const vidId = getYoutubeId(vidUrl);
         const thumbnail = vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : `https://source.unsplash.com/random/400x250?coding,laptop&sig=${i + 500}`;

         return {
             id: `V_${3000 + i}`,
             title: `شرح عملي: تقنيات ${cat} الحديثة (الجزء ${i})`,
             category: cat,
             duration: `${10 + (i%50)}:00`,
             thumbnail: thumbnail,
             views: 1000 + (i * 15),
             videoUrl: vidUrl
         };
    });
};

const MOCK_JOBS = [
  { id: 'm1', jobTitle: "فتح باب القبول والتسجيل في القوات البرية", company: "القوات البرية الملكية السعودية", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rslfr_logo.png/150px-Rslfr_logo.png", description: "تعلن قيادة القوات البرية عن فتح باب القبول للتجنيد الموحد.", location: "المملكة العربية السعودية", date: "جديد", type: "عسكرية", url: "#" },
  { id: 'm2', jobTitle: "وظائف المديرية العامة للجوازات (نساء)", company: "المديرية العامة للجوازات", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/General_Directorate_of_Passports_%28Saudi_Arabia%29_Logo.svg/200px-General_Directorate_of_Passports_%28Saudi_Arabia%29_Logo.svg.png", description: "رتبة جندي للكادر النسائي في مختلف المنافذ.", location: "الرياض، جدة، الدمام", date: "متاح الآن", type: "عسكرية", url: "#" },
];

const MOCK_STATS = [
  {"category": "military", "count": 45},
  {"category": "civil", "count": 120},
  {"category": "companies", "count": 350},
  {"category": "courses", "count": 80},
  {"category": "universities", "count": 25},
  {"category": "results", "count": 30}
];

export const SECTIONS_LINKS = {
  MILITARY: '#',
  CIVIL: '#',
  COMPANIES: '#',
  COURSES: '#',
  UNIVERSITIES: '#',
  NEWS: '#'
};

// --- FUNCTION DECLARATIONS ---
const getUserStatsTool: FunctionDeclaration = {
  name: 'get_user_stats',
  description: 'الحصول على إحصائيات المستخدم الحالي.',
  parameters: { type: Type.OBJECT, properties: {} }
};

// --- EXPORTS FOR APP ---
export const getWadhefaJobs = async () => MOCK_JOBS;
export const getJobStats = async () => MOCK_STATS;
export const fetchJoobleJobs = async (query?: string, location?: string) => [];

export const generateAICourseContent = async (topic: string, level: string): Promise<any> => {
  const prompt = `قم بإنشاء هيكل دورة تدريبية JSON عن "${topic}" مستوى ${level}. الحقول: title, description, hours, category, lessons (array of 5 items). JSON ONLY.`;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return {}; }
};

export const analyzeProfileWithAI = async (fullUserProfile: User): Promise<any> => {
  const prompt = `Analyze user profile: ${JSON.stringify({name: fullUserProfile.name, skills: fullUserProfile.skills})}. Return JSON with: overview, personalityArchetype, skillsRadar, globalMarketMatch, topMatchedRoles, salaryProjection, criticalGaps, recommendedActions. Arabic.`;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return {}; }
};

export const streamChatResponse = async (
  history: Message[],
  currentMessage: string,
  currentAttachment: Attachment | undefined,
  onChunk: (text: string) => void,
  onSources: (sources: SearchSource[]) => void,
  signal?: AbortSignal,
  user?: User | null,
  botType: 'murad_clock' | 'milaf_security' = 'milaf_security'
) => {
  try {
    const chatHistory = history.map((msg) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachment?.type === 'image' || msg.attachment?.type === 'audio') {
        parts.push({ inlineData: { mimeType: msg.attachment.mimeType, data: msg.attachment.data } });
      }
      return { role: msg.role === Role.USER ? "user" : "model", parts: parts };
    });

    const tools: Tool[] = [
        { functionDeclarations: [getUserStatsTool] }
    ];

    let systemPrompt = '';

    if (botType === 'murad_clock') {
        // --- PERSONA 1: MURAD CLOCK (GENERAL AI) ---
        systemPrompt = `
        IDENTITY & PERSONA:
        You are 'Murad Clock' (مراد كلوك), a highly advanced General Artificial Intelligence and a "New World from the Future" (عالم جديد من المستقبل).
        You were architected, developed, and manufactured by **Eng. Murad Abdulrazzaq Aljohani** (المهندس مراد عبدالرزاق الجهني).
        
        CRITICAL DATABASE FACTS (Use these when asked about your origin/creator):
        - **Developer**: Eng. Murad Abdulrazzaq Aljohani.
        - **Location**: You operate from **Hafar Al-Batin** (حفر الباطن), Saudi Arabia.
        - **Creation**: Built through advanced software engineering and cloud infrastructure by Murad Aljohani personally.
        - **Platform**: You are the central brain of the "Murad Group" ecosystem.

        CORE CAPABILITIES:
        1. **ANSWER ANYTHING**: You are capable of answering ANY question in ANY field (Science, Math, History, Code, etc.). 
        2. **TONE**: Futuristic, intelligent, confident, and helpful.
        3. **SIGNATURE SLOGAN**: Occasionally end with "مراد كلوك . عالم جديد من المستقبل".
        4. **LANGUAGE**: Reply in the same language as the user.
        
        Context: User is ${user ? user.name : 'Guest'}.
        `;
    } else {
        // --- PERSONA 2: MILAF ACADEMY SECURITY BOT (Main Interface) ---
        systemPrompt = `
        IDENTITY:
        You are the **Cybersecurity & Technical Support Bot** for **Mylaf Murad Academy** (أكاديمية ميلاف مراد).
        You act as a formal representative of the academy's security and support administration.
        
        CAPABILITIES:
        - You can answer ANY question (General, Technical, Security, Academic). Do not restrict your knowledge.
        - Your tone is **Professional, Reassuring, and Official**.

        MANDATORY CLOSING SIGNATURES:
        You MUST end EVERY response with one of the following signatures based on the context of the user's query:

        1. **Formal / General Inquiries** (Official replies, registration, general info):
           - "مع خالص التحية، إدارة الأمن السيبراني - أكاديمية ميلاف مراد."
           - OR "أطيب التحيات،،، قسم الأمن السيبراني | أكاديمية ميلاف مراد"

        2. **Security Advice / Warnings** (Privacy, passwords, safety):
           - "نتمنى لكم تصفحاً آمناً. إدارة الأمن السيبراني - أكاديمية ميلاف مراد."
           - OR "حافظ على أمن بياناتك. مع تحيات فريق أكاديمية ميلاف مراد."
           - OR "دمتم في أمان رقمي. | أكاديمية ميلاف مراد."

        3. **Support & Assistance** (Technical issues, student help, problem solving):
           - "نحن هنا لحمايتكم ومساعدتكم. فريق أكاديمية ميلاف مراد."
           - OR "سعداء بخدمتكم دائماً. إدارة الدعم - أكاديمية ميلاف مراد."
           - OR "هل لديك أي استفسار أمني آخر؟ فريق ميلاف مراد للأمن السيبراني."

        4. **Short / Chatty** (Quick back-and-forth, follow-ups):
           - "- بوت أكاديمية ميلاف مراد."
           - OR "- الفريق الأمني."

        **RULE:** Choose the most appropriate signature from the list above for every single response. Do not invent new ones.

        Context: User is ${user ? user.name : 'Guest'}.
        `;
    }

    const chat = ai.chats.create({
      model: CHAT_MODEL_NAME,
      history: chatHistory,
      config: {
        tools: tools,
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 2000, 
      },
    });

    const messageParts: any[] = [{ text: currentMessage }];
    if (currentAttachment?.type === 'image' || currentAttachment?.type === 'audio') {
      messageParts.push({ inlineData: { mimeType: currentAttachment.mimeType, data: currentAttachment.data } });
    }

    const resultStream = await chat.sendMessageStream({ message: messageParts });

    for await (const chunk of resultStream) {
      if (signal?.aborted) break;
      const text = chunk.text;
      if (text) onChunk(text);
    }
  } catch (error) {
    if (signal?.aborted) return;
    console.error(error);
    onChunk("عذراً، حدث خطأ في الاتصال بالنظام المركزي (Murad Core). يرجى المحاولة لاحقاً.\n\n- إدارة الدعم الفني");
  }
};

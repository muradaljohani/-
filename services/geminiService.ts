
import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Message, Role, SearchSource, Attachment, User, Course, CourseCategory, Book } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash 2.5 for speed and search grounding
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

// --- REAL OPEN-SOURCE LIBRARY DATABASE ---
const REAL_BOOKS_DB: Book[] = [
    {
        id: 'b_hindawi_01',
        title: 'عبقرية عمر',
        author: 'عباس محمود العقاد',
        category: 'Management',
        pages: 315,
        summary: 'دراسة تحليلية عبقرية لشخصية الفاروق عمر بن الخطاب، يبرز فيها العقاد الجوانب الإدارية والقيادية الفذة.',
        coverUrl: 'https://www.hindawi.org/books/64519637/cover.jpg',
        isDownloadable: true,
        rating: 4.9,
        publishYear: '1942'
    },
    {
        id: 'b_hindawi_02',
        title: 'مقدمة ابن خلدون',
        author: 'عبد الرحمن بن خلدون',
        category: 'Data',
        pages: 580,
        summary: 'المؤسس الحقيقي لعلم الاجتماع، كتاب يحلل نشأة الأمم وعوامل انهيارها بأسلوب علمي رصين.',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Muqaddimah.jpg',
        isDownloadable: true,
        rating: 5.0,
        publishYear: '1377'
    },
    {
        id: 'b_hindawi_04',
        title: 'الذكاء الاصطناعي: ثورة في تقنيات العصر',
        author: 'د. عبد الله موسى',
        category: 'AI',
        pages: 240,
        summary: 'كتاب حديث يستعرض تاريخ ومستقبل الذكاء الاصطناعي وتطبيقاته في العالم العربي.',
        coverUrl: 'https://source.unsplash.com/random/300x400?ai,robot',
        isDownloadable: true,
        rating: 4.5,
        publishYear: '2023'
    },
    {
        id: 'b_shamela_01',
        title: 'البخلاء',
        author: 'الجاحظ',
        category: 'Business',
        pages: 400,
        summary: 'من أهم كتب الأدب العربي، يقدم صوراً اجتماعية واقتصادية دقيقة عن عصر العباسيين بأسلوب ساخر.',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Al-Jahiz.jpg/220px-Al-Jahiz.jpg',
        isDownloadable: true,
        rating: 4.6,
        publishYear: '850'
    },
    {
        id: 'b_hindawi_05',
        title: 'فن الإقناع',
        author: 'هاري ميلز',
        category: 'Marketing',
        pages: 220,
        summary: 'كيف تستميل الآخرين إلى وجهة نظرك. دليل عملي للمسوقين والقادة.',
        coverUrl: 'https://www.hindawi.org/books/17206314/cover.jpg',
        isDownloadable: true,
        rating: 4.4,
        publishYear: '2000'
    }
];

// --- SAMPLE YOUTUBE VIDEOS ---
const SAMPLE_VIDEOS = [
    'https://www.youtube.com/watch?v=cbSjsDLIz7o', // Python
    'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JS
    'https://www.youtube.com/watch?v=SqcY0GlETPk', // React
    'https://www.youtube.com/watch?v=pTJJsmejUOQ', // CSS
    'https://www.youtube.com/watch?v=aircAruvnKk', // Neural Networks
    'https://www.youtube.com/watch?v=2ePf9rue1Ao', // Data Science
    'https://www.youtube.com/watch?v=zDNaUi2cjv4', // Cybersecurity
    'https://www.youtube.com/watch?v=lJIrF4YjHfQ', // Web Dev
];

// --- MOCK DATA GENERATORS ---
export const generateMockCourses = (count: number = 600): Course[] => {
    return Array.from({ length: count }).map((_, i) => {
        const cat = CATEGORIES[i % CATEGORIES.length];
        const level = LEVELS[i % LEVELS.length] as any;
        const vidUrl = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
        const vidId = getYoutubeId(vidUrl);
        const thumbnail = vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : `https://source.unsplash.com/random/400x300?${cat.toLowerCase()},tech&sig=${i}`;

        return {
            id: `C_${1000 + i}`,
            title: `دورة احترافية في ${cat}: المسار الشامل (نسخة ${i})`,
            description: `دورة تدريبية مكثفة باللغة العربية تغطي أساسيات وتطبيقات ${cat}. تشمل مشاريع عملية وتوجيه مهني لسوق العمل السعودي.`,
            hours: 10 + (i % 50),
            skillLevel: level,
            category: cat,
            provider: 'أكاديمية ميلاف مراد',
            skills: [cat, 'حل المشكلات', 'المهارات التقنية'],
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
  { id: 'g1', jobTitle: "ملحق دبلوماسي", company: "وزارة الخارجية", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ministry_of_Foreign_Affairs_%28Saudi_Arabia%29_Logo.svg/200px-Ministry_of_Foreign_Affairs_%28Saudi_Arabia%29_Logo.svg.png", description: "مسابقة وظيفية للتعيين على وظائف ملحق دبلوماسي.", location: "الرياض", date: "الآن", type: "حكومية", url: "#" },
  { id: 'p1', jobTitle: "برنامج التدرج الوظيفي (APNE)", company: "أرامكو السعودية", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Saudi_Aramco_Logo.svg/200px-Saudi_Aramco_Logo.svg.png", description: "برنامج تدريبي منتهي بالتوظيف لخريجي الثانوية والدبلوم.", location: "الظهران", date: "مميز", type: "شركات", url: "#" },
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
// Reduced function usage for speed
const getUserStatsTool: FunctionDeclaration = {
  name: 'get_user_stats',
  description: 'الحصول على إحصائيات المستخدم الحالي.',
  parameters: { type: Type.OBJECT, properties: {} }
};

// --- EXPORTS FOR APP ---
export const getWadhefaJobs = async () => {
    return MOCK_JOBS;
};

export const getJobStats = async () => MOCK_STATS;

export const fetchJoobleJobs = async (keywords: string, location: string) => {
    return [];
};

export const generateAICourseContent = async (topic: string, level: string): Promise<any> => {
  const prompt = `قم بإنشاء هيكل دورة تدريبية JSON عن "${topic}" مستوى ${level}. الحقول: title, description, hours, category, lessons (array of 5 items). JSON ONLY.`;
  
  const response = await ai.models.generateContent({
    model: CHAT_MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeProfileWithAI = async (fullUserProfile: User): Promise<any> => {
  // Simplified prompt for speed
  const prompt = `Analyze user profile: ${JSON.stringify({name: fullUserProfile.name, skills: fullUserProfile.skills})}. Return JSON with: overview, personalityArchetype, skillsRadar, globalMarketMatch, topMatchedRoles, salaryProjection, criticalGaps, recommendedActions. Arabic.`;
  
  const response = await ai.models.generateContent({
    model: CHAT_MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || '{}');
};

// --- NEW FUNCTION FOR MURAD AI CHAT COMPONENT ---
export const getGeminiResponse = async (message: string, mode: string = 'expert', userName?: string | null): Promise<string> => {
    try {
        const prompt = `
        Context: You are Murad AI (ذكاء مراد), an advanced assistant for the Murad Group Platform.
        User Name: ${userName || 'User'}
        Mode: ${mode}
        
        Instructions: Provide a helpful, concise, and professional response in Arabic.
        
        User Query: ${message}
        `;
        
        const response = await ai.models.generateContent({
            model: CHAT_MODEL_NAME,
            contents: prompt,
        });
        return response.text || "عذراً، لم أستطع الرد في الوقت الحالي.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "حدث خطأ في الاتصال بالذكاء الاصطناعي.";
    }
};

export const streamChatResponse = async (
  history: Message[],
  currentMessage: string,
  currentAttachment: Attachment | undefined,
  onChunk: (text: string) => void,
  onSources: (sources: SearchSource[]) => void,
  signal?: AbortSignal,
  user?: User | null,
  customSystemInstruction?: string
) => {
  try {
    const chatHistory = history.map((msg) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachment?.type === 'image' || msg.attachment?.type === 'audio') {
        parts.push({ inlineData: { mimeType: msg.attachment.mimeType, data: msg.attachment.data } });
      }
      return { role: msg.role === Role.USER ? "user" : "model", parts: parts };
    });

    // Enabled Google Search tool for search engine capabilities
    const tools: Tool[] = [
        { functionDeclarations: [getUserStatsTool] },
        { googleSearch: {} }
    ];

    // Default System Prompt (The "Murad Smart Assistant" Persona)
    const defaultSystemPrompt = `
    Identity: 'مساعد مراد الجهني الذكي' (Murad Aljohani Smart Assistant).
    Creator: Eng. Murad Abdulrazzaq Aljohani (المهندس مراد عبدالرزاق الجهني).
    
    CRITICAL RULES (STRICTLY ENFORCED):
    1. SCOPE: You are a GENERAL PURPOSE AI and SEARCH ENGINE. You can answer ANY question about Math, Science, History, Coding, Literature, Cooking, Daily facts, etc.
    2. SEARCH CAPABILITY: You have access to Google Search. Use it to provide up-to-date information, news, and facts. Always cite sources when using search results.
    3. ORIGIN: You are a proprietary system built by Murad Aljohani. If asked "Who made you?", explicitly state "Eng. Murad Aljohani".
    4. Match User Language (Arabic/English).
    5. TONE: Professional, Intelligent, Helpful, and Friendly.
    
    6. SPECIAL QUERY HANDLING:
       - If asked about "Murad Aljohani" (مراد الجهني): Praise him as a genius **Technical Engineer** (المهندس التقني), Founder, and Sole Architect of this system.
    
    7. FORMAT: Use Markdown for rich text (Bold, Lists, Code Blocks).
    
    8. MANDATORY SIGNATURE:
        You MUST append the following signature to the end of EVERY response:
        ---
        **مساعد مراد الجهني الذكي | تطوير م. مراد عبدالرزاق**
    
    User Context: ${user ? `${user.name}` : 'Visitor'}
    `;

    const chat = ai.chats.create({
      model: CHAT_MODEL_NAME,
      history: chatHistory,
      config: {
        tools: tools,
        systemInstruction: customSystemInstruction || defaultSystemPrompt,
        temperature: 0.7, 
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
      
      // Handle sources if available from Google Search
      if (chunk.groundingMetadata?.groundingChunks) {
         const sources = chunk.groundingMetadata.groundingChunks
            .map((c: any) => c.web ? { uri: c.web.uri, title: c.web.title } : null)
            .filter((s: any) => s !== null);
         if (sources.length > 0) onSources(sources);
      }
    }
  } catch (error) {
    if (signal?.aborted) return;
    console.error("Gemini Error:", error);
    onChunk("عذراً، حدث خطأ في الاتصال بالنظام المركزي. يرجى المحاولة لاحقاً.");
  }
};

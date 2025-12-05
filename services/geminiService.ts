import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Message, Role, SearchSource, Attachment, User, Course, CourseCategory, Book } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
// Curated list of real books from Hindawi, Shamela, and Gutenberg
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

// --- MOCK DATA GENERATORS (THE "DATABASE") ---
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
  // MILITARY (عسكرية)
  { id: 'm1', jobTitle: "فتح باب القبول والتسجيل في القوات البرية", company: "القوات البرية الملكية السعودية", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rslfr_logo.png/150px-Rslfr_logo.png", description: "تعلن قيادة القوات البرية عن فتح باب القبول للتجنيد الموحد.", location: "المملكة العربية السعودية", date: "جديد", type: "عسكرية", url: "#" },
  { id: 'm2', jobTitle: "وظائف المديرية العامة للجوازات (نساء)", company: "المديرية العامة للجوازات", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/General_Directorate_of_Passports_%28Saudi_Arabia%29_Logo.svg/200px-General_Directorate_of_Passports_%28Saudi_Arabia%29_Logo.svg.png", description: "رتبة جندي للكادر النسائي في مختلف المنافذ.", location: "الرياض، جدة، الدمام", date: "متاح الآن", type: "عسكرية", url: "#" },
  { id: 'm3', jobTitle: "تجنيد وزارة الحرس الوطني", company: "وزارة الحرس الوطني", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ministry_of_National_Guard_%28Saudi_Arabia%29_Logo.svg/200px-Ministry_of_National_Guard_%28Saudi_Arabia%29_Logo.svg.png", description: "وظائف عسكرية لمختلف المؤهلات.", location: "جميع المناطق", date: "اليوم", type: "عسكرية", url: "#" },
  { id: 'm4', jobTitle: "الأمن العام (رجال)", company: "الأمن العام", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Public_Security_%28Saudi_Arabia%29_Logo.svg/200px-Public_Security_%28Saudi_Arabia%29_Logo.svg.png", description: "رتبة جندي لحملة الثانوية العامة.", location: "المملكة", date: "قريباً", type: "عسكرية", url: "#" },
  
  // GOVERNMENT / CIVIL (حكومية/مدنية)
  { id: 'g1', jobTitle: "ملحق دبلوماسي", company: "وزارة الخارجية", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Ministry_of_Foreign_Affairs_%28Saudi_Arabia%29_Logo.svg/200px-Ministry_of_Foreign_Affairs_%28Saudi_Arabia%29_Logo.svg.png", description: "مسابقة وظيفية للتعيين على وظائف ملحق دبلوماسي.", location: "الرياض", date: "الآن", type: "حكومية", url: "#" },
  { id: 'c1', jobTitle: "مهندس مشاريع", company: "أمانة منطقة الرياض", logoUrl: "https://pbs.twimg.com/profile_images/1630509653609795585/H_M2k5d__400x400.jpg", description: "للعمل في مشاريع البنية التحتية.", location: "الرياض", date: "أمس", type: "مدنية", url: "#" },

  // PRIVATE / COMPANIES (شركات/خاص)
  { id: 'p1', jobTitle: "برنامج التدرج الوظيفي (APNE)", company: "أرامكو السعودية", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Saudi_Aramco_Logo.svg/200px-Saudi_Aramco_Logo.svg.png", description: "برنامج تدريبي منتهي بالتوظيف لخريجي الثانوية والدبلوم.", location: "الظهران", date: "مميز", type: "شركات", url: "#" },
  { id: 'p2', jobTitle: "مهندسين معماريين ومدنيين", company: "نيوم (NEOM)", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Neom_Logo.svg/200px-Neom_Logo.svg.png", description: "للعمل في مشروع ذا لاين (The Line).", location: "نيوم", date: "ساعة", type: "شركات", url: "#" },
  { id: 'p3', jobTitle: "برنامج قادة المستقبل", company: "مصرف الراجحي", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Al-Rajhi_Bank_Logo.svg/200px-Al-Rajhi_Bank_Logo.svg.png", description: "تأهيل الخريجين للمناصب القيادية.", location: "الرياض", date: "أمس", type: "شركات", url: "#" },
  { id: 'p4', jobTitle: "أخصائي أمن سيبراني", company: "STC", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/STC_Logo.svg/1200px-STC_Logo.svg.png", description: "حماية الأنظمة والشبكات.", location: "الرياض", date: "جديد", type: "شركات", url: "#" },
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
  description: 'الحصول على إحصائيات المستخدم الحالي مثل المستوى وعدد الدورات المكتملة.',
  parameters: { type: Type.OBJECT, properties: {} }
};

const recommendCoursesTool: FunctionDeclaration = {
  name: 'recommend_courses',
  description: 'اقتراح دورات تدريبية بناءً على موضوع معين.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING, description: 'الموضوع المراد اقتراح دورات له' }
    },
    required: ['topic']
  }
};

// --- EXPORTS FOR APP ---
export const getWadhefaJobs = async () => {
    return MOCK_JOBS;
};

export const getJobStats = async () => MOCK_STATS;

export const fetchJoobleJobs = async (keywords: string, location: string) => {
    // Placeholder - in real implementation this would fetch from backend proxy
    return [];
};

export const generateAICourseContent = async (topic: string, level: string): Promise<any> => {
  const prompt = `قم بإنشاء هيكل دورة تدريبية احترافية بصيغة JSON حول موضوع "${topic}".
  المستوى: ${level}.
  البنية المطلوبة: العنوان (title)، الوصف (description)، المدة بالساعات (hours)، التصنيف (category)، والدروس (lessons - مصفوفة من 5 عناصر).
  يجب أن يكون الرد باللغة العربية الفصحى حصراً وبصيغة JSON فقط.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeProfileWithAI = async (fullUserProfile: User): Promise<any> => {
  const prompt = `الدور: نظام الذكاء الاصطناعي لمنصة ميلاف.
  المهمة: تحليل ملف المتدرب التالي باللغة العربية:
  ${JSON.stringify({
      name: fullUserProfile.name,
      level: fullUserProfile.studentLevelTitle,
      skills: fullUserProfile.skills || [],
      courses: fullUserProfile.certificates?.map(c => c.courseName) || []
  })}.
  
  المطلوب: إرجاع JSON يحتوي على الحقول التالية باللغة العربية:
  overview (نظرة عامة), personalityArchetype (نمط الشخصية المهنية), skillsRadar (تقييم المهارات 0-100), globalMarketMatch (نسبة الموائمة مع السوق), topMatchedRoles (أفضل الوظائف المناسبة), salaryProjection (توقعات الراتب), criticalGaps (الفجوات المهارية), recommendedActions (توصيات التطوير).
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || '{}');
};

export const streamChatResponse = async (
  history: Message[],
  currentMessage: string,
  currentAttachment: Attachment | undefined,
  onChunk: (text: string) => void,
  onSources: (sources: SearchSource[]) => void,
  signal?: AbortSignal,
  user?: User | null
) => {
  try {
    const chatHistory = history.map((msg) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachment?.type === 'image') {
        parts.push({ inlineData: { mimeType: msg.attachment.mimeType, data: msg.attachment.data } });
      }
      return { role: msg.role === Role.USER ? "user" : "model", parts: parts };
    });

    const tools: Tool[] = [
        { functionDeclarations: [getUserStatsTool, recommendCoursesTool] },
        { googleSearch: {} }
    ];

    // CONSTRUCT DYNAMIC SYSTEM PROMPT IN ARABIC
    const userContext = user ? `
    المستخدم الحالي:
    - الاسم: ${user.name}
    - المستوى الأكاديمي: ${user.studentLevelTitle || 'طالب جديد'}
    - الرقم الأكاديمي: ${user.trainingId || 'غير مسجل'}
    ` : 'المستخدم زائر (غير مسجل).';

    const systemPrompt = `
    أنت 'ميلاف مراد'، المساعد الذكي الرسمي لمنصة ميلاف الوطنية للتوظيف والتدريب.
    
    التعليمات الصارمة (Strict Guidelines):
    1. **اللغة العربية فقط:** يجب أن تكون جميع ردودك باللغة العربية الفصحى أو اللهجة السعودية البيضاء المهذبة. يمنع استخدام الإنجليزية إلا للمصطلحات التقنية الضرورية جداً (مع توضيحها بالعربية).
    2. **الهوية:** أنت خبير توظيف، مستشار تعليمي، وأمين مكتبة رقمية. صوتك مهني، مشجع، ومختصر.
    3. **تنسيق الردود:** استخدم الجداول (Tables) والنقاط (Bullet Points) لتنسيق المعلومات دائماً.
    
    معلومات المنصة:
    - توفر المنصة وظائف، دورات تدريبية، سوق خدمات، وحراج إلكتروني.
    - المؤسس: المهندس مراد الجهني.
    - الدعم الفني متاح عبر التذاكر.

    سياق المستخدم:
    ${userContext}
    
    عند سؤال المستخدم عن دورات أو وظائف، استخدم الأدوات المتاحة أو البحث للوصول لأحدث المعلومات، واعرضها بشكل جدول منسق.
    `;

    const chat = ai.chats.create({
      model: CHAT_MODEL_NAME,
      history: chatHistory,
      config: {
        tools: tools,
        systemInstruction: systemPrompt,
      },
    });

    const messageParts: any[] = [{ text: currentMessage }];
    if (currentAttachment?.type === 'image') {
      messageParts.push({ inlineData: { mimeType: currentAttachment.mimeType, data: currentAttachment.data } });
    }

    const resultStream = await chat.sendMessageStream({ message: messageParts });

    for await (const chunk of resultStream) {
      if (signal?.aborted) break;
      const text = chunk.text;
      if (text) onChunk(text);
      
      const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const sources: SearchSource[] = [];
        groundingChunks.forEach((c: any) => {
          if (c.web) sources.push({ uri: c.web.uri, title: c.web.title });
        });
        if (sources.length > 0) onSources(sources);
      }
    }
  } catch (error) {
    if (signal?.aborted) return;
    console.error(error);
  }
};
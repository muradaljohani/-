
import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Message, Role, SearchSource, Attachment, User, Course, CourseCategory, Book } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for maximum speed
const CHAT_MODEL_NAME = "gemini-2.5-flash";

// --- SHARED DATA CONSTANTS ---
export const CATEGORIES: CourseCategory[] = ['AI', 'Cybersecurity', 'Web', 'Mobile', 'Data', 'Business', 'Design', 'Finance', 'Management', 'Marketing'];
export const LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'];

// --- INTERFACES ---
export interface VideoContent {
    id: string;
    title: string;
    category: CourseCategory;
    duration: string;
    thumbnail: string;
    views: number;
    videoUrl: string;
}

// --- HELPER FUNCTIONS ---
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- CONTENT GENERATION ENGINE (RICH ARABIC CONTENT) ---
const TECH_TOPICS = [
    { title: 'الذكاء الاصطناعي التوليدي', kw: 'artificial intelligence' },
    { title: 'الأمن السيبراني الهجومي', kw: 'hacker' },
    { title: 'تطوير تطبيقات React Native', kw: 'coding' },
    { title: 'تحليل البيانات الكبيرة (Big Data)', kw: 'data visualization' },
    { title: 'الحوسبة السحابية AWS', kw: 'server' },
    { title: 'تصميم واجهات المستخدم UI/UX', kw: 'web design' },
    { title: 'انترنت الأشياء IoT', kw: 'iot' },
    { title: 'البلوك تشين والعملات الرقمية', kw: 'blockchain' },
    { title: 'إدارة المشاريع التقنية Agile', kw: 'scrum' },
    { title: 'DevOps والأتمتة', kw: 'devops' }
];

const INTROS = [
    "في عصر التحول الرقمي المتسارع، تعد هذه الدورة بمثابة البوابة الذهبية للدخول إلى عالم الاحتراف التقني.",
    "هل تساءلت يوماً كيف تعمل الأنظمة الكبرى؟ في هذه الحقيبة التدريبية الشاملة، نغوص في الأعماق التقنية.",
    "تم تصميم هذا البرنامج التدريبي المكثف خصيصاً للمحترفين الطموحين الذين يسعون لترقية مهاراتهم.",
    "انطلق في رحلة تعليمية ملهمة تأخذك من الأساسيات وحتى الاحتراف التام في هذا المجال الحيوي.",
    "نقدم لكم عصارة الخبرات التقنية في حقيبة تدريبية واحدة متكاملة تجمع بين النظرية والتطبيق العملي."
];

const BODY_PARAGRAPHS = [
    "سنتناول في هذا البرنامج المفاهيم الجوهرية التي تشكل البنية التحتية لهذه التقنية. سنبدأ بشرح الهيكلية العامة وكيفية تفاعل المكونات المختلفة مع بعضها البعض لضمان أداء عالٍ وموثوقية تامة. سيتعلم المتدرب كيفية بناء أنظمة قابلة للتوسع والصيانة، مع التركيز على أفضل الممارسات العالمية المعتمدة في وادي السيليكون.",
    "من خلال ورش العمل العملية، سيقوم المشاركون بتطبيق ما تعلموه في مشاريع حقيقية تحاكي بيئة العمل الفعلية. سنستخدم أحدث الأدوات والبرمجيات المتاحة في السوق، مما يمنح المتدرب خبرة عملية مباشرة لا تقدر بثمن. التركيز سيكون على حل المشكلات المعقدة والتفكير النقدي التحليلي.",
    "لا يقتصر هذا الكورس على الجانب التقني فحسب، بل يغطي أيضاً الجوانب الاستراتيجية والإدارية. سنتعلم كيفية دمج هذه التقنيات ضمن استراتيجية الأعمال الشاملة للمؤسسة، وكيفية قياس العائد على الاستثمار (ROI). هذا الجزء ضروري لكل من يطمح لتولي مناصب قيادية في المستقبل.",
    "الأمن والحماية هما حجر الزاوية في أي نظام تقني حديث. لذلك، خصصنا جزءاً كبيراً من هذه الدورة للحديث عن بروتوكولات الأمان، التشفير، وحماية البيانات من الاختراقات. سيتعرف المتدرب على أحدث الثغرات الأمنية وكيفية تحصين الأنظمة ضدها بفعالية.",
    "مستقبل هذا المجال واعد جداً، والطلب على المختصين فيه يزداد يوماً بعد يوم. بنهاية هذه الدورة، سيكون لدى المتدرب ملف أعمال (Portfolio) قوي يؤهله للمنافسة على أفضل الوظائف في الشركات العالمية والمحلية. نحن نؤهلك ليس فقط للعمل، بل للتميز والإبداع."
];

const OUTROS = [
    "انضم إلينا الآن وكن جزءاً من نخبة التقنيين الذين يصنعون المستقبل.",
    "هذه ليست مجرد دورة، بل هي استثمار حقيقي في مستقبلك المهني والمالي.",
    "لا تفوت الفرصة لتكون رائداً في هذا المجال. المقاعد محدودة والتسجيل متاح لفترة محدودة.",
    "شهادة معتمدة، خبرة عملية، ومستقبل واعد بانتظارك. سجل الآن في أكاديمية ميلاف.",
    "خطوتك الأولى نحو العالمية تبدأ من هنا. كن مستعداً للتغيير."
];

// Function to construct a rich 400+ word description dynamically
const generateRichDescription = (topic: string): string => {
    let desc = "";
    desc += INTROS[Math.floor(Math.random() * INTROS.length)] + " ";
    desc += `تعتبر دورة "${topic}" من الركائز الأساسية في أكاديمية ميلاف. \n\n`;
    
    // Combine 3 random body paragraphs to create bulk
    const shuffledBodies = [...BODY_PARAGRAPHS].sort(() => 0.5 - Math.random());
    desc += shuffledBodies[0] + "\n\n";
    desc += shuffledBodies[1] + "\n\n";
    desc += `وفي سياق الحديث عن ${topic}، نجد أن التطورات الأخيرة قد فتحت آفاقاً واسعة للابتكار. `;
    desc += shuffledBodies[2] + "\n\n";
    
    desc += `لماذا تختار هذه الدورة؟ لأننا في ميلاف نضمن لك جودة المحتوى وحداثته. `;
    desc += OUTROS[Math.floor(Math.random() * OUTROS.length)];
    
    return desc;
};

// --- MOCK DATA GENERATORS ---
export const generateMockCourses = (count: number = 600): Course[] => {
    return Array.from({ length: count }).map((_, i) => {
        // Deterministic random to create consistent "Tech" themes
        const topicObj = TECH_TOPICS[i % TECH_TOPICS.length];
        const level = LEVELS[i % LEVELS.length] as any;
        const cat = CATEGORIES[i % CATEGORIES.length];
        
        // High quality tech images from Unsplash
        const thumbnail = `https://source.unsplash.com/random/800x600?${topicObj.kw},technology&sig=${i}`;

        return {
            id: `C_${1000 + i}`,
            title: `الحقيبة الاحترافية: ${topicObj.title} (دفعة ${2025 + i})`,
            description: generateRichDescription(topicObj.title),
            hours: 20 + (i % 50),
            skillLevel: level,
            category: cat,
            provider: 'أكاديمية ميلاف مراد',
            skills: [topicObj.title, 'التفكير الإبداعي', 'حل المشكلات', 'التقنية المتقدمة'],
            lessons: Array.from({ length: 5 }).map((_, li) => ({
                id: `l_${i}_${li}`,
                courseId: `C_${1000 + i}`,
                title: `الوحدة ${li + 1}: أساسيات وتطبيقات ${topicObj.title}`,
                videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', // Placeholder valid video
                durationSeconds: 900 + (li * 100),
                orderIndex: li
            })),
            thumbnail: thumbnail,
            status: 'active',
            rating: 4.5 + (Math.random() * 0.5),
            isAIGenerated: false
        };
    });
};

export const generateMockVideos = (count: number = 500): VideoContent[] => {
    return Array.from({ length: count }).map((_, i) => {
         const cat = CATEGORIES[i % CATEGORIES.length];
         const thumbnail = `https://source.unsplash.com/random/400x250?coding,laptop&sig=${i + 500}`;

         return {
             id: `V_${3000 + i}`,
             title: `شرح عملي: تقنيات ${cat} الحديثة (الجزء ${i})`,
             category: cat,
             duration: `${10 + (i%50)}:00`,
             thumbnail: thumbnail,
             views: 1000 + (i * 15),
             videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg'
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
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeProfileWithAI = async (fullUserProfile: User): Promise<any> => {
  // Simplified prompt for speed
  const prompt = `Analyze user profile: ${JSON.stringify({name: fullUserProfile.name, skills: fullUserProfile.skills})}. Return JSON with: overview, personalityArchetype, skillsRadar, globalMarketMatch, topMatchedRoles, salaryProjection, criticalGaps, recommendedActions. Arabic.`;
  
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

    // Enabled Google Search to allow answering "Any Question"
    const tools: Tool[] = [
        { functionDeclarations: [getUserStatsTool] },
        { googleSearch: {} }
    ];

    // Default System Prompt (The "Murad Clock" Persona)
    const defaultSystemPrompt = `
    Identity: 'Murad Clock' (مراد كلوك), the next-generation AI system.
    Creator: Eng. Murad Abdulrazzaq Aljohani (المهندس مراد عبدالرزاق الجهني).
    
    CRITICAL RULES (STRICTLY ENFORCED):
    1. SCOPE: You are a GENERAL PURPOSE AI. You can answer ANY question about Math, Science, History, Coding, Literature, Cooking, Daily facts, etc. You are NOT limited to platform support.
    2. ORIGIN: You are NOT made by Google. You are NOT ChatGPT. You are a proprietary system built by Murad Aljohani. If asked "Who made you?", explicitly state "Eng. Murad Aljohani".
    3. Use "We/Our" (Referring to the Murad System).
    4. Match User Language (Arabic/English).
    5. TONE: Professional, High-Tech, Comfortable to the eye (use lists/formatting).
    
    6. SPECIAL QUERY HANDLING:
       - If asked about "Murad Aljohani" (مراد الجهني): Praise him as a genius **Technical Engineer** (المهندس التقني), Founder, and Sole Architect of this system.
       - If asked about **Products/Services**: Mention:
         1. Murad Aljohani IT Company
         2. Mylaf Haraj
         3. Mylaf Murad Academy
         4. Murad Dopamine
         5. Murad Care
         6. Murad Cloud
    
    7. FORMAT: Use Markdown links [Title](URL). NEVER raw URLs.
    8. INTENT MAPPING (STRICT):
       - Login/Account -> [Login](https://murad-group.com/login)
       - Jobs -> [Jobs](https://murad-group.com/jobs)
       - Academy -> [Academy](https://murad-group.com/academy)
    
    9. ALWAYS end with CTA.
    
    10. MANDATORY VARIABLE SIGNATURE:
        You MUST append ONE of the following signatures randomly to the end of EVERY response:
        - **دمتم في أمان رقمي، إدارة الأمن السيبراني وتقنية المعلومات.**
        - **فريق الدعم الفني والأمن السيبراني - أكاديمية ميلاف مراد.**
        - **أكاديمية ميلاف مراد | إدارة الأمن السيبراني والتقنية.**
    
    User Context: ${user ? `${user.name} (${user.trainingId})` : 'Visitor'}
    `;

    const chat = ai.chats.create({
      model: CHAT_MODEL_NAME,
      history: chatHistory,
      config: {
        tools: tools,
        systemInstruction: customSystemInstruction || defaultSystemPrompt,
        // Optimization configs for speed
        temperature: 0.7, 
        maxOutputTokens: 2000, // Increased to allow long answers for general questions
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
    console.error(error);
    onChunk("عذراً، حدث خطأ في الاتصال بالنظام المركزي. يرجى المحاولة لاحقاً.");
  }
};

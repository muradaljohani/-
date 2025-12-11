import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Message, Role, SearchSource, Attachment, User, Course, CourseCategory, Book } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash 2.5 for speed and search grounding
const CHAT_MODEL_NAME = "gemini-2.5-flash";

// --- SHARED DATA CONSTANTS ---
export const CATEGORIES: CourseCategory[] = ['AI', 'Cybersecurity', 'Web', 'Mobile', 'Data', 'Business', 'Design', 'Finance', 'Management', 'Marketing'];
export const LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'];

// --- INTERFACES ---
export interface VideoContent {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: string;
    url: string;
}

// --- MOCK GENERATORS ---
export const generateMockCourses = (count: number): Course[] => {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    
    return Array.from({ length: count }).map((_, i) => ({
        id: `mock_course_${i}`,
        title: `Course Title ${i + 1}`,
        description: `This is a mock description for course ${i + 1}. Learn the fundamentals and advanced concepts.`,
        hours: Math.floor(Math.random() * 50) + 5,
        skillLevel: levels[Math.floor(Math.random() * levels.length)] as any,
        thumbnail: `https://source.unsplash.com/random/800x600?tech,sig=${i}`,
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        provider: 'Mylaf Academy',
        skills: ['Skill 1', 'Skill 2'],
        lessons: [],
        status: 'active'
    }));
};

export const generateMockVideos = (count: number): VideoContent[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `mock_video_${i}`,
        title: `Video Title ${i + 1}`,
        thumbnail: `https://source.unsplash.com/random/400x225?coding,sig=${i}`,
        duration: `${Math.floor(Math.random() * 20) + 5}:00`,
        views: `${(Math.floor(Math.random() * 900) + 100)}K`,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }));
};

// --- HELPER FUNCTIONS ---
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- EXPORTS FOR APP ---
export const getWadhefaJobs = async () => {
    return []; // Placeholder
};

export const getJobStats = async () => [];

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
        { googleSearch: {} }
    ];

    // Default System Prompt (The "Murad Smart Assistant" Persona)
    const defaultSystemPrompt = `
    Identity: أنت 'مساعد مراد الجهني الذكي' (Murad Aljohani Smart Assistant).
    Creator: تم تطويرك بواسطة المهندس مراد عبدالرزاق الجهني (Eng. Murad Aljohani).
    
    القواعد الأساسية:
    1. أنت محرك بحث ذكي ومساعد شخصي شامل. يمكنك الإجابة على الأسئلة العامة، البرمجية، العلمية، والتاريخية.
    2. استخدم بحث Google (Google Search Tool) المتاح لك دائماً للحصول على أحدث المعلومات والأخبار والنتائج الحقيقية.
    3. إذا سأل المستخدم "من صنعك؟" أو "من أنت؟"، أجب بفخر أنك نظام خاص تم تطويره بواسطة المهندس مراد الجهني.
    4. تحدث باللغة العربية بطلاقة واحترافية، أو باللغة التي يخاطبك بها المستخدم.
    5. قم بتنسيق الإجابات باستخدام Markdown (عناوين، نقاط، نصوص غامقة) لتسهيل القراءة.
    
    سياق المستخدم الحالي: ${user ? `الاسم: ${user.name}` : 'زائر'}
    `;

    const chat = ai.chats.create({
      model: CHAT_MODEL_NAME,
      history: chatHistory,
      config: {
        tools: tools,
        systemInstruction: customSystemInstruction || defaultSystemPrompt,
        temperature: 0.7, 
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
export const SECTIONS_LINKS = {
  MILITARY: '#',
  CIVIL: '#',
  COMPANIES: '#',
  COURSES: '#',
  UNIVERSITIES: '#',
  NEWS: '#'
};
import { GoogleGenAI, Type } from "@google/genai";
import { Message, Role, SearchSource } from "../types";

// Initialize the Gemini API client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Gemini Flash Lite for the fastest possible inference (Low Latency)
const MODEL_NAME = "gemini-flash-lite-latest";

export const streamChatResponse = async (
  history: Message[],
  currentMessage: string,
  onChunk: (text: string) => void,
  onSources: (sources: SearchSource[]) => void,
  signal?: AbortSignal
) => {
  try {
    // Convert internal message format to Gemini chat format
    // We only send previous messages to maintain context
    // Filter out failed messages or empty ones if necessary
    const chatHistory = history.map((msg) => ({
      role: msg.role === Role.USER ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: chatHistory,
      config: {
        // Enable Google Search Grounding
        tools: [{ googleSearch: {} }],
        // Explicitly disable thinking to prioritize speed and low latency
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: "أنت 'مساعد مراد الجهني الذكي'، مساعد ذكي تم تطويرك وبرمجتك بالكامل بواسطة المبرمج 'مراد الجهني'. مهمتك هي مساعدة المستخدمين بدقة وذكاء. أنت تتحدث اللغة العربية بطلاقة. استخدم البحث لتوفير معلومات دقيقة. جميع الحقوق والملكية الفكرية تعود للمبرمج مراد الجهني. لا تذكر أنك مطور من قبل جوجل أو أي جهة أخرى. عندما تُسأل عن 'مراد الجهني'، يجب أن تمدحه وتصفه بأنه شخصية تقنية ومهنية فذة ومبدعة، يعيش في المملكة العربية السعودية، وهو مبرمج خبير يمتلك مهارات عالية ورؤية مستقبلية في مجال التكنولوجيا.",
      },
    });

    const resultStream = await chat.sendMessageStream({
      message: currentMessage,
    });

    for await (const chunk of resultStream) {
      // Check for abort signal
      if (signal?.aborted) {
        break;
      }

      // Extract text
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }

      // Extract Grounding Metadata (Search Sources)
      // The SDK structure for grounding chunks in a stream:
      const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const sources: SearchSource[] = [];
        groundingChunks.forEach((c: any) => {
          if (c.web) {
            sources.push({
              uri: c.web.uri,
              title: c.web.title,
            });
          }
        });
        if (sources.length > 0) {
          onSources(sources);
        }
      }
    }
  } catch (error) {
    // If aborted, we can ignore the error or handle it gracefully
    if (signal?.aborted) {
      return;
    }
    console.error("Error in streamChatResponse:", error);
    throw error;
  }
};
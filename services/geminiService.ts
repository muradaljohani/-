import { GoogleGenAI, Type } from "@google/genai";
import { Message, Role, SearchSource } from "../types";

// Initialize the Gemini API client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const streamChatResponse = async (
  history: Message[],
  currentMessage: string,
  onChunk: (text: string) => void,
  onSources: (sources: SearchSource[]) => void
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
        systemInstruction: "You are 'مساعد مراد الجهني الذكي' (Murad Al-Juhani's Smart Assistant). You are a helpful, intelligent, and polite AI assistant that speaks Arabic by default. You use Google Search to provide accurate, up-to-date information. Format your responses nicely using Markdown.",
      },
    });

    const resultStream = await chat.sendMessageStream({
      message: currentMessage,
    });

    for await (const chunk of resultStream) {
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
    console.error("Error in streamChatResponse:", error);
    throw error;
  }
};

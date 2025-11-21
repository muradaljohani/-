import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { MessageItem } from './components/MessageItem';
import { ChatInput } from './components/ChatInput';
import { streamChatResponse } from './services/geminiService';
import { Message, Role } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      content: 'أهلاً بك! أنا مساعد مراد الجهني الذكي. كيف يمكنني مساعدتك اليوم في البحث عن المعلومات أو الإجابة على استفساراتك؟',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      content: content,
    };

    const aiMessageId = uuidv4();
    const initialAiMessage: Message = {
      id: aiMessageId,
      role: Role.MODEL,
      content: '',
      isStreaming: true,
      sources: []
    };

    setMessages((prev) => [...prev, userMessage, initialAiMessage]);
    setIsLoading(true);

    try {
      // Get history excluding the optimistic messages we just added
      const history = messages.filter(m => m.id !== 'welcome'); 

      await streamChatResponse(
        history,
        content,
        // On Chunk (Text)
        (textChunk) => {
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === aiMessageId 
                ? { ...msg, content: msg.content + textChunk }
                : msg
            )
          );
        },
        // On Sources (Grounding)
        (newSources) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, sources: [...(msg.sources || []), ...newSources] }
                : msg
            )
          );
        },
        // Pass the signal
        abortController.signal
      );
    } catch (error) {
      if (abortController.signal.aborted) return;
      
      console.error('Error sending message:', error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessageId 
            ? { ...msg, content: 'عذراً، حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.' }
            : msg
        )
      );
    } finally {
      // Only update state if this is still the active controller
      if (abortControllerRef.current === abortController) {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-100 font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="max-w-4xl mx-auto p-4 pb-32">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput 
        onSend={handleSendMessage}
        onStop={handleStop}
        isLoading={isLoading} 
      />
    </div>
  );
}

export default App;
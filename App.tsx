import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { MessageItem } from './components/MessageItem';
import { ChatInput } from './components/ChatInput';
import { streamChatResponse } from './services/geminiService';
import { Message, Role, SearchSource } from './types';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
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
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessageId 
            ? { ...msg, content: 'عذراً، حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.' }
            : msg
        )
      );
    } finally {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <Header />
      
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-3xl mx-auto p-4 pb-32">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput 
        onSend={handleSendMessage} 
        disabled={isLoading} 
        isLoading={isLoading} 
      />
    </div>
  );
}

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Image as ImageIcon, PenTool, Sparkles, MoveUp, Paperclip, Clock } from 'lucide-react';
import { getGeminiResponse } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  time: Date;
}

export const MuradAI: React.FC<Props> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // Control intro star
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use existing Auth Context instead of firebase hooks directly
  const { user } = useAuth();
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  if (!isOpen) return null;

  const handleSend = async (textOverride: string | null = null) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    setShowIntro(false); // Hide intro when conversation starts
    
    const userMsg: ChatMessage = { text: text, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const reply = await getGeminiResponse(text, 'expert', user?.name);
      setMessages(prev => [...prev, { text: reply, sender: 'ai', time: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "حدث خطأ في الاتصال.", sender: 'ai', time: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col font-sans text-white animate-in slide-in-from-bottom duration-300">
      
      {/* 1. Header */}
      <div className="flex justify-between items-center p-4">
        <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
        <div className="flex items-center gap-2 bg-[#16181c] px-3 py-1 rounded-full border border-white/10">
          <span className="text-blue-400 font-bold text-sm">Beta</span>
          <span className="text-white font-bold text-sm">Murad AI 1.0</span>
        </div>
        <Clock className="w-6 h-6 text-gray-400" />
      </div>

      {/* 2. Content */}
      <div className="flex-1 overflow-y-auto p-4 relative flex flex-col scrollbar-thin scrollbar-thumb-gray-800">
        
        {/* Intro Interface (Star & Buttons) - Only visible initially */}
        {showIntro && messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            {/* Big Star */}
            <div className="relative mb-12 opacity-80">
               <Sparkles className="w-64 h-64 text-[#202327]" strokeWidth={1} />
               {/* Glow Effect */}
               <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
            </div>

            {/* Three Buttons */}
            <div className="flex gap-3 w-full max-w-md px-4">
              <button onClick={() => handleSend("أريد محادثة صوتية")} className="flex-1 bg-[#16181c] border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-[#202327] transition">
                <Mic className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-bold text-gray-300">محادثة صوتية</span>
              </button>
              <button onClick={() => handleSend("ساعدني في تعديل نص")} className="flex-1 bg-[#16181c] border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-[#202327] transition">
                <PenTool className="w-6 h-6 text-green-400" />
                <span className="text-sm font-bold text-gray-300">تعديل نصوص</span>
              </button>
              <button onClick={() => handleSend("أريد إنشاء صورة")} className="flex-1 bg-[#16181c] border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-[#202327] transition">
                <ImageIcon className="w-6 h-6 text-purple-400" />
                <span className="text-sm font-bold text-gray-300">إنشاء صور</span>
              </button>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="space-y-6 pb-24 pt-4 max-w-3xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-lg whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user' ? 'bg-[#1d9bf0]/20 text-white rounded-br-sm' : 'bg-transparent text-[#e7e9ea]'
                }`}>
                  {msg.sender === 'ai' && <span className="text-blue-400 text-xs font-bold block mb-2">Murad AI</span>}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-gray-500 animate-pulse px-4">Murad AI يكتب...</div>}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Floating Input Bar */}
      <div className="p-4 bg-transparent sticky bottom-0 z-20 pb-safe">
        <div className="max-w-3xl mx-auto">
            <div className="bg-[#202327] rounded-[32px] px-2 py-2 flex items-center gap-2 border border-white/10 shadow-lg">
            <button className="p-3 text-gray-400 hover:text-white bg-transparent rounded-full transition-colors">
                <Mic className="w-5 h-5" />
            </button>
            
            <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-white text-right placeholder-gray-500 h-10 px-2 font-bold"
                placeholder="...اسأل عن أي شيء"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                dir="rtl"
            />

            <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <Paperclip className="w-5 h-5" />
            </button>
            
            {inputText.trim() && (
                <button onClick={() => handleSend()} className="p-2 bg-white rounded-full ml-1 hover:bg-gray-200 transition-colors">
                <MoveUp className="w-5 h-5 text-black" />
                </button>
            )}
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-2 font-sans">
            Murad AI may make mistakes. Verify important info.
            </p>
        </div>
      </div>
    </div>
  );
};

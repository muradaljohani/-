
import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, ChevronDown, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './ToastContext';
import { streamChatResponse } from '../../services/geminiService';
import { Message, Role } from '../../types';
import ReactMarkdown from 'react-markdown';

export const MilafBot: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingText = user 
        ? `أهلاً بك يا ${user.name}. تواصل مع أكبر نظام عالمي "مراد كلوك". كيف يمكنني خدمتك اليوم؟\n\nمع تحيات إدارة الأمن السيبراني وتقنية المعلومات في أكاديمية ميلاف مراد`
        : `مرحباً بك زائرنا الكريم. تواصل مع أكبر نظام عالمي "مراد كلوك". هل تبحث عن وظيفة، دورة تدريبية، أو معلومة عامة؟\n\nمع تحيات إدارة الأمن السيبراني وتقنية المعلومات في أكاديمية ميلاف مراد`;
        
      setMessages([{ 
          id: 'init', 
          role: Role.MODEL, 
          content: greetingText 
      }]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Event Listener for External Trigger (e.g., Landing Page Search)
  useEffect(() => {
      const handleExternalTrigger = (e: CustomEvent) => {
          const query = e.detail?.query;
          if (query) {
              // Ensure window is open
              setIsOpen(true);
              // Small delay to allow state update if needed, though handled by functional update in handleSend
              setTimeout(() => handleSend(query), 100);
          }
      };
      window.addEventListener('open-milaf-chat' as any, handleExternalTrigger as any);
      return () => window.removeEventListener('open-milaf-chat' as any, handleExternalTrigger as any);
  }, []); 

  const handleSend = async (overrideInput?: string) => {
    const userMsgText = overrideInput || input;
    if (!userMsgText.trim()) return;
    
    setInput('');
    setIsTyping(true);

    const userMsg: Message = { id: Date.now().toString(), role: Role.USER, content: userMsgText };
    
    // Use functional state update to ensure we have latest messages
    setMessages(prev => {
        const newHistory = [...prev, userMsg];
        // Prepare bot message placeholder
        const botMsgId = (Date.now() + 1).toString();
        const botMsgPlaceholder: Message = { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true };
        
        // Trigger streaming with the updated history
        startStreaming(newHistory, userMsgText, botMsgId);
        
        return [...newHistory, botMsgPlaceholder];
    });
  };

  const startStreaming = async (history: Message[], userMsgText: string, botMsgId: string) => {
      // Create abort controller for this request
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    let fullText = '';

    await streamChatResponse(
        history,
        userMsgText,
        undefined,
        (textChunk) => {
            fullText += textChunk;
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
        },
        (sources) => {
            // Optional: Handle sources if needed for the widget
             if (sources && sources.length > 0) {
                 // Sources are handled by component renderer usually, or we can append them
            }
        },
        abortControllerRef.current.signal,
        user
    );

    setIsTyping(false);
    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
  }

  return (
    <div className={`fixed z-[9990] font-sans ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-6 right-6'}`} dir="rtl">
      {/* Trigger Button - Hidden when open on mobile */}
      {(!isOpen) && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#0f172a] rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-110 transition-transform"
        >
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping"></div>
          <Bot className="w-7 h-7 text-cyan-400" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-full h-full sm:w-[400px] sm:h-[600px] flex flex-col bg-[#0f172a] sm:bg-[#0f172a]/95 backdrop-blur-xl border-0 sm:border border-cyan-500/30 sm:rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-900/50 to-[#0f172a] border-b border-cyan-500/20 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-cyan-400" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">نظام مراد كلوك (Murad Clock)</h3>
                <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <ActivityDot /> متصل (Online)
                </div>
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full"><ChevronDown className="w-5 h-5"/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === Role.USER ? 'bg-indigo-600' : 'bg-cyan-900/50 border border-cyan-500/30'}`}>
                  {msg.role === Role.USER ? <User className="w-4 h-4 text-white"/> : <Bot className="w-4 h-4 text-cyan-400"/>}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                  msg.role === Role.USER 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-[#1e293b] text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle"></span>
                  )}
                </div>
              </div>
            ))}
            {isTyping && !messages[messages.length - 1]?.isStreaming && (
               <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center"><Bot className="w-4 h-4 text-cyan-400"/></div>
                 <div className="bg-[#1e293b] px-4 py-3 rounded-2xl rounded-tl-none border border-white/5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#0b1120] border-t border-white/10 shrink-0 pb-safe">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center bg-[#1e293b] rounded-xl px-3 py-2 border border-white/10 focus-within:border-cyan-500/50 transition-colors">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="تواصل مع أكبر نظام عالمي مراد كلوك..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
                disabled={isTyping}
              />
              <button type="submit" disabled={!input || isTyping} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50">
                <Send className="w-4 h-4 rtl:rotate-180"/>
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

const ActivityDot = () => (
  <span className="relative flex h-2 w-2 mr-1">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
);

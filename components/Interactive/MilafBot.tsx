
import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, ChevronDown, Activity, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './ToastContext';
import { streamChatResponse } from '../../services/geminiService';
import { Message, Role, Attachment } from '../../types';
import ReactMarkdown from 'react-markdown';

export const MilafBot: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingText = user 
        ? `أهلاً بك يا ${user.name}. تواصل مع أكبر نظام عالمي "مراد كلوك". كيف يمكنني خدمتك اليوم؟`
        : `مرحباً بك زائرنا الكريم. تواصل مع أكبر نظام عالمي "مراد كلوك". هل تبحث عن وظيفة، دورة تدريبية، أو معلومة عامة؟`;
        
      setMessages([{ 
          id: 'init', 
          role: Role.MODEL, 
          content: greetingText 
      }]);
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, attachment]);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
          showToast('يرجى اختيار ملف صورة صالح', 'info');
          return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1];
        setAttachment({
          type: 'image',
          data: base64Data,
          mimeType: file.type,
          url: result
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => {
      setAttachment(null);
  };

  const handleSend = async (overrideInput?: string) => {
    const userMsgText = overrideInput || input;
    if (!userMsgText.trim() && !attachment) return;
    
    const currentAttachment = attachment;
    
    setInput('');
    setAttachment(null);
    setIsTyping(true);

    const userMsg: Message = { 
        id: Date.now().toString(), 
        role: Role.USER, 
        content: userMsgText,
        attachment: currentAttachment || undefined
    };
    
    // Use functional state update to ensure we have latest messages
    setMessages(prev => {
        const newHistory = [...prev, userMsg];
        // Prepare bot message placeholder
        const botMsgId = (Date.now() + 1).toString();
        const botMsgPlaceholder: Message = { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true };
        
        // Trigger streaming with the updated history
        startStreaming(newHistory, userMsgText, currentAttachment || undefined, botMsgId);
        
        return [...newHistory, botMsgPlaceholder];
    });
  };

  const startStreaming = async (history: Message[], userMsgText: string, currentAttachment: Attachment | undefined, botMsgId: string) => {
      // Create abort controller for this request
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    let fullText = '';

    await streamChatResponse(
        history,
        userMsgText,
        currentAttachment,
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
      {/* Trigger Button - Black & White Theme */}
      {(!isOpen) && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-black rounded-full border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:scale-110 transition-transform"
        >
          <Bot className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </button>
      )}

      {/* Chat Window - Black & White Theme */}
      {isOpen && (
        <div className="w-full h-full sm:w-[400px] sm:h-[600px] flex flex-col bg-white border border-black/10 sm:rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          
          {/* Header - Black bg, White text */}
          <div className="p-4 bg-black text-white border-b border-gray-800 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-white" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">نظام مراد كلوك (Murad Clock)</h3>
                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <ActivityDot /> متصل (Online)
                </div>
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full"><ChevronDown className="w-5 h-5"/></button>
            </div>
          </div>

          {/* Messages - White bg, Black text */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === Role.USER ? 'bg-gray-200' : 'bg-black text-white'}`}>
                  {msg.role === Role.USER ? <User className="w-4 h-4 text-black"/> : <Bot className="w-4 h-4 text-white"/>}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] border shadow-sm flex flex-col gap-2 ${
                  msg.role === Role.USER 
                    ? 'bg-gray-100 text-black border-gray-200 rounded-tr-none' 
                    : 'bg-black text-white border-black rounded-tl-none'
                }`}>
                  {msg.attachment && msg.attachment.type === 'image' && (
                      <div className="rounded-lg overflow-hidden mb-1">
                          <img 
                            src={msg.attachment.url || `data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} 
                            alt="Attachment" 
                            className="max-w-full h-auto max-h-48 object-cover"
                          />
                      </div>
                  )}
                  <div className="prose prose-sm max-w-none break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1 align-middle"></span>
                  )}
                </div>
              </div>
            ))}
            {isTyping && !messages[messages.length - 1]?.isStreaming && (
               <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center"><Bot className="w-4 h-4 text-white"/></div>
                 <div className="bg-black px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input - White bg, Black border */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0 pb-safe relative">
            {attachment && (
                <div className="absolute bottom-full left-0 w-full bg-white border-t border-gray-200 p-2 flex items-center gap-2 animate-fade-in-up">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-300">
                        <img src={attachment.url} className="h-full w-full object-cover" alt="Preview" />
                        <button onClick={removeAttachment} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    <span className="text-xs text-gray-500">صورة مرفقة</span>
                </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-300 focus-within:border-black transition-colors shadow-inner">
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                title="إرفاق صورة"
              >
                <ImageIcon className="w-5 h-5"/>
              </button>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="تواصل مع أكبر نظام عالمي مراد كلوك..."
                className="flex-1 bg-transparent text-black text-sm outline-none placeholder-gray-500"
                disabled={isTyping}
              />
              <button type="submit" disabled={(!input && !attachment) || isTyping} className="p-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50">
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
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
  </span>
);

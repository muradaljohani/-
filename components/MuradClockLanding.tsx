
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Zap, Menu, X, ArrowLeft, Phone, Share2, Check, AlertTriangle, Code, HelpCircle, Cpu } from 'lucide-react';
import { SEOHelmet } from './SEOHelmet';
import { streamChatResponse } from '../services/geminiService';
import { Message, Role } from '../types';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_PROMPTS = [
    { text: "من هو مطورك؟", icon: <User className="w-3 h-3"/> },
    { text: "كيف تم تصنيعك؟", icon: <Cpu className="w-3 h-3"/> },
    { text: "اكتب كود بايثون للذكاء الاصطناعي", icon: <Code className="w-3 h-3"/> },
    { text: "ما هو مراد كلوك؟", icon: <HelpCircle className="w-3 h-3"/> },
];

export const MuradClockLanding: React.FC = () => {
  // --- CHAT STATE ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: Role.MODEL, content: 'مرحباً! أنا **مراد كلوك**. نظام ذكاء اصطناعي متطور من حفر الباطن. أنا هنا للإجابة على أي سؤال في أي مجال (علمي، تقني، تاريخي، أو عن نظامي الخاص). كيف يمكنني مساعدتك؟' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isShared, setIsShared] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim()) return;

    setInputValue('');
    setIsTyping(true);

    // 1. Add User Message
    const userMsg: Message = { id: Date.now().toString(), role: Role.USER, content: textToSend };
    
    setMessages(prev => {
        const newHistory = [...prev, userMsg];
        const botMsgId = (Date.now() + 1).toString();
        const botMsgPlaceholder: Message = { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true };
        
        // Trigger API Call
        startStreaming(newHistory, textToSend, botMsgId);
        
        return [...newHistory, botMsgPlaceholder];
    });
  };

  const startStreaming = async (history: Message[], userMsgText: string, botMsgId: string) => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    let fullText = '';

    await streamChatResponse(
        history.filter(m => !m.isStreaming), 
        userMsgText,
        undefined, 
        (textChunk) => {
            fullText += textChunk;
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
        },
        () => {}, 
        abortControllerRef.current.signal,
        null,
        'murad_clock' // Explicitly use Murad Clock Persona
    );

    setIsTyping(false);
    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
  };

  const handleStartNow = () => {
    const chatContainer = document.getElementById('chat-demo-container');
    if (chatContainer) {
      chatContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 800);
    }
  };

  const handleSharePage = async () => {
    const shareData = {
        title: 'مراد كلوك | Murad Clock',
        text: 'اكتشف نظام مراد كلوك: الذكاء الاصطناعي لإدارة الأكاديميات والوقت.',
        url: 'https://murad-group.com/murad-clock'
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    } else {
        navigator.clipboard.writeText(shareData.url);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden" dir="rtl">
      <SEOHelmet 
        title="مراد كلوك | Murad Clock AI" 
        description="نظام ذكاء اصطناعي شامل يجيب على أي سؤال. تم تطويره في حفر الباطن بواسطة المهندس مراد الجهني." 
        path="/murad-clock"
        keywords={['مراد كلوك', 'Murad Clock', 'ذكاء اصطناعي', 'شات بوت', 'مراد الجهني', 'AI KSA']}
        type="Product"
      />

      {/* --- WHATSAPP FLOATING BUTTON --- */}
      <a 
        href="https://wa.me/966590113665" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[100] group"
        title="تواصل معنا عبر واتساب"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform border-2 border-white/20">
            <Phone className="w-8 h-8 text-white fill-current"/>
        </div>
      </a>

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
             <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center border border-white/10">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
             </div>
             <span className="text-xl font-bold tracking-wide text-white">Murad<span className="text-cyan-400">Clock</span></span>
          </div>
          
          <div className="flex gap-4 items-center">
             <button onClick={handleSharePage} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-cyan-400">
                {isShared ? <Check className="w-4 h-4"/> : <Share2 className="w-4 h-4"/>}
                <span className="hidden md:inline">{isShared ? 'تم النسخ' : 'مشاركة'}</span>
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 pt-10 pb-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           
           {/* Text Content */}
           <div className="text-center lg:text-right space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-fade-in-up">
                 <Zap className="w-4 h-4 fill-current" />
                 نظام ذكاء اصطناعي متكامل
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                 مراد كلوك: <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                   عالم جديد من المستقبل
                 </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                 نظام قادر على الإجابة عن أي سؤال في العلوم، التاريخ، البرمجة، والمزيد. يمتلك قاعدة بيانات خاصة عن المطور "مراد الجهني" وتفاصيل تصنيعه في حفر الباطن.
              </p>

              <div className="flex flex-col items-center lg:items-start gap-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                 <button onClick={handleStartNow} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group">
                    <span className="relative z-10">ابدأ المحادثة</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 </button>
              </div>
           </div>

           {/* Interactive Chat Demo */}
           <div id="chat-demo-container" className="relative animate-fade-in-up order-1 lg:order-2" style={{animationDelay: '0.4s'}}>
              {/* Glow Behind Chat */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              
              {/* Chat Interface */}
              <div className="relative bg-[#0b1120]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                 {/* Chat Header */}
                 <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="relative">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <Bot className="w-6 h-6 text-white" />
                       </div>
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b1120] rounded-full"></div>
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">مراد كلوك (General AI)</h3>
                       <p className="text-[10px] text-cyan-400 font-mono">Murad Core System • Online</p>
                    </div>
                 </div>

                 {/* Chat Body */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg) => (
                       <div key={msg.id} className={`flex gap-2 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === Role.USER ? 'bg-white/10 text-white' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'}`}>
                             {msg.role === Role.USER ? <User className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
                          </div>
                          <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                             msg.role === Role.USER 
                             ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20' 
                             : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
                          }`}>
                             <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                       </div>
                    ))}
                    
                    {isTyping && (
                       <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-cyan-600/20 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 text-cyan-400"/></div>
                          <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                             <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                             <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                             <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
                          </div>
                       </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>
                
                 {/* Suggested Prompts */}
                 <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide bg-black/20 border-t border-white/5">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleSendMessage(undefined, prompt.text)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-full text-[10px] text-gray-300 hover:text-cyan-300 transition-all whitespace-nowrap"
                        >
                            {prompt.icon} {prompt.text}
                        </button>
                    ))}
                 </div>

                 {/* Chat Input */}
                 <div className="p-4 bg-white/5 border-t border-white/10">
                    <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center gap-2">
                       <input 
                          ref={chatInputRef}
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="اسألني عن أي شيء (مثال: من هو مطورك؟)" 
                          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                          disabled={isTyping}
                       />
                       <button 
                          type="submit" 
                          disabled={!inputValue.trim() || isTyping}
                          className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
                       >
                          <Send className="w-4 h-4 rtl:rotate-180" />
                       </button>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 mt-20 py-8 border-t border-white/5 bg-[#0b0f19] text-center">
         <p className="text-slate-600 text-sm font-mono dir-ltr">
            Developed by Eng. Murad Aljohani in Hafar Al-Batin
         </p>
         <div className="text-[10px] text-cyan-900 mt-2 font-bold tracking-widest">
             MURAD CLOCK . SYSTEM ACTIVE
         </div>
      </footer>
    </div>
  );
};

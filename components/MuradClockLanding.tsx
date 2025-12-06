
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Zap, Menu, X, ArrowLeft, Phone, Share2, Check, AlertTriangle } from 'lucide-react';
import { SEOHelmet } from './SEOHelmet';
import { streamChatResponse } from '../services/geminiService';
import { Message, Role } from '../types';
import ReactMarkdown from 'react-markdown';

export const MuradClockLanding: React.FC = () => {
  // --- CHAT STATE ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: Role.MODEL, content: 'مرحباً! أنا مراد كلوك. عالم جديد من المستقبل. كيف يمكنني مساعدتك اليوم في أي مجال؟' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isShared, setIsShared] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null); // Ref for input focus
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');
    setIsTyping(true);

    // 1. Add User Message
    const userMsg: Message = { id: Date.now().toString(), role: Role.USER, content: userText };
    
    // Optimistic Update
    setMessages(prev => {
        const newHistory = [...prev, userMsg];
        const botMsgId = (Date.now() + 1).toString();
        const botMsgPlaceholder: Message = { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true };
        
        // Trigger API Call
        startStreaming(newHistory, userText, botMsgId);
        
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
        history.filter(m => !m.isStreaming), // Filter out placeholders
        userMsgText,
        undefined, // No attachment for landing page demo
        (textChunk) => {
            fullText += textChunk;
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
        },
        () => {}, // No sources handling for landing
        abortControllerRef.current.signal,
        null // Guest user context
    );

    setIsTyping(false);
    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
  };

  const handleStartNow = () => {
    // Scroll to chat container
    const chatContainer = document.getElementById('chat-demo-container');
    if (chatContainer) {
      chatContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus input after scroll
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
        title="مراد كلوك | Murad Clock" 
        description="نظام ذكاء اصطناعي متقدم لإدارة الأكاديميات وتنظيم الوقت. الحل التقني الأمثل للأفراد والشركات من مجموعة مراد." 
        path="/murad-clock"
        keywords={['مراد كلوك', 'Murad Clock', 'ادارة الوقت', 'تنظيم المهام', 'ذكاء اصطناعي', 'أكاديمية']}
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
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
      </a>

      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]"></div>
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
             <button 
                onClick={handleSharePage}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-cyan-400"
             >
                {isShared ? <Check className="w-4 h-4"/> : <Share2 className="w-4 h-4"/>}
                <span className="hidden md:inline">{isShared ? 'تم النسخ' : 'مشاركة النظام'}</span>
             </button>
             
             <button onClick={() => window.location.href = '/dopamine'} className="hidden md:flex px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all items-center gap-2 group">
                <span>تجربة النظام</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180"/>
             </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 pt-16 pb-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           
           {/* Text Content */}
           <div className="text-center lg:text-right space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-fade-in-up">
                 <Zap className="w-4 h-4 fill-current" />
                 الجيل القادم من الذكاء الاصطناعي
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                 مراد كلوك: <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                   ذكاء يتحدث لغتك
                 </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                 أكثر من مجرد نظام إدارة. إنه مساعدك الشخصي، مدير عملياتك، ومحرك نمو أكاديميتك. مدعوم بخوارزميات Murad Cloud العصبية.
              </p>

              <div className="flex flex-col items-center lg:items-start gap-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                 <button 
                    onClick={handleStartNow} 
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                 >
                    <span className="relative z-10">جرب المحادثة الآن</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 </button>

                 {/* Banner-Style Sarcastic Joke */}
                 <div className="w-full relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-r from-[#0b1120] to-[#162032] shadow-[0_0_40px_rgba(6,182,212,0.1)] group/banner">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee]"></div>
                    
                    <div className="p-6 relative z-10 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
                            <AlertTriangle className="w-4 h-4 animate-pulse"/>
                            <span>System Message: Reality Check</span>
                        </div>
                        
                        <p className="text-base md:text-lg font-medium leading-relaxed text-gray-200">
                            "استخدم <span className="text-white font-bold">Google</span> لتبحث عن المعلومات، 
                            واستخدم <span className="text-white font-bold">ChatGPT</span> لتكتب رسائل الغرام.. 
                            <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-black text-xl block mt-2">
                                وحينما تنتهي من اللعب، تعال لـ 'مراد كلوك' لنبدأ العمل الحقيقي.
                            </span>"
                        </p>
                    </div>
                    
                    {/* Animated Scanline */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent -translate-y-full group-hover/banner:translate-y-full transition-transform duration-1000 pointer-events-none"></div>
                 </div>
              </div>
           </div>

           {/* Interactive Chat Demo */}
           <div id="chat-demo-container" className="relative animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              {/* Glow Behind Chat */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              
              {/* Chat Interface */}
              <div className="relative bg-[#0b1120]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                 {/* Chat Header */}
                 <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="relative">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <Bot className="w-6 h-6 text-white" />
                       </div>
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b1120] rounded-full"></div>
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">مراد كلوك</h3>
                       <p className="text-[10px] text-cyan-400 font-mono">Murad Clock AI v2.0 • Online</p>
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
                       <div className="flex items-end gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                             <Sparkles className="w-4 h-4"/>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 flex gap-1">
                             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
                             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                       </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>

                 {/* Chat Input */}
                 <div className="p-4 bg-white/5 border-t border-white/10">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                       <input 
                          ref={chatInputRef}
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="اسأل مراد كلوك عن أي شيء (برمجة، تاريخ، عام...)" 
                          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
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

              {/* Floating Badge */}
              <div className="absolute -right-6 top-10 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-3 animate-bounce-slow shadow-xl">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                      <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">سرعة الاستجابة</div>
                      <div className="text-sm font-bold text-white">0.2 ثانية</div>
                  </div>
              </div>
           </div>
        </div>
      </main>

      {/* --- CUSTOM ISOLATED FOOTER --- */}
      <footer className="relative z-10 mt-20 py-12 border-t border-white/5 bg-[#0b0f19]">
         <div className="max-w-4xl mx-auto text-center px-6">
            <div className="mb-8">
               <div className="w-16 h-16 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl shadow-cyan-900/20">
                  <span className="text-3xl font-black text-white">M</span>
               </div>
            </div>
            
            <h3 className="text-lg md:text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200">
                <span className="animate-pulse text-cyan-400">جميع الحقوق محفوظة</span> شركة مراد الجهني لتقنية المعلومات العالمية
            </h3>
            
            <p className="text-slate-600 text-sm font-mono mb-8 dir-ltr">
               © 2025 Murad Aljohani Global Information Technology Company
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
               <a href="/policy" className="hover:text-cyan-400 transition-colors">سياسة الخصوصية</a>
               <a href="/terms" className="hover:text-cyan-400 transition-colors">شروط الاستخدام</a>
               <a href="/group/contact" className="hover:text-cyan-400 transition-colors">اتصل بنا</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

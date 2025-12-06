
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Zap, Menu, X, ArrowLeft } from 'lucide-react';
import { SEOHelmet } from './SEOHelmet';

export default function MuradClockLanding() {
  // --- CHAT SIMULATION STATE ---
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'مرحباً! أنا مراد كلوك. كيف يمكنني مساعدتك في إدارة منظومتك التعليمية اليوم؟' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate AI Thinking & Response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: Date.now() + 1,
        role: 'bot',
        text: 'أهلاً بك في نظام مراد كلوك، أنا هنا لمساعدتك في إدارة أكاديميتك بأحدث تقنيات الذكاء الاصطناعي. نحن نوفر حلولاً للأتمتة، الجدولة، والتحليل الذكي لرفع كفاءة مؤسستك.'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden" dir="rtl">
      <SEOHelmet 
        title="مراد كلوك | المستقبل الآن" 
        description="نظام ذكاء اصطناعي متقدم لإدارة الأكاديميات. تجربة غامرة من شركة مراد الجهني." 
        path="/murad-clock"
      />

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
          
          <div className="flex gap-4">
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                 <button onClick={() => window.location.href = '/dopamine'} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group">
                    <span className="relative z-10">ابدأ الآن مجاناً</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 </button>
              </div>
           </div>

           {/* Interactive Chat Demo */}
           <div className="relative animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              {/* Glow Behind Chat */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              
              {/* Chat Interface */}
              <div className="relative bg-[#0b1120]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
                 {/* Chat Header */}
                 <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="relative">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <Bot className="w-6 h-6 text-white" />
                       </div>
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b1120] rounded-full"></div>
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-sm">المساعد الذكي</h3>
                       <p className="text-[10px] text-cyan-400 font-mono">Murad Clock AI v2.0 • Online</p>
                    </div>
                 </div>

                 {/* Chat Body */}
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg) => (
                       <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'}`}>
                             {msg.role === 'user' ? <User className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
                          </div>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                             msg.role === 'user' 
                             ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20' 
                             : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
                          }`}>
                             {msg.text}
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
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="اسأل مراد كلوك عن أي شيء..." 
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
               جميع الحقوق محفوظة شركة مراد الجهني لتقنية المعلومات العالمية
            </h3>
            
            <p className="text-slate-600 text-sm font-mono mb-8 dir-ltr">
               © 2025 Murad Aljohani Global Information Technology Company
            </p>
            
            <div className="flex justify-center gap-6 text-sm font-medium text-slate-500">
               <a href="#" className="hover:text-cyan-400 transition-colors">سياسة الخصوصية</a>
               <a href="#" className="hover:text-cyan-400 transition-colors">شروط الاستخدام</a>
               <a href="#" className="hover:text-cyan-400 transition-colors">الدعم الفني</a>
            </div>
         </div>
      </footer>
    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, User, ChevronDown, Zap, Terminal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './ToastContext';

export const MilafBot: React.FC = () => {
  const { user, allJobs, allServices } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        const greeting = user 
          ? `أهلاً بك يا ${user.name} في إمبراطوريتك الرقمية. أنا "ميلاف"، مساعدك الشخصي. كيف يمكنني خدمتك اليوم؟`
          : `مرحباً بك زائرنا الكريم. أنا نظام الذكاء الاصطناعي الخاص بالمنصة. هل تبحث عن وظيفة أم دورة تدريبية؟`;
        setMessages([{ role: 'bot', text: greeting }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processLogic = (text: string) => {
    const q = text.toLowerCase();
    
    if (q.includes('وظيفة') || q.includes('وظائف') || q.includes('عمل')) {
      return `لدينا حالياً ${allJobs.length} فرصة وظيفية متاحة في النظام. هل تريد مني نقلك إلى بوابة التوظيف؟`;
    }
    if (q.includes('رصيد') || q.includes('محفظة') || q.includes('فلوس')) {
      if (!user) return "يرجى تسجيل الدخول أولاً للوصول إلى بياناتك المالية.";
      return `رصيدك الحالي في المحفظة هو ${user.wallet?.balance || 0} ريال سعودي.`;
    }
    if (q.includes('مشكلة') || q.includes('مساعدة') || q.includes('دعم')) {
      return "لا تقلق، لقد قمت بتنبيه فريق الأمن السيبراني. يمكنك أيضاً فتح تذكرة دعم فني من لوحة التحكم.";
    }
    if (q.includes('خدمات') || q.includes('سوق')) {
      return `يحتوي السوق حالياً على ${allServices.length} خدمة نشطة. هل تود عرض خدمة للبيع؟`;
    }
    
    return "أنا لازلت في طور التعلم (Machine Learning). هل يمكنك صياغة الطلب بشكل آخر؟";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Latency
    setTimeout(() => {
      const reply = processLogic(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setIsTyping(false);
      
      // Easter Egg: Notification Demo
      if (userMsg.includes('تجربة')) {
        showToast("تجربة إشعار ناجحة!", "success");
      }
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] font-sans" dir="rtl">
      {/* Trigger Button */}
      {!isOpen && (
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
        <div className="w-[350px] h-[500px] flex flex-col bg-[#0f172a]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-900/50 to-[#0f172a] border-b border-cyan-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-cyan-400" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">المساعد ميلاف (AI)</h3>
                <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                  <ActivityDot /> متصل (Online)
                </div>
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><ChevronDown className="w-5 h-5"/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-cyan-900/50 border border-cyan-500/30'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white"/> : <Zap className="w-4 h-4 text-cyan-400"/>}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-[#1e293b] text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
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
          <div className="p-3 bg-[#0b1120] border-t border-white/10">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-center bg-[#1e293b] rounded-xl px-3 py-2 border border-white/10 focus-within:border-cyan-500/50 transition-colors">
              <Terminal className="w-4 h-4 text-gray-500" />
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="اكتب أمرأً أو استفساراً..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
              />
              <button type="submit" disabled={!input} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50">
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

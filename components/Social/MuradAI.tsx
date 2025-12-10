
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Paperclip, Mic, Image as ImageIcon, 
  PenTool, Zap, Sparkles, Clock, ChevronDown, MoveUp 
} from 'lucide-react';

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
  const [showModeSelector, setShowModeSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = { text: inputText, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let replyText = "مرحباً! أنا ذكاء مجتمع ميلاف. كيف يمكنني مساعدتك اليوم؟";
      
      if (userMsg.text.includes("من أنت")) {
        replyText = "أنا نموذج ذكاء اصطناعي مطور خصيصاً لمجتمع ميلاف، لمساعدتك في التفكير والإبداع.";
      } else if (userMsg.text.includes("صورة")) {
        replyText = "لإنشاء الصور، يرجى استخدام زر 'إنشاء صور' في القائمة السفلية (قريباً).";
      } else if (userMsg.text.includes("وظيفة") || userMsg.text.includes("عمل")) {
        replyText = "يمكنك البحث عن الوظائف في قسم 'بوابة الوظائف'. هل تريد مني البحث عن وظيفة محددة لك؟";
      }

      setMessages(prev => [...prev, { text: replyText, sender: 'ai', time: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col font-sans text-white animate-in slide-in-from-bottom duration-300" dir="rtl">
      
      {/* 1. Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex gap-4 items-center">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white" title="سجل المحادثات">
            <Clock className="w-6 h-6" />
          </button>
        </div>

        {/* Model Selector (Grok Style) */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1.5 rounded-full transition"
          onClick={() => setShowModeSelector(!showModeSelector)}
        >
          <span className="text-blue-400 font-bold text-sm">Murad AI 1.0</span>
          <span className="text-gray-500 text-[10px] px-1.5 py-0.5 border border-gray-700 rounded bg-gray-900">Beta</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
        
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Model Dropdown */}
      {showModeSelector && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#16181c] border border-white/10 rounded-2xl w-64 shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 hover:bg-white/5 cursor-pointer flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div className="text-right">
                <div className="font-bold text-sm text-white">تلقائي (Fast)</div>
                <div className="text-[10px] text-gray-500">لخيار سريع وخبير</div>
              </div>
            </div>
            <div className="text-blue-500">✓</div>
          </div>
          <div className="p-3 hover:bg-white/5 cursor-pointer flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div className="text-right">
              <div className="font-bold text-sm text-white">إبداعي (Creative)</div>
              <div className="text-[10px] text-gray-500">للكتابة والتوليد</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Content Area */}
      <div className="flex-1 overflow-y-auto p-4 relative scrollbar-thin scrollbar-thumb-gray-800">
        
        {/* Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
          <Sparkles className="w-96 h-96 text-white" />
        </div>

        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-end pb-8 items-center text-center">
             <h2 className="text-2xl font-bold text-white mb-2">كيف يمكنني مساعدتك؟</h2>
             <p className="text-gray-500 text-sm">أنا هنا للإجابة على استفساراتك، مساعدتك في الكتابة، أو حتى توليد الأفكار.</p>
          </div>
        ) : (
          <div className="space-y-6 pb-4 max-w-3xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-base leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#1d9bf0]/10 text-white rounded-br-sm' 
                    : 'bg-transparent text-[#e7e9ea]'
                }`}>
                  {msg.sender === 'ai' && <span className="font-bold text-blue-400 block mb-1 text-xs uppercase tracking-wider">Murad AI</span>}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white/5 rounded-2xl px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 3. Footer Input */}
      <div className="p-4 bg-black sticky bottom-0 z-20 pb-safe">
        <div className="max-w-3xl mx-auto w-full">
            
            {/* Quick Actions (Only if empty) */}
            {messages.length === 0 && (
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <button className="flex-1 min-w-[100px] bg-[#16181c] hover:bg-[#202327] rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5 transition group">
                <ImageIcon className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">إنشاء صور</span>
                </button>
                <button className="flex-1 min-w-[100px] bg-[#16181c] hover:bg-[#202327] rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5 transition group">
                <PenTool className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">تعديل نصوص</span>
                </button>
                <button className="flex-1 min-w-[100px] bg-[#16181c] hover:bg-[#202327] rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5 transition group">
                <Mic className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">محادثة صوتية</span>
                </button>
            </div>
            )}

            {/* Input Bar */}
            <div className="bg-[#16181c] rounded-[24px] px-4 py-2 flex items-center gap-3 border border-white/10 focus-within:border-blue-500/50 transition-colors shadow-lg">
            <button className="p-2 text-gray-400 hover:text-white transition bg-transparent hover:bg-white/5 rounded-full">
                <Paperclip className="w-5 h-5" />
            </button>
            
            <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-white text-right placeholder-gray-500 h-10 text-sm"
                placeholder="اسأل عن أي شيء..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                dir="auto"
                autoFocus
            />

            {inputText.trim() ? (
                <button 
                onClick={handleSend}
                className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition transform hover:scale-105 shadow-md"
                >
                <MoveUp className="w-5 h-5" />
                </button>
            ) : (
                <button className="p-2 text-gray-400 hover:text-white transition bg-transparent hover:bg-white/5 rounded-full">
                <Mic className="w-5 h-5" />
                </button>
            )}
            </div>
            
            <div className="text-center mt-3">
            <p className="text-[9px] text-gray-600">
                Murad AI may make mistakes. Verify important info.
            </p>
            </div>
        </div>
      </div>
    </div>
  );
};

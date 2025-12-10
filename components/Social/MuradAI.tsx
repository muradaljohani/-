
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export const MuradAI: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        // Reset or Initialize greeting
        if (messages.length === 0) {
            setMessages([{ 
                id: '1', 
                role: 'ai', 
                text: 'مرحباً بك في ذكاء مراد (Murad Intelligence). أنا هنا لمساعدتك في أي شيء، من كتابة التغريدات إلى تحليل البيانات.' 
            }]);
        }
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsTyping(true);

    setTimeout(() => {
        let responseText = "جارٍ المعالجة بواسطة ذكاء مراد...";
        if (userText.toLowerCase().includes('who are you') || userText.includes('من أنت')) {
            responseText = "أنا ذكاء مراد (Murad Intelligence)، نظام ذكاء اصطناعي متطور تم بناؤه لخدمة هذا المجتمع.";
        } else {
            responseText = `سؤال مثير! سأقوم بتحليل "${userText}" وتقديم أفضل إجابة لك قريباً.`;
        }
        
        setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'ai', text: responseText }]);
        setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-white font-bold text-lg">Murad Intelligence</h2>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                            <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                    )}
                    {msg.role === 'user' && (
                         <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 border border-gray-600">
                            <User className="w-5 h-5 text-gray-300" />
                        </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-900 border border-gray-700 text-gray-200 rounded-tl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                        <Bot className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 bg-black pb-safe">
            <div className="flex items-center gap-2 bg-gray-900 rounded-full px-4 py-2 border border-gray-800 focus-within:border-blue-500 transition-colors shadow-lg">
                <input 
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none h-10 text-right"
                    placeholder="اسأل مراد أي شيء..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-700 transition-all"
                >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
            </div>
        </div>
    </div>
  );
};

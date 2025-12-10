
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Info, Image as ImageIcon, Mic, Plus, Send } from 'lucide-react';

interface Props {
  chatId: string;
  onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "هلا والله، كيف الحال؟", sender: 'them', time: '10:00 AM' },
    { id: 2, text: "بخير الله يسلمك، بشرني عنك؟", sender: 'me', time: '10:05 AM' },
    { id: 3, text: "الحمدلله، بخصوص المشروع الجديد..", sender: 'them', time: '10:10 AM' },
    { id: 4, text: "جاهزين للتنفيذ طال عمرك 🚀", sender: 'me', time: '10:12 AM' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      text: input, 
      sender: 'me', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2f3336] sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 -mr-2 hover:bg-[#18191c] rounded-full">
            <ArrowRight className="w-5 h-5 rtl:rotate-180 text-white" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${chatId}`} className="w-full h-full object-cover"/>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-sm text-[#e7e9ea]">المستخدم {chatId}</span>
                <span className="text-[11px] text-[#71767b]">@user_{chatId}</span>
             </div>
          </div>
        </div>
        <button>
          <Info className="w-5 h-5 text-[#e7e9ea]" />
        </button>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Date Separator */}
        <div className="text-center text-[13px] text-[#71767b] py-4">25 يناير 2025</div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[75%] px-4 py-3 text-[15px] relative group ${
                msg.sender === 'me' 
                  ? 'bg-[#1d9bf0] text-white rounded-[22px] rounded-br-sm' 
                  : 'bg-[#2f3336] text-[#e7e9ea] rounded-[22px] rounded-bl-sm'
              }`}
            >
              {msg.text}
              
              {/* Timestamp on Hover (Desktop) or always visible tiny */}
              <div className={`text-[10px] opacity-70 mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 3. Input Bar */}
      <div className="p-3 border-t border-[#2f3336] flex items-center gap-3 bg-black">
        {/* Add Media Button */}
        <button className="bg-[#1d9bf0] p-1.5 rounded-full text-white shrink-0 hover:bg-[#1a8cd8] transition-colors">
            <Plus className="w-5 h-5" />
        </button>

        {/* Input Field */}
        <div className="flex-1 bg-[#202327] rounded-[20px] flex items-center px-4 py-2 border border-transparent focus-within:border-[#1d9bf0] focus-within:bg-black transition-all">
            <input 
              type="text" 
              placeholder="بدء رسالة جديدة" 
              className="flex-1 bg-transparent text-white placeholder-[#71767b] outline-none text-sm dir-rtl"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <div className="flex items-center gap-3 mr-2">
                <ImageIcon className="w-5 h-5 text-[#1d9bf0] cursor-pointer" />
            </div>
        </div>

        {/* Send / Mic */}
        {input.trim() ? (
            <button onClick={handleSend} className="text-[#1d9bf0] p-2 hover:bg-[#1d9bf0]/10 rounded-full">
                <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
        ) : (
            <button className="text-[#1d9bf0] p-2 hover:bg-[#1d9bf0]/10 rounded-full">
                <Mic className="w-5 h-5" />
            </button>
        )}
      </div>

    </div>
  );
};

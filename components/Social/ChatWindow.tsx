
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Info, Image as ImageIcon, Mic, Plus, Send, Video, Phone } from 'lucide-react';
import { collection, addDoc, query, onSnapshot, serverTimestamp, db, limit } from '../../src/lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface Props {
  chatId: string;
  onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({ chatId, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    try {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Client-side sort by timestamp ASC
            msgs.sort((a: any, b: any) => {
                const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
                const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
                return tA - tB;
            });

            setMessages(msgs);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }, (error) => {
            console.error("Chat Listener Error:", error);
        });

        return () => unsubscribe();
    } catch (e) {
        console.error("Chat Setup Error:", e);
    }
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    
    try {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
            text: input,
            senderId: user.id,
            timestamp: serverTimestamp()
        });
        setInput('');
    } catch (e) {
        console.error("Failed to send", e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2f3336] sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -mr-2 hover:bg-[#18191c] rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 rtl:rotate-180 text-white" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-[#2f3336]">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${chatId}`} className="w-full h-full object-cover"/>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-[15px] text-[#e7e9ea]">المستخدم {chatId}</span>
                <span className="text-[11px] text-[#71767b]">متصل الآن</span>
             </div>
          </div>
        </div>
        <div className="flex gap-4 text-[#eff3f4]">
            <Phone className="w-5 h-5"/>
            <Video className="w-5 h-5"/>
            <Info className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* Date Separator */}
        <div className="text-center text-[13px] text-[#71767b] py-4 mb-2">اليوم</div>

        {messages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            const isLast = index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId;
            const isFirst = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
            
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'} mb-1`}
              >
                <div 
                  className={`max-w-[75%] px-4 py-3 text-[15px] relative group break-words leading-relaxed ${
                    isMe 
                      ? `bg-[#1d9bf0] text-white rounded-2xl rounded-tr-md ${isLast ? 'rounded-br-sm' : ''} ${isFirst ? 'rounded-tr-2xl' : ''}`
                      : `bg-[#2f3336] text-[#e7e9ea] rounded-2xl rounded-tl-md ${isLast ? 'rounded-bl-sm' : ''} ${isFirst ? 'rounded-tl-2xl' : ''}`
                  }`}
                  style={{
                      borderTopLeftRadius: !isMe ? (isFirst ? '20px' : '4px') : '20px',
                      borderBottomLeftRadius: !isMe ? (isLast ? '2px' : '4px') : '20px',
                      borderTopRightRadius: isMe ? (isFirst ? '20px' : '4px') : '20px',
                      borderBottomRightRadius: isMe ? (isLast ? '2px' : '4px') : '20px',
                  }}
                >
                  {msg.text}
                  
                  {/* Timestamp */}
                  <div className={`text-[10px] text-right mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                  </div>
                </div>
              </div>
            );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 3. Input Bar */}
      <div className="p-3 bg-black flex items-center gap-2">
        <button className="bg-[#1d9bf0] w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 hover:bg-[#1a8cd8] transition-colors">
            <Plus className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-[#202327] rounded-[20px] flex items-center px-4 py-1.5 border border-transparent focus-within:border-[#1d9bf0]/50 transition-all">
            <input 
              type="text" 
              placeholder="ابدأ رسالة..." 
              className="flex-1 bg-transparent text-white placeholder-[#71767b] outline-none text-[15px] dir-rtl py-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            
            <div className="flex items-center gap-3 mr-2 text-[#1d9bf0]">
                <ImageIcon className="w-5 h-5 cursor-pointer hover:opacity-80" />
                {!input.trim() && <Mic className="w-5 h-5 cursor-pointer hover:opacity-80" />}
            </div>
        </div>

        {input.trim() && (
            <button onClick={handleSend} className="text-[#1d9bf0] p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
                <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
        )}
      </div>

    </div>
  );
};

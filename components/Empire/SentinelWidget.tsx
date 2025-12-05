
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Headphones, ShieldCheck, Ticket, Paperclip, ChevronDown, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { SentinelBrain } from '../../services/Empire/SentinelBrain';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, SentinelState } from '../../types';

export const SentinelWidget: React.FC = () => {
    const { user, createSupportTicket, sendSystemNotification } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    
    // Core Conversation State
    const [currentState, setCurrentState] = useState<SentinelState>('IDLE');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init', role: 'bot', text: "مرحباً بك في مركز دعم ميلاف. أنا المساعد الذكي (Sentinel). كيف يمكنني خدمتك اليوم؟", timestamp: new Date().toISOString() }
    ]);
    
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userText = input;
        setInput('');
        
        // 1. Add User Message
        setMessages(prev => [...prev, { id: `u_${Date.now()}`, role: 'user', text: userText, timestamp: new Date().toISOString() }]);
        setIsTyping(true);

        // 2. Simulate AI Thinking (Network Latency)
        setTimeout(() => {
            // 3. Process via Sentinel Brain
            const result = SentinelBrain.processInput(userText, currentState);
            
            // 4. Update State & Messages
            setCurrentState(result.nextState);
            setIsTyping(false);
            
            setMessages(prev => [...prev, { 
                id: `b_${Date.now()}`, 
                role: 'bot', 
                text: result.response, 
                timestamp: new Date().toISOString() 
            }]);

            // 5. Handle Actions (Auto-Fix or Ticket)
            if (result.action === 'escalate_ticket' || result.nextState === 'ESCALATING') {
                if (user) {
                    const ticket = SentinelBrain.generateSmartTicket(user.id, messages.map(m => m.text), 'General');
                    createSupportTicket(ticket);
                    setTimeout(() => {
                        setMessages(prev => [...prev, { 
                            id: `sys_${Date.now()}`, 
                            role: 'system', 
                            text: `✅ تم فتح تذكرة ذكية برقم #${ticket.id}. التقرير: ${ticket.autoSummary}`, 
                            timestamp: new Date().toISOString(),
                            isTicket: true,
                            ticketId: ticket.id
                        }]);
                        setCurrentState('IDLE'); // Reset
                    }, 1000);
                } else {
                    setMessages(prev => [...prev, { id: `sys_${Date.now()}`, role: 'bot', text: "يرجى تسجيل الدخول لرفع التذكرة رسمياً.", timestamp: new Date().toISOString() }]);
                }
            }

        }, 1500); // 1.5s typing delay
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-[9999] w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-slate-900 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(30,58,138,0.5)] hover:scale-110 transition-transform border border-amber-500/30 group"
            >
                <ShieldCheck className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors"/>
                <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a] animate-pulse"></span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 left-6 z-[9999] transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px]'}`}>
            <div className="bg-[#0f172a] w-full h-full rounded-2xl shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden animate-fade-in-up font-sans text-right" dir="rtl">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-[#1e3a8a] p-4 flex justify-between items-center border-b border-white/10 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/50">
                                <Headphones className="w-5 h-5 text-amber-500"/>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">المساعد الذكي (Sentinel)</h3>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                <Activity className="w-3 h-3 text-emerald-400"/>
                                <span>{currentState === 'IDLE' ? 'جاهز للمساعدة' : 'يعالج الطلب...'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="text-gray-400 hover:text-white"><ChevronDown className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`}/></button>
                        <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b1120] scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'} gap-2`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-700' : 'bg-amber-900/50 border border-amber-500/30'}`}>
                                            {msg.role === 'user' ? <span className="text-xs text-white">أنا</span> : <ShieldCheck className="w-4 h-4 text-amber-500"/>}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                            msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : msg.role === 'system'
                                            ? 'bg-emerald-900/30 border border-emerald-500/30 text-emerald-100 w-full text-center'
                                            : 'bg-[#1e293b] text-gray-200 border border-white/5 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                            {msg.isTicket && (
                                                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-emerald-400 font-bold justify-center">
                                                    <Ticket className="w-3 h-3"/> مرجع: {msg.ticketId}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {msg.role !== 'system' && (
                                        <span className="text-[9px] text-gray-600 mt-1 mx-12">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    )}
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex items-end gap-2 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-amber-900/50 border border-amber-500/30 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-amber-500"/></div>
                                    <div className="bg-[#1e293b] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                        <span className="text-[10px] text-gray-400 ml-2">Sentinel يكتب</span>
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-[#1e293b] border-t border-white/10">
                            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-3 py-2 focus-within:border-amber-500/50 transition-colors">
                                <button className="text-gray-500 hover:text-white transition-colors" title="إرفاق ملف (محاكاة)">
                                    <Paperclip className="w-4 h-4"/>
                                </button>
                                <input 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="اشرح مشكلتك هنا..."
                                    className="flex-1 bg-transparent text-white text-xs outline-none placeholder-gray-600"
                                    disabled={isTyping}
                                />
                                <button 
                                    onClick={handleSend} 
                                    disabled={!input.trim() || isTyping}
                                    className={`p-2 rounded-lg transition-all ${input.trim() ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-white/5 text-gray-600'}`}
                                >
                                    <Send className="w-4 h-4 rtl:rotate-180"/>
                                </button>
                            </div>
                            <div className="text-[9px] text-gray-600 text-center mt-2 flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3 h-3"/> مدعوم بواسطة محرك الذكاء الاصطناعي الآمن
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

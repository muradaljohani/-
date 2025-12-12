
import React, { useState, useEffect, useRef } from 'react';
import { 
    Plus, MessageSquare, Menu, X, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { streamChatResponse } from '../services/geminiService';
import { Message, Role, Attachment, SearchSource } from '../types';
import { MessageItem } from './MessageItem';
import { ChatInput } from './ChatInput';
import { StarterPrompts } from './StarterPrompts';

interface Props {
    onBack: () => void;
}

export const SmartAssistantPage: React.FC<Props> = ({ onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load history from session/local storage later if needed. For now, empty or mock.
    // We could store previous chats in localStorage to persist sidebar history.

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (text: string, attachment?: Attachment) => {
        if (!text.trim() && !attachment) return;

        const userMsg: Message = { 
            id: Date.now().toString(), 
            role: Role.USER, 
            content: text, 
            attachment: attachment 
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        const botMsgId = (Date.now() + 1).toString();
        // Placeholder for streaming
        setMessages(prev => [...prev, { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true }]);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        let fullText = '';
        let currentSources: SearchSource[] = [];

        try {
            await streamChatResponse(
                [...messages, userMsg], // Pass full history
                userMsg.content,
                userMsg.attachment,
                (chunk) => {
                    fullText += chunk;
                    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
                },
                (sources) => {
                    currentSources = [...currentSources, ...sources];
                    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, sources: currentSources } : m));
                },
                abortControllerRef.current.signal,
                user
            );
        } catch (e) {
            if (abortControllerRef.current?.signal.aborted) return;
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: 'عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.' } : m));
        } finally {
            setIsTyping(false);
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
        }
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsTyping(false);
            // Remove the streaming flag from the last message
            setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === Role.MODEL && last.isStreaming) {
                    return prev.map(m => m.id === last.id ? { ...m, isStreaming: false } : m);
                }
                return prev;
            });
        }
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-white font-sans overflow-hidden" dir="rtl">
            
            {/* SIDEBAR (Desktop) */}
            <div className={`
                fixed md:relative z-40 w-72 h-full bg-[#0b1120] border-l border-white/5 flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 flex items-center justify-between">
                    <button 
                        onClick={() => { setMessages([]); setSidebarOpen(false); }}
                        className="flex-1 flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-sm font-bold border border-white/5 shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-4 h-4"/> محادثة جديدة
                    </button>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-gray-400"><X className="w-5 h-5"/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <div className="text-xs font-bold text-gray-500 px-3 py-2 uppercase tracking-widest">السجل (تجريبي)</div>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 truncate text-right group">
                        <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors"/>
                        بحث عن وظائف...
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 truncate text-right group">
                        <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors"/>
                        شرح الكود...
                    </button>
                </div>

                <div className="p-4 border-t border-white/5">
                    <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-gray-300 font-bold border border-transparent hover:border-white/5">
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180"/> العودة للرئيسية
                    </button>
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col relative bg-[#0f172a] h-full w-full">
                
                {/* Header (Mobile) */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-gray-400 hover:text-white"><Menu className="w-6 h-6"/></button>
                    <span className="font-bold text-sm text-gray-200">مساعد مراد الذكي</span>
                    <button onClick={() => setMessages([])} className="p-2 -ml-2 text-gray-400 hover:text-white"><Plus className="w-6 h-6"/></button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-full px-4 pb-20 pt-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/50 animate-fade-in-up">
                                <span className="text-4xl font-black text-white">M</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 text-center tracking-tight animate-fade-in-up delay-100">مساعد مراد الجهني الذكي</h1>
                            <p className="text-gray-400 text-lg mb-12 text-center max-w-lg font-light leading-relaxed animate-fade-in-up delay-200">
                                محرك بحث متطور، مساعد شخصي، وخبير تقني في منصة واحدة. كيف يمكنني مساعدتك اليوم؟
                            </p>
                            
                            <StarterPrompts onSelect={(prompt) => handleSend(prompt)} />
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
                            {messages.map((msg, idx) => (
                                <MessageItem key={idx} message={msg} />
                            ))}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <ChatInput 
                    onSend={handleSend} 
                    onStop={handleStop} 
                    isLoading={isTyping} 
                />

            </div>
        </div>
    );
};

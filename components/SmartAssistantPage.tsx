
import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, Bot, User, Sparkles, Image as ImageIcon, 
    Trash2, Plus, MessageSquare, Menu, X, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { streamChatResponse } from '../services/geminiService';
import { Message, Role, Attachment, SearchSource } from '../types';
import ReactMarkdown from 'react-markdown';
import { SourcesDisplay } from './SourcesDisplay';

interface Props {
    onBack: () => void;
}

export const SmartAssistantPage: React.FC<Props> = ({ onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [history, setHistory] = useState<{id: string, title: string}[]>([]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load History Mock
    useEffect(() => {
        setHistory([
            { id: '1', title: 'بحث عن وظائف' },
            { id: '2', title: 'كتابة مقال تقني' },
            { id: '3', title: 'تحليل بيانات السوق' }
        ]);
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                setAttachment({
                    type: 'image',
                    data: (ev.target?.result as string).split(',')[1],
                    mimeType: file.type,
                    url: ev.target?.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !attachment) return;

        const userMsg: Message = { 
            id: Date.now().toString(), 
            role: Role.USER, 
            content: input, 
            attachment: attachment || undefined 
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setAttachment(null);
        setIsTyping(true);

        const botMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true }]);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        let fullText = '';
        let currentSources: SearchSource[] = [];

        try {
            await streamChatResponse(
                messages,
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
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: 'عذراً، حدث خطأ. حاول مرة أخرى.' } : m));
        } finally {
            setIsTyping(false);
            setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
        }
    };

    return (
        <div className="flex h-screen bg-[#343541] text-white font-sans" dir="rtl">
            
            {/* SIDEBAR */}
            <div className={`
                fixed md:relative z-30 w-72 h-full bg-[#202123] flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                <div className="p-3">
                    <button 
                        onClick={() => { setMessages([]); setSidebarOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-white/20 hover:bg-[#2A2B32] transition-colors text-sm text-white"
                    >
                        <Plus className="w-4 h-4"/> محادثة جديدة
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">اليوم</div>
                    {history.map(h => (
                        <button key={h.id} className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm text-gray-100 truncate">
                            <MessageSquare className="w-4 h-4 text-gray-400"/>
                            {h.title}
                        </button>
                    ))}
                </div>

                <div className="p-3 border-t border-white/10">
                    <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm text-white">
                        <User className="w-4 h-4"/> {user ? user.name : 'زائر'}
                    </button>
                </div>
            </div>

            {/* MAIN CHAT */}
            <div className="flex-1 flex flex-col relative bg-[#343541]">
                
                {/* Header Mobile */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#343541]">
                    <button onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6 text-white"/></button>
                    <span className="font-bold text-sm">مساعد مراد الذكي</span>
                    <button onClick={() => setMessages([])}><Plus className="w-6 h-6 text-white"/></button>
                </div>

                {/* Model Selector (Desktop) */}
                <div className="hidden md:flex items-center justify-center p-4 border-b border-white/5 text-sm font-medium text-gray-300 gap-6">
                    <button className="flex items-center gap-2 hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4 text-emerald-400"/> مساعد مراد الذكي (v2.5)
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-80">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                                <Bot className="w-10 h-10 text-white"/>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">مساعد مراد الجهني الذكي</h2>
                            <p className="text-gray-400 mb-8">محرك بحث فوري وقدرات ذكاء اصطناعي متقدمة</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                                <button onClick={() => { setInput("من هو مراد الجهني؟"); }} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm border border-white/10 transition-colors">
                                    "من هو مراد الجهني؟" →
                                </button>
                                <button onClick={() => { setInput("ابحث عن آخر أخبار التقنية"); }} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm border border-white/10 transition-colors">
                                    "ابحث عن آخر أخبار التقنية" →
                                </button>
                                <button onClick={() => { setInput("اكتب كود بايثون لتحليل البيانات"); }} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm border border-white/10 transition-colors">
                                    "اكتب كود بايثون لتحليل البيانات" →
                                </button>
                                <button onClick={() => { setInput("لخص لي كتاب العادات الذرية"); }} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm border border-white/10 transition-colors">
                                    "لخص لي كتاب العادات الذرية" →
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col pb-32">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`w-full border-b border-black/10 dark:border-gray-900/50 ${msg.role === Role.MODEL ? 'bg-[#444654]' : ''}`}>
                                    <div className="max-w-3xl mx-auto flex gap-6 p-6">
                                        <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 overflow-hidden">
                                            {msg.role === Role.USER ? (
                                                <img src={user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover"/>
                                            ) : (
                                                <div className="bg-emerald-500 w-full h-full flex items-center justify-center"><Bot className="w-5 h-5 text-white"/></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-4">
                                            {msg.attachment && msg.attachment.type === 'image' && (
                                                <img src={msg.attachment.url} className="max-h-64 rounded-lg mb-4" alt="Attachment"/>
                                            )}
                                            <div className="prose prose-invert prose-sm md:prose-base max-w-none leading-7">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                {msg.isStreaming && <span className="inline-block w-2 h-5 bg-gray-400 animate-pulse align-middle ml-1"></span>}
                                            </div>
                                            {msg.sources && msg.sources.length > 0 && <SourcesDisplay sources={msg.sources} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-10 pb-6 px-4">
                    <div className="max-w-3xl mx-auto">
                        {attachment && (
                            <div className="flex items-center gap-2 mb-2 p-2 bg-[#40414f] rounded-lg w-fit">
                                <ImageIcon className="w-4 h-4 text-gray-400"/>
                                <span className="text-xs text-gray-300">صورة مرفقة</span>
                                <button onClick={() => setAttachment(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4"/></button>
                            </div>
                        )}
                        <div className="relative flex items-end gap-2 bg-[#40414f] rounded-xl shadow-lg border border-white/10 focus-within:border-white/20 transition-colors p-3">
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white transition-colors">
                                <Plus className="w-5 h-5"/>
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>
                            
                            <textarea 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="أرسل رسالة..."
                                className="flex-1 bg-transparent text-white outline-none resize-none max-h-48 py-2 scrollbar-hide"
                                rows={1}
                                style={{minHeight: '24px'}}
                            />
                            
                            <button 
                                onClick={handleSend}
                                disabled={(!input.trim() && !attachment) || isTyping}
                                className={`p-2 rounded-md transition-colors ${input.trim() || attachment ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'text-gray-500 bg-transparent cursor-not-allowed'}`}
                            >
                                <Send className="w-4 h-4 rtl:rotate-180"/>
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            مساعد مراد الجهني الذكي قد يرتكب أخطاء. يرجى التحقق من المعلومات المهمة.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

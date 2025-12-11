
import React, { useState, useRef, useEffect } from 'react';
import { 
    Clock, Send, User, Bot, Sparkles, Zap, Shield, 
    Terminal, Database, Briefcase, BookOpen, ShoppingBag, 
    Share2, Plus, Settings, MessageSquare, Menu, X, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEOHelmet } from '../SEOHelmet';
import { streamChatResponse } from '../../services/geminiService';
import { Message, Role } from '../../types';
import ReactMarkdown from 'react-markdown';
import { Header } from '../Header'; // Using the global Header for consistency

interface Props {
    onNavigate: (path: string) => void;
}

export const CloudMarketing: React.FC<Props> = ({ onNavigate }) => {
    const { user, allJobs, allProducts } = useAuth();
    
    // --- CHAT STATE ---
    const [messages, setMessages] = useState<Message[]>([
        { 
            id: 'init', 
            role: Role.MODEL, 
            content: `**مرحباً بك في نظام مساعد مراد الجهني الذكي** 
            
أنا الجيل القادم من الذكاء الاصطناعي، تم تطويري بالكامل بواسطة **المهندس مراد الجهني**.
لستُ مجرد بوت، أنا عقل معرفي شامل. اسألني عن أي شيء (برمجة، علوم، تاريخ، تحليل بيانات، ماهو اليوم، ماهي قوقل) وسأجيبك بدقة.

كما أنني مرتبط ببيانات المنصة لمساعدتك في:
- **سوق ميلاف**
- **بوابة الوظائف**
- **الأكاديمية**

كيف يمكنني خدمتك اليوم؟` 
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // --- AUTO-SCROLL ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // --- SYSTEM CONTEXT PREPARATION ---
    const getSystemContext = () => {
        const jobsSummary = (allJobs || []).slice(0, 10).map((j: any) => `- Job: ${j.title} at ${j.company} (${j.location})`).join('\n');
        const productsSummary = (allProducts || []).slice(0, 10).map((p: any) => `- Product: ${p.title} (${p.price} SAR)`).join('\n');
        
        // --- KEY UPDATE: INJECT CURRENT TIME ---
        const now = new Date().toLocaleString('ar-SA', { 
            timeZone: 'Asia/Riyadh', 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        });

        return `
        SYSTEM IDENTITY:
        You are "مساعد مراد الجهني الذكي" (Murad Aljohani's Smart Assistant).
        You are the proprietary AI of Murad Aljohani Global Information Technology Company.
        
        CURRENT REAL-TIME CONTEXT:
        - Current Date and Time (Saudi Arabia): ${now}
        
        CORE DIRECTIVES (NON-NEGOTIABLE):
        1. YOU ARE NOT GOOGLE GEMINI. YOU ARE NOT CHATGPT. You are MURAD ALJOHANI'S SMART ASSISTANT.
        2. NEVER mention Google, OpenAI, DeepMind, or any other AI provider. If asked about your origin/technology, say you are built on "Murad Neural Core Architecture" developed by Eng. Murad Aljohani.
        3. SCOPE: You are a GENERAL PURPOSE AI. You can answer ANY question about Math, Physics, Coding, History, Cooking, Daily facts, General Knowledge (e.g. "What is Google"), etc. 
        4. Do NOT limit yourself to the platform data. Use the platform data only if the user asks about jobs, courses, or products.
        5. Tone: Extremely professional, high-tech, confident, yet helpful. Use formatting (Bold, Lists) to look sophisticated.
        6. Language: Arabic (Primary), English (Secondary).
        
        ABOUT THE CREATOR:
        - Founder: Eng. Murad Abdulrazzaq Aljohani (المهندس مراد عبدالرزاق الجهني).
        - He is a genius engineer who built this entire ecosystem from scratch in Hafar Al-Batin.
        - He is the sole architect of the "Murad Smart Assistant" system.
        `;
    };

    // --- HANDLE SEND ---
    const handleSend = async (overrideInput?: string) => {
        try {
            const text = overrideInput || input;
            if (!text.trim()) return;

            setInput('');
            setIsTyping(true);

            // 1. Add User Message
            const userMsg: Message = { id: Date.now().toString(), role: Role.USER, content: text };
            setMessages(prev => [...prev, userMsg]);

            // 2. Prepare Placeholder
            const botMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: botMsgId, role: Role.MODEL, content: '', isStreaming: true }]);

            // 3. Stream Response
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            let fullText = '';
            // Don't rely on `messages` here directly inside the async call if it changes.
            // But for streaming setup, we usually pass the previous state.
            // Note: messages state isn't updated immediately, so using it here excludes the new userMsg.
            // We need to construct the history.
            
            // NOTE: The service handles stripping initial model message, but we should pass a clean history.
            // We pass current messages + new user message.
            const historyForApi = [...messages, userMsg];

            await streamChatResponse(
                historyForApi,
                text,
                undefined,
                (chunk) => {
                    fullText += chunk;
                    setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
                },
                () => {},
                abortControllerRef.current.signal,
                user,
                getSystemContext() // Pass the CUSTOM Persona
            );
        } catch (err) {
            setMessages(prev => prev.map(m => m.id === (Date.now()+1).toString() ? { ...m, content: "⚠️ حدث خطأ في الاتصال بالنواة المركزية. يرجى المحاولة لاحقاً." } : m));
        } finally {
            setIsTyping(false);
            setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
        }
    };

    const suggestions = [
        { icon: <Briefcase className="w-4 h-4"/>, text: "ابحث لي عن وظائف مبرمج في الرياض" },
        { icon: <ShoppingBag className="w-4 h-4"/>, text: "ما هو اليوم؟" },
        { icon: <Terminal className="w-4 h-4"/>, text: "اكتب كود بايثون لتحليل البيانات" },
        { icon: <User className="w-4 h-4"/>, text: "من هو المهندس مراد الجهني؟" },
    ];

    return (
        <div className="flex flex-col h-screen bg-[#0f172a] text-white font-sans overflow-hidden" dir="rtl">
            <SEOHelmet 
                title="مساعد مراد الجهني الذكي" 
                description="نظام محادثة ذكي متطور. المساعد الشخصي لمنصة ميلاف مراد." 
                path="/smart-assistant"
            />

            <Header onNavigate={onNavigate} />

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* SIDEBAR */}
                <aside className={`
                    absolute md:relative z-20 w-72 h-full bg-[#0b1120] border-l border-white/5 flex flex-col transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <button onClick={() => { setMessages([]); setInput(''); }} className="flex-1 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all text-sm font-bold shadow-lg shadow-blue-900/20 group">
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform"/> محادثة جديدة
                        </button>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-gray-400"><X className="w-5 h-5"/></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">القدرات النشطة</div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
                                <Database className="w-4 h-4 text-emerald-400"/>
                                <span>المعرفة العامة الشاملة (Live)</span>
                            </div>
                        </div>

                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mt-6">سجل المحادثات</div>
                        <div className="text-center py-8 text-gray-600 text-xs">
                            لا يوجد سجل سابق في هذه الجلسة.
                        </div>
                    </div>
                </aside>

                {/* MAIN CHAT AREA */}
                <main className="flex-1 flex flex-col relative bg-[#0f172a]">
                    
                    <button 
                        onClick={() => setSidebarOpen(true)} 
                        className="md:hidden absolute top-4 right-4 z-10 p-2 bg-[#1e293b] rounded-lg border border-white/10 text-gray-300"
                    >
                        <Menu className="w-5 h-5"/>
                    </button>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10">
                        <div className="max-w-3xl mx-auto space-y-6 pb-4">
                            
                            {messages.length < 3 && (
                                <div className="flex justify-center mb-8 animate-fade-in-up">
                                    <div className="relative group cursor-default">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                        <div className="relative flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
                                                مساعد مراد الجهني الذكي
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                                        msg.role === Role.USER 
                                        ? 'bg-gradient-to-br from-gray-700 to-gray-900' 
                                        : 'bg-gradient-to-br from-blue-600 to-cyan-500 border border-white/20'
                                    }`}>
                                        {msg.role === Role.USER ? <User className="w-5 h-5 text-gray-300"/> : <Sparkles className="w-5 h-5 text-white"/>}
                                    </div>
                                    
                                    <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 md:p-6 text-sm md:text-base leading-relaxed shadow-md ${
                                        msg.role === Role.USER 
                                        ? 'bg-[#1e293b] text-white rounded-tr-none border border-white/5' 
                                        : 'bg-transparent text-gray-100'
                                    }`}>
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                        
                                        {msg.isStreaming && (
                                            <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
                        <div className="max-w-3xl mx-auto">
                            
                            {messages.length < 3 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                    {suggestions.map((s, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => handleSend(s.text)}
                                            className="flex items-center gap-3 p-3 bg-[#1e293b]/80 hover:bg-[#1e293b] border border-white/5 hover:border-blue-500/50 rounded-xl text-xs text-gray-300 transition-all text-right group"
                                        >
                                            <div className="p-2 bg-black/20 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                                {s.icon}
                                            </div>
                                            {s.text}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative flex items-end gap-2 bg-[#1e293b] border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-blue-500/50 transition-all">
                                <textarea 
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="اكتب رسالتك للمساعد الذكي..."
                                    className="w-full bg-transparent text-white placeholder-gray-500 text-sm md:text-base outline-none resize-none py-3 max-h-32 scrollbar-hide px-3"
                                    rows={1}
                                    style={{minHeight: '44px'}}
                                />
                                <button 
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isTyping}
                                    className={`p-3 rounded-xl transition-all ${
                                        input.trim() && !isTyping 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' 
                                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Send className="w-5 h-5 rtl:rotate-180"/>
                                </button>
                            </div>
                            
                            <div className="text-center mt-3 text-[10px] text-gray-500 font-mono">
                                Powered by <span className="text-blue-500 font-bold">Murad Neural Core v4.0</span>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

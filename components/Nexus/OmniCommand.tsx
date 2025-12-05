
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, Briefcase, BookOpen, ShoppingBag, Bell, ChevronRight, Zap } from 'lucide-react';
import { NexusBrain, SearchResult } from '../../services/Nexus/NexusBrain';
import { useAuth } from '../../context/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (type: string, data: any) => void;
}

export const OmniCommand: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
    const { notifications, markNotificationRead } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [activeTab, setActiveTab] = useState<'search' | 'notifications'>('search');
    const inputRef = useRef<HTMLInputElement>(null);
    const brain = NexusBrain.getInstance();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            const res = await brain.globalQuery(query);
            setResults(res);
        };
        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-[#0f172a] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-fade-in-up">
                
                {/* Search Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                    <Command className="w-5 h-5 text-blue-500 animate-pulse"/>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActiveTab('search'); }}
                        placeholder="Nexus Omni-Search: ابحث عن وظائف، دورات، منتجات..." 
                        className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg font-bold"
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`relative p-2 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Bell className="w-5 h-5"/>
                            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#1e293b]/50 p-2">
                    
                    {activeTab === 'search' && (
                        <div className="space-y-2">
                            {results.length === 0 && query && (
                                <div className="text-center py-10 text-gray-500">لا توجد نتائج مطابقة في الشبكة الموحدة.</div>
                            )}
                            
                            {results.length === 0 && !query && (
                                <div className="text-center py-10 text-gray-600">
                                    <Zap className="w-10 h-10 mx-auto mb-2 opacity-20"/>
                                    <p className="text-sm">اكتب للبحث في جميع المنصات في وقت واحد</p>
                                </div>
                            )}

                            {results.map((res) => (
                                <div 
                                    key={res.id} 
                                    onClick={() => { onNavigate(res.type, res.actionData); onClose(); }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent cursor-pointer group transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                        res.type === 'Job' ? 'bg-blue-500/20 text-blue-400' :
                                        res.type === 'Course' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                        {res.type === 'Job' && <Briefcase className="w-5 h-5"/>}
                                        {res.type === 'Course' && <BookOpen className="w-5 h-5"/>}
                                        {(res.type === 'Market' || res.type === 'Service') && <ShoppingBag className="w-5 h-5"/>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h4 className="text-white font-bold text-sm truncate group-hover:text-blue-300 transition-colors">{res.title}</h4>
                                            <span className="text-[10px] text-gray-500 bg-black/20 px-2 rounded uppercase">{res.type}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{res.subtitle}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white rtl:rotate-180"/>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-2 pb-2 border-b border-white/5">
                                <span className="text-xs font-bold text-gray-400">التنبيهات الذكية</span>
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 rounded-full">{unreadCount} جديد</span>
                            </div>
                            {notifications.length === 0 && <div className="text-center py-8 text-gray-500 text-xs">لا توجد تنبيهات جديدة</div>}
                            {notifications.map(n => (
                                <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-3 rounded-xl border transition-all cursor-pointer ${n.isRead ? 'bg-transparent border-transparent opacity-60' : 'bg-blue-900/10 border-blue-500/20'}`}>
                                    <div className="flex gap-3">
                                        <div className="mt-1"><Bell className="w-4 h-4 text-amber-500"/></div>
                                        <div>
                                            <h4 className="text-white text-xs font-bold">{n.title}</h4>
                                            <p className="text-gray-400 text-[10px] mt-1 leading-relaxed">{n.message}</p>
                                            <span className="text-[9px] text-gray-600 mt-2 block">{new Date(n.date).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="p-3 bg-black/40 text-[10px] text-gray-500 flex justify-between border-t border-white/5">
                    <span>Pro Tip: Use arrow keys to navigate</span>
                    <span>Murad Nexus v1.0</span>
                </div>
            </div>
        </div>
    );
};

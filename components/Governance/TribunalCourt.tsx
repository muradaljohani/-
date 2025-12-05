
import React, { useState, useEffect } from 'react';
import { GovernanceCore } from '../../services/Governance/GovernanceCore';
import { useAuth } from '../../context/AuthContext';
import { TribunalCase } from '../../types';
import { Gavel, X, AlertTriangle, CheckCircle2, User, FileText, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

interface Props {
    onClose: () => void;
}

export const TribunalCourt: React.FC<Props> = ({ onClose }) => {
    const { user, updateProfile } = useAuth();
    const [cases, setCases] = useState<TribunalCase[]>([]);
    const [activeCase, setActiveCase] = useState<TribunalCase | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const engine = GovernanceCore.getInstance();

    useEffect(() => {
        setCases(engine.getOpenCases());
    }, []);

    // Security Check
    if (!user || (user.karma || 500) < 500) { // Should be 800+ ideally, 500 for testing
        return (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-center">
                <div className="bg-[#0f172a] p-8 rounded-2xl border border-red-500/30 max-w-md">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                    <h2 className="text-xl font-bold text-white mb-2">وصول مقيد</h2>
                    <p className="text-gray-400 text-sm mb-6">محكمة المجتمع (Tribunal) متاحة فقط للمواطنين النخبة (Elite Citizens) الذين لديهم نقاط كارما عالية.</p>
                    <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">إغلاق</button>
                </div>
            </div>
        );
    }

    const handleVote = (verdict: 'Guilty' | 'Innocent') => {
        if (!activeCase) return;
        setIsVoting(true);
        
        setTimeout(() => {
            const success = engine.submitVote(activeCase.id, user.id, verdict);
            if (success) {
                // Reward Juror
                const newKarma = (user.karma || 500) + 10;
                updateProfile({ karma: newKarma });
                alert("تم تسجيل صوتك بنجاح! +10 نقاط كارما.");
                
                // Refresh
                const remaining = cases.filter(c => c.id !== activeCase.id);
                setCases(remaining);
                setActiveCase(null);
            } else {
                alert("لقد قمت بالتصويت مسبقاً أو أغلقت القضية.");
            }
            setIsVoting(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-5xl h-[85vh] bg-[#0f172a] border border-amber-500/20 rounded-3xl shadow-2xl flex overflow-hidden">
                
                {/* Sidebar: Case List */}
                <div className="w-80 bg-[#0b1120] border-l border-white/10 flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Gavel className="w-6 h-6 text-amber-500"/> محكمة المجتمع
                        </h2>
                        <p className="text-xs text-gray-400 mt-2">ساهم في تحقيق العدالة واربح المكافآت.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cases.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 text-sm">لا توجد قضايا مفتوحة حالياً.</div>
                        ) : (
                            cases.map(c => (
                                <div 
                                    key={c.id} 
                                    onClick={() => setActiveCase(c)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${activeCase?.id === c.id ? 'bg-amber-600/20 border-amber-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-gray-400">#{c.id}</span>
                                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 rounded-full">نزاع</span>
                                    </div>
                                    <h4 className="text-white font-bold text-sm line-clamp-1">{c.description}</h4>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-white/10">
                        <button onClick={onClose} className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-sm">
                            مغادرة المحكمة
                        </button>
                    </div>
                </div>

                {/* Main: Case Details */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative">
                    <button onClick={onClose} className="absolute top-4 left-4 md:hidden p-2 text-gray-400"><X/></button>
                    
                    {activeCase ? (
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-3xl mx-auto space-y-8">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-1 rounded-full text-xs font-bold mb-4 border border-amber-500/20">
                                        <ScaleIcon className="w-4 h-4"/> جلسة استماع سرية
                                    </div>
                                    <h2 className="text-2xl font-black text-white leading-relaxed">
                                        "{activeCase.description}"
                                    </h2>
                                </div>

                                {/* Evidence Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><User className="w-4 h-4"/> المدعي (المشتري)</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                            "طلبت المنتج ووصلني تالف. البائع يرفض التجاوب ويقول أن الضرر سوء استخدام. أطالب باسترداد المبلغ."
                                        </p>
                                        <div className="flex gap-2">
                                            {activeCase.evidence.map((img, i) => (
                                                <img key={i} src={img} className="w-20 h-20 rounded-lg object-cover border border-white/10 cursor-pointer hover:scale-105 transition-transform"/>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                        <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><User className="w-4 h-4"/> المدعى عليه (البائع)</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            "المنتج خرج من عندي سليم ومغلف بشكل ممتاز. الضرر واضح أنه ناتج عن سقوط قوي بعد الاستلام. لا أتحمل المسؤولية."
                                        </p>
                                    </div>
                                </div>

                                {/* Voting Box */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center mt-8">
                                    <h3 className="text-xl font-bold text-white mb-2">قرار هيئة المحلفين</h3>
                                    <p className="text-gray-400 text-sm mb-8">بناءً على الأدلة والوصف، ما هو حكمك العادل؟</p>
                                    
                                    {isVoting ? (
                                        <div className="flex justify-center py-4"><Loader2 className="w-8 h-8 text-amber-500 animate-spin"/></div>
                                    ) : (
                                        <div className="flex justify-center gap-6">
                                            <button onClick={() => handleVote('Guilty')} className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-red-500/10 hover:bg-red-600 border border-red-500/30 transition-all w-40">
                                                <ThumbsDown className="w-8 h-8 text-red-500 group-hover:text-white"/>
                                                <span className="text-red-400 font-bold group-hover:text-white">إدانة البائع</span>
                                            </button>
                                            
                                            <button onClick={() => handleVote('Innocent')} className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 transition-all w-40">
                                                <ThumbsUp className="w-8 h-8 text-emerald-500 group-hover:text-white"/>
                                                <span className="text-emerald-400 font-bold group-hover:text-white">براءة البائع</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Gavel className="w-20 h-20 mb-4 opacity-20"/>
                            <p>اختر قضية من القائمة للبدء</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const ScaleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
);

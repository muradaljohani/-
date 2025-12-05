
import React, { useState } from 'react';
import { Search, Lock, User, Briefcase, DollarSign, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CorporateEngine } from '../../services/Enterprise/CorporateEngine';
import { PaymentGateway } from '../PaymentGateway';

export const HeadHunterScout: React.FC = () => {
    const { storedUsers } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(CorporateEngine.getInstance().searchCandidates('', storedUsers));
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [targetCandidate, setTargetCandidate] = useState<string | null>(null);

    const handleSearch = () => {
        setResults(CorporateEngine.getInstance().searchCandidates(query, storedUsers));
    };

    const unlockCandidate = (id: string) => {
        setTargetCandidate(id);
        setPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        setPaymentOpen(false);
        setResults(prev => prev.map(c => c.id === targetCandidate ? { ...c, contactUnlocked: true } : c));
        alert("تم كشف بيانات المرشح بنجاح!");
    };

    return (
        <div className="bg-[#0f172a] min-h-screen text-right font-sans p-6" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-r from-purple-900 to-[#1e293b] rounded-3xl p-8 mb-8 border border-white/10">
                    <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-purple-400"/> كشافة المواهب (HeadHunter)
                    </h1>
                    <p className="text-purple-200 mb-6">ابحث في قاعدة بيانات المرشحين وتواصل مع الأفضل.</p>
                    
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="ابحث بالمهارة، المسمى الوظيفي، أو الاسم..."
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 pr-12 text-white outline-none focus:border-purple-500"
                            />
                            <Search className="absolute right-4 top-4 text-gray-400"/>
                        </div>
                        <button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold">
                            بحث
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map(cand => (
                        <div key={cand.id} className="bg-[#1e293b] border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <div className={`w-16 h-16 rounded-full overflow-hidden ${!cand.contactUnlocked ? 'blur-sm grayscale' : ''}`}>
                                        <img src={cand.avatar} className="w-full h-full object-cover"/>
                                    </div>
                                    {!cand.contactUnlocked && <Lock className="w-6 h-6 text-white absolute inset-0 m-auto drop-shadow-md"/>}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{cand.contactUnlocked ? cand.name : 'مرشح محتمل'}</h3>
                                    <p className="text-purple-400 text-sm">{cand.jobTitle}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>الخبرة:</span>
                                    <span className="text-white">{cand.experienceYears} سنوات</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {cand.skills.map(s => (
                                        <span key={s} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {cand.contactUnlocked ? (
                                <button className="w-full py-3 bg-white/10 text-white rounded-xl font-bold cursor-default">
                                    بيانات الاتصال مكشوفة
                                </button>
                            ) : (
                                <button onClick={() => unlockCandidate(cand.id)} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Eye className="w-4 h-4"/> كشف البيانات (50 ريال)
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <PaymentGateway 
                isOpen={paymentOpen} 
                onClose={() => setPaymentOpen(false)} 
                amount={50} 
                title="كشف بيانات مرشح" 
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

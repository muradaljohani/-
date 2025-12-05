
import React from 'react';
import { X, Users, DollarSign, TrendingUp, Copy, Check, Gift } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ViralEngine } from '../../services/Expansion/ViralEngine';

interface Props {
    onClose: () => void;
}

export const ReferralDashboard: React.FC<Props> = ({ onClose }) => {
    const { user } = useAuth();
    const stats = user?.viralStats || { totalClicks: 0, totalSignups: 0, totalEarnings: 0, affiliateCode: user?.name.replace(/\s/g,'') || 'guest' };
    const [copied, setCopied] = React.useState(false);

    const refLink = ViralEngine.getInstance().generateRefLink(stats.affiliateCode);

    const handleCopy = () => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-2xl bg-[#0f172a] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-900/40 to-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <Gift className="w-6 h-6 text-amber-500"/>
                            لوحة الشريك (Affiliate)
                        </h2>
                        <p className="text-sm text-amber-200/80 mt-1">اربح المال والنقاط بمجرد دعوة أصدقائك</p>
                    </div>
                    <button onClick={onClose} className="relative z-10 text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6"/></button>
                </div>

                <div className="p-8">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 text-center">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-400">
                                <Users className="w-5 h-5"/>
                            </div>
                            <div className="text-2xl font-black text-white">{stats.totalClicks}</div>
                            <div className="text-xs text-gray-400">عدد الزيارات</div>
                        </div>
                        <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 text-center">
                            <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-400">
                                <DollarSign className="w-5 h-5"/>
                            </div>
                            <div className="text-2xl font-black text-white">{stats.totalEarnings}</div>
                            <div className="text-xs text-gray-400">الأرباح (ريال)</div>
                        </div>
                        <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 text-center">
                            <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-400">
                                <TrendingUp className="w-5 h-5"/>
                            </div>
                            <div className="text-2xl font-black text-white">{stats.totalSignups}</div>
                            <div className="text-xs text-gray-400">المسجلين</div>
                        </div>
                    </div>

                    {/* Link Section */}
                    <div className="bg-black/30 rounded-2xl p-6 border border-amber-500/20 mb-8 text-center">
                        <h3 className="text-white font-bold mb-4">رابط الإحالة الخاص بك</h3>
                        <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-xl border border-white/10">
                            <input 
                                type="text" 
                                readOnly 
                                value={refLink} 
                                className="bg-transparent text-gray-300 text-sm flex-1 outline-none font-mono text-center"
                            />
                            <button 
                                onClick={handleCopy}
                                className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                            >
                                {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            أي شخص يسجل أو يشتري عبر هذا الرابط، ستحصل أنت على عمولة فورية.
                        </p>
                    </div>

                    {/* Progress to Next Reward */}
                    <div>
                        <div className="flex justify-between text-xs text-white mb-2">
                            <span>الهدف التالي: دورة مجانية</span>
                            <span>{stats.totalSignups} / 5 دعوات</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, (stats.totalSignups / 5) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

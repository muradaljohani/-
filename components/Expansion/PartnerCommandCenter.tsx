import React, { useState, useEffect } from 'react';
import { X, Users, DollarSign, TrendingUp, Copy, Check, Gift, Wallet, CreditCard, LayoutDashboard, Share2, ArrowUpRight, ArrowDownLeft, BarChart2, PieChart, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ViralEngine } from '../../services/Expansion/ViralEngine';
import { PayoutManager } from './PayoutManager';
import { AssetLibrary } from './AssetLibrary';

interface Props {
    onClose: () => void;
}

export const PartnerCommandCenter: React.FC<Props> = ({ onClose }) => {
    const { user } = useAuth();
    const stats = user?.viralStats || { totalClicks: 0, totalSignups: 0, totalEarnings: 0, pendingPayout: 0, affiliateCode: user?.name.replace(/\s/g,'') || 'guest', campaigns: [] };
    const [activeTab, setActiveTab] = useState<'dashboard' | 'payouts' | 'assets'>('dashboard');
    const [copied, setCopied] = useState(false);
    const engine = ViralEngine.getInstance();
    const refLink = engine.generateRefLink(stats.affiliateCode);
    const chartData = engine.getChartData('weekly');

    const handleCopy = () => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate conversion rate
    const conversionRate = stats.totalClicks > 0 ? ((stats.totalSignups / stats.totalClicks) * 100).toFixed(1) : '0.0';

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-[#0f172a] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-500/20">
                
                {/* Header */}
                <div className="bg-[#1e293b] p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-900/40">
                            <Gift className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">مركز قيادة الشركاء</h2>
                            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Partner Command Center v2.0</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6"/></button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-[#0b1120] border-l border-white/10 flex flex-col p-4 hidden md:flex">
                        <div className="space-y-2">
                            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <LayoutDashboard className="w-5 h-5"/> لوحة المعلومات
                            </button>
                            <button onClick={() => setActiveTab('payouts')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'payouts' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <Wallet className="w-5 h-5"/> سحب الأرباح
                            </button>
                            <button onClick={() => setActiveTab('assets')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'assets' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <Share2 className="w-5 h-5"/> أدوات التسويق
                            </button>
                        </div>
                        
                        <div className="mt-auto bg-white/5 rounded-xl p-4 border border-white/5">
                            <p className="text-xs text-gray-400 mb-2">رصيدك الحالي</p>
                            <h3 className="text-2xl font-black text-emerald-400">{stats.pendingPayout} <span className="text-sm font-normal text-gray-500">ر.س</span></h3>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0f172a]">
                        
                        {/* Mobile Tabs */}
                        <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-2">
                            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-amber-600 text-white' : 'bg-white/10 text-gray-400'}`}>لوحة المعلومات</button>
                            <button onClick={() => setActiveTab('payouts')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${activeTab === 'payouts' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}>الأرباح</button>
                            <button onClick={() => setActiveTab('assets')} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${activeTab === 'assets' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}>أدوات التسويق</button>
                        </div>

                        {activeTab === 'dashboard' && (
                            <div className="space-y-8 animate-fade-in-up">
                                {/* Top Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-[#1e293b] p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-16 h-16 text-blue-500"/></div>
                                        <div className="relative z-10">
                                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">إجمالي الزيارات</div>
                                            <div className="text-3xl font-black text-white">{stats.totalClicks}</div>
                                            <div className="text-xs text-blue-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> نشط جداً</div>
                                        </div>
                                    </div>
                                    <div className="bg-[#1e293b] p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-16 h-16 text-emerald-500"/></div>
                                        <div className="relative z-10">
                                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">معدل التحويل</div>
                                            <div className="text-3xl font-black text-white">{conversionRate}%</div>
                                            <div className="text-xs text-emerald-400 mt-1">{stats.totalSignups} مسجل</div>
                                        </div>
                                    </div>
                                    <div className="bg-[#1e293b] p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-16 h-16 text-amber-500"/></div>
                                        <div className="relative z-10">
                                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">إجمالي الأرباح</div>
                                            <div className="text-3xl font-black text-white">{stats.totalEarnings} <span className="text-sm font-normal">ر.س</span></div>
                                            <div className="text-xs text-amber-400 mt-1">تراكمي</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Magic Link Box */}
                                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white p-2 rounded-xl">
                                        {/* Simplified QR Code placeholder - using icon for zero-dep */}
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(refLink)}`} alt="QR" className="w-24 h-24" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h3 className="text-white font-bold text-lg mb-2">الرابط السحري الخاص بك (Magic Link)</h3>
                                        <p className="text-sm text-gray-400 mb-4">أي شخص يسجل أو يشتري عبر هذا الرابط، يتم احتساب عمولتك تلقائياً.</p>
                                        
                                        <div className="flex items-center gap-2 bg-[#0f172a] p-2 rounded-xl border border-blue-500/30">
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={refLink} 
                                                className="bg-transparent text-blue-300 text-sm flex-1 outline-none font-mono px-2"
                                            />
                                            <button 
                                                onClick={handleCopy}
                                                className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                                            >
                                                {copied ? 'تم النسخ' : 'نسخ الرابط'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Area (CSS Only) */}
                                <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                        <BarChart2 className="w-5 h-5 text-gray-400"/> أداء الأسبوع الحالي
                                    </h3>
                                    
                                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                                        {chartData.map((data, i) => (
                                            <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    {data.clicks} Clicks / {data.sales} Sales
                                                </div>
                                                
                                                <div className="w-full bg-blue-500/20 rounded-t-sm relative hover:bg-blue-500/30 transition-colors" style={{ height: `${Math.min(100, data.clicks)}%` }}>
                                                    <div className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t-sm opacity-80" style={{ height: `${Math.min(100, (data.sales / (data.clicks || 1)) * 300)}%` }}></div>
                                                </div>
                                                <div className="text-[10px] text-gray-500 text-center mt-2 font-mono uppercase">{data.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center gap-6 mt-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 bg-blue-500/20 rounded-sm"></div> الزيارات (Clicks)</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> المبيعات (Sales)</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payouts' && <PayoutManager stats={stats} />}
                        {activeTab === 'assets' && <AssetLibrary refLink={refLink} />}

                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { X, Activity, Globe, Zap, Database, RotateCcw, Play, Pause, Save, Cpu, Server, Wifi, ShieldAlert, DollarSign, MapPin, Layers, LayoutDashboard } from 'lucide-react';
import { ApexEngine, Snapshot, AutomationRule } from '../../services/Apex/ApexEngine';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ApexDashboard: React.FC<Props> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'war_room' | 'automator' | 'time_machine' | 'global'>('war_room');
    
    // Live Data Simulation
    const [metrics, setMetrics] = useState({
        revenue: 5420,
        pending: 12,
        cpu: 45,
        latency: 24,
        errors: 0.02
    });

    const [liveLog, setLiveLog] = useState<string[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        
        const interval = setInterval(() => {
            // Simulate Metric Flux
            setMetrics(prev => ({
                revenue: prev.revenue + (Math.random() > 0.8 ? 150 : 0),
                pending: Math.max(0, prev.pending + (Math.random() > 0.5 ? 1 : -1)),
                cpu: Math.min(100, Math.max(10, prev.cpu + Math.floor(Math.random() * 10) - 5)),
                latency: Math.max(10, prev.latency + Math.floor(Math.random() * 5) - 2),
                errors: Math.max(0, 0.02 + (Math.random() * 0.01))
            }));

            // Simulate Live Geo-Log (Arabic Cities)
            if (Math.random() > 0.7) {
                const cities = ['الرياض', 'جدة', 'ينبع', 'الدمام', 'مكة', 'لندن', 'دبي'];
                const actions = ['اشترى دورة', 'نشر وظيفة', 'أضاف سيارة', 'وثق الهوية'];
                const city = cities[Math.floor(Math.random() * cities.length)];
                const action = actions[Math.floor(Math.random() * actions.length)];
                setLiveLog(prev => [`مستخدم في ${city} ${action}...`, ...prev].slice(0, 8));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    // --- TAB: WAR ROOM ---
    const WarRoom = () => (
        <div className="space-y-6 h-full flex flex-col">
            {/* Ticker */}
            <div className="bg-black/40 border border-emerald-500/30 p-4 rounded-xl flex justify-between items-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="flex items-center gap-4">
                    <div className="text-emerald-400 font-mono text-xl font-bold flex items-center gap-2">
                        <DollarSign className="w-5 h-5"/> {metrics.revenue.toLocaleString()} ر.س
                    </div>
                    <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest">الإيراد اليومي</span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex items-center gap-4">
                    <div className="text-amber-400 font-mono text-xl font-bold">
                        {metrics.pending}
                    </div>
                    <span className="text-xs text-amber-600 font-bold uppercase tracking-widest">عمليات معلقة</span>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="text-xs text-gray-400 font-mono animate-pulse">
                    حالة السوق: مفتوح
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                
                {/* Geo-Map Visualization */}
                <div className="lg:col-span-2 bg-[#0b1120] border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-contain bg-no-repeat bg-center opacity-20 filter invert"></div>
                    <h3 className="relative z-10 text-blue-400 font-bold flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5"/> النشاط العالمي المباشر
                    </h3>
                    
                    {/* Simulated Map Ping Points */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="absolute top-[40%] left-[55%] w-2 h-2 bg-emerald-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute top-[45%] left-[48%] w-2 h-2 bg-amber-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>

                    <div className="relative z-10 space-y-2 mt-auto">
                        {liveLog.map((log, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-mono text-blue-200 bg-black/40 p-2 rounded w-fit border-l-2 border-blue-500 animate-fade-in-up">
                                <MapPin className="w-3 h-3 text-blue-500"/> {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Server Heartbeat */}
                <div className="space-y-4 flex flex-col">
                    <div className="bg-[#0b1120] border border-red-500/20 rounded-2xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                        <Cpu className="w-8 h-8 text-red-500 mb-2"/>
                        <div className="text-4xl font-black text-white mb-1">{metrics.cpu}%</div>
                        <div className="text-xs text-red-400 font-bold uppercase tracking-widest">ضغط المعالج</div>
                        
                        <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-500" style={{width: `${metrics.cpu}%`}}></div>
                        </div>
                    </div>

                    <div className="bg-[#0b1120] border border-purple-500/20 rounded-2xl p-6 flex-1 flex flex-col items-center justify-center">
                        <Wifi className="w-8 h-8 text-purple-500 mb-2"/>
                        <div className="text-4xl font-black text-white mb-1">{metrics.latency}ms</div>
                        <div className="text-xs text-purple-400 font-bold uppercase tracking-widest">زمن الاستجابة</div>
                    </div>

                    <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                        <div className="text-xs text-gray-400 font-bold">معدل الأخطاء</div>
                        <div className="text-sm font-mono text-green-400">{metrics.errors.toFixed(2)}%</div>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- TAB: PUPPET MASTER ---
    const AutomatorView = () => {
        const rules = ApexEngine.Automator.getRules();
        const [showAdd, setShowAdd] = useState(false);

        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">المحرك الآلي (Puppet Master)</h2>
                        <p className="text-xs text-gray-400">محرك المنطق بدون أكواد (No-Code)</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Play className="w-3 h-3"/> قاعدة جديدة
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2">
                    {rules.map((rule) => (
                        <div key={rule.id} className={`bg-[#0b1120] border rounded-xl p-4 flex items-center justify-between transition-all ${rule.active ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5 opacity-60'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${rule.active ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                                    <Zap className="w-6 h-6"/>
                                </div>
                                <div className="font-mono text-sm" dir="ltr">
                                    <div className="text-gray-400 text-xs mb-1">IF</div>
                                    <div className="text-white font-bold">{rule.trigger} {rule.threshold !== undefined ? `> ${rule.threshold}` : ''}</div>
                                    <div className="text-gray-400 text-xs my-1">THEN</div>
                                    <div className={`font-bold ${rule.active ? 'text-emerald-400' : 'text-gray-500'}`}>{rule.action}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold uppercase ${rule.active ? 'text-green-500' : 'text-red-500'}`}>
                                    {rule.active ? 'نشط' : 'متوقف'}
                                </span>
                                <button 
                                    onClick={() => ApexEngine.Automator.toggleRule(rule.id)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${rule.active ? 'bg-blue-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${rule.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --- TAB: TIME CAPSULE ---
    const TimeMachineView = () => {
        const snapshots = ApexEngine.TimeMachine.getSnapshots();
        
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">آلة الزمن (Time Capsule)</h2>
                        <p className="text-xs text-gray-400">النسخ الاحتياطي واستعادة الكوارث</p>
                    </div>
                    <button onClick={() => ApexEngine.TimeMachine.createSnapshot('MANUAL')} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Save className="w-3 h-3"/> إنشاء نقطة استعادة
                    </button>
                </div>

                <div className="relative border-r border-white/10 mr-4 space-y-8 py-4 pr-8">
                    {snapshots.map((snap, i) => (
                        <div key={snap.id} className="relative pr-8 group">
                            <div className={`absolute -right-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 ${i === 0 ? 'bg-green-500 border-green-500' : 'bg-[#0f172a] border-gray-600'}`}></div>
                            <div className="bg-[#0b1120] border border-white/5 p-4 rounded-xl hover:border-blue-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-white font-bold font-mono text-sm">{snap.type}</div>
                                        <div className="text-[10px] text-gray-500">{new Date(snap.timestamp).toLocaleString('ar-SA')}</div>
                                    </div>
                                    <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 font-mono">{snap.id.split('_')[1]}</div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <button onClick={() => ApexEngine.TimeMachine.restore(snap.id)} className="bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2 transition-colors border border-white/5 hover:border-red-500/30">
                                        <RotateCcw className="w-3 h-3"/> استعادة النظام
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 font-sans animate-in fade-in duration-300 text-right" dir="rtl">
            <div className="w-full h-full max-w-7xl bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl flex overflow-hidden relative">
                
                {/* Decorative Grid Background */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                
                {/* Sidebar */}
                <div className="w-20 md:w-64 bg-[#0b1120] border-l border-white/5 flex flex-col py-6 relative z-10">
                    <div className="px-6 mb-10 flex items-center gap-3 text-blue-500">
                        <ShieldAlert className="w-8 h-8"/>
                        <span className="text-xl font-black tracking-widest hidden md:block">APEX</span>
                    </div>
                    
                    <div className="flex-1 space-y-2 px-3">
                        <button onClick={() => setActiveTab('war_room')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab==='war_room' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
                            <Activity className="w-5 h-5"/> <span className="hidden md:block font-bold text-sm">غرفة العمليات</span>
                        </button>
                        <button onClick={() => setActiveTab('automator')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab==='automator' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
                            <Zap className="w-5 h-5"/> <span className="hidden md:block font-bold text-sm">المحرك الآلي</span>
                        </button>
                        <button onClick={() => setActiveTab('time_machine')} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab==='time_machine' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
                            <Database className="w-5 h-5"/> <span className="hidden md:block font-bold text-sm">آلة الزمن</span>
                        </button>
                    </div>

                    <div className="px-6">
                        <div className="text-[10px] text-gray-600 font-mono text-center md:text-right">v4.0.0 ARABIC</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col relative z-10">
                    <div className="h-16 border-b border-white/5 flex justify-between items-center px-8 bg-[#0f172a]/50 backdrop-blur-md">
                        <div className="text-gray-400 text-sm font-mono uppercase tracking-widest">حالة النظام: <span className="text-emerald-500">مستقر</span></div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-[#0f172a] to-[#0b1120]">
                        {activeTab === 'war_room' && <WarRoom />}
                        {activeTab === 'automator' && <AutomatorView />}
                        {activeTab === 'time_machine' && <TimeMachineView />}
                    </div>
                </div>

            </div>
        </div>
    );
};

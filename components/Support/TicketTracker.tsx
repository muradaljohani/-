
import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, XCircle, RefreshCw, FileText, User, ArrowRight } from 'lucide-react';

export const TicketTracker: React.FC = () => {
    const [ticketId, setTicketId] = useState('');
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('my_support_tickets') || '[]');
        setHistory(saved);
    }, []);

    const handleCheck = (idToCheck: string = ticketId) => {
        if (!idToCheck) return;
        setLoading(true);
        setStatus(null);
        
        // Simulate API Call
        setTimeout(() => {
            // Mock Response Logic
            const mockStatus = {
                id: idToCheck,
                status: 'In Progress', // Open, In Progress, Closed
                agent: 'الدعم الفني المتقدم (Tier 2)',
                lastUpdate: new Date().toISOString(),
                priority: 'High',
                category: 'مشكلة تقنية',
                eta: '4 ساعات',
                logs: [
                    { msg: 'تم استلام الطلب بنجاح', time: '10:00 AM', done: true },
                    { msg: 'جاري التحليل الآلي للمشكلة', time: '10:05 AM', done: true },
                    { msg: 'تم تعيين موظف مختص', time: '10:30 AM', done: true },
                    { msg: 'جاري العمل على الحل...', time: 'الآن', done: false }
                ]
            };
            setStatus(mockStatus);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Search className="w-6 h-6"/></div>
                <div>
                    <h2 className="text-2xl font-bold text-[#0f172a]">متابعة حالة الطلب</h2>
                    <p className="text-sm text-slate-500">أدخل رقم التذكرة لمعرفة آخر المستجدات</p>
                </div>
            </div>
            
            <div className="flex gap-4 mb-8">
                <input 
                    value={ticketId}
                    onChange={e => setTicketId(e.target.value.toUpperCase())}
                    placeholder="TKT-2025-XXXXXX"
                    className="flex-1 p-4 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-mono text-center uppercase tracking-widest text-lg transition-all"
                />
                <button onClick={() => handleCheck()} disabled={loading || !ticketId} className="bg-[#0f172a] hover:bg-slate-800 text-white px-8 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Search className="w-5 h-5"/>}
                    فحص
                </button>
            </div>

            {status && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6 relative overflow-hidden">
                        {/* Status Stripe */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-black text-xl text-slate-800 tracking-wider">{status.id}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                                        {status.status === 'Open' ? 'مفتوحة' : status.status === 'In Progress' ? 'قيد المعالجة' : 'مغلقة'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">آخر تحديث: {new Date(status.lastUpdate).toLocaleString()}</p>
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-slate-400 uppercase font-bold">الموظف المسؤول</div>
                                <div className="font-bold text-slate-700 flex items-center gap-2 justify-end">
                                    {status.agent} <User className="w-4 h-4 bg-slate-200 rounded-full p-0.5"/>
                                </div>
                            </div>
                        </div>

                        {/* Visual Timeline */}
                        <div className="relative py-4">
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            <div className="space-y-6">
                                {status.logs.map((log: any, i: number) => (
                                    <div key={i} className="relative flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm ${log.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {log.done ? <CheckCircle2 className="w-6 h-6"/> : <Clock className="w-6 h-6"/>}
                                        </div>
                                        <div className={`flex-1 p-3 rounded-xl border ${log.done ? 'bg-white border-slate-200' : 'bg-slate-100 border-transparent'}`}>
                                            <p className={`text-sm font-bold ${log.done ? 'text-slate-800' : 'text-slate-500'}`}>{log.msg}</p>
                                            <p className="text-xs text-slate-400 font-mono mt-1">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Local History */}
            {history.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400"/> تذاكرك الأخيرة (محفوظة في الجهاز)
                    </h4>
                    <div className="space-y-3">
                        {history.map((h, i) => (
                            <div 
                                key={i} 
                                className="flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md border border-slate-100 cursor-pointer transition-all group" 
                                onClick={() => { setTicketId(h.id); handleCheck(h.id); }}
                            >
                                <div>
                                    <span className="font-mono font-bold text-blue-600 block text-sm group-hover:text-blue-700">{h.id}</span>
                                    <span className="text-xs text-slate-500">{h.subject}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-slate-400 font-mono">{new Date(h.date).toLocaleDateString()}</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 rtl:rotate-180"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

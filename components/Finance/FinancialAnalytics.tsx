
import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Transaction } from '../../types';
import { FinanceCore } from '../../services/Economy/FinanceCore';
import { TrendingUp, AlertCircle, DollarSign, Activity } from 'lucide-react';

interface Props {
    transactions: Transaction[];
}

export const FinancialAnalytics: React.FC<Props> = ({ transactions }) => {
    
    // --- DATA PROCESSING ---
    
    // 1. Daily Pulse (Last 7 Days)
    const dailyData = useMemo(() => {
        const days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
        }).reverse();

        const revenue = days.map(day => {
            return transactions
                .filter(t => t.status === 'completed' && t.createdAt.startsWith(day))
                .reduce((sum, t) => sum + t.amount, 0);
        });

        return { categories: days, series: [{ name: 'الإيراد (ر.س)', data: revenue }] };
    }, [transactions]);

    // 2. Source Split
    const sourceData = useMemo(() => {
        let cvs = 0, commissions = 0, subscriptions = 0, services = 0;
        
        transactions.forEach(t => {
            if (t.status !== 'completed') return;
            const title = t.serviceTitle.toLowerCase();
            
            if (title.includes('cv') || title.includes('سيرة')) cvs += t.amount;
            else if (title.includes('commission') || title.includes('عمولة')) commissions += t.amount;
            else if (title.includes('subscription') || title.includes('elite')) subscriptions += t.amount;
            else services += t.amount;
        });

        return {
            series: [cvs, commissions, subscriptions, services],
            labels: ['خدمات السيرة الذاتية', 'العمولات', 'الاشتراكات', 'سوق الخدمات']
        };
    }, [transactions]);

    // 3. AI Forecast (Simple Linear Projection based on last 7 days avg)
    const forecast = useMemo(() => {
        const totalLast7 = dailyData.series[0].data.reduce((a, b) => a + b, 0);
        const avgDaily = totalLast7 / 7;
        const nextWeek = Math.round(avgDaily * 7);
        const trend = avgDaily > 0 ? '+12%' : '0%'; // Mock trend logic
        return { nextWeek, trend };
    }, [dailyData]);

    // --- CHART CONFIG ---

    const barOptions: any = {
        chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', fontFamily: 'Tajawal, sans-serif' },
        theme: { mode: 'dark' },
        xaxis: { categories: dailyData.categories, labels: { style: { colors: '#94a3b8' } } },
        yaxis: { labels: { style: { colors: '#94a3b8' }, align: 'right' } },
        colors: ['#10b981'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
        grid: { borderColor: '#334155' },
        dataLabels: { enabled: false }
    };

    const pieOptions: any = {
        chart: { type: 'donut', background: 'transparent', fontFamily: 'Tajawal, sans-serif' },
        theme: { mode: 'dark' },
        labels: sourceData.labels,
        colors: ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'],
        legend: { position: 'bottom', labels: { colors: '#fff' } },
        stroke: { show: false },
        plotOptions: { pie: { donut: { labels: { show: true, total: { show: true, color: '#fff', label: 'الإجمالي' } } } } }
    };

    return (
        <div className="space-y-6 animate-fade-in-up" dir="rtl">
            
            {/* AI Insight Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-[#1e293b] p-6 rounded-2xl border border-indigo-500/30 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-full border border-indigo-500/50 animate-pulse">
                        <Activity className="w-6 h-6 text-indigo-400"/>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">تحليلات الذكاء الاصطناعي المالية</h3>
                        <p className="text-indigo-200 text-sm">
                            بناءً على الأداء الأخير، من المتوقع تحقيق 
                            <span className="font-bold text-white mx-1">{forecast.nextWeek} ر.س</span> 
                            الأسبوع القادم.
                        </p>
                    </div>
                </div>
                <div className="text-left">
                    <div className="text-2xl font-black text-emerald-400">{forecast.trend}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">معدل النمو</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Daily Pulse Chart */}
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500"/> نبض الإيرادات (يومي)
                    </h4>
                    <div className="h-[300px]">
                        <Chart options={barOptions} series={dailyData.series} type="bar" height="100%" />
                    </div>
                </div>

                {/* Source Split Chart */}
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-amber-500"/> مصادر الدخل
                    </h4>
                    <div className="h-[300px]">
                        <Chart options={pieOptions} series={sourceData.series} type="donut" height="100%" />
                    </div>
                </div>

            </div>
        </div>
    );
};

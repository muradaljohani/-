
import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { User } from '../../types';
import { QualityCore } from '../../services/Quality/QualityCore';

interface Props {
    user: User;
    showDetails?: boolean;
    compact?: boolean;
}

export const TrustBadge: React.FC<Props> = ({ user, showDetails = false, compact = false }) => {
    const { score, isTrusted, breakdown } = QualityCore.getInstance().calculateTrustScore(user);

    const getScoreColor = (s: number) => {
        if (s >= 90) return 'text-emerald-500';
        if (s >= 70) return 'text-blue-500';
        if (s >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getRingColor = (s: number) => {
        if (s >= 90) return 'border-emerald-500';
        if (s >= 70) return 'border-blue-500';
        if (s >= 50) return 'border-amber-500';
        return 'border-red-500';
    };

    if (compact) {
        return (
            <div className="flex items-center gap-1.5" title={`Trust Score: ${score}/100`}>
                {isTrusted ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                ) : (
                    <div className={`w-4 h-4 rounded-full border-2 ${getRingColor(score)} flex items-center justify-center text-[8px] font-bold ${getScoreColor(score)}`}>
                        {score}
                    </div>
                )}
                <span className={`text-xs font-bold ${getScoreColor(score)}`}>
                    {isTrusted ? 'بائع موثوق' : `${score}% ثقة`}
                </span>
            </div>
        );
    }

    return (
        <div className="inline-block">
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                {/* Score Ring */}
                <div className={`relative w-12 h-12 rounded-full border-4 ${getRingColor(score)} flex items-center justify-center bg-white/5 shadow-inner`}>
                    <span className={`font-black text-sm ${getScoreColor(score)}`}>{score}</span>
                    {isTrusted && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-[#0f172a]">
                            <CheckCircle2 className="w-3 h-3 text-white"/>
                        </div>
                    )}
                </div>

                {/* Text Info */}
                <div>
                    <div className="flex items-center gap-1">
                        <span className={`font-bold text-sm ${getScoreColor(score)}`}>
                            {isTrusted ? 'بائع موثوق (Trusted)' : 'مستوى الثقة'}
                        </span>
                        {isTrusted && <ShieldCheck className="w-4 h-4 text-emerald-500"/>}
                    </div>
                    <div className="text-[10px] text-gray-400">
                        {score >= 90 ? 'أداء ممتاز وموثق' : 'يحتاج لاستكمال التوثيق'}
                    </div>
                </div>
            </div>

            {/* Details Dropdown / Expansion */}
            {showDetails && (
                <div className="mt-3 bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center gap-1"><CheckCircle2 className={`w-3 h-3 ${breakdown.email ? 'text-emerald-500' : 'text-gray-600'}`}/> البريد الإلكتروني</span>
                        <span className={breakdown.email ? 'text-emerald-400' : 'text-gray-500'}>+20</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center gap-1"><CheckCircle2 className={`w-3 h-3 ${breakdown.phone ? 'text-emerald-500' : 'text-gray-600'}`}/> رقم الجوال</span>
                        <span className={breakdown.phone ? 'text-emerald-400' : 'text-gray-500'}>+30</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center gap-1"><TrendingUp className={`w-3 h-3 ${breakdown.sales ? 'text-emerald-500' : 'text-gray-600'}`}/> مبيعات مكتملة (3+)</span>
                        <span className={breakdown.sales ? 'text-emerald-400' : 'text-gray-500'}>+40</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-300">
                        <span className="flex items-center gap-1"><AlertCircle className={`w-3 h-3 ${breakdown.response ? 'text-emerald-500' : 'text-gray-600'}`}/> سرعة الرد</span>
                        <span className={breakdown.response ? 'text-emerald-400' : 'text-gray-500'}>+10</span>
                    </div>
                </div>
            )}
        </div>
    );
};

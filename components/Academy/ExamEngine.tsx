
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, PlayCircle, Trophy, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    courseId: string;
    courseName: string;
    onPass: () => void;
    onClose: () => void;
    unlockPermission?: string;
}

const QUESTIONS_DB = [
    { q: 'ما هو الهدف الأساسي من التسويق الرقمي؟', options: ['زيادة المبيعات والوعي', 'إصلاح الحواسيب', 'برمجة المواقع'], a: 0 },
    { q: 'أي مما يلي يعتبر من أدوات SEO؟', options: ['Photoshop', 'Google Analytics', 'Excel'], a: 1 },
    { q: 'ماذا تعني CPC في الإعلانات؟', options: ['Cost Per Click', 'Cost Per Customer', 'Cost Per Conversion'], a: 0 },
    { q: 'ما هي أهم منصة للأعمال المهنية B2B؟', options: ['TikTok', 'LinkedIn', 'Snapchat'], a: 1 },
];

export const ExamEngine: React.FC<Props> = ({ courseId, courseName, onPass, onClose, unlockPermission }) => {
    const { submitExamResult } = useAuth();
    const [started, setStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(300); // 5 mins
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<number[]>([]);

    useEffect(() => {
        if (started && !finished) {
            const interval = setInterval(() => setTimer(t => {
                if (t <= 1) {
                    setFinished(true);
                    return 0;
                }
                return t - 1;
            }), 1000);
            return () => clearInterval(interval);
        }
    }, [started, finished]);

    const handleAnswer = (optionIdx: number) => {
        const isCorrect = optionIdx === QUESTIONS_DB[currentQ].a;
        if (isCorrect) setScore(s => s + 25); // 4 questions -> 25pts each
        
        if (currentQ < 3) {
            setCurrentQ(prev => prev + 1);
        } else {
            setFinished(true);
            const finalScore = score + (isCorrect ? 25 : 0);
            if (finalScore >= 75) {
                submitExamResult(courseId, courseName, finalScore, unlockPermission);
                setTimeout(onPass, 2000); // Wait for confetti
            }
        }
    };

    if (!started) {
        return (
            <div className="max-w-md w-full bg-[#1e293b] p-8 rounded-3xl text-center border border-white/10 shadow-2xl">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500 animate-pulse">
                    <Trophy className="w-10 h-10 text-amber-500"/>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">الاختبار النهائي</h2>
                <p className="text-gray-400 mb-8">4 أسئلة • 5 دقائق • نسبة النجاح 75%</p>
                <div className="bg-blue-900/20 p-4 rounded-xl text-xs text-blue-300 mb-8 border border-blue-500/30">
                    عند اجتياز الاختبار، ستحصل على شهادة معتمدة وسيتم فتح صلاحيات جديدة في حسابك.
                </div>
                <button onClick={() => setStarted(true)} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg">
                    بدء الاختبار
                </button>
                <button onClick={onClose} className="mt-4 text-gray-500 text-sm hover:text-white">إلغاء</button>
            </div>
        );
    }

    if (finished) {
        const passed = score >= 75;
        return (
            <div className="max-w-md w-full bg-[#1e293b] p-8 rounded-3xl text-center border border-white/10 animate-fade-in-up">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${passed ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500'}`}>
                    {passed ? <CheckCircle2 className="w-12 h-12 text-emerald-500"/> : <XCircle className="w-12 h-12 text-red-500"/>}
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{passed ? 'مبروك النجاح!' : 'حظ أوفر'}</h2>
                <div className="text-5xl font-mono font-bold text-white mb-6">{score}%</div>
                {passed && (
                    <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-bold bg-amber-500/10 py-2 rounded-lg mb-6">
                        <Star className="w-4 h-4 fill-current"/> +500 Elite Points
                    </div>
                )}
                {!passed && (
                    <button onClick={() => { setScore(0); setCurrentQ(0); setFinished(false); setTimer(300); }} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold">
                        إعادة المحاولة
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-2xl w-full bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Timer Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                <div className="h-full bg-blue-500 transition-all duration-1000 linear" style={{ width: `${(timer/300)*100}%` }}></div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 font-mono text-sm">Question {currentQ + 1} / 4</span>
                <span className={`font-mono font-bold ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                    {Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">
                {QUESTIONS_DB[currentQ].q}
            </h3>

            <div className="space-y-3">
                {QUESTIONS_DB[currentQ].options.map((opt, i) => (
                    <button 
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/5 hover:border-blue-500 hover:bg-blue-600/10 text-right text-gray-200 transition-all group"
                    >
                        <span className="inline-block w-6 h-6 rounded-full border border-gray-600 mr-3 group-hover:border-blue-500 group-hover:bg-blue-500"></span>
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, PlayCircle, RotateCcw, Award } from 'lucide-react';
import { ExamQuestion } from '../types';

interface Props {
    courseTitle: string;
    onPass: (score: number) => void;
    onFail: () => void;
    onClose: () => void;
}

// --- QUESTION BANK (Simulated Database) ---
const QUESTION_BANK: ExamQuestion[] = [
    { id: 'q1', text: 'ما هو الهدف الرئيسي من الذكاء الاصطناعي التوليدي؟', type: 'mcq', points: 10, correctAnswer: 'إنشاء محتوى جديد', options: ['تحليل البيانات فقط', 'إنشاء محتوى جديد', 'تخزين البيانات', 'إدارة الشبكات'] },
    { id: 'q2', text: 'أي من التالي يعتبر لغة برمجة تستخدم بكثرة في علم البيانات؟', type: 'mcq', points: 10, correctAnswer: 'Python', options: ['HTML', 'CSS', 'Python', 'Photoshop'] },
    { id: 'q3', text: 'ماذا تعني الحوسبة السحابية (Cloud Computing)؟', type: 'mcq', points: 10, correctAnswer: 'تقديم خدمات الحوسبة عبر الإنترنت', options: ['شراء أجهزة كمبيوتر قوية', 'تقديم خدمات الحوسبة عبر الإنترنت', 'تصليح الأجهزة عن بعد', 'برمجة التطبيقات'] },
    { id: 'q4', text: 'ما هو دور الأمن السيبراني؟', type: 'mcq', points: 10, correctAnswer: 'حماية الأنظمة والشبكات من الهجمات', options: ['تسريع الإنترنت', 'حماية الأنظمة والشبكات من الهجمات', 'تصميم المواقع', 'زيادة مساحة التخزين'] },
    { id: 'q5', text: 'في لغة HTML، ما هو الوسم المستخدم للعناوين الكبيرة؟', type: 'mcq', points: 10, correctAnswer: 'h1', options: ['p', 'div', 'span', 'h1'] },
    { id: 'q6', text: 'ما هي عاصمة المملكة العربية السعودية؟', type: 'mcq', points: 10, correctAnswer: 'الرياض', options: ['جدة', 'الدمام', 'الرياض', 'مكة'] }, // Control Question
];

export const ArabicQuiz: React.FC<Props> = ({ courseTitle, onPass, onFail, onClose }) => {
    const [started, setStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes

    // --- RANDOMIZATION ENGINE ---
    useEffect(() => {
        if (started) {
            // Shuffle questions
            const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 5); // Take 5 random questions
            setQuestions(shuffled);
            
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        finishExam(0); // Timeout = Fail
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [started]);

    const handleAnswer = (option: string) => {
        setSelectedOption(option);
    };

    const nextQuestion = () => {
        if (!selectedOption) return;
        
        const isCorrect = selectedOption === questions[currentQ].correctAnswer;
        if (isCorrect) setScore(prev => prev + questions[currentQ].points);

        setSelectedOption(null);

        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            finishExam(score + (isCorrect ? questions[currentQ].points : 0));
        }
    };

    const finishExam = (finalScore: number) => {
        const totalPoints = questions.length * 10;
        const percentage = (finalScore / totalPoints) * 100;
        setShowResult(true);
        setScore(percentage);
    };

    if (!started) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#0f172a] text-white">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse border border-blue-500/50">
                    <Award className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-3xl font-black mb-4 font-tajawal">الاختبار النهائي</h2>
                <p className="text-gray-400 max-w-md mb-8 leading-relaxed font-tajawal">
                    أنت على وشك بدء الاختبار النهائي لدورة <span className="text-amber-400 font-bold">{courseTitle}</span>.
                    <br/> يتكون الاختبار من 5 أسئلة اختيار من متعدد. نسبة النجاح المطلوبة 80%.
                </p>
                <div className="bg-black/30 p-4 rounded-xl border border-white/10 mb-8 w-full max-w-sm">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>⏳ المدة الزمنية:</span>
                        <span className="font-bold text-white">10 دقائق</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                        <span>📝 عدد الأسئلة:</span>
                        <span className="font-bold text-white">5 أسئلة</span>
                    </div>
                </div>
                <button onClick={() => setStarted(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all hover:scale-105">
                    <PlayCircle className="w-6 h-6" /> ابدأ الاختبار الآن
                </button>
            </div>
        );
    }

    if (showResult) {
        const passed = score >= 80;
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#0f172a] animate-fade-in-up">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 ${passed ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500'}`}>
                    {passed ? <CheckCircle2 className="w-16 h-16 text-emerald-500" /> : <XCircle className="w-16 h-16 text-red-500" />}
                </div>
                <h2 className="text-3xl font-black text-white mb-2 font-tajawal">{passed ? 'مبروك! لقد اجتزت الاختبار' : 'للأسف، لم تجتز الاختبار'}</h2>
                <div className="text-5xl font-black text-white mb-6 font-mono tracking-widest">{score}%</div>
                
                <p className="text-gray-400 mb-8 font-tajawal">
                    {passed ? 'يمكنك الآن استلام شهادتك المعتمدة.' : 'يمكنك إعادة المحاولة في أي وقت.'}
                </p>

                <div className="flex gap-4">
                    {passed ? (
                        <button onClick={() => onPass(score)} className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all">
                            <Award className="w-5 h-5" /> استلام الشهادة
                        </button>
                    ) : (
                        <button onClick={() => { setStarted(false); setShowResult(false); setScore(0); }} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                            <RotateCcw className="w-5 h-5" /> إعادة المحاولة
                        </button>
                    )}
                    <button onClick={onClose} className="text-gray-500 font-bold px-4 hover:text-white transition-colors">إغلاق</button>
                </div>
            </div>
        );
    }

    const q = questions[currentQ];

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-right font-tajawal" dir="rtl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1e293b]">
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm font-bold">سؤال {currentQ + 1} من {questions.length}</span>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <div className={`flex items-center gap-2 font-mono font-bold ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                        <Clock className="w-4 h-4" />
                        {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </div>
                </div>
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((currentQ) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            {/* Question Body */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q?.text}</h3>
                    
                    <div className="space-y-4">
                        {q?.options?.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                className={`w-full text-right p-5 rounded-2xl border-2 transition-all flex justify-between items-center group ${
                                    selectedOption === opt 
                                    ? 'bg-blue-600/20 border-blue-500 text-white' 
                                    : 'bg-[#1e293b] border-transparent hover:border-gray-600 text-gray-300'
                                }`}
                            >
                                <span className="font-medium text-lg">{opt}</span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === opt ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}>
                                    {selectedOption === opt && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-[#1e293b] flex justify-between items-center">
                <button onClick={onClose} className="text-gray-500 font-bold hover:text-white transition-colors">انسحاب</button>
                <button 
                    onClick={nextQuestion} 
                    disabled={!selectedOption}
                    className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${selectedOption ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                    {currentQ === questions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}
                </button>
            </div>
        </div>
    );
};

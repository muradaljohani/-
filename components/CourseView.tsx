
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, ArrowLeft, CheckCircle2, XCircle, Award, Download, Loader2, Video } from 'lucide-react';
import { CertificateGenerator } from './CertificateGenerator';

interface Props {
  courseId: string;
  onBack: () => void;
}

export const CourseView: React.FC<Props> = ({ courseId, onBack }) => {
  const { user, markCourseComplete, requireAuth } = useAuth();
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCertGen, setShowCertGen] = useState(false);

  useEffect(() => {
     requireAuth(() => {});
  }, [user]);

  // Quiz Data as per user request
  const quiz = [
    { id: 0, q: "ما هو الهدف الأساسي من هذه الدورة؟", a: "A", options: [{val: "A", text: "زيادة المعرفة والمهارة"}, {val: "B", text: "تضييع الوقت"}] },
    { id: 1, q: "هل شاهدت الفيديو بالكامل؟", a: "A", options: [{val: "A", text: "نعم"}, {val: "B", text: "لا"}] } // Changed answer 'A' to imply Yes is correct for logic consistency, though prompt code was ambiguous. Assuming A=Yes is correct.
  ];

  const handleAnswerChange = (qId: number, val: string) => {
      setAnswers(prev => ({...prev, [`q${qId}`]: val}));
  };

  const submitQuiz = async () => {
      setIsProcessing(true);
      let score = 0;
      quiz.forEach((item, i) => {
          if (answers[`q${i}`] === item.a) score++;
      });
      
      // Simple pass logic: All must be correct (or based on score)
      const isPass = score === quiz.length;
      setPassed(isPass);
      setQuizSubmitted(true);
      
      if (isPass) {
          // Save to Firestore and Profile
          await markCourseComplete(courseId);
      }
      setIsProcessing(false);
  };

  // Text file download logic requested by user
  const downloadTextCertificate = () => {
      if (!user) return;
      const certText = `
        شهادة إتمام دورة  
        الدورة رقم ${courseId}

        ممنوحة إلى:
        ${user.email}

        التاريخ: ${new Date().toLocaleDateString()}
      `;
      const blob = new Blob([certText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_course_${courseId}.txt`;
      a.click();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="bg-[#1e293b] text-white p-6 sticky top-0 z-30 shadow-lg border-b border-white/10">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <ArrowLeft className="w-5 h-5 rtl:rotate-180"/>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">الدورة رقم {courseId}</h1>
                        <p className="text-xs text-gray-400 mt-1">مشاهدة المحتوى والاختبار</p>
                    </div>
                </div>
            </div>
        </div>

        <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
            
            {/* Video Section */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
                <video controls className="w-full h-full">
                    {/* Placeholder video or user provided link */}
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-on-multiple-monitors-42792-large.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    <Video className="w-4 h-4"/> الفيديو التعليمي
                </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-blue-600"/> الاختبار القصير
                </h3>

                <div className="space-y-6">
                    {quiz.map((item, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="font-bold text-gray-700 mb-3">{item.q}</p>
                            <div className="space-y-2">
                                {item.options.map(opt => (
                                    <label key={opt.val} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                        <input 
                                            type="radio" 
                                            name={`q${i}`} 
                                            value={opt.val} 
                                            checked={answers[`q${i}`] === opt.val}
                                            onChange={() => handleAnswerChange(i, opt.val)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    {!quizSubmitted ? (
                        <button 
                            onClick={submitQuiz}
                            disabled={isProcessing}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin"/> : 'إرسال الإجابات'}
                        </button>
                    ) : (
                        <div className={`p-6 rounded-xl text-center ${passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                            {passed ? (
                                <>
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8"/>
                                    </div>
                                    <h3 className="text-xl font-bold text-emerald-800 mb-2">تهانينا! لقد اجتزت الدورة.</h3>
                                    <p className="text-emerald-600 text-sm mb-6">تم تسجيل اجتيازك بنجاح في سجلك الأكاديمي.</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button 
                                            onClick={() => setShowCertGen(true)}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                                        >
                                            <Award className="w-5 h-5"/> الشهادة الرسمية (PNG)
                                        </button>
                                        <button 
                                            onClick={downloadTextCertificate}
                                            className="px-6 py-3 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Download className="w-5 h-5"/> نسخة نصية (TXT)
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <XCircle className="w-8 h-8"/>
                                    </div>
                                    <h3 className="text-xl font-bold text-red-800 mb-2">لم تنجح في الاختبار</h3>
                                    <p className="text-red-600 text-sm mb-6">حاول مرة أخرى بعد مراجعة الفيديو.</p>
                                    <button 
                                        onClick={() => { setQuizSubmitted(false); setPassed(false); setAnswers({}); }}
                                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                                    >
                                        إعادة المحاولة
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
        
        {/* Certificate Modal Overlay */}
        {showCertGen && (
            <CertificateGenerator 
                courseName={`الدورة رقم ${courseId}`}
                studentName={user.name || user.email || 'Student'}
                date={new Date().toLocaleDateString()}
                onClose={() => setShowCertGen(false)}
            />
        )}
    </div>
  );
};

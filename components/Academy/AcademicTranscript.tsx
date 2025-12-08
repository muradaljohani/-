
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Printer, ShieldCheck } from 'lucide-react';
import { AssetProcessor } from '../../services/System/AssetProcessor';

export const AcademicTranscript: React.FC = () => {
    const { user } = useAuth();
    const assetProcessor = AssetProcessor.getInstance();
    
    if (!user) return null;

    const transcript = user.transcript || [];
    
    // Calculate GPA
    const totalCredits = transcript.reduce((acc, t) => acc + t.creditHours, 0);
    const totalPoints = transcript.reduce((acc, t) => {
        const points = t.grade === 'A' ? 4 : t.grade === 'B' ? 3 : t.grade === 'C' ? 2 : 0;
        return acc + (points * t.creditHours);
    }, 0);
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    return (
        <div className="bg-white text-black p-8 rounded-xl shadow-xl max-w-4xl mx-auto font-serif relative overflow-hidden mt-8 print:shadow-none print:w-full print:max-w-none">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <GraduationCap className="w-96 h-96"/>
            </div>

            {/* Header */}
            <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-end relative z-10">
                <div className="text-right">
                    <h1 className="text-3xl font-bold mb-2">السجل الأكاديمي</h1>
                    <p className="text-sm text-gray-600">ACADEMIC TRANSCRIPT</p>
                </div>
                <div className="text-center">
                    <div className="w-20 h-20 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-2 border-4 border-[#d97706]">M</div>
                    <div className="text-xs font-bold tracking-widest uppercase">أكاديمية ميلاف مراد</div>
                </div>
                <div className="text-left text-sm">
                    <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="font-bold">ID:</span> {user.trainingId}</p>
                </div>
            </div>

            {/* Official Certification Statement */}
            <div className="mb-6 text-center text-lg font-medium leading-relaxed border-b border-gray-200 pb-6">
                " تشهد إدارة القبول والتسجيل في أكاديمية ميلاف مراد للتدريب والتطوير بأن المتدرب/ة المذكور/ة أدناه قد أتم/ت المتطلبات التدريبية وحصل/ت على الدرجات التالية: "
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm relative z-10 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                    <p className="mb-2"><span className="font-bold w-24 inline-block">الاسم:</span> {user.name}</p>
                    <p className="mb-1"><span className="font-bold w-24 inline-block">التخصص:</span> {user.major || 'عام'}</p>
                </div>
                <div className="text-left">
                    <p className="mb-2"><span className="font-bold w-24 inline-block">الحالة:</span> منتظم</p>
                    <p className="mb-1"><span className="font-bold w-24 inline-block">المعدل التراكمي:</span> {gpa} / 4.00</p>
                </div>
            </div>

            {/* Grades Table */}
            <table className="w-full text-sm border-collapse mb-12 relative z-10">
                <thead>
                    <tr className="bg-black text-white text-center">
                        <th className="py-3 px-4 text-right rounded-tr-lg">اسم المقرر (Course Name)</th>
                        <th className="py-3 px-4">الساعات (Hours)</th>
                        <th className="py-3 px-4">الدرجة (Grade)</th>
                        <th className="py-3 px-4">النقاط (Points)</th>
                        <th className="py-3 px-4 rounded-tl-lg">الفصل (Term)</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-500 italic border border-gray-200">No completed courses yet.</td></tr>
                    )}
                    {transcript.map((t, i) => (
                        <tr key={i} className="border-b border-gray-200 hover:bg-blue-50">
                            <td className="py-3 px-4 text-right font-bold border-x border-gray-200">{t.courseName}</td>
                            <td className="py-3 px-4 text-center border-x border-gray-200">{t.creditHours}</td>
                            <td className="py-3 px-4 text-center font-bold border-x border-gray-200">{t.grade}</td>
                            <td className="py-3 px-4 text-center border-x border-gray-200">{t.score}</td>
                            <td className="py-3 px-4 text-center text-gray-500 border-x border-gray-200">{t.semester}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer / Signatures */}
            <div className="flex justify-between items-end mt-12 relative z-10 px-8">
                
                {/* Executive Director Signature */}
                <div className="text-center w-64">
                   <div className="h-24 mb-2 flex items-end justify-center relative">
                        <img 
                            src={assetProcessor.getOfficialSignature()} 
                            alt="Signature" 
                            className="h-full object-contain absolute bottom-0"
                            style={{...assetProcessor.getSignatureStyle(), zIndex: 2}} 
                        />
                    </div>
                    <div className="border-t-2 border-[#1e3a8a] pt-2">
                        <div className="font-bold text-[#1e3a8a] text-sm">المدير التنفيذي</div>
                        <div className="text-base font-bold font-serif">م. مراد الجهني</div>
                    </div>
                </div>

                {/* Official Stamp */}
                <div className="text-center">
                     <div className="h-32 w-32 flex items-center justify-center relative">
                        <img 
                            src={assetProcessor.getOfficialSeal()} 
                            alt="Stamp"
                            className="w-full h-full opacity-90 mix-blend-multiply transform -rotate-12"
                        />
                    </div>
                    <p className="text-[10px] font-bold mt-1 text-[#1e3a8a] uppercase tracking-widest">OFFICIAL SEAL</p>
                </div>

                {/* Registrar */}
                <div className="text-center w-64">
                    <div className="h-24 mb-2 flex items-end justify-center">
                        {/* Placeholder for Registrar Sig */}
                        <div className="font-script text-2xl text-gray-400">Registrar</div>
                    </div>
                    <div className="border-t-2 border-[#1e3a8a] pt-2">
                        <div className="font-bold text-[#1e3a8a] text-sm">عمادة القبول والتسجيل</div>
                        <div className="text-xs text-gray-500">حرر بتاريخ: {new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* Controls (Hidden on Print) */}
            <div className="absolute top-4 left-4 print:hidden">
                <button onClick={() => window.print()} className="bg-black text-white p-3 rounded-full hover:bg-gray-800 shadow-lg flex items-center gap-2 transition-transform hover:scale-110">
                    <Printer className="w-5 h-5"/> <span className="text-xs font-bold">طباعة رسمية</span>
                </button>
            </div>
        </div>
    );
};

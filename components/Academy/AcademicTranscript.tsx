
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Printer, ShieldCheck } from 'lucide-react';

export const AcademicTranscript: React.FC = () => {
    const { user } = useAuth();
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
        <div className="bg-white text-black p-8 rounded-xl shadow-xl max-w-4xl mx-auto font-serif relative overflow-hidden">
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
                    <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">M</div>
                    <div className="text-xs font-bold tracking-widest uppercase">Mylaf Academy</div>
                </div>
                <div className="text-left text-sm">
                    <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                    <p><span className="font-bold">ID:</span> {user.trainingId}</p>
                </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm relative z-10">
                <div>
                    <p className="mb-1"><span className="font-bold w-24 inline-block">Name:</span> {user.name}</p>
                    <p className="mb-1"><span className="font-bold w-24 inline-block">Major:</span> {user.major || 'General'}</p>
                </div>
                <div className="text-left">
                    <p className="mb-1"><span className="font-bold w-24 inline-block">Status:</span> Active</p>
                    <p className="mb-1"><span className="font-bold w-24 inline-block">Cum. GPA:</span> {gpa} / 4.00</p>
                </div>
            </div>

            {/* Grades Table */}
            <table className="w-full text-sm border-collapse mb-8 relative z-10">
                <thead>
                    <tr className="border-y-2 border-black text-left">
                        <th className="py-2 text-right">Course Name</th>
                        <th className="py-2 text-center">Credit Hours</th>
                        <th className="py-2 text-center">Grade</th>
                        <th className="py-2 text-center">Points</th>
                        <th className="py-2 text-center">Semester</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-500 italic">No completed courses yet.</td></tr>
                    )}
                    {transcript.map((t, i) => (
                        <tr key={i} className="border-b border-gray-200">
                            <td className="py-3 text-right font-bold">{t.courseName}</td>
                            <td className="py-3 text-center">{t.creditHours}</td>
                            <td className="py-3 text-center font-bold">{t.grade}</td>
                            <td className="py-3 text-center">{t.score}</td>
                            <td className="py-3 text-center text-gray-500">{t.semester}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer */}
            <div className="flex justify-between items-end mt-12 relative z-10">
                <div className="text-center">
                    <div className="h-px w-48 bg-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Registrar Signature</p>
                </div>
                <div className="text-center">
                    <ShieldCheck className="w-12 h-12 text-[#1e3a8a] mx-auto opacity-80"/>
                    <p className="text-[10px] font-bold mt-1 text-[#1e3a8a]">OFFICIAL DOCUMENT</p>
                </div>
            </div>

            {/* Controls (Hidden on Print) */}
            <div className="absolute top-4 left-4 print:hidden">
                <button onClick={() => window.print()} className="bg-black text-white p-2 rounded-full hover:bg-gray-800">
                    <Printer className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

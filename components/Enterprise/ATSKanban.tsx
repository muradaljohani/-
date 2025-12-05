
import React, { useState, useEffect } from 'react';
import { UserJob, Applicant } from '../../types';
import { CorporateEngine } from '../../services/Enterprise/CorporateEngine';
import { MoreHorizontal, MessageCircle, Phone, X, Check, Filter } from 'lucide-react';

interface Props {
    job: UserJob;
    onClose: () => void;
}

const COLUMNS: { id: Applicant['status'], label: string, color: string }[] = [
    { id: 'New', label: 'جديد', color: 'bg-blue-500' },
    { id: 'Interview', label: 'مقابلة', color: 'bg-purple-500' },
    { id: 'Shortlisted', label: 'قائمة قصيرة', color: 'bg-amber-500' },
    { id: 'Hired', label: 'تم التوظيف', color: 'bg-emerald-500' }
];

export const ATSKanban: React.FC<Props> = ({ job, onClose }) => {
    const [applicants, setApplicants] = useState<Applicant[]>(job.applicants || CorporateEngine.getInstance().generateMockApplicants(10));
    
    // Drag & Drop Handlers would go here (using simple move logic for now due to no dnd lib)
    const moveApplicant = (id: string, newStatus: Applicant['status']) => {
        setApplicants(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    return (
        <div className="fixed inset-0 z-[300] bg-[#0f172a] flex flex-col font-sans" dir="rtl">
            <div className="h-16 bg-[#1e293b] border-b border-white/10 flex items-center justify-between px-6">
                <div>
                    <h2 className="text-white font-bold text-lg">نظام تتبع المتقدمين (ATS)</h2>
                    <p className="text-xs text-gray-400">{job.title} - {applicants.length} متقدم</p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex gap-6 h-full min-w-max">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="w-80 bg-[#1e293b] rounded-xl flex flex-col border border-white/5">
                            <div className={`p-4 border-b border-white/5 flex justify-between items-center ${col.color} bg-opacity-10`}>
                                <h3 className={`font-bold ${col.color.replace('bg-', 'text-')}`}>{col.label}</h3>
                                <span className="bg-black/20 text-white text-xs px-2 py-1 rounded-full">
                                    {applicants.filter(a => a.status === col.id).length}
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {applicants.filter(a => a.status === col.id).map(app => (
                                    <div key={app.id} className="bg-[#0f172a] p-3 rounded-lg border border-white/5 hover:border-blue-500/50 transition-all group relative">
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src={app.avatar} className="w-8 h-8 rounded-full"/>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">{app.name}</h4>
                                                <p className="text-[10px] text-gray-400">{app.experienceYears} سنوات خبرة</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {app.skills.slice(0,3).map(s => (
                                                <span key={s} className="text-[9px] bg-white/5 text-gray-300 px-1.5 py-0.5 rounded">{s}</span>
                                            ))}
                                        </div>
                                        
                                        {/* Actions (Move) */}
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                            {col.id !== 'Hired' && (
                                                <button onClick={() => moveApplicant(app.id, getNextStatus(col.id))} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500">
                                                    نقل للتالي
                                                </button>
                                            )}
                                            <button className="text-gray-400 hover:text-white"><MessageCircle className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function getNextStatus(current: Applicant['status']): Applicant['status'] {
    if (current === 'New') return 'Interview';
    if (current === 'Interview') return 'Shortlisted';
    if (current === 'Shortlisted') return 'Hired';
    return 'Hired';
}

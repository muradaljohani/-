
import React, { useState } from 'react';
import { X, Calendar, User, Star, Clock, Video, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentGateway } from '../PaymentGateway';

interface Props {
    skill: string;
    onClose: () => void;
}

export const MentorConnect: React.FC<Props> = ({ skill, onClose }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const [step, setStep] = useState<'list' | 'booking' | 'payment'>('list');
    const [selectedMentor, setSelectedMentor] = useState<any>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Mock Mentors based on Skill
    const MENTORS = [
        { id: 'm1', name: 'د. خالد', role: `Senior ${skill} Expert`, company: 'Aramco', rating: 4.9, price: 150, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid' },
        { id: 'm2', name: 'م. سارة', role: `${skill} Specialist`, company: 'STC', rating: 4.8, price: 100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
        { id: 'm3', name: 'أ. فهد', role: `Lead ${skill} Instructor`, company: 'Mylaf', rating: 5.0, price: 200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fahad' },
    ];

    if (!isOpen) return null;

    const handleBook = (mentor: any) => {
        setSelectedMentor(mentor);
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentOpen(false);
        setStep('booking'); // Success view
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-2xl bg-[#0f172a] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                <div className="bg-[#1e293b] p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400"/>
                        موجه مهني (Career Shadow)
                    </h3>
                    <button onClick={() => { setIsOpen(false); onClose(); }}><X className="w-5 h-5 text-gray-400"/></button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {step === 'list' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400 mb-4">
                                خبراء متاحون الآن لتقديم الاستشارة في مجال <span className="text-purple-400 font-bold">{skill}</span>.
                            </p>
                            
                            {MENTORS.map(mentor => (
                                <div key={mentor.id} className="bg-white/5 border border-white/5 hover:border-purple-500/50 p-4 rounded-xl flex items-center justify-between group transition-all">
                                    <div className="flex items-center gap-4">
                                        <img src={mentor.avatar} className="w-12 h-12 rounded-full border-2 border-purple-500/20"/>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{mentor.name}</h4>
                                            <p className="text-xs text-gray-400">{mentor.role} at {mentor.company}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-yellow-500 mt-1">
                                                <Star className="w-3 h-3 fill-current"/> {mentor.rating}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">{mentor.price} <span className="text-xs font-normal text-gray-500">ر.س/ساعة</span></div>
                                        <button onClick={() => handleBook(mentor)} className="mt-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                            حجز جلسة
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 'booking' && selectedMentor && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500 animate-bounce-slow">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400"/>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">تم تأكيد الحجز!</h3>
                            <p className="text-gray-400 text-sm mb-6">موعدك مع {selectedMentor.name} تم تأكيده. رابط الجلسة (Google Meet) وصلك على البريد.</p>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 inline-flex items-center gap-2 text-blue-400 text-xs font-mono">
                                <Video className="w-4 h-4"/> meet.google.com/abc-xyz-123
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedMentor && (
                <PaymentGateway 
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    amount={selectedMentor.price}
                    title={`جلسة استشارية مع ${selectedMentor.name}`}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

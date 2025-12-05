
import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, User } from 'lucide-react';
import { RealityCore } from '../../services/Reality/RealityCore';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    hostName: string;
    type: 'Interview' | 'Service';
}

export const TimeLordScheduler: React.FC<Props> = ({ isOpen, onClose, hostName, type }) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [meetLink, setMeetLink] = useState('');

    const engine = RealityCore.getInstance();
    const slots = engine.getAvailableSlots(selectedDate);

    if (!isOpen) return null;

    const handleBook = () => {
        if (!selectedSlot) return;
        const apt = engine.bookAppointment({
            hostId: 'host', // Mock
            guestId: 'guest', // Mock
            type,
            date: selectedDate,
            timeSlot: selectedSlot
        });
        if (apt.meetingLink) setMeetLink(apt.meetingLink);
        setConfirmed(true);
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-md bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                <div className="bg-gradient-to-r from-purple-900 to-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400"/>
                            حجز موعد {type === 'Interview' ? 'مقابلة' : 'خدمة'}
                        </h3>
                        <p className="text-xs text-purple-300/80 mt-1">مع: {hostName}</p>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400"/></button>
                </div>

                {!confirmed ? (
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="text-gray-400 text-xs mb-2 block font-bold">اختر التاريخ</label>
                            <input 
                                type="date" 
                                value={selectedDate} 
                                onChange={e => setSelectedDate(e.target.value)} 
                                className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-xs mb-2 block font-bold">الأوقات المتاحة</label>
                            <div className="grid grid-cols-2 gap-3">
                                {slots.map(slot => (
                                    <button 
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all ${selectedSlot === slot ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleBook}
                            disabled={!selectedSlot} 
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${selectedSlot ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                            تأكيد الحجز
                        </button>
                    </div>
                ) : (
                    <div className="p-8 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 animate-bounce-slow">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400"/>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">تم الحجز بنجاح!</h3>
                            <p className="text-gray-400 text-sm">تم إرسال تفاصيل الموعد إلى التقويم.</p>
                        </div>
                        
                        {type === 'Interview' && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2 justify-center">
                                    <Video className="w-4 h-4"/> رابط الاجتماع (Google Meet)
                                </div>
                                <div className="bg-black/30 p-2 rounded text-gray-300 text-xs font-mono break-all select-all">
                                    {meetLink}
                                </div>
                            </div>
                        )}

                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-8 py-2 rounded-lg font-bold">
                            إغلاق
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

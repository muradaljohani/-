
import React, { useState } from 'react';
import { FileText, Camera, Send, AlertTriangle, CheckCircle2, Loader2, Paperclip, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    onComplete: () => void;
}

export const SupportTicketWizard: React.FC<Props> = ({ onComplete }) => {
    const { createSupportTicket } = useAuth();
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketId, setTicketId] = useState('');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const newTicketId = `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`;
        setTicketId(newTicketId);

        // Simulate AI Analysis & Network Request
        await new Promise(resolve => setTimeout(resolve, 2000));

        createSupportTicket({
            id: newTicketId,
            userId: 'guest', // or actual user ID
            subject,
            issue: description,
            priority: priority as any,
            status: 'Open',
            createdAt: new Date().toISOString(),
            category,
            autoSummary: 'New Ticket via Portal'
        });

        // Save to LocalStorage for tracking without login (Critical for user experience in this demo)
        try {
            const localTickets = JSON.parse(localStorage.getItem('my_support_tickets') || '[]');
            localTickets.push({ id: newTicketId, subject, status: 'Open', date: new Date().toISOString() });
            localStorage.setItem('my_support_tickets', JSON.stringify(localTickets));
        } catch (e) {
            // Reset if corrupt
            const localTickets = [{ id: newTicketId, subject, status: 'Open', date: new Date().toISOString() }];
            localStorage.setItem('my_support_tickets', JSON.stringify(localTickets));
        }

        setIsSubmitting(false);
        setStep(3);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up">
            {/* Header Steps */}
            <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    {[1, 2, 3].map(i => (
                        <React.Fragment key={i}>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-all ${step >= i ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                                {step > i ? <CheckCircle2 className="w-5 h-5"/> : i}
                            </div>
                            {i < 3 && <div className={`flex-1 h-1 rounded-full transition-all ${step > i ? 'bg-blue-600' : 'bg-slate-200'}`} style={{width: '50px'}}></div>}
                        </React.Fragment>
                    ))}
                </div>
                <h2 className="mt-4 font-bold text-lg text-slate-800">
                    {step === 1 ? 'تصنيف المشكلة' : step === 2 ? 'تفاصيل البلاغ' : 'تم استلام الطلب'}
                </h2>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {[
                            { t: 'مشكلة تقنية', d: 'أخطاء في الموقع، تسجيل الدخول، التطبيق' },
                            { t: 'مدفوعات وفواتير', d: 'مشكلة في الدفع، استرجاع مبلغ، رصيد' },
                            { t: 'الحساب والأمان', d: 'توثيق الهوية، تغيير كلمة المرور، اختراق' },
                            { t: 'اقتراحات وشكاوى', d: 'تقديم اقتراح لتحسين الخدمة أو شكوى' },
                            { t: 'الشهادات والدورات', d: 'إصدار شهادة، محتوى دورة، اختبارات' },
                            { t: 'استفسار عام', d: 'أسئلة عامة حول خدمات المنصة' }
                        ].map((cat) => (
                            <button 
                                key={cat.t}
                                onClick={() => { setCategory(cat.t); setStep(2); }}
                                className="p-6 text-right border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <h3 className="font-bold text-slate-800 group-hover:text-blue-700 relative z-10">{cat.t}</h3>
                                <p className="text-xs text-slate-500 mt-1 relative z-10">{cat.d}</p>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">عنوان المشكلة</label>
                            <input 
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full p-4 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                                placeholder="مثال: لا يمكنني تحميل الشهادة..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                                <div className="p-4 bg-slate-100 rounded-xl text-slate-600 text-sm font-bold border border-slate-200">{category}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">الأولوية</label>
                                <select 
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full p-4 border border-slate-300 rounded-xl outline-none focus:border-blue-500 bg-white cursor-pointer"
                                >
                                    <option value="Low">عادية</option>
                                    <option value="Medium">متوسطة</option>
                                    <option value="High">عالية</option>
                                    <option value="Urgent">طارئة جداً</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">شرح المشكلة</label>
                            <textarea 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full p-4 border border-slate-300 rounded-xl outline-none focus:border-blue-500 h-40 resize-none bg-slate-50 focus:bg-white transition-all"
                                placeholder="يرجى كتابة كافة التفاصيل هنا لمساعدتنا في حل المشكلة بأسرع وقت..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">المرفقات (اختياري)</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all group">
                                <input type="file" className="hidden" />
                                <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                    <div className="p-3 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors">
                                        <Camera className="w-6 h-6 text-slate-400 group-hover:text-blue-500"/>
                                    </div>
                                    <span className="text-sm font-medium group-hover:text-blue-600">اضغط هنا لرفع صور أو مستندات</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-100 mt-4">
                            <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2 transition-all">
                                <ChevronLeft className="w-5 h-5"/> رجوع
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={!subject || !description || isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Send className="w-5 h-5 rtl:rotate-180"/>}
                                {isSubmitting ? 'جاري المعالجة...' : 'إرسال التذكرة'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
                            <CheckCircle2 className="w-12 h-12"/>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2">تم استلام طلبك بنجاح</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">تم تسجيل التذكرة في النظام المركزي. سيقوم أحد ممثلي الدعم الفني بالرد عليك قريباً.</p>
                        
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 inline-block mb-8 w-full max-w-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">رقم التذكرة (Reference ID)</p>
                            <div className="text-3xl font-mono font-black text-blue-800 select-all tracking-wider">
                                {ticketId}
                            </div>
                        </div>
                        
                        <div>
                            <button onClick={onComplete} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all flex items-center gap-2 mx-auto">
                                الذهاب لصفحة المتابعة <ChevronLeft className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

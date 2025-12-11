
import React, { useState, useEffect } from 'react';
import { ArrowRight, Save, Lock, AlertTriangle, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, db, auth, sendPasswordResetEmail } from '../../src/lib/firebase';

// --- SHARED HEADER COMPONENT ---
const SettingsHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#2f3336] px-4 py-3 flex items-center gap-6">
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-[#18191c] rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-white rtl:rotate-180" />
        </button>
        <h2 className="text-xl font-bold text-[#e7e9ea]">{title}</h2>
    </div>
);

// --- 1. ACCOUNT SETTINGS (FUNCTIONAL) ---
export const AccountSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            // Update Firestore
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { username });
            
            // Update Local Context
            updateProfile({ username });
            
            setMessage({ type: 'success', text: 'تم تحديث اسم المستخدم بنجاح' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'حدث خطأ أثناء التحديث. حاول مرة أخرى.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = () => {
        const confirm = window.confirm("هل أنت متأكد من تعطيل الحساب؟ لا يمكن التراجع عن هذا الإجراء بسهولة.");
        if (confirm) {
            alert("تم رفع طلب تعطيل الحساب. سيتم معالجته خلال 24 ساعة.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
            <SettingsHeader title="حسابك" onBack={onBack} />
            <div className="p-4 space-y-6">
                
                <div className="space-y-4">
                    <p className="text-[#71767b] text-sm">اطّلع على معلومات الحساب، وقم بتنزيل أرشيف لبياناتك، أو تعرف على خيارات إلغاء تنشيط الحساب.</p>
                    
                    {/* Username Field */}
                    <div className="group">
                        <label className="block text-sm text-[#71767b] mb-1">اسم المستخدم</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                                className="w-full bg-transparent border-b border-[#2f3336] focus:border-[#1d9bf0] py-2 text-white outline-none transition-colors dir-ltr text-right"
                            />
                            <span className="absolute left-0 top-2 text-[#71767b]">@</span>
                        </div>
                    </div>

                    {/* Read Only Info */}
                    <div>
                        <label className="block text-sm text-[#71767b] mb-1">البريد الإلكتروني</label>
                        <div className="text-[#e7e9ea] dir-ltr text-right opacity-70">{user?.email}</div>
                    </div>

                    <div>
                        <label className="block text-sm text-[#71767b] mb-1">تاريخ الإنشاء</label>
                        <div className="text-[#e7e9ea]">{new Date(user?.createdAt || Date.now()).toLocaleDateString('ar-SA')}</div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                            {message.type === 'success' ? <Check className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
                            {message.text}
                        </div>
                    )}

                    <button 
                        onClick={handleSave}
                        disabled={loading || username === user?.username}
                        className="bg-[#eff3f4] text-black px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-[#d4d8d9] transition-colors flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                        حفظ التغييرات
                    </button>
                </div>

                <div className="h-px bg-[#2f3336] my-6"></div>

                <div className="space-y-4">
                    <button 
                        onClick={handleDeactivate}
                        className="text-red-500 hover:bg-red-500/10 px-4 py-2 -mx-4 w-[calc(100%+2rem)] text-right transition-colors flex justify-between items-center"
                    >
                        <span>تعطيل الحساب</span>
                        <ChevronLeft className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. SECURITY SETTINGS (HYBRID) ---
export const SecuritySettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user } = useAuth();
    const [twoFactor, setTwoFactor] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            setResetSent(true);
            setTimeout(() => setResetSent(false), 5000);
        } catch (e) {
            alert("حدث خطأ أثناء إرسال البريد.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
            <SettingsHeader title="الأمان والوصول" onBack={onBack} />
            <div className="p-4 space-y-6">
                
                <div className="bg-[#2f3336]/20 p-4 rounded-xl border border-[#2f3336]">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-emerald-500"/>
                        <h3 className="font-bold">أمان كلمة المرور</h3>
                    </div>
                    <p className="text-sm text-[#71767b] mb-4">قم بتغيير كلمة المرور بانتظام للحفاظ على أمان حسابك.</p>
                    <button 
                        onClick={handlePasswordReset}
                        disabled={resetSent}
                        className="text-[#1d9bf0] text-sm font-bold hover:underline"
                    >
                        {resetSent ? 'تم إرسال رابط إعادة التعيين لبريدك' : 'إرسال رابط تغيير كلمة المرور'}
                    </button>
                </div>

                <div className="flex items-center justify-between py-2">
                    <div>
                        <h3 className="text-[#e7e9ea] font-bold">المصادقة الثنائية (2FA)</h3>
                        <p className="text-[#71767b] text-xs mt-1">حماية إضافية لحسابك.</p>
                    </div>
                    <button 
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${twoFactor ? 'bg-emerald-500' : 'bg-[#2f3336]'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${twoFactor ? 'left-1' : 'right-1'}`}></div>
                    </button>
                </div>

                <div className="h-px bg-[#2f3336]"></div>

                <div>
                    <h3 className="text-[#e7e9ea] font-bold mb-4">الجلسات النشطة</h3>
                    <div className="flex items-center gap-3 text-sm text-[#71767b]">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        هذا الجهاز (Web) · الرياض، السعودية
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- 3. LEGAL SETTINGS (STATIC CONTENT) ---
export const LegalSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
            <SettingsHeader title="الموارد القانونية" onBack={onBack} />
            <div className="p-6 space-y-8 overflow-y-auto">
                
                <section>
                    <h3 className="text-lg font-bold text-white mb-3">1. اتفاقية الاستخدام</h3>
                    <p className="text-[#71767b] text-sm leading-relaxed">
                        مرحباً بك في منصة ميلاف. باستخدامك للمنصة، فإنك توافق على الالتزام بجميع القوانين واللوائح المعمول بها في المملكة العربية السعودية. يمنع منعاً باتاً استخدام المنصة لأغراض غير قانونية، أو نشر محتوى مسيء، أو انتهاك حقوق الملكية الفكرية.
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-white mb-3">2. سياسة الخصوصية</h3>
                    <p className="text-[#71767b] text-sm leading-relaxed">
                        نحن نأخذ خصوصيتك على محمل الجد. البيانات التي نجمعها (مثل الاسم، البريد الإلكتروني، وسجلات النشاط) تستخدم حصرياً لتحسين تجربتك وتقديم الخدمات. لا نقوم ببيع بياناتك لأطراف ثالثة.
                    </p>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-white mb-3">3. المعاملات المالية</h3>
                    <p className="text-[#71767b] text-sm leading-relaxed">
                        جميع المدفوعات والاشتراكات في المنصة نهائية ولا تسترد إلا في الحالات المنصوص عليها في "سياسة الاسترجاع". نحن نستخدم بوابات دفع آمنة ومشفرة لضمان سلامة معاملاتك المالية.
                    </p>
                </section>

                <div className="mt-8 pt-6 border-t border-[#2f3336] text-center text-xs text-[#71767b]">
                    آخر تحديث: يناير 2025 <br/>
                    جميع الحقوق محفوظة لشركة مراد الجهني لتقنية المعلومات
                </div>

            </div>
        </div>
    );
};

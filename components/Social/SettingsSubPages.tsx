
import React, { useState } from 'react';
import { ArrowRight, Lock, AlertTriangle, ChevronLeft, Check, Loader2, Download, Database, Mail, Phone, Calendar, Shield, Trash2, Key } from 'lucide-react';
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

// --- 1. ACCOUNT SETTINGS (Full Control) ---
export const AccountSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isEditingPass, setIsEditingPass] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            // Update Firestore
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { 
                username,
                email,
                phone
            });
            
            // Update Local Context
            updateProfile({ username, email, phone });
            
            setMessage({ type: 'success', text: 'تم تحديث معلومات الحساب بنجاح' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'حدث خطأ أثناء التحديث. حاول مرة أخرى.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        try {
            await sendPasswordResetEmail(auth, user.email);
            setMessage({ type: 'success', text: `تم إرسال رابط تغيير كلمة المرور إلى ${user.email}` });
            setIsEditingPass(false);
        } catch (e) {
            setMessage({ type: 'error', text: 'فشل إرسال البريد. تحقق من صحة البريد الإلكتروني.' });
        }
    };

    const handleDeactivate = () => {
        const confirm = window.confirm("هل أنت متأكد من تعطيل الحساب؟ سيتم إخفاء ملفك الشخصي ومنشوراتك. يمكنك استعادته خلال 30 يوماً.");
        if (confirm) {
            // In a real app, call backend deactivation API
            alert("تم رفع طلب تعطيل الحساب. سيتم تسجيل الخروج الآن.");
            window.location.reload(); // Simulate logout
        }
    };

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
            <SettingsHeader title="معلومات الحساب" onBack={onBack} />
            <div className="p-4 space-y-8">
                
                <div className="space-y-6">
                    <p className="text-[#71767b] text-sm">قم بتحديث معلومات الدخول، بيانات الاتصال، وإعدادات الأمان الخاصة بك.</p>
                    
                    {/* Username Field */}
                    <div className="group cursor-pointer hover:bg-[#16181c] p-2 -mx-2 rounded transition-colors">
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

                    {/* Phone Field */}
                    <div className="group cursor-pointer hover:bg-[#16181c] p-2 -mx-2 rounded transition-colors">
                        <label className="block text-sm text-[#71767b] mb-1">رقم الهاتف</label>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-transparent border-b border-[#2f3336] focus:border-[#1d9bf0] py-2 text-white outline-none transition-colors dir-ltr text-right"
                            placeholder="+966..."
                        />
                    </div>

                    {/* Email Field */}
                    <div className="group cursor-pointer hover:bg-[#16181c] p-2 -mx-2 rounded transition-colors">
                        <label className="block text-sm text-[#71767b] mb-1">البريد الإلكتروني</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-[#2f3336] focus:border-[#1d9bf0] py-2 text-white outline-none transition-colors dir-ltr text-right"
                        />
                    </div>

                    {/* Password Section */}
                    <div className="pt-4 border-t border-[#2f3336]">
                        <div 
                            onClick={() => setIsEditingPass(!isEditingPass)}
                            className="flex justify-between items-center py-3 cursor-pointer hover:bg-[#16181c] px-2 -mx-2 rounded transition-colors"
                        >
                            <div>
                                <h3 className="text-[#e7e9ea] font-medium">كلمة المرور</h3>
                                <p className="text-[#71767b] text-xs">تغيير كلمة المرور الخاصة بك</p>
                            </div>
                            <ChevronLeft className={`w-5 h-5 text-[#71767b] transition-transform ${isEditingPass ? '-rotate-90' : ''}`}/>
                        </div>

                        {isEditingPass && (
                            <div className="p-4 bg-[#16181c] rounded-xl mt-2 space-y-4 animate-fade-in-up">
                                <p className="text-sm text-[#71767b]">سنرسل رابطاً إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور بأمان.</p>
                                <button 
                                    onClick={handlePasswordReset}
                                    className="text-[#1d9bf0] border border-[#1d9bf0] px-4 py-2 rounded-full font-bold text-sm hover:bg-[#1d9bf0]/10 transition-colors w-full"
                                >
                                    إرسال رابط التغيير
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Creation Date (Read Only) */}
                    <div className="py-2 opacity-60">
                        <label className="block text-sm text-[#71767b] mb-1">تاريخ إنشاء الحساب</label>
                        <div className="text-[#e7e9ea] flex items-center gap-2">
                            <Calendar className="w-4 h-4"/>
                            {new Date(user?.createdAt || Date.now()).toLocaleDateString('ar-SA')}
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                            {message.type === 'success' ? <Check className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
                            {message.text}
                        </div>
                    )}

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-[#2f3336]">
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-[#eff3f4] text-black py-3 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-[#d4d8d9] transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
                
                <div className="h-20"></div>

                <div className="space-y-4 border-t border-[#2f3336] pt-6">
                    <h3 className="text-red-500 font-bold mb-2">منطقة الخطر</h3>
                    <button 
                        onClick={handleDeactivate}
                        className="text-red-500 hover:bg-red-900/10 px-4 py-3 w-full text-right rounded-lg transition-colors flex justify-between items-center border border-red-900/30"
                    >
                        <span>تعطيل الحساب نهائياً</span>
                        <Trash2 className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. YOUR DATA (Archive & Export) ---
export const YourDataSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadArchive = () => {
        setDownloading(true);
        setTimeout(() => {
            setDownloading(false);
            alert("تم تجهيز أرشيف بياناتك. جاري التحميل...");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-black text-[#e7e9ea] font-sans" dir="rtl">
            <SettingsHeader title="بياناتك وأذوناتك" onBack={onBack} />
            <div className="p-4 space-y-6">
                <div className="bg-[#16181c] p-6 rounded-2xl border border-[#2f3336]">
                    <Database className="w-8 h-8 text-[#1d9bf0] mb-4"/>
                    <h3 className="text-lg font-bold text-white mb-2">تنزيل أرشيف بياناتك</h3>
                    <p className="text-[#71767b] text-sm mb-6 leading-relaxed">
                        احصل على نسخة كاملة من المعلومات التي شاركتها على منصة ميلاف. يشمل ذلك المنشورات، الوسائط، الرسائل، ومعلومات الملف الشخصي. سيتم إرسال الملف بتنسيق HTML و JSON.
                    </p>
                    <button 
                        onClick={handleDownloadArchive}
                        disabled={downloading}
                        className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white py-3 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                        {downloading ? 'جاري تحضير الأرشيف...' : 'طلب الأرشيف'}
                    </button>
                </div>

                <div className="space-y-1">
                    <div className="px-4 py-3 hover:bg-[#16181c] cursor-pointer flex justify-between items-center transition-colors">
                        <div>
                            <h4 className="text-[#e7e9ea] font-medium text-sm">التطبيقات والجلسات</h4>
                            <p className="text-[#71767b] text-xs">إدارة الأجهزة والتطبيقات المتصلة</p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-[#71767b]"/>
                    </div>
                    <div className="px-4 py-3 hover:bg-[#16181c] cursor-pointer flex justify-between items-center transition-colors">
                        <div>
                            <h4 className="text-[#e7e9ea] font-medium text-sm">تاريخ الحساب</h4>
                            <p className="text-[#71767b] text-xs">سجل التغييرات وعمليات الدخول</p>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-[#71767b]"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. SECURITY SETTINGS ---
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
            alert("حدث خطأ أثناء إرسال البريد. يرجى المحاولة لاحقاً.");
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

                <div className="flex items-center justify-between py-2 px-2 hover:bg-[#16181c] rounded cursor-pointer transition-colors">
                    <div>
                        <h3 className="text-[#e7e9ea] font-bold text-sm">المصادقة الثنائية (2FA)</h3>
                        <p className="text-[#71767b] text-xs mt-1">حماية إضافية لحسابك.</p>
                    </div>
                    <button 
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${twoFactor ? 'bg-emerald-500' : 'bg-[#2f3336]'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${twoFactor ? 'left-1' : 'right-1'}`}></div>
                    </button>
                </div>
                
                <div className="flex items-center justify-between py-2 px-2 hover:bg-[#16181c] rounded cursor-pointer transition-colors">
                    <div>
                        <h3 className="text-[#e7e9ea] font-bold text-sm">حماية إعادة تعيين كلمة المرور</h3>
                        <p className="text-[#71767b] text-xs mt-1">اطلب معلومات إضافية عند طلب إعادة التعيين.</p>
                    </div>
                     <div className="w-10 h-5 rounded-full bg-[#2f3336] relative">
                         <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div>
                     </div>
                </div>

                <div className="h-px bg-[#2f3336]"></div>

                <div className="px-2">
                    <h3 className="text-[#e7e9ea] font-bold mb-4 text-sm">الجلسات النشطة</h3>
                    <div className="flex items-center gap-3 text-sm text-[#71767b] bg-[#16181c] p-3 rounded-lg border border-[#2f3336]">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        هذا الجهاز (Web) · الرياض، السعودية
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- 3. LEGAL SETTINGS ---
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

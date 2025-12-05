
import React, { useState, useRef } from 'react';
import { X, Camera, ShieldCheck, Lock, User, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const IdentityCenter: React.FC<Props> = ({ isOpen, onClose }) => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'security'>('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const kycInputRef = useRef<HTMLInputElement>(null);
    
    // KYC Form State
    const [idNumber, setIdNumber] = useState(user?.nationalId || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !user) return null;

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    updateProfile({ avatar: ev.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleKYCSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate Cyber Security Review Delay
        setTimeout(() => {
            updateProfile({ 
                nationalId: idNumber, 
                kycStatus: 'pending',
                // We keep verified as false until approved by admin (simulated)
                isIdentityVerified: false 
            });
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-2xl bg-[#0f172a] border border-[#d97706]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-[#d97706]"/>
                            مركز الهوية الرقمية
                        </h2>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Digital Identity Management</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-[#0b1120] border-l border-white/10 p-4 space-y-2">
                        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${activeTab==='profile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                            <User className="w-4 h-4"/> الملف الشخصي
                        </button>
                        <button onClick={() => setActiveTab('kyc')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${activeTab==='kyc' ? 'bg-[#d97706] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                            <FileText className="w-4 h-4"/> التوثيق الحكومي
                        </button>
                        <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${activeTab==='security' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                            <Lock className="w-4 h-4"/> أمان الحساب
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto bg-[#0f172a]">
                        
                        {activeTab === 'profile' && (
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <div className="w-32 h-32 rounded-full p-1 border-4 border-[#d97706] shadow-2xl shadow-[#d97706]/20">
                                        <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full rounded-full object-cover"/>
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white"/>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload}/>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">{user.name}</h3>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                        <span className={`w-2 h-2 rounded-full ${user.kycStatus === 'verified' ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                                        <span className="text-xs text-gray-300">
                                            {user.kycStatus === 'verified' ? 'هوية موثقة' : user.kycStatus === 'pending' ? 'قيد المراجعة' : 'غير موثق'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'kyc' && (
                            <div className="space-y-6">
                                <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5 flex items-start gap-4">
                                    <ShieldCheck className={`w-10 h-10 shrink-0 ${user.kycStatus === 'verified' ? 'text-emerald-500' : 'text-gray-500'}`}/>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">حالة التوثيق</h4>
                                        <p className={`text-xs ${user.kycStatus === 'verified' ? 'text-emerald-400' : user.kycStatus === 'pending' ? 'text-[#d97706]' : 'text-red-400'}`}>
                                            {user.kycStatus === 'verified' ? 'حسابك موثق بالكامل ويمكنك استخدام جميع الخدمات.' : 
                                             user.kycStatus === 'pending' ? 'جاري مراجعة الطلب من قبل فريق الأمن السيبراني.' : 
                                             'يرجى إكمال التوثيق للوصول إلى الخدمات المالية والتوظيف.'}
                                        </p>
                                    </div>
                                </div>

                                {user.kycStatus !== 'verified' && user.kycStatus !== 'pending' && (
                                    <form onSubmit={handleKYCSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-1 block">رقم الهوية الوطنية / الإقامة</label>
                                            <input 
                                                required 
                                                value={idNumber} 
                                                onChange={e => setIdNumber(e.target.value)} 
                                                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#d97706]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 mb-1 block">صورة الهوية (الوجه الأمامي)</label>
                                            <div 
                                                onClick={() => kycInputRef.current?.click()}
                                                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 cursor-pointer transition-colors"
                                            >
                                                <Camera className="w-6 h-6 text-gray-500 mx-auto mb-2"/>
                                                <span className="text-xs text-gray-400">اضغط لرفع الصورة</span>
                                                <input type="file" required ref={kycInputRef} className="hidden"/>
                                            </div>
                                        </div>
                                        <button disabled={isSubmitting} className="w-full py-3 bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : 'إرسال للتحقق'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-1 block">كلمة المرور الحالية</label>
                                        <input type="password" class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500"/>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 mb-1 block">كلمة المرور الجديدة</label>
                                        <input type="password" class="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500"/>
                                    </div>
                                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold">تحديث كلمة المرور</button>
                                </div>
                                <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500"/>
                                    <div className="text-xs text-red-300">
                                        تنبيه: سيؤدي تغيير كلمة المرور إلى تسجيل الخروج من جميع الأجهزة الأخرى.
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#0b1120] text-center">
                    <p className="text-[10px] text-gray-500 font-mono flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3"/> إدارة تقنية المعلومات - أكاديمية ميلاف مراد
                    </p>
                </div>
            </div>
        </div>
    );
};

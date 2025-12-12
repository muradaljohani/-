
import React, { useState } from 'react';
import { 
    Fingerprint, Mail, GraduationCap, Shield, Key, 
    ArrowRight, Lock, ScanFace, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

type LoginMethod = 'nafath' | 'email' | 'student';

export const UnifiedPortalGate: React.FC<Props> = ({ isOpen, onClose, onLoginSuccess }) => {
    const { login } = useAuth();
    const [activeMethod, setActiveMethod] = useState<LoginMethod>('email');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for "System Handshake"
        setTimeout(async () => {
            // Unified Login Logic: Maps different inputs to the same auth core
            // In a real app, this would send { type: activeMethod, id: identifier } to backend
            const res = await login({ email: identifier }, password); // Using identifier as email for mock
            
            setIsLoading(false);
            if (res.success) {
                onLoginSuccess();
                onClose();
            } else {
                setError('بيانات الدخول غير صحيحة');
            }
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 font-sans" dir="rtl">
            {/* Backdrop with Blur */}
            <div 
                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* The Glass Nexus Widget */}
            <div className="relative w-full max-w-lg bg-[#1e293b]/70 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
                <button onClick={onClose} className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white transition-colors z-20">
                    <X className="w-6 h-6"/>
                </button>

                <div className="p-8 pb-0 text-center relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
                        <Shield className="w-10 h-10 text-blue-400 fill-blue-400/10"/>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1">بوابة الدخول الموحدة</h2>
                    <p className="text-sm text-gray-400">حساب واحد.. لجميع خدمات المنصة</p>
                </div>

                {/* Tabs */}
                <div className="px-8 mt-8">
                    <div className="flex bg-[#0f172a]/50 p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setActiveMethod('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeMethod === 'email' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Mail className="w-4 h-4"/> البريد
                        </button>
                        <button 
                            onClick={() => setActiveMethod('nafath')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeMethod === 'nafath' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Fingerprint className="w-4 h-4"/> نفاذ
                        </button>
                        <button 
                            onClick={() => setActiveMethod('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeMethod === 'student' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <GraduationCap className="w-4 h-4"/> أكاديمي
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold mr-1">
                                {activeMethod === 'email' ? 'البريد الإلكتروني' : activeMethod === 'nafath' ? 'رقم الهوية الوطنية' : 'الرقم الأكاديمي'}
                            </label>
                            <div className="relative group">
                                <input 
                                    type={activeMethod === 'email' ? 'email' : 'text'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl py-3.5 px-4 pl-10 text-white outline-none focus:border-blue-500/50 transition-colors text-right dir-rtl group-hover:border-white/20"
                                    placeholder={activeMethod === 'email' ? 'name@example.com' : '10xxxxxxxxx'}
                                />
                                <div className="absolute left-3 top-3.5 text-gray-500">
                                    {activeMethod === 'email' ? <Mail className="w-5 h-5"/> : activeMethod === 'nafath' ? <ScanFace className="w-5 h-5"/> : <GraduationCap className="w-5 h-5"/>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 font-bold mr-1">كلمة المرور</label>
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0f172a]/50 border border-white/10 rounded-xl py-3.5 px-4 pl-10 text-white outline-none focus:border-blue-500/50 transition-colors text-right group-hover:border-white/20"
                                    placeholder="••••••••"
                                />
                                <Key className="absolute left-3 top-3.5 w-5 h-5 text-gray-500"/>
                            </div>
                        </div>

                        {error && <div className="text-red-400 text-xs text-center font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</div>}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 ${
                                activeMethod === 'email' ? 'bg-blue-600 hover:bg-blue-500' : 
                                activeMethod === 'nafath' ? 'bg-emerald-600 hover:bg-emerald-500' : 
                                'bg-purple-600 hover:bg-purple-500'
                            }`}
                        >
                            {isLoading ? (
                                <span className="animate-pulse">جاري التحقق الآمن...</span>
                            ) : (
                                <>
                                    دخول آمن <ArrowRight className="w-5 h-5 rtl:rotate-180"/>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3"/> اتصال مشفر بتقنية SSL 256-bit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

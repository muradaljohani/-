
import React, { useState } from 'react';
import { X, Fingerprint, Loader2, AlertCircle, Eye, EyeOff, UserPlus, User, Mail, Smartphone, Building2, Lock, FileText, ArrowRight, Github, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginProvider } from '../types';
import { RealAuthService } from '../services/realAuthService';
import { PhoneVerifyModal } from './Social/PhoneVerifyModal';
import { auth, db, doc, getDoc } from '../src/lib/firebase';
import { logoutUser } from '../src/services/authService';

// --- SOCIAL ICONS ---
const Icons = {
  Apple: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 66.2 23.9 122.2 52.4 167.5 20.3 32.2 44.8 68.4 75.5 67.3 29.9-1.1 40.4-23.1 76.2-23.1 35.8 0 45.9 22.3 76.6 22.6 29.9 .3 54.9-38.6 74.5-66.8 15-21.3 28.7-47 34.6-60.4-62.8-25.4-66.2-107-1.2-134.9l.2-.1zM208.8 99.6c19-22.5 31.8-54.1 28.4-85.9-21 1.4-47.1 12.8-62.9 31-15 16.9-29.4 46.3-25.2 76.5 23.2 2 48.4-10.1 59.7-21.6z"/></svg>,
  Twitter: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
  Facebook: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.859-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.657-2.797 2.895v1.076h3.614l-.473 3.667h-3.141v7.98h-.949c-1.374 0-2.673 0-4.039 0z"/></svg>,
  Google: () => <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/Google__G__Logo.svg" alt="Google" className="w-5 h-5" />,
  Microsoft: () => <svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>,
  Yahoo: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /> 
    </svg>
  )
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, signInWithProvider } = useAuth();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Register State
  const [regData, setRegData] = useState({
      fullName: '',
      nationalId: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
  });

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // --- Handlers ---
  
  const handleLogin = async (provider?: LoginProvider) => {
      setError(null);
      setIsLoading(true);
      
      try {
          if (provider && ['google', 'facebook', 'twitter', 'github', 'yahoo', 'microsoft'].includes(provider)) {
              await signInWithProvider(provider);
              onLoginSuccess?.();
          } else if (provider === 'nafath') {
              // Legacy/Mock providers
              const res = await RealAuthService.requestNafathLogin('1010101010');
              if (res.status === 'WAITING') {
                   setTimeout(async () => {
                       await login({ name: 'مواطن (نفاذ)', isIdentityVerified: true });
                       onLoginSuccess?.();
                   }, 2000);
              }
          } else if (provider === 'apple') {
             await login({ name: 'Apple User', loginMethod: 'apple' });
             onLoginSuccess?.();
          } else {
              // Email Login
              const res = await login({ email: loginEmail }, loginPass);
              if (res.success) {
                  onLoginSuccess?.();
              } else {
                  setError(res.error || 'فشل تسجيل الدخول');
              }
          }
      } catch (e: any) {
          console.error("Login Error:", e);
          setError(e.message || 'حدث خطأ أثناء تسجيل الدخول');
      } finally {
          setIsLoading(false);
      }
  };

  const handleRegister = async () => {
      setError(null);
      if (!regData.fullName || !regData.nationalId || !regData.phone || !regData.email || !regData.password) {
          setError('جميع الحقول مطلوبة');
          return;
      }
      if (regData.password !== regData.confirmPassword) {
          setError('كلمة المرور غير متطابقة');
          return;
      }

      setIsLoading(true);
      try {
          // Simulate registration API call
          setTimeout(async () => {
              // On success, auto-login
              await login({
                  name: regData.fullName,
                  email: regData.email,
                  phone: regData.phone,
                  nationalId: regData.nationalId,
                  role: 'student',
                  isIdentityVerified: false, 
                  isPhoneVerified: false // Ensure new users are not verified by default
              }, regData.password);
              
              onLoginSuccess?.();
              setIsLoading(false);
          }, 1500);
      } catch (e) {
          setError('فشل إنشاء الحساب');
          setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up font-sans text-right" dir="rtl">
          
          {/* Header Tabs */}
          <div className="flex border-b border-gray-100">
              <button 
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                  تسجيل الدخول
              </button>
              <button 
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'register' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                  تسجيل جديد (النموذج المعتمد)
              </button>
          </div>
          
          <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 z-10">
              <X className="w-5 h-5"/>
          </button>

          <div className="p-8 max-h-[80vh] overflow-y-auto">
              
              {/* --- LOGIN VIEW --- */}
              {activeTab === 'login' && (
                  <>
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-gray-900 mb-1">مرحباً بعودتك</h2>
                        <p className="text-sm text-gray-500">اختر طريقة الدخول المفضلة لديك</p>
                    </div>

                    {/* Vertical Stack: Google, Phone, GitHub, Microsoft, Facebook, Yahoo */}
                    <div className="flex flex-col gap-3 mb-6">
                        
                        {/* 1. Google */}
                        <button 
                            disabled={isLoading}
                            onClick={() => handleLogin('google')}
                            className="flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-200 py-3.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold text-sm relative"
                        >
                            <div className="absolute right-4"><Icons.Google /></div>
                            تسجيل الدخول بـ Google
                        </button>

                        {/* 2. Phone Number (Nafath/Phone) */}
                        <button 
                            disabled={isLoading}
                            onClick={() => handleLogin('nafath')}
                            className="flex items-center justify-center gap-3 bg-[#10b981] hover:bg-[#059669] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 relative"
                        >
                            <div className="absolute right-4"><Phone className="w-5 h-5" /></div>
                            رقم الجوال
                        </button>

                        {/* 3. GitHub */}
                        <button 
                            disabled={isLoading} 
                            onClick={() => handleLogin('github')} 
                            className="flex items-center justify-center gap-3 bg-[#24292f] text-white py-3.5 rounded-xl hover:bg-[#1b1f23] transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold text-sm relative"
                        >
                            <div className="absolute right-4"><Github className="w-5 h-5" /></div>
                            GitHub
                        </button>

                        {/* 4. Microsoft */}
                        <button 
                            disabled={isLoading} 
                            onClick={() => handleLogin('microsoft')} 
                            className="flex items-center justify-center gap-3 bg-[#2f2f2f] text-white py-3.5 rounded-xl hover:bg-[#1f1f1f] transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold text-sm relative"
                        >
                            <div className="absolute right-4"><Icons.Microsoft /></div>
                            Microsoft
                        </button>

                        {/* 5. Facebook */}
                        <button 
                            disabled={isLoading} 
                            onClick={() => handleLogin('facebook')} 
                            className="flex items-center justify-center gap-3 bg-[#1877f2] text-white py-3.5 rounded-xl hover:bg-[#156ad8] transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold text-sm relative"
                        >
                             <div className="absolute right-4"><Icons.Facebook /></div>
                             Facebook
                        </button>
                        
                        {/* 6. Yahoo */}
                        <button 
                            disabled={isLoading} 
                            onClick={() => handleLogin('yahoo')} 
                            className="flex items-center justify-center gap-3 bg-[#6001d2] text-white py-3.5 rounded-xl hover:bg-[#5000b0] transition-all shadow-sm active:scale-95 disabled:opacity-50 font-bold text-sm relative"
                        >
                             <div className="absolute right-4"><Icons.Yahoo /></div>
                             تسجيل الدخول بـ Yahoo
                        </button>
                    </div>

                    <div className="relative text-center my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                        <span className="relative bg-white px-4 text-xs text-gray-400 font-bold uppercase tracking-wider">أو بالبريد الإلكتروني</span>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">البريد الإلكتروني</label>
                            <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" placeholder="name@example.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">كلمة المرور</label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} value={loginPass} onChange={e=>setLoginPass(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium" placeholder="••••••••" />
                                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute left-3 top-3 text-gray-400 hover:text-gray-600">
                                    {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                        </div>
                        
                        {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}

                        <button type="submit" disabled={isLoading} className="w-full bg-[#1e293b] hover:bg-black text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'دخول'}
                        </button>
                    </form>

                    <div className="mt-6 flex justify-center gap-4 pt-6 border-t border-gray-100">
                         <button onClick={() => handleLogin('apple')} className="text-gray-400 hover:text-black transition-colors text-xs font-bold flex items-center gap-1">
                             <Icons.Apple /> تسجيل دخول Apple
                         </button>
                    </div>
                  </>
              )}

              {/* --- REGISTER VIEW --- */}
              {activeTab === 'register' && (
                  <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="mb-4 text-center">
                          <h2 className="text-xl font-black text-gray-900">إنشاء حساب جديد</h2>
                          <p className="text-xs text-gray-500">النموذج المعتمد لتسجيل الأعضاء</p>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">الاسم الرباعي (كما في الهوية)</label>
                          <div className="relative">
                              <input required type="text" value={regData.fullName} onChange={e=>setRegData({...regData, fullName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" placeholder="الاسم الكامل" />
                              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">رقم الهوية / الإقامة</label>
                          <div className="relative">
                              <input required type="text" value={regData.nationalId} onChange={e=>setRegData({...regData, nationalId: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" placeholder="10xxxxxxxxx" />
                              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">رقم الجوال</label>
                          <div className="relative">
                              <input required type="tel" value={regData.phone} onChange={e=>setRegData({...regData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" placeholder="05xxxxxxxx" />
                              <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">البريد الإلكتروني</label>
                          <div className="relative">
                              <input required type="email" value={regData.email} onChange={e=>setRegData({...regData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" placeholder="email@domain.com" />
                              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">كلمة المرور</label>
                              <input required type="password" value={regData.password} onChange={e=>setRegData({...regData, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" placeholder="******" />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">تأكيد كلمة المرور</label>
                              <input required type="password" value={regData.confirmPassword} onChange={e=>setRegData({...regData, confirmPassword: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm" placeholder="******" />
                          </div>
                      </div>

                      {error && <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}

                      <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><UserPlus className="w-5 h-5"/> إنشاء الحساب</>}
                      </button>
                      
                      <p className="text-xs text-center text-gray-400 mt-4">
                          بإنشاء حساب، أنت توافق على <span className="text-blue-500 cursor-pointer">شروط الاستخدام</span> و <span className="text-blue-500 cursor-pointer">سياسة الخصوصية</span>.
                      </p>
                  </form>
              )}
          </div>
      </div>
    </div>
  );
};

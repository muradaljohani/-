
import React, { useState, useRef } from 'react';
import { X, Fingerprint, ArrowRight, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, UserPlus, User, Globe, GraduationCap, ScanFace, FileCheck, Mail, Smartphone, MapPin, Building2, BookOpen, Lock, Upload, CreditCard, Calendar, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginProvider, RegistrationData } from '../types';
import { RealAuthService } from '../services/realAuthService';

// --- SOCIAL ICONS ---
const Icons = {
  Apple: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 66.2 23.9 122.2 52.4 167.5 20.3 32.2 44.8 68.4 75.5 67.3 29.9-1.1 40.4-23.1 76.2-23.1 35.8 0 45.9 22.3 76.6 22.6 29.9 .3 54.9-38.6 74.5-66.8 15-21.3 28.7-47 34.6-60.4-62.8-25.4-66.2-107-1.2-134.9l.2-.1zM208.8 99.6c19-22.5 31.8-54.1 28.4-85.9-21 1.4-47.1 12.8-62.9 31-15 16.9-29.4 46.3-25.2 76.5 23.2 2 48.4-10.1 59.7-21.6z"/></svg>,
  Microsoft: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H1z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H1z"/></svg>,
  Twitter: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
  Facebook: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.412h5.591l-.761 3.668h-4.83v7.98c6.6-1.07 11.607-6.798 11.607-13.691C21.552 4.439 16.395 0 10.051 0 3.706 0-1.451 4.439-1.451 10.929c0 6.893 5.008 12.621 11.608 13.691"/></svg>,
  Google: () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Instagram: () => <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.9 0-184.9zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, register } = useAuth();
  
  // State
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleLogin = async (provider?: LoginProvider) => {
      setError(null);
      setIsLoading(true);
      
      if (provider) {
          // Social Login Mock
          const res = await RealAuthService.exchangeOAuthCode(provider, 'mock_code');
          if (res.success && res.user) {
              await login({ ...res.user, loginMethod: provider });
              onLoginSuccess?.();
          } else {
              setError('فشل تسجيل الدخول');
          }
      } else {
          // Email Login
          const res = await login({ email: loginEmail }, loginPass);
          if (res.success) {
              onLoginSuccess?.();
          } else {
              setError(res.error || 'فشل تسجيل الدخول');
          }
      }
      setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up font-sans text-right" dir="rtl">
          
          <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h2>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X className="w-5 h-5 text-gray-600"/></button>
              </div>

              {/* Nafath Button */}
              <button 
                  onClick={() => handleLogin('nafath')}
                  className="w-full bg-[#006e4e] hover:bg-[#005a40] text-white py-3 rounded-xl font-bold mb-4 flex items-center justify-center gap-3 shadow-lg transition-all"
              >
                  <Fingerprint className="w-6 h-6"/>
                  تسجيل الدخول عبر النفاذ الوطني الموحد
              </button>

              <div className="relative text-center my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <span className="relative bg-white px-4 text-sm text-gray-400 font-bold">أو</span>
              </div>

              {/* Email Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">رقم الجوال أو البريد الإلكتروني</label>
                      <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors" placeholder="user@example.com" />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">كلمة المرور</label>
                      <div className="relative">
                          <input type={showPass ? 'text' : 'password'} value={loginPass} onChange={e=>setLoginPass(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
                          <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute left-3 top-3 text-gray-400 hover:text-gray-600">
                              {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                          </button>
                      </div>
                  </div>
                  
                  {error && <div className="text-red-500 text-xs font-bold">{error}</div>}

                  <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'دخول'}
                  </button>
              </form>

              <div className="mt-6 flex justify-center gap-4 border-t border-gray-100 pt-4">
                  <button onClick={() => handleLogin('google')} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"><Icons.Google /></button>
                  <button onClick={() => handleLogin('apple')} className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"><Icons.Apple /></button>
                  <button onClick={() => handleLogin('twitter')} className="p-3 bg-blue-50 text-blue-500 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"><Icons.Twitter /></button>
              </div>
          </div>
      </div>
    </div>
  );
};

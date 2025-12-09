
import React, { useState } from 'react';
import { ShieldCheck, Building2, Globe, Mail, Phone, MapPin, Code, Layout, TrendingUp, CheckCircle2 } from 'lucide-react';
import { AssetProcessor } from '../services/System/AssetProcessor';
import { PolicyModal } from './PolicyModal';

export const Footer: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => {
  const assetProcessor = AssetProcessor.getInstance();
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  if (compact) {
      return (
        <footer className={`bg-transparent border-t border-slate-200/50 pt-8 pb-8 font-sans text-right ${className}`} dir="rtl">
            <div className="text-center text-xs text-slate-500">
                © 2025 مجموعة مراد. جميع الحقوق محفوظة.
            </div>
        </footer>
      );
  }

  return (
    <>
    <footer className={`bg-[#0b1120]/80 backdrop-blur-xl border-t border-white/10 pt-16 pb-8 font-sans text-right relative overflow-hidden ${className}`} dir="rtl">
        {/* Glass Effect Background Noise */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Top Section: Brand & Licenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                
                {/* Brand Identity */}
                <div className="col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10">M</div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">مجموعة ميلاف مراد</h3>
                            <p className="text-xs text-blue-400 font-mono">Murad Aljohani IT Group</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-8">
                        كيان تقني وطني رائد، يقدم حلولاً شاملة في التوظيف، التدريب، والتحول الرقمي. ملتزمون ببناء بنية تحتية رقمية تخدم رؤية المملكة 2030.
                    </p>

                    {/* OFFICIAL LICENSES (Wathaiq) */}
                    <div className="mb-8">
                        <h4 className="text-white font-bold text-xs mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500"/> التراخيص الرسمية (وثائق العمل الحر)
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {['FL-992833674', 'FL-813298187', 'FL-753406901'].map((code) => (
                                <div key={code} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-default">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500"/>
                                    <span className="text-[10px] font-mono text-gray-300 tracking-wider">{code}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* OFFICIAL SEAL DISPLAY - CLEAN VERSION */}
                    <div className="flex items-center justify-center md:justify-start">
                        <div className="relative group cursor-pointer" title="ختم الاعتماد الرسمي">
                            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img 
                                src={assetProcessor.getOfficialSeal()} 
                                alt="ختم الأكاديمية المعتمد" 
                                className="w-24 h-24 object-contain relative z-10 drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
                                style={{ mixBlendMode: 'normal' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Services / Specializations */}
                <div>
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500"/> مجالات التخصص
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-0.5"><Code className="w-4 h-4"/></div>
                            <div>
                                <h5 className="text-white text-sm font-bold">هندسة برمجيات</h5>
                                <p className="text-[10px] text-gray-500">تطوير أنظمة سحابية وتطبيقات</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 mt-0.5"><Layout className="w-4 h-4"/></div>
                            <div>
                                <h5 className="text-white text-sm font-bold">تطوير وتصميم المواقع الالكترونية</h5>
                                <p className="text-[10px] text-gray-500">UI/UX وتجارب مستخدم عصرية</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 mt-0.5"><TrendingUp className="w-4 h-4"/></div>
                            <div>
                                <h5 className="text-white text-sm font-bold">تسويق وادارة المبيعات</h5>
                                <p className="text-[10px] text-gray-500">خطط استراتيجية ونمو رقمي</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Legal */}
                <div>
                    <h4 className="text-white font-bold mb-6">معلومات التواصل</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                            <Mail className="w-4 h-4 text-blue-500 group-hover:text-blue-400"/>
                            <span>im_murad7@hotmail.com</span>
                        </li>
                        <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                            <Phone className="w-4 h-4 text-blue-500 group-hover:text-blue-400"/>
                            <a href="tel:0590113665" dir="ltr">0590113665</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-blue-500"/>
                            <span>الرياض، المملكة العربية السعودية</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8 text-center">
                <p className="text-xs text-gray-500">
                    © 2025 جميع الحقوق محفوظة لـ <span className="text-white font-bold">شركة مراد الجهني لتقنية المعلومات العالمية</span>.
                </p>
                <div className="mt-4 flex justify-center gap-6 text-[10px] text-gray-600 font-medium">
                    <button onClick={() => setIsPolicyOpen(true)} className="hover:text-gray-400 transition-colors">سياسة الخصوصية وشروط الاستخدام</button>
                    <button onClick={() => setIsPolicyOpen(true)} className="hover:text-gray-400 transition-colors">اتفاقية مستوى الخدمة (SLA)</button>
                </div>
            </div>
        </div>
    </footer>
    <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </>
  );
};
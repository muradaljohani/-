
import React, { useState } from 'react';
import { PolicyModal } from './PolicyModal';
import { AssetProcessor } from '../services/System/AssetProcessor';
import { BadgeCheck, LifeBuoy, Building2, Zap, Globe, Clock, Cloud } from 'lucide-react';
import { SEODirectory } from './SEODirectory';

interface FooterProps {
  compact?: boolean;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ compact = false, className = '' }) => {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const assetProcessor = AssetProcessor.getInstance();

  const licenses = [
      { id: 'FL-992833674', title: 'هندسة برمجيات' },
      { id: 'FL-813298187', title: 'برمجة وتطوير المواقع الالكترونية' },
      { id: 'FL-753406901', title: 'ادارة وتنشيط المبيعات' }
  ];

  // --- SPA NAVIGATION HANDLER ---
  const handleNav = (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      window.history.pushState({}, '', path);
      // Trigger App.tsx routing
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
  };

  return (
    <>
    {/* SEO Directory Section - The 1000 Link Engine */}
    {!compact && <SEODirectory />}

    <footer style={{background:'#f3f3f3', color: '#333', fontFamily: 'Tajawal, sans-serif'}} className={`relative pt-12 pb-8 ${className}`} dir="rtl">
        
        <div className="max-w-7xl mx-auto px-4">
            
            {/* Sitemap & Links Grid (Hierarchical Structure for SEO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-right">
                
                {/* Column 1: Brand */}
                <div>
                    <h3 className="font-black text-xl text-[#1e293b] mb-4">مجموعة ميلاف مراد</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        المنصة الوطنية الرائدة في مجال التدريب المهني والتوظيف الإلكتروني. مسجلة رسمياً ومرخصة من الجهات المعنية.
                    </p>
                    <div className="flex gap-2">
                        <a href="https://twitter.com/IpMurad" className="text-gray-400 hover:text-blue-500"><BadgeCheck className="w-5 h-5"/></a>
                    </div>
                </div>

                {/* Column 2: Main Sections (Sitelinks Targets) */}
                <div>
                    <h4 className="font-bold text-[#1e293b] mb-4 text-sm uppercase tracking-wider">أقسام المنصة</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/jobs" onClick={(e) => handleNav(e, '/jobs')} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">بوابة الوظائف</a></li>
                        <li><a href="/academy" onClick={(e) => handleNav(e, '/academy')} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">الأكاديمية والتدريب</a></li>
                        <li><a href="/market" onClick={(e) => handleNav(e, '/market')} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">سوق الخدمات</a></li>
                        <li><a href="/haraj" onClick={(e) => handleNav(e, '/haraj')} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">الحراج الإلكتروني</a></li>
                        <li><a href="/publish" onClick={(e) => handleNav(e, '/publish')} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">بوابة النشر</a></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div>
                    <h4 className="font-bold text-[#1e293b] mb-4 text-sm uppercase tracking-wider">الدعم والمساعدة</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/group" onClick={(e) => handleNav(e, '/group')} className="text-indigo-600 font-bold hover:text-indigo-700 hover:translate-x-1 transition-all inline-block flex items-center gap-2"><Building2 className="w-4 h-4"/> شركة مراد الجهني (Corporate)</a></li>
                        <li><a href="/dopamine" onClick={(e) => handleNav(e, '/dopamine')} className="text-purple-600 font-bold hover:text-purple-700 hover:translate-x-1 transition-all inline-block flex items-center gap-2"><Zap className="w-4 h-4"/> مراد دوبامين (Site Builder)</a></li>
                        <li><a href="/support" onClick={(e) => handleNav(e, '/support')} className="text-emerald-600 font-bold hover:text-emerald-700 hover:translate-x-1 transition-all inline-block flex items-center gap-2"><LifeBuoy className="w-4 h-4"/> مركز مراد كير (Murad Care)</a></li>
                        <li><a href="/cloud" onClick={(e) => handleNav(e, '/cloud')} className="text-cyan-600 font-bold hover:text-cyan-700 hover:translate-x-1 transition-all inline-block flex items-center gap-2"><Cloud className="w-4 h-4"/> مراد كلاود (Tech Blog)</a></li>
                        <li><a href="/domains" onClick={(e) => handleNav(e, '/domains')} className="text-teal-600 font-bold hover:text-teal-700 hover:translate-x-1 transition-all inline-block flex items-center gap-2"><Globe className="w-4 h-4"/> مراد دومين (Murad Domain)</a></li>
                        <li><a href="/murad-clock" onClick={(e) => handleNav(e, '/murad-clock')} className="text-blue-700 font-bold hover:text-blue-800 hover:translate-x-1 transition-all inline-block flex items-center gap-2"><Clock className="w-4 h-4"/> مراد كلوك (Murad Clock)</a></li>
                        <li><a href="/sitemap" onClick={(e) => handleNav(e, '/sitemap')} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block font-bold">خريطة الموقع (Sitemap)</a></li>
                        <li><button onClick={() => setIsPolicyOpen(true)} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">سياسة الخصوصية</button></li>
                        <li><button onClick={() => setIsPolicyOpen(true)} className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">شروط الاستخدام</button></li>
                    </ul>
                </div>

                {/* Column 4: Contact & Licenses */}
                <div>
                    <h4 className="font-bold text-[#1e293b] mb-4 text-sm uppercase tracking-wider">التراخيص الرسمية</h4>
                    <div className="space-y-2">
                        {licenses.map((lic, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white border border-[#d97706]/20 px-3 py-2 rounded-lg">
                                <BadgeCheck className="w-4 h-4 text-[#d97706]" />
                                <div className="flex flex-col text-right">
                                    <span className="text-[10px] text-[#b45309] font-bold leading-none">وثيقة عمل حر</span>
                                    <span className="text-[9px] font-mono text-gray-500">{lic.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Bar: Copyright & Seals */}
            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                
                <div className="text-center md:text-right">
                    <p className="text-sm font-bold text-[#1e293b]">© 2025 شركة مراد الجهني لتقنية المعلومات. جميع الحقوق محفوظة.</p>
                    <div className="text-xs text-gray-500 mt-1">
                        System ID: .im-murad7
                    </div>
                </div>

                {/* Trust Seals */}
                <div className="flex items-center gap-6" dir="ltr">
                    {/* SBC Seal */}
                    <div className="flex flex-col items-center group cursor-pointer">
                        <div className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="#165B33" stroke="#CBA258" strokeWidth="2"/>
                                <path d="M50 20 L50 80" stroke="#CBA258" strokeWidth="1" strokeDasharray="4 2"/>
                                <text x="50" y="85" fontSize="8" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">SBC</text>
                            </svg>
                        </div>
                        <span className="text-[8px] text-[#165B33] font-bold">معروف</span>
                    </div>

                    <div className="h-8 w-px bg-gray-300"></div>

                    {/* Official Seal */}
                    <div className="relative group">
                        <img 
                            src={assetProcessor.getOfficialSeal()} 
                            alt="Official Seal" 
                            className="w-16 h-16 group-hover:scale-105 transition-transform"
                            style={assetProcessor.getStampStyle(-3)}
                        />
                    </div>
                </div>

            </div>
        </div>

    </footer>
    
    <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </>
  );
};

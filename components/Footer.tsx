
import React, { useState } from 'react';
import { PolicyModal } from './PolicyModal';
import { AssetProcessor } from '../services/System/AssetProcessor';
import { BadgeCheck } from 'lucide-react';

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

  return (
    <>
    <footer style={{background:'#f3f3f3', padding:'40px 20px', marginTop:'40px', color: '#333', fontFamily: 'Tajawal, sans-serif'}} className={`relative ${className}`} dir="rtl">
        
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 max-w-7xl mx-auto">
            
            {/* Right Side: Copyright & Licenses */}
            <div className="flex-1 text-center lg:text-right w-full">
                <p style={{fontSize:'18px', marginBottom:'20px', fontWeight:'bold', color: '#1e293b'}}>
                    © 2025 شركة مراد الجهني العالمية لتقنية المعلومات — جميع الحقوق محفوظة
                </p>
                
                {/* Freelance Licenses Grid */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                    {licenses.map((lic, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white border border-[#d97706]/20 px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <BadgeCheck className="w-5 h-5 text-[#d97706]" />
                            <div className="flex flex-col text-right">
                                <span className="text-[9px] text-[#b45309] font-bold leading-none mb-1">وثيقة عمل حر</span>
                                <span className="text-[10px] font-black text-[#1e293b] leading-tight">{lic.title}</span>
                                <span className="text-[9px] text-gray-500 font-mono tracking-wider">({lic.id})</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Links */}
                <div className="flex justify-center lg:justify-start gap-[20px] flex-wrap border-t border-gray-200 pt-4">
                    <button onClick={() => setIsPolicyOpen(true)} style={{margin:'0 10px', background:'none', border:'none', cursor:'pointer', color:'#555', fontWeight:'500', fontSize:'14px', transition: 'color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.color = '#007bff'} onMouseOut={(e) => e.currentTarget.style.color = '#555'}>
                        سياسة الخصوصية
                    </button>
                    <button onClick={() => setIsPolicyOpen(true)} style={{margin:'0 10px', background:'none', border:'none', cursor:'pointer', color:'#555', fontWeight:'500', fontSize:'14px', transition: 'color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.color = '#007bff'} onMouseOut={(e) => e.currentTarget.style.color = '#555'}>
                        الشروط والأحكام
                    </button>
                    <a href="mailto:support@murad-group.com" style={{margin:'0 10px', textDecoration:'none', color:'#555', fontWeight:'500', fontSize:'14px', transition: 'color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.color = '#007bff'} onMouseOut={(e) => e.currentTarget.style.color = '#555'}>
                        تواصل معنا
                    </a>
                </div>
            </div>

            {/* Left Side: Seals & Accreditations */}
            <div className="flex flex-row items-center gap-8 justify-center lg:justify-end w-full lg:w-auto" dir="ltr">
                
                {/* Saudi Business Center Logo */}
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-2 opacity-90 hover:opacity-100 transition-opacity">
                        {/* SBC Logo SVG */}
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="#165B33" stroke="#CBA258" strokeWidth="2"/>
                            <path d="M50 20 L50 80" stroke="#CBA258" strokeWidth="1" strokeDasharray="4 2"/>
                            <path d="M25 35 L75 35" stroke="#CBA258" strokeWidth="1" strokeDasharray="4 2"/>
                            <circle cx="50" cy="50" r="15" fill="#fff"/>
                            <path d="M45 50 L55 50 M50 45 L50 55" stroke="#165B33" strokeWidth="3" strokeLinecap="round"/>
                            <text x="50" y="85" fontSize="6" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">SBC</text>
                        </svg>
                    </div>
                    <span className="text-[#165B33] font-bold text-sm bg-[#165B33]/10 px-3 py-0.5 rounded-full">معتمد</span>
                </div>

                {/* Divider */}
                <div className="h-16 w-px bg-gray-300"></div>

                {/* Official Murad Seal */}
                <div className="relative group flex flex-col items-center">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                        Official Academy Seal
                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                    </div>
                    <img 
                        src={assetProcessor.getOfficialSeal()} 
                        alt="Official Seal" 
                        className="w-28 h-28 group-hover:scale-105 transition-transform duration-300"
                        style={assetProcessor.getStampStyle(-3)}
                    />
                </div>

            </div>

        </div>

    </footer>
    
    <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </>
  );
};

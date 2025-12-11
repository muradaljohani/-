
import React from 'react';
import { ArrowRight, User, Lock, Shield, FileText, ChevronLeft, Search, Database } from 'lucide-react';
import { AccountSettings, SecuritySettings, LegalSettings, YourDataSettings } from './SettingsSubPages';

interface Props {
  subSection?: string;
  onNavigate: (path: string) => void;
  onBack: () => void;
}

export const SettingsLayout: React.FC<Props> = ({ subSection, onNavigate, onBack }) => {

  // --- RENDER SUB-PAGES ---
  if (subSection === 'account') return <AccountSettings onBack={() => onNavigate('settings')} />;
  if (subSection === 'your_data') return <YourDataSettings onBack={() => onNavigate('settings')} />;
  if (subSection === 'security') return <SecuritySettings onBack={() => onNavigate('settings')} />;
  if (subSection === 'legal') return <LegalSettings onBack={() => onNavigate('settings')} />;
  // Add 'privacy' mapping to legal or security for now, or add specific component if needed
  if (subSection === 'privacy') return <LegalSettings onBack={() => onNavigate('settings')} />;


  // --- MAIN MENU RENDER ---
  const MenuLink = ({ icon: Icon, title, desc, path }: any) => (
    <div 
      onClick={() => onNavigate(`settings/${path}`)}
      className="flex items-start gap-4 py-4 px-4 hover:bg-[#16181c] cursor-pointer transition-colors border-b border-[#2f3336]/30"
    >
      <div className="text-[#71767b] mt-1">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="text-[#e7e9ea] font-medium text-[15px]">{title}</h3>
          <ChevronLeft className="w-4 h-4 text-[#71767b]" />
        </div>
        <p className="text-[#71767b] text-[13px] leading-snug mt-0.5">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black font-sans" dir="rtl">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
        <div className="flex items-center gap-6 px-4 h-[53px]">
          <button onClick={onBack} className="p-2 -mr-2 rounded-full hover:bg-[#18191c] transition-colors">
            <ArrowRight className="w-5 h-5 text-[#e7e9ea] rtl:rotate-180" />
          </button>
          <h2 className="text-xl font-bold text-[#e7e9ea]">الإعدادات</h2>
        </div>
      </div>

      {/* Search Bar (Visual) */}
      <div className="px-4 py-2">
        <div className="relative group">
            <input 
                type="text" 
                placeholder="البحث في الإعدادات" 
                className="w-full bg-[#202327] text-[#e7e9ea] text-sm rounded-full py-2.5 pr-10 pl-4 border border-transparent focus:border-[#1d9bf0] focus:bg-black focus:outline-none transition-all placeholder-[#71767b]"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#71767b]" />
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-2">
        <MenuLink 
          icon={User} 
          title="حسابك" 
          desc="الاطلاع على معلومات الحساب، تغيير اسم المستخدم."
          path="account"
        />
        <MenuLink 
            icon={Database} 
            title="بياناتك وأذوناتك" 
            desc="تنزيل أرشيف البيانات، إدارة الجلسات."
            path="your_data"
        />
        <MenuLink 
          icon={Lock} 
          title="الأمان والوصول" 
          desc="إدارة أمان حسابك، المصادقة الثنائية."
          path="security"
        />
        <MenuLink 
          icon={Shield} 
          title="الخصوصية والأمان" 
          desc="إدارة المعلومات التي تشاركها ومن يستطيع رؤيتها."
          path="privacy"
        />
        <MenuLink 
          icon={FileText} 
          title="الموارد القانونية" 
          desc="الشروط والأحكام، سياسة الخصوصية."
          path="legal"
        />
      </div>
    </div>
  );
};

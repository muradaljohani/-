
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, User, Lock, DollarSign, Zap, 
  Shield, Bell, Eye, FileText, ChevronRight, X, ChevronLeft, ArrowRight
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

type SettingsView = 'main' | 'terms' | 'privacy_policy';

export const SettingsPage: React.FC<Props> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  // --- SUB-COMPONENT: SETTINGS ITEM ---
  const SettingsItem = ({ icon: Icon, title, desc, onClick }: any) => (
    <div 
      onClick={onClick}
      className="flex items-start gap-4 py-4 px-4 hover:bg-[#16181c] cursor-pointer transition-colors"
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

  // --- VIEW: TERMS & CONDITIONS ---
  const TermsView = () => (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center gap-6 px-4 h-14 border-b border-[#2f3336] sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <button onClick={() => setCurrentView('main')} className="p-2 -mr-2 rounded-full hover:bg-[#18191c]">
          <ArrowRight className="w-5 h-5 text-[#e7e9ea]" />
        </button>
        <h2 className="text-xl font-bold text-[#e7e9ea]">الشروط والأحكام</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 text-[#e7e9ea] space-y-6 dir-rtl">
        <h3 className="text-lg font-bold">1. مقدمة</h3>
        <p className="text-[#71767b] text-sm leading-relaxed">
          مرحباً بك في مجتمع ميلاف ("المنصة"). تحكم شروط الاستخدام هذه استخدامك للمنصة والخدمات المرتبطة بها. من خلال الوصول إلى المنصة، فإنك توافق على الالتزام بهذه الشروط.
        </p>

        <h3 className="text-lg font-bold">2. حساب المستخدم</h3>
        <p className="text-[#71767b] text-sm leading-relaxed">
          أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث ضمن حسابك. يجب أن تكون البيانات المقدمة (الاسم، الهوية) صحيحة ومطابقة للواقع.
        </p>

        <h3 className="text-lg font-bold">3. المحتوى والسلوك</h3>
        <p className="text-[#71767b] text-sm leading-relaxed">
          يمنع نشر أي محتوى يخالف الشريعة الإسلامية أو القوانين المعمول بها في المملكة العربية السعودية. نحتفظ بالحق في إزالة أي محتوى مسيء أو ينتهك حقوق الملكية الفكرية دون إشعار مسبق.
        </p>

        <h3 className="text-lg font-bold">4. المعاملات المالية</h3>
        <p className="text-[#71767b] text-sm leading-relaxed">
          جميع المعاملات المالية داخل "سوق ميلاف" تخضع لرسوم خدمة وتوثيق. منصة ميلاف تعمل كوسيط تقني لضمان الحقوق ولكنها ليست طرفاً في جودة المنتج المباع إلا في حال المنتجات الرقمية المباشرة.
        </p>

        <h3 className="text-lg font-bold">5. الخصوصية</h3>
        <p className="text-[#71767b] text-sm leading-relaxed">
          نحن نحترم خصوصيتك. يتم جمع واستخدام البيانات وفقاً لسياسة الخصوصية الخاصة بنا، والتي تتوافق مع نظام حماية البيانات الشخصية.
        </p>
      </div>
    </div>
  );

  // --- VIEW: MAIN MENU ---
  const MainView = () => (
    <>
      {/* Header */}
      <div className="flex flex-col px-4 pt-2 pb-2 sticky top-0 bg-black z-10">
        <div className="flex items-center gap-4 h-12">
          <button onClick={onBack} className="p-2 -mr-2 rounded-full hover:bg-[#18191c]">
            <ArrowRight className="w-5 h-5 text-[#e7e9ea]" />
          </button>
          <h2 className="text-xl font-bold text-[#e7e9ea]">الإعدادات</h2>
        </div>
        
        {/* Search */}
        <div className="mt-2 mb-2 relative">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#71767b]" />
          </div>
          <input 
            type="text" 
            placeholder="البحث في الإعدادات" 
            className="w-full bg-[#202327] text-[#e7e9ea] text-sm rounded-full py-2.5 pr-10 pl-4 border border-transparent focus:border-[#1d9bf0] focus:bg-black focus:outline-none transition-all placeholder-[#71767b]"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-10">
        <SettingsItem 
          icon={User} 
          title="حسابك" 
          desc="الاطلاع على معلومات الحساب، تحميل أرشيف بياناتك."
        />
        <SettingsItem 
          icon={Lock} 
          title="الأمان والوصول" 
          desc="إدارة أمان حسابك، والاتصال بالتطبيقات."
        />
        <SettingsItem 
          icon={DollarSign} 
          title="تحقيق الدخل" 
          desc="تعرف على طرق كسب المال من خلال المحتوى."
        />
        <SettingsItem 
          icon={Zap} 
          title="Premium" 
          desc="إدارة اشتراكك، المزايا، وطرق الدفع."
        />
        <SettingsItem 
          icon={Shield} 
          title="الخصوصية والأمان" 
          desc="إدارة المعلومات التي تشاركها ومن يستطيع رؤيتها."
        />
        <SettingsItem 
          icon={Bell} 
          title="التنبيهات" 
          desc="تحديد نوع التنبيهات التي تود استلامها."
        />
        <SettingsItem 
          icon={Eye} 
          title="إمكانية الوصول" 
          desc="إدارة طريقة عرض المحتوى، اللغة، والصوت."
        />
        <SettingsItem 
          icon={FileText} 
          title="الموارد القانونية" 
          desc="الشروط والأحكام، سياسة الخصوصية."
          onClick={() => setCurrentView('terms')}
        />
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[1000] bg-black font-sans dir-rtl" dir="rtl">
      {currentView === 'main' ? <MainView /> : <TermsView />}
    </div>
  );
};

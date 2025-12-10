import React, { useState } from 'react';
import { 
  User, X, Bookmark, FileText, Mic, 
  Settings, HelpCircle, Moon, Sun, 
  ChevronDown, ChevronUp, Zap, LogOut,
  Video, Users, MessageSquare, DollarSign,
  FileCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SettingsPage } from './SettingsPage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();
  
  // Local States
  const [isSettingsAccordionOpen, setIsSettingsAccordionOpen] = useState(false);
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  const handleThemeChange = (mode: 'dim' | 'lights-out' | 'light') => {
    let target = mode;
    if (theme === target) return;
    cycleTheme(); 
  };

  if (!user) return null;

  return (
    <>
      {/* --- SETTINGS PAGE OVERLAY --- */}
      <SettingsPage 
        isOpen={showSettingsPage} 
        onClose={() => setShowSettingsPage(false)} 
      />

      {/* --- SIDEBAR BACKDROP --- */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* --- DRAWER --- */}
      <div 
        className={`fixed inset-y-0 right-0 w-[80%] sm:w-[320px] bg-[var(--bg-primary)] z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        {/* Header: User Info */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
             <img 
               src={user.avatar} 
               className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)]"
               alt="User"
             />
             <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-secondary)]">
               <X className="w-5 h-5 text-[var(--text-secondary)]" />
             </button>
          </div>
          
          <div className="mb-4">
            <h2 className="font-bold text-lg text-[var(--text-primary)] leading-tight">{user.name}</h2>
            <p className="text-[var(--text-secondary)] text-sm dir-ltr text-right">@{user.username || user.id.slice(0,8)}</p>
          </div>

          <div className="flex gap-4 text-sm mb-4">
            <div className="flex gap-1">
               <span className="font-bold text-[var(--text-primary)]">{user.following?.length || 142}</span>
               <span className="text-[var(--text-secondary)]">متابِعًا</span>
            </div>
            <div className="flex gap-1">
               <span className="font-bold text-[var(--text-primary)]">{user.followers?.length || 11711}</span>
               <span className="text-[var(--text-secondary)]">متابِع</span>
            </div>
          </div>
          
          <div className="h-px bg-[var(--border-color)] w-full"></div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-0">
          <MenuItem icon={User} label="الملف الشخصي" onClick={() => {}} />
          <MenuItem icon={Zap} label="Premium" badge />
          <MenuItem icon={FileText} label="القوائم" />
          <MenuItem icon={Bookmark} label="العلامات المرجعية" />
          <MenuItem icon={Users} label="المجتمعات" />
          <MenuItem icon={DollarSign} label="تحقيق الدخل" />
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-color)] p-4">
          <div 
             className="flex justify-between items-center py-3 cursor-pointer"
             onClick={() => setIsSettingsAccordionOpen(!isSettingsAccordionOpen)}
          >
             <span className="font-bold text-[var(--text-primary)] text-[15px]">الإعدادات والدعم</span>
             {isSettingsAccordionOpen ? <ChevronUp className="w-4 h-4 text-[var(--text-primary)]"/> : <ChevronDown className="w-4 h-4 text-[var(--text-primary)]"/>}
          </div>
          
          {isSettingsAccordionOpen && (
            <div className="space-y-4 px-2 mb-4 animate-fade-in-up mt-2">
               
               {/* Link to Settings Page */}
               <div 
                  onClick={() => setShowSettingsPage(true)}
                  className="flex items-center gap-3 text-[var(--text-primary)] text-[15px] cursor-pointer"
               >
                  <Settings className="w-5 h-5" />
                  <span>الإعدادات والخصوصية</span>
               </div>
               
               <div className="flex items-center gap-3 text-[var(--text-primary)] text-[15px] cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  <span>مركز المساعدة</span>
               </div>
               <div onClick={logout} className="flex items-center gap-3 text-red-500 text-[15px] cursor-pointer">
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
               </div>
            </div>
          )}

          <button 
            onClick={() => setIsThemeSheetOpen(true)}
            className="mt-4 p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors float-left"
          >
             {theme === 'light' ? <Sun className="w-6 h-6 text-amber-500"/> : <Moon className="w-6 h-6 text-blue-400"/>}
          </button>
        </div>
      </div>

      {/* --- THEME BOTTOM SHEET --- */}
      {isThemeSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[80]" onClick={() => setIsThemeSheetOpen(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] z-[90] rounded-t-3xl p-6 border-t border-[var(--border-color)] animate-slide-up pb-10">
             <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6 opacity-30"></div>
             
             <h3 className="font-bold text-xl text-[var(--text-primary)] mb-6">المظهر</h3>

             {/* Dark Mode Toggle */}
             <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-[var(--text-primary)]">الوضع الداكن</span>
                <button 
                  onClick={() => handleThemeChange(theme === 'light' ? 'lights-out' : 'light')}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative ${theme === 'light' ? 'bg-gray-300' : 'bg-green-500'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${theme !== 'light' ? 'translate-x-[-24px]' : ''}`}></div>
                </button>
             </div>

             {/* Theme Radio Selection (Only if Dark Mode is On) */}
             <div className={`space-y-4 transition-opacity ${theme === 'light' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div 
                   className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[#15202b] cursor-pointer"
                   onClick={() => handleThemeChange('dim')}
                >
                   <span className="text-white font-bold">تعتيم (Dim)</span>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dim' ? 'border-blue-500' : 'border-gray-500'}`}>
                      {theme === 'dim' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                   </div>
                </div>

                <div 
                   className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-black cursor-pointer"
                   onClick={() => handleThemeChange('lights-out')}
                >
                   <span className="text-[#e7e9ea] font-bold">داكن (Lights out)</span>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'lights-out' ? 'border-blue-500' : 'border-gray-500'}`}>
                      {theme === 'lights-out' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                   </div>
                </div>
             </div>
             
             <button onClick={() => setIsThemeSheetOpen(false)} className="w-full mt-6 py-3 bg-[var(--bg-secondary)] rounded-full font-bold text-[var(--text-primary)]">
               إلغاء
             </button>
          </div>
        </>
      )}
    </>
  );
};

const MenuItem = ({ icon: Icon, label, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-6 px-6 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
  >
    <Icon className="w-6 h-6 text-[var(--text-primary)]" />
    <span className="font-bold text-xl text-[var(--text-primary)]">{label}</span>
    {badge && <span className="mr-auto bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">NEW</span>}
  </button>
);
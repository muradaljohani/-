
import React, { useState } from 'react';
import { 
  User, X, Bookmark, Layers, Mic, 
  Settings, HelpCircle, Moon, Sun, 
  ChevronDown, ChevronUp, Gem, LogOut,
  Bell, Briefcase, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SettingsPage } from './SettingsPage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
  onNavigate: (route: string) => void;
}

export const MobileSidebar: React.FC<Props> = ({ isOpen, onClose, unreadCount = 0, onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();
  
  const [isSettingsAccordionOpen, setIsSettingsAccordionOpen] = useState(false);
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  const handleThemeChange = (mode: 'dim' | 'lights-out' | 'light') => {
    let target = mode;
    if (theme === target) return;
    cycleTheme(); 
  };

  const handleNav = (route: string) => {
      onNavigate(route);
      onClose();
  };

  if (!user) return null;

  return (
    <>
      <SettingsPage 
        isOpen={showSettingsPage} 
        onClose={() => setShowSettingsPage(false)} 
      />

      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 right-0 w-[85%] sm:w-[320px] bg-black border-l border-[#2f3336] z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
             <img 
               src={user.avatar} 
               className="w-10 h-10 rounded-full object-cover border border-[#2f3336]"
               alt="User"
             />
             <button onClick={onClose} className="p-1 rounded-full hover:bg-[#16181c]">
               <X className="w-5 h-5 text-[#71767b]" />
             </button>
          </div>
          
          <div className="mb-4">
            <h2 className="font-bold text-lg text-[#e7e9ea] leading-tight">{user.name}</h2>
            <p className="text-[#71767b] text-sm dir-ltr text-right">@{user.username || user.id.slice(0,8)}</p>
          </div>

          <div className="flex gap-4 text-sm mb-4">
            <div className="flex gap-1">
               <span className="font-bold text-[#e7e9ea]">{user.following?.length || 142}</span>
               <span className="text-[#71767b]">متابِعًا</span>
            </div>
            <div className="flex gap-1">
               <span className="font-bold text-[#e7e9ea]">{user.followers?.length || 11711}</span>
               <span className="text-[#71767b]">متابِع</span>
            </div>
          </div>
          
          <div className="h-px bg-[#2f3336] w-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto py-0">
          <MenuItem icon={User} label="الملف الشخصي" onClick={() => handleNav('profile')} />
          <MenuItem icon={Bell} label="التنبيهات" onClick={() => handleNav('notifications')} badge={unreadCount > 0 ? `${unreadCount} جديد` : undefined} />
          
          <div className="my-2 h-px bg-[#2f3336] mx-4"></div>
          
          <MenuItem icon={Gem} label="النخبة (Elite)" onClick={() => handleNav('elite')} />
          <MenuItem icon={Briefcase} label="استوديو المبدعين" onClick={() => handleNav('creator-studio')} />
          <MenuItem icon={Users} label="الدوائر (Circles)" onClick={() => handleNav('circles')} />
          <MenuItem icon={Mic} label="غرف حية (Live)" onClick={() => handleNav('live')} />
          <MenuItem icon={Layers} label="مجموعات (Collections)" onClick={() => handleNav('collections')} />
          <MenuItem icon={Bookmark} label="المحفوظات (Saved)" onClick={() => handleNav('saved')} />
          
        </div>

        <div className="border-t border-[#2f3336] p-4">
          <div 
             className="flex justify-between items-center py-3 cursor-pointer"
             onClick={() => setIsSettingsAccordionOpen(!isSettingsAccordionOpen)}
          >
             <span className="font-bold text-[#e7e9ea] text-[15px]">الإعدادات والدعم</span>
             {isSettingsAccordionOpen ? <ChevronUp className="w-4 h-4 text-[#e7e9ea]"/> : <ChevronDown className="w-4 h-4 text-[#e7e9ea]"/>}
          </div>
          
          {isSettingsAccordionOpen && (
            <div className="space-y-4 px-2 mb-4 animate-fade-in-up mt-2">
               
               <div 
                  onClick={() => setShowSettingsPage(true)}
                  className="flex items-center gap-3 text-[#e7e9ea] text-[15px] cursor-pointer"
               >
                  <Settings className="w-5 h-5" />
                  <span>الإعدادات والخصوصية</span>
               </div>
               
               <div className="flex items-center gap-3 text-[#e7e9ea] text-[15px] cursor-pointer">
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
            className="mt-4 p-2 rounded-full hover:bg-[#16181c] transition-colors float-left"
          >
             {theme === 'light' ? <Sun className="w-6 h-6 text-amber-500"/> : <Moon className="w-6 h-6 text-blue-400"/>}
          </button>
        </div>
      </div>

      {isThemeSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[80]" onClick={() => setIsThemeSheetOpen(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-black z-[90] rounded-t-3xl p-6 border-t border-[#2f3336] animate-slide-up pb-10">
             <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6 opacity-30"></div>
             
             <h3 className="font-bold text-xl text-[#e7e9ea] mb-6">المظهر</h3>

             <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-[#e7e9ea]">الوضع الداكن</span>
                <button 
                  onClick={() => handleThemeChange(theme === 'light' ? 'lights-out' : 'light')}
                  className={`w-14 h-8 rounded-full p-1 transition-colors relative ${theme === 'light' ? 'bg-gray-300' : 'bg-green-500'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${theme !== 'light' ? 'translate-x-[-24px]' : ''}`}></div>
                </button>
             </div>

             <div className={`space-y-4 transition-opacity ${theme === 'light' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div 
                   className="flex items-center justify-between p-4 rounded-xl border border-[#2f3336] bg-[#15202b] cursor-pointer"
                   onClick={() => handleThemeChange('dim')}
                >
                   <span className="text-white font-bold">تعتيم (Dim)</span>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dim' ? 'border-blue-500' : 'border-gray-500'}`}>
                      {theme === 'dim' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                   </div>
                </div>

                <div 
                   className="flex items-center justify-between p-4 rounded-xl border border-[#2f3336] bg-black cursor-pointer"
                   onClick={() => handleThemeChange('lights-out')}
                >
                   <span className="text-[#e7e9ea] font-bold">داكن (Lights out)</span>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'lights-out' ? 'border-blue-500' : 'border-gray-500'}`}>
                      {theme === 'lights-out' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                   </div>
                </div>
             </div>
             
             <button onClick={() => setIsThemeSheetOpen(false)} className="w-full mt-6 py-3 bg-[#16181c] rounded-full font-bold text-[#e7e9ea]">
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
    className="w-full flex items-center gap-6 px-6 py-3 hover:bg-[#16181c] transition-colors"
  >
    <Icon className="w-6 h-6 text-[#e7e9ea]" />
    <span className="font-bold text-xl text-[#e7e9ea]">{label}</span>
    {badge && <span className="mr-auto bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">{badge}</span>}
  </button>
);

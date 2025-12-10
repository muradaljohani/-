
import React from 'react';
import { 
  User, X, Bookmark, Layers, Mic, 
  Settings, HelpCircle, Moon, Sun, 
  Gem, LogOut, Bell, Briefcase, LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { loginWithGoogle, logoutUser } from '../../src/services/authService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
  onNavigate: (route: string) => void;
}

export const MobileSidebar: React.FC<Props> = ({ isOpen, onClose, unreadCount = 0, onNavigate }) => {
  const { user } = useAuth();
  const { theme, cycleTheme } = useTheme();

  const handleNav = (route: string) => {
      onNavigate(route);
      onClose();
  };

  const handleLogin = async () => {
      try {
        await loginWithGoogle();
        onClose();
      } catch (e) {
          // handled
      }
  };

  const handleLogout = async () => {
      await logoutUser();
      onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-[85%] sm:w-[320px] bg-white dark:bg-black border-l border-gray-200 dark:border-[#2f3336] z-[60] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-6">
             {user ? (
                 <div className="flex flex-col gap-1 cursor-pointer" onClick={() => handleNav('profile')}>
                     <img 
                       src={user.avatar} 
                       className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-[#2f3336]"
                       alt="User"
                     />
                     <h2 className="font-bold text-lg text-black dark:text-[#e7e9ea] leading-tight mt-2">{user.name}</h2>
                     <p className="text-gray-500 dark:text-[#71767b] text-sm dir-ltr text-right">@{user.username || user.id.slice(0,8)}</p>
                 </div>
             ) : (
                 <div className="flex flex-col gap-1">
                     <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                         <User className="w-6 h-6 text-gray-500 dark:text-gray-400"/>
                     </div>
                     <h2 className="font-bold text-lg text-black dark:text-[#e7e9ea] mt-2">زائر</h2>
                     <p className="text-gray-500 dark:text-[#71767b] text-sm">سجل دخولك للمزيد</p>
                 </div>
             )}
             <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] text-black dark:text-[#e7e9ea]">
               <X className="w-6 h-6" />
             </button>
          </div>

          {user && (
            <div className="flex gap-4 text-sm mb-4">
                <div className="flex gap-1">
                <span className="font-bold text-black dark:text-[#e7e9ea]">{user.following?.length || 0}</span>
                <span className="text-gray-500 dark:text-[#71767b]">متابعة</span>
                </div>
                <div className="flex gap-1">
                <span className="font-bold text-black dark:text-[#e7e9ea]">{user.followers?.length || 0}</span>
                <span className="text-gray-500 dark:text-[#71767b]">متابِع</span>
                </div>
            </div>
          )}
          
          <div className="h-px bg-gray-200 dark:bg-[#2f3336] w-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {user ? (
            <>
              <MenuItem icon={User} label="الملف الشخصي" onClick={() => handleNav('profile')} />
              <MenuItem icon={Gem} label="النخبة (Elite)" onClick={() => handleNav('elite')} />
              <MenuItem icon={Briefcase} label="استوديو المبدعين" onClick={() => handleNav('creator-studio')} />
              <MenuItem icon={Bookmark} label="المحفوظات" onClick={() => handleNav('saved')} />
              <div className="my-2 h-px bg-gray-200 dark:bg-[#2f3336] mx-4"></div>
            </>
          ) : (
             <div className="p-4">
                 <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg">
                     <LogIn className="w-5 h-5"/> تسجيل الدخول بـ Google
                 </button>
             </div>
          )}

          <MenuItem icon={Settings} label="الإعدادات والخصوصية" onClick={() => handleNav('settings')} />
          <MenuItem icon={HelpCircle} label="مركز المساعدة" onClick={() => {}} />
        </div>

        <div className="border-t border-gray-200 dark:border-[#2f3336] p-4 flex justify-between items-center bg-white dark:bg-black">
            {user ? (
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold text-sm">
                    <LogOut className="w-5 h-5 rtl:rotate-180"/>
                    تسجيل خروج
                </button>
            ) : (
                <div className="text-xs text-gray-500">
                    نسخة 1.0.4
                </div>
            )}

            <button 
                onClick={cycleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] transition-colors text-black dark:text-[#e7e9ea]"
            >
                {theme === 'light' ? <Sun className="w-6 h-6 text-amber-500"/> : <Moon className="w-6 h-6 text-blue-400"/>}
            </button>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon: Icon, label, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-[#16181c] transition-colors group"
  >
    <Icon className="w-6 h-6 text-black dark:text-[#e7e9ea]" />
    <span className="font-bold text-lg text-black dark:text-[#e7e9ea]">{label}</span>
    {badge && <span className="mr-auto bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">{badge}</span>}
  </button>
);

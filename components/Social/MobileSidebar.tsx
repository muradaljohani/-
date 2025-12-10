
import React, { useState } from 'react';
import { 
  User, X, Bookmark, Layers, Mic, 
  Settings, HelpCircle, Moon, Sun, 
  Gem, LogOut, Bell, Briefcase, ChevronRight, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
  onNavigate: (route: string) => void;
}

export const MobileSidebar: React.FC<Props> = ({ isOpen, onClose, unreadCount = 0, onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();

  const handleThemeChange = () => {
    cycleTheme();
  };

  const handleNav = (route: string) => {
      onNavigate(route);
      onClose();
  };

  const handleLogout = () => {
      logout();
      onClose();
  };

  if (!user) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 right-0 w-[80%] sm:w-[320px] bg-black border-l border-[#2f3336] z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
             <div className="flex flex-col gap-1">
                 <img 
                   src={user.avatar} 
                   className="w-12 h-12 rounded-full object-cover border border-[#2f3336]"
                   alt="User"
                 />
                 <h2 className="font-bold text-lg text-[#e7e9ea] leading-tight mt-2">{user.name}</h2>
                 <p className="text-[#71767b] text-sm dir-ltr text-right">@{user.username || user.id.slice(0,8)}</p>
             </div>
             <button onClick={onClose} className="p-2 rounded-full hover:bg-[#16181c]">
               <X className="w-6 h-6 text-[#e7e9ea]" />
             </button>
          </div>

          <div className="flex gap-4 text-sm mb-4">
            <div className="flex gap-1">
               <span className="font-bold text-[#e7e9ea]">{user.following?.length || 142}</span>
               <span className="text-[#71767b]">متابعة</span>
            </div>
            <div className="flex gap-1">
               <span className="font-bold text-[#e7e9ea]">{user.followers?.length || 11711}</span>
               <span className="text-[#71767b]">متابِع</span>
            </div>
          </div>
          
          <div className="h-px bg-[#2f3336] w-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <MenuItem icon={User} label="الملف الشخصي" onClick={() => handleNav('profile')} />
          <MenuItem icon={Gem} label="النخبة (Elite)" onClick={() => handleNav('elite')} />
          <MenuItem icon={Users} label="الدوائر (Circles)" onClick={() => handleNav('circles')} />
          <MenuItem icon={Mic} label="غرف حية (Live)" onClick={() => handleNav('live')} />
          <MenuItem icon={Briefcase} label="استوديو المبدعين" onClick={() => handleNav('creator-studio')} />
          <MenuItem icon={Layers} label="المجموعات (Collections)" onClick={() => handleNav('collections')} />
          <MenuItem icon={Bookmark} label="المحفوظات (Saved)" onClick={() => handleNav('saved')} />
          
          <div className="my-2 h-px bg-[#2f3336] mx-4"></div>

          <MenuItem icon={Settings} label="الإعدادات والخصوصية" onClick={() => handleNav('settings')} />
          <MenuItem icon={HelpCircle} label="مركز المساعدة" onClick={() => {}} />
        </div>

        <div className="border-t border-[#2f3336] p-4 flex justify-between items-center">
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <LogOut className="w-5 h-5 rtl:rotate-180"/>
                تسجيل خروج
            </button>

            <button 
                onClick={handleThemeChange}
                className="p-2 rounded-full hover:bg-[#16181c] transition-colors text-[#e7e9ea]"
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
    className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-[#16181c] transition-colors"
  >
    <Icon className="w-6 h-6 text-[#e7e9ea]" />
    <span className="font-bold text-lg text-[#e7e9ea]">{label}</span>
    {badge && <span className="mr-auto bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">{badge}</span>}
  </button>
);

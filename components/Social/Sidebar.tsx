
import React from 'react';
import { 
    Home, Search, Bell, Mail, User, Gem, Briefcase, 
    MoreHorizontal, LogIn, Plus, LogOut, Film
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { InstallPrompt } from '../Mobile/InstallPrompt';
import { loginWithGoogle, logoutUser } from '../../src/services/authService';

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
    onBackToHome: () => void;
    onCompose: () => void;
    unreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onBackToHome, onCompose, unreadCount }) => {
    const { user } = useAuth();
    const { theme, cycleTheme } = useTheme();

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
    };

    return (
        <div className="h-full flex flex-col justify-between py-1 bg-white dark:bg-black">
            
            <div className="space-y-1">
                {/* Logo */}
                <div className="p-3 w-fit mb-1 hover:bg-gray-100 dark:hover:bg-[#16181c] rounded-full cursor-pointer transition-colors" onClick={onBackToHome}>
                    <div className="w-8 h-8 flex items-center justify-center text-3xl font-black text-black dark:text-[#e7e9ea]">
                        M
                    </div>
                </div>
                
                {/* Nav Links */}
                <SidebarLink icon={Home} label="الرئيسية" active={activeView==='feed'} onClick={() => onNavigate('feed')} />
                <SidebarLink icon={Search} label="استكشف" active={activeView==='explore'} onClick={() => onNavigate('explore')} />
                <SidebarLink icon={Film} label="شورتس" active={activeView==='shorts'} onClick={() => onNavigate('shorts')} />
                
                {user && (
                    <>
                        <SidebarLink icon={Bell} label="التنبيهات" active={activeView==='notifications'} onClick={() => onNavigate('notifications')} notifyCount={unreadCount} />
                        <SidebarLink icon={Mail} label="الرسائل" active={activeView==='messages'} onClick={() => onNavigate('messages')} />
                        <SidebarLink icon={Gem} label="النخبة" active={activeView==='elite'} onClick={() => onNavigate('elite')} />
                        <SidebarLink icon={Briefcase} label="استوديو" active={activeView==='creator-studio'} onClick={() => onNavigate('creator-studio')} />
                        <SidebarLink icon={User} label="الملف الشخصي" active={activeView==='profile'} onClick={() => onNavigate('profile')} />
                    </>
                )}
                
                {/* CTA Button */}
                <button 
                    onClick={() => user ? onCompose() : handleLogin()}
                    className="bg-[#1d9bf0] hover:opacity-90 text-white rounded-full p-3 xl:px-8 xl:py-3.5 font-bold mt-4 w-fit xl:w-[90%] transition-all shadow-lg text-lg flex items-center justify-center gap-2 mx-auto xl:mx-0"
                >
                    {user ? <Plus className="w-6 h-6 xl:hidden"/> : <LogIn className="w-6 h-6 xl:hidden"/>}
                    <span className="hidden xl:block">{user ? 'نشر' : 'تسجيل دخول'}</span>
                </button>
            </div>
            
            {/* Footer Area */}
            <div className="space-y-2 pb-4">
                    
                    <div 
                    onClick={cycleTheme}
                    className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] cursor-pointer w-fit xl:w-full transition-colors group text-black dark:text-[#e7e9ea]"
                    title="Change Theme"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-current relative flex items-center justify-center">
                            {theme !== 'light' ? <div className="w-4 h-4 bg-current rounded-full" /> : null}
                        </div>
                        <span className="hidden xl:block font-bold text-lg">المظهر</span>
                    </div>

                    {user ? (
                    <div className="relative group w-fit xl:w-full">
                        <div 
                            className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] cursor-pointer transition-colors"
                            onClick={() => onNavigate('profile')} 
                        >
                            <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 object-cover"/>
                            <div className="hidden xl:block flex-1 min-w-0 text-right">
                                <div className="font-bold text-black dark:text-[#e7e9ea] text-sm truncate">{user.name}</div>
                                <div className="text-gray-500 dark:text-[#71767b] text-xs truncate" dir="ltr">@{user.username?.replace('@','') || user.id.slice(0,6)}</div>
                            </div>
                            <MoreHorizontal className="hidden xl:block w-5 h-5 text-gray-500 dark:text-[#71767b]"/>
                        </div>
                        
                        <div className="absolute bottom-full left-0 w-64 mb-2 bg-white dark:bg-black border border-gray-200 dark:border-[#2f3336] rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden hidden group-hover:block z-50">
                            <button onClick={handleLogout} className="w-full text-right px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#16181c] text-red-500 font-bold text-sm flex items-center gap-2">
                                <LogOut className="w-4 h-4"/> تسجيل الخروج
                            </button>
                        </div>
                    </div>
                    ) : (
                    <div className="p-4 bg-gray-50 dark:bg-[#16181c] rounded-2xl text-center hidden xl:block border border-gray-200 dark:border-[#2f3336]">
                        <p className="text-sm font-bold mb-3 text-black dark:text-white">أنت غير مسجل</p>
                        <button 
                            onClick={handleLogin} 
                            className="w-full bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 py-2 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-[#1e1e1e] flex items-center justify-center gap-2"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" />
                            سجل بـ Google
                        </button>
                    </div>
                    )}
            </div>
        </div>
    );
};

const SidebarLink = ({ icon: Icon, label, active, onClick, notifyCount }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 px-3 py-3 rounded-full text-xl transition-all w-fit xl:w-auto group hover:bg-gray-100 dark:hover:bg-[#16181c] ${active ? 'font-bold text-black dark:text-[#e7e9ea]' : 'text-[#0f1419] dark:text-[#e7e9ea]'}`}
    >
        <div className="relative">
            {active ? <Icon className="w-7 h-7 fill-current" strokeWidth={2.5} /> : <Icon className="w-7 h-7" />}
            {notifyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1d9bf0] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white dark:border-black">
                    {notifyCount > 9 ? '9+' : notifyCount}
                </span>
            )}
        </div>
        <span className={`hidden xl:block text-xl ${active ? 'font-bold' : 'font-normal'}`}>{label}</span>
    </button>
);


import React, { useEffect, useState } from 'react';
import { Bell, Check, Clock, Briefcase, ShieldAlert, ShoppingBag, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Notification } from '../../types';

interface Props {
    onClose: () => void;
}

export const NotificationPanel: React.FC<Props> = ({ onClose }) => {
    const { notifications, sendSystemNotification, markNotificationRead, user } = useAuth();
    const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Sync with context
        setLocalNotifications(notifications);

        // Simulation: If empty, inject fake smart notifications
        if (notifications.length === 0 && user) {
            const fakes = [
                { title: 'فرص وظيفية جديدة', msg: 'تم نشر 5 وظائف حكومية جديدة تناسب تخصصك.', type: 'info', delay: 500 },
                { title: 'تنبيه أمني', msg: 'تم تسجيل دخول جديد لحسابك من جهاز غير معروف.', type: 'warning', delay: 1500 },
                { title: 'نشاط السوق', msg: 'سوق ميلاف: تم بيع خدمة مشابهة لخدمتك بقيمة 10$.', type: 'financial', delay: 2500 }
            ];

            fakes.forEach(f => {
                setTimeout(() => {
                    sendSystemNotification(user.id, f.title, f.msg, f.type as any);
                }, f.delay);
            });
        }
    }, [notifications.length, user]);

    const getIcon = (type: string) => {
        switch(type) {
            case 'financial': return <ShoppingBag className="w-4 h-4 text-emerald-400"/>;
            case 'warning': return <ShieldAlert className="w-4 h-4 text-red-400"/>;
            case 'info': return <Briefcase className="w-4 h-4 text-blue-400"/>;
            default: return <Bell className="w-4 h-4 text-gray-400"/>;
        }
    };

    return (
        <div className="absolute top-20 left-4 md:left-8 w-80 md:w-96 z-[9990] bg-[#1e293b] border border-[#d97706]/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up font-sans text-right" dir="rtl">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f172a]">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#d97706]"/> الإشعارات المركزية
                </h3>
                <button onClick={onClose}><X className="w-4 h-4 text-gray-400 hover:text-white"/></button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {localNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-xs">لا توجد إشعارات جديدة</div>
                ) : (
                    localNotifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${n.isRead ? 'opacity-60' : 'bg-blue-900/10'}`}
                        >
                            <div className="flex gap-3 items-start">
                                <div className="mt-1 p-2 bg-[#0f172a] rounded-full border border-white/5">
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white text-xs font-bold mb-1">{n.title}</h4>
                                    <p className="text-gray-400 text-[10px] leading-relaxed">{n.message}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[9px] text-gray-600 flex items-center gap-1">
                                            <Clock className="w-3 h-3"/> {new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                        {!n.isRead && <span className="w-2 h-2 bg-[#d97706] rounded-full"></span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-[#0f172a] border-t border-white/10 text-center">
                <button className="text-[10px] text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto">
                    <Check className="w-3 h-3"/> تحديد الكل كمقروء
                </button>
            </div>
        </div>
    );
};

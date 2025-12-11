
import React from 'react';
import { CheckCircle2, Crown, Calendar, X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export const VerificationModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    // Logic to determine if it's the Founder/Admin
    const isFounder = user.handle === '@IpMurad' || user.isAdmin === true || user.uid === 'admin-fixed-id';
    
    // Theme Configuration
    const theme = isFounder ? {
        color: 'text-amber-400',
        bg: 'bg-amber-400',
        border: 'border-amber-500',
        glow: 'shadow-[0_0_30px_rgba(251,191,36,0.2)]',
        icon: <Crown className="w-16 h-16 text-amber-400 fill-amber-400/20" strokeWidth={1.5} />,
        title: 'حساب المؤسس الرسمي',
        body: 'هذا الحساب موثق لأنه يمثل المالك والمؤسس الرسمي لمجتمع ميلاف.',
        btnBg: 'bg-white text-black hover:bg-amber-50'
    } : {
        color: 'text-[#1d9bf0]',
        bg: 'bg-[#1d9bf0]',
        border: 'border-[#1d9bf0]',
        glow: 'shadow-[0_0_30px_rgba(29,155,240,0.2)]',
        icon: <CheckCircle2 className="w-16 h-16 text-[#1d9bf0] fill-[#1d9bf0]/10" strokeWidth={1.5} />,
        title: 'حساب موثق',
        body: 'هذا الحساب موثق لأنه مشترك في خدمة النخبة (Elite) وتم تأكيد هويته.',
        btnBg: 'bg-white text-black hover:bg-blue-50'
    };

    let joinDate = isFounder ? 'ديسمبر 2025' : 'حديثاً';
    try {
        if (user.createdAt) {
            // Safely handle Firestore Timestamp or Date string/object
            const dateObj = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
            if (!isNaN(dateObj.getTime())) {
                joinDate = dateObj.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' });
            }
        }
    } catch (e) {
        // Fallback silently if date parsing fails
    }

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            dir="rtl"
        >
            <div 
                className="relative w-full max-w-sm bg-[#16181c] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#2f3336]"
                onClick={e => e.stopPropagation()}
            >
                {/* Decorative Top Line */}
                <div className={`h-1.5 w-full ${theme.bg}`}></div>
                
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 left-4 p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10">
                    <X className="w-5 h-5"/>
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    
                    {/* Icon */}
                    <div className={`mb-6 p-4 rounded-full bg-white/5 border border-white/5 ${theme.glow}`}>
                        {theme.icon}
                    </div>

                    {/* Content */}
                    <h2 className={`text-2xl font-black mb-3 ${theme.color}`}>
                        {theme.title}
                    </h2>
                    
                    <p className="text-[#e7e9ea] text-sm leading-relaxed mb-6 font-medium">
                        {theme.body}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-[#71767b] bg-white/5 px-4 py-2 rounded-full border border-white/5 mb-8">
                        <Calendar className="w-3.5 h-3.5"/>
                        <span>انضم في {joinDate}</span>
                    </div>

                    {/* Action */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className={`w-full py-3.5 rounded-full font-bold text-sm transition-all transform active:scale-95 ${theme.btnBg}`}
                    >
                        فهمت
                    </button>
                </div>
            </div>
        </div>
    );
};

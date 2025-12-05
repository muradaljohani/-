
import React from 'react';
import { X, Crown, TrendingUp, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    reason: 'HeavySeller' | 'JobSeeker' | 'Learner';
    onClose: () => void;
    onUpgrade: () => void;
}

export const UpsellModal: React.FC<Props> = ({ reason, onClose, onUpgrade }) => {
    const getContent = () => {
        switch (reason) {
            case 'HeavySeller':
                return {
                    title: 'توقف عن دفع العمولات!',
                    text: 'لاحظنا نشاطك العالي في البيع. اشترك في Elite الآن بـ 49 ريال ووفر مئات الريالات من عمولات البيع شهرياً.',
                    icon: <TrendingUp className="w-12 h-12 text-emerald-400"/>,
                    btn: 'توفير العمولات الآن'
                };
            case 'JobSeeker':
                return {
                    title: 'وظيفتك القادمة أسرع بـ 3 مرات',
                    text: 'مئات الشركات تبحث عن موظفين. ميز ملفك بشارة "عاجل" واظهر في قمة النتائج مع عضوية Elite.',
                    icon: <Briefcase className="w-12 h-12 text-blue-400"/>,
                    btn: 'ترقية الملف الوظيفي'
                };
            default:
                return {
                    title: 'استثمر في نفسك',
                    text: 'احصل على دورة مدفوعة مجاناً كل شهر وخصومات حصرية مع عضوية مراد Elite.',
                    icon: <Crown className="w-12 h-12 text-amber-400"/>,
                    btn: 'اكتشف Elite'
                };
        }
    };

    const content = getContent();

    return (
        <div className="fixed bottom-4 right-4 md:right-8 z-[500] max-w-sm w-full animate-fade-in-up">
            <div className="bg-[#0f172a] border border-amber-500/50 rounded-2xl shadow-2xl p-6 relative overflow-hidden group">
                {/* Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all"></div>
                <button onClick={onClose} className="absolute top-2 left-2 text-gray-500 hover:text-white"><X className="w-4 h-4"/></button>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="mb-4 p-3 bg-white/5 rounded-full border border-white/10">
                        {content.icon}
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">{content.title}</h3>
                    <p className="text-sm text-gray-300 mb-6 leading-relaxed">{content.text}</p>
                    
                    <button onClick={onUpgrade} className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-105">
                        {content.btn}
                    </button>
                </div>
            </div>
        </div>
    );
};

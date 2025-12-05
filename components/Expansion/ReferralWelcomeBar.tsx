
import React, { useEffect, useState } from 'react';
import { X, Gift, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ViralEngine } from '../../services/Expansion/ViralEngine';

export const ReferralWelcomeBar: React.FC = () => {
    const { user } = useAuth();
    const [referrer, setReferrer] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check URL for ?ref=
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');

        if (refCode) {
            // Register click in Viral Engine with Sherlock checks
            ViralEngine.getInstance().processReferralClick(refCode, user);
            
            // Format referrer name from code (e.g. murad -> Murad)
            setReferrer(refCode.charAt(0).toUpperCase() + refCode.slice(1));
            setIsVisible(true);
        } else {
            // Check session storage if not in URL (persistent referral)
            const savedRef = sessionStorage.getItem('murad_ref_code');
            if (savedRef) {
                setReferrer(savedRef.charAt(0).toUpperCase() + savedRef.slice(1));
                setIsVisible(true);
            }
        }
    }, [user]);

    if (!isVisible || !referrer) return null;

    // Self-referral hide
    if (user && user.name.replace(/\s+/g, '').toLowerCase() === referrer.toLowerCase()) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white px-4 py-3 shadow-lg relative z-[100] animate-fade-in-up border-b border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${referrer}`} 
                            alt={referrer} 
                            className="w-10 h-10 rounded-full border-2 border-amber-500 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border border-white">
                            <CheckCircle2 className="w-3 h-3"/>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-light">
                            تمت دعوتك بواسطة <span className="font-bold text-amber-400">{referrer}</span>
                        </p>
                        <p className="text-xs text-gray-300 flex items-center gap-1">
                            <Gift className="w-3 h-3 text-emerald-400 animate-bounce"/>
                            استخدم كود الدعوة للحصول على خصم خاص!
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="bg-white/10 px-3 py-1 rounded text-xs font-mono tracking-widest border border-white/20 select-all">
                        {referrer.toUpperCase()}20
                    </span>
                    <button 
                        onClick={() => setIsVisible(false)} 
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg"
                    >
                        تفعيل الخصم
                    </button>
                </div>

                <button onClick={() => setIsVisible(false)} className="absolute top-2 left-2 text-gray-400 hover:text-white sm:hidden">
                    <X className="w-4 h-4"/>
                </button>
            </div>
        </div>
    );
};


import React, { useState } from 'react';
import { MessageCircle, UserCheck, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
    productName: string;
    productId: string;
}

export const OwnerConnectWidget: React.FC<Props> = ({ productName, productId }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Mock Owners
    const owners = [
        { name: 'محمد', duration: '6 أشهر', avatar: 'M' },
        { name: 'سلطان', duration: 'سنة واحدة', avatar: 'S' }
    ];

    if (!isOpen) {
        return (
            <div 
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-4 cursor-pointer hover:bg-blue-900/30 transition-all group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0f172a] flex items-center justify-center text-xs text-white">M</div>
                            <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#0f172a] flex items-center justify-center text-xs text-white">S</div>
                        </div>
                        <div>
                            <h4 className="text-blue-400 font-bold text-xs">اسأل مالك سابق</h4>
                            <p className="text-[10px] text-gray-500">2 أشخاص يملكون {productName} مستعدون للإجابة</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 rtl:rotate-180 transition-colors"/>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1e293b] border border-blue-500/30 rounded-xl p-4 animate-fade-in-up">
            <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-400"/> محادثة مع الملاك
            </h4>
            <div className="space-y-3">
                {owners.map((owner, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">{owner.avatar}</div>
                            <div>
                                <div className="text-gray-200 text-xs font-bold">{owner.name}</div>
                                <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                                    <Shield className="w-2 h-2"/> يملك المنتج منذ {owner.duration}
                                </div>
                            </div>
                        </div>
                        <button className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-500">
                            دردشة
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={() => setIsOpen(false)} className="w-full text-center text-gray-500 text-xs mt-3 hover:text-white">
                إخفاء
            </button>
        </div>
    );
};

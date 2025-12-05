
import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { ViralEngine } from '../../services/Expansion/ViralEngine';
import { useAuth } from '../../context/AuthContext';

interface Props {
    title: string;
    type: 'Job' | 'Course' | 'Product';
    data: any; // The job/course/product object
    className?: string;
}

export const ShareButton: React.FC<Props> = ({ title, type, data, className }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // If no user is logged in, we can't generate an affiliate link, so we default to standard sharing
    // Or we prompt login. For this UX, we'll generate a generic link if not logged in.
    const username = user?.name || 'guest';
    
    const engine = ViralEngine.getInstance();
    const shareContent = engine.generateShareContent(type, data, username);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareContent.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareContent.text)}`;
        window.open(url, '_blank');
    };

    const handleTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="relative inline-block">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 font-bold transition-all ${className}`}
            >
                <Share2 className="w-4 h-4" />
                <span className="text-xs">شارك واربح</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 p-4 animate-fade-in-up">
                        <h4 className="text-white text-xs font-bold mb-3 text-center">اربح عمولة لكل إحالة ناجحة!</h4>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <button onClick={handleWhatsApp} className="flex flex-col items-center gap-1 p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                <span className="text-[10px]">واتساب</span>
                            </button>
                            <button onClick={handleTwitter} className="flex flex-col items-center gap-1 p-2 bg-blue-400/10 hover:bg-blue-400/20 rounded-lg text-blue-400 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                <span className="text-[10px]">تويتر</span>
                            </button>
                            <button onClick={handleCopy} className="flex flex-col items-center gap-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                                {copied ? <Check className="w-6 h-6 text-green-400"/> : <LinkIcon className="w-6 h-6"/>}
                                <span className="text-[10px]">{copied ? 'منسوخ' : 'نسخ'}</span>
                            </button>
                        </div>
                        
                        <div className="bg-black/30 p-2 rounded text-[10px] text-gray-400 text-center font-mono break-all border border-white/5">
                            {shareContent.url}
                        </div>
                        
                        {/* Triangle Pointer */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e293b] border-r border-b border-white/10 rotate-45 -mt-1.5"></div>
                    </div>
                </>
            )}
        </div>
    );
};

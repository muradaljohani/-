
import React from 'react';
import { Download, Share2, Copy, Image as ImageIcon, Facebook, Twitter, Linkedin } from 'lucide-react';
import { ViralEngine } from '../../services/Expansion/ViralEngine';

interface Props {
    refLink: string;
}

export const AssetLibrary: React.FC<Props> = ({ refLink }) => {
    const assets = ViralEngine.getInstance().getAssetTemplates(refLink);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("تم نسخ النص!");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">مكتبة الأصول التسويقية</h3>
                <p className="text-sm text-gray-400">بانرات جاهزة ونصوص مقنعة لزيادة أرباحك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map(asset => (
                    <div key={asset.id} className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="aspect-video relative overflow-hidden bg-black">
                            <img src={asset.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                <h4 className="text-white font-bold text-sm">{asset.title}</h4>
                                <p className="text-[10px] text-gray-400">{asset.description}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div className="bg-black/20 p-3 rounded-lg text-xs text-gray-300 leading-relaxed border border-white/5 h-20 overflow-y-auto scrollbar-thin">
                                {asset.socialText}
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => handleCopy(asset.socialText)} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Copy className="w-3 h-3"/> نسخ النص
                                </button>
                                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                                    <Download className="w-3 h-3"/> تحميل البانر
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Quick Share */}
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-bold text-sm mb-4">نشر سريع</h3>
                <div className="flex gap-4 justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-xl font-bold hover:bg-[#1DA1F2] hover:text-white transition-all">
                        <Twitter className="w-5 h-5"/> تغريدة جاهزة
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 rounded-xl font-bold hover:bg-[#0A66C2] hover:text-white transition-all">
                        <Linkedin className="w-5 h-5"/> نشر مهني
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#4267B2]/10 text-[#4267B2] border border-[#4267B2]/20 rounded-xl font-bold hover:bg-[#4267B2] hover:text-white transition-all">
                        <Facebook className="w-5 h-5"/> فيسبوك
                    </button>
                </div>
            </div>
        </div>
    );
};

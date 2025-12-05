
import React from 'react';
import { ExpansionCore, DiscoveryItem } from '../../services/Expansion/ExpansionCore';
import { Tag, ArrowRight, ShoppingBag, Briefcase, BookOpen } from 'lucide-react';

interface Props {
    tag: string;
    allItems: DiscoveryItem[];
    onBack: () => void;
    onItemClick: (item: DiscoveryItem) => void;
}

export const TagLanding: React.FC<Props> = ({ tag, allItems, onBack, onItemClick }) => {
    
    // Engine Logic: Get items for this tag
    const items = ExpansionCore.TagSystem.generateTagPage(tag, allItems);

    return (
        <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in-up font-sans" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowRight className="w-5 h-5 rtl:rotate-180"/>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-blue-600"/>
                            #{tag}
                        </h1>
                        <p className="text-xs text-gray-500">{items.length} نتيجة</p>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {items.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        لا توجد نتائج لوسم #{tag}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => onItemClick(item)}
                                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1">
                                        {item.type === 'Product' && <ShoppingBag className="w-3 h-3"/>}
                                        {item.type === 'Job' && <Briefcase className="w-3 h-3"/>}
                                        {item.type === 'Course' && <BookOpen className="w-3 h-3"/>}
                                        {item.type}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {item.tags.slice(0, 3).map(t => (
                                            <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${t.toLowerCase().includes(tag.toLowerCase()) ? 'bg-blue-100 text-blue-600 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

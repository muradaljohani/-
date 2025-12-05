
import React, { useState } from 'react';
import { User, ProductListing } from '../../types';
import { ExpansionCore } from '../../services/Expansion/ExpansionCore';
import { MapPin, Star, UserPlus, MessageCircle, Share2, Grid, List, CheckCircle2, Package, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TimeLordScheduler } from '../Reality/TimeLordScheduler';
import { TrustBadge } from '../Quality/TrustBadge';
import { ReviewSystem } from '../Quality/ReviewSystem';

interface Props {
    targetUser: User;
    products: ProductListing[];
    onBack: () => void;
    onProductClick: (p: ProductListing) => void;
}

export const StoreProfile: React.FC<Props> = ({ targetUser, products, onBack, onProductClick }) => {
    const { user, followUser, unfollowUser } = useAuth();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showScheduler, setShowScheduler] = useState(false);
    const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
    
    // Generate the Store Profile
    const storeData = ExpansionCore.StoreGenerator.generateStoreProfile(targetUser, products);
    
    const isFollowing = user?.following?.includes(targetUser.id);

    const handleFollow = () => {
        if (!user) return alert("يرجى تسجيل الدخول للمتابعة");
        if (isFollowing) unfollowUser(targetUser.id);
        else followUser(targetUser.id);
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-20 animate-fade-in-up font-sans" dir="rtl">
            
            {/* Store Header / Cover */}
            <div className="bg-[#0f172a] text-white pt-10 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <button onClick={onBack} className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 z-20">
                    <Share2 className="w-5 h-5 rtl:rotate-180"/>
                </button>
                
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-right">
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 border-4 border-amber-500 bg-white">
                            <img src={storeData.avatar} className="w-full h-full rounded-full object-cover"/>
                        </div>
                        {targetUser.isIdentityVerified && (
                            <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-[#0f172a]">
                                <CheckCircle2 className="w-4 h-4"/>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-black">{storeData.name}</h1>
                            <TrustBadge user={targetUser} compact={true} />
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 max-w-lg mx-auto md:mx-0">{storeData.bio}</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm mb-6">
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-lg">{storeData.stats.products}</span>
                                <span className="text-gray-500 text-xs">منتج</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-lg">{storeData.stats.followers}</span>
                                <span className="text-gray-500 text-xs">متابع</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-lg flex items-center gap-1">
                                    {storeData.stats.rating} <Star className="w-3 h-3 fill-amber-500 text-amber-500"/>
                                </span>
                                <span className="text-gray-500 text-xs">تقييم</span>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center md:justify-start">
                            <button 
                                onClick={handleFollow}
                                className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                                    isFollowing ? 'bg-white/10 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'
                                }`}
                            >
                                <UserPlus className="w-4 h-4"/> {isFollowing ? 'تتابع' : 'متابعة'}
                            </button>
                            <button onClick={() => setShowScheduler(true)} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg">
                                <Calendar className="w-4 h-4"/> حجز موعد
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
                
                {/* Stats & Trust Detail Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="flex gap-4">
                            <button onClick={() => setActiveTab('products')} className={`pb-2 border-b-2 font-bold transition-all ${activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                                المعروضات
                            </button>
                            <button onClick={() => setActiveTab('reviews')} className={`pb-2 border-b-2 font-bold transition-all ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
                                التقييمات
                            </button>
                        </div>
                        {activeTab === 'products' && (
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode==='grid'?'bg-white shadow':''}`}><Grid className="w-4 h-4"/></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode==='list'?'bg-white shadow':''}`}><List className="w-4 h-4"/></button>
                            </div>
                        )}
                    </div>

                    {/* Trust Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">بيانات الثقة</h4>
                        <TrustBadge user={targetUser} showDetails={true} />
                    </div>
                </div>

                {activeTab === 'products' && (
                    <>
                        {/* Products Grid */}
                        {storeData.items.length === 0 ? (
                            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed">
                                هذا المتجر فارغ حالياً.
                            </div>
                        ) : (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                                {storeData.items.map(product => (
                                    <div 
                                        key={product.id} 
                                        onClick={() => onProductClick(product)}
                                        className={`bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group ${viewMode === 'list' ? 'flex items-center gap-4 p-2' : ''}`}
                                    >
                                        <div className={`bg-gray-200 relative overflow-hidden ${viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 rounded-lg shrink-0'}`}>
                                            <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                            {product.status === 'sold' && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xs uppercase">مباع</div>
                                            )}
                                        </div>
                                        <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{product.title}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className="text-blue-600 font-bold text-sm">{product.price} ر.س</span>
                                                <span className="text-[10px] text-gray-400">{product.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Store Tags */}
                        {storeData.tags.length > 0 && (
                            <div className="mt-8">
                                <h4 className="font-bold text-gray-700 mb-3 text-sm">وسوم المتجر</h4>
                                <div className="flex flex-wrap gap-2">
                                    {storeData.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 flex items-center gap-1 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors">
                                            <Tag className="w-3 h-3"/> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'reviews' && (
                    <ReviewSystem targetUser={targetUser} />
                )}

            </div>

            <TimeLordScheduler 
                isOpen={showScheduler} 
                onClose={() => setShowScheduler(false)} 
                hostName={storeData.name} 
                type="Service" 
            />
        </div>
    );
};

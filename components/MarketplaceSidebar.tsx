


import React, { useState } from 'react';
import { X, ShoppingBag, Tag, Search, Star, Clock, Filter, Palette, Code, PenTool, Megaphone, Video, Briefcase, ChevronRight, LayoutGrid, UserCheck, CheckCircle2, AlertOctagon, PackageCheck, Truck, ShieldCheck, BadgeCheck, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ServiceListing, ServiceCategory } from '../types';
import { PostModal } from './PostModal';
import { PaymentGateway } from './PaymentGateway';
import { UserProfileModal } from './UserProfileModal';

interface MarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: ServiceCategory | 'All', label: string, icon: React.ReactNode }[] = [
    { id: 'All', label: 'الكل', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'Design', label: 'تصميم وجرافيك', icon: <Palette className="w-4 h-4" /> },
    { id: 'Programming', label: 'برمجة وتطوير', icon: <Code className="w-4 h-4" /> },
    { id: 'Writing', label: 'كتابة وترجمة', icon: <PenTool className="w-4 h-4" /> },
    { id: 'Marketing', label: 'تسويق إلكتروني', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'Video', label: 'صوتيات وفيديو', icon: <Video className="w-4 h-4" /> },
    { id: 'Consulting', label: 'استشارات', icon: <Briefcase className="w-4 h-4" /> },
];

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({ isOpen, onClose }) => {
  const { allServices, user, purchaseService, myTransactions, confirmReceipt, markDelivered } = useAuth();
  const [activeTab, setActiveTab] = useState<'market' | 'orders'>('market');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); 
  
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  
  // Filters
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredServices = allServices.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      
      const price = s.price;
      const matchesPrice = (!minPrice || price >= parseFloat(minPrice)) && (!maxPrice || price <= parseFloat(maxPrice));
      const matchesRating = s.rating >= minRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const checkVerification = () => {
      if (!user) return false;
      return user.isPhoneVerified && user.isEmailVerified && user.iban;
  };

  const handlePostClick = () => {
      if (!checkVerification()) {
          if(window.confirm("⚠️ يجب إكمال التحقق من الهوية (جوال، بريد) وإضافة حساب بنكي قبل إضافة خدمات. هل تريد الذهاب للتحقق الآن؟")) {
              setShowProfileModal(true);
          }
          return;
      }
      setIsPostModalOpen(true);
  };

  const handleBuyClick = (service: ServiceListing) => {
      if (!user) {
          alert("يجب تسجيل الدخول لشراء الخدمات.");
          return;
      }
      if (!checkVerification()) {
          if(window.confirm("⚠️ لإتمام عمليات الشراء بأمان، يرجى إكمال التحقق من حسابك أولاً. هل تريد الذهاب للتحقق؟")) {
              setShowProfileModal(true);
          }
          return;
      }
      
      if(window.confirm(`هل تريد شراء خدمة "${service.title}"؟\n\nسيتم فتح بوابة الدفع الآمن (SSL).`)) {
          setSelectedService(service);
          setIsPaymentOpen(true);
      }
  };

  const handlePaymentSuccess = (txn: any) => {
      if (selectedService) {
          setIsPaymentOpen(false);
          const res = purchaseService(selectedService, txn);
          if (res.success) {
              alert("تم الدفع بنجاح! المبلغ الآن في الحجز الآمن (Escrow).");
              setActiveTab('orders');
              setSelectedService(null);
          } else {
              alert(res.error);
          }
      }
  };

  const handleConfirmReceipt = (txId: string) => {
      if(window.confirm("هل استلمت المشروع كاملاً وتأكدت من جودته؟\n\nعند التأكيد، سيتم تحرير الدفعة للبائع فوراً ولا يمكن التراجع.")) {
          confirmReceipt(txId);
      }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Container: Full width on mobile, fixed on desktop */}
      <div className={`
        fixed inset-y-0 right-0 w-full sm:w-[550px] 
        bg-[#0f172a] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]
        z-[60] transform transition-transform duration-300 ease-out flex flex-col h-full
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10 bg-gradient-to-b from-gray-900 to-[#0f172a] flex-shrink-0 pt-safe">
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                        سوق الخدمات
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        دفع آمن (Escrow)
                    </p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-xl">
                <button onClick={() => setActiveTab('market')} className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'market' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>تصفح</button>
                <button onClick={() => setActiveTab('orders')} className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>طلباتي</button>
            </div>
            
            {activeTab === 'market' && (
                <>
                <div className="relative mb-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-3 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="بحث عن خدمة..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all placeholder-gray-600"
                        />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${showFilters ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'}`}>
                        <SlidersHorizontal className="w-5 h-5"/>
                    </button>
                </div>

                {showFilters && (
                    <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/5 animate-fade-in-up">
                        <div className="flex justify-between mb-3 text-xs font-bold text-gray-400">تصفية النتائج</div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                             <div>
                                 <label className="text-[10px] text-gray-500 mb-1 block">أقل سعر</label>
                                 <input type="number" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white text-xs"/>
                             </div>
                             <div>
                                 <label className="text-[10px] text-gray-500 mb-1 block">أعلى سعر</label>
                                 <input type="number" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded p-2 text-white text-xs"/>
                             </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 ${
                                activeCategory === cat.id 
                                ? 'bg-emerald-600 text-white border-emerald-500' 
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>
                </>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a] pb-safe">
            {activeTab === 'market' && (
                filteredServices.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 flex flex-col items-center">
                        <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">لا توجد خدمات</p>
                        <button onClick={handlePostClick} className="mt-6 px-6 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-bold text-sm">أضف خدمتك الأولى</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredServices.map((service) => (
                            <div key={service.id} className="bg-white/5 border border-white/5 hover:border-emerald-500/30 rounded-2xl overflow-hidden group flex flex-col sm:flex-row">
                                <div className="sm:w-32 h-40 sm:h-auto bg-gray-800 relative flex-shrink-0">
                                    <img src={service.thumbnail} className="w-full h-full object-cover"/>
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {service.deliveryTime}</div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-sm line-clamp-2 mb-2 leading-relaxed">{service.title}</h3>
                                    </div>
                                    <div className="flex items-end justify-between mt-2 pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <img src={service.sellerAvatar} className="w-6 h-6 rounded-full border border-white/10"/>
                                            <span className="text-xs text-gray-400">{service.sellerName}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-white">{service.price} <span className="text-xs font-normal text-gray-400">ر.س</span></div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleBuyClick(service)} className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors">شراء الخدمة</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
            
             {activeTab === 'orders' && (
                 <div className="space-y-4 text-center text-gray-400">
                     {myTransactions.length === 0 && <div className="py-10">لا توجد معاملات</div>}
                     {myTransactions.map(tx => (
                         <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-4 text-right">
                             <div className="text-white font-bold text-sm">{tx.serviceTitle}</div>
                             <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs px-2 py-1 rounded-md ${tx.status==='completed'?'bg-emerald-500/20 text-emerald-400':'bg-blue-500/20 text-blue-400'}`}>{tx.status === 'in_progress' ? 'الأموال معلقة (Escrow)' : tx.status}</span>
                                <span className="font-mono text-emerald-400">{tx.amount} SAR</span>
                             </div>
                             {(tx.status === 'delivered' || tx.status === 'in_progress') && tx.buyerId === user?.id && (
                                 <button onClick={() => handleConfirmReceipt(tx.id)} className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">تأكيد الاستلام (تحرير المبلغ)</button>
                             )}
                         </div>
                     ))}
                 </div>
             )}
        </div>
      </div>
      
      <PostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {selectedService && (
        <PaymentGateway 
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            amount={selectedService.price}
            title="شراء خدمة"
            description={`شراء: ${selectedService.title}`}
            onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

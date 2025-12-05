
import React, { useState, useEffect } from 'react';
import { 
    X, ShoppingBag, Search, Star, Clock, Filter, Palette, Code, PenTool, 
    Megaphone, Video, Briefcase, LayoutGrid, UserCheck, CheckCircle2, 
    ShieldCheck, DollarSign, Wallet, ArrowRight, User, PlusCircle, Inbox,
    LogOut, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ServiceListing, ServiceCategory, User as UserType } from '../types';
import { PaymentGateway } from './PaymentGateway';
import { SellerDashboardModal } from './SellerDashboardModal';
import { PostModal } from './PostModal';
import { UserProfileModal } from './UserProfileModal';
import { AuthModal } from './AuthModal';
import { BarterDealModal } from './Synapse/BarterDealModal';

interface MarketplaceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: ServiceCategory | 'All', label: string, icon?: React.ReactNode }[] = [
    { id: 'All', label: 'الكل' },
    { id: 'Design', label: 'تصميم وجرافيك' },
    { id: 'Programming', label: 'برمجة وتطوير' },
    { id: 'Writing', label: 'كتابة وترجمة' },
    { id: 'Marketing', label: 'تسويق إلكتروني' },
    { id: 'Video', label: 'صوتيات وفيديو' },
    { id: 'Consulting', label: 'استشارات' },
];

export const ServicesMarketplace: React.FC<MarketplaceSidebarProps> = ({ isOpen, onClose }) => {
  const { allServices, user, purchaseService, myTransactions, logout, login, register, requireAuth } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState<'market' | 'purchases'>('market');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');
  
  // Modals
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceListing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [barterOpen, setBarterOpen] = useState(false);
  const [barterTarget, setBarterTarget] = useState<any>(null);

  const filteredServices = allServices.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
  });

  const getServiceCosts = (price: number) => {
      const fee = Math.max(2, price * 0.20); 
      return { price, fee, total: price + fee };
  };

  const handleOpenPurchase = (service: ServiceListing) => {
      // ACTION GATING: Check if user is logged in
      requireAuth(() => {
          if(user && user.id === service.sellerId) { 
              alert("لا يمكنك شراء خدمتك الخاصة!"); 
              return; 
          }
          setSelectedService(service);
          setIsPurchaseModalOpen(true);
      });
  };

  const handlePostService = () => {
      requireAuth(() => {
          setIsPostModalOpen(true);
      });
  };

  const handleBarterClick = (service: ServiceListing) => {
      requireAuth(() => {
          setBarterTarget({ id: service.sellerId, name: service.sellerName, service: service.title });
          setBarterOpen(true);
      });
  };

  const handlePaymentSuccess = (txn: any) => {
      if(selectedService) {
          const res = purchaseService(selectedService, txn);
          if(res.success) {
              setIsPaymentGatewayOpen(false);
              alert("✅ تم عملية الشراء بنجاح!");
              setSelectedService(null);
              setActiveTab('purchases');
          }
      }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-[#f7f9fa] z-[60] overflow-y-auto transition-transform duration-300 flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        
        {/* Navbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-6 h-6"/></button>
                <div className="text-xl font-black text-[#333]">سوق <span className="text-[#1dbf73]">ميلاف</span></div>
            </div>
            
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="hidden md:flex items-center gap-3">
                        <div className="text-left text-xs">
                            <div className="font-bold text-gray-800">{user.name}</div>
                            <div className="text-gray-500">عضو نشط</div>
                        </div>
                        <div className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">وضع الزائر</span>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto w-full px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-lg font-bold text-gray-600">
                    👋 مرحباً {user ? user.name : 'زائرنا الكريم'}، {allServices.length > 0 ? 'تصفح أحدث الخدمات المضافة' : 'السوق بانتظار إبداعك!'}
                </div>
                <button onClick={handlePostService} className="bg-[#1dbf73] hover:bg-[#159e5e] text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all transform hover:scale-105">
                    <PlusCircle className="w-5 h-5"/> أضف خدمة جديدة
                </button>
            </div>

            {/* Empty State */}
            {allServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد خدمات حالياً</h3>
                    <p className="text-gray-500 mb-6">كن أول من يفتتح السوق وينشر خدمة!</p>
                    <button onClick={handlePostService} className="text-[#1dbf73] font-bold hover:underline">ابدأ النشر الآن</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredServices.map(svc => (
                        <div key={svc.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                            <div className="h-40 bg-[#f0f2f5] flex items-center justify-center text-5xl relative overflow-hidden">
                                {svc.thumbnail && svc.thumbnail.startsWith('http') ? (
                                    <img src={svc.thumbnail} className="w-full h-full object-cover"/>
                                ) : (
                                    <span>💼</span>
                                )}
                                <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md">
                                    {svc.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 h-10 leading-snug group-hover:text-[#1dbf73] transition-colors">{svc.title}</h4>
                                
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-50">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">
                                        {svc.sellerName.charAt(0)}
                                    </div>
                                    <span className="text-xs text-gray-500 truncate">{svc.sellerName}</span>
                                </div>

                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-lg font-black text-[#1dbf73]">${svc.price}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleBarterClick(svc)} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-md text-xs font-bold transition-colors">
                                            مبادلة
                                        </button>
                                        <button onClick={() => handleOpenPurchase(svc)} className="bg-[#333] hover:bg-[#1dbf73] text-white px-4 py-2 rounded-md text-xs font-bold transition-colors">
                                            شراء
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                نظام السوق محمي ومراقب - جميع العمليات المالية تتم عبر وسيط آمن (أكاديمية ميلاف)
            </div>
        </div>

      </div>

      {/* Modals */}
      <PostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      {selectedService && (
        <PaymentGateway 
            isOpen={isPurchaseModalOpen} 
            onClose={() => setIsPurchaseModalOpen(false)}
            amount={getServiceCosts(selectedService.price).total}
            title="شراء خدمة"
            description={`شراء: ${selectedService.title}`}
            onSuccess={() => { setIsPurchaseModalOpen(false); setIsPaymentGatewayOpen(true); }}
        />
      )}
      <PaymentGateway 
          isOpen={isPaymentGatewayOpen} 
          onClose={() => setIsPaymentGatewayOpen(false)}
          amount={selectedService ? getServiceCosts(selectedService.price).total : 0}
          title="الدفع الآمن"
          onSuccess={handlePaymentSuccess}
      />
      {barterTarget && (
          <BarterDealModal 
              isOpen={barterOpen} 
              onClose={() => setBarterOpen(false)} 
              targetUserId={barterTarget.id}
              targetUserName={barterTarget.name}
              initialOffer={`مبادلة مقابل خدمة: ${barterTarget.service}`}
          />
      )}
    </>
  );
};

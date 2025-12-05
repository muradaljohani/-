import React, { useState } from 'react';
import { X, LayoutDashboard, Briefcase, ShoppingBag, DollarSign, UploadCloud, TrendingUp, CheckCircle2, Gavel, Eye, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublishNew: () => void;
}

export const SellerDashboardModal: React.FC<Props> = ({ isOpen, onClose, onPublishNew }) => {
  const { user, allProducts, markProductAsSold } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'haraj' | 'financials'>('overview');

  if (!isOpen || !user) return null;

  const publishedItems = user.publishedItems || [];
  const services = publishedItems.filter(i => i.type === 'Service');
  
  // Filter Haraj listings for current user
  const myHarajListings = allProducts.filter(p => p.sellerId === user.id);

  // Stats
  const totalSales = user.publisherStats?.totalSales || 0;
  const activeAds = myHarajListings.filter(p => p.status === 'active').length;

  const StatCard = ({ label, value, icon, color }: any) => (
      <div className="bg-[#1e293b] p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>{icon}</div>
          <div className="relative z-10">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</div>
              <div className="text-3xl font-black text-white mb-1">{value}</div>
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-fade-in-up">
      
      <div className="relative w-full h-full md:max-w-[95vw] md:h-[95vh] bg-[#0f172a] md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10 font-sans text-right" dir="rtl">
          
          {/* SIDEBAR */}
          <div className="w-full md:w-72 bg-[#0b1120] border-l border-white/10 flex flex-col shrink-0">
              <div className="p-6 border-b border-white/10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full p-1 border-2 border-amber-500/50 mb-3 relative">
                      <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="Seller"/>
                      {user.isIdentityVerified && <div className="absolute bottom-0 right-0 bg-emerald-500 p-1 rounded-full border-2 border-[#0b1120]"><CheckCircle2 className="w-3 h-3 text-white"/></div>}
                  </div>
                  <h2 className="text-white font-bold text-lg">{user.name}</h2>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold mt-2 border border-amber-500/20">
                      {user.isIdentityVerified ? 'بائع موثق' : 'عضو جديد'}
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <LayoutDashboard className="w-4 h-4"/> لوحة المعلومات
                  </button>
                  <div className="pt-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">إدارة المحتوى</div>
                  <button onClick={() => setActiveTab('haraj')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='haraj' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <Gavel className="w-4 h-4"/> إعلانات الحراج
                      <span className="mr-auto bg-black/30 px-2 py-0.5 rounded text-[10px]">{myHarajListings.length}</span>
                  </button>
                  <button onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='services' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <ShoppingBag className="w-4 h-4"/> خدماتي
                      <span className="mr-auto bg-black/30 px-2 py-0.5 rounded text-[10px]">{services.length}</span>
                  </button>
                  
                  <div className="pt-4 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">المالية</div>
                  <button onClick={() => setActiveTab('financials')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab==='financials' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <DollarSign className="w-4 h-4"/> الأرباح
                  </button>
              </div>

              <div className="p-4 border-t border-white/10">
                  <button onClick={onPublishNew} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all">
                      <UploadCloud className="w-4 h-4"/> نشر محتوى جديد
                  </button>
              </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col bg-[#0f172a] relative">
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f172a]/95 backdrop-blur z-20">
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-amber-500"/>
                      بوابة البائع
                  </h1>
                  <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                      <X className="w-6 h-6"/>
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  {activeTab === 'overview' && (
                      <div className="space-y-8 animate-fade-in-up">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <StatCard label="إجمالي المبيعات" value={`${totalSales} SAR`} icon={<DollarSign className="w-12 h-12"/>} color="text-emerald-500" />
                              <StatCard label="إعلانات نشطة" value={activeAds} icon={<Gavel className="w-12 h-12"/>} color="text-blue-500" />
                              <StatCard label="الخدمات" value={services.length} icon={<ShoppingBag className="w-12 h-12"/>} color="text-purple-500" />
                              <StatCard label="تقييم البائع" value="4.9" icon={<TrendingUp className="w-12 h-12"/>} color="text-amber-500" />
                          </div>
                      </div>
                  )}

                  {activeTab === 'haraj' && (
                      <div className="animate-fade-in-up space-y-4">
                          <h3 className="text-white font-bold mb-4">إدارة إعلانات الحراج</h3>
                          {myHarajListings.length === 0 ? (
                              <div className="text-center py-10 text-gray-500 bg-[#1e293b] rounded-2xl border border-white/5">لا توجد إعلانات.</div>
                          ) : (
                              <div className="grid grid-cols-1 gap-4">
                                  {myHarajListings.map(listing => (
                                      <div key={listing.id} className="bg-[#1e293b] p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                                          <div className="w-20 h-20 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                                              <img src={listing.images[0]} className="w-full h-full object-cover"/>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <div className="flex justify-between">
                                                  <h4 className="text-white font-bold truncate">{listing.title}</h4>
                                                  <span className={`text-[10px] px-2 py-0.5 rounded ${listing.status==='active'?'bg-emerald-500/20 text-emerald-400':'bg-red-500/20 text-red-400'}`}>
                                                      {listing.status === 'active' ? 'نشط' : 'مباع'}
                                                  </span>
                                              </div>
                                              <div className="text-sm text-amber-400 mt-1 font-bold">{listing.price > 0 ? listing.price : 'سوم'} ر.س</div>
                                              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                                  <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {listing.views || 0}</span>
                                              </div>
                                          </div>
                                          {listing.status === 'active' && (
                                              <button onClick={() => markProductAsSold(listing.id)} className="bg-white/5 hover:bg-emerald-600 hover:text-white text-gray-300 px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-white/10">
                                                  تحديد كمباع
                                              </button>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )}

                  {activeTab === 'services' && (
                      <div className="animate-fade-in-up space-y-4">
                          <h3 className="text-white font-bold mb-4">خدماتي</h3>
                          {services.length === 0 ? (
                              <div className="text-center py-10 text-gray-500 bg-[#1e293b] rounded-2xl border border-white/5">لا توجد خدمات منشورة.</div>
                          ) : (
                              services.map(svc => (
                                  <div key={svc.id} className="bg-[#1e293b] p-4 rounded-xl border border-white/5 flex gap-4">
                                      <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400"><Package className="w-6 h-6"/></div>
                                      <div>
                                          <h4 className="text-white font-bold text-sm">{svc.title}</h4>
                                          <p className="text-xs text-gray-400 mt-1">الحالة: {svc.status}</p>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  )}

                  {activeTab === 'financials' && (
                      <div className="text-center py-20 text-gray-500 animate-fade-in-up">لا توجد عمليات مالية مسجلة في هذه الفترة.</div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};
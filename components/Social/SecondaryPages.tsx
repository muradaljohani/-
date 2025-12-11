
import React from 'react';
import { ArrowRight, CheckCircle2, Crown, Zap, BarChart2, DollarSign, Settings, Users, Mic, Layers, Bookmark, Lock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentGateway } from '../PaymentGateway';

interface PageProps {
    onBack: () => void;
}

// --- SHARED HEADER ---
const PageHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2f3336] px-4 py-3 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -mr-2 hover:bg-gray-100 dark:hover:bg-[#18191c] rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-black dark:text-white rtl:rotate-180" />
        </button>
        <h2 className="text-xl font-bold text-black dark:text-[#e7e9ea]">{title}</h2>
    </div>
);

// --- 1. ELITE PAGE (Formerly Premium) ---
export const ElitePage: React.FC<PageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans" dir="rtl">
            <PageHeader title="عضوية النخبة (Elite)" onBack={onBack} />
            <div className="p-6 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
                        <Crown className="w-10 h-10 text-white fill-white" />
                    </div>
                    <h1 className="text-3xl font-black mb-2">كن من النخبة</h1>
                    <p className="text-gray-500 dark:text-[#71767b]">احصل على أدوات حصرية، توثيق فوري، وأولوية في الظهور.</p>
                </div>

                <div className="grid gap-4">
                    {/* Gold Tier */}
                    <div className="border border-gray-200 dark:border-[#2f3336] bg-gray-50 dark:bg-[#16181c] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-br-xl">الأكثر شيوعاً</div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-1">Elite Gold</h3>
                        <div className="text-2xl font-black text-amber-500 mb-4">49 ر.س <span className="text-sm text-gray-500 dark:text-[#71767b] font-normal">/ شهرياً</span></div>
                        <ul className="space-y-3 mb-6 text-sm text-gray-600 dark:text-[#d1d5db]">
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500"/> شارة التوثيق الذهبية</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500"/> تعديل المنشورات</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500"/> رفع فيديو 4K</li>
                            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-500"/> أولوية في الردود</li>
                        </ul>
                        <button className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-colors">اشترك الآن</button>
                    </div>

                    {/* Platinum Tier */}
                    <div className="border border-gray-200 dark:border-[#2f3336] bg-white dark:bg-black rounded-2xl p-6 relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-1">Elite Platinum</h3>
                        <div className="text-2xl font-black text-gray-700 dark:text-gray-300 mb-4">99 ر.س <span className="text-sm text-gray-500 dark:text-[#71767b] font-normal">/ شهرياً</span></div>
                        <p className="text-xs text-gray-500 dark:text-[#71767b] mb-4">كل مميزات Gold بالإضافة إلى:</p>
                        <ul className="space-y-3 mb-6 text-sm text-gray-600 dark:text-[#d1d5db]">
                            <li className="flex gap-2"><Zap className="w-5 h-5 text-purple-500"/> 0% عمولة في السوق</li>
                            <li className="flex gap-2"><Zap className="w-5 h-5 text-purple-500"/> دعم فني مباشر VIP</li>
                        </ul>
                        <button className="w-full py-3 bg-gray-100 dark:bg-[#2f3336] text-black dark:text-white font-bold rounded-full hover:bg-gray-200 dark:hover:bg-[#3f4448] transition-colors">ترقية</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. CREATOR STUDIO (Formerly Monetization) ---
export const CreatorStudioPage: React.FC<PageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans" dir="rtl">
            <PageHeader title="استوديو المبدعين" onBack={onBack} />
            <div className="p-4">
                
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-500"/></div>
                        <button className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">سحب الرصيد</button>
                    </div>
                    <p className="text-gray-600 dark:text-[#71767b] text-sm font-bold">إجمالي الأرباح المقدرة</p>
                    <h2 className="text-4xl font-black text-emerald-900 dark:text-white mt-1">1,240.50 <span className="text-lg text-emerald-700 dark:text-[#71767b]">ر.س</span></h2>
                </div>

                {/* Analytics Grid */}
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-blue-500"/> التحليلات (آخر 28 يوم)</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-[#16181c] p-4 rounded-xl border border-gray-200 dark:border-[#2f3336]">
                        <p className="text-gray-500 dark:text-[#71767b] text-xs font-bold mb-1">مرات الظهور</p>
                        <p className="text-xl font-bold text-black dark:text-white">45.2K</p>
                        <span className="text-xs text-emerald-500">+12%</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#16181c] p-4 rounded-xl border border-gray-200 dark:border-[#2f3336]">
                        <p className="text-gray-500 dark:text-[#71767b] text-xs font-bold mb-1">التفاعل</p>
                        <p className="text-xl font-bold text-black dark:text-white">3.8K</p>
                        <span className="text-xs text-emerald-500">+5%</span>
                    </div>
                </div>

                {/* Tools List */}
                <div className="space-y-1">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#16181c] rounded-xl border border-gray-200 dark:border-[#2f3336] hover:bg-gray-100 dark:hover:bg-[#202327]">
                        <span className="font-bold text-sm">إعدادات العوائد</span>
                        <Settings className="w-4 h-4 text-gray-500 dark:text-[#71767b]"/>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#16181c] rounded-xl border border-gray-200 dark:border-[#2f3336] hover:bg-gray-100 dark:hover:bg-[#202327]">
                        <span className="font-bold text-sm">اشتراكات الداعمين</span>
                        <Users className="w-4 h-4 text-gray-500 dark:text-[#71767b]"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 3. CIRCLES (Formerly Communities) ---
export const CirclesPage: React.FC<PageProps> = ({ onBack }) => {
    const circles = [
        { name: "مجتمع المطورين", members: "12K", img: "bg-blue-600" },
        { name: "عشاق القهوة", members: "8.5K", img: "bg-amber-700" },
        { name: "سوق الأسهم", members: "45K", img: "bg-emerald-600" },
        { name: "مصورين السعودية", members: "15K", img: "bg-purple-600" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans" dir="rtl">
            <PageHeader title="الدوائر (Circles)" onBack={onBack} />
            
            <div className="p-4">
                <div className="relative mb-6">
                    <input type="text" placeholder="ابحث عن دوائر..." className="w-full bg-gray-100 dark:bg-[#202327] border-none rounded-full py-3 px-4 pl-10 text-black dark:text-white focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"/>
                </div>

                <h3 className="font-bold text-lg mb-4">دوائر قد تهمك</h3>
                <div className="grid grid-cols-2 gap-4">
                    {circles.map((c, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-[#16181c] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2f3336] cursor-pointer hover:border-blue-500 dark:hover:border-[#1d9bf0] transition-colors group">
                            <div className={`h-20 ${c.img}`}></div>
                            <div className="p-4 relative">
                                <div className={`w-12 h-12 ${c.img} rounded-xl border-4 border-white dark:border-black absolute -top-6 flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                                    {c.name.charAt(0)}
                                </div>
                                <div className="mt-6">
                                    <h4 className="font-bold text-sm truncate text-black dark:text-white">{c.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-[#71767b]">{c.members} عضو</p>
                                    <button className="mt-3 w-full py-1.5 bg-black dark:bg-[#eff3f4] text-white dark:text-black text-xs font-bold rounded-full hover:opacity-90">انضمام</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 4. LIVE ROOMS (Formerly Spaces) ---
export const LiveRoomsPage: React.FC<PageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans" dir="rtl">
            <PageHeader title="الغرف الحية (Live)" onBack={onBack} />
            <div className="p-4 space-y-4">
                
                {/* Active Room Card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/40 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> Live
                        </div>
                        <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">التقنية والمستقبل</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-black dark:text-white mb-6 leading-relaxed">
                        نقاش: مستقبل الذكاء الاصطناعي في قطاع التعليم السعودي
                    </h3>

                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-black flex items-center justify-center text-xs">U{i}</div>
                            ))}
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2f3336] border-2 border-white dark:border-black flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">+42</div>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                            استماع
                        </button>
                    </div>
                </div>

                {/* Scheduled */}
                <div className="bg-gray-50 dark:bg-[#16181c] border border-gray-200 dark:border-[#2f3336] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 dark:text-[#71767b] text-xs font-bold mb-1">اليوم • 9:00 م</p>
                        <h4 className="font-bold text-sm text-black dark:text-white">تحليل سوق الأسهم</h4>
                        <p className="text-xs text-gray-500 dark:text-[#71767b]">المضيف: سعد المالكي</p>
                    </div>
                    <button className="p-2 border border-gray-200 dark:border-[#2f3336] rounded-full hover:bg-gray-100 dark:hover:bg-[#202327]">
                        <Mic className="w-5 h-5 text-gray-500 dark:text-[#71767b]"/>
                    </button>
                </div>
            </div>
            
            {/* Create FAB */}
            <div className="fixed bottom-6 left-6">
                <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-500 transition-colors">
                    <Mic className="w-7 h-7"/>
                </button>
            </div>
        </div>
    );
};

// --- 5. COLLECTIONS (Formerly Lists) ---
export const CollectionsPage: React.FC<PageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans" dir="rtl">
            <PageHeader title="المجموعات (Collections)" onBack={onBack} />
            <div className="p-4">
                <div className="bg-gray-50 dark:bg-[#16181c] rounded-2xl border border-gray-200 dark:border-[#2f3336] overflow-hidden mb-4">
                    <div className="h-24 bg-gradient-to-r from-blue-800 to-cyan-600"></div>
                    <div className="p-4 relative">
                        <div className="w-16 h-16 bg-white dark:bg-black rounded-xl border-4 border-white dark:border-black absolute -top-8 flex items-center justify-center">
                            <Layers className="w-8 h-8 text-gray-500"/>
                        </div>
                        <div className="mt-8 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-white">أخبار التقنية</h3>
                                <p className="text-xs text-gray-500 dark:text-[#71767b]">124 عضو • 50 تغريدة يومياً</p>
                            </div>
                            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-bold">متابعة</button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#16181c] rounded-2xl border border-gray-200 dark:border-[#2f3336] overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-purple-800 to-pink-600"></div>
                    <div className="p-4 relative">
                        <div className="w-16 h-16 bg-white dark:bg-black rounded-xl border-4 border-white dark:border-black absolute -top-8 flex items-center justify-center">
                            <Star className="w-8 h-8 text-gray-500"/>
                        </div>
                        <div className="mt-8 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-black dark:text-white">نخبة المؤثرين</h3>
                                <p className="text-xs text-gray-500 dark:text-[#71767b]">خاصة • 45 عضو</p>
                            </div>
                            <Lock className="w-4 h-4 text-gray-500 dark:text-[#71767b]"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 6. SAVED (Formerly Bookmarks) ---
export const SavedPage: React.FC<PageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-[#e7e9ea] font-sans" dir="rtl">
            <PageHeader title="المحفوظات (Saved)" onBack={onBack} />
            <div className="p-6 text-center mt-10">
                <div className="w-32 h-32 bg-gray-100 dark:bg-[#16181c] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bookmark className="w-12 h-12 text-gray-400 dark:text-[#2f3336] fill-gray-400 dark:fill-[#2f3336]"/>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">احفظ تغريداتك للرجوع إليها لاحقاً</h3>
                <p className="text-gray-500 dark:text-[#71767b] text-sm max-w-xs mx-auto">
                    لا تضيع الأشياء الجيدة! احفظ المنشورات لتعود إليها بسهولة في أي وقت.
                </p>
            </div>
        </div>
    );
};

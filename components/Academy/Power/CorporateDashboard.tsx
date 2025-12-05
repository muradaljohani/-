
import React, { useState } from 'react';
import { X, Users, CreditCard, PieChart, Download, Plus, CheckCircle2, AlertCircle, Menu } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { PaymentGateway } from '../../PaymentGateway';

interface Props {
    onClose: () => void;
}

export const CorporateDashboard: React.FC<Props> = ({ onClose }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'employees' | 'licenses'>('employees');
    const [licenseCount, setLicenseCount] = useState(10);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mock Employees
    const employees = [
        { id: 1, name: 'سعيد الغامدي', role: 'محاسب', progress: 85, status: 'Certified' },
        { id: 2, name: 'نورة العلي', role: 'HR', progress: 40, status: 'Active' },
        { id: 3, name: 'فهد الدوسري', role: 'IT', progress: 10, status: 'Stalled' },
        { id: 4, name: 'محمد سالم', role: 'Sales', progress: 100, status: 'Certified' },
    ];

    const PRICE_PER_SEAT = 200; // SAR
    const TOTAL_PRICE = licenseCount * PRICE_PER_SEAT;

    const renderNavButtons = () => (
        <>
            <button onClick={() => { setActiveTab('employees'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${activeTab === 'employees' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <Users className="w-4 h-4"/> الموظفين
            </button>
            <button onClick={() => { setActiveTab('licenses'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${activeTab === 'licenses' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                <CreditCard className="w-4 h-4"/> إدارة التراخيص
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5">
                <PieChart className="w-4 h-4"/> تقارير الأداء
            </button>
        </>
    );

    return (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full h-full md:max-w-5xl md:h-[85vh] bg-[#0f172a] border border-blue-500/30 md:rounded-3xl shadow-2xl flex overflow-hidden">
                
                {/* Desktop Sidebar */}
                <div className="w-64 bg-[#0b1120] border-l border-white/10 p-6 flex flex-col hidden md:flex">
                    <h2 className="text-xl font-black text-white mb-8 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500"/> بوابة الشركات
                    </h2>
                    <nav className="space-y-2 flex-1">
                        {renderNavButtons()}
                    </nav>
                    <button onClick={onClose} className="bg-white/5 p-3 rounded-xl text-gray-400 hover:text-white transition-colors">خروج</button>
                </div>

                {/* Mobile Off-Canvas Sidebar */}
                <div className={`absolute inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
                <div className={`absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-[#0b1120] border-l border-white/10 z-50 transform transition-transform duration-300 md:hidden p-6 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-500"/> بوابة الشركات
                        </h2>
                        <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-gray-400"/></button>
                    </div>
                    <nav className="space-y-2 flex-1">
                        {renderNavButtons()}
                    </nav>
                    <button onClick={onClose} className="bg-white/5 p-3 rounded-xl text-gray-400 hover:text-white transition-colors">خروج</button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0f172a] to-[#1e293b] relative">
                    <div className="h-16 border-b border-white/10 flex justify-between items-center px-4 md:px-8">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-white bg-white/10 rounded-lg">
                                <Menu className="w-5 h-5"/>
                            </button>
                            <h3 className="text-white font-bold text-sm md:text-base">{activeTab === 'employees' ? 'متابعة أداء الفريق' : 'شراء تراخيص بالجملة'}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 hidden sm:inline">رصيد التراخيص:</span>
                            <span className="text-emerald-400 font-bold font-mono text-sm">24 مقعد</span>
                        </div>
                    </div>

                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                        
                        {activeTab === 'employees' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-gray-400 text-xs mb-1">نسبة الإنجاز العامة</div>
                                        <div className="text-2xl font-bold text-white">68%</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-gray-400 text-xs mb-1">شهادات مصدرة</div>
                                        <div className="text-2xl font-bold text-emerald-400">15</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-gray-400 text-xs mb-1">ساعات تدريبية</div>
                                        <div className="text-2xl font-bold text-blue-400">340h</div>
                                    </div>
                                </div>

                                {/* Responsive Card-View Table */}
                                <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                                    <table className="w-full text-right text-sm text-gray-300 responsive-table">
                                        <thead className="bg-white/5 text-xs font-bold text-gray-400 uppercase">
                                            <tr>
                                                <th className="p-4">الموظف</th>
                                                <th className="p-4">الدور</th>
                                                <th className="p-4">التقدم</th>
                                                <th className="p-4">الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {employees.map(emp => (
                                                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-bold text-white" data-label="الموظف">{emp.name}</td>
                                                    <td className="p-4" data-label="الدور">{emp.role}</td>
                                                    <td className="p-4" data-label="التقدم">
                                                        <div className="w-full md:w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
                                                            <div className={`h-full ${emp.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{width: `${emp.progress}%`}}></div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4" data-label="الحالة">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            emp.status === 'Certified' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            emp.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>{emp.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'licenses' && (
                            <div className="max-w-xl mx-auto text-center space-y-8 py-10">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                                    <CreditCard className="w-10 h-10 text-emerald-400"/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">شراء تراخيص بالجملة</h2>
                                    <p className="text-gray-400">احصل على خصم الشركات عند شراء أكثر من 10 مقاعد.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-gray-300">عدد المقاعد</span>
                                        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl">
                                            <button onClick={() => setLicenseCount(Math.max(5, licenseCount - 5))} className="text-white hover:text-blue-400 font-bold text-xl">-</button>
                                            <span className="text-xl font-black text-white w-12 text-center">{licenseCount}</span>
                                            <button onClick={() => setLicenseCount(licenseCount + 5)} className="text-white hover:text-blue-400 font-bold text-xl">+</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <span className="text-gray-300">الإجمالي (شامل الضريبة)</span>
                                        <span className="text-2xl font-black text-emerald-400">{TOTAL_PRICE} ر.س</span>
                                    </div>
                                </div>

                                <button onClick={() => setIsPaymentOpen(true)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all">
                                    إتمام الشراء
                                </button>
                            </div>
                        )}

                    </div>
                </div>
                
                {/* Close Button on Mobile (Overlay) */}
                <button onClick={onClose} className="absolute top-4 left-4 md:hidden p-2 bg-black/50 text-white rounded-full z-50">
                    <X className="w-5 h-5"/>
                </button>
            </div>

            <PaymentGateway 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={TOTAL_PRICE}
                title={`شراء ${licenseCount} ترخيص تدريبي`}
                onSuccess={() => { setIsPaymentOpen(false); alert("تم إضافة التراخيص إلى رصيد الشركة."); }}
            />
        </div>
    );
};
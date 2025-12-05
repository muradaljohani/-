
import React, { useState } from 'react';
import { X, Wallet as WalletIcon, CreditCard, ArrowRight, Activity, ArrowUpRight, ArrowDownLeft, Receipt, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaymentGateway } from '../PaymentGateway';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, depositToWallet } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices'>('overview');
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  if (!isOpen || !user || !user.wallet) return null;

  const handleDepositSuccess = (txn: any) => {
      setIsDepositOpen(false);
      depositToWallet(txn.amount).then(success => {
          if (success) alert("تم إيداع المبلغ بنجاح في محفظتك.");
          else alert("حدث خطأ أثناء معالجة الإيداع.");
      });
  };

  return (
    <>
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-[#1e293b] p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 border border-blue-500/20">
                    <WalletIcon className="w-6 h-6"/>
                </div>
                <div>
                    <h2 className="text-xl font-black text-white">المحفظة الرقمية</h2>
                    <p className="text-xs text-gray-400 font-mono">ID: {user.wallet.id}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-6 h-6"/></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-black/20 border-l border-white/10 p-4 space-y-2 hidden md:block">
                <button onClick={() => setActiveTab('overview')} className={`w-full text-right px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab==='overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Activity className="w-5 h-5"/> نظرة عامة
                </button>
                <button onClick={() => setActiveTab('invoices')} className={`w-full text-right px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab==='invoices' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
                    <Receipt className="w-5 h-5"/> الفواتير الضريبية
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
                
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-blue-200 text-sm font-medium mb-1">الرصيد الحالي</p>
                                    <h3 className="text-5xl font-black tracking-tight">{user.wallet.balance.toFixed(2)} <span className="text-lg font-normal opacity-70">SAR</span></h3>
                                </div>
                                <button onClick={() => setIsDepositOpen(true)} className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg">
                                    <Plus className="w-5 h-5"/> شحن المحفظة
                                </button>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div>
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-gray-400 rtl:rotate-180"/> أحدث العمليات</h3>
                            <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                                {user.wallet.ledger.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">لا توجد عمليات مسجلة بعد.</div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {user.wallet.ledger.slice(0, 10).map(entry => (
                                            <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-full ${entry.type === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {entry.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5"/> : <ArrowUpRight className="w-5 h-5"/>}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm">{entry.description}</div>
                                                        <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className={`font-mono font-bold ${entry.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {entry.type === 'CREDIT' ? '+' : '-'}{entry.amount.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'invoices' && (
                    <div className="animate-fade-in-up">
                        <div className="bg-amber-900/20 border border-amber-500/20 p-4 rounded-xl mb-6 flex gap-3">
                            <Receipt className="w-6 h-6 text-amber-500 shrink-0"/>
                            <p className="text-sm text-amber-100">
                                جميع الفواتير تصدر إلكترونياً ومتوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (فاتورة).
                            </p>
                        </div>
                        
                        {/* Invoice List would go here using InvoiceSystem.getInvoices(user.id) */}
                        <div className="text-center py-10 text-gray-500">جاري ربط نظام الفوترة الإلكترونية...</div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>

    <PaymentGateway 
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        amount={100} // Default or dynamic
        title="شحن المحفظة"
        description="إيداع رصيد في محفظة ميلاف الرقمية"
        onSuccess={handleDepositSuccess}
    />
    </>
  );
};

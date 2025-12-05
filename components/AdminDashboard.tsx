
import React, { useState, useEffect } from 'react';
import { X, BarChart3, Users, FileText, Shield, Database, PenTool, Save, Upload, Download, CheckCircle, AlertTriangle, DollarSign, Award, Bell, Megaphone, BookOpen, Terminal, Activity, Server, Zap, Receipt, Search, Eye, Check, XCircle, Skull, Edit3, PieChart, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Enterprise } from '../services/Enterprise/EnterpriseCore';
import { FinanceCore } from '../services/Economy/FinanceCore';
import { Titan } from '../services/Titan/TitanEngine';
import { Transaction } from '../types';
import { FinancialAnalytics } from './Finance/FinancialAnalytics';
import { ExportEngine } from '../services/Finance/ExportEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, adminConfig, updateAdminConfig, generateBackup, restoreBackup, getSystemAnalytics, sendSystemNotification } = useAuth();
  const [activeTab, setActiveTab] = useState<'executive' | 'finance_hub' | 'analytics' | 'users' | 'settings' | 'backup' | 'broadcast' | 'shadow'>('executive');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Off-Canvas State
  
  const stats = getSystemAnalytics();
  
  const finance = FinanceCore.getInstance();
  const [pendingTxns, setPendingTxns] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // For Analytics
  
  // Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Live Logs
  const [logs, setLogs] = useState<string[]>([]);

  // Approval State
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState<string>('');

  useEffect(() => {
      if (isOpen) {
          // Load all transactions for analytics
          const allTxns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]');
          setAllTransactions(allTxns);

          const interval = setInterval(() => {
              setLogs([...Enterprise.AnalyticsStream.logs]);
              setPendingTxns(finance.getPendingTransactions()); // Poll for financial updates
          }, 1000);
          return () => clearInterval(interval);
      }
  }, [isOpen]);

  // If not admin, don't show
  if (!user || user.role !== 'admin') return null;
  if (!isOpen) return null;

  // --- Handlers (Existing) ---
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'ceo' | 'stamp') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (type === 'ceo') updateAdminConfig({ ceoSignature: reader.result as string });
              else updateAdminConfig({ academicStamp: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleDownloadBackup = () => {
      const data = generateBackup();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ACADEMY_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const success = restoreBackup(e.target?.result as string);
              if (success) alert('تم استعادة النسخة الاحتياطية بنجاح!');
              else alert('فشل استعادة النسخة. الملف غير صالح.');
          };
          reader.readAsText(file);
      }
  };

  const handleBroadcast = () => {
      if(!broadcastTitle || !broadcastMessage) return alert("يرجى ملء جميع الحقول");
      sendSystemNotification(user.id, broadcastTitle, broadcastMessage, 'system');
      alert(`تم إرسال الإشعار لـ ${stats.usersCount} مستخدم بنجاح!`);
      setBroadcastTitle('');
      setBroadcastMessage('');
  };

  // --- FINANCE EXPORT ---
  const handleExportFinance = () => {
      ExportEngine.getInstance().exportTransactionsToCSV(allTransactions, `Finance_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // --- FINANCE HUB ACTIONS ---
  const initApprove = (txn: Transaction) => {
      setEditingTxId(txn.id);
      setConfirmedAmount(txn.amount.toString());
  };

  const handleConfirmApproval = (txn: Transaction) => {
      const realAmount = parseFloat(confirmedAmount);
      if (isNaN(realAmount)) return alert("المبلغ غير صحيح");

      const isSurplus = realAmount > txn.amount;
      const confirmMsg = isSurplus 
          ? `⚠️ تنبيه: المبلغ المدخل (${realAmount}) أكبر من المطلوب (${txn.amount}). سيتم إيداع الفارق (${realAmount - txn.amount} ريال) في محفظة العميل تلقائياً.\n\nهل أنت متأكد؟`
          : 'هل أنت متأكد من اعتماد هذا الإيصال وتفعيل الخدمة؟';

      if(confirm(confirmMsg)) {
          finance.approveTransaction(txn.id, realAmount);
          sendSystemNotification(txn.buyerId, 'تم اعتماد الدفع', 'تم التحقق من الحوالة البنكية وتفعيل طلبك بنجاح.', 'success');
          alert('تم الاعتماد بنجاح');
          setPendingTxns(finance.getPendingTransactions());
          setAllTransactions(JSON.parse(localStorage.getItem('mylaf_transactions') || '[]')); // Refresh analytics
          setEditingTxId(null);
      }
  };

  const handleRejectTxn = (id: string, buyerId: string) => {
      if(confirm('هل أنت متأكد من رفض الإيصال؟')) {
          finance.rejectTransaction(id);
          sendSystemNotification(buyerId, 'رفض الدفع', 'عذراً، لم نتمكن من التحقق من الإيصال المرفق. يرجى التأكد من البيانات والمحاولة مرة أخرى.', 'error');
          alert('تم الرفض');
          setPendingTxns(finance.getPendingTransactions());
          setAllTransactions(JSON.parse(localStorage.getItem('mylaf_transactions') || '[]')); // Refresh analytics
      }
  };

  // --- SHADOW ADMIN REPORT ---
  const ShadowReportView = () => {
      const report = Titan.Shadow.runSelfAudit();
      const chain = Titan.BlackBox.getChain();

      return (
          <div className="space-y-6 animate-fade-in-up">
              <div className="bg-gradient-to-r from-gray-900 to-black border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Skull className="w-32 h-32 text-red-500"/></div>
                  <h2 className="text-2xl font-black text-red-500 mb-2 tracking-widest">THE SHADOW REPORT</h2>
                  <p className="text-gray-400 text-xs font-mono">AUTONOMOUS CEO PROTOCOL • {report.generatedAt}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 relative z-10">
                      <div>
                          <div className="text-gray-500 text-xs font-bold uppercase">System Health</div>
                          <div className="text-4xl font-black text-white">{report.systemHealth}%</div>
                      </div>
                      <div>
                          <div className="text-gray-500 text-xs font-bold uppercase">BlackBox Status</div>
                          <div className={`text-xl font-black ${report.integrityStatus === 'SECURE' ? 'text-emerald-500' : 'text-red-500'}`}>{report.integrityStatus}</div>
                      </div>
                      <div>
                          <div className="text-gray-500 text-xs font-bold uppercase">Threats Neutralized</div>
                          <div className="text-4xl font-black text-white">{report.threatsBlocked}</div>
                      </div>
                      <div>
                          <div className="text-gray-500 text-xs font-bold uppercase">Action Required</div>
                          <div className={`text-xl font-black ${report.actionRequired ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>{report.actionRequired ? 'YES' : 'NONE'}</div>
                      </div>
                  </div>
              </div>

              <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-500"/> BlackBox Ledger (Last 5 Blocks)
                  </h3>
                  <div className="space-y-2 font-mono text-xs">
                      {chain.slice(-5).reverse().map((block) => (
                          <div key={block.index} className="bg-black/40 p-3 rounded border border-white/5 flex flex-col gap-1">
                              <div className="flex justify-between text-gray-500">
                                  <span>BLOCK #{block.index}</span>
                                  <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <div className="text-emerald-400 break-all">HASH: {block.hash}</div>
                              <div className="text-gray-400">TYPE: {block.type}</div>
                              <div className="text-gray-500 truncate">DATA: {JSON.stringify(block.data)}</div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  // --- NEW EXECUTIVE DASHBOARD ---
  const ExecutiveHub = () => (
      <div className="space-y-6 animate-fade-in-up">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Traffic</span>
                      <Activity className="w-4 h-4 text-emerald-400"/>
                  </div>
                  <div className="text-2xl font-black text-white">142.5K</div>
                  <div className="text-[10px] text-emerald-400 mt-1">+12.5% this week</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Revenue</span>
                      <DollarSign className="w-4 h-4 text-amber-400"/>
                  </div>
                  <div className="text-2xl font-black text-white">{(stats.totalRevenue/1000).toFixed(1)}K <span className="text-xs font-normal text-gray-500">SAR</span></div>
                  <div className="text-[10px] text-amber-400 mt-1">Course Sales & Services</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Security</span>
                      <Shield className="w-4 h-4 text-blue-400"/>
                  </div>
                  <div className="text-2xl font-black text-white">99.9%</div>
                  <div className="text-[10px] text-blue-400 mt-1">WAF Active & Blocking</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">API Req</span>
                      <Server className="w-4 h-4 text-purple-400"/>
                  </div>
                  <div className="text-2xl font-black text-white">45ms</div>
                  <div className="text-[10px] text-purple-400 mt-1">Avg Latency (Accelerator)</div>
              </div>
          </div>

          {/* Charts & Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart Area (CSS/HTML Simulation of Chart.js) */}
              <div className="lg:col-span-2 bg-[#1e293b] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-500"/> Revenue & Traffic Overview
                  </h3>
                  
                  {/* CSS Bar Chart Simulation */}
                  <div className="flex items-end justify-between h-48 gap-2 px-2">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                          <div key={i} className="w-full bg-blue-500/20 rounded-t-sm relative group hover:bg-blue-500/40 transition-colors" style={{height: `${h}%`}}>
                              <div className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-t-sm" style={{height: `${h/2}%`}}></div>
                              {/* Tooltip */}
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {h * 10} Visits
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
                      <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                      <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
                  </div>
              </div>

              {/* Live Terminal */}
              <div className="bg-black border border-gray-800 rounded-2xl p-4 font-mono text-xs flex flex-col h-[300px]">
                  <div className="flex items-center gap-2 text-green-500 mb-2 border-b border-gray-800 pb-2">
                      <Terminal className="w-4 h-4"/> Live System Logs
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                      {logs.map((log, i) => (
                          <div key={i} className="text-gray-300">
                              <span className="text-blue-500">➜</span> {log}
                          </div>
                      ))}
                      <div className="text-gray-500 animate-pulse">_ Waiting for stream...</div>
                  </div>
              </div>
          </div>
      </div>
  );

  // --- OFF-CANVAS NAV RENDERER ---
  const renderNavLinks = () => (
      <>
        <button onClick={() => { setActiveTab('executive'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'executive' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Activity className="w-5 h-5"/> المركز التنفيذي
        </button>
        <button onClick={() => { setActiveTab('shadow'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'shadow' ? 'bg-red-900/50 text-red-400 border border-red-900' : 'text-gray-400 hover:bg-white/5'}`}>
            <Skull className="w-5 h-5"/> تقارير الظل (Shadow)
        </button>
        <div className="my-2 h-px bg-white/10"></div>
        <button onClick={() => { setActiveTab('finance_hub'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'finance_hub' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Receipt className="w-5 h-5"/> الخزنة المالية <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{pendingTxns.length}</span>
        </button>
        <button onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <PieChart className="w-5 h-5"/> تحليلات Eagle Eye
        </button>
        <button onClick={() => { setActiveTab('broadcast'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'broadcast' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Megaphone className="w-5 h-5"/> التنبيهات العامة
        </button>
        <button onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Users className="w-5 h-5"/> إدارة المستخدمين
        </button>
        <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <PenTool className="w-5 h-5"/> التواقيع والأختام
        </button>
        <button onClick={() => { setActiveTab('backup'); setMobileMenuOpen(false); }} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'backup' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'}`}>
            <Database className="w-5 h-5"/> النسخ الاحتياطي
        </button>
      </>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-[#0f172a] flex flex-col animate-fade-in-up overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 p-4 flex justify-between items-center shadow-lg sticky top-0 z-30">
             <div className="flex items-center gap-3">
                 <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white bg-white/10 rounded-lg">
                     <Menu className="w-6 h-6"/>
                 </button>
                 <div className="bg-amber-600 p-2 rounded-lg hidden md:block"><Zap className="w-6 h-6 text-white"/></div>
                 <div>
                     <h1 className="text-sm md:text-xl font-bold text-white">لوحة التحكم التنفيذية (Tier-1)</h1>
                     <p className="text-[10px] md:text-xs text-gray-400 font-mono hidden md:block">Infrastructure: Titan Core Enterprise</p>
                 </div>
             </div>
             <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors"><X className="w-6 h-6"/></button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
            
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 bg-black/20 border-l border-white/10 flex-col p-4 space-y-2">
                {renderNavLinks()}
            </div>

            {/* Mobile Off-Canvas Drawer */}
            <div className={`absolute inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-[#0b1120] border-l border-white/10 z-50 transform transition-transform duration-300 md:hidden overflow-y-auto p-4 space-y-2 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-white font-bold">القائمة</span>
                    <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-gray-400"/></button>
                </div>
                {renderNavLinks()}
            </div>

            {/* Content */}
            <div className="flex-1 bg-slate-900/50 p-4 md:p-8 overflow-y-auto scrollbar-thin">
                {activeTab === 'executive' && <ExecutiveHub />}
                {activeTab === 'shadow' && <ShadowReportView />}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><PieChart className="w-6 h-6 text-blue-500"/> تقارير النسر (Eagle Eye)</h2>
                            <button onClick={handleExportFinance} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-sm transition-all">
                                <Download className="w-4 h-4"/> تصدير تقرير مالي
                            </button>
                        </div>
                        <FinancialAnalytics transactions={allTransactions} />
                    </div>
                )}
                
                {activeTab === 'finance_hub' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Receipt className="w-6 h-6 text-emerald-500"/> تدقيق الحوالات</h2>
                            <div className="hidden md:block bg-black/30 px-4 py-2 rounded-lg text-sm text-gray-400 border border-white/5">
                                بنك الجزيرة - SA3860...
                            </div>
                        </div>

                        {pendingTxns.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4"/>
                                <p className="text-gray-400">لا توجد طلبات معلقة. جميع الحسابات مطابقة.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pendingTxns.map(txn => (
                                    <div key={txn.id} className="bg-[#1e293b] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            {/* Receipt Preview */}
                                            <div className="relative group cursor-pointer w-16 h-16 md:w-20 md:h-20 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0" onClick={() => window.open(txn.receiptUrl, '_blank')}>
                                                <img src={txn.receiptUrl} alt="Receipt" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                                                    <Eye className="w-6 h-6 text-white"/>
                                                </div>
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="min-w-0">
                                                <h3 className="text-white font-bold text-sm md:text-base truncate">{txn.serviceTitle}</h3>
                                                <div className="text-xs text-gray-400 mt-1">المشتري: <span className="text-white">{txn.buyerName}</span></div>
                                                <div className="text-[10px] text-gray-500">{new Date(txn.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>

                                        {editingTxId === txn.id ? (
                                            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-emerald-500/30 w-full md:w-auto justify-end">
                                                <div className="text-right">
                                                    <label className="block text-[9px] text-emerald-400 mb-1">المبلغ الفعلي</label>
                                                    <input 
                                                        type="number" 
                                                        value={confirmedAmount}
                                                        onChange={e => setConfirmedAmount(e.target.value)}
                                                        className="w-24 bg-[#0f172a] border border-white/10 rounded p-1 text-white text-xs outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <button onClick={() => handleConfirmApproval(txn)} className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"><Check className="w-4 h-4"/></button>
                                                    <button onClick={() => setEditingTxId(null)} className="p-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"><X className="w-4 h-4"/></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full md:w-auto gap-6">
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-emerald-400">{txn.amount} SAR</div>
                                                    <div className="text-[10px] text-gray-500 font-mono">TXN: {txn.id.split('-')[1]}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => initApprove(txn)} className="p-2 md:p-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white shadow-lg transition-all" title="اعتماد وتفعيل">
                                                        <Edit3 className="w-4 h-4 md:w-5 md:h-5"/>
                                                    </button>
                                                    <button onClick={() => handleRejectTxn(txn.id, txn.buyerId)} className="p-2 md:p-3 bg-red-600 hover:bg-red-500 rounded-lg text-white shadow-lg transition-all" title="رفض">
                                                        <XCircle className="w-4 h-4 md:w-5 md:h-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* ... (Existing Tabs) */}
                {activeTab === 'broadcast' && (
                    <div className="max-w-2xl bg-[#1e293b] rounded-2xl border border-white/5 p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell className="w-6 h-6 text-amber-500"/> إرسال تنبيه عام</h2>
                        <div className="space-y-4">
                            <input type="text" value={broadcastTitle} onChange={e=>setBroadcastTitle(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none" placeholder="العنوان"/>
                            <textarea value={broadcastMessage} onChange={e=>setBroadcastMessage(e.target.value)} className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white outline-none h-32 resize-none" placeholder="الرسالة"/>
                            <button onClick={handleBroadcast} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold">إرسال للجميع</button>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">التوقيعات الديناميكية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">توقيع المدير التنفيذي</label>
                                <div className="h-32 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center relative"><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleSignatureUpload(e, 'ceo')} />{adminConfig.ceoSignature ? <img src={adminConfig.ceoSignature} className="h-full object-contain"/> : <span className="text-xs text-gray-500">رفع توقيع</span>}</div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">الختم الرسمي</label>
                                <div className="h-32 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center relative"><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleSignatureUpload(e, 'stamp')} />{adminConfig.academicStamp ? <img src={adminConfig.academicStamp} className="h-full object-contain"/> : <span className="text-xs text-gray-500">رفع ختم</span>}</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'backup' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                        <button onClick={handleDownloadBackup} className="p-6 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex flex-col items-center gap-3"><Download className="w-10 h-10 text-blue-400"/><div className="text-white font-bold">تصدير نسخة</div></button>
                        <div className="p-6 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-3 relative"><Upload className="w-10 h-10 text-emerald-400"/><div className="text-white font-bold">استعادة النظام</div><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleRestoreBackup} accept=".json" /></div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
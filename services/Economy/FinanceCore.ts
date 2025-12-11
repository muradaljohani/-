
import { Transaction, TransactionStatus, User, Notification } from '../../types';
import { WalletSystem } from './WalletSystem';
import { ConstitutionCore } from '../Interstellar/ConstitutionCore';

export class FinanceCore {
  private static instance: FinanceCore;
  private receiptHashes: Set<string> = new Set();
  private collectorInterval: any;

  private constructor() {
      // Hydrate receipt hashes from existing transactions to prevent dupes on reload
      try {
          const txns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]');
          txns.forEach((t: any) => {
              if (t.receiptHash) this.receiptHashes.add(t.receiptHash);
          });
      } catch (e) {
          console.warn("FinanceCore data reset due to corruption");
      }
  }

  public static getInstance(): FinanceCore {
    if (!FinanceCore.instance) {
      FinanceCore.instance = new FinanceCore();
    }
    return FinanceCore.instance;
  }

  // --- 1. RECEIPT VAULT ENGINE ---
  
  // Simulates SHA-256 hash generation for the image file
  public async generateReceiptHash(file: File): Promise<string> {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public isDuplicateReceipt(hash: string): boolean {
      return this.receiptHashes.has(hash);
  }

  // --- 2. TRANSACTION MANAGER ---

  public async submitBankTransfer(data: {
      userId: string;
      userName: string;
      serviceTitle: string;
      amount: number;
      receiptFile: File;
      category: 'Course' | 'Job' | 'Market' | 'Wallet';
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
      
      const hash = await this.generateReceiptHash(data.receiptFile);

      // 1. Forensics Check: Duplicate?
      if (this.isDuplicateReceipt(hash)) {
          console.warn(`[FinanceCore] Fraud Alert: Duplicate receipt detected (Hash: ${hash.substr(0,8)}...)`);
          return { success: false, error: 'SECURITY_ALERT: تم استخدام صورة الإيصال هذه مسبقاً. يرجى رفع إيصال جديد.' };
      }

      // 2. Convert Image to Base64 for Storage (Simulation)
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(data.receiptFile);
      });
      const receiptUrl = await base64Promise;

      // 3. Create Transaction Record
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const newTxn: Transaction = {
          id: transactionId,
          serviceTitle: data.serviceTitle,
          buyerId: data.userId,
          buyerName: data.userName,
          sellerId: 'SYSTEM_ALJAZIRA', // Central Bank
          sellerName: 'Murad Group (Finance)',
          amount: data.amount,
          total: data.amount,
          status: 'pending_verification',
          paymentMethod: 'bank',
          receiptUrl: receiptUrl,
          receiptHash: hash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
      };

      // 4. Save to Ledger
      let existingTxns = [];
      try {
        existingTxns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]');
      } catch (e) { existingTxns = []; }
      
      localStorage.setItem('mylaf_transactions', JSON.stringify([newTxn, ...existingTxns]));
      
      // Update Memory Cache
      this.receiptHashes.add(hash);

      return { success: true, transactionId };
  }

  // --- 3. ADMIN AUDIT ACTIONS & SMART CHANGE & CONSTITUTION TAX ---

  public getPendingTransactions(): Transaction[] {
      let txns = [];
      try { txns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]'); } catch (e) {}
      return txns.filter((t: Transaction) => t.status === 'pending_verification');
  }

  public approveTransaction(txId: string, confirmedAmount?: number): boolean {
      let txns = [];
      try { txns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]'); } catch (e) {}
      
      let found = false;
      const updated = txns.map((t: Transaction) => {
          if (t.id === txId) {
              found = true;
              
              let finalAmount = t.amount;

              // --- SMART CHANGE LOGIC ---
              if (confirmedAmount && confirmedAmount > t.amount) {
                  const surplus = confirmedAmount - t.amount;
                  console.log(`[FinanceCore] Smart Change Detected: +${surplus} SAR. Auto-depositing to wallet.`);
                  
                  // Credit User Wallet
                  WalletSystem.getInstance().processTransaction(
                      `w_${t.buyerId}_auto`, 
                      'DEPOSIT', 
                      surplus, 
                      `Smart Change: Surplus from ${t.serviceTitle}`
                  );
                  finalAmount = confirmedAmount;
              }

              // --- CONSTITUTION LOGIC: RESERVE TAX ---
              // Automatically move 10% to Reserve Fund
              ConstitutionCore.getInstance().enforceTax(finalAmount, t.serviceTitle);

              return { ...t, status: 'completed', amount: finalAmount, updatedAt: new Date().toISOString() };
          }
          return t;
      });

      if (found) {
          localStorage.setItem('mylaf_transactions', JSON.stringify(updated));
          return true;
      }
      return false;
  }

  public rejectTransaction(txId: string): boolean {
      let txns = [];
      try { txns = JSON.parse(localStorage.getItem('mylaf_transactions') || '[]'); } catch (e) {}
      
      const updated = txns.map((t: Transaction) => {
          if (t.id === txId) {
              return { ...t, status: 'rejected', updatedAt: new Date().toISOString() };
          }
          return t;
      });
      localStorage.setItem('mylaf_transactions', JSON.stringify(updated));
      return true;
  }

  // --- 4. THE DEBT COLLECTOR (Recovery Engine) ---
  
  public startDebtCollector() {
      if (this.collectorInterval) return;
      console.log("👮 [FinanceCore] Debt Collector: Active. Scanning for lost invoices...");
      
      this.collectorInterval = setInterval(() => {
          this.runRecoveryRoutine();
      }, 60000); // Check every minute (Simulated Hour)
  }

  private runRecoveryRoutine() {
      let invoices = [];
      try { invoices = JSON.parse(localStorage.getItem('user_invoices') || '[]'); } catch (e) {}
      
      const now = Date.now();

      invoices.forEach((inv: any) => {
          if (inv.status === 'unpaid') {
              const age = now - new Date(inv.issueDate).getTime();
              const hours = age / (1000 * 60 * 60);

              // 1. Hour 1 Reminder
              if (hours >= 1 && hours < 2 && !inv.reminded_1h) {
                  console.log(`[Debt Collector] Sending 1h Reminder for INV ${inv.id}`);
                  this.sendRecoveryNotification(inv.userId, `تذكير: فاتورة #${inv.id} بانتظار السداد.`, 'financial');
                  inv.reminded_1h = true;
              }

              // 2. Hour 24 Urgency
              if (hours >= 24 && !inv.reminded_24h) {
                  console.log(`[Debt Collector] Sending 24h Urgency for INV ${inv.id}`);
                  this.sendRecoveryNotification(inv.userId, `عاجل: سيتم إلغاء طلبك #${inv.id} خلال ساعتين.`, 'warning');
                  inv.reminded_24h = true;
              }
          }
      });

      localStorage.setItem('user_invoices', JSON.stringify(invoices));
  }

  private sendRecoveryNotification(userId: string, message: string, type: 'financial' | 'warning') {
      let users = [];
      try { users = JSON.parse(localStorage.getItem('mylaf_users') || '[]'); } catch (e) {}
      
      const updatedUsers = users.map((u: User) => {
          if (u.id === userId) {
              const newNotif: Notification = {
                  id: `rec_${Date.now()}`,
                  userId,
                  type,
                  title: 'المحصل المالي الآلي',
                  message,
                  isRead: false,
                  date: new Date().toISOString()
              };
              u.notifications = [newNotif, ...(u.notifications || [])];
              
              try {
                  const session = JSON.parse(localStorage.getItem('mylaf_session') || '{}');
                  if (session.id === userId) {
                      localStorage.setItem('mylaf_session', JSON.stringify(u));
                  }
              } catch(e) {}
          }
          return u;
      });
      localStorage.setItem('mylaf_users', JSON.stringify(updatedUsers));
  }
}

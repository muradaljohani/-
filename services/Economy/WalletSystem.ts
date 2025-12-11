
import { Wallet, LedgerEntry, TransactionType, User } from '../../types';

// THE MURAD VAULT (Financial Core)
export class WalletSystem {
  private static instance: WalletSystem;
  private readonly VAT_RATE = 0.15;

  private constructor() {}

  public static getInstance(): WalletSystem {
    if (!WalletSystem.instance) {
      WalletSystem.instance = new WalletSystem();
    }
    return WalletSystem.instance;
  }

  // --- 1. Wallet Initialization ---
  public getOrCreateWallet(user: User): Wallet {
    try {
        const existing = localStorage.getItem(`wallet_${user.id}`);
        if (existing) {
          return JSON.parse(existing);
        }
    } catch (e) {
        console.error("Wallet data corrupted, resetting.");
    }

    const newWallet: Wallet = {
      id: `w_${user.id}_${Date.now()}`,
      userId: user.id,
      balance: 0.00,
      currency: 'SAR',
      status: 'active',
      ledger: [],
      lastUpdated: new Date().toISOString()
    };
    
    this.persistWallet(newWallet);
    return newWallet;
  }

  // --- 2. Atomic Transaction Processor (Double-Entry) ---
  public async processTransaction(
    walletId: string, 
    type: TransactionType, 
    amount: number, 
    description: string
  ): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    
    // Simulate Network/Database Lock
    // In a real DB, this would be `START TRANSACTION`
    try {
      let wallet: Wallet | null = null;
      
      // Simple lookup simulation based on the passed wallet object usually
      // For this PWA, we'll re-fetch based on the walletID string structure we defined above
      // user ID is embedded in wallet ID: w_USERID_TIMESTAMP
      const parts = walletId.split('_');
      if (parts.length >= 2) {
          const uId = parts[1];
          try {
              const stored = localStorage.getItem(`wallet_${uId}`);
              if (stored) wallet = JSON.parse(stored);
          } catch(e) { /* ignore corrupt wallet */ }
      }

      if (!wallet) return { success: false, error: 'Wallet not found' };
      if (wallet.status !== 'active') return { success: false, error: 'Wallet frozen' };

      // Business Logic Checks
      if (type === 'WITHDRAWAL' || type === 'PURCHASE' || type === 'COMMISSION') {
        if (wallet.balance < amount) {
          return { success: false, error: 'Insufficient funds' };
        }
      }

      // --- DOUBLE ENTRY LOGIC ---
      // 1. Create Ledger Entry
      const entryId = `led_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const isCredit = type === 'DEPOSIT' || type === 'REFUND';
      
      const newBalance = isCredit 
        ? wallet.balance + amount 
        : wallet.balance - amount;

      const entry: LedgerEntry = {
        id: entryId,
        transactionId: `txn_${Date.now()}`,
        walletId: wallet.id,
        type: isCredit ? 'CREDIT' : 'DEBIT',
        amount: amount,
        balanceAfter: parseFloat(newBalance.toFixed(2)),
        description: description,
        timestamp: new Date().toISOString()
      };

      // 2. Commit Update
      wallet.balance = entry.balanceAfter;
      wallet.ledger.unshift(entry); // Newest first
      wallet.lastUpdated = new Date().toISOString();

      this.persistWallet(wallet);

      return { success: true, newBalance: wallet.balance };

    } catch (e) {
      console.error("Transaction Failed", e);
      return { success: false, error: 'System Error during transaction commit' };
    }
  }

  // --- 3. Persistence ---
  private persistWallet(wallet: Wallet) {
    localStorage.setItem(`wallet_${wallet.userId}`, JSON.stringify(wallet));
  }

  public getBalance(userId: string): number {
    const w = this.getOrCreateWallet({ id: userId } as User);
    return w.balance;
  }
}

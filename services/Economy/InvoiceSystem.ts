
import { Invoice } from '../../types';
import { ZatcaEngine } from '../Finance/ZatcaEngine';

export class InvoiceSystem {
  private static VAT_RATE = 0.15;

  public static generateInvoice(userId: string, items: { description: string; amount: number }[]): Invoice {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const vatAmount = subtotal * this.VAT_RATE;
    const total = subtotal + vatAmount;

    const invoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`,
      transactionId: `TXN-${Date.now()}`,
      userId: userId,
      items: items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'paid',
      issueDate: new Date().toISOString()
    };

    // Save to local history
    this.saveInvoice(invoice);
    return invoice;
  }

  private static saveInvoice(invoice: Invoice) {
    const history = JSON.parse(localStorage.getItem('user_invoices') || '[]');
    history.unshift(invoice);
    localStorage.setItem('user_invoices', JSON.stringify(history));
  }

  public static getInvoices(userId: string): Invoice[] {
    const history = JSON.parse(localStorage.getItem('user_invoices') || '[]');
    return history.filter((i: Invoice) => i.userId === userId);
  }

  // ZATCA-Compliant HTML Generator
  public static generateHTML(invoice: Invoice): string {
    const zatca = ZatcaEngine.getInstance();
    
    // Generate TLV Base64
    const tlvBase64 = zatca.generateTLVQR(
        "Murad Group", 
        "300055566600003", // Mock VAT Number
        invoice.issueDate,
        invoice.total.toString(),
        invoice.vatAmount.toString()
    );

    // Generate QR Image URL using API (Client-side rendering)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tlvBase64)}`;

    return `
      <div style="font-family: 'Tajawal', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #eee; direction: rtl; background: white;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px;">
          <div>
            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">فاتورة ضريبية مبسطة</h1>
            <p style="color: #64748b; margin: 5px 0;">رقم الفاتورة: ${invoice.id}</p>
            <p style="color: #64748b; font-size: 12px;">التاريخ: ${new Date(invoice.issueDate).toLocaleString()}</p>
          </div>
          <div style="text-align: left;">
            <h2 style="color: #d97706; margin: 0; font-size: 20px;">أكاديمية ميلاف مراد</h2>
            <p style="font-size: 12px; color: #64748b;">الرقم الضريبي: 300055566600003</p>
            <p style="font-size: 12px; color: #64748b;">العنوان: الرياض، المملكة العربية السعودية</p>
          </div>
        </div>
        
        <div style="margin-top: 40px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc; text-align: right;">
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">الوصف</th>
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">المبلغ (ر.س)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.description}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-start;">
          
          <div style="text-align: center;">
             <img src="${qrUrl}" alt="ZATCA QR Code" style="width: 120px; height: 120px; border: 1px solid #eee; padding: 5px;" />
             <p style="font-size: 10px; color: #94a3b8; margin-top: 5px;">Scan for ZATCA Verification</p>
          </div>

          <div style="width: 250px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>المجموع الفرعي:</span>
              <span>${invoice.subtotal.toFixed(2)} SAR</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>${invoice.vatAmount.toFixed(2)} SAR</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #0f172a; font-weight: bold; font-size: 18px; color: #0f172a;">
              <span>الإجمالي:</span>
              <span>${invoice.total.toFixed(2)} SAR</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #eee; padding-top: 10px;">
          فاتورة إلكترونية معتمدة من هيئة الزكاة والضريبة والجمارك (المرحلة الثانية).
        </div>
      </div>
    `;
  }
}

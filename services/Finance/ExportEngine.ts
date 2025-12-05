
import { Transaction } from '../../types';

/**
 * ==============================================================================
 * EXPORT ENGINE (Data Liberation Port)
 * Handles: CSV Generation and Downloads
 * ==============================================================================
 */

export class ExportEngine {
    private static instance: ExportEngine;

    private constructor() {}

    public static getInstance(): ExportEngine {
        if (!ExportEngine.instance) {
            ExportEngine.instance = new ExportEngine();
        }
        return ExportEngine.instance;
    }

    public exportTransactionsToCSV(transactions: Transaction[], filename: string = 'Financial_Report.csv') {
        if (transactions.length === 0) {
            alert("No transactions to export.");
            return;
        }

        // 1. Define Headers
        const headers = ['Transaction ID', 'Date', 'User Name', 'User ID', 'Service', 'Amount (SAR)', 'Status', 'Method'];

        // 2. Map Data
        const rows = transactions.map(t => [
            t.id,
            new Date(t.createdAt).toLocaleDateString() + ' ' + new Date(t.createdAt).toLocaleTimeString(),
            `"${t.buyerName}"`, // Escape commas
            t.buyerId,
            `"${t.serviceTitle}"`,
            t.amount.toFixed(2),
            t.status,
            t.paymentMethod || 'N/A'
        ]);

        // 3. Construct CSV String with BOM for Excel UTF-8 compatibility
        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const bom = "\uFEFF";
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 4. Trigger Download
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

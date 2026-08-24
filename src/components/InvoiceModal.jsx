import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode,
  FileText
} from 'lucide-react';

export default function InvoiceModal({ order, currentUser, onClose }) {
  const invoiceRef = useRef();

  if (!order) return null;

  const invoiceNo = `INV-2026-${order.id?.toString().replace(/\D/g, '').slice(-4) || '8912'}`;
  const invoiceDate = order.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const totalAmount = Number(order.price) || 299;
  
  // GST Calculation (18% Inclusive: Base = Total / 1.18)
  const baseAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmount - baseAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const handlePrint = () => {
    const printContent = document.getElementById('printable-invoice');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=850,height=1000');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - ${invoiceNo}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
            body { background: #fff; color: #111827; padding: 25px; }
            .invoice-box { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; }
            .header-row { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f97316; padding-bottom: 18px; margin-bottom: 20px; }
            .brand-title { font-size: 24px; font-weight: 900; color: #111827; }
            .brand-tag { font-size: 11px; color: #f97316; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
            .tax-badge { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; display: inline-block; margin-bottom: 6px; }
            .invoice-meta { text-align: right; font-size: 12px; line-height: 1.5; color: #4b5563; }
            .grid-2 { display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 12px; line-height: 1.5; }
            .address-box { width: 48%; }
            .box-title { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; border-bottom: 1px solid #f3f4f6; padding-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px; }
            th { background: #f9fafb; color: #374151; font-weight: 800; text-align: left; padding: 10px; border-bottom: 2px solid #e5e7eb; }
            td { padding: 12px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals-table { width: 45%; margin-left: auto; font-size: 12px; margin-bottom: 25px; }
            .totals-table td { padding: 6px 10px; border-bottom: 1px solid #f3f4f6; }
            .total-row td { font-weight: 900; font-size: 15px; color: #111827; border-top: 2px solid #111827; border-bottom: 2px solid #111827; }
            .footer-notes { border-top: 1px dashed #e5e7eb; padding-top: 15px; font-size: 10px; color: #6b7280; line-height: 1.5; display: flex; justify-content: space-between; align-items: flex-end; }
            .stamp-box { border: 2px solid #16a34a; border-radius: 6px; padding: 6px 14px; text-align: center; color: #16a34a; font-weight: 800; font-size: 10px; text-transform: uppercase; transform: rotate(-2deg); }
            @media print {
              body { padding: 0; }
              .invoice-box { border: none; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-black/10 animate-scale-up">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900">Tax Invoice Receipt</h3>
              <p className="text-[11px] text-gray-500 font-mono">{invoiceNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-green-600/20 transition-all cursor-pointer"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-gray-900 text-xs">
          <div id="printable-invoice" ref={invoiceRef} className="space-y-6">
            
            {/* 1. Company & Invoice Header */}
            <div className="flex justify-between items-start pb-5 border-b-2 border-orange-500">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                    SD
                  </div>
                  <span className="text-xl font-black tracking-tight text-gray-900">SafeDrive-Tag</span>
                </div>
                <p className="text-[11px] text-orange-600 font-bold uppercase tracking-wider">Smart Vehicle Privacy Solutions</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-tight">
                  SafeDrive Technologies Pvt. Ltd.<br />
                  GSTIN: 07AABCS1429B1Z8 | CIN: U72900DL2024PTC39281<br />
                  Tower 4, Sector 62, Noida, UP - 201301<br />
                  Email: support@safedrivetag.com | Web: safedrivetag.com
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black px-2.5 py-1 rounded-md uppercase mb-2">
                  Tax Invoice
                </span>
                <p className="font-mono font-bold text-gray-900 text-xs">{invoiceNo}</p>
                <p className="text-gray-500 text-[11px] mt-0.5">Date: {invoiceDate}</p>
                <p className="text-gray-500 text-[11px]">Order: <strong className="text-gray-800 font-mono">{order.id}</strong></p>
                <p className="text-gray-500 text-[11px]">Payment: <strong className="text-green-600 font-bold">PAID (Razorpay)</strong></p>
              </div>
            </div>

            {/* 2. Billing & Shipping Address */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <h4 className="font-extrabold text-gray-500 uppercase tracking-wider text-[10px] pb-1 border-b border-gray-200 mb-2">
                  Billed To (Customer):
                </h4>
                <p className="font-bold text-gray-900 text-xs">{currentUser?.name || 'Authorized Buyer'}</p>
                <p className="text-gray-600 text-[11px] mt-0.5">Phone: +91 {currentUser?.phone || '9876543210'}</p>
                <p className="text-gray-600 text-[11px]">Email: {currentUser?.email || 'customer@example.com'}</p>
                <p className="text-gray-600 text-[11px]">State Code: 09 (Uttar Pradesh / Delhi NCR)</p>
              </div>

              <div>
                <h4 className="font-extrabold text-gray-500 uppercase tracking-wider text-[10px] pb-1 border-b border-gray-200 mb-2">
                  Shipping Address:
                </h4>
                <p className="font-bold text-gray-900 text-xs">{currentUser?.name || 'Customer'}</p>
                <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">
                  {order.statusDesc?.replace('Delivery to: ', '') || currentUser?.address || 'Plot 55, Sector 10, Noida, Uttar Pradesh - 201301'}
                </p>
                <p className="text-gray-600 text-[11px] font-bold text-green-700 mt-1">Delivery: Express Pan-India (Dispatched)</p>
              </div>
            </div>

            {/* 3. Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 text-gray-700 font-extrabold text-[11px]">
                    <th className="py-2.5 px-3 text-left rounded-l-lg">#</th>
                    <th className="py-2.5 px-3 text-left">Item Description</th>
                    <th className="py-2.5 px-3 text-center">HSN</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-gray-400">1</td>
                    <td className="py-3 px-3">
                      <p className="font-black text-gray-900 text-xs">{order.title || 'SafeDrive Smart Vehicle QR Kit'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Reflective 3M stickers + 1-Year Cloud Calling Bridge & WhatsApp alert quota included
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-gray-500 text-[11px]">8523</td>
                    <td className="py-3 px-3 text-center font-bold text-gray-900">1</td>
                    <td className="py-3 px-3 text-right font-medium text-gray-800">₹{baseAmount.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-black text-gray-900">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Calculation Summary Table */}
            <div className="flex justify-end pt-2">
              <table className="w-64 text-xs border-collapse">
                <tbody>
                  <tr>
                    <td className="py-1.5 px-2 text-gray-600">Taxable Value:</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-gray-900">₹{baseAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-gray-600">CGST (9%):</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-gray-900">₹{cgst.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-gray-600">SGST (9%):</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-gray-900">₹{sgst.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-gray-600">Shipping & Handling:</td>
                    <td className="py-1.5 px-2 text-right font-bold text-green-600">FREE</td>
                  </tr>
                  <tr className="border-t-2 border-b-2 border-gray-900">
                    <td className="py-2.5 px-2 font-black text-gray-900 text-sm">Total Paid:</td>
                    <td className="py-2.5 px-2 text-right font-black text-gray-900 text-base">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Footer & Seal */}
            <div className="flex justify-between items-end pt-5 border-t border-gray-200 text-[10px] text-gray-500">
              <div className="space-y-1">
                <p className="font-bold text-gray-700">Terms & Declaration:</p>
                <p>1. This is a system-generated electronic tax invoice and does not require physical signature.</p>
                <p>2. Goods once sold include 1-year product warranty and continuous cloud call bridge quota.</p>
                <p>3. All disputes subject to Delhi/NCR jurisdiction.</p>
              </div>

              <div className="text-center pl-4">
                <div className="border-2 border-green-600 text-green-700 font-black text-[9px] uppercase px-3 py-1.5 rounded tracking-wider mb-1 rotate-[-2deg]">
                  ✓ PAID & VERIFIED
                </div>
                <p className="text-[9px] text-gray-400 font-bold">SafeDrive Billing Dept</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-medium">
            🔒 256-Bit SSL Encrypted Tax Invoice
          </span>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
}

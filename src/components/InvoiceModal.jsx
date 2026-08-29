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

  const invoiceNo = order.invoiceNumber || `INV-2026-${order.id?.toString().replace(/\D/g, '').slice(-4) || '8912'}`;
  const rawDate = order.createdAt || order.orderDate || order.date;
  const invoiceDate = rawDate ? new Date(rawDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  
  const quantity = Math.max(1, Number(order.quantity) || 1);
  const totalAmount = Number(order.price || order.totalAmount || order.amount) || 299;
  
  let totalGst = 0;
  if (order.gstAmount !== undefined && Number(order.gstAmount) > 0) {
    totalGst = Number(order.gstAmount);
  } else if (order.gst !== undefined && Number(order.gst) > 0) {
    totalGst = Number(order.gst);
  } else {
    totalGst = totalAmount - (totalAmount / 1.18);
  }
  
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const baseAmount = Math.round((totalAmount - (cgst + sgst)) * 100) / 100;
  const unitBasePrice = Math.round((baseAmount / quantity) * 100) / 100;

  const isDigital = order.qrType === 'DIGITAL' || (order.productName || order.title || '').toLowerCase().includes('digital');
  
  let rawTitle = String(order.productName || order.title || order.item || 'SafeDrive Smart Safety Tag');
  rawTitle = rawTitle.replace(/luggege/i, 'Luggage');
  const itemTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
  
  const itemSubtitle = order.description || (isDigital 
    ? 'Instant Printable QR Safety Pass + 1-Year Cloud Calling Bridge & WhatsApp Alerts'
    : '3M Waterproof Reflective QR Stickers + 1-Year Cloud Calling Bridge & Instant WhatsApp Alerts');

  const hsnCode = isDigital ? '9983' : '8523';
  
  const customerState = order.state || currentUser?.state || 'N/A';
  const placeOfSupply = `${customerState}`.toUpperCase();

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
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-gray-900 text-xs relative">
          <div id="printable-invoice" ref={invoiceRef} className="space-y-6">
            
            {/* Watermark Logo */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <img src="/logos/primary.jpeg" alt="Watermark" className="w-80 h-auto grayscale" />
            </div>

            {/* 1. Header (Company & Invoice Meta) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-[3px] border-orange-500 pb-5 mb-5 relative z-10">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-xs p-1.5">
                  <img src="/logos/primary.jpeg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">SafeDrive Tag</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">support@safedrivetag.com</p>
                  <p className="text-xs text-gray-500 font-medium">www.safedrivetag.com</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-orange-50 text-orange-700 border-2 border-orange-200 px-3 py-1 rounded-lg text-xs font-black uppercase mb-2 tracking-wide">
                  Tax Invoice
                </span>
                <p className="text-gray-500 text-[11px] font-medium">Invoice No: <strong className="text-gray-800">{invoiceNo}</strong></p>
                <p className="text-gray-500 text-[11px] mt-0.5">Date: {invoiceDate}</p>
                <p className="text-gray-500 text-[11px]">Order: <strong className="text-gray-800 font-mono">{order.id}</strong></p>
                <p className="text-gray-500 text-[11px]">Payment: <strong className="text-green-600 font-bold">PAID (Razorpay)</strong></p>
              </div>
            </div>

            {/* 2. Billing & Shipping Address */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100 relative z-10">
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
                <p className="text-gray-600 text-[11px] font-bold text-green-700 mt-1">Delivery: {isDigital ? 'Digital Delivery (Activated)' : 'Shipping (Dispatched)'}</p>
              </div>
            </div>

            {/* 3. Items Table */}
            <div className="overflow-x-auto relative z-10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 text-gray-700 font-extrabold text-[11px]">
                    <th className="py-2.5 px-3 text-left rounded-l-lg">#</th>
                    <th className="py-2.5 px-3 text-left">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit (₹)</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-gray-400">1</td>
                    <td className="py-3 px-3">
                      <p className="font-black text-gray-900 text-xs">{itemTitle}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-900">{quantity}</td>
                    <td className="py-3 px-3 text-right font-medium text-gray-800">₹{(totalAmount / quantity).toFixed(2)}</td>
                    <td className="py-3 px-3 text-right font-black text-gray-900">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Calculation Summary Table */}
            <div className="flex justify-end pt-2">
              <table className="w-64 text-xs border-collapse">
                <tbody>
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

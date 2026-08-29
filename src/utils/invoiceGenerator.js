/**
 * SafeDrive Direct 1-Click Tax Invoice Generator & PDF Downloader
 * Dynamically renders official Tax Invoice with SafeDrive Logo, Watermark, GST details,
 * and triggers instant browser print/save-as-PDF.
 */

export const downloadInvoicePdf = (order, currentUser) => {
  if (!order) return;

  // 1. Dynamic Order Identifiers & Dates
  const orderId = order.orderNumber || order.orderId || order._id || order.id || `ORD-${Date.now().toString().slice(-6)}`;
  const invoiceNo = order.invoiceNumber || `INV-${new Date().getFullYear()}-${orderId.toString().replace(/\D/g, '').slice(-4) || '8912'}`;
  
  const rawDate = order.createdAt || order.orderDate || order.date;
  const invoiceDate = rawDate 
    ? new Date(rawDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // 2. Dynamic Customer & Shipping Info
  const customerName = order.customerName || order.name || currentUser?.name || 'Valued Customer';
  const customerPhone = order.customerPhone || order.phone || currentUser?.phone || '9876543210';
  const customerEmail = order.customerEmail || order.email || currentUser?.email || 'support@safedrivetag.com';
  
  const customerState = order.state || currentUser?.state || 'N/A';
  const placeOfSupply = `${customerState}`.toUpperCase();

  // Resolve Shipping Address
  let shippingAddressText = order.shippingAddress;
  if (!shippingAddressText && order.address) {
    shippingAddressText = `${order.address}, ${order.city || ''} ${order.state || ''} ${order.pincode ? '- ' + order.pincode : ''}`.trim();
  }
  if (!shippingAddressText && order.statusDesc) {
    shippingAddressText = order.statusDesc.replace(/^Delivery to:\s*/i, '').trim();
  }
  if (!shippingAddressText && currentUser?.address) {
    shippingAddressText = currentUser.address;
  }
  if (!shippingAddressText) {
    shippingAddressText = 'Pan-India Express Delivery Address';
  }

  // 3. Dynamic Product Details & Pricing
  const isDigital = order.qrType === 'DIGITAL' || (order.productName || order.title || '').toLowerCase().includes('digital');
  
  // Fix spelling mistakes and format product name cleanly
  let rawTitle = String(order.productName || order.title || order.item || 'SafeDrive Smart Safety Tag');
  rawTitle = rawTitle.replace(/luggege/i, 'Luggage');
  const itemTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
  
  const itemSubtitle = order.description || (isDigital 
    ? 'Instant Printable QR Safety Pass + 1-Year Cloud Calling Bridge & WhatsApp Alerts'
    : '3M Waterproof Reflective QR Stickers + 1-Year Cloud Calling Bridge & Instant WhatsApp Alerts');

  const hsnCode = isDigital ? '9983' : '8523';

  const quantity = Math.max(1, Number(order.quantity) || 1);
  const totalAmount = Number(order.totalAmount || order.amount || order.price) || 299;
  
  // Dynamic GST Calculation (Use backend GST if available, else assume 18% inclusive GST for legitimate B2C Tax Invoices)
  let totalGst = 0;
  if (order.gstAmount !== undefined && Number(order.gstAmount) > 0) {
    totalGst = Number(order.gstAmount);
  } else if (order.gst !== undefined && Number(order.gst) > 0) {
    totalGst = Number(order.gst);
  } else {
    // If no GST is explicitly provided by the backend, extract inclusive 18% GST (9% CGST + 9% SGST)
    totalGst = totalAmount - (totalAmount / 1.18);
  }
  
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  // Base amount is total minus GST
  const baseAmount = Math.round((totalAmount - (cgst + sgst)) * 100) / 100;
  const unitBasePrice = Math.round((baseAmount / quantity) * 100) / 100;

  // 4. Dynamic Payment Gateway Info
  const paymentId = order.paymentId || 
                    order.razorpayPaymentId || 
                    order.razorpay_payment_id || 
                    order.transactionId || 
                    `pay_${orderId.toString().replace(/\D/g, '').slice(-8) || 'online'}`;
  
  const paymentStatus = order.paymentStatus || 'PAID (Razorpay)';

  const logoUrl = window.location.origin + '/logos/primary.jpeg';

  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Tax_Invoice_${invoiceNo}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          }
          body { 
            background: #ffffff; 
            color: #111827; 
            padding: 10px;
            position: relative;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* SafeDrive Watermark */
          .watermark-container {
            position: fixed;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-32deg);
            z-index: -1;
            pointer-events: none;
            text-align: center;
            opacity: 0.055;
            user-select: none;
          }
          .watermark-logo {
            width: 280px;
            height: auto;
            margin-bottom: 12px;
            filter: grayscale(100%);
          }
          .watermark-title {
            font-size: 72px;
            font-weight: 900;
            color: #000000;
            letter-spacing: 10px;
            text-transform: uppercase;
          }
          .watermark-subtitle {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 5px;
            color: #16a34a;
            margin-top: 6px;
          }

          /* Main Box */
          .invoice-box { 
            max-width: 100%; 
            margin: 0 auto; 
            border: 1px solid #e5e7eb; 
            border-radius: 12px; 
            padding: 28px; 
            background: #ffffff;
            position: relative;
          }
          .header-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            border-bottom: 2.5px solid #ea580c; 
            padding-bottom: 18px; 
            margin-bottom: 20px; 
          }
          .brand-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          .brand-logo-img {
            height: 62px;
            width: auto;
            object-fit: contain;
          }
          .company-info {
            font-size: 11px;
            color: #4b5563;
            line-height: 1.5;
          }
          .invoice-badge-box {
            text-align: right;
          }
          .tax-badge { 
            background: #fff7ed; 
            color: #c2410c; 
            border: 1.5px solid #fdba74; 
            padding: 4px 12px; 
            border-radius: 6px; 
            font-size: 11.5px; 
            font-weight: 900; 
            display: inline-block; 
            margin-bottom: 6px; 
            text-transform: uppercase;
          }
          .meta-text {
            font-size: 11.5px;
            color: #4b5563;
            line-height: 1.6;
          }

          .addresses-row { 
            display: flex; 
            justify-content: space-between; 
            background: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 10px;
            padding: 14px 16px; 
            margin-bottom: 22px; 
            font-size: 11.5px; 
            line-height: 1.55; 
          }
          .address-col { width: 48%; }
          .col-heading { 
            font-size: 10px; 
            font-weight: 800; 
            text-transform: uppercase; 
            color: #9ca3af; 
            letter-spacing: 0.5px;
            margin-bottom: 5px; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 3px; 
          }
          .customer-name {
            font-size: 13px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 2px;
          }

          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th { 
            background: #f3f4f6; 
            color: #1f2937; 
            font-weight: 800; 
            text-align: left; 
            padding: 10px 12px; 
            border-bottom: 2px solid #e5e7eb; 
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          td { padding: 12px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          
          .totals-table-container {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 22px;
          }
          .totals-table { width: 48%; font-size: 11.5px; }
          .totals-table td { padding: 5.5px 10px; border-bottom: 1px solid #f3f4f6; }
          .total-highlight-row td { 
            font-weight: 900; 
            font-size: 15px; 
            color: #111827; 
            border-top: 2px solid #111827; 
            border-bottom: 2px solid #111827; 
            background: #fafafa;
          }

          .footer-section { 
            border-top: 1px dashed #d1d5db; 
            padding-top: 16px; 
            font-size: 10px; 
            color: #6b7280; 
            line-height: 1.5; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end; 
          }
          .stamp-badge { 
            border: 2px solid #15803d; 
            border-radius: 8px; 
            padding: 6px 14px; 
            text-align: center; 
            color: #15803d; 
            font-weight: 900; 
            font-size: 10.5px; 
            text-transform: uppercase; 
            transform: rotate(-3deg); 
            background: rgba(22, 163, 74, 0.05);
          }
        </style>
      </head>
      <body>
        
        <!-- SafeDrive Watermark -->
        <div class="invoice-box">
          <img src="${logoUrl}" class="watermark-bg" alt="" />
          
          <!-- Brand & Header Details -->
          <div class="header-row">
            <div class="brand-header">
              <div style="margin-right: 12px;">
                <img src="${logoUrl}" alt="SafeDrive Logo" class="brand-logo-img" onerror="this.style.display='none'" />
              </div>
              <div class="company-info">
                <strong style="font-size: 13px;">SafeDrive Tag</strong><br />
                Email: support@safedrivetag.com | Web: safedrivetag.com
              </div>
            </div>
            <div class="invoice-badge-box">
              <div class="tax-badge">Tax Invoice</div>
              <div class="meta-text">
                <strong>Invoice No:</strong> ${invoiceNo}<br />
                <strong>Invoice Date:</strong> ${invoiceDate}<br />
                <strong>Order ID:</strong> <span style="font-family: monospace; font-weight: bold;">${orderId}</span><br />
                <strong>Payment ID:</strong> <span style="font-family: monospace; font-size: 10.5px; color: #4b5563;">${paymentId}</span><br />
                <strong>Payment Status:</strong> <span style="color: #16a34a; font-weight: 800;">${paymentStatus}</span>
              </div>
            </div>
          </div>

          <!-- Billing & Shipping Details -->
          <div class="addresses-row">
            <div class="address-col">
              <div class="col-heading">Billed To (Customer):</div>
              <div class="customer-name">${customerName}</div>
              <div>Phone: +91 ${customerPhone.replace(/^91/, '')}</div>
              <div>Email: ${customerEmail}</div>
              <div>Place of Supply: ${placeOfSupply}</div>
            </div>
            <div class="address-col">
              <div class="col-heading">Shipping Address:</div>
              <div class="customer-name">${customerName}</div>
              <div style="word-break: break-word;">${shippingAddressText}</div>
              <div style="color: #15803d; font-weight: 700; margin-top: 3px;">${isDigital ? 'Digital Delivery (Activated)' : 'Shipping (Dispatched)'}</div>
            </div>
          </div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 55%;">Item Description</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Unit (₹)</th>
                <th style="width: 15%; text-align: right;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold; color: #9ca3af;">1</td>
                <td>
                  <strong style="color: #111827; font-size: 12.5px;">${itemTitle}</strong>
                </td>
                <td class="text-center" style="font-weight: 800;">${quantity}</td>
                <td class="text-right">₹${(totalAmount / quantity).toFixed(2)}</td>
                <td class="text-right" style="font-weight: 800;">₹${totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Totals Breakdown -->
          <div class="totals-table-container">
            <table class="totals-table">
              <tbody>
                <tr class="total-highlight-row">
                  <td>Total Amount Paid:</td>
                  <td class="text-right">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer Declaration -->
          <div class="footer-section">
            <div style="max-width: 65%;">
              <strong>Terms & Conditions:</strong><br />
              1. This is a computer-generated official tax invoice and requires no physical signature.<br />
              2. Goods include 1-year hardware warranty and active cloud relay bridge quota.<br />
              3. For support or warranty claims: https://safedrivetag.com/contact
            </div>
            <div style="text-align: center;">
              <div class="stamp-badge">✓ PAID & VERIFIED<br /><span style="font-size: 8px;">SAFEDRIVE AUTH</span></div>
              <div style="font-size: 9px; color: #9ca3af; margin-top: 3px;">Billing Authority</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  // Create or reuse hidden iframe to trigger direct PDF print/download
  let iframe = document.getElementById('invoice-direct-download-frame');
  if (iframe) {
    document.body.removeChild(iframe);
  }
  
  iframe = document.createElement('iframe');
  iframe.id = 'invoice-direct-download-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentWindow.document;
  frameDoc.open();
  frameDoc.write(invoiceHtml);
  frameDoc.close();
};

export default downloadInvoicePdf;


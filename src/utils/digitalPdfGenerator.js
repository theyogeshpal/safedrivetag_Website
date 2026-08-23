/**
 * SafeDrive Digital QR Kit PDF Generator & Color Printer
 * Displays and prints the ACTUAL official SafeDrive product card design received from the backend API.
 */

export const generateDigitalPdfHtml = (item = {}) => {
  const token = item.publicToken || item.token || item.id || 'pk_live_digital';
  const title = item.title || item.name || 'SafeDrive Smart QR Vehicle Tag';
  const cardImage = 
    item.image || 
    item.imageUrl || 
    (Array.isArray(item.images) && item.images[0]) || 
    'https://res.cloudinary.com/dofqiruh7/image/upload/v1787403231/safedrive/products/wf5u8xfkhdfa1v2ndajx.jpg';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SafeDrive_Digital_Tag_${token}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          }
          body { 
            background: #f1f5f9; 
            color: #0f172a; 
            padding: 16px; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-container {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          }
          
          /* Header */
          .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2.5px solid #ea580c;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }
          .sheet-title {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          .sheet-subtitle {
            font-size: 11.5px;
            color: #ea580c;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
          }
          .badge-verified {
            background: #f0fdf4;
            color: #15803d;
            border: 1.5px solid #86efac;
            padding: 5px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          /* Instructions Notice */
          .instructions-box {
            background: #fff7ed;
            border: 1px solid #ffedd5;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 22px;
            font-size: 12px;
            color: #9a3412;
            line-height: 1.5;
          }

          /* Actual Product Card Layout */
          .main-card-wrapper {
            border: 2.5px dashed #cbd5e1;
            border-radius: 20px;
            padding: 20px;
            background: #fafafa;
            margin-bottom: 24px;
            position: relative;
            text-align: center;
          }
          .cut-guide-label {
            position: absolute;
            top: -11px;
            right: 20px;
            background: #e2e8f0;
            color: #475569;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 10px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            letter-spacing: 0.5px;
          }
          .card-header-badge {
            font-size: 12px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          /* The Actual Product Card Image */
          .actual-product-card-img {
            max-width: 100%;
            width: 580px;
            height: auto;
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            border: 1.5px solid rgba(0, 0, 0, 0.08);
            display: inline-block;
            background: #ffffff;
          }

          /* Dual Badges Grid for Front & Rear Glass Placement */
          .dual-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          .dual-card {
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 14px;
            background: #ffffff;
            text-align: center;
            position: relative;
          }
          .dual-card-title {
            font-size: 11px;
            font-weight: 800;
            color: #ea580c;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .dual-card-img {
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.06);
          }

          /* Footer */
          .sheet-footer {
            border-top: 1.5px solid #e2e8f0;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10.5px;
            color: #64748b;
            font-weight: 600;
          }

          @media print {
            body { 
              background: #ffffff; 
              padding: 0; 
            }
            .page-container { 
              border: none; 
              box-shadow: none; 
              padding: 0; 
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          
          <!-- Sheet Header -->
          <div class="sheet-header">
            <div>
              <div class="sheet-title">SafeDrive Official Smart Tag</div>
              <div class="sheet-subtitle">${title} • ID: ${token}</div>
            </div>
            <div class="badge-verified">✓ 100% Genuine SafeDrive Product</div>
          </div>

          <!-- Printing & Placement Notice -->
          <div class="instructions-box">
            <strong>🖨️ DIY Color Printing & Placement Guide:</strong><br />
            1. Print in <strong>Full Color</strong> on A4 sticker sheet, glossy photo paper, or standard A4 paper.<br />
            2. Cut along the outer guidelines ✂. Place inside your vehicle's front windshield or rear window.<br />
            3. <strong>100% Privacy Protected:</strong> Anyone scanning this tag will reach you through SafeDrive's private calling bridge without seeing your phone number.
          </div>

          <!-- ACTUAL OFFICIAL PRODUCT CARD (From Live Backend) -->
          <div class="main-card-wrapper">
            <div class="cut-guide-label">✂ CUT ALONG THE BORDER</div>
            <div class="card-header-badge">⭐ Primary Vehicle Badge (Original Design)</div>
            <img 
              src="${cardImage}" 
              alt="SafeDrive Official Product QR Card" 
              class="actual-product-card-img" 
            />
          </div>

          <!-- Dual Front & Rear Placement Cutouts -->
          <div class="dual-grid">
            <div class="dual-card">
              <div class="cut-guide-label">✂ CUT HERE</div>
              <div class="dual-card-title">🛡️ Front Windshield Placement</div>
              <img 
                src="${cardImage}" 
                alt="Front Windshield Tag" 
                class="dual-card-img" 
              />
            </div>

            <div class="dual-card">
              <div class="cut-guide-label">✂ CUT HERE</div>
              <div class="dual-card-title">🚗 Rear Glass / Luggage Placement</div>
              <img 
                src="${cardImage}" 
                alt="Rear Glass Tag" 
                class="dual-card-img" 
              />
            </div>
          </div>

          <!-- Sheet Footer -->
          <div class="sheet-footer">
            <span>Official SafeDrive Technologies • 24/7 Support: support@safedrivetag.com</span>
            <span>Dashboard: https://safedrivetag-website.vercel.app/dashboard</span>
          </div>

        </div>

        <script>
          window.onload = function() {
            if (window.location.search.includes('print=true')) {
              window.focus();
              window.print();
            }
          };
        </script>
      </body>
    </html>
  `;
};

/**
 * Open Digital PDF in new browser tab
 */
export const openDigitalPdf = (item = {}) => {
  const html = generateDigitalPdfHtml(item);
  const newWin = window.open('', '_blank');
  if (newWin) {
    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();
  }
};

/**
 * 1-Click Print Digital PDF in Full Color
 */
export const printDigitalPdfInColor = (item = {}) => {
  const html = generateDigitalPdfHtml(item);
  
  let iframe = document.getElementById('digital-kit-print-frame');
  if (iframe) {
    document.body.removeChild(iframe);
  }
  
  iframe = document.createElement('iframe');
  iframe.id = 'digital-kit-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 500);
};

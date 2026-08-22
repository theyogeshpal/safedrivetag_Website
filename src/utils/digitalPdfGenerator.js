/**
 * SafeDrive Digital QR Kit PDF Generator & Color Printer
 * Generates high-resolution full-color printable vehicle tags & badges for instant DIY printing.
 */

export const generateDigitalPdfHtml = (item = {}) => {
  const token = item.publicToken || item.token || item.id || 'pk_live_digital_demo';
  const title = item.title || item.name || 'SafeDrive Instant Digital QR Safety Tag';
  const vehicleNo = item.vehicleNumber || 'YOUR-VEHICLE-NO';
  const qrType = item.qrType || 'DIGITAL';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://safedrivetag-website.vercel.app/q/${token}&format=png`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SafeDrive_Color_Digital_Kit_${token}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          }
          body { 
            background: #f8fafc; 
            color: #0f172a; 
            padding: 15px; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ea580c;
            padding-bottom: 14px;
            margin-bottom: 20px;
          }
          .sheet-title {
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
          }
          .sheet-subtitle {
            font-size: 11px;
            color: #ea580c;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .badge-digital {
            background: #f0fdf4;
            color: #15803d;
            border: 1.5px solid #bbf7d0;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .instructions-box {
            background: #fff7ed;
            border: 1px solid #ffedd5;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 11.5px;
            color: #9a3412;
            line-height: 1.5;
          }
          
          /* Full Color Print Badges Grid */
          .badges-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          /* Tag 1: Front Windshield Primary Color Tag (Orange & Dark Theme) */
          .tag-card {
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 16px;
            background: #ffffff;
            position: relative;
          }
          .cut-guide {
            position: absolute;
            top: -10px;
            right: 14px;
            background: #f1f5f9;
            color: #64748b;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
          }
          
          .tag-inner-orange {
            background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
            border-radius: 12px;
            padding: 16px;
            color: #ffffff;
            text-align: center;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
          }
          
          .tag-inner-blue {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 12px;
            padding: 16px;
            color: #ffffff;
            text-align: center;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
          }

          .tag-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .tag-brand {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 0.5px;
          }
          .tag-pill {
            background: rgba(255, 255, 255, 0.2);
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 999px;
            text-transform: uppercase;
          }

          .qr-box {
            background: #ffffff;
            padding: 10px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          .qr-img {
            width: 140px;
            height: 140px;
            display: block;
          }

          .tag-headline {
            font-size: 14px;
            font-weight: 900;
            margin-bottom: 3px;
          }
          .tag-sub {
            font-size: 10px;
            opacity: 0.9;
            margin-bottom: 8px;
          }
          .tag-plate-badge {
            background: #ffffff;
            color: #0f172a;
            font-size: 11px;
            font-weight: 900;
            font-family: monospace;
            padding: 3px 10px;
            border-radius: 6px;
            display: inline-block;
          }

          .tag-footer-info {
            display: flex;
            justify-content: space-around;
            margin-top: 10px;
            font-size: 8.5px;
            font-weight: 700;
            opacity: 0.95;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 8px;
          }

          .sheet-footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            color: #64748b;
          }

          @media print {
            body { background: #ffffff; padding: 0; }
            .page-container { border: none; box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          
          <!-- Sheet Header -->
          <div class="sheet-header">
            <div>
              <div class="sheet-title">SafeDrive Smart Digital QR Kit</div>
              <div class="sheet-subtitle">Instant Color Printable Vehicle Badges</div>
            </div>
            <div class="badge-digital">✓ Digital E-Kit Active</div>
          </div>

          <!-- Instructions -->
          <div class="instructions-box">
            <strong>🖨️ DIY Color Printing Instructions:</strong><br />
            1. Print this sheet in <strong>Full Color</strong> on A4 sticker paper, glossy photo paper, or standard paper.<br />
            2. Cut along the dotted guidelines. You can laminate or stick with transparent tape inside your front windshield & rear glass.<br />
            3. Anyone scanning this QR can contact you via private masked call without seeing your phone number.
          </div>

          <!-- 2 Full Color Printable Badges (Front & Rear) -->
          <div class="badges-grid">
            
            <!-- BADGE 1: Front Windshield -->
            <div class="tag-card">
              <div class="cut-guide">✂ CUT HERE</div>
              <div class="tag-inner-orange">
                <div class="tag-top-bar">
                  <div class="tag-brand">🛡️ SafeDriveTag</div>
                  <div class="tag-pill">Front Windshield</div>
                </div>

                <div class="qr-box">
                  <img src="${qrUrl}" alt="SafeDrive QR" class="qr-img" />
                </div>

                <div class="tag-headline">SCAN TO CONTACT OWNER</div>
                <div class="tag-sub">Parking Obstruction • Emergency • Lights ON</div>
                <div class="tag-plate-badge">ID: ${token}</div>

                <div class="tag-footer-info">
                  <span>🔒 100% Number Privacy</span>
                  <span>⚡ Instant Masked Call</span>
                </div>
              </div>
            </div>

            <!-- BADGE 2: Rear Glass / Visor -->
            <div class="tag-card">
              <div class="cut-guide">✂ CUT HERE</div>
              <div class="tag-inner-blue">
                <div class="tag-top-bar">
                  <div class="tag-brand">🛡️ SafeDriveTag</div>
                  <div class="tag-pill">Rear Glass / Visor</div>
                </div>

                <div class="qr-box">
                  <img src="${qrUrl}" alt="SafeDrive QR" class="qr-img" />
                </div>

                <div class="tag-headline">SCAN IN EMERGENCY / ISSUE</div>
                <div class="tag-sub">Direct WhatsApp Alert & Family SOS Broadcast</div>
                <div class="tag-plate-badge">ID: ${token}</div>

                <div class="tag-footer-info">
                  <span>🚨 24/7 SOS Alert</span>
                  <span>💬 WhatsApp Connect</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Sheet Footer -->
          <div class="sheet-footer">
            <span>Official SafeDrive Technologies • Support: support@safedrivetag.com</span>
            <span>Verify & Manage: https://safedrivetag-website.vercel.app/dashboard</span>
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
  }, 400);
};

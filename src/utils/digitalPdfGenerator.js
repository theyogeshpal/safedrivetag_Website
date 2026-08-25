/**
 * SafeDrive Digital QR Kit PDF Generator & Color Printer
 * Generates high-definition full-color printable stickers containing the live scannable QR Code.
 */

export const generateDigitalPdfHtml = (item = {}) => {
  const copiesList = (Array.isArray(item.allocatedQRIds) && item.allocatedQRIds.length > 0)
    ? item.allocatedQRIds
    : ((Array.isArray(item.copies) && item.copies.length > 0)
        ? item.copies
        : [{
            publicToken: item.publicToken || item.token || item.id || 'pk_live_digital',
            copyCode: item.copyCode || 'SD-TAG-1',
            status: item.status || 'ACTIVE'
          }]);

  const firstAlloc = copiesList[0] || {};
  const token = item.publicToken || firstAlloc?.publicToken || item.token || item.copyCode || item.id || 'pk_live_digital';
  const title = item.title || item.name || item.vehicleName || item.productName || 'SafeDrive Smart Safety Pass';
  const copyCode = item.copyCode || firstAlloc?.copyCode || 'SD-TAG-1';
  
  const liveScanUrl = `https://safedrivetag-website.vercel.app/q/${token}`;
  
  const cardImage = 
    item.image || 
    item.imageUrl || 
    (Array.isArray(item.images) && item.images[0]) || 
    '/images/sticker_template.jpg';

  const cardsHtml = copiesList.map((c, index) => {
    const copyToken = c.publicToken || c.token || c.copyCode || token;
    const code = c.copyCode || (copiesList.length > 1 ? `SD-TAG-${index + 1}` : copyCode);
    const scanUrl = `https://safedrivetag-website.vercel.app/q/${copyToken}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(scanUrl)}&format=png&margin=1`;
    const label = copiesList.length > 1 ? `✂ CUT HERE • COPY ${index + 1}` : `✂ CUT HERE • OFFICIAL TAG`;

    return `
      <div class="printable-card" style="border: 2px dashed #cbd5e1; border-radius: 20px; padding: 14px; background: #fafafa; position: relative; max-width: 540px; width: 100%;">
        <div class="cut-guide-label" style="position: absolute; top: -10px; right: 14px; background: #e2e8f0; color: #475569; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1; z-index: 10;">${label}</div>
        
        <div style="position: relative; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.1); background: #ffffff;">
          <img src="${cardImage}" alt="SafeDrive Card" style="width: 100%; height: auto; display: block;" />
          
          <!-- Live Scannable Dynamic QR Code overlayed directly in the card's QR space -->
          <div style="position: absolute; top: 41%; left: 74.5%; transform: translate(-50%, -50%); background: #ffffff; padding: 8px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center;">
            <div style="position: relative; display: inline-block;">
              <img src="${qrImg}" alt="QR" style="width: 155px; height: 155px; display: block;" />
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 28px; height: 28px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid #ea580c;">
                <img src="/logos/icon.png" style="width: 18px; height: 18px; object-fit: contain;" />
              </div>
            </div>
            <div style="font-family: monospace; font-weight: 900; font-size: 10.5px; color: #0f172a; margin-top: 3px; letter-spacing: 0.5px; background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${code}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SafeDrive_Tag_${token}</title>
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
            background: #f8fafc; 
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
            margin-bottom: 16px;
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
            margin-bottom: 20px;
            font-size: 11.5px;
            color: #9a3412;
            line-height: 1.5;
          }

          /* Scan Test URL box */
          .scan-url-box {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 14px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #334155;
          }
          .scan-url-text {
            font-family: monospace;
            font-weight: 700;
            color: #ea580c;
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
              <div class="sheet-title">SafeDrive Official Printable Tag</div>
              <div class="sheet-subtitle">${title} • Qty: ${copiesList.length} ${copiesList.length > 1 ? 'Copies' : 'Tag'}</div>
            </div>
            <div class="badge-verified">✓ Live Scannable Tag</div>
          </div>

          <!-- Printing & Placement Notice -->
          <div class="instructions-box">
            <strong>🖨️ DIY Color Printing & Placement Guide:</strong><br />
            1. Print in <strong>Full Color</strong> on A4 sticker sheet, glossy photo paper, or standard A4 paper.<br />
            2. Cut along the outer guidelines ✂. Place on your vehicle or luggage safely.<br />
            3. <strong>100% Scannable & Private:</strong> Scanning this live QR code automatically connects callers via SafeDrive's masked call bridge.
          </div>

          <!-- Scan Verification URL Link -->
          <div class="scan-url-box">
            <span>🔗 Live Scan Redirect Target:</span>
            <span class="scan-url-text">${liveScanUrl}</span>
          </div>

          <!-- DYNAMIC PRINTABLE PRODUCT CARDS (1 or 2 depending on product) -->
          <div class="badges-grid" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; margin-bottom: 24px;">
            ${cardsHtml}
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

/**
 * 1-Click High-Resolution PNG Badge Download with Centered Circular Logo
 */
export const downloadQrPng = (item = {}) => {
  const token = item.publicToken || item.token || item.id || 'SD-TAG';
  const copyCode = item.copyCode || item.id || 'SD-TAG';
  const vehicle = item.vehicleNumber || item.vehicleName || 'SafeDrive Smart Tag';
  const liveUrl = `https://safedrivetag-website.vercel.app/q/${token}`;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 760;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 760);

  // Top Banner
  const grad = ctx.createLinearGradient(0, 0, 600, 0);
  grad.addColorStop(0, '#ea580c');
  grad.addColorStop(1, '#c2410c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 110);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SafeDrive Smart Tag', 300, 68);

  // Subtitle
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 17px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('SCAN TO CONTACT VEHICLE OWNER', 300, 150);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('PARKING OBSTRUCTION • EMERGENCY • NUMBER PRIVACY', 300, 172);

  // Fetch QR Code Image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    // Draw QR code with border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(110, 195, 380, 380);
    ctx.drawImage(img, 120, 205, 360, 360);

    // Draw central circular shield logo over QR code
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      const cx = 300;
      const cy = 385;
      const r = 36;

      ctx.save();
      // White circular cutout background
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Draw Logo
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, cx - r + 3, cy - r + 3, (r - 3) * 2, (r - 3) * 2);
      ctx.restore();

      // Finalize text & trigger download
      finishDownload();
    };

    logoImg.onerror = () => {
      finishDownload();
    };

    logoImg.src = '/logos/icon.png';

    function finishDownload() {
      // Code & Vehicle Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(110, 595, 380, 65);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(110, 595, 380, 65);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 19px monospace';
      ctx.fillText(`${copyCode}`, 300, 624);

      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`${vehicle}`, 300, 646);

      // Footer
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 13.5px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('🔒 100% Private Masked Calling & Instant WhatsApp Bridge', 300, 695);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11.5px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Official SafeDrive-Tag • https://safedrivetag-website.vercel.app', 300, 725);

      // Trigger Download
      const a = document.createElement('a');
      a.download = `SafeDrive_Tag_${copyCode}.png`;
      a.href = canvas.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(liveUrl)}&format=png&margin=1`;
};

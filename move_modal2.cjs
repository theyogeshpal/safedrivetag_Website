const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardOrders.jsx', 'utf8');

const modalStart = '{digitalPassModalOrder && (';
const trackingModalStart = '{trackingModalOrder && (';
const modalIdx = code.indexOf(modalStart);
const trackingIdx = code.indexOf(trackingModalStart);

if (modalIdx !== -1 && trackingIdx !== -1) {
    const modalCode = code.substring(modalIdx, trackingIdx);
    
    let inline = modalCode.replace('{digitalPassModalOrder && (', '{expandedOrder === ord._id && (() => { const digitalPassModalOrder = ord; return (');
    
    inline = inline.replace('<div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-up">', '<div className="mt-4 pt-4 border-t border-gray-200 animate-fade-up">');
    
    inline = inline.replace(/<button[^>]*onClick=\{\(\) => setDigitalPassModalOrder\(null\)\}[^>]*>[\s\S]*?<\/button>/, '');
    
    inline = inline.replace(/<\/div>\s*<\/div>\s*\)\}\s*$/, '</div></div>)})()}\n        ');
    
    // Use regex to find insertion point which is before the end of the ord block
    // The ord block ends with "</div>\n                  </div>\n                );\n              })}\n            </div>"
    
    const mapEndRegex = /(<\/div>\s*<\/div>\s*\);\s*\}\)\}\s*<\/div>)/;
    if (mapEndRegex.test(code)) {
        code = code.replace(mapEndRegex, '                    </div>\n' + inline + '\n$1');
        code = code.replace(modalCode, '');
        fs.writeFileSync('src/pages/dashboard/DashboardOrders.jsx', code, 'utf8');
        console.log('Success');
    } else {
        console.log('Regex Target not found');
    }
} else {
    console.log('Modal not found');
}

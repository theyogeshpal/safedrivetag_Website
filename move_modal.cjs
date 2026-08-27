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
    
    const insertionTarget = '                    </div>\n                  </div>\n                );\n              })}\n            </div>';
    
    if (code.includes(insertionTarget)) {
        code = code.replace(insertionTarget, '                    </div>\n' + inline + '\n                  </div>\n                );\n              })}\n            </div>');
        code = code.replace(modalCode, '');
        fs.writeFileSync('src/pages/dashboard/DashboardOrders.jsx', code, 'utf8');
        console.log('Success');
    } else {
        console.log('Target not found');
    }
} else {
    console.log('Modal not found');
}

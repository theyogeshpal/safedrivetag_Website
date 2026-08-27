const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardOrders.jsx', 'utf8');

// 1. Add active/pending copies calculation after isTagActive
const target1 = 'const isTagActive = firstAllocated?.status === \'ACTIVE\' || ord.isClaimed === true;';
const replacement1 = `const isTagActive = firstAllocated?.status === 'ACTIVE' || ord.isClaimed === true;
              const allCopies = Array.isArray(ord.allocatedQRIds) ? ord.allocatedQRIds : [];
              const activeCopies = allCopies.filter(c => c.status === 'ACTIVE').length;
              const pendingCopies = allCopies.length - activeCopies;`;

if (code.includes(target1)) {
  code = code.replace(target1, replacement1);
  console.log('Step 1: Added copies tracking');
} else {
  console.log('Step 1: Target not found');
}

// 2. Add pending badge after "Format: Digital..." line
const target2 = "Format: <strong className=\"text-purple-700 uppercase\">{isDigital ? 'Digital E-Kit Pass' : 'Physical Sticker Kit'}</strong> • Qty: {ord.quantity || 1}";
const replacement2 = `Format: <strong className="text-purple-700 uppercase">{isDigital ? 'Digital E-Kit Pass' : 'Physical Sticker Kit'}</strong> • Qty: {ord.quantity || 1}
                        </p>
                        {isDigital && allCopies.length > 0 && (
                          <p className="text-xs mt-0.5">
                            <span className="text-emerald-700 font-bold">{activeCopies} Activated</span>
                            {pendingCopies > 0 && <span className="text-amber-600 font-bold ml-2">• {pendingCopies} Pending Activation</span>}
                          </p>
                        `;

if (code.includes(target2)) {
  code = code.replace(target2, replacement2);
  console.log('Step 2: Added pending badge');
} else {
  console.log('Step 2: Target not found, trying simpler');
  // try without the format prefix
  const t2alt = "Format: \\u003cstrong className=\\\"text-purple-700 uppercase\\\"\\u003e{isDigital ? 'Digital E-Kit Pass' : 'Physical Sticker Kit'}\\u003c/strong\\u003e • Qty: {ord.quantity || 1}";
  if (code.includes(t2alt)) {
    console.log('Found with unicode');
  }
}

fs.writeFileSync('src/pages/dashboard/DashboardOrders.jsx', code, 'utf8');

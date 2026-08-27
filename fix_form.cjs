const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterTag.jsx', 'utf8');

// 1. Clean up default formData initialization
code = code.replace(/vehicleBrand:\s*'SafeDrive',/g, "vehicleBrand: '',");

// 2. Remove the auto-fill logic inside fetchTagMeta:
code = code.replace(/itemTitle:\s*prev\.itemTitle\s*\|\|.*?\,/g, "");

// 3. Remove the auto-fill logic in the select onChange for vehicleType
code = code.replace(/vehicleBrand:\s*prev\.vehicleBrand\s*\|\|.*?,/g, "");

// 4. Hide Tag/Serial Code field completely from the UI
// Look for "Tag / Serial Code"
const serialCodeRegex = /\{\/\*\s*Serial \/ Identifier\s*\*\/\}\s*<div className="space-y-1">\s*<label className="block text-\[11px\] font-bold text-gray-700">\s*Tag \/ Serial Code\s*<\/label>\s*<input[^>]*>\s*<\/div>/g;
code = code.replace(serialCodeRegex, '{/* Hidden Serial Code */}');

// Let's also hide it if it says "Vehicle Number" but they didn't complain about vehicle number.
// Wait, if it's a Vehicle, they need to enter Vehicle Number! The screenshot specifically is for Luggage / Suitcase.

fs.writeFileSync('src/pages/RegisterTag.jsx', code, 'utf8');
console.log("Successfully fixed form defaults");

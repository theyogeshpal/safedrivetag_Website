const fs = require('fs');
const path = 'd:/Safe_Drive/safedrivetag_next/src/utils/navigation.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/search: searchParams \? \\?\\\\ : '',/, "search: searchParams ? '?' + searchParams.toString() : '',");
fs.writeFileSync(path, content);
console.log('Fixed navigation bug');

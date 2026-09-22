const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      if (content.includes('import.meta.env.VITE_API_BASE_URL')) {
        content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL/g, "process.env.NEXT_PUBLIC_API_BASE_URL");
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src'));
console.log('Fixed env vars');

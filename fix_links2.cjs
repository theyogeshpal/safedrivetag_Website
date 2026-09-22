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

      if (content.includes('<Link=')) {
        content = content.replace(/<Link=/g, '<Link href=');
        changed = true;
      }
      if (content.includes('<Link"')) {
        content = content.replace(/<Link"/g, '<Link href="');
        changed = true;
      }
      if (content.includes('<Link{')) {
        content = content.replace(/<Link\{/g, '<Link href={');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src'));
console.log('Fixed Link syntax errors');

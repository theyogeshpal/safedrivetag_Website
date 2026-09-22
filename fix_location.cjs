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

      // useLocation in next/navigation is usePathname which returns a string, so location.pathname fails.
      // We will replace location.pathname with (location || '') assuming location = useLocation().
      // Or useLocation().pathname with useLocation().
      if (content.includes('location.pathname')) {
        content = content.replace(/location\.pathname/g, '(location || "")');
        changed = true;
      }
      if (content.includes('useLocation().pathname')) {
        content = content.replace(/useLocation\(\)\.pathname/g, '(useLocation() || "")');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src'));
console.log('Fixed location.pathname');

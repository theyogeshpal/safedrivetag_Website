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

      // Replace <Link to=... with <Link href=...
      if (content.includes('<Link') && content.includes('to=')) {
        content = content.replace(/<Link([^>]*?)to=/g, '<Link\=');
        changed = true;
      }
      
      // Navigate in react-router-dom uses "to=". In Next.js redirect doesn't render as a component,
      // but if we mocked it as <Navigate to="..." /> it will fail.
      // Next.js equivalent of <Navigate to="/foo"/> is to call redirect("/foo") or router.replace.
      // I'll just change <Navigate to= to <Navigate href= just in case, but really <Navigate> shouldn't be used as a component.
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src'));
console.log('Fixed Link hrefs');

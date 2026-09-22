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
      
      if (content.includes('react-router-dom')) {
        content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, importsStr) => {
          const imports = importsStr.split(',').map(s => s.trim());
          let nextImports = [];
          
          if (imports.includes('Link')) {
            nextImports.push(`import Link from 'next/link';`);
          }
          let navImports = [];
          if (imports.includes('useNavigate')) navImports.push('useRouter as useNavigate');
          if (imports.includes('useLocation')) navImports.push('usePathname as useLocation');
          if (imports.includes('useParams')) navImports.push('useParams');
          
          if (navImports.length > 0) {
            nextImports.push(`import { ` + navImports.join(', ') + ` } from 'next/navigation';`);
          }
          
          return nextImports.join('\n');
        });
        changed = true;
      }
      
      if ((content.includes('useState') || content.includes('useEffect') || content.includes('useNavigate') || content.includes('useAuth') || content.includes('useParams') || content.includes('useLocation')) && !content.includes('"use client"')) {
        content = '"use client";\n' + content;
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir(path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src'));
console.log('Done');

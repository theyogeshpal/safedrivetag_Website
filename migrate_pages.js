const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');
const destDir = path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src', 'app');

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '\-\').toLowerCase();
}

function processPages() {
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    if (file.endsWith('.jsx')) {
      const componentName = file.replace('.jsx', '');
      let routePath = toKebabCase(componentName);
      
      if (componentName === 'Home') routePath = ''; // Root page
      
      const targetDir = path.join(destDir, routePath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
      
      // Remove Helmet and SEO
      content = content.replace(/import\s+SEO\s+from\s+['"][^'"]+['"];?\n?/g, '');
      content = content.replace(/<SEO[^>]*\/>/g, '');
      content = content.replace(/import\s+\{\s*Helmet\s*\}\s+from\s+['"]react-helmet-async['"];?\n?/g, '');
      content = content.replace(/<Helmet>.*?<\/Helmet>/gs, '');

      // Transform react-router-dom
      if (content.includes('react-router-dom')) {
        content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, importsStr) => {
          const imports = importsStr.split(',').map(s => s.trim());
          let nextImports = [];
          if (imports.includes('Link')) nextImports.push(import Link from 'next/link';);
          let navImports = [];
          if (imports.includes('useNavigate')) navImports.push('useRouter as useNavigate');
          if (imports.includes('useLocation')) navImports.push('usePathname as useLocation');
          if (imports.includes('useParams')) navImports.push('useParams');
          if (navImports.length > 0) nextImports.push(import {  + navImports.join(', ') +  } from 'next/navigation';);
          return nextImports.join('\n');
        });
      }
      
      if ((content.includes('useState') || content.includes('useEffect') || content.includes('useNavigate') || content.includes('useAuth') || content.includes('useParams') || content.includes('useLocation')) && !content.includes('\"use client\"')) {
        content = '\"use client\";\n' + content;
      }

      fs.writeFileSync(path.join(targetDir, 'page.jsx'), content);
      console.log('Migrated ' + file + ' to ' + path.join(targetDir, 'page.jsx'));
    }
  }
}

processPages();
console.log('Done mapping pages');

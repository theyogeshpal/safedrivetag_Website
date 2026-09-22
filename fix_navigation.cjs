const fs = require('fs');
const path = require('path');

const srcDir = path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // 1. Undo fix_location.js
      if (content.includes('(location || "")')) {
        content = content.replace(/\(location \|\| ""\)/g, 'location.pathname');
        changed = true;
      }
      if (content.includes('(useLocation() || "")')) {
        content = content.replace(/\(useLocation\(\) \|\| ""\)/g, 'useLocation().pathname');
        changed = true;
      }

      // 2. Replace Next.js router imports with our custom utils/navigation
      const oldImport = "import { useRouter as useNavigate, usePathname as useLocation } from 'next/navigation';";
      const newImport = "import { useNavigate, useLocation } from '@/utils/navigation';";
      if (content.includes(oldImport)) {
        content = content.replace(oldImport, newImport);
        changed = true;
      }
      
      const oldImport2 = "import { useRouter as useNavigate } from 'next/navigation';";
      const newImport2 = "import { useNavigate } from '@/utils/navigation';";
      if (content.includes(oldImport2)) {
        content = content.replace(oldImport2, newImport2);
        changed = true;
      }

      const oldImport3 = "import { usePathname as useLocation } from 'next/navigation';";
      const newImport3 = "import { useLocation } from '@/utils/navigation';";
      if (content.includes(oldImport3)) {
        content = content.replace(oldImport3, newImport3);
        changed = true;
      }
      
      // Some files might have both useRouter and usePathname separately, we might have replaced them separately in our migration script.
      // The initial migration script added:
      // import { useRouter as useNavigate, usePathname as useLocation } from 'next/navigation';

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(srcDir);
console.log('Fixed navigation imports and location usage');

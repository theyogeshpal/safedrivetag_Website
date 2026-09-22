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
      const patterns = [
        { from: /\.\.\/\.\.\//g, to: '@/' },
        { from: /\.\.\/components/g, to: '@/components' },
        { from: /\.\.\/utils/g, to: '@/utils' },
        { from: /\.\.\/services/g, to: '@/services' },
        { from: /\.\.\/context/g, to: '@/context' },
        { from: /\.\.\/data/g, to: '@/data' },
        { from: /\.\.\/assets/g, to: '@/assets' },
        { from: /\.\/About\.css/g, to: '@/app/about/About.css' },
        { from: /\.\/dashboard\/DashboardTags/g, to: './DashboardTags' },
      ];
      
      patterns.forEach(p => {
        if (p.from.test(content)) {
          content = content.replace(p.from, p.to);
          changed = true;
        }
      });
      
      // Fix specific case for Dashboard
      if (fullPath.includes('dashboard') && content.includes('./DashboardTags')) {
        content = content.replace('./dashboard/DashboardTags', './DashboardTags');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

// Copy About.css to the correct app folder
if (fs.existsSync('d:/Safe_Drive/safedrivetag_Website/src/pages/About.css')) {
  fs.copyFileSync('d:/Safe_Drive/safedrivetag_Website/src/pages/About.css', 'd:/Safe_Drive/safedrivetag_next/src/app/about/About.css');
}
// Copy DashboardTags to correct folder
if (fs.existsSync('d:/Safe_Drive/safedrivetag_Website/src/pages/dashboard')) {
  // We need to copy the entire dashboard folder to app/dashboard
  fs.cpSync('d:/Safe_Drive/safedrivetag_Website/src/pages/dashboard', 'd:/Safe_Drive/safedrivetag_next/src/app/dashboard', { recursive: true });
  // Also rename the jsx files inside it if necessary
  processDir('d:/Safe_Drive/safedrivetag_next/src/app/dashboard');
}

processDir(path.join('d:', 'Safe_Drive', 'safedrivetag_next', 'src'));
console.log('Fixed imports');

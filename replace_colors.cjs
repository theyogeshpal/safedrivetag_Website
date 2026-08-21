const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /slate-900/g, replacement: 'black' },
  { regex: /slate-800/g, replacement: 'black/90' },
  { regex: /slate-700/g, replacement: 'black/80' },
  { regex: /slate-600/g, replacement: 'black/60' },
  { regex: /slate-500/g, replacement: 'black/50' },
  { regex: /slate-400/g, replacement: 'black/40' },
  { regex: /slate-300/g, replacement: 'black/20' },
  { regex: /slate-200/g, replacement: 'black/10' },
  { regex: /slate-100/g, replacement: 'black/5' },
  { regex: /slate-50/g, replacement: 'white' },
  { regex: /red-600/g, replacement: 'green-600' },
  { regex: /red-500/g, replacement: 'green-500' },
  { regex: /red-400/g, replacement: 'green-400' },
  { regex: /red-200/g, replacement: 'green-200' },
  { regex: /red-50/g, replacement: 'green-50' },
  { regex: /blue-500/g, replacement: 'green-500' },
  { regex: /blue-100/g, replacement: 'green-100' },
  // Hex color replacements for CSS
  { regex: /#0f172a/gi, replacement: '#000000' }, // slate-900
  { regex: /#1e293b/gi, replacement: '#1a1a1a' }, // slate-800
  { regex: /#f8fafc/gi, replacement: '#ffffff' }, // slate-50
  { regex: /#f1f5f9/gi, replacement: '#f3f3f3' }, // slate-100
  { regex: /#1a1f2c/gi, replacement: '#000000' }, // custom dark from Footer.jsx
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done!');

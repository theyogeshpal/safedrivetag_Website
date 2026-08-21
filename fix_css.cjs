const fs = require('fs');
const files = [
  'src/pages/About.css',
  'src/pages/Home.jsx',
  'src/pages/Contact.jsx' // just in case
];

function fixCSS(content) {
  return content.replace(/var\(--color-black\/(\d+)\)/g, (match, p1) => {
    return `rgba(0, 0, 0, ${p1/100})`;
  });
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = dir + '/' + file;
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = fixCSS(content);
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Fixed', fullPath);
            }
        }
    }
}

processDir('src');

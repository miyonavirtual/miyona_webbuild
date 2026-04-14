const fs = require('fs');
const path = 'src/components/landing/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove border-b border-white/5
content = content.replace('border-b border-white/5 ', '');

// Center logo: 
// Original: <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
content = content.replace(
    '<Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">',
    '<Link href="/" className="absolute left-1/2 -translate-x-1/2 group flex items-center gap-3 transition-opacity hover:opacity-90">'
);

fs.writeFileSync(path, content);

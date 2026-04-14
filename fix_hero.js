const fs = require('fs');

const path = 'src/components/landing/Hero.tsx';
let content = fs.readFileSync(path, 'utf8');

// The section starts with {/* Subtle Overlay Text */} and ends around the privacy badge
const regex = /\{\/\* Subtle Overlay Text \*\/\}[\s\S]*?\{\/\* Floating "Privacy" Badge - Minimalized \*\/\}/g;

content = content.replace(regex, '{/* Floating "Privacy" Badge - Minimalized */}');

fs.writeFileSync(path, content);

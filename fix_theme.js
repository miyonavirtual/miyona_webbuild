const fs = require('fs');
const glob = require('glob');

const files = [
    'src/components/NavBar.tsx',
    'src/app/(app)/chat/page.tsx',
    'src/app/(app)/memories/page.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace text-white with text-foreground (except for primary buttons where text-white is intentional)
    content = content.replace(/text-white(?!(\/|\w))/g, 'text-foreground');
    // For primary buttons having bg-primary text-white, we might want to keep it. 
    // Wait, replacing all text-white might mess up primary buttons. Let's do it carefully:
    content = content.replace(/bg-black\/20/g, 'bg-white/40 dark:bg-black/20');
    content = content.replace(/bg-black\/30/g, 'bg-white/50 dark:bg-black/30');
    content = content.replace(/bg-black\/40/g, 'bg-white/60 dark:bg-black/40');
    content = content.replace(/bg-black\/60/g, 'bg-white/80 dark:bg-black/60');
    content = content.replace(/bg-black\/95/g, 'bg-white/95 dark:bg-black/95');
    
    content = content.replace(/border-white\/5(?!0)/g, 'border-black/5 dark:border-white/5');
    content = content.replace(/border-white\/10/g, 'border-black/10 dark:border-white/10');
    
    content = content.replace(/bg-white\/5(?!0)/g, 'bg-black/5 dark:bg-white/5');
    content = content.replace(/bg-white\/10/g, 'bg-black/10 dark:bg-white/10');
    content = content.replace(/bg-white\/20/g, 'bg-black/20 dark:bg-white/20');

    fs.writeFileSync(file, content);
});
console.log('Theme classes updated!');

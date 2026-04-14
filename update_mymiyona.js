const fs = require('fs');

const path = 'src/app/(app)/mymiyona/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Import ProUpgradeCard
if (!content.includes('import { ProUpgradeCard }')) {
    content = content.replace('import { onAuthStateChanged } from "firebase/auth";', 'import { onAuthStateChanged } from "firebase/auth";\nimport { ProUpgradeCard } from "@/components/ProUpgradeCard";');
}

// Add state
if (!content.includes('showProModal')) {
    content = content.replace('const [user, setUser] = useState<any>(null);', 'const [user, setUser] = useState<any>(null);\n    const [showProModal, setShowProModal] = useState(false);');
}

// Update buttons to open modal
content = content.replace(/className="[^"]*cursor-not-allowed"/g, (match) => {
    return match.replace('cursor-not-allowed', 'cursor-pointer').replace('className="', 'onClick={() => setShowProModal(true)} className="');
});

// Add modal JSX at the end before last div
const modalJsx = `
            {/* Pro Upgrade Modal Overlay */}
            {showProModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative">
                        <button 
                            onClick={() => setShowProModal(false)}
                            className="absolute -top-4 -right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <ProUpgradeCard />
                    </div>
                </div>
            )}
`;

if (!content.includes('showProModal &&')) {
    content = content.replace('            </div>\n        </div>', `            </div>\n${modalJsx}        </div>`);
}

fs.writeFileSync(path, content);

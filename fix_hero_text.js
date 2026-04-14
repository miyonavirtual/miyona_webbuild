const fs = require('fs');

const path = 'src/components/landing/Hero.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldStr = `                {/* Floating "Privacy" Badge - Minimalized */}
                <div className="absolute top-8 right-8 flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-[10px] tracking-widest uppercase text-white/40 backdrop-blur-xl">
                    <Lock className="h-3 w-3" /> Fully Private & Encrypted
                </div>`;

const newStr = `                {/* Smooth animated text overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center"
                    >
                        <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-light tracking-wider text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                            Say hello to Miyona.
                        </span>
                    </motion.div>
                </div>`;

content = content.replace(oldStr, newStr);

fs.writeFileSync(path, content);

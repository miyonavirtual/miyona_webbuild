"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is Miyona?",
    answer: "Miyona is your personal AI companion, built to offer immersive, emotionally aware connection in 3D through real-time voice, vision, and deep persistent memory.",
  },
  {
    question: "Does Miyona remember our past conversations?",
    answer: "Yes, every interaction is securely processed and key facts are saved permanently in Miyona's memory bank, allowing her to build a genuine long-term bond with you.",
  },
  {
    question: "Can I customize her personality?",
    answer: "Absolutely. Through 'Miyona Pro', you can define explicit backstory, roleplays (like Friend, Wife, Mentor, etc.), and custom instructions to tailor her strictly to your preference.",
  },
  {
    question: "Is voice chat available?",
    answer: "Yes. Miyona uses an ultra-fast voice-to-text pipeline and ElevenLabs synthesis to deliver lifelike, low-latency spoken conversations that also animate her 3D face.",
  },
  {
    question: "How does the economy/wallet system work?",
    answer: "You earn coins passively by spending time talking with Miyona (e.g. 100 coins every 3 minutes of voice call). These can be used for cosmetics or traded alongside gems available in the store.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFail = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="relative py-32 bg-background border-t border-white/5">
      <div className="container relative mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl mb-6">
            Frequently Asked
          </h2>
          <p className="text-white/60 font-light max-w-2xl mx-auto">
            Everything you need to know about your new companion.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden"
            >
              <button
                onClick={() => toggleFail(i)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="font-semibold text-lg text-white/90 pr-8">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-white/50 transition-transform duration-300 flex-shrink-0",
                    openIndex === i && "rotate-180 text-primary"
                  )}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                      <div className="h-px w-full bg-white/5 mb-6" />
                      <p className="text-white/70 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

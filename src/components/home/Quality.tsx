"use client";

import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { useLanguage } from "@/context/LanguageContext";

const ICONS = [
  <svg key="1" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
    <path d="M20 6c4 6 10 10 10 18a10 10 0 1 1-20 0c0-8 6-12 10-18z" strokeLinecap="round" />
  </svg>,
  <svg key="2" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
    <rect x="8" y="10" width="24" height="20" rx="1" />
    <path d="M8 16h24M8 22h24" />
  </svg>,
  <svg key="3" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
    <rect x="6" y="12" width="28" height="16" rx="1" />
    <path d="M12 20h16M16 16v8" strokeLinecap="round" />
  </svg>,
  <svg key="4" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
    <path d="M8 20c4-6 8-6 12 0s8 6 12 0" strokeLinecap="round" />
    <path d="M8 26c4-6 8-6 12 0s8 6 12 0" strokeLinecap="round" />
  </svg>,
  <svg key="5" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
    <path d="M14 8l-6 6v18h24V14l-6-6H14z" strokeLinejoin="round" />
    <path d="M14 8v6h12V8" />
  </svg>,
  <svg key="6" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
    <path d="M20 6l12 6v10c0 8-6 14-12 16-6-2-12-8-12-16V12l12-6z" strokeLinejoin="round" />
    <path d="M14 20l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export function Quality() {
  const { t } = useLanguage();

  const QUALITIES = [
    { title: t.quality.cotton, description: t.quality.cottonDesc },
    { title: t.quality.gsm, description: t.quality.gsmDesc },
    { title: t.quality.print, description: t.quality.printDesc },
    { title: t.quality.breathable, description: t.quality.breathableDesc },
    { title: t.quality.fit, description: t.quality.fitDesc },
    { title: t.quality.durable, description: t.quality.durableDesc },
  ];

  return (
    <section id="quality" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.quality.eyebrow}
          title={t.quality.title}
          description={t.quality.description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUALITIES.map((q, i) => (
            <FadeUp key={q.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="group flex gap-5 border border-white/8 bg-card p-7 h-full transition-shadow duration-500 hover:shadow-glow"
              >
                <div className="text-white/60 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  {ICONS[i]}
                </div>
                <div>
                  <h3 className="font-display text-xl tracking-wide text-white mb-2">
                    {q.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{q.description}</p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

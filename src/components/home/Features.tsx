"use client";

import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { useLanguage } from "@/context/LanguageContext";

export function Features() {
  const { t } = useLanguage();

  const FEATURES = [
    {
      title: t.features.strength,
      description: t.features.strengthDesc,
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
          <path d="M14 28c0-6 4-12 10-14 6 2 10 8 10 14" strokeLinecap="round" />
          <path d="M18 30h12M20 34h8" strokeLinecap="round" />
          <circle cx="24" cy="18" r="3" />
        </svg>
      ),
    },
    {
      title: t.features.focus,
      description: t.features.focusDesc,
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
          <circle cx="24" cy="24" r="14" />
          <circle cx="24" cy="24" r="6" />
          <path d="M24 6v4M24 38v4M6 24h4M38 24h4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: t.features.brotherhood,
      description: t.features.brotherhoodDesc,
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
          <circle cx="16" cy="16" r="4" />
          <circle cx="32" cy="16" r="4" />
          <circle cx="24" cy="28" r="4" />
          <path d="M8 38c2-6 6-8 8-8M40 38c-2-6-6-8-8-8M16 38c2-5 5-6 8-6s6 1 8 6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: t.features.discipline,
      description: t.features.disciplineDesc,
      icon: (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
          <path d="M8 12h32M12 12v24M36 12v24M12 36h24" strokeLinecap="round" />
          <path d="M20 20v8M28 18v12" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          description={t.features.description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {FEATURES.map((feature, i) => (
            <FadeUp key={feature.title} delay={i * 0.08} as="article">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full border border-white/8 bg-card p-8 md:p-10 transition-shadow duration-500 hover:shadow-glow"
              >
                <div className="text-white/70 group-hover:text-white transition-colors duration-300 mb-8">
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl tracking-wide text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

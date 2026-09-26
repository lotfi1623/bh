"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { PRIMARY_PRODUCT_PATH } from "@/data/products";

export function Story() {
  const { t } = useLanguage();

  return (
    <section
      id="story"
      className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8 relative overflow-hidden"
    >
      <div className="absolute inset-0 smoke-bg opacity-60 pointer-events-none" />
      <div className="relative mx-auto max-w-4xl text-center">
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted mb-6">
            {t.story.eyebrow}
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-white leading-tight">
            {t.story.title1}
            <br />
            {t.story.title2}
          </h2>
          <p className="mt-8 text-sm md:text-base text-muted leading-relaxed max-w-2xl mx-auto">
            {t.story.p1}
          </p>
          <p className="mt-4 text-sm md:text-base text-muted leading-relaxed max-w-2xl mx-auto">
            {t.story.p2}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-28 md:py-40 px-5 md:px-8 border-t border-white/8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      <FadeUp className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.4em] uppercase text-muted mb-6"
        >
          {t.cta.eyebrow}
        </motion.p>
        <h2 className="font-display text-5xl sm:text-6xl md:text-8xl tracking-wide text-white leading-[0.95]">
          {t.cta.title1}
          <br />
          {t.cta.title2}{" "}
          <span className="relative inline-block">
            {t.cta.bigger}
            <motion.span
              className="absolute -bottom-1 left-0 h-px w-full bg-white/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ originX: 0 }}
            />
          </span>
        </h2>
        <div className="mt-12">
          <Button href={PRIMARY_PRODUCT_PATH} variant="primary" size="lg">
            {t.cta.enterShop}
          </Button>
        </div>
      </FadeUp>
    </section>
  );
}

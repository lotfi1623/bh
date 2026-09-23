"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center smoke-bg overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-start">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-muted mb-6"
            >
              {t.hero.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.9] tracking-wide text-white"
            >
              BROTHER
              <br />
              HOOD
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-xs md:text-sm tracking-[0.35em] uppercase text-white/90"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 max-w-md mx-auto lg:mx-0 text-sm md:text-base text-muted leading-relaxed"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button href="/shop" variant="primary" size="lg">
                {t.hero.shopNow}
              </Button>
              <Button href="/#story" variant="secondary" size="lg">
                {t.hero.ourStory}
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/5] max-w-lg mx-auto overflow-hidden border border-white/8 bg-card">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src="/images/product-front.png"
                alt="Brother Hood BH Heavyweight Tee"
                fill
                priority
                className="object-contain object-center p-6 md:p-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 font-display text-sm tracking-[0.3em] text-white/70 whitespace-nowrap">
              {t.hero.productLabel}
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-muted">
          {t.hero.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

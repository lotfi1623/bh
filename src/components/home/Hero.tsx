"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { PRIMARY_PRODUCT_PATH } from "@/data/products";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 4000;

export function Hero() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(
    () => [
      {
        src: "/images/brotherhood-tee-mockup.png",
        alt: "Brother Hood BH Heavyweight Tee — présentation",
        label: t.hero.slideMockup,
        contain: true,
      },
      {
        src: "/images/brotherhood-tee-worn.png",
        alt: "Brother Hood BH Heavyweight Tee — porté",
        label: t.hero.slideWorn,
        contain: false,
      },
    ],
    [t.hero.slideMockup, t.hero.slideWorn]
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex] ?? slides[0];

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
              <Button href={PRIMARY_PRODUCT_PATH} variant="primary" size="lg">
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
            <div className="relative aspect-[4/5] max-w-lg mx-auto overflow-hidden border border-white/8 bg-black">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeSlide.src}
                    alt={activeSlide.alt}
                    fill
                    priority={activeIndex === 0}
                    className={cn(
                      "object-center transition-transform duration-700",
                      activeSlide.contain
                        ? "object-contain p-6 md:p-10"
                        : "object-cover"
                    )}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              <span className="absolute top-4 start-4 z-20 text-[10px] tracking-[0.3em] uppercase text-white/80 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                {activeSlide.label}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={slide.label}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeIndex === index ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"
                  )}
                />
              ))}
            </div>

            <p className="mt-3 text-center font-display text-sm tracking-[0.3em] text-white/70 whitespace-nowrap">
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

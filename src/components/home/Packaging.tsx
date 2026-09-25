"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { useLanguage } from "@/context/LanguageContext";

export function Packaging() {
  const { t } = useLanguage();

  const items = [
    { title: t.packaging.mailer, text: t.packaging.mailerDesc },
    { title: t.packaging.tag, text: t.packaging.tagDesc },
    { title: t.packaging.card, text: t.packaging.cardDesc },
  ];

  return (
    <section className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.packaging.eyebrow}
          title={t.packaging.title}
          description={t.packaging.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <FadeUp>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/8 bg-card group">
              <Image
                src="/images/brotherhood-tee-mockup.png"
                alt="Brother Hood packaging / product"
                fill
                className="object-contain object-center p-10 transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <ul className="space-y-8">
              {items.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="border-s border-white/20 ps-6"
                >
                  <h3 className="font-display text-2xl tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed max-w-md">
                    {item.text}
                  </p>
                </motion.li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

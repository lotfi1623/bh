"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { useLanguage } from "@/context/LanguageContext";
import { Instagram, MessageCircle } from "lucide-react";
import { packagingImage, packagingInfo } from "@/data/packaging";

export function Packaging() {
  const { t } = useLanguage();

  const items = packagingInfo.highlights.map((item, i) => {
    const keys = [
      { title: t.packaging.mailer, text: t.packaging.mailerDesc },
      { title: t.packaging.tag, text: t.packaging.tagDesc },
      { title: t.packaging.card, text: t.packaging.cardDesc },
    ];
    return keys[i] ?? { title: item.title, text: item.text };
  });

  return (
    <section
      id="packaging"
      className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8 scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.packaging.eyebrow}
          title={t.packaging.title}
          description={t.packaging.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <FadeUp>
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 overflow-hidden border border-white/8 bg-black group">
              <Image
                src={packagingImage}
                alt="Sachet expédition Brother Hood"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
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

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`https://instagram.com/${packagingInfo.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs tracking-widest uppercase text-muted hover:text-white hover:border-white/25 transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
                @{packagingInfo.instagram}
              </a>
              <a
                href={`https://wa.me/213${packagingInfo.whatsapp.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs tracking-widest uppercase text-muted hover:text-white hover:border-white/25 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {packagingInfo.whatsapp}
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

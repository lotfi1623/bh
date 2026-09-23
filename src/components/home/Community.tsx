"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { useLanguage } from "@/context/LanguageContext";

const IMAGES = [
  { src: "/images/team-2.jpg", alt: "Brother Hood team street workout" },
  { src: "/images/team-3.jpg", alt: "Brother Hood athletes" },
  { src: "/images/team-1.jpg", alt: "Brother Hood calisthenics team" },
];

export function Community() {
  const { t } = useLanguage();

  return (
    <section id="community" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.community.eyebrow}
          title={t.community.title}
          description={t.community.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {IMAGES.map((img, i) => (
            <FadeUp
              key={img.src}
              delay={i * 0.08}
              className="min-h-[320px] md:min-h-[400px]"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.5 }}
                className="relative h-full min-h-[320px] md:min-h-[400px] overflow-hidden group border border-white/8 bg-card"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

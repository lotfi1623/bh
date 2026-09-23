"use client";

import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { useLanguage } from "@/context/LanguageContext";

export function InstagramSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.instagram.eyebrow}
          title={t.instagram.title}
          description={t.instagram.description}
        />

        <div className="flex flex-col items-center justify-center mt-10">
          <FadeUp>
            <motion.a
              href="https://instagram.com/brotherhood.cali"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-white/90 font-display text-sm tracking-widest uppercase transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @brotherhood.cali
            </motion.a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

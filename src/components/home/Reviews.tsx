"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { reviews } from "@/data/reviews";
import { useLanguage } from "@/context/LanguageContext";

export function Reviews() {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t.reviews.eyebrow}
          title={t.reviews.title}
          description={t.reviews.description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review, i) => (
            <FadeUp key={review.id} delay={i * 0.08} as="article">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="h-full border border-white/8 bg-card p-7 flex flex-col transition-shadow duration-500 hover:shadow-glow"
              >
                <div className="flex gap-0.5 mb-5" aria-label={`${review.rating}/5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-3.5 w-3.5 fill-white text-white"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/8">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{review.name}</p>
                    <p className="text-[11px] text-muted">
                      {review.location} · {review.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { Accordion } from "@/components/ui/Accordion";
import { useLanguage } from "@/context/LanguageContext";

export function ProductDetails() {
  const { t } = useLanguage();

  const ITEMS = [
    { id: "fabric", title: t.details.fabric, content: t.details.fabricContent },
    { id: "printing", title: t.details.printing, content: t.details.printingContent },
    { id: "care", title: t.details.care, content: t.details.careContent },
    { id: "shipping", title: t.details.shipping, content: t.details.shippingContent },
    { id: "returns", title: t.details.returns, content: t.details.returnsContent },
  ];

  return (
    <section id="details" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow={t.details.eyebrow}
          title={t.details.title}
          description={t.details.description}
        />
        <FadeUp>
          <Accordion items={ITEMS} defaultOpen="fabric" />
        </FadeUp>
      </div>
    </section>
  );
}

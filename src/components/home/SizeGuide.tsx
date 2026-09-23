"use client";

import { FadeUp, SectionHeading } from "@/components/ui/FadeUp";
import { sizeChart } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";

export function SizeGuide() {
  const { t } = useLanguage();

  return (
    <section id="size-guide" className="py-24 md:py-32 px-5 md:px-8 border-t border-white/8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow={t.sizeGuide.eyebrow}
          title={t.sizeGuide.title}
          description={t.sizeGuide.description}
        />

        <FadeUp>
          <div className="overflow-x-auto border border-white/8 bg-card">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-6 py-4 font-display text-lg tracking-wide text-white font-normal">
                    {t.sizeGuide.size}
                  </th>
                  <th className="px-6 py-4 font-display text-lg tracking-wide text-white font-normal">
                    {t.sizeGuide.height}
                  </th>
                  <th className="px-6 py-4 font-display text-lg tracking-wide text-white font-normal">
                    {t.sizeGuide.width}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, i) => (
                  <tr
                    key={row.size}
                    className={i < sizeChart.length - 1 ? "border-b border-white/8" : ""}
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium">{row.size}</td>
                    <td className="px-6 py-4 text-sm text-muted">{row.height} cm</td>
                    <td className="px-6 py-4 text-sm text-muted">{row.width} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-xs text-muted">{t.sizeGuide.tip}</p>
        </FadeUp>
      </div>
    </section>
  );
}

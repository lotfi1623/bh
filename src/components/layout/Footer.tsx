"use client";

import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.83a8.19 8.19 0 0 0 4.76 1.52V6.9a4.85 4.85 0 0 1-1-.21z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLanguage();

  const FOOTER_LINKS = [
    {
      title: t.footer.shop,
      links: [
        { label: t.footer.allProducts, href: "/shop" },
        { label: t.shop.tees, href: "/shop?category=tees" },
        { label: t.shop.hoodies, href: "/shop?category=hoodies" },
        { label: t.shop.shorts, href: "/shop?category=shorts" },
      ],
    },
    {
      title: t.footer.brand,
      links: [
        { label: t.footer.ourStory, href: "/#story" },
        { label: t.footer.community, href: "/#community" },
        { label: t.footer.sizeGuide, href: "/#size-guide" },
        { label: t.footer.quality, href: "/#quality" },
      ],
    },
    {
      title: t.footer.support,
      links: [
        { label: t.footer.shipping, href: "/#details" },
        { label: t.footer.returns, href: "/#details" },
        { label: t.footer.contact, href: "mailto:hello@brotherhood.cali" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/8 bg-[#050505]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl tracking-wider text-white">
                BROTHER HOOD
              </span>
            </Link>
            <p className="mt-2 text-[10px] tracking-[0.35em] uppercase text-muted">
              {t.footer.tagline}
            </p>
            <p className="mt-6 max-w-xs text-sm text-muted leading-relaxed">
              {t.footer.about}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://instagram.com/brotherhood.cali"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-muted hover:text-white transition-colors"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-muted hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">@brotherhood.cali</p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <p className="font-display text-lg tracking-wide text-white mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Brother Hood. {t.footer.rights}
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted/60">
            {t.footer.bigger}
          </p>
        </div>
      </div>
    </footer>
  );
}

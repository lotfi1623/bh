import type { Metadata } from "next";
import { Bebas_Neue, Inter, Noto_Sans_Arabic } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brother Hood | Vêtements Calisthénie Premium",
    template: "%s | Brother Hood",
  },
  description:
    "Vêtements calisthénie et streetwear premium. Discipline · Force · Fraternité. Tees heavyweight, hoodies et gear d'entraînement. EST. 2024. Livraison en Algérie.",
  keywords: [
    "Brother Hood",
    "calisthénie",
    "streetwear",
    "vêtements fitness",
    "Algérie",
    "tee heavyweight",
  ],
  openGraph: {
    title: "Brother Hood | Vêtements Calisthénie Premium",
    description:
      "On ne suit pas — on construit. Apparel heavyweight premium pour la Brotherhood.",
    type: "website",
    locale: "fr_DZ",
    siteName: "Brother Hood",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/images/logo-bh.png",
    apple: "/images/logo-bh.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bebas.variable} ${inter.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

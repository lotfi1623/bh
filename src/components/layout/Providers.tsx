"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SplashScreen, useSplash } from "@/components/layout/SplashScreen";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";

function StoreShell({ children }: { children: React.ReactNode }) {
  const { showSplash, complete, ready } = useSplash();

  const handleComplete = useCallback(() => {
    complete();
  }, [complete]);

  if (!ready) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleComplete} />}
      <div
        className={
          showSplash
            ? "opacity-0 pointer-events-none"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return <StoreShell>{children}</StoreShell>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <AppShell>{children}</AppShell>
      </CartProvider>
    </LanguageProvider>
  );
}

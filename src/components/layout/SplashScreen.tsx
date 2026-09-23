"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BrotherHoodLogo,
  type LogoPhase,
} from "@/components/splash/BrotherHoodLogo";
import {
  SplashParticles,
  SplashSmoke,
} from "@/components/splash/SplashAtmosphere";

const STORAGE_KEY = "bh-splash-seen";

type SplashScreenProps = {
  onComplete: () => void;
};

/**
 * Timeline (ms):
 * 0      — black
 * 0–700  — BH enter (opacity + scale)
 * 600    — split starts (B / H nudge)
 * 750    — expand ROTHER / OOD
 * 1700   — brush underline center-out
 * 2700   — hold + stronger glow
 * 3700   — fade out
 * 4400   — navigate /dashboard
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<LogoPhase>("enter");

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    onComplete();
    router.push("/");
  }, [onComplete, router]);

  useEffect(() => {
    // Preload logo artwork for seamless animation
    const a = new window.Image();
    const b = new window.Image();
    a.src = "/images/logo-bh.png";
    b.src = "/images/logo-full.png";

    const timers = [
      setTimeout(() => setPhase("split"), 600),
      setTimeout(() => setPhase("expand"), 750),
      setTimeout(() => setPhase("underline"), 1700),
      setTimeout(() => setPhase("hold"), 2700),
      setTimeout(() => setPhase("out"), 3700),
      setTimeout(() => finish(), 4400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [finish]);

  const atmosphereOn = phase !== "out";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#050505]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "out" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="presentation"
      aria-label="Brother Hood"
    >
      <SplashSmoke active={atmosphereOn} />
      <SplashParticles active={atmosphereOn} />

      <div className="relative z-10 flex w-full items-center justify-center">
        <BrotherHoodLogo phase={phase} />
      </div>
    </motion.div>
  );
}

export function useSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        setShowSplash(false);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const complete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return { showSplash: ready && showSplash, complete, ready };
}

"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

/** Soft floating dust particles — GPU-friendly, non-interactive */
export function SplashParticles({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1 + (i % 3),
        duration: 8 + (i % 7),
        delay: (i % 10) * 0.35,
        drift: 12 + (i % 20),
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={
            active
              ? {
                  opacity: [0, 0.35, 0.15, 0.4, 0],
                  y: [-p.drift, p.drift * 0.5, -p.drift * 0.8],
                  x: [0, p.drift * 0.3, -p.drift * 0.2],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Subtle layered smoke / haze */
export function SplashSmoke({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${55 + i * 15}%`,
            height: `${40 + i * 10}%`,
            left: `${10 + i * 18}%`,
            top: `${25 + i * 8}%`,
            background:
              i === 1
                ? "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)",
            willChange: "transform, opacity",
          }}
          animate={
            active
              ? {
                  opacity: [0.3, 0.55, 0.35],
                  x: [0, 20 - i * 8, -10, 0],
                  y: [0, -15, 8, 0],
                  scale: [1, 1.05, 0.98, 1],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

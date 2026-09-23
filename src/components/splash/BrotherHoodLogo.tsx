"use client";

import { motion } from "framer-motion";

export type LogoPhase =
  | "enter"
  | "split"
  | "expand"
  | "underline"
  | "hold"
  | "out";

type BrotherHoodLogoProps = {
  phase: LogoPhase;
};

/**
 * Source of truth = new uploaded logos (no fonts).
 * logo-full.png 946×225:
 *   BROTHER 36–558 | gap | HOOD 577–875
 * logo-bh.png 1024×741 — letters cropped above underline
 */

const W = 1024;
const H = 682;
const LETTER_H = 375;

const BROTHER_X = 104;
const BROTHER_W = 501;
const B_W = 77;

const HOOD_X = 606;
const HOOD_W = 302;
const H_W = 78;

const BH_W = 1024;
const BH_H = 741;
const BH_LETTER_H = 500; // crop brush underline out

const ease = [0.22, 1, 0.36, 1] as const;

export function BrotherHoodLogo({ phase }: BrotherHoodLogoProps) {
  const showBh = phase === "enter";
  const live = phase !== "enter";
  const expanded =
    phase === "expand" ||
    phase === "underline" ||
    phase === "hold" ||
    phase === "out";
  const showUnderline =
    phase === "underline" || phase === "hold" || phase === "out";
  const holding = phase === "hold" || phase === "out";

  const leftW = expanded ? BROTHER_W : B_W;
  const rightW = expanded ? HOOD_W : H_W;

  const leftX = expanded ? BROTHER_X : 428.5;
  const rightX = expanded ? HOOD_X : 517.5;

  return (
    <div className="relative w-full max-w-[720px] px-4">
      {/* Soft glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)",
          willChange: "opacity, transform",
        }}
        animate={{
          opacity: showBh ? 0.4 : holding ? 0.85 : 0.55,
          scale: holding ? 1.12 : 1,
        }}
        transition={{ duration: 0.9, ease }}
      />

      {/* STEP 1 — BH only (underline cropped) */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: showBh ? 1 : 0, scale: showBh ? 1 : 1.05 }}
        transition={{ duration: 0.65, ease }}
        style={{ willChange: "opacity, transform", pointerEvents: "none" }}
      >
        <svg
          viewBox={`0 0 ${BH_W} ${BH_LETTER_H}`}
          className="w-[min(52vw,280px)]"
          role="img"
          aria-label="BH"
        >
          <defs>
            <clipPath id="bh-no-underline">
              <rect x="0" y="0" width={BH_W} height={BH_LETTER_H} />
            </clipPath>
          </defs>
          <image
            href="/images/logo-bh.png"
            width={BH_W}
            height={BH_H}
            clipPath="url(#bh-no-underline)"
            preserveAspectRatio="xMidYMin slice"
          />
        </svg>
      </motion.div>

      {/* STEPS 2–5 — full BROTHER HOOD artwork */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: live ? 1 : 0 }}
        transition={{ duration: 0.4, ease }}
        style={{ willChange: "opacity" }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Brother Hood"
        >
          <defs>
            <clipPath id="clip-left-grow">
              <motion.rect
                x={0}
                y={0}
                height={LETTER_H}
                initial={false}
                animate={{ width: leftW }}
                transition={{ duration: 0.85, ease }}
              />
            </clipPath>
            <clipPath id="clip-right-grow">
              <motion.rect
                x={0}
                y={0}
                height={LETTER_H}
                initial={false}
                animate={{ width: rightW }}
                transition={{ duration: 0.85, ease }}
              />
            </clipPath>
            <clipPath id="clip-ul-band">
              <rect
                x="0"
                y={LETTER_H - 10}
                width={W}
                height={H - LETTER_H + 14}
              />
            </clipPath>
            <mask id="mask-ul-left-to-right">
              <motion.rect
                x={0}
                y={0}
                height={H}
                fill="#ffffff"
                initial={{ width: 0 }}
                animate={showUnderline ? { width: W } : { width: 0 }}
                transition={{ duration: 0.95, ease }}
              />
            </mask>
          </defs>

          {/* B → BROTHER */}
          <motion.g
            initial={false}
            animate={{ x: leftX }}
            transition={{ duration: 0.85, ease }}
            style={{ willChange: "transform" }}
          >
            <g clipPath="url(#clip-left-grow)">
              <image
                href="/images/logo-full.png"
                x={-BROTHER_X}
                y={0}
                width={W}
                height={H}
              />
            </g>
          </motion.g>

          {/* H → HOOD */}
          <motion.g
            initial={false}
            animate={{ x: rightX }}
            transition={{ duration: 0.85, ease }}
            style={{ willChange: "transform" }}
          >
            <g clipPath="url(#clip-right-grow)">
              <image
                href="/images/logo-full.png"
                x={-HOOD_X}
                y={0}
                width={W}
                height={H}
              />
            </g>
          </motion.g>

          {/* Brush underline — left → right reveal */}
          <g clipPath="url(#clip-ul-band)" mask="url(#mask-ul-left-to-right)">
            <image href="/images/logo-full.png" x={0} y={0} width={W} height={H} />
          </g>
        </svg>
      </motion.div>

      {holding && <span className="sr-only">Brother Hood</span>}
    </div>
  );
}

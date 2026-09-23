"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  sparkline: number[];
  sparkColor: string;
  delay?: number;
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.9}
      />
    </svg>
  );
}

export function KpiCard({
  title,
  value,
  change,
  changePositive = true,
  sparkline,
  sparkColor,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-white/8 bg-[#111111] p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted tracking-wide">{title}</p>
        <MiniSparkline data={sparkline} color={sparkColor} />
      </div>
      <p className="mt-3 font-display text-2xl md:text-3xl tracking-wide text-white">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-xs font-medium",
            changePositive ? "text-emerald-400" : "text-red-400"
          )}
        >
          <TrendingUp className="h-3 w-3" />
          {change}
        </p>
      )}
    </motion.div>
  );
}

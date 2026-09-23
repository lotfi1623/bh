"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: string;
};

export function Accordion({ items, className, defaultOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className={cn("divide-y divide-white/8 border-y border-white/8", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-white"
              aria-expanded={isOpen}
            >
              <span className="font-display text-xl md:text-2xl tracking-wide text-white">
                {item.title}
              </span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm leading-relaxed text-muted">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

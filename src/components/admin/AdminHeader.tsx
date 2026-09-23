"use client";

import Image from "next/image";
import { Bell, Menu, Search } from "lucide-react";

type AdminHeaderProps = {
  title: string;
  onMenuClick: () => void;
};

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#050505]/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 text-muted hover:text-white lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="font-display text-xl tracking-wide text-white md:text-2xl">
          {title}
        </h1>

        <div className="ml-auto flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/8 bg-[#111111] px-3 py-2 w-56 lg:w-72">
            <Search className="h-4 w-4 text-muted shrink-0" />
            <input
              type="search"
              placeholder="Rechercher…"
              className="w-full bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
            />
            <kbd className="hidden lg:inline text-[10px] text-muted border border-white/10 rounded px-1.5 py-0.5">
              Ctrl K
            </kbd>
          </div>

          <button
            type="button"
            className="relative p-2 text-muted hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/8">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/10 border border-white/10">
              <Image
                src="/images/team-3.jpg"
                alt="Admin"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-sm text-white font-medium">Admin</p>
              <p className="text-[11px] text-muted">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

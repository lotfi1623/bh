"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

type AdminShellProps = {
  title: string;
  children: ReactNode;
};

export function AdminShell({ title, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

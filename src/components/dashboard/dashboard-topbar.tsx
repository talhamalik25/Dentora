import { Menu, LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";
import { clinicConfig } from "@/config/clinic.config";
import type { StaffUser } from "./dashboard-sidebar";

interface DashboardTopbarProps {
  currentUser: StaffUser;
  title: string;
  onOpenMobile: () => void;
  onLogout: () => void;
}

export function DashboardTopbar({
  currentUser,
  title,
  onOpenMobile,
  onLogout,
}: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-white/95 px-4 sm:px-6 backdrop-blur-xs shadow-xs">
      {/* Left side: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          className="grid size-9 place-items-center rounded-lg border border-border text-black hover:bg-ice transition-colors lg:hidden cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-black sm:text-base">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Clinic Hub
            </span>
          </div>
          <p className="text-[10px] text-muted hidden md:block">
            {clinicConfig.identity.name} Management System
          </p>
        </div>
      </div>

      {/* Right side: Quick Links, Staff Context & Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to client-facing booking page */}
        <Link
          href="/book"
          target="_blank"
          rel="noopener noreferrer"
          title="Open patient booking portal in new tab"
          className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-ice transition-colors"
        >
          <span>Patient Portal</span>
          <ExternalLink size={12} className="text-muted" />
        </Link>

        {/* Staff badge */}
        <div className="hidden sm:flex items-center gap-2 border-l border-border pl-3">
          <div className="text-right">
            <p className="text-xs font-bold text-black leading-tight">
              {currentUser.name}
            </p>
            <span className="inline-block rounded-full bg-ice px-2 py-0.2 text-[9px] font-bold text-brand uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sign out"
          title="Sign out of clinic workspace"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

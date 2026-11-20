"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCheck,
  Clock,
  Stethoscope,
  BarChart3,
  Settings,
  LogOut,
  X,
  Shield,
} from "lucide-react";
import { clinicConfig } from "@/config/clinic.config";

export interface StaffUser {
  email: string;
  name: string;
  role: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: ReactNode;
  active?: boolean;
  upcoming?: boolean;
  onClick?: () => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  currentUser: StaffUser;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function DashboardSidebar({
  currentUser,
  onLogout,
  mobileOpen,
  onCloseMobile,
  activeTab = "overview",
  onTabChange,
}: DashboardSidebarProps) {
  // Close mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) {
        onCloseMobile();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navGroups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          active: activeTab === "overview",
          onClick: () => {
            onTabChange?.("overview");
            onCloseMobile();
          },
        },
      ],
    },
    {
      title: "Clinic Operations",
      items: [
        {
          label: "Appointments",
          icon: <CalendarDays size={18} />,
          active: activeTab === "appointments",
          onClick: () => {
            onTabChange?.("appointments");
            onCloseMobile();
          },
        },
        {
          label: "Patients",
          icon: <Users size={18} />,
          upcoming: true,
        },
        {
          label: "Dentists",
          icon: <UserCheck size={18} />,
          upcoming: true,
        },
        {
          label: "Schedules",
          icon: <Clock size={18} />,
          upcoming: true,
        },
        {
          label: "Services",
          icon: <Stethoscope size={18} />,
          upcoming: true,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Reports",
          icon: <BarChart3 size={18} />,
          upcoming: true,
        },
        {
          label: "Settings",
          icon: <Settings size={18} />,
          upcoming: true,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-black">
      {/* Top Header / Branding */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-black hover:opacity-85 transition-opacity"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-brand text-white shadow-xs">
              <Shield size={16} />
            </div>
            <span>
              {clinicConfig.identity.name.toLowerCase()}
              <span className="text-brand">.</span>
            </span>
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation sidebar"
            className="grid size-8 place-items-center rounded-full text-muted hover:bg-ice hover:text-black transition-colors lg:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-6 px-3 py-6" aria-label="Sidebar Navigation">
          {navGroups.map((group) => (
            <div key={group.title}>
              <span className="block px-3 text-[10px] font-bold uppercase tracking-widest text-muted/80 mb-2">
                {group.title}
              </span>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.upcoming ? (
                      <div
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed select-none"
                        aria-disabled="true"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-slate-300">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                          Soon
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                          item.active
                            ? "bg-brand text-white shadow-xs"
                            : "text-slate-700 hover:bg-ice hover:text-black"
                        }`}
                      >
                        <span className={item.active ? "text-white" : "text-brand"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile & Logout Footer */}
      <div className="border-t border-border p-4 bg-slate-50/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ice text-xs font-bold text-brand uppercase border border-brand/20">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("") || "AD"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-black leading-tight">
                {currentUser.name}
              </p>
              <p className="truncate text-[10px] font-medium text-muted capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Sign out of clinic workspace"
            aria-label="Sign out"
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-white text-muted hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border min-h-screen sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Accessible overlay & slide-in) */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Clinic Navigation"
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Drawer Panel */}
          <div className="relative flex h-full w-4/5 max-w-xs flex-1 flex-col bg-white shadow-2xl transition-transform duration-200 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

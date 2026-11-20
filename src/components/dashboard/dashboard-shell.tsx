"use client";

import { useState, type ReactNode } from "react";
import { DashboardSidebar, type StaffUser } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

interface DashboardShellProps {
  currentUser: StaffUser;
  onLogout: () => void;
  title?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: ReactNode;
}

export function DashboardShell({
  currentUser,
  onLogout,
  title = "Clinic Overview",
  activeTab = "overview",
  onTabChange,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-black">
      {/* Sidebar (Desktop persistent + Mobile accessible drawer) */}
      <DashboardSidebar
        currentUser={currentUser}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar
          currentUser={currentUser}
          title={title}
          onOpenMobile={() => setMobileOpen(true)}
          onLogout={onLogout}
        />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}

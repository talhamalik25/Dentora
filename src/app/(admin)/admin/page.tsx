"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CalendarDays,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinicConfig } from "@/config/clinic.config";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AppointmentActivity } from "@/components/dashboard/appointment-activity";
import {
  AppointmentPreview,
  type AppointmentRecord,
} from "@/components/dashboard/appointment-preview";
import type { StaffUser } from "@/components/dashboard/dashboard-sidebar";

export default function AdminWorkspacePage() {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("overview");

  // Login form state
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Check auth session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCurrentUser(json.data);
        }
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  // Fetch appointments
  useEffect(() => {
    let active = true;
    if (!currentUser) return;

    const url = `/api/admin/appointments?status=${statusFilter}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (active) {
          if (json.success && json.data) {
            setAppointments(json.data);
          } else {
            setAppointments([]);
          }
          setLoadingAppts(false);
        }
      })
      .catch(() => {
        if (active) {
          setAppointments([]);
          setLoadingAppts(false);
        }
      });

    return () => {
      active = false;
    };
  }, [currentUser, statusFilter]);

  // Manual refresh handler
  const loadAppointments = useCallback(() => {
    if (!currentUser) return;
    setLoadingAppts(true);
    const url = `/api/admin/appointments?status=${statusFilter}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setAppointments(json.data);
        }
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoadingAppts(false));
  }, [currentUser, statusFilter]);

  // Handle Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setCurrentUser(json.data);
      } else {
        setLoginError(json.error || "Invalid credentials.");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  // Handle Logout
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
  }

  // Handle Status Update
  async function handleStatusChange(
    id: string,
    newStatus: "completed" | "no-show" | "cancelled"
  ) {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } finally {
      setActionLoadingId(null);
    }
  }

  const [greeting, setGreeting] = useState("Welcome");
  const [todayUtc, setTodayUtc] = useState("");

  // Defer date reads into client effect to comply with Next.js 16 prerender rules
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setTodayUtc(new Date().toISOString().split("T")[0]);
  }, []);

  // Compute KPIs from real backend appointments data
  const metrics = useMemo(() => {
    const todayCount = appointments.filter((a) => {
      return todayUtc ? a.startsAtUtc.split("T")[0] === todayUtc && a.status !== "cancelled" : false;
    }).length;

    const upcomingCount = appointments.filter((a) => a.status === "confirmed").length;
    const completedCount = appointments.filter((a) => a.status === "completed").length;
    const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;

    return {
      todayCount,
      upcomingCount,
      completedCount,
      cancelledCount,
    };
  }, [appointments, todayUtc]);

  // Loading initial user session
  if (loadingUser) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-muted">
          <Clock size={16} className="animate-spin text-brand" />
          <span>Verifying clinic workspace credentials...</span>
        </div>
      </main>
    );
  }

  // ── VIEW 1: Unauthenticated Staff Login ──
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-md rounded-[var(--radius-panel)] border border-border bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 text-brand">
            <ShieldCheck size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Staff Portal
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-black">
            {clinicConfig.identity.name} Workspace
          </h1>
          <p className="mt-1 text-xs text-muted">
            Sign in with authorized receptionist, dentist, or clinic administrator credentials.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="rounded-[var(--radius-card)] border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label
                htmlFor="staff-email"
                className="block text-xs font-semibold text-black uppercase tracking-wider"
              >
                Staff Email
              </label>
              <input
                id="staff-email"
                type="email"
                required
                placeholder="staff@dentora.example"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="mt-1.5 w-full rounded-[var(--radius-card)] border border-border px-4 py-2.5 text-xs text-black placeholder:text-muted focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="staff-password"
                className="block text-xs font-semibold text-black uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="staff-password"
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="mt-1.5 w-full rounded-[var(--radius-card)] border border-border px-4 py-2.5 text-xs text-black placeholder:text-muted focus:border-brand focus:outline-none transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={loggingIn}
              className="w-full mt-2"
            >
              {loggingIn ? "Verifying Credentials..." : "Access Workspace"}
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-4 text-center">
            <Link
              href="/"
              className="text-[11px] font-medium text-muted hover:text-black transition-colors"
            >
              &larr; Return to {clinicConfig.identity.name} Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── VIEW 2: Authenticated Dashboard Shell ──
  return (
    <DashboardShell
      currentUser={currentUser}
      onLogout={handleLogout}
      title={activeTab === "appointments" ? "Clinic Appointments" : "Clinic Overview"}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* ── Welcome Area ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-panel)] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-ice px-3 py-1 text-[11px] font-semibold text-brand mb-2">
            <Sparkles size={13} />
            <span>Operational Workspace</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            {greeting}, {currentUser.name.split(" ")[0]}
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Here&apos;s what&apos;s happening at your clinic today across schedules and appointments.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
          <Link
            href="/book"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-hover transition-colors shadow-xs"
          >
            <PlusCircle size={14} />
            <span>Book Patient Visit</span>
          </Link>
          <button
            type="button"
            onClick={loadAppointments}
            title="Refresh appointments"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-semibold text-black hover:bg-ice transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={loadingAppts ? "animate-spin text-brand" : ""} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── KPI Metrics Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Today's Appointments"
          value={metrics.todayCount}
          scope="Scheduled for current clinic date (UTC)"
          icon={<Clock size={18} />}
          iconVariant="brand"
          loading={loadingAppts}
        />

        <MetricCard
          label="Upcoming Appointments"
          value={metrics.upcomingCount}
          scope="Confirmed and active in roster"
          icon={<CalendarDays size={18} />}
          iconVariant="brand"
          loading={loadingAppts}
        />

        <MetricCard
          label="Completed Visits"
          value={metrics.completedCount}
          scope="Total care rendered and verified"
          icon={<CheckCircle2 size={18} />}
          iconVariant="green"
          loading={loadingAppts}
        />

        <MetricCard
          label="Cancelled Appointments"
          value={metrics.cancelledCount}
          scope="Patient or administrative cancellations"
          icon={<XCircle size={18} />}
          iconVariant="rose"
          loading={loadingAppts}
        />
      </div>

      {/* ── Analytics & Activity Row (Shown on Overview tab) ── */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AppointmentActivity
              appointments={appointments}
              loading={loadingAppts}
            />
          </div>

          {/* Quick Clinic Operations Card */}
          <div className="rounded-[var(--radius-panel)] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Clinic Configuration
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Primary Timezone:</span>
                  <span className="font-mono font-semibold text-black">
                    {clinicConfig.scheduling.timezone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Slot Discretization:</span>
                  <span className="font-mono font-semibold text-black">
                    {clinicConfig.scheduling.slotIntervalMinutes} mins
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Advance Booking:</span>
                  <span className="font-semibold text-black">
                    {clinicConfig.scheduling.bookingMaxDaysAhead} days max
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Cancellation Notice:</span>
                  <span className="font-semibold text-black">
                    {clinicConfig.scheduling.cancellationCutoffHours}h cutoff
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Reschedule Allowance:</span>
                  <span className="font-semibold text-black">
                    {clinicConfig.scheduling.maxPatientReschedules} max per visit
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <Button
                variant="secondary"
                onClick={() => setActiveTab("appointments")}
                className="w-full text-xs min-h-[40px]"
              >
                <CalendarCheck2 size={14} className="mr-2" />
                View Full Appointment Roster
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Appointment Roster & Management Table ── */}
      <AppointmentPreview
        appointments={appointments}
        loading={loadingAppts}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onRefresh={loadAppointments}
        onStatusChange={handleStatusChange}
        actionLoadingId={actionLoadingId}
      />
    </DashboardShell>
  );
}

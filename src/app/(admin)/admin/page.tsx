"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw,
  Search,
} from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { clinicConfig } from "@/config/clinic.config";

interface StaffUser {
  email: string;
  name: string;
  role: string;
}

interface AppointmentRecord {
  id: string;
  reference: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  dentistName: string;
  serviceName: string;
  startsAtUtc: string;
  endsAtUtc: string;
  status: "confirmed" | "completed" | "no-show" | "cancelled";
  createdAt: string;
}

export default function AdminWorkspacePage() {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Login form state
  const [emailInput, setEmailInput] = useState("admin@dentora.example");
  const [passwordInput, setPasswordInput] = useState("admin123");
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
  async function handleStatusChange(id: string, newStatus: "completed" | "no-show" | "cancelled") {
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

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-ice flex items-center justify-center p-6">
        <div className="text-sm font-medium text-muted">Checking clinic workspace credentials...</div>
      </main>
    );
  }

  // ── VIEW 1: Staff Login ──
  if (!currentUser) {
    return (
      <main className="min-h-[85vh] bg-ice flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-md rounded-[var(--radius-panel)] border border-border bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2.5 text-brand">
            <ShieldCheck size={26} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Staff Workspace
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-black">
            {clinicConfig.identity.name} Dashboard
          </h1>
          <p className="mt-1 text-xs text-muted">
            Sign in with authorized receptionist or clinic admin credentials.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="rounded-[var(--radius-card)] bg-red-50 p-3 text-xs text-red-700">
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="staff-email" className="block text-xs font-semibold text-black">
                Staff Email
              </label>
              <input
                id="staff-email"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="mt-1 w-full rounded-[var(--radius-card)] border border-border px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="staff-password" className="block text-xs font-semibold text-black">
                Password
              </label>
              <input
                id="staff-password"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="mt-1 w-full rounded-[var(--radius-card)] border border-border px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <Button type="submit" disabled={loggingIn} className="w-full">
              {loggingIn ? "Signing in..." : "Sign In to Workspace"}
            </Button>

            <div className="rounded-[var(--radius-card)] border border-brand/20 bg-ice p-3 text-[11px] text-on-ice">
              <strong>Evaluation Credentials:</strong>
              <div className="mt-1 font-mono">
                Email: <code>admin@dentora.example</code>
                <br />
                Password: <code>admin123</code>
              </div>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // Filtered list
  const filteredList = appointments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.reference.toLowerCase().includes(q) ||
      a.patientName.toLowerCase().includes(q) ||
      a.dentistName.toLowerCase().includes(q) ||
      a.serviceName.toLowerCase().includes(q)
    );
  });

  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;

  // ── VIEW 2: Authenticated Clinic Dashboard ──
  return (
    <main className="min-h-screen bg-ice/40 pb-24">
      {/* ── Top Workspace Bar ── */}
      <header className="border-b border-border bg-white sticky top-0 z-30 shadow-xs">
        <SiteContainer className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight text-black">
              {clinicConfig.identity.name}
            </span>
            <span className="rounded-full bg-ice px-2.5 py-0.5 text-[11px] font-semibold text-brand">
              Clinic Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-black">{currentUser.name}</p>
              <p className="text-[10px] text-muted capitalize">{currentUser.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-black hover:bg-ice transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </SiteContainer>
      </header>

      <SiteContainer className="mt-8 space-y-8">
        {/* ── KPI Blocks ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[var(--radius-panel)] border border-border bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
              <Users size={18} className="text-brand" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-black tabular-nums">{totalCount}</p>
          </div>

          <div className="rounded-[var(--radius-panel)] border border-border bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">Upcoming / Active</span>
              <Calendar size={18} className="text-brand" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-brand tabular-nums">{confirmedCount}</p>
          </div>

          <div className="rounded-[var(--radius-panel)] border border-border bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Care</span>
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-green-700 tabular-nums">{completedCount}</p>
          </div>

          <div className="rounded-[var(--radius-panel)] border border-border bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted">
              <span className="text-xs font-semibold uppercase tracking-wider">Cancelled</span>
              <XCircle size={18} className="text-rose-500" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-rose-600 tabular-nums">{cancelledCount}</p>
          </div>
        </div>

        {/* ── Management Table Section ── */}
        <div className="rounded-[var(--radius-panel)] border border-border bg-white p-6 shadow-sm">
          {/* Controls Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-black">Appointments Roster</h2>
              <p className="text-xs text-muted">Manage patient bookings, mark completions, or process schedule changes.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Tabs */}
              <div className="flex rounded-full bg-ice p-1 text-xs">
                {["all", "confirmed", "completed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-full px-3 py-1 font-semibold capitalize transition-colors cursor-pointer ${
                      statusFilter === st ? "bg-brand text-white shadow-xs" : "text-on-ice hover:text-black"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={loadAppointments}
                aria-label="Refresh appointments"
                className="grid size-8 place-items-center rounded-full border border-border text-black hover:bg-ice transition-colors cursor-pointer"
              >
                <RefreshCw size={14} className={loadingAppts ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-5 relative max-w-sm">
            <Search size={16} className="absolute left-3 top-3 text-muted" />
            <input
              type="text"
              placeholder="Search reference, patient, dentist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border pl-9 pr-4 py-2 text-xs focus:border-brand focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="mt-6 overflow-x-auto">
            {loadingAppts ? (
              <div className="py-12 text-center text-sm text-muted">Loading clinic appointments...</div>
            ) : filteredList.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted">
                No appointment records matching your criteria.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Reference</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Treatment</th>
                    <th className="py-3 px-3">Specialist</th>
                    <th className="py-3 px-3">Schedule (UTC)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-ice/30 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-brand">
                        {item.reference}
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-black">{item.patientName}</p>
                        <p className="text-[11px] text-muted">{item.patientEmail}</p>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-black">
                        {item.serviceName}
                      </td>
                      <td className="py-3.5 px-3 text-muted">
                        {item.dentistName}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <p className="font-medium text-black">
                          {new Date(item.startsAtUtc).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[11px] text-muted">
                          {new Date(item.startsAtUtc).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                            item.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : item.status === "cancelled"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {item.status === "confirmed" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              disabled={actionLoadingId === item.id}
                              onClick={() => handleStatusChange(item.id, "completed")}
                              className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === item.id}
                              onClick={() => handleStatusChange(item.id, "cancelled")}
                              className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        {item.status !== "confirmed" && (
                          <span className="text-[10px] text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </SiteContainer>
    </main>
  );
}

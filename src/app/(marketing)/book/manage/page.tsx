"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

interface AppointmentData {
  id: string;
  reference: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show";
  startsAtUtc: string;
  endsAtUtc: string;
  serviceId: string;
  serviceName: string;
  dentistId: string;
  dentistName: string;
  patientName: string;
  patientEmail: string;
  rescheduleCount: number;
  maxReschedules: number;
  reschedulesRemaining: number;
  cutoffHours: number;
  hoursRemaining: number;
  canCancel: boolean;
  canReschedule: boolean;
  cancellationReason?: string;
}

interface Slot {
  dentistId: string;
  dentistName: string;
  serviceId: string;
  startsAtUtc: string;
  displayTime: string;
  durationMinutes: number;
}

function AppointmentManageContent() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref") || "";
  const urlToken = searchParams.get("token") || "";

  // Lookup form state
  const [referenceInput, setReferenceInput] = useState(urlRef);
  const [emailInput, setEmailInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Active session
  const [token, setToken] = useState<string>(urlToken);
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loadingAppt, setLoadingAppt] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Reschedule UI state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reschedulingLoading, setReschedulingLoading] = useState(false);

  // Cancel UI state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("Change of plans");
  const [cancellingLoading, setCancellingLoading] = useState(false);

  // Load appointment details when token is available
  useEffect(() => {
    if (!token) return;

    let active = true;
    async function fetchAppointment() {
      setLoadingAppt(true);
      setActionError(null);
      try {
        const res = await fetch(`/api/appointments/manage?token=${encodeURIComponent(token)}${urlRef ? `&ref=${encodeURIComponent(urlRef)}` : ""}`);
        const data = await res.json();
        if (active) {
          if (data.success) {
            setAppointment(data.data);
          } else {
            setActionError(data.error || "Failed to load appointment details.");
            setAppointment(null);
          }
        }
      } catch {
        if (active) {
          setActionError("Network error. Unable to load appointment details.");
        }
      } finally {
        if (active) setLoadingAppt(false);
      }
    }

    void fetchAppointment();

    return () => {
      active = false;
    };
  }, [token, urlRef]);

  // Request token by reference + email
  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch("/api/appointments/manage/request-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: referenceInput, email: emailInput }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
      } else {
        setLookupError(data.error || "No matching appointment found.");
      }
    } catch {
      setLookupError("Network error. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  // Fetch slots for reschedule date
  const handleDateChange = async (dateStr: string) => {
    setRescheduleDate(dateStr);
    setSelectedSlot(null);
    if (!dateStr || !appointment) return;

    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/availability?date=${dateStr}&serviceId=${appointment.serviceId}&dentistId=${appointment.dentistId}`);
      const data = await res.json();
      if (data.success) {
        setAvailableSlots(data.data || []);
      } else {
        setAvailableSlots([]);
      }
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Confirm Reschedule
  const handleConfirmReschedule = async () => {
    if (!selectedSlot || !token) return;
    setReschedulingLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch("/api/appointments/manage/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newStartsAtUtc: selectedSlot.startsAtUtc,
          newDentistId: selectedSlot.dentistId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess("Appointment successfully rescheduled!");
        setIsRescheduling(false);
        // Refresh appointment data
        setAppointment((prev) =>
          prev
            ? {
                ...prev,
                startsAtUtc: data.data.startsAtUtc,
                endsAtUtc: data.data.endsAtUtc,
                rescheduleCount: data.data.rescheduleCount,
                reschedulesRemaining: data.data.reschedulesRemaining,
                canReschedule: data.data.reschedulesRemaining > 0,
              }
            : null
        );
      } else {
        setActionError(data.error || "Failed to reschedule appointment.");
      }
    } catch {
      setActionError("Network error during reschedule. Your original appointment was not changed.");
    } finally {
      setReschedulingLoading(false);
    }
  };

  // Confirm Cancel
  const handleConfirmCancel = async () => {
    if (!token) return;
    setCancellingLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch("/api/appointments/manage/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          reason: cancelReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess("Your appointment has been cancelled successfully.");
        setIsCancelling(false);
        setAppointment((prev) =>
          prev ? { ...prev, status: "cancelled", canCancel: false, canReschedule: false } : null
        );
      } else {
        setActionError(data.error || "Failed to cancel appointment.");
      }
    } catch {
      setActionError("Network error during cancellation. Please contact the clinic.");
    } finally {
      setCancellingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-24 text-slate-100">
      <SiteContainer>
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Patient Self-Service Portal
            </div>
            <h1 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl">
              Manage Your Appointment
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              View your booking details, reschedule your visit, or cancel within our clinical notice window.
            </p>
          </div>

          {/* Feedback messages */}
          {actionSuccess && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-4 text-emerald-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
              <p className="text-sm">{actionSuccess}</p>
            </div>
          )}

          {actionError && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-950/30 p-4 text-rose-200">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
              <p className="text-sm">{actionError}</p>
            </div>
          )}

          {/* View 1: Lookup Form when no token or invalid */}
          {!token || (!appointment && !loadingAppt) ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm shadow-xl">
              <h2 className="font-serif text-xl text-white font-medium mb-2">Find Your Booking</h2>
              <p className="text-xs text-slate-400 mb-6">
                Enter your booking reference code (found on your confirmation receipt) and the email address used during booking.
              </p>

              {lookupError && (
                <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                  {lookupError}
                </div>
              )}

              <form onSubmit={handleLookupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Booking Reference
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DNT-XXXXXX"
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Patient Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400 transition-colors py-3 mt-2"
                >
                  {lookupLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    "Access Appointment"
                  )}
                </Button>
              </form>
            </div>
          ) : loadingAppt ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-slate-800 bg-slate-900/40">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mb-3" />
              <p className="text-sm text-slate-400">Loading your verified appointment details...</p>
            </div>
          ) : appointment ? (
            /* View 2: Appointment Details & Actions */
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm shadow-xl">
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Reference Code
                    </span>
                    <div className="font-mono text-2xl font-bold text-white tracking-widest mt-0.5">
                      {appointment.reference}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                        appointment.status === "confirmed"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : appointment.status === "cancelled"
                          ? "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {appointment.status === "confirmed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {appointment.status === "cancelled" && <XCircle className="h-3.5 w-3.5" />}
                      {appointment.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Procedure
                    </span>
                    <p className="text-base font-medium text-white mt-1">{appointment.serviceName}</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Dental Specialist
                    </span>
                    <p className="text-base font-medium text-white mt-1">{appointment.dentistName}</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Scheduled Date & Time (UTC)
                    </span>
                    <div className="flex items-center gap-2 text-emerald-400 mt-1 font-medium">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{new Date(appointment.startsAtUtc).toUTCString()}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Patient
                    </span>
                    <p className="text-base font-medium text-white mt-1">{appointment.patientName}</p>
                    <p className="text-xs text-slate-400">{appointment.patientEmail}</p>
                  </div>
                </div>

                {/* Policy Notice Box */}
                <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                    <div className="text-xs text-slate-300 space-y-1">
                      <p className="font-semibold text-slate-200">
                        12-Hour Cancellation & Rescheduling Clinical Policy
                      </p>
                      <p className="text-slate-400 leading-relaxed">
                        To maintain clinical hygiene standards and respect scheduled surgical suites, online changes require at least 12 hours advance notice.
                        {appointment.hoursRemaining > 0 && (
                          <span className="text-amber-300 ml-1">
                            ({appointment.hoursRemaining} hours remaining until policy cutoff).
                          </span>
                        )}
                      </p>
                      <p className="text-slate-400">
                        Reschedules allowed:{" "}
                        <strong className="text-white">{appointment.reschedulesRemaining}</strong> of {appointment.maxReschedules} remaining.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {appointment.status === "confirmed" && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    {appointment.canReschedule ? (
                      <Button
                        onClick={() => {
                          setIsRescheduling(!isRescheduling);
                          setIsCancelling(false);
                          // Set min date helper on click
                          const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
                          setMinDate(tomorrow.toISOString().split("T")[0]);
                        }}
                        className="flex-1 bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {isRescheduling ? "Close Reschedule Panel" : "Reschedule Appointment"}
                      </Button>
                    ) : (
                      <div className="flex-1 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-center text-xs text-slate-500">
                        Online rescheduling disabled ({appointment.reschedulesRemaining === 0 ? "max 2 reschedules reached" : "under 12-hour window"})
                      </div>
                    )}

                    {appointment.canCancel ? (
                      <Button
                        onClick={() => {
                          setIsCancelling(!isCancelling);
                          setIsRescheduling(false);
                        }}
                        variant="secondary"
                        className="border-rose-900/50 text-rose-300 hover:bg-rose-950/40 hover:border-rose-700"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {isCancelling ? "Close Cancel Panel" : "Cancel Appointment"}
                      </Button>
                    ) : (
                      <div className="flex-1 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-center text-xs text-slate-500">
                        Online cancellation closed (within 12h cutoff)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reschedule Drawer/Panel */}
              {isRescheduling && (
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-6 md:p-8 backdrop-blur-md shadow-xl">
                  <h3 className="font-serif text-lg font-medium text-white mb-2">Select a New Date & Time</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Pick a new date to query real-time available surgical suite slots. Your existing slot is held until you confirm.
                  </p>

                  <div className="mb-6">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      New Appointment Date
                    </label>
                    <input
                      type="date"
                      min={minDate}
                      value={rescheduleDate}
                      onChange={(e) => void handleDateChange(e.target.value)}
                      className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {loadingSlots ? (
                    <div className="flex items-center gap-2 py-8 text-xs text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                      Checking real-time clinic schedule...
                    </div>
                  ) : rescheduleDate && availableSlots.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">
                      No open slots available on this date. Please choose another date.
                    </p>
                  ) : (
                    availableSlots.length > 0 && (
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                          Available Slots ({availableSlots.length})
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                          {availableSlots.map((slot) => {
                            const isSelected = selectedSlot?.startsAtUtc === slot.startsAtUtc;
                            return (
                              <button
                                key={slot.startsAtUtc}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`rounded-lg border px-3 py-2 text-center text-xs font-medium transition-all ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500"
                                    : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500"
                                }`}
                              >
                                {slot.displayTime}
                              </button>
                            );
                          })}
                        </div>

                        {selectedSlot && (
                          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                            <div>
                              <p className="text-xs text-slate-400">Selected new time:</p>
                              <p className="text-sm font-semibold text-emerald-400">
                                {selectedSlot.displayTime} on {rescheduleDate}
                              </p>
                            </div>
                            <Button
                              onClick={() => void handleConfirmReschedule()}
                              disabled={reschedulingLoading}
                              className="bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400"
                            >
                              {reschedulingLoading ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" /> Confirming...
                                </span>
                              ) : (
                                "Confirm New Time"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Cancel Confirmation Panel */}
              {isCancelling && (
                <div className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-6 md:p-8 backdrop-blur-md shadow-xl">
                  <h3 className="font-serif text-lg font-medium text-rose-300 mb-2">Confirm Appointment Cancellation</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Cancelling your appointment will immediately release your reserved slot for other patients.
                  </p>

                  <div className="mb-6">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Reason for Cancellation
                    </label>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="Change of plans">Change of plans</option>
                      <option value="Scheduling conflict">Scheduling conflict</option>
                      <option value="Resolved symptomatically">Symptoms resolved</option>
                      <option value="Financial or insurance reason">Financial or insurance reason</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => void handleConfirmCancel()}
                      disabled={cancellingLoading}
                      className="bg-rose-600 text-white font-medium hover:bg-rose-500"
                    >
                      {cancellingLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                        </span>
                      ) : (
                        "Yes, Cancel Appointment"
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsCancelling(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      Keep Appointment
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation back */}
              <div className="text-center pt-4">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <CalendarDays className="h-3.5 w-3.5" /> Book Another Appointment <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </SiteContainer>
    </div>
  );
}

export default function AppointmentManagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
          Loading appointment portal...
        </div>
      }
    >
      <AppointmentManageContent />
    </Suspense>
  );
}

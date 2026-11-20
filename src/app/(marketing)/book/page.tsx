"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { demoServices } from "@/features/marketing/services";
import { demoSpecialists } from "@/features/marketing/specialists";
import { clinicConfig } from "@/config/clinic.config";

interface Slot {
  dentistId: string;
  dentistName: string;
  serviceId: string;
  startsAtUtc: string;
  displayTime: string;
  durationMinutes: number;
}

interface ConfirmationData {
  reference: string;
  status: string;
  startsAtUtc: string;
  patientName: string;
  patientEmail: string;
  manageUrl?: string;
}

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedService, setSelectedService] = useState(demoServices[0].id);
  const [selectedDentist, setSelectedDentist] = useState<string>("any");
  
  const [selectedDate, setSelectedDate] = useState("");
  const [minDate, setMinDate] = useState("");

  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  // Fetch available slots when step 3 is reached or date/dentist changes
  useEffect(() => {
    let active = true;
    if (step === 3) {
      const params = new URLSearchParams({
        date: selectedDate,
        serviceId: selectedService,
      });
      if (selectedDentist !== "any") {
        params.append("dentistId", selectedDentist);
      }

      fetch(`/api/availability?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          if (active) {
            if (json.success && json.data) {
              setAvailableSlots(json.data);
            } else {
              setAvailableSlots([]);
            }
            setLoadingSlots(false);
          }
        })
        .catch(() => {
          if (active) {
            setAvailableSlots([]);
            setLoadingSlots(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [step, selectedDate, selectedService, selectedDentist]);

  const currentServiceObj = demoServices.find((s) => s.id === selectedService);
  const currentDentistObj = demoSpecialists.find((d) => d.id === selectedDentist);

  async function handleConfirmBooking() {
    if (!selectedSlot || !patientName || !patientEmail) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          dentistId: selectedSlot.dentistId,
          startsAtUtc: selectedSlot.startsAtUtc,
          patient: {
            name: patientName,
            email: patientEmail,
            phone: patientPhone,
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setConfirmation(json.data);
        setStep(5);
      } else {
        setErrorMsg(json.error || "Failed to confirm appointment. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Stepper Header ── */}
      <section className="border-b border-border bg-ice py-14 md:py-20">
        <SiteContainer>
          <div className="flex items-center gap-3">
            <CalendarDays size={28} className="text-brand" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[2px] text-brand">
              Appointment Scheduling
            </span>
          </div>

          <h1 className="mt-4 font-sans text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-black">
            Reserve your visit.
          </h1>

          <p className="mt-2 text-sm text-on-ice max-w-xl">
            Complete the steps below to schedule care with {clinicConfig.identity.name}.
          </p>

          {/* Step Progress Indicators */}
          <div className="mt-8 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
            {[
              { num: 1, label: "Treatment" },
              { num: 2, label: "Specialist" },
              { num: 3, label: "Date & Time" },
              { num: 4, label: "Details" },
              { num: 5, label: "Confirmed" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2 shrink-0">
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                    step === s.num
                      ? "bg-brand text-white"
                      : step > s.num
                      ? "bg-black text-white"
                      : "bg-white text-muted border border-border"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </span>
                <span className={`text-xs font-medium ${step === s.num ? "text-black" : "text-muted"}`}>
                  {s.label}
                </span>
                {s.num < 5 && <span className="h-px w-4 bg-black/15" />}
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* ── Step Body ── */}
      <section className="py-16 md:py-24">
        <SiteContainer className="max-w-4xl">
          {errorMsg && (
            <div className="mb-8 rounded-[var(--radius-card)] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Select Treatment */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">
                1. Select your care category
              </h2>
              <p className="mt-2 text-sm text-muted">
                Choose the primary service you wish to schedule today.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {demoServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`cursor-pointer rounded-[var(--radius-panel)] border p-6 text-left transition-all ${
                      selectedService === service.id
                        ? "border-brand bg-ice shadow-[0_4px_20px_rgba(37,99,235,0.12)] ring-2 ring-brand"
                        : "border-border bg-white hover:border-black/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand">
                        {service.durationMinutes} mins
                      </span>
                      {selectedService === service.id && (
                        <CheckCircle2 size={18} className="text-brand" />
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-black">{service.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {service.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Next: Choose Specialist <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Specialist */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">
                2. Select your dental specialist
              </h2>
              <p className="mt-2 text-sm text-muted">
                Choose a specific dentist or pick &ldquo;Any Available&rdquo; for the earliest appointment opening.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSelectedDentist("any")}
                  className={`cursor-pointer rounded-[var(--radius-panel)] border p-6 text-left transition-all ${
                    selectedDentist === "any"
                      ? "border-brand bg-ice shadow-[0_4px_20px_rgba(37,99,235,0.12)] ring-2 ring-brand"
                      : "border-border bg-white hover:border-black/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
                      <Sparkles size={18} />
                    </span>
                    {selectedDentist === "any" && <CheckCircle2 size={18} className="text-brand" />}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-black">Any Available Specialist</h3>
                  <p className="mt-1 text-xs text-muted">
                    Assigns the earliest available provider matching your treatment.
                  </p>
                </button>

                {demoSpecialists.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDentist(doc.id)}
                    className={`cursor-pointer rounded-[var(--radius-panel)] border p-6 text-left transition-all ${
                      selectedDentist === doc.id
                        ? "border-brand bg-ice shadow-[0_4px_20px_rgba(37,99,235,0.12)] ring-2 ring-brand"
                        : "border-border bg-white hover:border-black/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-full bg-white border border-border text-black font-semibold text-sm">
                        {doc.name.substring(0, 2).toUpperCase()}
                      </span>
                      {selectedDentist === doc.id && <CheckCircle2 size={18} className="text-brand" />}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-black">{doc.name}</h3>
                    <p className="mt-0.5 text-xs font-medium text-brand">{doc.focus}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{doc.summary}</p>
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  onClick={() => {
                    const today = new Date();
                    setMinDate(today.toISOString().split("T")[0]);
                    if (!selectedDate) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setSelectedDate(tomorrow.toISOString().split("T")[0]);
                    }
                    setStep(3);
                  }}
                >
                  Next: Select Date & Time <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Date & Available Slot */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">
                3. Choose date and available slot
              </h2>
              <p className="mt-2 text-sm text-muted">
                Showing open 15-minute start times. Appointments require at least 2 hours advance notice.
              </p>

              {/* Date Input */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="booking-date" className="text-sm font-semibold text-black">
                  Select Date:
                </label>
                <input
                  id="booking-date"
                  type="date"
                  min={minDate || undefined}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="rounded-[var(--radius-card)] border border-border px-4 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>

              {/* Slots Grid */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">
                  Available Times for {selectedDate}:
                </h3>

                {loadingSlots ? (
                  <div className="py-12 text-center text-sm text-muted">
                    Checking clinical availability...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="mt-4 rounded-[var(--radius-card)] border border-border bg-ice p-8 text-center text-sm text-on-ice">
                    No open slots available for this date and provider. Please select a different date.
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.startsAtUtc === slot.startsAtUtc;
                      return (
                        <button
                          key={slot.startsAtUtc}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`cursor-pointer rounded-full border px-4 py-2.5 text-center text-xs font-semibold transition-all ${
                            isSelected
                              ? "border-brand bg-brand text-white shadow-md"
                              : "border-border bg-white text-black hover:border-brand hover:bg-ice"
                          }`}
                        >
                          {slot.displayTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="mt-8 rounded-[var(--radius-card)] border border-brand/20 bg-ice p-4 text-xs text-on-ice flex items-center gap-2">
                  <Clock size={16} className="text-brand" />
                  <span>
                    Selected: <strong>{selectedSlot.displayTime}</strong> ({selectedSlot.durationMinutes} mins) with <strong>{selectedSlot.dentistName}</strong>.
                  </span>
                </div>
              )}

              <div className="mt-10 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button disabled={!selectedSlot} onClick={() => setStep(4)}>
                  Next: Patient Details <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Information & Review */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">
                4. Patient details & confirmation
              </h2>
              <p className="mt-2 text-sm text-muted">
                Guest booking — no account or password required.
              </p>

              {/* Summary Card */}
              <div className="mt-6 rounded-[var(--radius-panel)] border border-border bg-ice p-6 text-sm">
                <h3 className="font-semibold text-black">Visit Summary</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted">Treatment:</span>{" "}
                    <strong>{currentServiceObj?.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Specialist:</span>{" "}
                    <strong>{selectedSlot?.dentistName || currentDentistObj?.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Date:</span> <strong>{selectedDate}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Time:</span>{" "}
                    <strong>{selectedSlot?.displayTime}</strong>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mt-8 space-y-4">
                <div>
                  <label htmlFor="patient-name" className="block text-xs font-semibold text-black">
                    Full Name *
                  </label>
                  <input
                    id="patient-name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="mt-1 w-full rounded-[var(--radius-card)] border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="patient-email" className="block text-xs font-semibold text-black">
                    Email Address (for appointment confirmation & management token) *
                  </label>
                  <input
                    id="patient-email"
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="mt-1 w-full rounded-[var(--radius-card)] border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="patient-phone" className="block text-xs font-semibold text-black">
                    Phone Number (optional)
                  </label>
                  <input
                    id="patient-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="mt-1 w-full rounded-[var(--radius-card)] border border-border px-4 py-3 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 text-xs text-muted">
                <ShieldCheck size={16} className="text-brand shrink-0 mt-0.5" />
                <span>
                  No online payment is required today. Payment is settled at the clinic after your appointment. Free cancellation is permitted up to 12 hours prior to your visit.
                </span>
              </div>

              <div className="mt-10 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button disabled={submitting || !patientName || !patientEmail} onClick={handleConfirmBooking}>
                  {submitting ? "Confirming..." : "Confirm My Appointment"}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Success */}
          {step === 5 && confirmation && (
            <div className="text-center py-8">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-black">
                Appointment Confirmed!
              </h2>

              <p className="mt-2 text-base text-muted">
                Thank you, <strong>{confirmation.patientName}</strong>. Your visit has been successfully registered.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-[var(--radius-panel)] border border-brand/20 bg-ice p-6 text-left shadow-sm">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <span className="text-xs uppercase tracking-wider text-muted font-semibold">
                    Booking Reference
                  </span>
                  <span className="text-lg font-bold text-brand tracking-widest font-mono">
                    {confirmation.reference}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-on-ice">
                  <p>
                    <strong>Scheduled For:</strong>{" "}
                    {new Date(confirmation.startsAtUtc).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                  <p>
                    <strong>Confirmation Sent To:</strong> {confirmation.patientEmail}
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="capitalize text-green-700 font-semibold">{confirmation.status}</span>
                  </p>
                </div>

                {confirmation.manageUrl && (
                  <div className="mt-4 border-t border-black/10 pt-3 text-center">
                    <Link
                      href={confirmation.manageUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                    >
                      Need to reschedule or cancel? Manage appointment &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  Return to Homepage
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setConfirmation(null);
                  }}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border bg-white px-7 text-sm font-semibold text-black transition-colors hover:bg-ice"
                >
                  Book Another Visit
                </button>
              </div>
            </div>
          )}
        </SiteContainer>
      </section>
    </main>
  );
}

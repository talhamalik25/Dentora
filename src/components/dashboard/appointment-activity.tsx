import { useMemo } from "react";
import { BarChart2, Activity } from "lucide-react";

interface AppointmentItem {
  id: string;
  startsAtUtc: string;
  status: "confirmed" | "completed" | "no-show" | "cancelled";
}

interface AppointmentActivityProps {
  appointments: AppointmentItem[];
  loading?: boolean;
}

export function AppointmentActivity({
  appointments,
  loading = false,
}: AppointmentActivityProps) {
  // Aggregate appointments by date (YYYY-MM-DD)
  const activityData = useMemo(() => {
    if (appointments.length === 0) return [];

    const map = new Map<string, { label: string; count: number }>();

    // Sort appointments chronologically
    const sorted = [...appointments].sort(
      (a, b) => new Date(a.startsAtUtc).getTime() - new Date(b.startsAtUtc).getTime()
    );

    for (const appt of sorted) {
      const d = new Date(appt.startsAtUtc);
      const dateKey = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const existing = map.get(dateKey) || { label, count: 0 };
      existing.count += 1;
      map.set(dateKey, existing);
    }

    // Keep up to 7 distinct dates
    return Array.from(map.entries())
      .slice(0, 7)
      .map(([key, val]) => ({ dateKey: key, ...val }));
  }, [appointments]);

  // Aggregate by status
  const statusStats = useMemo(() => {
    const total = appointments.length;
    if (total === 0) return { confirmed: 0, completed: 0, cancelled: 0, total: 0 };

    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;

    return {
      confirmed,
      completed,
      cancelled,
      total,
      confirmedPct: Math.round((confirmed / total) * 100) || 0,
      completedPct: Math.round((completed / total) * 100) || 0,
      cancelledPct: Math.round((cancelled / total) * 100) || 0,
    };
  }, [appointments]);

  const maxDailyCount = useMemo(() => {
    return Math.max(...activityData.map((d) => d.count), 1);
  }, [activityData]);

  if (loading) {
    return (
      <div className="rounded-[var(--radius-panel)] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="h-5 w-40 animate-pulse rounded-md bg-slate-200" />
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-panel)] border border-border bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-brand" />
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
              Appointment Activity
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Daily scheduling load and status distribution across the active roster
          </p>
        </div>
        <span className="rounded-full bg-ice px-2.5 py-0.5 text-[10px] font-semibold text-brand">
          Live Clinic Data
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="py-10 text-center">
          <BarChart2 className="mx-auto size-8 text-slate-300 mb-2" />
          <p className="text-xs text-muted">No appointments recorded yet to graph activity.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Status Breakdown Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-black">Status Ratio</span>
              <span className="text-[11px] text-muted">
                {statusStats.total} total recorded
              </span>
            </div>
            {/* Multi-segment progress bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
              {statusStats.confirmed > 0 && (
                <div
                  style={{ width: `${statusStats.confirmedPct}%` }}
                  className="rounded-l-full bg-brand transition-all duration-500"
                  title={`Confirmed: ${statusStats.confirmed} (${statusStats.confirmedPct}%)`}
                />
              )}
              {statusStats.completed > 0 && (
                <div
                  style={{ width: `${statusStats.completedPct}%` }}
                  className="bg-emerald-500 transition-all duration-500"
                  title={`Completed: ${statusStats.completed} (${statusStats.completedPct}%)`}
                />
              )}
              {statusStats.cancelled > 0 && (
                <div
                  style={{ width: `${statusStats.cancelledPct}%` }}
                  className="rounded-r-full bg-rose-500 transition-all duration-500"
                  title={`Cancelled: ${statusStats.cancelled} (${statusStats.cancelledPct}%)`}
                />
              )}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-brand" />
                <span className="font-medium text-black">Confirmed ({statusStats.confirmed})</span>
                <span className="text-muted">({statusStats.confirmedPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-black">Completed ({statusStats.completed})</span>
                <span className="text-muted">({statusStats.completedPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500" />
                <span className="font-medium text-black">Cancelled ({statusStats.cancelled})</span>
                <span className="text-muted">({statusStats.cancelledPct}%)</span>
              </div>
            </div>
          </div>

          {/* Daily Histogram */}
          {activityData.length > 0 && (
            <div className="border-t border-border pt-5">
              <span className="block text-xs font-semibold text-black mb-4">
                Daily Booking Density (Timeline)
              </span>
              <div className="flex items-end justify-between gap-2 h-28 pt-2">
                {activityData.map((d) => {
                  const heightPercent = Math.max(15, Math.round((d.count / maxDailyCount) * 100));
                  return (
                    <div
                      key={d.dateKey}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <span className="text-[10px] font-mono font-bold text-muted group-hover:text-brand transition-colors">
                        {d.count}
                      </span>
                      <div className="w-full max-w-[36px] bg-ice group-hover:bg-brand/20 rounded-t-md relative flex items-end overflow-hidden transition-colors h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-brand rounded-t-md transition-all duration-500 group-hover:bg-brand-hover"
                        />
                      </div>
                      <span className="text-[10px] text-muted whitespace-nowrap truncate max-w-full">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

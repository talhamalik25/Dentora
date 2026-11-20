import { Search, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { DashboardEmptyState } from "./dashboard-empty-state";

export interface AppointmentRecord {
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

interface AppointmentPreviewProps {
  appointments: AppointmentRecord[];
  loading: boolean;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onRefresh: () => void;
  onStatusChange: (id: string, newStatus: "completed" | "no-show" | "cancelled") => void;
  actionLoadingId: string | null;
}

export function AppointmentPreview({
  appointments,
  loading,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  onRefresh,
  onStatusChange,
  actionLoadingId,
}: AppointmentPreviewProps) {
  // Filter appointments
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

  return (
    <div className="rounded-[var(--radius-panel)] border border-border bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Controls Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-black sm:text-xl">
            Appointments Roster
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Manage clinical appointments, check-in arrivals, or process status modifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex rounded-full bg-ice p-1 text-xs">
            {["all", "confirmed", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onStatusFilterChange(st)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-brand text-white shadow-xs"
                    : "text-on-ice hover:text-black"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh appointments roster"
            className="grid size-8 place-items-center rounded-full border border-border text-black hover:bg-ice transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-brand" : ""} />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="mt-5 relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-3 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search reference, patient, specialist..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full rounded-full border border-border bg-white pl-9 pr-4 py-2 text-xs text-black placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 transition-all"
        />
      </div>

      {/* Content: Loading, Empty, or Table/Card List */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-xl bg-slate-100 border border-slate-200/60"
              />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <DashboardEmptyState
            title="No appointments found"
            description={
              searchQuery
                ? `No appointment records matched "${searchQuery}". Try adjusting your search or clearing active filters.`
                : `There are currently no appointments in the "${statusFilter}" category.`
            }
            actionLabel={searchQuery ? "Clear Search" : "Refresh List"}
            onAction={searchQuery ? () => onSearchQueryChange("") : onRefresh}
            className="my-4"
          />
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                    <tr key={item.id} className="hover:bg-ice/20 transition-colors">
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
                        <div className="flex items-center gap-1.5 font-medium text-black">
                          <Clock size={12} className="text-muted" />
                          <span>
                            {new Date(item.startsAtUtc).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted ml-4">
                          {new Date(item.startsAtUtc).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          UTC
                        </p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                            item.status === "confirmed"
                              ? "bg-blue-50 text-brand border border-brand/20"
                              : item.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status === "confirmed" && <span className="size-1.5 rounded-full bg-brand" />}
                          {item.status === "completed" && <CheckCircle2 size={10} />}
                          {item.status === "cancelled" && <XCircle size={10} />}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {item.status === "confirmed" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              disabled={actionLoadingId === item.id}
                              onClick={() => onStatusChange(item.id, "completed")}
                              className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === item.id}
                              onClick={() => onStatusChange(item.id, "cancelled")}
                              className="rounded-full bg-rose-50 border border-rose-200/80 px-2.5 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (No horizontal scrolling / overflow) */}
            <div className="block md:hidden space-y-3">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-ice/10 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand">
                      {item.reference}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                        item.status === "confirmed"
                          ? "bg-blue-50 text-brand border border-brand/20"
                          : item.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "cancelled"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-black">{item.patientName}</p>
                    <p className="text-xs text-muted">{item.patientEmail}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
                        Treatment
                      </span>
                      <p className="font-medium text-black text-xs">{item.serviceName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
                        Specialist
                      </span>
                      <p className="text-xs text-muted">{item.dentistName}</p>
                    </div>
                  </div>

                  <div className="text-xs pt-1 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-muted text-[11px]">
                      <Clock size={12} />
                      <span>
                        {new Date(item.startsAtUtc).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(item.startsAtUtc).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        UTC
                      </span>
                    </div>

                    {item.status === "confirmed" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={actionLoadingId === item.id}
                          onClick={() => onStatusChange(item.id, "completed")}
                          className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                        >
                          Complete
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === item.id}
                          onClick={() => onStatusChange(item.id, "cancelled")}
                          className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

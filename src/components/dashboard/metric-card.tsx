import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: number | string;
  scope: string;
  icon: ReactNode;
  iconVariant?: "brand" | "green" | "rose" | "neutral";
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  scope,
  icon,
  iconVariant = "brand",
  loading = false,
}: MetricCardProps) {
  const variantStyles = {
    brand: "bg-ice text-brand border-brand/20",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="rounded-[var(--radius-panel)] border border-border bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:border-border/80 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <div
          className={`flex size-9 items-center justify-center rounded-xl border ${variantStyles[iconVariant]}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <div className="h-9 w-20 animate-pulse rounded-md bg-slate-200" />
        ) : (
          <p className="font-mono text-3xl font-extrabold tracking-tight text-black tabular-nums">
            {value}
          </p>
        )}
      </div>

      <p className="mt-2 text-[11px] font-medium text-muted">
        {scope}
      </p>
    </div>
  );
}

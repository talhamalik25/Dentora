import type { ReactNode } from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function DashboardEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: DashboardEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[var(--radius-panel)] border border-dashed border-border bg-white/60 p-8 text-center sm:p-12 ${className}`}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-ice text-brand mb-4">
        {icon || <FolderOpen className="size-6 text-brand" />}
      </div>
      <h3 className="text-base font-semibold text-black">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button
            variant="secondary"
            onClick={onAction}
            className="text-xs min-h-[38px] px-5 py-2"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

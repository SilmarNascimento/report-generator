import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  subtitle?: string;
  className?: string;
};

export function StatCard({ label, value, subtitle, className }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-xl border border-border p-4 flex flex-col gap-1", className)}>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </div>
  );
}

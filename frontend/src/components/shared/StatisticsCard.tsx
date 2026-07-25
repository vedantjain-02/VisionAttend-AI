"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  color?: string;
  subtitle?: string;
}

export default function StatisticsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "text-accent",
  subtitle,
}: StatisticsCardProps) {
  return (
    <div className="group rounded-xl border border-card-border bg-card p-5 transition-all duration-300 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3 transition-transform duration-300 group-hover:scale-110", color, "bg-current/10")}>
          <Icon className={cn("h-6 w-6", color)} />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/context/SidebarContext";
import { SIDEBAR_MENU, ROUTES } from "@/constants";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ScanFace,
  Eye,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  X,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  UserPlus,
  ScanFace,
  Eye,
  History,
  BarChart3,
  Settings,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = useSidebarContext();

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={closeMobile} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-sidebar border-r border-card-border flex flex-col transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex items-center h-16 border-b border-card-border", isCollapsed ? "justify-center px-2" : "px-5")}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 w-full">
              <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <BrainCircuit className="h-5 w-5 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-tight">VisionAttend</span>
                <span className="text-[10px] text-accent font-medium leading-tight">AI</span>
              </div>
              <button onClick={closeMobile} className="ml-auto text-muted hover:text-foreground lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
              <BrainCircuit className="h-5 w-5 text-black" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SIDEBAR_MENU.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {Icon && <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-accent")} />}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-card-border p-3 hidden lg:block">
          <button
            onClick={toggle}
            className="flex items-center justify-center w-full h-9 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useData";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Check,
} from "lucide-react";

export default function Navbar() {
  const { isCollapsed, openMobile } = useSidebarContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    refetch,
  } = useNotifications();

  const unreadCount = notifications.filter(
    (n: any) => !n.is_read
  ).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  


  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-sidebar/80 backdrop-blur-xl border-b border-card-border flex items-center justify-between px-6 transition-all duration-300",
        isCollapsed ? "left-[72px]" : "left-[260px]"
      )}
    >
      <div className="flex items-center gap-4">
        <button onClick={openMobile} className="text-muted hover:text-foreground lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <div className={cn("relative transition-all duration-300", searchOpen ? "w-80" : "w-64")}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search employees, attendance..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-card border border-card-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
                refetch(); // Latest notifications fetch karega
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
            className="relative h-9 w-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-black text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-card-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
                <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
                <button className="text-xs text-accent hover:text-accent-hover flex items-center gap-1">
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n: any) => (
                    <div
                      key={n.id}
                      className={cn(
                        "px-4 py-3 border-b border-card-border/50 hover:bg-white/3 transition-colors",
                        !n.is_read && "bg-accent/5"
                      )}
                    >
                      <p className="text-sm font-medium text-foreground">
                        {n.title}
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {n.message}
                      </p>

                      <p className="text-[10px] text-muted mt-1">
                        {new Date(n.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 h-9 rounded-lg px-2 hover:bg-white/5 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">Admin</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 rounded-xl border border-card-border bg-card shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-card-border">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@company.com</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                  <User className="h-4 w-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  REGISTER_FACE: (id: string) => `/users/${id}/register-face`,
  ATTENDANCE: "/attendance",
  ATTENDANCE_TODAY: "/attendance/today",
  ATTENDANCE_HISTORY: "/attendance/history",
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  EMPLOYEES: "/employees",
  REGISTER_EMPLOYEE: "/employees/register",
  REGISTER_FACE: "/employees/register-face",
  LIVE_ATTENDANCE: "/attendance/live",
  ATTENDANCE_HISTORY: "/attendance/history",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const;

export const SIDEBAR_MENU = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Employees", href: ROUTES.EMPLOYEES, icon: "Users" },
  { label: "Register Employee", href: ROUTES.REGISTER_EMPLOYEE, icon: "UserPlus" },
  { label: "Register Face", href: ROUTES.REGISTER_FACE, icon: "ScanFace" },
  { label: "Live Attendance", href: ROUTES.LIVE_ATTENDANCE, icon: "Eye" },
  { label: "Attendance History", href: ROUTES.ATTENDANCE_HISTORY, icon: "History" },
  { label: "Reports", href: ROUTES.REPORTS, icon: "BarChart3" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
] as const;

export const STATUS_COLORS = {
  present: "text-success",
  absent: "text-destructive",
  late: "text-warning",
  half_day: "text-info",
  online: "text-success",
  offline: "text-destructive",
  connected: "text-success",
  disconnected: "text-destructive",
  loaded: "text-success",
  loading: "text-warning",
  error: "text-destructive",
} as const;

export const FACE_SAMPLES_REQUIRED = 20;

export const DEFAULT_RECOGNITION_THRESHOLD = 0.6;

export const CHART_COLORS = {
  primary: "#FACC15",
  secondary: "#3B82F6",
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  muted: "#525252",
} as const;

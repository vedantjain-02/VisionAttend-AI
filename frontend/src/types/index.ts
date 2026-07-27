export interface Employee {
  employee_id: string;
  name: string;
  email: string;
  face_registered: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_photo?: string;
  date: string;
  check_in: string;
  check_out?: string;
  status: "present" | "absent" | "late" | "half_day";
  confidence?: number;
}

export interface TodayAttendance {
  total_present: number;
  total_absent: number;
  total_late: number;
  records: AttendanceRecord[];
}

export interface RecognitionResult {
  employee_id: string;
  employee_name: string;
  employee_photo?: string;
  confidence: number;
  status: "recognized" | "unknown" | "low_confidence";
  timestamp: string;
}

export interface DashboardStats {
  total_employees: number;
  today_attendance: number;
  present_today: number;
  recognition_accuracy: number;
  system_status: "online" | "offline" | "maintenance";
}

export interface SystemHealth {
  backend_status: "online" | "offline";
  camera_status: "connected" | "disconnected";
  model_status: "loaded" | "loading" | "error";
  cpu_usage: number;
  memory_usage: number;
  version: string;
}

export interface AttendanceLog {
  id: string;
  employee_id: string;
  employee_name: string;
  timestamp: string;
  confidence: number;
  status: "check_in" | "check_out";
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface EmployeeFormData {
  employee_id: string;
  full_name: string;
  email: string;
}

export interface SettingsData {
  recognition_threshold: number;
  camera_index: number;
  language: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
}

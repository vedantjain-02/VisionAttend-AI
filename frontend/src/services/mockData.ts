import type {
  Employee,
  AttendanceRecord,
  DashboardStats,
  SystemHealth,
  TodayAttendance,
  AttendanceLog,
  ChartDataPoint,
  Notification,
  SettingsData,
} from "@/types";

export const mockEmployees: Employee[] = [
  { employee_id: "EMP001", name: "Alex Johnson", email: "alex@company.com", face_registered: true, created_at: "2025-01-15T10:00:00Z", updated_at: "2025-06-20T14:30:00Z" },
  { employee_id: "EMP002", name: "Sarah Williams", email: "sarah@company.com", face_registered: true, created_at: "2025-02-10T09:00:00Z", updated_at: "2025-06-21T11:00:00Z" },
  { employee_id: "EMP003", name: "Michael Chen", email: "michael@company.com", face_registered: false, created_at: "2025-03-05T08:30:00Z", updated_at: "2025-06-19T16:00:00Z" },
  { employee_id: "EMP004", name: "Emily Davis", email: "emily@company.com", face_registered: true, created_at: "2025-03-20T10:15:00Z", updated_at: "2025-06-22T09:45:00Z" },
  { employee_id: "EMP005", name: "James Wilson", email: "james@company.com", face_registered: true, created_at: "2025-04-01T11:00:00Z", updated_at: "2025-06-20T13:00:00Z" },
  { employee_id: "EMP006", name: "Olivia Martinez", email: "olivia@company.com", face_registered: false, created_at: "2025-04-15T09:30:00Z", updated_at: "2025-06-18T15:30:00Z" },
  { employee_id: "EMP007", name: "Daniel Brown", email: "daniel@company.com", face_registered: true, created_at: "2025-05-01T08:00:00Z", updated_at: "2025-06-22T10:15:00Z" },
  { employee_id: "EMP008", name: "Sophia Anderson", email: "sophia@company.com", face_registered: true, created_at: "2025-05-10T10:30:00Z", updated_at: "2025-06-21T12:45:00Z" },
  { employee_id: "EMP009", name: "David Lee", email: "david@company.com", face_registered: false, created_at: "2025-05-20T09:00:00Z", updated_at: "2025-06-17T14:00:00Z" },
  { employee_id: "EMP010", name: "Isabella Garcia", email: "isabella@company.com", face_registered: true, created_at: "2025-06-01T11:15:00Z", updated_at: "2025-06-22T08:30:00Z" },
  { employee_id: "EMP011", name: "Ryan Taylor", email: "ryan@company.com", face_registered: true, created_at: "2025-06-05T08:45:00Z", updated_at: "2025-06-22T09:00:00Z" },
  { employee_id: "EMP012", name: "Mia Thompson", email: "mia@company.com", face_registered: false, created_at: "2025-06-10T10:00:00Z", updated_at: "2025-06-20T16:30:00Z" },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: "1", employee_id: "EMP001", employee_name: "Alex Johnson", date: "2025-06-22", check_in: "09:00:00", status: "present", confidence: 0.96 },
  { id: "2", employee_id: "EMP002", employee_name: "Sarah Williams", date: "2025-06-22", check_in: "08:55:00", status: "present", confidence: 0.94 },
  { id: "3", employee_id: "EMP004", employee_name: "Emily Davis", date: "2025-06-22", check_in: "09:25:00", status: "late", confidence: 0.91 },
  { id: "4", employee_id: "EMP005", employee_name: "James Wilson", date: "2025-06-22", check_in: "08:50:00", status: "present", confidence: 0.97 },
  { id: "5", employee_id: "EMP007", employee_name: "Daniel Brown", date: "2025-06-22", check_in: "09:05:00", status: "present", confidence: 0.89 },
  { id: "6", employee_id: "EMP008", employee_name: "Sophia Anderson", date: "2025-06-22", check_in: "08:45:00", status: "present", confidence: 0.93 },
  { id: "7", employee_id: "EMP010", employee_name: "Isabella Garcia", date: "2025-06-22", check_in: "09:10:00", status: "present", confidence: 0.95 },
  { id: "8", employee_id: "EMP011", employee_name: "Ryan Taylor", date: "2025-06-22", check_in: "08:58:00", status: "present", confidence: 0.92 },
];

export const mockTodayAttendance: TodayAttendance = {
  total_present: 8,
  total_absent: 4,
  total_late: 1,
  records: mockAttendanceRecords,
};

export const mockDashboardStats: DashboardStats = {
  total_employees: 12,
  today_attendance: 8,
  present_today: 8,
  recognition_accuracy: 96.5,
  system_status: "online",
};

export const mockSystemHealth: SystemHealth = {
  backend_status: "online",
  camera_status: "connected",
  model_status: "loaded",
  cpu_usage: 34,
  memory_usage: 62,
  version: "1.0.0",
};

export const mockAttendanceLogs: AttendanceLog[] = [
  { id: "1", employee_id: "EMP011", employee_name: "Ryan Taylor", timestamp: new Date().toISOString(), confidence: 0.92, status: "check_in" },
  { id: "2", employee_id: "EMP010", employee_name: "Isabella Garcia", timestamp: new Date(Date.now() - 120000).toISOString(), confidence: 0.95, status: "check_in" },
  { id: "3", employee_id: "EMP008", employee_name: "Sophia Anderson", timestamp: new Date(Date.now() - 300000).toISOString(), confidence: 0.93, status: "check_in" },
  { id: "4", employee_id: "EMP005", employee_name: "James Wilson", timestamp: new Date(Date.now() - 600000).toISOString(), confidence: 0.97, status: "check_in" },
  { id: "5", employee_id: "EMP001", employee_name: "Alex Johnson", timestamp: new Date(Date.now() - 900000).toISOString(), confidence: 0.96, status: "check_in" },
];

export const mockWeeklyChartData: ChartDataPoint[] = [
  { name: "Mon", present: 10, absent: 2, late: 1 },
  { name: "Tue", present: 11, absent: 1, late: 0 },
  { name: "Wed", present: 9, absent: 3, late: 2 },
  { name: "Thu", present: 10, absent: 2, late: 1 },
  { name: "Fri", present: 12, absent: 0, late: 0 },
  { name: "Sat", present: 8, absent: 4, late: 1 },
  { name: "Sun", present: 0, absent: 12, late: 0 },
];

export const mockMonthlyChartData: ChartDataPoint[] = [
  { name: "Week 1", attendance: 85 },
  { name: "Week 2", attendance: 88 },
  { name: "Week 3", attendance: 82 },
  { name: "Week 4", attendance: 91 },
];

export const mockEmployeeGrowthData: ChartDataPoint[] = [
  { name: "Jan", employees: 2 },
  { name: "Feb", employees: 4 },
  { name: "Mar", employees: 6 },
  { name: "Apr", employees: 8 },
  { name: "May", employees: 10 },
  { name: "Jun", employees: 12 },
];

export const mockNotifications: Notification[] = [
  { id: "1", title: "New Registration", message: "Isabella Garcia was registered successfully", type: "success", read: false, timestamp: new Date().toISOString() },
  { id: "2", title: "System Update", message: "Face recognition model updated to v2.1", type: "info", read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", title: "Camera Alert", message: "Camera feed reconnected after interruption", type: "warning", read: true, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "4", title: "Attendance Summary", message: "Daily report generated for today", type: "info", read: true, timestamp: new Date(Date.now() - 10800000).toISOString() },
];

export const mockSettings: SettingsData = {
  recognition_threshold: 0.6,
  camera_index: 0,
  language: "en",
};

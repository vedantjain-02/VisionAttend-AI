import axios, { AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import type {
  Employee,
  EmployeeFormData,
  AttendanceRecord,
  TodayAttendance,
  PaginatedResponse,
  ApiResponse,
  SettingsData,
} from "@/types";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as Record<string, string>)?.detail ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export const employeeService = {
  getAll: async (params?: { page?: number; per_page?: number; search?: string }) => {
    const response = await api.get<PaginatedResponse<Employee>>(API_ENDPOINTS.USERS, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Employee>(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  create: async (data: EmployeeFormData) => {
    const response = await api.post<ApiResponse<Employee>>(
      API_ENDPOINTS.REGISTER_USER,
      data
    );
    return response.data;
  },

  update: async (id: string, data: Partial<EmployeeFormData>) => {
    const response = await api.put<ApiResponse<Employee>>(API_ENDPOINTS.USER_BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(API_ENDPOINTS.USER_BY_ID(id));
    return response.data;
  },

  registerFace: async (id: string, imageData: FormData) => {
    const response = await api.post<ApiResponse<any>>(
      API_ENDPOINTS.REGISTER_FACE(id),
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export const attendanceService = {
  getToday: async () => {
    const response = await api.get<TodayAttendance>(API_ENDPOINTS.ATTENDANCE_TODAY);
    return response.data;
  },

  getHistory: async (params?: {
    page?: number;
    per_page?: number;
    employee_id?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    const response = await api.get<PaginatedResponse<AttendanceRecord>>(
      API_ENDPOINTS.ATTENDANCE_HISTORY,
      { params }
    );
    return response.data;
  },

  getAll: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get<PaginatedResponse<AttendanceRecord>>(
      API_ENDPOINTS.ATTENDANCE,
      { params }
    );
    return response.data;
  },
  liveAttendance: async (imageData: FormData) => {
    const response = await api.post<ApiResponse<any>>(
      API_ENDPOINTS.LIVE_ATTENDANCE,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};

export const settingsService = {
  get: async () => {
    const response = await api.get<SettingsData>("/settings");
    return response.data;
  },

  update: async (data: Partial<SettingsData>) => {
    const response = await api.put<ApiResponse<SettingsData>>("/settings", data);
    return response.data;
  },
};

export const systemService = {
  health: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export const dashboardService = {
  stats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  recentAttendance: async () => {
    const response = await api.get("/dashboard/recent-attendance");
    return response.data;
  },

  today: async () => {
    const response = await api.get("/dashboard/today");
    return response.data;
  },

  systemHealth: async () => {
    const response = await api.get("/dashboard/system-health");
    return response.data;
  },
};

export default api;

"use client";
import { employeeService, dashboardService, attendanceService, notificationService} from "@/services/api";
import { useState, useEffect, useCallback } from "react";
import {
  mockEmployees,
  mockTodayAttendance,
  mockDashboardStats,
  mockSystemHealth,
  mockAttendanceLogs,
  mockWeeklyChartData,
  mockMonthlyChartData,
  mockEmployeeGrowthData,
  mockAttendanceRecords,
  mockSettings,
} from "@/services/mockData";
import type {
  Employee,
  EmployeeFormData,
  TodayAttendance,
  DashboardStats,
  SystemHealth,
  AttendanceLog,
  ChartDataPoint,
  AttendanceRecord,
  SettingsData,
} from "@/types";

const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const fetchEmployees = useCallback(async () => {

    setLoading(true);

    try {

        const response = await employeeService.getAll({

            page,

            per_page: perPage,

            search,

        });
        console.log("API Response:", response);
        setEmployees(response.data);

    }

    catch(error){

        console.error(error);

    }

    finally{

        setLoading(false);

    }

  }, [page, search]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const totalPages = Math.ceil(employees.length / perPage);
  const paginatedEmployees = employees.slice((page - 1) * perPage, page * perPage);

  const addEmployee = async (data: EmployeeFormData) => {
    await employeeService.create(data);
    await fetchEmployees();
  };

  const deleteEmployee = async (id: string) => {
    await employeeService.delete(id);
    await fetchEmployees();
  };

  const registerFace = async (
  employeeId: string,
  formData: FormData
  ) => {
    await employeeService.registerFace(employeeId, formData);
    await fetchEmployees();
  };

  return {
    employees: paginatedEmployees,
    allEmployees: employees,
    loading,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    total: employees.length,
    addEmployee,
    deleteEmployee,
    registerFace,
    refetch: fetchEmployees,
  };
}

export function useTodayAttendance() {
  const [data, setData] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);

      const response = await dashboardService.today();

      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    refetch: fetch,
  };
}
export function useAttendanceHistory() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetch = useCallback(async () => {
    try {
      setLoading(true);

      const response = await attendanceService.getAll();

      let filtered = response.data.map((item: any) => ({
        id: item.id,
        employee_id: item.employee_id,
        employee_name: item.employee_name,
        date: item.check_in.split("T")[0],
        check_in: item.check_in,
        status: item.status,
      }));

      if (search) {
        const q = search.toLowerCase();

        filtered = filtered.filter(
          (r: any) =>
            r.employee_name.toLowerCase().includes(q) ||
            r.employee_id.toLowerCase().includes(q)
        );
      }

      if (dateFrom) {
        filtered = filtered.filter((r: any) => r.date >= dateFrom);
      }

      if (dateTo) {
        filtered = filtered.filter((r: any) => r.date <= dateTo);
      }

      setRecords(filtered);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const totalPages = Math.ceil(records.length / perPage);
  const paginatedRecords = records.slice((page - 1) * perPage, page * perPage);

  return {
    records: paginatedRecords,
    loading,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    setPage,
    totalPages,
    total: records.length,
    refetch: fetch,
  };
}


export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);

      const data = await dashboardService.stats();

      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, refetch: fetch };
}

export function useSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);

      const data = await dashboardService.systemHealth();

      setHealth(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { health, loading };
}

export function useAttendanceLogs() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await attendanceService.getAll();

      setLogs(
        response.data.map((item: any) => ({
          id: item.id,
          employee_id: item.employee_id,
          employee_name: item.employee_name,
          timestamp: item.check_in,
          confidence: item.confidence ?? 1.0,
          status: "check_in",
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refetch: fetchLogs,
  };
}

export function useChartData() {
  const [weeklyData, setWeeklyData] = useState<ChartDataPoint[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartDataPoint[]>([]);
  const [growthData, setGrowthData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);

      const [weekly, monthly, growth] = await Promise.all([
        dashboardService.weeklyAttendance(),
        dashboardService.monthlyAttendance(),
        dashboardService.employeeGrowth(),
      ]);

      setWeeklyData(weekly);
      setMonthlyData(monthly);
      setGrowthData(growth);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    weeklyData,
    monthlyData,
    growthData,
    loading,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    await simulateDelay();
    setSettings(mockSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateSettings = async (data: Partial<SettingsData>) => {
    await simulateDelay();
    setSettings((prev) => (prev ? { ...prev, ...data } : null));
  };

  return { settings, loading, updateSettings, refetch: fetch };
}


export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);

      const data = await notificationService.getAll();

      setNotifications(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    notifications,
    loading,
    refetch: fetch,
  };
}

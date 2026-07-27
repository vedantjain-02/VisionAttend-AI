"use client";

import { motion } from "framer-motion";
import {
  useDashboardStats,
  useTodayAttendance,
  useSystemHealth,
  useChartData,
} from "@/hooks/useData";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import StatisticsCard from "@/components/shared/StatisticsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PageLoader } from "@/components/shared/Spinner";
import {
  WeeklyAttendanceChart,
  MonthlyAttendanceChart,
  EmployeeGrowthChart,
  AttendancePieChart,
} from "@/components/charts/Charts";
import { formatDate, getStatusColor, formatTime } from "@/lib/utils";
import {
  Users,
  UserCheck,
  Target,
  Activity,
  Camera,
  Cpu,
  MemoryStick,
  Zap,
  ArrowRight,
  ScanFace,
  UserPlus,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { data: todayData, loading: attendanceLoading } = useTodayAttendance();
  const { health, loading: healthLoading } = useSystemHealth();
  const { weeklyData, monthlyData, growthData, loading: chartLoading } = useChartData();

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader title="Dashboard" description="Welcome back. Here's your system overview." />
        </motion.div>

        {statsLoading ? (
          <PageLoader />
        ) : (
          <>
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <StatisticsCard title="Total Employees" value={stats?.total_employees ?? 0} icon={Users} color="text-accent" trend={{ value: 12, isPositive: true }} />
              <StatisticsCard title="Today's Attendance" value={stats?.today_attendance ?? 0} icon={UserCheck} color="text-info" subtitle="checked in today" />
              <StatisticsCard title="Present Today" value={stats?.present_today ?? 0} icon={Zap} color="text-success" trend={{ value: 8, isPositive: true }} />
              <StatisticsCard title="Recognition Accuracy" value={`${stats?.recognition_accuracy ?? 0}%`} icon={Target} color="text-warning" />
              <StatisticsCard title="System Status" value={stats?.system_status === "online" ? "Online" : "Offline"} icon={Activity} color={stats?.system_status === "online" ? "text-success" : "text-destructive"} />
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2" hover>
                <CardHeader>
                  <CardTitle>Weekly Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartLoading ? <div className="h-[300px] bg-card animate-pulse rounded-lg" /> : <WeeklyAttendanceChart data={weeklyData} />}
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <CardTitle>Today's Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {attendanceLoading ? (
                    <div className="h-[250px] bg-card animate-pulse rounded-lg" />
                  ) : (
                    <AttendancePieChart present={todayData?.total_present ?? 0} absent={todayData?.total_absent ?? 0} late={todayData?.total_late ?? 0} />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card hover>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-card-border">
                          <th className="text-left py-3 text-muted-foreground font-medium">Employee</th>
                          <th className="text-left py-3 text-muted-foreground font-medium">ID</th>
                          <th className="text-left py-3 text-muted-foreground font-medium">Time</th>
                          <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayData?.records.slice(0, 5).map((record) => (
                          <tr key={record.id} className="border-b border-card-border/50 hover:bg-white/3 transition-colors">
                            <td className="py-3 text-foreground font-medium">{record.employee_name}</td>
                            <td className="py-3 text-muted-foreground">{record.employee_id}</td>
                            <td className="py-3 text-muted-foreground">{record.check_in}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <CardTitle>Employee Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartLoading ? <div className="h-[300px] bg-card animate-pulse rounded-lg" /> : <EmployeeGrowthChart data={growthData} />}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-accent" />
                    Camera Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-card animate-pulse rounded" />)}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground">Backend</span>
                        <span className={`text-sm font-medium ${getStatusColor(health?.backend_status ?? "offline")}`}>
                          {health?.backend_status === "online" ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground">Camera</span>
                        <span className={`text-sm font-medium ${getStatusColor(health?.camera_status ?? "disconnected")}`}>
                          {health?.camera_status === "connected" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Model</span>
                        <span className={`text-sm font-medium ${getStatusColor(health?.model_status ?? "error")}`}>
                          {health?.model_status === "loaded" ? "Loaded" : health?.model_status}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-card animate-pulse rounded" />)}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2"><Cpu className="h-4 w-4" /> CPU Usage</span>
                          <span className="text-foreground font-medium">{health?.cpu_usage}%</span>
                        </div>
                        <div className="h-2 bg-card-border rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${health?.cpu_usage}%` }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2"><MemoryStick className="h-4 w-4" /> Memory</span>
                          <span className="text-foreground font-medium">{health?.memory_usage}%</span>
                        </div>
                        <div className="h-2 bg-card-border rounded-full overflow-hidden">
                          <div className="h-full bg-info rounded-full transition-all" style={{ width: `${health?.memory_usage}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Version</span>
                        <span className="text-sm text-foreground font-medium">v{health?.version}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card hover>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href={ROUTES.REGISTER_EMPLOYEE} className="group flex items-center gap-4 p-4 rounded-xl border border-card-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                      <div className="rounded-lg bg-accent/10 p-3 group-hover:scale-110 transition-transform">
                        <UserPlus className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Register Employee</p>
                        <p className="text-xs text-muted-foreground">Add a new employee</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted ml-auto group-hover:text-accent transition-colors" />
                    </Link>
                    <Link href={ROUTES.REGISTER_FACE} className="group flex items-center gap-4 p-4 rounded-xl border border-card-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                      <div className="rounded-lg bg-accent/10 p-3 group-hover:scale-110 transition-transform">
                        <ScanFace className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Register Face</p>
                        <p className="text-xs text-muted-foreground">Capture face data</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted ml-auto group-hover:text-accent transition-colors" />
                    </Link>
                    <Link href={ROUTES.REPORTS} className="group flex items-center gap-4 p-4 rounded-xl border border-card-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-300">
                      <div className="rounded-lg bg-accent/10 p-3 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">View Reports</p>
                        <p className="text-xs text-muted-foreground">Analytics & insights</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted ml-auto group-hover:text-accent transition-colors" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </AppLayout>
  );
}

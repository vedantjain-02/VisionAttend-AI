"use client";

import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/shared/Spinner";
import {
  WeeklyAttendanceChart,
  MonthlyAttendanceChart,
  EmployeeGrowthChart,
  AttendancePieChart,
} from "@/components/charts/Charts";
import { useChartData, useTodayAttendance, useDashboardStats } from "@/hooks/useData";
import {
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ReportsPage() {
  const { weeklyData, monthlyData, growthData, loading: chartLoading } = useChartData();
  const { data: todayData, loading: attendanceLoading } = useTodayAttendance();
  const { stats, loading: statsLoading } = useDashboardStats();

  const handleExportPDF = () => {
    const content = `
VisionAttend AI - Attendance Report
Generated: ${new Date().toLocaleDateString()}
====================================

Total Employees: ${stats?.total_employees}
Today's Attendance: ${stats?.today_attendance}
Present: ${stats?.present_today}
Recognition Accuracy: ${stats?.recognition_accuracy}%

Weekly Attendance:
${weeklyData.map((d) => `  ${d.name}: Present=${d.present}, Absent=${d.absent}, Late=${d.late}`).join("\n")}

Monthly Attendance:
${monthlyData.map((d) => `  ${d.name}: ${d.attendance}%`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const csvContent = [
      "Weekly Attendance Report",
      "Day,Present,Absent,Late",
      ...weeklyData.map((d) => `${d.name},${d.present},${d.absent},${d.late}`),
      "",
      "Monthly Attendance Report",
      "Week,Attendance %",
      ...monthlyData.map((d) => `${d.name},${d.attendance}`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader
            title="Reports & Analytics"
            description="Insights and trends for your attendance data"
            action={
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleExportPDF}>
                  <FileText className="h-4 w-4" /> Export PDF
                </Button>
                <Button variant="accent" onClick={handleExportExcel}>
                  <Download className="h-4 w-4" /> Export Excel
                </Button>
              </div>
            }
          />
        </motion.div>

        {chartLoading || statsLoading ? (
          <PageLoader />
        ) : (
          <>
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Daily Attendance (This Week)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WeeklyAttendanceChart data={weeklyData} />
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Monthly Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyAttendanceChart data={monthlyData} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Today's Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attendanceLoading ? (
                    <div className="h-[250px] bg-card animate-pulse rounded-lg" />
                  ) : (
                    <AttendancePieChart
                      present={todayData?.total_present ?? 0}
                      absent={todayData?.total_absent ?? 0}
                      late={todayData?.total_late ?? 0}
                    />
                  )}
                </CardContent>
              </Card>

              <Card hover className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-info" />
                    Employee Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EmployeeGrowthChart data={growthData} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card hover>
                <CardHeader>
                  <CardTitle>Summary Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{stats?.total_employees ?? 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Employees</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-success">{stats?.present_today ?? 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Present Today</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent">{stats?.recognition_accuracy ?? 0}%</p>
                      <p className="text-sm text-muted-foreground mt-1">Accuracy Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-info">{growthData[growthData.length - 1]?.employees ?? 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Current Staff</p>
                    </div>
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

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { CHART_COLORS } from "@/constants";
import type { ChartDataPoint } from "@/types";

const tooltipStyle = {
  backgroundColor: "#111111",
  border: "1px solid #222222",
  borderRadius: "8px",
  color: "#F5F5F5",
  fontSize: "12px",
};

interface WeeklyChartProps {
  data: ChartDataPoint[];
}

export function WeeklyAttendanceChart({ data }: WeeklyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
        <XAxis dataKey="name" stroke="#737373" fontSize={12} />
        <YAxis stroke="#737373" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey="present" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="absent" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} />
        <Bar dataKey="late" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MonthlyChartProps {
  data: ChartDataPoint[];
}

export function MonthlyAttendanceChart({ data }: MonthlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
        <XAxis dataKey="name" stroke="#737373" fontSize={12} />
        <YAxis stroke="#737373" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="attendance"
          stroke={CHART_COLORS.primary}
          fill={CHART_COLORS.primary}
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface GrowthChartProps {
  data: ChartDataPoint[];
}

export function EmployeeGrowthChart({ data }: GrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
        <XAxis dataKey="name" stroke="#737373" fontSize={12} />
        <YAxis stroke="#737373" fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="employees"
          stroke={CHART_COLORS.secondary}
          fill={CHART_COLORS.secondary}
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface AttendancePieProps {
  present: number;
  absent: number;
  late: number;
}

export function AttendancePieChart({ present, absent, late }: AttendancePieProps) {
  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ];
  const COLORS = [CHART_COLORS.primary, CHART_COLORS.danger, CHART_COLORS.warning];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

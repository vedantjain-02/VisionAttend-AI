"use client";

import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { TableLoader } from "@/components/shared/Spinner";
import { useAttendanceHistory } from "@/hooks/useData";
import { formatDate, getStatusColor } from "@/lib/utils";
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AttendanceHistoryPage() {
  const {
    records,
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
    total,
  } = useAttendanceHistory();

  const handleExport = () => {
    const csvContent = [
      ["Employee", "ID", "Date", "Check In", "Status"].join(","),
      ...records.map((r) => [r.employee_name, r.employee_id, r.date, r.check_in, r.status].join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_history_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader
            title="Attendance History"
            description="View and export attendance records"
            action={
              <Button variant="accent" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            }
          />
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
              <div className="flex-1 w-full sm:w-auto">
                <Input
                  placeholder="Search by name or ID..."
                  icon={<Search className="h-4 w-4" />}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                    className="h-10 rounded-lg bg-card border border-card-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-muted-foreground">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                    className="h-10 rounded-lg bg-card border border-card-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <TableLoader rows={10} />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-card-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Employee</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Employee ID</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Check In</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id} className="border-b border-card-border/50 hover:bg-white/3 transition-colors">
                          <td className="py-3 px-4 text-foreground font-medium">{record.employee_name}</td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{record.employee_id}</td>
                          <td className="py-3 px-4 text-muted-foreground">{formatDate(record.date)}</td>
                          <td className="py-3 px-4 text-muted-foreground">{record.check_in}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {records.length === 0 && (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-muted mx-auto mb-3" />
                    <p className="text-muted-foreground">No attendance records found</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-card-border">
                    <p className="text-sm text-muted-foreground">
                      Showing {records.length} of {total} records | Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                        <ChevronLeft className="h-4 w-4" /> Prev
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}

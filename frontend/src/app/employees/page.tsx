"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import StatisticsCard from "@/components/shared/StatisticsCard";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { TableLoader } from "@/components/shared/Spinner";
import { useEmployees } from "@/hooks/useData";
import { formatDate, getStatusColor } from "@/lib/utils";
import { ROUTES } from "@/constants";
import {
  Search,
  UserPlus,
  Trash2,
  ScanFace,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function EmployeesPage() {
  const { employees, loading, search, setSearch, page, setPage, totalPages, total, allEmployees, deleteEmployee } = useEmployees();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const registeredCount = allEmployees.filter((e) => e.face_registered).length;
  const unregisteredCount = total - registeredCount;

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteEmployee(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader
            title="Employees"
            description="Manage your employee directory"
            action={
              <Link href={ROUTES.REGISTER_EMPLOYEE}>
                <Button variant="accent">
                  <UserPlus className="h-4 w-4" /> Add Employee
                </Button>
              </Link>
            }
          />
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatisticsCard title="Total Employees" value={total} icon={Users} color="text-accent" />
          <StatisticsCard title="Face Registered" value={registeredCount} icon={UserCheck} color="text-success" />
          <StatisticsCard title="Pending Registration" value={unregisteredCount} icon={UserX} color="text-warning" />
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex-1 w-full sm:w-auto">
                <Input
                  placeholder="Search employees..."
                  icon={<Search className="h-4 w-4" />}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            {loading ? (
              <TableLoader rows={8} />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-card-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Employee ID</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Registered</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Face Data</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.employee_id} className="border-b border-card-border/50 hover:bg-white/3 transition-colors">
                          <td className="py-3 px-4 text-foreground font-mono text-xs">{emp.employee_id}</td>
                          <td className="py-3 px-4 text-foreground font-medium">{emp.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{emp.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor("present")}`}>
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.face_registered ? getStatusColor("present") : getStatusColor("absent")}`}>
                              {emp.face_registered ? "Registered" : "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              {!emp.face_registered && (
                                <Link href={`${ROUTES.REGISTER_FACE}?employee=${emp.employee_id}`}>
                                  <Button variant="ghost" size="sm">
                                    <ScanFace className="h-3.5 w-3.5" /> Face
                                  </Button>
                                </Link>
                              )}
                              <Button variant="destructive" size="sm" onClick={() => setDeleteId(emp.employee_id)}>
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {employees.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted mx-auto mb-3" />
                    <p className="text-muted-foreground">No employees found</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-card-border">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>
                        <ChevronLeft className="h-4 w-4" /> Previous
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

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </AppLayout>
  );
}

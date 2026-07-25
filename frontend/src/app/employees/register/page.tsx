"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useEmployees } from "@/hooks/useData";
import { UserPlus, Mail, Hash, CheckCircle2, RotateCcw } from "lucide-react";
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

interface FormErrors {
  employee_id?: string;
  name?: string;
  email?: string;
}

export default function RegisterEmployeePage() {
  const { addEmployee } = useEmployees();
  const [form, setForm] = useState({ employee_id: "", name: "", email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addEmployee(form);
      setSuccess(true);
      setForm({ employee_id: "", name: "", email: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ employee_id: "", name: "", email: "" });
    setErrors({});
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader title="Register Employee" description="Add a new employee to the system" />
        </motion.div>

        <div className="max-w-2xl">
          <motion.div variants={item}>
            <Card>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-success/10 border border-success/20"
                >
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-success">Employee registered successfully!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      You can now register their face data.{" "}
                      <Link href={ROUTES.REGISTER_FACE} className="text-accent hover:underline">
                        Register Face
                      </Link>
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Employee ID"
                  placeholder="e.g., EMP013"
                  icon={<Hash className="h-4 w-4" />}
                  value={form.employee_id}
                  onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  error={errors.employee_id}
                />

                <Input
                  label="Full Name"
                  placeholder="e.g., John Doe"
                  icon={<UserPlus className="h-4 w-4" />}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  placeholder="e.g., john@company.com"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" variant="accent" loading={loading}>
                    <UserPlus className="h-4 w-4" /> Register Employee
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" /> Reset
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

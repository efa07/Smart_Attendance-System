'use client';
import EmployeeDashboard from "./employedash";
import SuperAdminDashboard from "./superadmin";
import HRManagerDashboard from "./hrmanager";
import DepartmentHeadDashboard from "./department_head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Dashboard({ username }: { username: string | null }) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, []);

  if (!role) return <p>Loading...</p>;

  return (
    <div className="flex flex-1  ">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full overflow-y-auto ">
        <h1>WELCOME {username}! </h1>
      
        {role === "super_admin" && <SuperAdminDashboard />}
        {role === "department_head" && <DepartmentHeadDashboard />}
        {role === "hr_admin" && <HRManagerDashboard />}
        {role === "employee" && <EmployeeDashboard />}
      </div>
    </div>
  );
}

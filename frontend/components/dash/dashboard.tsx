'use client';
import EmployeeDashboard from "./employedash";
import SuperAdminDashboard from "./superadmin";
import HRManagerDashboard from "./hrmanager";
import DepartmentHeadDashboard from "./department_head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import MoonLoader from "react-spinners/ClipLoader";


export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login");
    }
    setUsername(storedUsername);
    
    if (!storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
    }
  }, []);
 

  if (!role) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      <MoonLoader
        color="#ef4444"
        size={70}
        speedMultiplier={0.8}
      />
    </div>
  );

  return (
    <div className="flex flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="p-4 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex flex-col gap-4 flex-1 w-full overflow-y-auto shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-3xl font-medium text-center text-gray-800 dark:text-gray-100">
            Welcome back <span className="text-rose-500 font-semibold">{username?.split(" ")[1]}!</span>
          </h1>
        </div>
        
        <div className="mt-4">
          {role === "super_admin" && <SuperAdminDashboard />}
          {role === "department_head" && <DepartmentHeadDashboard />}
          {role === "hr_admin" && <HRManagerDashboard />}
          {role === "employee" && <EmployeeDashboard />}
        </div>
      </div>
    </div>
  );
}

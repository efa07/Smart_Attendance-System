import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  BarChart, Settings } from "lucide-react";
import Link from "next/link"
export default function SuperAdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      {/* Attendance Analytics */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart size={24} />
            <h2 className="text-lg font-semibold">Attendance Analytics</h2>
          </div>
          <Link href="/dashboard/admin/analysis"><Button variant="outline">View Reports</Button></Link>
        </CardContent>
      </Card>
      {/* System Settings */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings size={24} />
            <h2 className="text-lg font-semibold">System Settings</h2>
          </div>
          <Button variant="outline">Settings</Button>
        </CardContent>
      </Card>
  
    </div>
  );
}

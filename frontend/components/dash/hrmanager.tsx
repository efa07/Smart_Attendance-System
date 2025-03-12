import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, FileText, ClipboardCheck } from "lucide-react";
import Link  from "next/link"
export default function HRManagerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">HR Manager Dashboard</h1>
      
      {/* Employee Management */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users size={24} />
            <h2 className="text-lg font-semibold">Employee Management</h2>
          </div>
          <Link href="/dashboard/HR/employee"><Button variant="outline">Manage</Button></Link>
        </CardContent>
      </Card>
      
      {/* Attendance Approval */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardCheck size={24} />
            <h2 className="text-lg font-semibold">Attendance Approval</h2>
          </div>
          <Button variant="outline">Review</Button>
        </CardContent>
      </Card>
      
      {/* Leave Requests */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarCheck size={24} />
            <h2 className="text-lg font-semibold">Leave Requests</h2>
          </div>
          <Button variant="outline">Approve</Button>
        </CardContent>
      </Card>
      
      {/* Reports & Payroll */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={24} />
            <h2 className="text-lg font-semibold">Reports & Payroll</h2>
          </div>
          <Link href="/dashboard/HR/payroll"><Button variant="outline">Generate</Button></Link>
        </CardContent>
      </Card>
          {/* Shift & Policy Management */}
          <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarCheck size={24} />
            <h2 className="text-lg font-semibold">Shift & Policy Management</h2>
          </div>
          <Link href="/dashboard/shift" ><Button variant="outline">Config</Button></Link>
          </CardContent>
      </Card>
    </div>
  );
}

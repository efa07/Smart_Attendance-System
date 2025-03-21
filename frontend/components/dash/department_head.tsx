import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ClipboardCheck } from "lucide-react";
import Link from "next/link"

export default function DepartmentHeadDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Department Head Dashboard</h1>      
      {/* Attendance Approval */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardCheck size={24} />
            <h2 className="text-lg font-semibold">Attendance Approval</h2>
          </div>
          <Link href="/dashboard/department/aprove"><Button variant="outline">Approve</Button></Link>
        </CardContent>
      </Card> 
      {/* Leave Requests */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CalendarCheck size={24} />
            <h2 className="text-lg font-semibold">Leave Requests</h2>
          </div>
          <Link href="/dashboard/department/leave"><Button variant="outline">Approve</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}

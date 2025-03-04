import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCheck, FileText, BarChart } from "lucide-react";

export default function DepartmentHeadDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Department Head Dashboard</h1>
      
      {/* Team Attendance Overview */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart size={24} />
            <h2 className="text-lg font-semibold">Team Attendance Overview</h2>
          </div>
          <Button variant="outline">View</Button>
        </CardContent>
      </Card>
      
      {/* Approve Attendance */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardCheck size={24} />
            <h2 className="text-lg font-semibold">Approve Attendance</h2>
          </div>
          <Button variant="outline">Approve</Button>
        </CardContent>
      </Card>
      
      {/* Manage Team Members */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users size={24} />
            <h2 className="text-lg font-semibold">Manage Team Members</h2>
          </div>
          <Button variant="outline">Manage</Button>
        </CardContent>
      </Card>
      
      {/* Generate Reports */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={24} />
            <h2 className="text-lg font-semibold">Generate Reports</h2>
          </div>
          <Button variant="outline">Generate</Button>
        </CardContent>
      </Card>
    </div>
  );
}

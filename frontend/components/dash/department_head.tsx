import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ClipboardCheck ,CircleDollarSign} from "lucide-react";
import Link from "next/link";

export default function DepartmentHeadDashboard() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Department Head Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Approval */}
        <Card className="shadow-md border border-gray-300 hover:shadow-lg transition duration-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ClipboardCheck size={28} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-700">Attendance Approval</h2>
            </div>
            <Link href="/dashboard/department/aprove">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                Approve
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        {/* Leave Requests */}
        <Card className="shadow-md border border-gray-300 hover:shadow-lg transition duration-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CalendarCheck size={28} className="text-green-600" />
              <h2 className="text-xl font-semibold text-gray-700">Leave Requests</h2>
            </div>
            <Link href="/dashboard/department/leave">
              <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                Approve
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-300 hover:shadow-lg transition duration-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CircleDollarSign size={28} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-700">Attendance Approval</h2>
            </div>
            <Link href="/dashboard/department/payrole">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                Salary Approval
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

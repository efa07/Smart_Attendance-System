import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ClipboardCheck, CircleDollarSign } from "lucide-react";
import Link from "next/link";

export default function DepartmentHeadDashboard() {
  return (
    <div className="p-6 md:p-10 lg:p-12 bg-zinc font-[Rajdhani] min-h-screen flex flex-col items-center">
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Attendance Approval */}
        <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl bg-white border border-gray-100">
          <CardContent className="p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <ClipboardCheck size={28} className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Attendance Approval</h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Review and approve attendance records to ensure accuracy and compliance.
            </p>
            <div className="flex justify-end">
              <Link href="/dashboard/department/aprove">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md text-base font-medium transition-all duration-200">
                  Approve
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl bg-white border border-gray-100">
          <CardContent className="p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <CalendarCheck size={28} className="text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Leave Requests</h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Manage employee leave requests and maintain proper tracking of absences.
            </p>
            <div className="flex justify-end">
              <Link href="/dashboard/department/leave">
                <Button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md text-base font-medium transition-all duration-200">
                  Approve
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Salary Approval */}
        <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl bg-white border border-gray-100">
          <CardContent className="p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <CircleDollarSign size={28} className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Salary Approval</h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ensure timely and accurate salary payments for employees.
            </p>
            <div className="flex justify-end">
              <Link href="/dashboard/department/payroll">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md text-base font-medium transition-all duration-200">
                  Approve
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
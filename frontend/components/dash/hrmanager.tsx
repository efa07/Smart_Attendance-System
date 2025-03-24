import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, FileText } from "lucide-react";
import Link from "next/link";

export default function HRManagerDashboard() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">HR Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employee Management */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users size={28} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Employee Management</h2>
            </div>
            <Link href="/dashboard/HR/employee">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Reports & Payroll */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText size={28} className="text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Reports & Payroll</h2>
            </div>
            <Link href="/dashboard/HR/payroll">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                Generate
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Shift & Policy Management */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CalendarCheck size={28} className="text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Shift & Policy Management</h2>
            </div>
            <Link href="/dashboard/shift">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                Config
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

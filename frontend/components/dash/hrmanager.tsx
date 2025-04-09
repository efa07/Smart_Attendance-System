import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, FileText } from "lucide-react";
import Link from "next/link";

export default function HRManagerDashboard() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 space-y-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex justify-center items-center flex-col">
        <h3 className="text-gray-600">Welcome to your HR management portal</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Employee Management */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 flex flex-col h-full">
            <div className="flex items-center space-x-6 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users size={32} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Employee Management</h2>
                <p className="text-sm text-gray-500">Manage your team members</p>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link href="/dashboard/HR/employee" className="block w-full">
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200">
                  Manage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Reports & Payroll */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 flex flex-col h-full">
            <div className="flex items-center space-x-6 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <FileText size={32} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Reports & Payroll</h2>
                <p className="text-sm text-gray-500">Generate and view reports</p>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link href="/dashboard/HR/payroll" className="block w-full">
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200">
                  Generate
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Shift & Policy Management */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 flex flex-col h-full">
            <div className="flex items-center space-x-6 mb-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarCheck size={32} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Shift & Policy Management</h2>
                <p className="text-sm text-gray-500">Configure work schedules</p>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <Link href="/dashboard/shift" className="block w-full">
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200">
                  Config
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Settings, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import CalendarDemo from "../calander";

export default function SuperAdminDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Super Admin Dashboard
        </h1>
      </motion.div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Attendance Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Attendance Analytics
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View detailed reports
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/admin/analysis">
                  <Button
                    variant="outline"
                    className="border-2 border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:border-blue-600 transition-colors"
                  >
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      System Settings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Configure system parameters
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/admin/upload">
                  <Button
                    variant="outline"
                    className="border-2 border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:border-purple-600 transition-colors"
                  >
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      User Management
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage system users
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-2 border-green-500 hover:bg-green-100 dark:hover:bg-green-900/20 hover:border-green-600 transition-colors"
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Calendar Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-black rounded-lg ">
            <CardContent className="p-6">
              <CalendarDemo />
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}

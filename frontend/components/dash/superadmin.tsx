import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Settings, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuperAdminDashboard() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Super Admin Dashboard
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Attendance Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Attendance Analytics</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View detailed reports</p>
                  </div>
                </div>
                <Link href="/dashboard/admin/analysis">
                  <Button 
                    variant="outline" 
                    className="border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-600 transition-colors"
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
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <Settings className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">System Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure system parameters</p>
                  </div>
                </div>
                <Link href="/dashboard/admin/upload">
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-600 transition-colors"
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
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Management</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage system users</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-600 transition-colors"
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
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                    <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Calendar Overview</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View attendance calendar</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-600 transition-colors"
                >
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

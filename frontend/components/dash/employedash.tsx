"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, ChartColumn, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmployeeDashboard() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch(`${API_URL}/api/attendance/history`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch attendance history');
      const data = await res.json();
      console.log(data)
      const latestRecord = data.length > 0 ? data[0] : null;
      if (latestRecord) {
        setStatus(latestRecord.checkOut ? 'Not Checked In' : latestRecord.status);
      } else {
        setStatus('Not Checked In');
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
      setStatus('Not Checked In');
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [loading]);

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/attendance/clock-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to clock out');
      }
      toast.success("Clocked out successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      await fetchAttendanceStatus();
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Employee Dashboard
        </h1>
        <Link href="/dashboard/EP">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
            Clock in
          </Button>
        </Link>
      </motion.div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Clock-Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 lg:col-span-2"
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 h-[200px]">
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Clock className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Clock-Out</h2>
                    <p className="text-base text-gray-500 dark:text-gray-400">Check out at the end of your shift</p>
                  </div>
                </div>
                {status !== 'Not Checked In' && (
                  <Button
                    onClick={handleClockOut}
                    variant="outline"
                    disabled={loading}
                    className=" border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-600 transition-colors px-8 py-6 text-lg"
                  >
                    {loading ? 'Checking Out...' : 'Clock Out'}
                  </Button>
                )}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Status: <span className="font-semibold text-blue-600 dark:text-blue-400">{status}</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500 h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <ChartColumn className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Attendance Overview</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View attendance statistics</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Link href="/dashboard/chart">
                  <Button 
                    variant="outline" 
                    className="border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-600 transition-colors"
                  >
                    View Chart
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leave Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-green-500 h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Leave Management</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Request and track leaves</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Link href="/dashboard/leave">
                  <Button 
                    variant="outline" 
                    className="border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-600 transition-colors whitespace-nowrap"
                  >
                    Manage Leave
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-red-500 h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Attendance Reports</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate detailed reports</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Link href="/dashboard/report">
                  <Button 
                    variant="outline" 
                    className=" border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-600 transition-colors"
                  >
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Manage Shift */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-500 h-[200px]">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                    <Timer className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Manage Shift</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View and manage shifts</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Link href="/dashboard/shift">
                  <Button 
                    variant="outline" 
                    className="border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-600 transition-colors"
                  >
                    Manage Shift
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clock, FileText, ChartColumn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

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
      const latestRecord = data.length > 0 ? data[data.length - 1] : null;
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
  }, []);

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Overview */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col justify-between h-full">
            <div className="flex items-center mb-4">
              <ChartColumn className="text-primary" size={24} />
              <h2 className="text-xl font-semibold ml-2">Attendance Overview</h2>
            </div>
            <p className="text-gray-600 flex-1">
              View your daily, weekly, and monthly attendance stats.
            </p>
            <Link href="/dashboard/chart">
              <Button className="mt-4 w-full">View Chart</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Clock-Out */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col justify-between h-full">
            <div className="flex items-center mb-4">
              <Clock className="text-primary" size={24} />
              <h2 className="text-xl font-semibold ml-2">Clock-Out</h2>
            </div>
            <p className="text-gray-600 flex-1">
              Check out at the end of your shift to log your work hours.
            </p>
            <p className="mb-4">
              Status: <span className="font-semibold">{status}</span>
            </p>
            {status !== 'Not Checked In' && (
              <Button
                onClick={handleClockOut}
                variant="destructive"
                disabled={loading}
                aria-label="Clock Out"
                className="w-full"
              >
                {loading ? 'Checking Out...' : 'Clock Out'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Leave Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col justify-between h-full">
            <div className="flex items-center mb-4">
              <Calendar className="text-primary" size={24} />
              <h2 className="text-xl font-semibold ml-2">Leave Management</h2>
            </div>
            <p className="text-gray-600 flex-1">
              Request and track your leave days seamlessly.
            </p>
            <Link href="/dashboard/leave">
              <Button className="w-full">Manage Leave</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col justify-between h-full">
            <div className="flex items-center mb-4">
              <Bell className="text-primary" size={24} />
              <h2 className="text-xl font-semibold ml-2">Notifications</h2>
            </div>
            <p className="text-gray-600 flex-1">
              Stay updated with important announcements and alerts.
            </p>
            <Link href="/dashboard/notification">
              <Button className="w-full">View Notifications</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Attendance Reports */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col justify-between h-full">
            <div className="flex items-center mb-4">
              <FileText className="text-primary" size={24} />
              <h2 className="text-xl font-semibold ml-2">Attendance Reports</h2>
            </div>
            <p className="text-gray-600 flex-1 mb-4">
              Generate and review detailed attendance reports.
            </p>
            <Link href="/dashboard/report">
              <Button className="w-full">View Reports</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="flex flex-col items-center">
            <div className="flex items-center mb-4">
            <FileText className="text-primary mb-2" size={24} />
            <h2 className="text-xl font-semibold mb-2">Manage Shift</h2>
            </div>
            <p className="text-gray-600 flex-1 mb-4">
              View and manage your shifts.
            </p>
            <Link href="/dashboard/shift">
              <Button className="w-full">Manage Shift</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

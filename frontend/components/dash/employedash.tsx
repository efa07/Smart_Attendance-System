"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clock, FileText, ChartColumn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {  toast } from 'react-toastify';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function EmployeeDashboard() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch(
        `${API_URL}/api/attendance/history`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch attendance history');
      const data = await res.json();

      const latestRecord = data.length > 0 ? data[data.length - 1] : null;

      if (latestRecord) {
        if (latestRecord.checkOut) {
          setStatus('Not Checked In');
        } else {
          setStatus(latestRecord.status);
        }
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

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/attendance/clock-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to clock in');
      }
      toast.success("Clock in")
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

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_URL}/api/attendance/clock-out`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to clock out');
      }
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
    <>
      <div className="p-6 space-y-6 ">
        <h1 className="text-2xl font-mono">Employee Dashboard</h1>

        {/* Attendance Overview */}
        <Card className='flex flex-row items-center justify-between'>
          <CardContent className="p-4">
            <div className='flex flex-row'>
              <ChartColumn />
              <h2 className="text-lg font-semibold ml-2">Attendance Overview</h2>
            </div>
            <p className='ml-8'>View your daily, weekly, and monthly attendance stats.</p>
          </CardContent>
          <Link href="dashboard/chart" className='w-xs m-3 text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-4'>Chart</Link>
        </Card>

        {/* Clock In/Out */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock size={24} />
              <h2 className="text-lg font-semibold">Clock-In/Out</h2>
            </div>
            <p>Status: {status}</p>

            {status === 'Not Checked In' ? (
              <Button
                onClick={handleClockIn}
                variant="outline"
                disabled={loading}
                aria-label="Clock In"
              >
                {loading ? 'Checking In...' : 'Clock In'}
              </Button>
            ) : (
              <Button
                onClick={handleClockOut}
                variant="destructive"
                disabled={loading}
                aria-label="Clock Out"
              >
                {loading ? 'Checking Out...' : 'Clock Out'}
              </Button>
            )}
          </CardContent>
        </Card>
        {/* Leave Management */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center space-x-3">
            <Calendar size={24} />
            <h2 className="text-lg font-semibold">Leave Management</h2>
            <Link href="/dashboard/leave" className='w-xs text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-4'>Leave</Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center space-x-3">
            <Bell size={24} />
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Link href="/dashboard/notification" className='w-xs text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-4'>Notifications</Link>
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center space-x-3">
            <FileText size={24} />
            <h2 className="text-lg font-semibold">Attendance Reports</h2>
            <Link href="/dashboard/report" className='w-xs text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-4'>Report</Link>

          </CardContent>
        </Card>

        {/* shift managment */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center space-x-3">
            <FileText size={24} />
            <h2 className="text-lg font-semibold">Manage shift</h2>
            <Link href="/dashboard/shift" className='w-xs text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200 mt-4'>Manage</Link>
          </CardContent>
        </Card>
      </div>


    </>
  );
}

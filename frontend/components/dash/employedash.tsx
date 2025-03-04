import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Clock, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeDashboard({ userId }: { userId: string | null }) {
  const [status, setStatus] = useState('Not Checked In');
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const router = useRouter();

  // Moved the function definition outside useEffect
  const fetchAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch(
        `http://localhost:3001/api/attendance/history`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch attendance history');
      const data = await res.json();

      // Get the latest attendance record (most recent check-in)
      const latestRecord = data.length > 0 ? data[data.length - 1] : null;

      if (latestRecord) {
        // Determine status based on backend's `status` field
        if (latestRecord.checkOut) {
          setStatus('Not Checked In');
        } else {
          setStatus(latestRecord.status);
        }
      } else {
        setStatus('Not Checked In');
      }

      setAttendanceData(data);
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
        `http://localhost:3001/api/attendance/clock-in`,
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
    } catch (error: any) {
      alert(error.message);
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
        `http://localhost:3001/api/attendance/clock-out`,
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
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
      await fetchAttendanceStatus();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-mono">Employee Dashboard</h1>

      {/* Attendance Overview */}
      <Card>
        <Link href="dashboard/chart">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Attendance Overview</h2>
            <p>View your daily, weekly, and monthly attendance stats.</p>
          </CardContent>
        </Link>
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
        <CardContent className="p-4 flex items-center space-x-3">
          <Calendar size={24} />
          <h2 className="text-lg font-semibold">Leave Management</h2>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent className="p-4 flex items-center space-x-3">
          <Bell size={24} />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </CardContent>
      </Card>

      {/* Reports */}
      <Card>
        <CardContent className="p-4 flex items-center space-x-3">
          <FileText size={24} />
          <h2 className="text-lg font-semibold">Attendance Reports</h2>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState ,useEffect} from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock, FileText } from "lucide-react";
import { useRouter } from "next/navigation";


export default function EmployeeDashboard() {
  const [clockedIn, setClockedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [status, setStatus] = useState("Not Checked In");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const fetchAttendanceStatus = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/attendance/history", {
      headers: { Authorization: `Bearer ${token}` },
    });


    const data = await res.json();
    if (data.length > 0) {
      const lastRecord = data[0];
      if (lastRecord.checkOut) {
        setStatus("Not Checked In");
      } else {
        setStatus("Checked In");
      }
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3001/api/attendance/clock-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setStatus("Checked In");
    } else {
      alert(data.message);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3001/api/attendance/clock-out", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setStatus("Not Checked In");
    } else {
      alert(data.message);
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) return router.push("/login");

      const res = await fetch(`http://localhost:3001/api/employees/profile?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUser(data);
      const sta = data.attendance[0].status
      setStatus(sta)
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6 ">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>
      {/* Attendance Overview */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">Attendance Overview</h2>
          <p>View your daily, weekly, and monthly attendance stats.</p>
        </CardContent>
      </Card>
      
      {/* Clock In/Out */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock size={24} />
            <h2 className="text-lg font-semibold">Clock-In/Out</h2>
          </div>
          {/* <Button onClick={handleClockInOut} variant="outline">
            {clockedIn ? "Clock Out" : "Clock In"}
          </Button> */}
           <p>Status: {status}</p>

{status === "Not Checked In" ? (
  <button
    onClick={handleClockIn}
    className="bg-blue-500 text-white px-4 py-2 rounded"
    disabled={loading}
  >
    {loading ? "Checking In..." : "Clock In"}
  </button>
) : (
  <button
    onClick={handleClockOut}
    className="bg-red-500 text-white px-4 py-2 rounded"
    disabled={loading}
  >
    {loading ? "Checking Out..." : "Clock Out"}
  </button>
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

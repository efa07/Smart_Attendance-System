"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const AttendanceAnalytics = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [timeRange, setTimeRange] = useState("weekly");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/attendance/attendance-summary?filter=${timeRange}`);
        const jsonData = await response.json();
        setAttendanceData(jsonData.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [timeRange]);

  return (
    <Card className="p-6 text-black shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-black">Attendance Analytics</h2>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" stroke="#000" />
          <YAxis stroke="#000" />
          <Tooltip wrapperStyle={{ backgroundColor: "#333", color: "#fff" }} />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="present" fill="#4caf50" name="Present" barSize={40} radius={[5, 5, 0, 0]} />
          <Bar dataKey="absent" fill="#f44336" name="Absent" barSize={40} radius={[5, 5, 0, 0]} />
          <Bar dataKey="overtime" fill="#ffc107" name="Overtime Hours" barSize={40} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AttendanceAnalytics;

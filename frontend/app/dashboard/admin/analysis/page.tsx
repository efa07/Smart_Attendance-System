"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const sampleData = {
  weekly: [
    { date: "Mon", present: 30, absent: 5, overtime: 10 },
    { date: "Tue", present: 28, absent: 7, overtime: 12 },
    { date: "Wed", present: 32, absent: 3, overtime: 8 },
    { date: "Thu", present: 29, absent: 6, overtime: 14 },
    { date: "Fri", present: 31, absent: 4, overtime: 11 },
  ],
  monthly: [
    { date: "Week 1", present: 140, absent: 20, overtime: 40 },
    { date: "Week 2", present: 135, absent: 25, overtime: 38 },
    { date: "Week 3", present: 145, absent: 15, overtime: 50 },
    { date: "Week 4", present: 138, absent: 22, overtime: 44 },
  ],
  yearly: [
    { date: "Jan", present: 580, absent: 60, overtime: 200 },
    { date: "Feb", present: 570, absent: 70, overtime: 190 },
    { date: "Mar", present: 590, absent: 50, overtime: 220 },
    { date: "Apr", present: 600, absent: 40, overtime: 230 },
    { date: "May", present: 610, absent: 30, overtime: 240 },
  ],
};

const AttendanceAnalytics = () => {
  const [attendanceData, setAttendanceData] = useState(sampleData["weekly"]);
  const [timeRange, setTimeRange] = useState("weekly");

  useEffect(() => {
    // Simulate API call with sample data
    setAttendanceData(sampleData[timeRange]);
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
          <XAxis dataKey="date" stroke="#black" />
          <YAxis stroke="black" />
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

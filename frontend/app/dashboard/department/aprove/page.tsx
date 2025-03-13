"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
}

const AttendanceApproval = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/attendance/pending?search=${searchQuery}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance records");
      const data = await res.json();
      setRecords(data.records);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Failed to fetch attendance records!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, [searchQuery]);

  const handleApprove = async (record: AttendanceRecord) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/attendance/approve/${record.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to approve record");
      toast.success("Attendance approved successfully!");
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      console.error("Error approving attendance record:", error);
      toast.error("Failed to approve attendance record!");
    }
  };

  const handleReject = async (record: AttendanceRecord) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3001/api/attendance/reject/${record.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to reject record");
      toast.success("Attendance rejected successfully!");
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      console.error("Error rejecting attendance record:", error);
      toast.error("Failed to reject attendance record!");
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    fetchAttendanceRecords();
  };

  return (
    <div className="min-h-screen p-6 text-black font-[Rajdhani]">
      <Card className="bg-white shadow border-zinc">
        <CardHeader>
          <h2 className="text-2xl font-bold">Attendance Approval</h2>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by employee or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-1/3 bg-gray-100 text-black placeholder-gray-500"
              />
              <Button onClick={fetchAttendanceRecords}>Search</Button>
            </div>
            <Button
              onClick={handleReset}
              className="bg-black text-white hover:bg-black/80"
            >
              Reset
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-300">
                <TableHead className="text-left">Employee</TableHead>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Clock In</TableHead>
                <TableHead className="text-left">Clock Out</TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.clockIn}</TableCell>
                    <TableCell>{record.clockOut}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(record)}
                        variant="outline"
                        className="text-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(record)}
                        variant="destructive"
                        className="text-red-600"
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceApproval;

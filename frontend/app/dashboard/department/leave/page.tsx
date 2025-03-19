"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "disapproved";
}

const LeaveRequests: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leaves`);
        const data = await response.json();
        setLeaveRequests(data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const updateLeaveStatus = async (id: number, newStatus: "approved" | "disapproved") => {
    try {
      const response = await fetch(`${API_URL}/api/leaves/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status: newStatus } : request
          )
        );
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl mb-2 text-center font-[Rajdhani]">Leave Requests</h1>
      <Card>
      <CardContent>
     
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.userId}</TableCell>
              <TableCell>{request.leaveType}</TableCell>
              <TableCell>
                {new Date(request.startDate).toLocaleDateString()} to{" "}
                {new Date(request.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded ${
                    request.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : request.status === "approved"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell>
                {request.status === "pending" ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => updateLeaveStatus(request.id, "approved")}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateLeaveStatus(request.id, "disapproved")}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Disapprove
                    </Button>
                  </div>
                ) : (
                  <span className="text-gray-500">No actions available</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
     </Card>
    </div>
  );
};

export default LeaveRequests;

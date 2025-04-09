"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";
interface Payroll {
  userId: number;
  fullName: string;
  email: string;
  baseSalary: number;
  finalSalary: number;
  status:string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PayrollTable() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPayroll() {
      const token = localStorage.getItem("token")
      try {
        const res = await fetch(`${API_URL}/api/pay/approved-payrolls`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch payroll data");
        const data = await res.json();
        setPayrolls(data.payrolls || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayroll();
  }, []);

  const handleApprove = async(userId: number,status:string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/pay/approve-payroll`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, status }),
      });
      if (!res.ok) throw new Error("Failed to approve payroll");
      const data =  await res.json();
      alert("Payroll approved successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async(userId: number,status:string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/pay/reject-payroll`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, status }),
      });
      if (!res.ok) throw new Error("Failed to reject payroll");
      const data =  await res.json();
      alert("Payroll rejected !");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

 
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Payroll Report</h1>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ClipLoader size={50} color="black" />
        </div>
      ) : payrolls.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Final Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.userId} className="hover:bg-gray-100 transition">
                <TableCell>{payroll.userId}</TableCell>
                <TableCell>{payroll.fullName}</TableCell>
                <TableCell>{payroll.email}</TableCell>
                <TableCell>${payroll.baseSalary}</TableCell>
                <TableCell className="font-semibold text-green-600">${payroll.finalSalary}</TableCell>
                <TableCell>{payroll.status}</TableCell>
                <TableCell className="flex gap-2">
                  {payroll.status === "pending" &&   <Button variant="outline" onClick={() => handleApprove(payroll.userId,"approved")}>Approve</Button>}
                  {payroll.status === "pending" && <Button variant="destructive" onClick={() => handleReject(payroll.userId,"rejected")}>Reject</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-500">No payroll data available.</p>
      )}
      <div className="mt-6">
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Payroll
        </Button>
      </div>
    </div>
  );
}
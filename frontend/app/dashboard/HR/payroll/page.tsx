"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

interface Payroll {
  id: string;
  userId: number;
  fullName: string;
  email: string;
  baseSalary: number;
  finalSalary: number;
  status: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PayrollTable() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const calculatePayroll = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pay/payroll`);
      if (!res.ok) throw new Error("Failed to calculate payroll");
      const data = await res.json();
      setPayrolls(data.payrolls || []);
    } catch (error) {
      console.error(error);
    } 
  };

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

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Payroll Report</h1>
      <div className="flex justify-end">
        <Button onClick={calculatePayroll} variant="outline">
          Calculate Payroll
        </Button>
      </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id} className="hover:bg-gray-100 transition">
                <TableCell>{payroll.userId}</TableCell>
                <TableCell>{payroll.fullName}</TableCell>
                <TableCell>{payroll.email}</TableCell>
                <TableCell>${payroll.baseSalary}</TableCell>
                <TableCell className="font-semibold text-green-600">${payroll.finalSalary}</TableCell>
                <TableCell>{payroll.status}</TableCell>
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

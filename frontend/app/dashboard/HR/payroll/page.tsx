'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { DollarSign, Clock, Calendar, User } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface PayrollData {
  id: number;
  name: string;
  department: string;
  salary: number;
  overtime: number;
  leaveTaken: number;
  deductions: number;
  netPay: number;
}

export default function PayrollReports() {
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/pay/payroll`)
      .then((res) => res.json())
      .then((data: PayrollData[]) => setPayrollData(data))
      .catch((error) => console.error('Error fetching payroll data:', error));
  }, []);

  const exportToCSV = () => {
    const csvHeaders = ['Employee', 'Department', 'Salary (Birr)', 'Overtime (Hrs)', 'Leave Taken', 'Deductions (Birr)', 'Net Pay (Birr)'];
    const csvRows = payrollData.map(employee => [
      employee.name,
      employee.department,
      employee.salary,
      employee.overtime,
      employee.leaveTaken,
      employee.deductions,
      employee.netPay
    ]);
    
    const csvContent = [csvHeaders, ...csvRows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payroll_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 text-black min-h-screen">
      <h1 className="text-3xl mb-4 text-center font-[Rajdhani]">Payroll & Reports</h1>
      <Button onClick={exportToCSV} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Export to CSV</Button>
      <Card className="bg-white border border-gray-300 shadow-lg">
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left"> <User className="inline-block w-4 h-4 mr-1" /> Employee</TableHead>
                <TableHead className="text-left">Department</TableHead>
                <TableHead className="text-left"> <DollarSign className="inline-block w-4 h-4 mr-1" /> Salary (Birr)</TableHead>
                <TableHead className="text-left"> <Clock className="inline-block w-4 h-4 mr-1" /> Overtime (Hrs)</TableHead>
                <TableHead className="text-left"> <Calendar className="inline-block w-4 h-4 mr-1" /> Leave Taken</TableHead>
                <TableHead className="text-left">Deductions ($)</TableHead>
                <TableHead className="text-left">Net Pay ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((employee) => (
                <TableRow key={employee.id} className="border-gray-300 border-b">
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>ETB {employee.salary}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-gray-300 text-black">
                      {employee.overtime}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="bg-red-500 text-white">
                      {employee.leaveTaken}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-red-600">-ETB {employee.deductions}</TableCell>
                  <TableCell className="text-green-600 font-semibold">ETB {employee.netPay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

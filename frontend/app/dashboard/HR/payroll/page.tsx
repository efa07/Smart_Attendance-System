'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { DollarSign, Clock, Calendar, User } from 'lucide-react';

const samplePayrollData = [
  {
    id: 1,
    name: 'John Doe',
    department: 'Engineering',
    salary: 3000,
    overtime: 5,
    leaveTaken: 2,
    deductions: 150,
    netPay: 2850,
  },
  {
    id: 2,
    name: 'Jane Smith',
    department: 'HR',
    salary: 2500,
    overtime: 2,
    leaveTaken: 1,
    deductions: 100,
    netPay: 2400,
  },
];

export default function PayrollReports() {
  return (
    <div className="p-6  text-black min-h-screen">
      <Card className="bg-white border border-gray-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Payroll & Reports</CardTitle>
        </CardHeader>
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
              {samplePayrollData.map((employee) => (
                <TableRow key={employee.id} className="border-gray-300 border-b">
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>${employee.salary}</TableCell>
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
                  <TableCell className="text-red-600">-${employee.deductions}</TableCell>
                  <TableCell className="text-green-600 font-semibold">${employee.netPay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

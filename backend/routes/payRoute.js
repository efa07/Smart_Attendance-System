const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/payroll', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                attendance: true,
                leaves: true
            }
        });

        const payrollData = users.map(user => {
            const totalOvertime = user.attendance.reduce((sum, entry) => sum + (entry.overtime || 0), 0);
            const leaveTaken = user.leaves.length;
            const baseSalary = 2500 + 
            (user.role === 'employee' ? 500 : 
            user.role === 'hr_admin' ? 1000 : 
            user.role === 'department_head' ? 2000 : 0);
                      const deductions = leaveTaken * 50; // deduction logic
            const netPay = baseSalary + (totalOvertime * 20) - deductions; //  net pay calculation

            return {
                id: user.id,
                name: user.fullName,
                department: user.department || 'Unknown',
                salary: baseSalary,
                overtime: totalOvertime,
                leaveTaken,
                deductions,
                netPay
            };
        });

        res.json(payrollData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// constants for salary calculation
const BASE_SALARY = 3000; 
const ABSENT_PENALTY = 50;
const OVERTIME_BONUS = 80;
const UNAPPROVED_LEAVE_PENALTY = 30;

// calculate payroll for a single user
async function calculatePayroll(user) {
  // fetch the user attendance and leave records
  const attendances = await prisma.attendance.findMany({
    where: { userId: user.id },
  });
  
  const leaves = await prisma.leave.findMany({
    where: { userId: user.id },
  });
  
  // start with the base salary
  let salary = BASE_SALARY;
  
  // pocess attendance records
  attendances.forEach(att => {
    // If attendance status is "absent", decrease the salary
    if (att.status && att.status.toLowerCase() === 'absent') {
      salary -= ABSENT_PENALTY;
    }
    // Add bonus for overtime if available
    if (att.overtime && att.overtime > 0) {
      salary += att.overtime * OVERTIME_BONUS;
    }
  });
  
  // process leave records
  leaves.forEach(leave => {
    if (leave.status.toLowerCase() !== 'approved') {
      // for unapproved leave add penality
      salary -= UNAPPROVED_LEAVE_PENALTY;
    }
  });
  if (user.role === 'department_head') {
    salary += 1000;
  }
  else if (user.role === 'hr_admin') {
    salary += 500;
  }
    else if (user.role === 'super_admin') {
        salary += 2000;
    }
    // salary should not be negative
  if (salary < 0) salary = 0;
  
  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    baseSalary: BASE_SALARY,
    finalSalary: salary,
  };
}

//generate payroll for all users
router.get('/payroll', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    
    // Calculate payroll for each user
    const payrolls = await Promise.all(users.map(user => calculatePayroll(user)));
    
    res.json({ payrolls });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

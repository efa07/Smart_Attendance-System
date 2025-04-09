const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const authenticate = require("../middleware/authMiddleware");

//constatnt salary
const BASE_SALARY = 3000; 
const ABSENT_PENALTY = 50;
const OVERTIME_BONUS = 80;
const UNAPPROVED_LEAVE_PENALTY = 30;

// calculate payroll for a single user
async function calculatePayroll(user) {
  const attendances = await prisma.attendance.findMany({
    where: { userId: user.id },
  });
  
  const leaves = await prisma.leave.findMany({
    where: { userId: user.id },
  });
  // start with base salary
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

//approve payroll and insert into database
async function approvePayroll(userId, status) {
  if (!userId || !status) {
    throw new Error("Missing userId or status");
  }
  if (!["approved", "rejected", "pending"].includes(status.toLowerCase())) {
    throw new Error("Invalid status. Must be 'approved' or 'rejected' or 'pending'.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const payrollData = await calculatePayroll(user);

  // Insert payroll data into the database
  return await prisma.payroll.create({
    data: {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      baseSalary: payrollData.baseSalary,
      finalSalary: payrollData.finalSalary,
      status: status.toLowerCase(),
    },
  });
}

// for all users hr route
router.get('/payroll', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    
    // Calculate payroll for each user
    const payrolls = await Promise.all(users.map(user => Promise.all([calculatePayroll(user),
       approvePayroll(user.id, "pending")])));

    const result = await prisma.payroll.findMany();
    res.status(200).json({ result });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

//only for department head
router.get('/dep/payroll', authenticate, async (req, res) => {
  const { department } = req.user;

  try {
    const users = await prisma.user.findMany({
      where: { department },
    });

      // Calculate payrolls only if no data is found
      const payrolls = await Promise.all(
        users.map(async (user) => {
          const payrollData = await calculatePayroll(user);
        })
      );

    res.json({ payrolls });
  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/approve", authenticate, async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ error: "Missing userId or status" });
  }
  
  if (!["approved", "rejected"].includes(status.toLowerCase())) {
    return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const payrollData = await calculatePayroll(user);

    // Insert payroll data into the database
    const payroll = await prisma.payroll.create({
      data: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        baseSalary: payrollData.baseSalary,
        finalSalary: payrollData.finalSalary,
        status: status.toLowerCase(),
      },
    });

    res.status(201).json({ message: `Payroll ${status} successfully`, payroll });
  } catch (error) {
    console.error("Error inserting payroll data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get approved
router.get("/approved-payrolls", authenticate, async (req, res) => {

  const {department,role} = req.user;
if(role === "hr_admin"){
  try {
    const payrolls = await prisma.payroll.findMany();
    res.json({ payrolls });
} catch(error){
  console.log(error)
}
}
else{
  try {
    const users = await prisma.user.findMany({
      where:{department}
    })
    const payrolls = await prisma.payroll.findMany(
     {
      where:{
        userId:{in:users.map(user => user.id)}
      }
     }
    );
    res.json({ payrolls });
  } catch (error) {
    console.error("Error fetching approved payrolls:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 

})

//approve payroll
router.post("/approve-payroll", authenticate, async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ error: "Missing userId or status" });
  }

  if (!["approved", "rejected"].includes(status.toLowerCase())) {
    return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'." });
  }

  try {
    const user = await prisma.payroll.findUnique({ where: { userId: userId } });
    if (!user) return res.status(404).json({ error: "Payroll not found" });

    const updatedPayroll = await prisma.payroll.update({
      where: { userId: userId },
      data: { status },
    });

    res.status(200).json({ message: "Payroll updated successfully", updatedPayroll });
  } catch (error) {
    console.error("Error approving payroll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 

//reject payroll
router.post("/reject-payroll", authenticate, async (req, res) => {
  const { userId, status } = req.body;
  const {department} = req.user;

  if (!userId || !status) {
    return res.status(400).json({ error: "Missing userId or status" });
  }

  if (!["rejected"].includes(status.toLowerCase())) {
    return res.status(400).json({ error: "Invalid status. Must be 'rejected'." });
  }

  try {
    const user = await prisma.payroll.findUnique({ where: { userId: userId } });
    if (!user) return res.status(404).json({ error: "Payroll not found" });
    const updatedPayroll = await prisma.payroll.update({
      where: { userId: userId },
      data: { status },
    });
    res.status(200).json({ message: "Payroll updated successfully", updatedPayroll });
  }
  catch (error) {
    console.error("Error rejecting payroll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;

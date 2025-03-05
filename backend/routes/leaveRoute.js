const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/apply", authenticate, async (req, res) => {
  const { leaveType, startDate, endDate } = req.body;
  const { userId } = req.user;

  try {
    const newLeave = await prisma.leave.create({
      data: {
        userId,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "pending" 
      }
    });
    res.json({ message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ message: "Error applying for leave", error });
  }
});

router.get("/history", authenticate, async (req, res) => {
  const { userId } = req.user;
  try {
    const leaves = await prisma.leave.findMany({
      where: { userId },
      orderBy: { startDate: "desc" }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave history", error });
  }
});

module.exports = router;

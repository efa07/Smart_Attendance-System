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


// Get all leave requests
router.get("/", async (req, res) => {
  try {
    const leaveRequests = await prisma.leave.findMany();
    res.json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Approve or Disapprove leave request (only HR can access this)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'disapproved'

  if (!["approved", "disapproved"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updatedLeave = await prisma.leave.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updatedLeave);
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;

const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Clock In
router.post("/clock-in", authenticate, async (req, res) => {
  const { userId } = req.user; 

  try {
    // Check if the user already clocked in today
    const today = new Date().toISOString().split("T")[0];
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        createdAt: { gte: new Date(`${today}T00:00:00.000Z`) },
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    // Record Check-in Time
    const attendance = await prisma.attendance.create({
      data: {
        userId: userId,
        checkIn: new Date(),
        status: "Present",
      },
    });

    res.json({ message: "Clocked in successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error clocking in", error });
  }
});

// Clock Out
router.post("/clock-out", authenticate, async (req, res) => {
  const { userId } = req.user;

  try {
    // Find today's attendance record
    const today = new Date().toISOString().split("T")[0];
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        createdAt: { gte: new Date(`${today}T00:00:00.000Z`) },
        checkOut: null, 
      },
    });

    if (!attendance) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    // Update Check-out Time
    await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: new Date() },
    });

    res.json({ message: "Clocked out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clocking out", error });
  }
});

// Get Employee Attendance History
router.get("/history", async (req, res) => {
  try {
    const userId = req.query.userId || 13; 

    // Fetch attendance data using Prisma
    const attendanceData = await prisma.attendance.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        checkIn: 'asc',
      },
      select: {
        checkIn: true,
      },
    });

    // Format the data for the frontend
    const formattedData = attendanceData.map((record) => ({
      date: record.checkIn.toISOString().split('T')[0], // Extract date part
      checkInTime: parseFloat(
        record.checkIn.getHours() + record.checkIn.getMinutes() / 60
      ).toFixed(2), // Convert time to decimal hours
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching attendance data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");
const moment = require("moment-timezone");
const cron = require("node-cron");

const router = express.Router();

// Configure Ethiopian time (UTC+3)
const ETHIOPIA_TIMEZONE = "Africa/Addis_Ababa";
const WORK_START = { hour: 8, minute: 30 };
const LATE_CUTOFF = { hour: 9, minute: 0 };
const ABSENT_CUTOFF = { hour: 9, minute: 30 };

// Helper function to get current Ethiopia time
function getEthiopiaTime() {
  return moment().tz(ETHIOPIA_TIMEZONE);
}

// Clock In Endpoint
router.post("/clock-in", authenticate, async (req, res) => {
  const { userId } = req.user;
  const now = getEthiopiaTime();
  
  try {
    // Get today's boundaries in Ethiopia time
    const todayStart = now.clone().startOf('day');
    const todayEnd = now.clone().endOf('day');

    // Check existing attendance
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        checkIn: {
          gte: todayStart.toDate(),
          lt: todayEnd.toDate()
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    // Determine attendance status
    let status = "absent";
    const checkInTime = now.format("HH:mm");

    if (now.isBefore(moment.tz(ETHIOPIA_TIMEZONE).set(LATE_CUTOFF))) {
      status = "present";
    } else if (now.isBefore(moment.tz(ETHIOPIA_TIMEZONE).set(ABSENT_CUTOFF))) {
      status = "late";
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        checkIn: now.toDate(),
        status
      }
    });

    res.json({
      message: "Clocked in successfully",
      checkInTime,
      status,
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: "Error clocking in", error });
  }
});

// Clock Out Endpoint
router.post("/clock-out", authenticate, async (req, res) => {
  const { userId } = req.user;
  const now = getEthiopiaTime();

  try {
    // Find today's attendance
    const todayStart = now.clone().startOf('day');
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        checkIn: {
          gte: todayStart.toDate()
        },
        checkOut: null
      }
    });

    if (!attendance) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    // Update check-out time
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: now.toDate() }
    });

    res.json({
      message: "Clocked out successfully",
      checkOutTime: now.format("HH:mm"),
      attendance: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Error clocking out", error });
  }
});

// Automatic Absent Marking Cron Job (runs daily at 9:31 AM Ethiopia time)
cron.schedule('31 9 * * *', async () => {
  const now = getEthiopiaTime();
  const todayStart = now.clone().startOf('day');
  
  try {
    // Get all users
    const users = await prisma.user.findMany();
    
    // Check attendance for each user
    for (const user of users) {
      const existing = await prisma.attendance.findFirst({
        where: {
          userId: user.id,
          checkIn: {
            gte: todayStart.toDate()
          }
        }
      });

      if (!existing) {
        await prisma.attendance.create({
          data: {
            userId: user.id,
            checkIn: todayStart.add(ABSENT_CUTOFF).toDate(),
            status: "absent"
          }
        });
      }
    }
    console.log("Auto-absent marking completed");
  } catch (error) {
    console.error("Error in auto-absent marking:", error);
  }
}, {
  timezone: ETHIOPIA_TIMEZONE
});

// Attendance History
router.get("/history", authenticate, async (req, res) => {
  const { userId } = req.user;

  try {
    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { checkIn: "desc" }
    });

    const formatted = records.map(record => ({
      date: moment(record.checkIn).tz(ETHIOPIA_TIMEZONE).format("YYYY-MM-DD"),
      checkIn: moment(record.checkIn).tz(ETHIOPIA_TIMEZONE).format("HH:mm"),
      checkOut: record.checkOut ? 
        moment(record.checkOut).tz(ETHIOPIA_TIMEZONE).format("HH:mm") : null,
      status: record.status
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
});

router.get("/reports", authenticate, async (req, res) => {
  const { userId } = req.user;
  const { startDate, endDate } = req.query;

  try {
    // the filter condition
    const whereCondition = {
      userId,
      checkIn: {}
    };

    if (startDate) {
      whereCondition.checkIn.gte = new Date(startDate);
    }
    if (endDate) {
      whereCondition.checkIn.lte = new Date(endDate);
    }
    // Remove checkIn filter if no dates provided
    if (Object.keys(whereCondition.checkIn).length === 0) {
      delete whereCondition.checkIn;
    }

    // Fetch attendance records
    const records = await prisma.attendance.findMany({
      where: whereCondition,
      orderBy: { checkIn: "desc" }
    });

    // Aggregate counts by status
    const summary = records.reduce((acc, record) => {
      const status = record.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    res.json({ records, summary });
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error });
  }
});

module.exports = router;
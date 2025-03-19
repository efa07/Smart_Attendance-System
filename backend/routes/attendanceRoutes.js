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
  console.log(now)
  
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
router.get('/attendance-summary', async (req, res) => {
  const filter = req.query.filter; // expected values: weekly, monthly, yearly

  if (!['weekly', 'monthly', 'yearly'].includes(filter)) {
    return res.status(400).json({
      error: 'Invalid filter. Please use "weekly", "monthly", or "yearly".'
    });
  }

  const now = new Date();
  let startDate;
  let groupBy = 'day'; // Default

  if (filter === 'weekly') {
    const day = now.getDay() === 0 ? 7 : now.getDay(); // Treat Sunday as 7
    startDate = new Date(now);
    startDate.setDate(now.getDate() - day + 1); // Move to Monday
    startDate.setHours(0, 0, 0, 0);
    groupBy = 'day';
  } else if (filter === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    groupBy = 'week';
  } else if (filter === 'yearly') {
    startDate = new Date(now.getFullYear(), 0, 1);
    groupBy = 'month';
  }

  try {
    const records = await prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Helper function to format date labels
    const formatLabel = (date, format) => {
      if (format === 'day') {
        return date.toLocaleDateString('en-US', { weekday: 'short' }); 
      }
      if (format === 'week') {
        const weekNumber = Math.ceil(date.getDate() / 7);
        return `Week ${weekNumber}`;
      }
      if (format === 'month') {
        return date.toLocaleDateString('en-US', { month: 'short' }); 
      }
      return date.toDateString();
    };

    // Aggregate data
    const summary = {};
    records.forEach(record => {
      const dateLabel = formatLabel(record.createdAt, groupBy);

      if (!summary[dateLabel]) {
        summary[dateLabel] = { present: 0, absent: 0, overtime: 0 };
      }

      if (record.status.toLowerCase() === 'present') {
        summary[dateLabel].present++;
      } else if (record.status.toLowerCase() === 'absent') {
        summary[dateLabel].absent++;
      }
      summary[dateLabel].overtime += Number(record.overtime) || 0;
    });

    // Convert summary object to array format
    const responseData = Object.keys(summary).map(date => ({
      date,
      ...summary[date]
    }));

    return res.json({
      filter,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return res.status(500).json({
      error: 'An error occurred while fetching attendance data.'
    });
  }
});


// Fetch pending attendance records
router.get("/pending", async (req, res) => {
  try {
    const { search } = req.query;
    const records = await prisma.attendance.findMany({
      where: {
        approvedByHR: false,
        user: {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      include: {
        user: true,
      },
    });
    res.json({ records: records.map((r) => ({
        id: r.id,
        employeeName: r.user.fullName,
        date: r.createdAt.toISOString().split("T")[0],
        clockIn: r.checkIn,
        clockOut: r.checkOut,
        status: r.status,
      }))
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Approve attendance record
router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.attendance.update({
      where: { id: Number(id) },
      data: { status: "Approved", approvedByHR: true },
    });
    res.json({ message: "Attendance approved successfully" });
  } catch (error) {
    console.error("Error approving attendance record:", error);
    res.status(500).json({ error: "Failed to approve record" });
  }
});

// Reject attendance record
router.put("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.attendance.update({
      where: { id: Number(id) },
      data: { status: "Rejected", approvedByHR: false },
    });
    res.json({ message: "Attendance rejected successfully" });
  } catch (error) {
    console.error("Error rejecting attendance record:", error);
    res.status(500).json({ error: "Failed to reject record" });
  }
});

module.exports = router;
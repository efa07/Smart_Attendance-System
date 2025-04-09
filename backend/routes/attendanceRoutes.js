const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");
const { AttendanceMethod } = require("../middleware/constants"); 
const { validateClockInRequest } = require("../middleware/validators"); 
const { getLocalTime } = require("../middleware/utils");

const moment = require("moment");

const router = express.Router();


router.post("/clock-in", authenticate, async (req, res) => {
  const { userId } = req.user;
  const { key, method } = req.body;
  let toleranceTime = 20; //minutes


  //validate req.body
  const validationError = validateClockInRequest(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const now = getLocalTime();

  // morning shift boundaries
  const morningStart = now.clone().set({ hour: 8, minute: 30, second: 0, millisecond: 0 });
  const morningToleranceEnd = morningStart.clone().add(toleranceTime, "minutes"); 
  const morningLateEnd = morningStart.clone().add(1, "hour"); 
  const morningShiftEnd = now.clone().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

  // afternoon shift boundaries (for today's date)
  const afternoonStart = now.clone().set({ hour: 13, minute: 0, second: 0, millisecond: 0 });
  const afternoonToleranceEnd = afternoonStart.clone().add(10, "minutes");
  const afternoonLateEnd = afternoonStart.clone().add(1, "hour");
  const afternoonShiftEnd = now.clone().set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

  // determine which shift
  let shift = null;
  if (now.isBetween(morningStart.clone().subtract(1, "hour"), morningShiftEnd, null, "[)")) {
    shift = "morning";
  } else if (now.isBetween(afternoonStart.clone().subtract(1, "hour"), afternoonShiftEnd, null, "[)")) {
    shift = "afternoon";
  } else {
    return res.status(400).json({ message: "Clock-in time is outside shift hours" });
  }

  // Define search boundaries for an existing record for the shift.
  let shiftStart, shiftEnd;
  if (shift === "morning") {
    shiftStart = morningStart.toDate();
    shiftEnd = morningShiftEnd.toDate();
  } else {
    shiftStart = afternoonStart.clone().subtract(1, "hour").toDate();
    shiftEnd = afternoonShiftEnd.toDate();
  }

  try {
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        checkIn: {
          gte: shiftStart,
          lt: shiftEnd,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: `Already clocked in for the ${shift} shift today` });
    }

    // Calculate attendance status based on the shift and clock-in time.
    let status = "";
    if (shift === "morning") {
      if (now.isBefore(morningStart)) {
        status = "early";
      } else if (now.isBetween(morningStart, morningToleranceEnd, null, "[)")) {
        status = "on_time";
      } else if (now.isBetween(morningToleranceEnd, morningLateEnd, null, "[)")) {
        status = "late";
      } else {
        status = "very_late";
      }
    } else if (shift === "afternoon") {
      if (now.isBefore(afternoonStart)) {
        status = "early";
      } else if (now.isBetween(afternoonStart, afternoonToleranceEnd, null, "[)")) {
        status = "on_time";
      } else if (now.isBetween(afternoonToleranceEnd, afternoonLateEnd, null, "[)")) {
        status = "late";
      } else {
        status = "very_late";
      }
    }

    // Create attendanc
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        checkIn: now.toDate(),
        status,
        [key === AttendanceMethod.FingerPrint ? "fingerprintId" : "rfidId"]: method,
        shift,
      },
    });

    res.json({
      message: `Clocked in successfully for the ${shift} shift`,
      checkInTime: now.format("HH:mm"),
      status,
      attendance,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error clocking in", error: error.message });
  }
});
router.post("/clock-out", authenticate, async (req, res) => {
  const { userId } = req.user;
  const now = getLocalTime();

  try {
    // Find today's attendance record that hasn't been checked out
    const todayStart = now.clone().startOf("day");
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        checkIn: { gte: todayStart.toDate() },
        checkOut: null,
      },
    });

    if (!attendance) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    // Determine the shift based on the check-in time.
    // For simplicity, if the check-in was before 12:00 PM, consider it a morning shift; otherwise, afternoon.
    const checkInTime = moment(attendance.checkIn);
    let shift = "";
    if (checkInTime.hour() < 12) {
      shift = "morning";
    } else {
      shift = "afternoon";
    }

    // Define the scheduled shift end and tolerance windows.
    let shiftEnd, toleranceWindowEnd;
    if (shift === "morning") {
      // Morning shift: ends at 12:00 PM with a 10-minute tolerance.
      shiftEnd = now.clone().set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
      toleranceWindowEnd = shiftEnd.clone().add(10, "minutes");
    } else {
      // Afternoon shift: ends at 5:00 PM with a 10-minute tolerance.
      shiftEnd = now.clone().set({ hour: 17, minute: 0, second: 0, millisecond: 0 });
      toleranceWindowEnd = shiftEnd.clone().add(10, "minutes");
    }

    // Calculate clock-out status based on how the clock-out time compares to the scheduled shift end.
    let clockOutStatus = "";
    if (now.isBefore(shiftEnd)) {
      clockOutStatus = "early_leave";
    } else if (now.isSameOrBefore(toleranceWindowEnd)) {
      clockOutStatus = "on_time_leave";
    } else {
      clockOutStatus = "overtime";
    }

    // Calculate overtime in minutes if clockOutStatus is overtime, otherwise overtime is 0.
    const overtimeWorked =
      clockOutStatus === "overtime" ? now.diff(toleranceWindowEnd, "minutes") : 0;

    // Update the attendance record with the check-out time, clock-out status, and overtime.
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: now.toDate(),
        clockOutStatus, // Set clock-out status without affecting the check-in status field.
        overtime: overtimeWorked,
      },
    });

    res.json({
      message: "Clocked out successfully",
      checkOutTime: now.format("HH:mm"),
      clockOutStatus,
      overtime: overtimeWorked,
      attendance: updated,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error clocking out", error: error.message });
  }
});

router.get("/history", authenticate, async (req, res) => {
  const { userId } = req.user;

  try {
    const records = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { checkIn: "desc" }
    });

    const formatted = records.map(record => ({
      date: moment(record.checkIn).format("YYYY-MM-DD"),
      checkIn: moment(record.checkIn).format("HH:mm"),
      checkOut: record.checkOut ? 
        moment(record.checkOut).format("HH:mm") : null,
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
router.get("/pending", authenticate, async (req, res) => {
  const { userId } = req.user;
  let department = null;

  try {
    // Get the logged in user's department
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    department = user.department;
  } catch (error) {
    console.error("Error fetching user department:", error);
    return res.status(500).json({ error: "Failed to fetch user department" });
  }

  try {
    const { search } = req.query;

    // Search filter: if search is provided, filter by fullName or email, otherwise fetch all users from that department
    const records = await prisma.user.findMany({
      where: {
        department,  // only get same department
        ...(search && {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        attendance: {
          where: { status: "absent"},
          orderBy: { createdAt: "desc" },
        }
        
      },
    });

    // Map over the users and then their attendance records
    const result = records.flatMap((r) =>
      r.attendance.map((att) => ({
        attendanceId: att.id,
        id: r.id,
        employeeName: r.fullName,
        date: att.createdAt.toISOString().split("T")[0],
        status: att.status,
      }))
    );

    res.json({ records: result });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Approve attendance record
router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const attendanceId = parseInt(id);

    if (isNaN(attendanceId)) {
      return res.status(400).json({ error: "Invalid attendance ID" });
    }

    // Check if record exists
    const attendanceRecord = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!attendanceRecord) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    // Update the record
    await prisma.attendance.update({
      where: { id: attendanceId },
      data: { status: "Approved" },
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
      data: { status: "Rejected" },
    });
    res.json({ message: "Attendance rejected successfully" });
  } catch (error) {
    console.error("Error rejecting attendance record:", error);
    res.status(500).json({ error: "Failed to reject record" });
  }
});

module.exports = router;
const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/reports", authenticate, async (req, res) => {
  const { userId } = req.user;
  const { startDate, endDate } = req.query;

  try {
    // filter
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

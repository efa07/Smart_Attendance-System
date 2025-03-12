const express = require("express");
const prisma = require("../prismaClient");
  const { ShiftType } = prisma;
  const authenticate = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/shift", async (req, res) => {
  try {
    const { userId, shiftType, shiftStart, shiftEnd } = req.body;

    // Validate shiftType
    if (!Object.values(ShiftType).includes(shiftType)) {
      return res.status(400).json({ error: "Invalid shiftType" });
    }

    const newShift = await prisma.shift.create({
      data: {
        user: { connect: { id: userId } },
        shiftType,
        shiftStart: new Date(shiftStart),
        shiftEnd: new Date(shiftEnd),
      },
    });

    res.status(201).json(newShift);
  } catch (error) {
    console.error("Error creating shift:", error);
    res.status(500).json({ error: "Unable to create shift" });
  }
});
  
  // Retrieve all shifts
  router.get("/shifts", async (req, res) => {
    try {
      const shifts = await prisma.shift.findMany({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              department: true,
            },
          },
        },
      });
  
      res.status(200).json(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      res.status(500).json({ error: "Unable to fetch shifts" });
    }
  });
  
  
  router.put("/shift/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { shiftType, shiftStart, shiftEnd } = req.body;
  
      // Validate shiftType
      if (!Object.values(ShiftType).includes(shiftType)) {
        return res.status(400).json({ error: "Invalid shiftType" });
      }
  
      const updatedShift = await prisma.shift.update({
        where: { id: parseInt(id, 10) },
        data: {
          shiftType,
          shiftStart: new Date(shiftStart),
          shiftEnd: new Date(shiftEnd),
        },
      });
  
      res.status(200).json(updatedShift);
    } catch (error) {
      console.error("Error updating shift:", error);
      res.status(500).json({ error: "Unable to update shift" });
    }
  });
  
  
  // Delete a shift
  router.delete("/shift/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.shift.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shift:", error);
      res.status(500).json({ error: "Unable to delete shift" });
    }
  });


  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Fetch the most recent shift for the user by sorting in descending order based on `shiftStart`
      const shift = await prisma.shift.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { shiftStart: 'desc' }, // Sorting by shiftStart in descending order
      });
  
      if (!shift) return res.status(404).json({ message: "Shift not found" });
  
      res.json(shift);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  //update user shift
  router.put("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { shiftType, shiftStart, shiftEnd, shiftId } = req.body;
  
    // Validate shiftType
    if (!Object.values(ShiftType).includes(shiftType)) {
      return res.status(400).json({ error: "Invalid shiftType" });
    }
  
    const validShiftStart = new Date(shiftStart);
    const validShiftEnd = new Date(shiftEnd);
  
    if (isNaN(validShiftStart.getTime()) || isNaN(validShiftEnd.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
  
    try {
      const updatedShift = await prisma.shift.update({
        where: { id: parseInt(shiftId) },
        data: { shiftType, shiftStart: validShiftStart, shiftEnd: validShiftEnd },
      });
  
      if (!updatedShift) {
        return res.status(404).json({ message: "Shift not found" });
      }
  
      res.json({ message: "Shift updated successfully" });
    } catch (error) {
      console.error("Error updating shift:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

  // Assign a shift to a user
router.post("/assign-shift", async (req, res) => {
  const { userId, shiftId } = req.body;

  if (!userId || !shiftId) {
    return res.status(400).json({ error: "User ID and Shift ID are required" });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the shift exists
    const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    // Assign the shift to the user
    const assignedShift = await prisma.shift.update({
      where: { id: shiftId },
      data: {
        userId: userId,
      },
    });

    res.status(200).json({ message: "Shift assigned successfully", shift: assignedShift });
  } catch (error) {
    console.error("Error assigning shift:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
  module.exports = router;


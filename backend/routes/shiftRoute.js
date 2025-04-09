const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// --- CREATE SHIFT (No changes needed) ---
router.post("/create-shift", async (req, res) => {
  try{
    const { name, startTime, endTime } = req.body;
    // Basic validation
    if (!name || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields: name, startTime, endTime" });
    }
    const shift = await prisma.shift.create({
      data:{ name, startTime, endTime }
    });
    res.status(201).json({ message: "Shift created successfully", shift });
  } catch (error) {
    console.error("Error creating shift:", error); // Log specific error
    res.status(500).json({ message: "Internal server error creating shift" });
  }
});

// --- UPDATE/ASSIGN SHIFT (Changed from POST to PUT, using updateMany) ---
router.put("/assign-shift", async (req, res) => {
  try{
    const { userId, shiftId, startDate, endDate } = req.body;

    // Basic Validation
    if (!userId || !shiftId || !startDate) {
        return res.status(400).json({ message: "Missing required fields: userId, shiftId, startDate" });
    }

    // Ensure userId is a number if your schema expects it
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
        return res.status(400).json({ message: "Invalid userId format. Must be a number." });
    }

    // Use updateMany to update assignments for the given user
    // This will update *all* existing UserShift records for that userId.
    // If you intend to only update *one* specific record, you'd need its ID.
    // If you want to create if not exists (upsert), the logic would be different.
    const updateResult = await prisma.userShift.updateMany({
      where: { userId: numericUserId }, // Find records by userId
      data: {
        shiftId,          // Update the shiftId
        startDate,        // Update the startDate
        endDate           // Update the endDate (can be null)
      }
    });

    if (updateResult.count > 0) {
      // Optionally, fetch the updated records to return them
      // const updatedUserShifts = await prisma.userShift.findMany({ where: { userId: numericUserId }});
      res.status(200).json({ message: `Shift assignment updated successfully for user ${userId}`, count: updateResult.count });
    } else {
      // If no records were found for the user, maybe you want to create one?
      // Or just report that no user was found to update.
      // For now, let's treat it as "nothing to update" which might be an issue.
      // Consider creating if count is 0 if that's the desired behavior (upsert).
      // Let's try creating if nothing was updated (simple upsert logic)
       try {
            const newUserShift = await prisma.userShift.create({
                data: { userId: numericUserId, shiftId, startDate, endDate }
            });
            res.status(201).json({ message: "No existing assignment found, new shift assigned successfully", userShift: newUserShift });
       } catch (createError) {
            console.error("Error creating userShift after failed update:", createError);
             // Check for specific Prisma errors, e.g., foreign key constraint failure
            if (createError.code === 'P2003') { // Foreign key constraint failed (e.g., shiftId or userId doesn't exist)
                 return res.status(404).json({ message: "Failed to assign shift. User ID or Shift ID might not exist." });
            }
             if (createError.code === 'P2002') { // Unique constraint failed (if you have one)
                 return res.status(409).json({ message: "Assignment conflict. Check unique constraints." });
            }
            res.status(500).json({ message: "Internal server error assigning shift" });
       }
    }

  } catch (error) {
    console.error("Error assigning/updating shift:", error); // Log specific error
    // Check for specific Prisma errors if needed (e.g., P2025 Record not found for update - though updateMany handles this)
     if (error.code === 'P2003') { // Foreign key constraint failed (e.g., shiftId or userId doesn't exist in related tables)
         return res.status(404).json({ message: "Failed to assign shift. User ID or Shift ID might not exist." });
     }
    res.status(500).json({ message: "Internal server error assigning/updating shift" });
  }
});


// --- GET USER SHIFTS (Fetch assignments for a specific user - Changed param handling) ---
router.get("/get-shifts/:userId", async (req, res) => { // Use route parameter
  try{
    const { userId } = req.params; // Get userId from route params

    // Ensure userId is a number if your schema expects it
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
        return res.status(400).json({ message: "Invalid userId format. Must be a number." });
    }

    const userShifts = await prisma.userShift.findMany({
      where: { userId: numericUserId }, // Use the numeric ID
      include: {
          shift: {
              select: { name: true, startTime: true, endTime: true }
          }
      }
    });
    res.status(200).json({ message: "User shifts fetched successfully", userShifts });
  } catch (error) {
    console.error("Error fetching user shifts:", error); 
    res.status(500).json({ message: "Internal server error fetching user shifts" });
  }
});

router.get("/get-all-shifts", async (req, res) => {
    try {
        const allShifts = await prisma.shift.findMany();
        res.status(200).json({ message: "All shifts fetched successfully", shifts: allShifts });
    } catch (error) {
        console.error("Error fetching all shifts:", error); 
        res.status(500).json({ message: "Internal server error fetching all shifts" });
    }
});


router.put("/update-shift/:id", async (req, res) => { 
  try{
    const { id } = req.params;
    const { name, startTime, endTime } = req.body;

    // Basic validation
    if (!name && !startTime && !endTime) {
         return res.status(400).json({ message: "No update data provided (name, startTime, or endTime)" });
    }

    const shift = await prisma.shift.update({
      where: { id },
      data: { name, startTime, endTime }
    });
    res.status(200).json({ message: "Shift updated successfully", shift });
  } catch (error) {
    console.error("Error updating shift:", error); // Log specific error
     if (error.code === 'P2025') { // Record to update not found
        return res.status(404).json({ message: `Shift with ID ${id} not found.` });
     }
    res.status(500).json({ message: "Internal server error updating shift" });
  }
});

router.delete("/delete-shift/:id", async (req, res) => { 
  try{
    const { id } = req.params; 

     await prisma.userShift.deleteMany({
         where: { shiftId: id }
     });

    await prisma.shift.delete({
      where: { id } 
    });
    res.status(200).json({ message: "Shift deleted successfully" });

  } catch (error) {
    console.error("Error deleting shift:", error);
     if (error.code === 'P2025') { 
        return res.status(404).json({ message: `Shift with ID ${id} not found.` });
     }
    res.status(500).json({ message: "Internal server error deleting shift" });
  }
});

module.exports = router;
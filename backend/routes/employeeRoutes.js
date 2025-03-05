const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");


const router = express.Router();

// Get Employee Profile
router.get("/profile",authenticate, async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { attendance: true, leaves: true, notifications: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

module.exports = router;

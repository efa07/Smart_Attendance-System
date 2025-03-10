const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");


const router = express.Router();

// Get Employee Profile
router.get("/profile", authenticate, async (req, res) => {
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

router.get('/alluser', async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query; // Default: page 1, limit 10
  const offset = (page - 1) * limit; // Calculate the offset for pagination

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: search || '', mode: 'insensitive' } },
          { email: { contains: search || '', mode: 'insensitive' } },
          { department: { contains: search || '', mode: 'insensitive' } },
          { role: { contains: search || '', mode: 'insensitive' } },
        ],
      },
      skip: offset, // Skip records for pagination
      take: parseInt(limit), // imit the number of records
    });
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { fullName: { contains: search || '', mode: 'insensitive' } },
          { email: { contains: search || '', mode: 'insensitive' } },
          { department: { contains: search || '', mode: 'insensitive' } },
          { role: { contains: search || '', mode: 'insensitive' } },
        ],
      },
    });
    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});


router.put('/edit/:id', async (req, res) => {
  const { id } = req.params; //get it from url
  const { fullName, email, department, role } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Prepare data for update
    const updateData = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      department: department || user.department,
      role: role || user.role,
    };
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
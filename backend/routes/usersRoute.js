const express = require("express");
const prisma = require("../prismaClient");
const authenticate = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.put("/api/user/update", upload.single("profilePic"), async (req, res) => {
  try {
    const { fullName, email,password, department } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { fullName, department,password, pfrofilepic: profilePic },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});


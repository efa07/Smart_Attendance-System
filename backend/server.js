process.env.TZ = 'Africa/Addis_Ababa'; // Set timezone to Ethiopia
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoute = require("./routes/leaveRoute")
const attendanceRoutes = require("./routes/attendanceRoutes");
const multer = require('multer'); // For handling file uploads
const path = require('path');
const shiftRoute = require("./routes/shiftRoute")

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves",leaveRoute)
app.use("/api/shift",shiftRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store uploaded files in the "uploads" directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Use disk storage instead of memory storage
const upload = multer({ storage: storage });

// Ensure the "uploads" directory exists
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.post('/api/signup', async (req, res) => {
  const {  email,password,fullName,role,department } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
  email,
  password: hashedPassword,
  role,
  department,
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Email from request:', email);

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'user not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    console.log(user.profilePic)
    const token = jwt.sign({ userId: user.id ,username: user.fullName, role: user.role, department:user.department, profilePic:user.profilePic}, JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/api/update', upload.single('profilePic'), async (req, res) => {
  const { fullName, email, password, department } = req.body;
  const token = req.headers.authorization?.split(' ')[1]; 
  const profilePic = req.file ? req.file.filename : null; 

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      department: department || user.department,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (profilePic) {
      updateData.profilePic = profilePic;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
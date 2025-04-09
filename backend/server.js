require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadRoute = require("./routes/uploadRoute");
const employeeRoutes = require("./routes/employeeRoutes");
const leaveRoute = require("./routes/leaveRoute");
const payRoute = require("./routes/payRoute");
const shiftRoute = require("./routes/shiftRoute");
const attendanceRoutes = require("./routes/attendanceRoutes");
require("./tasks/attendanceCron");
require("./tasks/cronShift");
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(helmet());
app.use(cookieParser()); //secure JWT hhandling
app.use(express.json());
app.use(morgan('combined'));

//secure CORS config
const corsOptions = {
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true
};
app.use(cors(corsOptions));

// rate imiting for brut force attack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, //100 requestsfor 1 ip
  message: "Too many requests, please try again later."
});
app.use(limiter);

//file Upload Security
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images are allowed"));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Ensure the "uploads" dir exists
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoute);
app.use("/api/shift", shiftRoute);
app.use("/api/pay", payRoute);
app.use("/api/upload", uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//enforce HTTPS in production
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

//routes
app.get("/", (req, res) => {
  res.send("Server is running securely");
});

app.post('/api/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 3 }),
    body('fullName').trim().escape(),
    body('role').isIn(['department_head', 'employee','super_admin','hr_admin']), 
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, role, department, fingerprintId, rfidId } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { fullName, email, password: hashedPassword, role, department, fingerprintId, rfidId }
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ 
      userId: user.id, 
      username: user.fullName, 
      role: user.role, 
      department: user.department, 
      profilePic: user.profilePic, 
      fingerprintId: user.fingerprintId, 
      rfidId: user.rfidId 
    }, JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
    });
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

// Clears jwt cookie
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.status(200).json({ message: 'Logged out successfully' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});

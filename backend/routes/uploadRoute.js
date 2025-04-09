const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const prisma = require('../prismaClient');
const authenticate = require('../middleware/authMiddleware');

// Configure multer for CSV file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/csv';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.csv');
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Only CSV files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Route to handle CSV upload
router.post('/csv', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const errors = [];

  try {
    // Read and parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          // Parse data according to Prisma schema
          results.push({
            userId: parseInt(data.userId),
            checkIn: data.checkIn ? new Date(data.checkIn) : null,
            checkOut: data.checkOut ? new Date(data.checkOut) : null,
            status: data.status || null,
            clockOutStatus: data.clockOutStatus || null,
            recognizedFace: data.recognizedFace === 'true',
            overtime: data.overtime ? parseInt(data.overtime) : 0,
            fingerprintId: data.fingerprintId || null,
            rfidId: data.rfidId || null,
            shift: data.shift || null
          });
        })
        .on('error', (error) => reject(error))
        .on('end', () => resolve());
    });

    // Insert data into database
    for (const record of results) {
      try {
        // Create attendance record with proper schema mapping
        await prisma.attendance.create({
          data: {
            checkIn: record.checkIn,
            checkOut: record.checkOut,
            status: record.status,
            clockOutStatus: record.clockOutStatus,
            recognizedFace: record.recognizedFace,
            overtime: record.overtime,
            fingerprintId: record.fingerprintId,
            rfidId: record.rfidId,
            shift: record.shift,
            user: {
              connect: {
                id: record.userId
              }
            }
          }
        });
        console.log("Record created successfully");
      } catch (error) {
        console.log(error);
        errors.push({
          record: record,
          error: error.message
        });
      }
    }

    // Clean up - delete the uploaded file
    fs.unlinkSync(req.file.path);

    // Send response
    if (errors.length > 0) {
      return res.status(207).json({
        message: 'Upload completed with some errors',
        totalRecords: results.length,
        successfulRecords: results.length - errors.length,
        failedRecords: errors.length,
        errors: errors
      });
    }

    return res.status(200).json({
      message: 'Upload successful',
      totalRecords: results.length
    });

  } catch (error) {
    // Clean up file in case of error
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      error: 'Error processing CSV file',
      details: error.message
    });
  }
});

module.exports = router;

const nodemailer = require("nodemailer");
require("dotenv").config(); 

const emailSender = async (email, fullName, status) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: "Leave Request Status Update",
      text: `Hello ${fullName},\n\nYour leave request has been ${status}.\n\nBest regards,\nDepartment of Human Resources`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = emailSender;

# Attendance Management System

The **Attendance Management System** is a comprehensive solution designed to automate attendance tracking, reduce manual errors, and provide real-time reporting and analytics. It supports biometric/RFID-based attendance logging, role-based access control, and payroll-ready attendance reports.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Reporting & Analytics](#reporting--analytics)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### 1. **User Roles & Access Control**
- **Super Admin**: Full access to manage users, configure settings, and generate reports.
- **HR Admin**: Manage employee records, attendance policies, and generate reports.
- **Department Head**: View and approve attendance for their department.
- **Employee**: Check personal attendance history and apply for leaves.

### 2. **Attendance Tracking**
- Biometric Integration (Fingerprint, RFID, or Face Recognition).
- Manual Entry for exceptions or technical failures.
- Shift Management (Day/Night/Rotational shifts).
- Overtime Calculation for extra hours worked.
- Holiday & Leave Management (sick leaves, personal leaves, and official holidays).

### 3. **Reporting & Analytics**
- Daily, Weekly, and Monthly Attendance Reports.
- Late Comers & Early Leavers Reports.
- Absenteeism & Leave Reports.
- Department-Wise Attendance Reports.
- Export Data in CSV, Excel, and PDF formats.

### 4. **Notification System**
- Real-time alerts for late arrivals, absentees, and overtime.
- Email/SMS notifications for leave approvals.

---

## Technologies Used

- **Frontend**: Next.js, React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: postgres sql
- **Authentication**: JWT (JSON Web Tokens)
- **Biometric Integration**: Python (for face recognition), RFID/NFC libraries
- **Reporting**: Chart.js,
- **Notifications**: Twilio (SMS), Nodemailer (Email)

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Potgres
- Python (v3.8 or higher for biometric integration)
- Git
### Steps

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/face-attendance-system.git
    cd face-attendance-system
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up the database**:
    ```sh
    # Create a new database
    createdb attendance_system

    # Run migrations
    npm run migrate
    ```

4. **Configure environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL=postgres://username:password@localhost:5432/attendance_system
    JWT_SECRET=your_jwt_secret
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    EMAIL_SERVICE=your_email_service
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_pass
    ```

5. **Start the application**:
    ```sh
    npm start
    ```

---

## Usage

1. **Access the application**:
    Open your browser and navigate to `http://localhost:3000`.

2. **Login**:
    Use the credentials provided by the Super Admin to log in.

3. **Manage Attendance**:
    - Super Admin can configure settings and manage all users.
    - HR Admin can manage employee records and attendance policies.
    - Department Heads can approve attendance for their departments.
    - Employees can check their attendance history and apply for leaves.

---

## User Roles

Refer to the [Features](#features) section for detailed information on user roles and access control.

---

## Reporting & Analytics

Refer to the [Features](#features) section for detailed information on reporting and analytics capabilities.

---

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## Contact Us:
    - Email: efatariku07@gmail.com
    - phone: 0968595245



## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
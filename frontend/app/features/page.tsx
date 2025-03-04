import Head from 'next/head';
import Layout from '../../components/feature_Layout';

export default function FeaturesPage() {
  return (
    <Layout>
      <Head>
        <title>Attendance Management System - Features</title>
        <meta name="description" content="Explore the features of our Attendance Management System." />
      </Head>

      <header className="bg-white shadow-sm py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 tracking-tight">
            Features of Attendance Management System
          </h1>
        </div>
      </header>

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          {/* User Roles & Access Control */}
          <section className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-200">
              User Roles & Access Control
            </h2>
            <ul className="space-y-3 text-gray-600">
              {[
                { title: "Super Admin", desc: "Full access to manage users, configure settings, and generate reports." },
                { title: "HR Admin", desc: "Manage employee records, attendance policies, and generate reports." },
                { title: "Department Head", desc: "View and approve attendance for their department." },
                { title: "Employee", desc: "Check personal attendance history and apply for leaves." }
              ].map((role, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-800">{role.title}:</strong> {role.desc}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Attendance Tracking */}
          <section className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-200">
              Attendance Tracking
            </h2>
            <ul className="space-y-3 text-gray-600">
              {[
                { title: "Biometric Integration", desc: "Fingerprint, RFID, or face recognition for clock-in/out." },
                { title: "Manual Entry (Admin Override)", desc: "For exceptions or technical failures." },
                { title: "Shift Management", desc: "Supports different shifts (Day/Night/Rotational)." },
                { title: "Overtime Calculation", desc: "Tracks extra hours worked beyond shift timings." },
                { title: "Holiday & Leave Management", desc: "Tracks official holidays, sick leaves, and personal leaves." }
              ].map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-800">{feature.title}:</strong> {feature.desc}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Reporting & Analytics */}
          <section className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-200">
              Reporting & Analytics
            </h2>
            <ul className="space-y-3 text-gray-600">
              {[
                { title: "Daily/Weekly/Monthly Attendance Reports", desc: "Monitor attendance trends." },
                { title: "Late Comers & Early Leavers Reports", desc: "Identify patterns of tardiness." },
                { title: "Absenteeism & Leave Reports", desc: "Track absences and leave requests." },
                { title: "Department-Wise Attendance Reports", desc: "Analyze performance by department." },
                { title: "Export Data", desc: "Export reports in CSV, Excel, and PDF formats." }
              ].map((report, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-800">{report.title}:</strong> {report.desc}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Notification System */}
          <section className="bg-white rounded-xl shadow-md p-8 transition-all hover:shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3 border-gray-200">
              Notification System
            </h2>
            <ul className="space-y-3 text-gray-600">
              {[
                { title: "Real-time Alerts", desc: "Notify late arrivals, absentees, and overtime." },
                { title: "Email/SMS Notifications", desc: "Confirm leave approvals and other updates." }
              ].map((notification, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-gray-800">{notification.title}:</strong> {notification.desc}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
"use client"
import { useState, useEffect } from 'react';

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
}

export default function AttendanceReports() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<{ [key: string]: number }>({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await fetch(`http://localhost:3001/api/attendance/reports?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      setRecords(data.records);
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching attendance reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const handleDownloadCSV = () => {
    // Convert records to CSV format
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Check-In,Check-Out,Status\n" 
      + records.map(record => 
          `${record.checkIn ? record.checkIn.split("T")[0] : "null"},` +
          `${record.checkIn ? record.checkIn.split("T")[1].slice(0, 5) : "null"},` +
          `${record.checkOut ? record.checkOut.split("T")[1].slice(0, 5) : "null"},` +
          `${record.status}`
        ).join("\n");

    // Create a link element to trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Reports</h1>
      
      {/* Filter Form */}
      <div className="w-full max-w-md bg-white shadow rounded p-6 mb-6">
        <form onSubmit={handleFilterSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-800 font-medium mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-800 font-medium mb-2">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200"
          >
            {loading ? 'Loading...' : 'Filter Reports'}
          </button>
        </form>
      </div>

      {/* Summary Card */}
      <div className="w-full max-w-2xl bg-white shadow rounded p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded p-4 text-center">
            <p className="text-gray-700">Present</p>
            <p className="text-xl font-bold text-gray-900">{summary.Present || 0}</p>
          </div>
          <div className="bg-gray-100 rounded p-4 text-center">
            <p className="text-gray-700">Late</p>
            <p className="text-xl font-bold text-gray-900">{summary.Late || 0}</p>
          </div>
          <div className="bg-gray-100 rounded p-4 text-center">
            <p className="text-gray-700">Absent</p>
            <p className="text-xl font-bold text-gray-900">{summary.Absent || 0}</p>
          </div>
        </div>
      </div>

      {/* Detailed Records Table */}
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Detailed Records</h2>
          <button
            onClick={handleDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-gray-800">Date</th>
                <th className="px-4 py-2 border-b text-gray-800">Check-In</th>
                <th className="px-4 py-2 border-b text-gray-800">Check-Out</th>
                <th className="px-4 py-2 border-b text-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b text-gray-700">{record.checkIn ? record.checkIn.split("T")[0] : "null"}</td>
                    <td className="px-4 py-2 border-b text-gray-700">{record.checkIn ? record.checkIn.split("T")[1].slice(0, 5) : "null"}</td>
                    <td className="px-4 py-2 border-b text-gray-700">
                      {record.checkOut ? record.checkOut.split("T")[1].slice(0,5) : 'null'}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700">{record.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-700">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
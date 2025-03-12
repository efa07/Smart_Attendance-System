"use client"
import { useState, useEffect } from 'react';

interface Leave {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function LeaveManagement() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [history, setHistory] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3001/api/leave/history',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching leave history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem('token');

    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:3001/api/leave/apply', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leaveType, startDate, endDate })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Leave applied successfully!');
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        fetchHistory();
      } else {
        setMessage(data.message || 'Error applying for leave');
      }
    } catch (error) {
      setMessage('Error applying for leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Leave Management</h1>
      
      {/* Leave Application Form */}
      <div className="w-full max-w-md bg-white shadow rounded p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="leaveType" className="block text-gray-800 font-medium mb-2">
              Leave Type
            </label>
            <input
              id="leaveType"
              type="text"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              placeholder="e.g., Annual, Sick, etc."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-800 font-medium mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200"
          >
            {loading ? 'Submitting...' : 'Apply for Leave'}
          </button>
          {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
        </form>
      </div>

      {/* Leave History Table */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-gray-800">Leave Type</th>
                <th className="px-4 py-2 border-b text-gray-800">Start Date</th>
                <th className="px-4 py-2 border-b text-gray-800">End Date</th>
                <th className="px-4 py-2 border-b text-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-4 py-2 border-b text-gray-700">{leave.leaveType}</td>
                    <td className="px-4 py-2 border-b text-gray-700">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700">{leave.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-700">
                    No leave records found.
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

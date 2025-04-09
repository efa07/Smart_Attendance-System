"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Shift {
  name: string;
  startTime: string;
  endTime: string;
}

interface UserShift {
  id: string;
  userId: number;
  shiftId: string;
  startDate: string;
  endDate: string | null;
  shift: Shift;
}

export default function UserShifts() {
  const [shifts, setShifts] = useState<UserShift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    const fetchShifts = async () => {
      const userId = localStorage.getItem('userId');

      try {
        console.log(`Fetching shifts for user: ${userId}`);
        const response = await fetch(`${API_URL}/api/shift/get-shifts/${userId}`);
        const data = await response.json();
        setShifts(data.userShifts);
        console.log("Fetched shifts:", data.userShifts);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setError("Failed to fetch shifts");
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
      fetchShifts();
  }, []); 

  if (loading) return <p>Loading shifts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (shifts.length === 0) return <p>No shifts assigned.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center ">Your Shifts</h2>
        <div className="grid gap-6">
          {shifts.map((shift) => (
            <Card key={shift.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">{shift.shift.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      shift.endDate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {shift.endDate ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium">{shift.shift.startTime}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">End Time</p>
                      <p className="font-medium">{shift.shift.endTime}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium">{new Date(shift.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">{shift.endDate ? new Date(shift.endDate).toLocaleDateString() : "Ongoing"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

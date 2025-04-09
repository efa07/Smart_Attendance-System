"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import MoonLoader from "react-spinners/ClipLoader";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const shiftOptions = ["Morning", "Evening", "Night"]; 

const ShiftManagement = () => {
  const [shifts, setShifts] = useState<{ 
    id: number; 
    user: { fullName: string; id: number; email: string; department: string }; 
    shiftType: string; 
    shiftStart: string; 
    shiftEnd: string 
  }[]>([]);
  const [newShift, setNewShift] = useState({ shiftType: "", shiftStart: "", shiftEnd: "" });
  const [selectedShift, setSelectedShift] = useState("");
  const [shift, setShift] = useState({ shiftType: "", shiftStart: "", shiftEnd: "", id: 0 });
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedUserId && storedRole) {
      setUserId(parseInt(storedUserId, 10));
      setRole(storedRole);
    }
  }, []);

  // Fetch shifts from backend
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/shift/shifts`);
        if (!response.ok) throw new Error("Failed to fetch shifts");
        const data = await response.json();
        setShifts(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setError("Failed to fetch shifts");
      }
    };
    fetchShifts();
  }, []);

  // Add a new shift
  const addShift = async () => {
    if (!newShift.shiftType || !newShift.shiftStart || !newShift.shiftEnd) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/shift/shift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          shiftType: newShift.shiftType,
          shiftStart: new Date(newShift.shiftStart).toISOString(),
          shiftEnd: new Date(newShift.shiftEnd).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create shift");
      }

      const createdShift = await response.json();
      setShifts([...shifts, createdShift]);
      setNewShift({ shiftType: "", shiftStart: "", shiftEnd: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding shift:", error);
      setError(error instanceof Error ? error.message : "Failed to create shift");
    }
  };

  // Fetch the current user's shifts
  useEffect(() => {
    const fetchUserShifts = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${API_URL}/api/shift/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user shifts");
        const data = await response.json();
        if (data.length > 0) {
          setShift(data[0]); // Set the most recent shift
        }
      } catch (error) {
        console.error("Error fetching user shifts:", error);
        setError("Failed to fetch user shifts");
      } finally {
        setLoading(false);
      }
    };

    fetchUserShifts();
  }, [userId]);

  // Update shift
  const updateShift = async () => {
    if (!shift.id || !shift.shiftType || !shift.shiftStart || !shift.shiftEnd) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/shift/shift/${shift.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          shiftType: shift.shiftType,
          shiftStart: new Date(shift.shiftStart).toISOString(),
          shiftEnd: new Date(shift.shiftEnd).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update shift");
      }

      const updatedShift = await response.json();
      setShifts(shifts.map(s => s.id === updatedShift.id ? updatedShift : s));
      setError(null);
      alert("Shift updated successfully!");
    } catch (error) {
      console.error("Error updating shift:", error);
      setError(error instanceof Error ? error.message : "Failed to update shift");
    }
  };
  
 // Assign a shift to a selected userId
 const assignShift = async () => {
  if (!selectedShift || !userId) return;

  const selectedShiftData = shifts.find(shift => shift.shiftType === selectedShift);
  if (!selectedShiftData) return;

  try {
    const response = await fetch(`${API_URL}/api/shift/assign-shift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        shiftId: selectedShiftData.id, 
      }),
    });

    if (response.ok) {
      alert("Shift assigned successfully!");
    } else {
      throw new Error("Failed to assign shift");
    }
  } catch (error) {
    console.error("Error assigning shift:", error);
  }
};

  if (loading) return <div className="w-full flex justify-center items-center h-screen"><MoonLoader/></div>;


  return (
    <div className="p-4 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className={role === "employee" ? "" : "hidden"}>
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">My Shift</h2>
      <Card>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Current Shift</h3>
            <p><strong>Shift Type:</strong> {shift?.shiftType || "N/A"}</p>
            <p><strong>Start Time:</strong> {shift?.shiftStart ? new Date(shift.shiftStart).toLocaleString() : "N/A"}</p>
            <p><strong>End Time:</strong> {shift?.shiftEnd ? new Date(shift.shiftEnd).toLocaleString() : "N/A"}</p>

            <h3 className="font-semibold mt-4">Update Shift</h3>
            <Select onValueChange={(value) => setShift({ ...shift, shiftType: value })}>
              <SelectTrigger><SelectValue placeholder="Select Shift Type" /></SelectTrigger>
              <SelectContent>
                {shiftOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="datetime-local" 
              value={shift.shiftStart ? new Date(shift.shiftStart).toISOString().slice(0, 16) : ""} 
              onChange={(e) => setShift({ ...shift, shiftStart: e.target.value })} 
            />
            <Input 
              type="datetime-local" 
              value={shift.shiftEnd ? new Date(shift.shiftEnd).toISOString().slice(0, 16) : ""} 
              onChange={(e) => setShift({ ...shift, shiftEnd: e.target.value })} 
            />
            <Button onClick={updateShift}>Update Shift</Button>
          </CardContent>
        </Card>
    </div>
</div>
  {/* Add Shift Section */}
    <div className={role === "employee" ? "hidden" : ""}>
      <h2 className="text-xl font-bold">Shift Management</h2>
      <Card>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Add New Shift</h3>
            <Select onValueChange={(value) => setNewShift({ ...newShift, shiftType: value })}>
              <SelectTrigger><SelectValue placeholder="Select Shift Type" /></SelectTrigger>
              <SelectContent>
                {shiftOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="datetime-local" 
              value={newShift.shiftStart} 
              onChange={(e) => setNewShift({ ...newShift, shiftStart: e.target.value })} 
            />
            <Input 
              type="datetime-local" 
              value={newShift.shiftEnd} 
              onChange={(e) => setNewShift({ ...newShift, shiftEnd: e.target.value })} 
            />
            <Button onClick={addShift}>Add Shift</Button>
          </CardContent>
        </Card>
</div>
<div className={role === "employee" ? "hidden" : ""}>
      {/* Shift List */}
      <Card>
        <CardContent>
          <h3 className="font-semibold mb-2">Existing Shifts</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell><b>User Name</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>Shift</b></TableCell>
                <TableCell><b>Start Time</b></TableCell>
                <TableCell><b>End Time</b></TableCell>
              </TableRow>
            </TableHeader>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.user.fullName}</TableCell>
                <TableCell>{shift.user.department}</TableCell>
                <TableCell>{shift.shiftType}</TableCell>
                <TableCell>{new Date(shift.shiftStart).toLocaleString()}</TableCell>
                <TableCell>{new Date(shift.shiftEnd).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>
      </div>
      {/* Assign Shift Section */}
      <Card className={role === "employee" ? "hidden" : ""}>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Assign Shift</h3>
            <Input
              placeholder="Employee Name"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
            />
            <Button onClick={assignShift}>Assign Shift</Button>
          </CardContent>
        </Card>
    </div>
  );
};

export default ShiftManagement;

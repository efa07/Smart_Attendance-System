"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";

const API_URL = "http://localhost:3001/api/shift";

const shiftOptions = ["Morning", "Evening", "Night"]; // Shift type options

const ShiftManagement = () => {
  const [shifts, setShifts] = useState<{ id: number; user: any; shiftType: string; shiftStart: string; shiftEnd: string }[]>([]);
  const [newShift, setNewShift] = useState({ shiftType: "", shiftStart: "", shiftEnd: "" });
  const [assignments, setAssignments] = useState<{ employee: string; shift: string }[]>([]);
  const [employee, setEmployee] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [shift, setShift] = useState({ shiftType: "", shiftStart: "", shiftEnd: "", id: 0 });
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

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
        const response = await fetch(`${API_URL}/shifts`);
        const data = await response.json();
        setShifts(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };
    fetchShifts();
  }, []);

  // Add a new shift
  const addShift = async () => {
    if (!newShift.shiftType || !newShift.shiftStart || !newShift.shiftEnd) return;

    try {
      const response = await fetch(`${API_URL}/shift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          shiftType: newShift.shiftType,
          shiftStart: newShift.shiftStart,
          shiftEnd: newShift.shiftEnd,
        }),
      });

      if (!response.ok) throw new Error("Failed to create shift");

      const createdShift = await response.json();
      setShifts([...shifts, createdShift]);
      setNewShift({ shiftType: "", shiftStart: "", shiftEnd: "" });
    } catch (error) {
      console.error("Error adding shift:", error);
    }
  };

  // Fetch the current user's shift
  useEffect(() => {
    const fetchUserShift = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${API_URL}/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setShift(data);
        }
      } catch (error) {
        console.error("Error fetching user shift:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserShift();
  }, [userId]);

  // Update shift
  const updateShift = async () => {
    if (!shift.id || !shift.shiftType || !shift.shiftStart || !shift.shiftEnd) return;

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftId: shift.id,
          shiftType: shift.shiftType,
          shiftStart: shift.shiftStart,
          shiftEnd: shift.shiftEnd,
        }),
      });

      if (!response.ok) throw new Error("Failed to update shift");
      alert("Shift updated successfully!");
    } catch (error) {
      console.error("Error updating shift:", error);
    }
  };
  
 // Assign a shift to a selected userId
 const assignShift = async () => {
  if (!selectedShift || !userId) return;

  const selectedShiftData = shifts.find(shift => shift.shiftType === selectedShift);
  if (!selectedShiftData) return;

  try {
    const response = await fetch(`${API_URL}/assign-shift`, {
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

  if (loading) return <p>Loading...</p>;


  return (
    <div className="p-4 space-y-6">
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
            <Input type="datetime-local" value={shift.shiftStart} onChange={(e) => setShift({ ...shift, shiftStart: e.target.value })} />
            <Input type="datetime-local" value={shift.shiftEnd} onChange={(e) => setShift({ ...shift, shiftEnd: e.target.value })} />
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
            <Input type="datetime-local" value={newShift.shiftStart} onChange={(e) => setNewShift({ ...newShift, shiftStart: e.target.value })} />
            <Input type="datetime-local" value={newShift.shiftEnd} onChange={(e) => setNewShift({ ...newShift, shiftEnd: e.target.value })} />
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
                <TableCell><b>Shift</b></TableCell>
                <TableCell><b>Start Time</b></TableCell>
                <TableCell><b>End Time</b></TableCell>
              </TableRow>
            </TableHeader>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.user.fullName}</TableCell>
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
      <Card>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Assign Shift</h3>
            <Input
              placeholder="Employee Name"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            />
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger>Select a Shift</SelectTrigger>
              <SelectContent>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.shiftType}>
                    {shift.shiftType} ({new Date(shift.shiftStart).toLocaleString()} - {new Date(shift.shiftEnd).toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={assignShift}>Assign Shift</Button>
          </CardContent>
        </Card>
    </div>
  );
};

export default ShiftManagement;

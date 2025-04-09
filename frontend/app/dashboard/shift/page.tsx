"use client";
import React, { useState, useEffect, useCallback } from "react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";  
import axios, { AxiosError } from "axios";
import { toast } from 'react-toastify';
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

// Interface for the Shift model (template for creating/updating shifts)
interface Shift {
  id: string;
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
  shift?: {           
      name: string;
      startTime: string;
      endTime: string;
  }
}

export default function ShiftManagement() {
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [userAssignments, setUserAssignments] = useState<UserShift[]>([]);
  const [newShiftName, setNewShiftName] = useState("");
  const [newShiftStartTime, setNewShiftStartTime] = useState("");
  const [newShiftEndTime, setNewShiftEndTime] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(""); 
  const [selectedShiftId, setSelectedShiftId] = useState(""); 
  const [assignmentStartDate, setAssignmentStartDate] = useState(new Date().toISOString().split('T')[0]); 
  const [assignmentEndDate, setAssignmentEndDate] = useState<string | null>(null); 

  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [isSubmittingShift, setIsSubmittingShift] = useState(false);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);


  const fetchAllShifts = useCallback(async () => {
    setIsLoadingShifts(true);
    try {
      const response = await axios.get<{ shifts: Shift[] }>(`${API_URL}/api/shift/get-all-shifts`);
      setAllShifts(response.data.shifts || []);
    } catch (error) {
      console.error("Error fetching all shifts:", error);
      toast.error("Failed to load available shifts.");
    } finally {
      setIsLoadingShifts(false);
    }
  }, []); 

  const fetchUserAssignments = useCallback(async (userId: string) => {
    if (!userId) {
        setUserAssignments([]); 
        return;
    };
    setIsLoadingAssignments(true);
    setUserAssignments([]); 
    try {
      const response = await axios.get<{ userShifts: UserShift[] }>(`${API_URL}/api/shift/get-shifts/${userId}`);
      setUserAssignments(response.data.userShifts || []);
    } catch (error) {
      console.error(`Error fetching assignments for user ${userId}:`, error);
      toast.error(`Failed to load assignments for user ${userId}.`);
      setUserAssignments([]);
    } finally {
        setIsLoadingAssignments(false);
    }
  }, []); 

  useEffect(() => {
    fetchAllShifts();
  }, [fetchAllShifts]); 


  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!newShiftName || !newShiftStartTime || !newShiftEndTime) {
        toast.warning("Please fill in all fields for the new shift.");
        return;
    }
    setIsSubmittingShift(true);
    try {
      await axios.post(`${API_URL}/api/shift/create-shift`, {
          name: newShiftName,
          startTime: newShiftStartTime,
          endTime: newShiftEndTime
      });
      toast.success(`Shift "${newShiftName}" created successfully.`);
      setNewShiftName("");
      setNewShiftStartTime("");
      setNewShiftEndTime("");
      fetchAllShifts(); 
    } catch (error) {
      console.error("Error creating shift:", error);
       const message = (error as AxiosError<{ message: string }>)?.response?.data?.message || "Failed to create shift.";
      toast.error(`Error creating shift: ${message}`);
    } finally {
        setIsSubmittingShift(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserId = e.target.value;
    setSelectedUserId(newUserId);
    if (newUserId) {
        fetchUserAssignments(newUserId);
    } else {
        setUserAssignments([]); 
    }
  }

  const handleAssignOrUpdateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedShiftId) {
      toast.warning("Please provide both a User ID and select a Shift to assign.");
      return;
    }

    setIsSubmittingAssignment(true);

    try {
      const response = await axios.put(`${API_URL}/api/shift/assign-shift`, {
        userId: selectedUserId,
        shiftId: selectedShiftId,
        startDate: assignmentStartDate ? new Date(assignmentStartDate).toISOString() : new Date().toISOString(),
        endDate: assignmentEndDate ? new Date(assignmentEndDate).toISOString() : null
      });

      toast.success(response.data.message || "Shift assignment updated successfully."); 

      fetchUserAssignments(selectedUserId);


    } catch (error) {
      console.error("Error assigning/updating shift:", error);
      const message = (error as AxiosError<{ message: string }>)?.response?.data?.message || "Failed to assign or update shift.";
      toast.error(`Error: ${message}`);
    } finally {
        setIsSubmittingAssignment(false);
    }
  };


  const handleDeleteShiftTemplate = async (shiftId: string, shiftName: string) => {
    if (confirm(`Are you sure you want to delete the shift template "${shiftName}"? This will also remove all assignments using this shift.`)) {
      try {
        await axios.delete(`${API_URL}/shift/delete-shift/${shiftId}`);
        toast.success(`Shift template "${shiftName}" deleted successfully.`);
        fetchAllShifts(); 
        if (selectedUserId) {
            fetchUserAssignments(selectedUserId);
        }
      } catch (error) {
        console.error("Error deleting shift template:", error);
        const message = (error as AxiosError<{ message: string }>)?.response?.data?.message || "Failed to delete shift template.";
        toast.error(`Error: ${message}`);
      }
    }
  };


  return (
    <div className="p-6 space-y-6">
       {/* Card for Creating New Shift Templates */}
      <Card>
        <CardHeader>
            <CardTitle>Create New Shift Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateShift} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                 placeholder="Shift Name (e.g., Morning Shift)"
                 value={newShiftName}
                 onChange={(e) => setNewShiftName(e.target.value)}
                 required
                 disabled={isSubmittingShift}
              />
              <Input
                 type="time"
                 aria-label="Start Time"
                 value={newShiftStartTime}
                 onChange={(e) => setNewShiftStartTime(e.target.value)}
                 required
                 disabled={isSubmittingShift}
              />
              <Input
                 type="time"
                 aria-label="End Time"
                 value={newShiftEndTime}
                 onChange={(e) => setNewShiftEndTime(e.target.value)}
                 required
                 disabled={isSubmittingShift}
              />
            </div>
            <Button type="submit" disabled={isSubmittingShift}>
              {isSubmittingShift ? "Creating..." : "Create Shift"}
            </Button>
          </form>
        </CardContent>
      </Card>

       {/* Card for Assigning/Updating Shifts for a User */}
      <Card>
        <CardHeader>
            <CardTitle>Assign or Update User Shift</CardTitle>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleAssignOrUpdateShift} className="space-y-4">
             {/* User Selection */}
             <div>
               <label htmlFor="userIdInput" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
               <Input
                  id="userIdInput"
                  placeholder="Enter User ID to manage shifts"
                  value={selectedUserId}
                  onChange={handleUserChange} // Use specific handler
                  required
                  disabled={isSubmittingAssignment}
               />
             </div>

             {/* Shift Selection Dropdown */}
             <div>
                <label htmlFor="shiftSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Shift</label>
                <Select
                    value={selectedShiftId}
                    onValueChange={setSelectedShiftId} // Update state on change
                    required
                    disabled={!selectedUserId || isLoadingShifts || isSubmittingAssignment} // Disable if no user or loading
                 >
                   <SelectTrigger id="shiftSelect">
                      <SelectValue placeholder={isLoadingShifts ? "Loading shifts..." : "Select a shift"} />
                   </SelectTrigger>
                   <SelectContent>
                      {allShifts.length === 0 && !isLoadingShifts && <SelectItem value="" disabled>No shifts available</SelectItem>}
                      {allShifts.map((shift) => (
                         <SelectItem key={shift.id} value={shift.id}>
                           {shift.name} ({shift.startTime} - {shift.endTime})
                         </SelectItem>
                      ))}
                   </SelectContent>
                </Select>
             </div>

             {/* Start and End Date Inputs */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDateInput" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <Input
                        id="startDateInput"
                        type="date"
                        value={assignmentStartDate}
                        onChange={(e) => setAssignmentStartDate(e.target.value)}
                        required
                        disabled={isSubmittingAssignment}
                     />
                </div>
                 <div>
                    <label htmlFor="endDateInput" className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <Input
                        id="endDateInput"
                        type="date"
                        value={assignmentEndDate ?? ''} // Handle null value for input
                        onChange={(e) => setAssignmentEndDate(e.target.value || null)} // Set to null if empty
                        disabled={isSubmittingAssignment}
                     />
                 </div>
             </div>

             <Button type="submit" disabled={!selectedUserId || !selectedShiftId || isSubmittingAssignment || isLoadingAssignments}>
                 {isSubmittingAssignment ? "Assigning..." : "Assign/Update Shift"}
             </Button>
           </form>
        </CardContent>
      </Card>

       {/* Table Displaying Assignments for the Selected User */}
      <Card>
         <CardHeader>
             <CardTitle>Current Assignments for User: {selectedUserId || '(Select User ID)'}</CardTitle>
         </CardHeader>
         <CardContent>
             {isLoadingAssignments && <p>Loading assignments...</p>}
             {!isLoadingAssignments && userAssignments.length === 0 && selectedUserId && <p>No assignments found for this user.</p>}
             {!isLoadingAssignments && userAssignments.length === 0 && !selectedUserId && <p>Enter a User ID above to view assignments.</p>}

             {userAssignments.length > 0 && (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Shift Name</TableHead>
                    <TableHead>Shift Time</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    {/* <TableHead>Actions</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                        <TableCell>{assignment.shift?.name ?? 'N/A'}</TableCell>
                        <TableCell>{assignment.shift ? `${assignment.shift.startTime} - ${assignment.shift.endTime}` : 'N/A'}</TableCell>
                        <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : "Active"}</TableCell>
                       {/* <TableCell>
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => handleDeleteAssignment(assignment.id)}
                           disabled // Enable when API is ready
                         >
                           Delete Assignment
                         </Button>
                       </TableCell> */}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
             )}
         </CardContent>
      </Card>

       {/* Optional: Table listing all shift templates for deletion */}
       <Card>
           <CardHeader>
               <CardTitle>Manage Shift Templates</CardTitle>
           </CardHeader>
           <CardContent>
                {isLoadingShifts && <p>Loading shift templates...</p>}
                {!isLoadingShifts && allShifts.length === 0 && <p>No shift templates created yet.</p>}
                {allShifts.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allShifts.map((shift) => (
                                <TableRow key={shift.id}>
                                    <TableCell>{shift.name}</TableCell>
                                    <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteShiftTemplate(shift.id, shift.name)}
                                        >
                                            Delete Template
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
           </CardContent>
       </Card>
    </div>
  );
}
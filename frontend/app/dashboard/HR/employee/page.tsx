"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link"
interface User {
  id: number;
  fullName: string;
  email: string;
  department: string;
  role: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  // Fetch users with pagination and search
  const fetchUsers = async (page: number = 1, query: string = '') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3001/api/employees/alluser?search=${query}&page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users!');
    }
  };

  // Fetch users on component mount or when page/limit changes
  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage, limit]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to the first page when searching
    fetchUsers(1, searchQuery);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle input change for editing user
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof User) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [field]: e.target.value });
    }
  };

  // Handle save button click
  const handleSaveClick = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3001/api/employees/edit/${editingUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (!res.ok) throw new Error('Failed to update user');
      const updatedUser = await res.json();

      // Update the users list with the edited user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      // Clear the editing state
      setEditingUser(null);
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user!');
    }
  };
  const confirmDelete = (userId: number) => {
    setDeleteUserId(userId);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteUserId === null) return;
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3001/api/employees/delete/${deleteUserId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) throw new Error('Failed to delete user');
  
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteUserId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user!');
    } finally {
      setIsDialogOpen(false);
      setDeleteUserId(null);
    }
  };
  
  // Handle delete button click
  const handleDeleteClick = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3001/api/employees/delete/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to delete user');

      // Remove the deleted user from the list
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user!');
    }
  };

  return (
    <div className="p-6 text-black min-h-screen font-[Rajdhani]">
      <h1 className="text-3xl mb-4 text-center">Admin User Management</h1>
      <Card className="bg-white text-black">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-around w-1/3"> <Input
              placeholder="Search Users..."
              className="w-fit bg-zinc text-black placeholder-gray-400"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="outline" onClick={handleSearchClick}>
              Search
            </Button></div>
           <Link href="/signup"> <Button variant="outline" onClick={handleSearchClick}>
              Add User
            </Button> </Link>
            
          </div>
         
          <Table>
            <TableHeader>
              <TableRow className="bg-white ">
                <TableHead className="text-black font-extrabold">Id</TableHead>
                <TableHead className="text-black font-extrabold">Name</TableHead>
                <TableHead className="text-black font-extrabold">Email</TableHead>
                <TableHead className="text-black font-extrabold">Department</TableHead>
                <TableHead className="text-black font-extrabold">Role</TableHead>
                <TableHead className="text-black font-extrabold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b border-gray-300">
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.fullName}
                        onChange={(e) => handleInputChange(e, 'fullName')}
                      />
                    ) : (
                      user.fullName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.department}
                        onChange={(e) => handleInputChange(e, 'department')}
                      />
                    ) : (
                      user.department
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.role}
                        onChange={(e) => handleInputChange(e, 'role')}
                      />
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Button onClick={handleSaveClick}>Save</Button>
                    ) : (
                      <>
                        <Button
                          variant="destructive"
                          className="mx-2"
                          onClick={() => confirmDelete(user.id)}
                          >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          className="mx-2"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToastContainer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent>
    <DialogTitle>Confirm Deletion</DialogTitle>
    <DialogDescription>
      Are you sure you want to delete this user? This action cannot be undone.
    </DialogDescription>
    <DialogFooter className="flex justify-end">
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleConfirmDelete}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default AdminUserManagement;
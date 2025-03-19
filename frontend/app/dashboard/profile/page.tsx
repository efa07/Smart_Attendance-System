"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from 'react-toastify';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface User {
  fullName: string;
  email: string;
  password: string;
  department: string;
  profilePic: string;
}

export default function ProfileSettings() {
  const [user, setUser] = useState<User>({
    fullName: "",
    email: "",
    password: "",
    department: "",
    profilePic: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const token = localStorage.getItem('token');

    formData.append("fullName", user.fullName);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("department", user.department);
    if (file) formData.append("profilePic", file);

    try {
      await axios.put(`${API_URL}/api/update`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white text-black p-6 rounded-lg shadow-md border border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            type="text"
            id="department"
            name="department"
            value={user.department}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <Label htmlFor="profilePic">Profile Picture</Label>
          <Input
            type="file"
            id="profilePic"
            onChange={handleFileChange}
            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Update Profile</Button>
      </form>
    </div>
  );
}

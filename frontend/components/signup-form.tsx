"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export function SignUpForm({ className, ...props }: React.ComponentProps<"form">) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
  const [department, setDepartment] = useState<string>("");
  const router = useRouter();
  
  useEffect(() => {
    setIsAdmin(localStorage.getItem("role"));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password || !role || !department) {
      alert("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/signup`, {
        fullName,
        email,
        password,
        role,
        department,
      });
      alert(response.data.message);
      router.push("/login")
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup");
    }
  };

  if (isAdmin !== "hr_admin") {
    return <h1>Access Denied</h1>;
  }
  
  return (
    
    <form className={cn("flex flex-col gap-5", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your info below to Sign up.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Efa Tariku"
            required
            value={fullName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="efa@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="hr_admin">HR Admin</SelectItem>
              <SelectItem value="department_head">Department Head</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="department">Department</Label>
          <Select onValueChange={(value) => setDepartment(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="r1">Room one</SelectItem>
              <SelectItem value="r2">Room two</SelectItem>
              <SelectItem value="r3">Room three</SelectItem>
              <SelectItem value="r4">Room four</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Create account
        </Button>
      </div>

      <div className="text-center text-sm">
        You have an account?{" "}
        <a href="login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
 
  );
}
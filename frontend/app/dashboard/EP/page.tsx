"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BiometricAttendance() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const fingerprintId =  localStorage.getItem("fingerprintId");
  const rfidId = localStorage.getItem("rfidId");

  const handleAttendance = async (method: "FingerPrint" | "RFID") => {
    try {
      const token =  localStorage.getItem("token");

      if (!token) {
        toast.error("Not authenticated. Please log in.");
        return;
      }

      const res = await fetch(`${API_URL}/api/attendance/clock-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        key:method,
        method: method === "FingerPrint" ? fingerprintId : rfidId, 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to record attendance");

      }

      setMessage(`${method} attendance recorded successfully!`);
      toast.success(`${method} attendance recorded successfully!`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);

      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-2xl font-bold">Biometric Attendance</h1>
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => handleAttendance("FingerPrint")}
          disabled={loading}
          className="flex items-center space-x-2 p-4"
        >
          <Fingerprint className="w-6 h-6" />
          <span>Use Fingerprint</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => handleAttendance("RFID")}
          disabled={loading}
          className="flex items-center space-x-2 p-4"
        >
          <CreditCard className="w-6 h-6" />
          <span>Use RFID</span>
        </Button>
      </div>
      {message && (
        <div className="mt-4 flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-6 h-6" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

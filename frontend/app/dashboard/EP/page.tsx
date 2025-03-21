"use client";
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BiometricAttendance() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fingerprintId, setFingerprintId] = useState("")
  const [rfidId,setRfidId] = useState("")

  useEffect(() =>{
    const fingerprintId = localStorage.getItem("fingerprintId") ?? '';
    setFingerprintId(fingerprintId)
    const rfidId = localStorage.getItem("rfidId") ?? "";
    setRfidId(rfidId)
  },[])
  

  const handleAttendance = async (method: "FingerPrint" | "RFID") => {
    try {
      setLoading(true);
      setMessage("");
      const token = localStorage.getItem("token");

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
          key: method,
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
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-6">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
        Biometric Attendance
      </h1>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Button
          variant="outline"
          onClick={() => handleAttendance("FingerPrint")}
          disabled={loading}
          className="flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
          <span className="font-semibold">Use Fingerprint</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => handleAttendance("RFID")}
          disabled={loading}
          className="flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
          <span className="font-semibold">Use RFID</span>
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div className="mt-6 flex items-center space-x-3 text-green-600 dark:text-green-400 text-lg font-medium">
          <CheckCircle className="w-6 h-6" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            Biometric Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Choose your preferred method to record attendance
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-12">
          <Button
            variant="outline"
            onClick={() => handleAttendance("FingerPrint")}
            disabled={loading}
            className="group relative flex flex-col items-center justify-center aspect-square w-48 h-48 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 dark:hover:border-blue-400 overflow-hidden mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-500/10 transition-all duration-300 rounded-full" />
            {loading ? (
              <Loader2 className="animate-spin w-12 h-12 text-blue-500 mb-2" />
            ) : (
              <Fingerprint className="w-22 h-22 text-blue-500 group-hover:scale-110 transition-transform duration-300 mb-2" />
            )}
            <span className="font-semibold text-lg text-center">Use Fingerprint</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleAttendance("RFID")}
            disabled={loading}
            className="group relative flex flex-col items-center justify-center aspect-square w-48 h-48 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-500 dark:hover:border-purple-400 overflow-hidden mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-full" />
            {loading ? (
              <Loader2 className="animate-spin w-12 h-12 text-purple-500 mb-2" />
            ) : (
              <CreditCard className="w-12 h-12 text-purple-500 group-hover:scale-110 transition-transform duration-300 mb-2" />
            )}
            <span className="font-semibold text-lg text-center">Use RFID</span>
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mt-8 flex items-center justify-center space-x-3 text-green-600 dark:text-green-400 text-lg font-medium animate-fade-in">
            <CheckCircle className="w-6 h-6" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

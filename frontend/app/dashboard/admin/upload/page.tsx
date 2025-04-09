"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a valid CSV file");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/api/upload/csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Attendance CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </Button>

            <div className="text-sm text-gray-500">
              <p>Note: The CSV file should contain the following columns:</p>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Column Name</th>
                      <th className="py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-1">id</td><td>Record ID</td></tr>
                    <tr><td className="py-1">userId</td><td>User ID</td></tr>
                    <tr><td className="py-1">checkIn</td><td>Check-in timestamp</td></tr>
                    <tr><td className="py-1">checkOut</td><td>Check-out timestamp</td></tr>
                    <tr><td className="py-1">status</td><td>Attendance status</td></tr>
                    <tr><td className="py-1">recognizedFace</td><td>Face recognition status</td></tr>
                    <tr><td className="py-1">createdAt</td><td>Record creation timestamp</td></tr>
                    <tr><td className="py-1">overtime</td><td>Overtime hours</td></tr>
                    <tr><td className="py-1">fingerprintId</td><td>Fingerprint ID</td></tr>
                    <tr><td className="py-1">rfidId</td><td>RFID card ID</td></tr>
                    <tr><td className="py-1">clockOutStatus</td><td>Clock-out status</td></tr>
                    <tr><td className="py-1">shift</td><td>Shift information</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs">
                Note: Timestamps should be in ISO format (YYYY-MM-DD HH:mm:ss)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

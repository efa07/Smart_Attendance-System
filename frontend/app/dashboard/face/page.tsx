"use client"

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post("http://localhost:3002/upload", formData);
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Face Attendance System</h1>
      <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

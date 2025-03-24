"use client"
import Navbar from "../components/navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >

      <body
        className={`antialiased`}
      >
        <div >
          <Navbar />
        </div>
        {children}
        <ToastContainer  />
      </body>
    </html>
  );
}

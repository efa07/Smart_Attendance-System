"use client"
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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

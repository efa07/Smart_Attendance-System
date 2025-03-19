
import Link from "next/link";
import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="font-[Rajdhani] flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center text-black font-bold text-2xl">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-8 mr-2 border border-gray-200 rounded-full"
          />
          <span className="font-[Rajdhani] ">INSA AMS</span>
        </Link>
      </div>
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 text-gray-600 font-[Rajdhani]">
        <Link href="/" className="hover:text-purple-500 transition  duration-300">
          Home
        </Link>
        <Link href="/about" className="hover:text-purple-500 transition duration-300">
          About
        </Link>
        <Link href="/services" className="hover:text-purple-500 transition duration-300">
          Services
        </Link>
        <Link href="/contact" className="hover:text-purple-500 transition duration-300">
          Contact
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600 hover:text-black" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
        {/* Get Started Button */}
        <a href="/login">
          <button className="bg-black text-white px-4 py-2 rounded-full">
            Get Started
          </button>
        </a>
      </div>
    </nav>
  );
}

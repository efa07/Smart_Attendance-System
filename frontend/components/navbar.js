"use client"; // Ensure this is a Client Component

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

const Navbar = () => {
  const router = useRouter(); // Initialize the router

  return (
    <nav className="w-full bg-white shadow-md py-2 px-4 fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-black font-bold text-2xl">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 mr-2 border border-gray-200 rounded-full"
            />
            INSA AMS
          </Link>
        </div>

        {/* Menu Section */}
        <div className="hidden md:flex items-center space-x-6 text-black font-medium">
          <Link href="/" className="hover:text-gray-600 transition duration-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-600 transition duration-300">
            About
          </Link>
          <Link href="/services" className="hover:text-gray-600 transition duration-300">
            Services
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition duration-300">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Toggle (for smaller screens) */}
        <div className="md:hidden">
          <button
            className="text-black hover:text-gray-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
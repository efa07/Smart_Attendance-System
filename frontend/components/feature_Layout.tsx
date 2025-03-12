import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {children}
      <footer className="bg-white shadow-inner py-8 text-center mt-auto">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} INSA Attendance Management System. All rights reserved.
        </p>
        <a 
          href="/source" 
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors mt-2 inline-block"
        >View Source</a>
      </footer>
    </div>
  );
}

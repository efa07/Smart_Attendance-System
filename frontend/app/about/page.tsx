import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {Bell,ScanFace,CalendarClock,ChartNoAxesCombined} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Smart Attendance System - About',
  description: 'Advanced face recognition attendance tracking system for modern workplaces',
  keywords: ['attendance', 'face recognition', 'workforce management', 'tracking system']
};

export default function AboutPage() {
  const features = [
    {
      icon: <ScanFace size={48} strokeWidth={1} />,
      title: 'Face Recognition',
      description: 'Cutting-edge facial recognition technology for seamless and secure employee identification.'
    },
    {
      icon: <CalendarClock size={48} strokeWidth={1} />,
      title: 'Attendance Tracking',
      description: 'Automated real-time attendance monitoring with precise check-in and check-out records.'
    },
    {
      icon: <Bell size={48} strokeWidth={1} />,
      title: 'Notification System',
      description: 'Instant alerts for late arrivals, early departures, and attendance anomalies.'
    },
    {
      icon: <ChartNoAxesCombined size={48} strokeWidth={1} />,
      title: 'Reporting & Analytics',
      description: 'Comprehensive dashboards with detailed insights into workforce attendance patterns.'
    }
  ];

  const workflowSteps = [
    'Employee approaches recognition point',
    'Face is instantly verified',
    'Attendance automatically recorded',
    'Real-time notifications triggered'
  ];

  return (
    <div className="min-h-screen bg-brand-white text-gray-800 font-[Orbitron]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="bg-black text-white opacity-90 rounded-lg p-10 text-center mb-12">
          <h1 className="text-4xl text-white font-bold mb-4">Smart Attendance System</h1>
          <p className="text-xl text-white">Revolutionizing Workplace Tracking with Advanced Technology</p>
        </header>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-soft 
                         transition-all duration-300 hover:scale-105 hover:shadow-hover"
            >
              <div className="text-6xl mb-4 text-center">{feature.icon}</div>
              <h2 className="text-2xl font-semibold text-center mb-4">{feature.title}</h2>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Workflow Section */}
        <section className="bg-white border border-gray-200 rounded-lg p-10 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="flex justify-between space-x-4">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex-1 text-center">
                <span className="inline-block w-12 h-12 bg-black text-white 
                                 rounded-full leading-[3rem] mb-4 mx-auto">
                  {index + 1}
                </span>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-brand-black text-brand-white rounded-lg p-8 text-center">
          <p className="mb-4">
            Enhance workplace efficiency with smart, contactless attendance management
          </p>
          <Link 
            href="https://github.com/your-repo" 
            className="text-gray-300 hover:text-white transition-colors"
          >
            View Project Source
          </Link>
        </footer>
      </div>
    </div>
  );
}
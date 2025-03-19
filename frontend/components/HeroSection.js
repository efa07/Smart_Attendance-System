"use client";
import React from "react";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision"
import { ScanFace, LocateFixed, UserRoundPlus } from "lucide-react"
import ThreeDCardDemo from "../components/card";
// import InfiniteHorizontalScroll from "./InfiniteCard"

const HeroSection = () => {
  return (
    <div>
      <section className="relative">
        <BackgroundBeamsWithCollision>
          <div className="flex flex-col items-center justify-center space-y-8 p-6">
            <h2 className="text-xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white tracking-tight font-[Orbitron]">
              Welcome to the feature of  {" "}
              <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)] font-[Oxanium]">
                  <span className="">Smart Attendance System.</span>
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4 font-[Oxanium]">
                  <span className="">Smart Attendance System.</span>
                </div>
              </div>
            </h2>
            <div className="text-center mx-6">
              <p className="text-black text-2xl font-[Oxanium]">
                Automate attendance tracking, reduce manual errors, and gain real-time insights with our cutting-edge Attendance Management System that uses face tracking and tracking.
              </p>
            </div>

            <div className="flex flex-wrap justify-center space-x-4 items-center text-center">
              <a
                href="/features"
                className="inline-block bg-black text-white font-medium py-3 px-6 rounded hover:bg-gray-800 transition duration-300 font-[Orbitron]"
              >
                Explore Features
              </a>
              <a
                href="/login"
                className="inline-block border border-black text-black font-medium py-3 px-6 rounded hover:bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 hover:text-white transition duration-300 font-[Orbitron]"
              >
                Get Started
              </a>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </section>

      {/* Features Section */}
      <section className="py-4 px-10 text-center font-[Rajdhani]">
      <h2 className="text-3xl font-bold m-4 font-[Rajdhani] uppercase tracking-widest text-neon">Why Choose Our System?</h2>
      <div className="flex flex-wrap justify-center gap-10 items-start">
          <ThreeDCardDemo data={{ "title": "AI Face Recognition", "description": "Facial recognition ensures precise attendance tracking, eliminating manual errors.", "image": "face.jpg" }} />
          <ThreeDCardDemo data={{ "title": "Finger Print Scanner", "description": "Finger print scan ensures precise attendance tracking, eliminating manual errors when face recognition fails.", "image": "finer.png" }} />
          <ThreeDCardDemo data={{ "title": "Secure & Fast", "description": "Protects data with advanced encryption and processes attendance records in real-time.", "image": "seci.jpg" }} />
          <ThreeDCardDemo data={{ "title": "Seamless Integration", "description": "Easily integrates with existing HR, payroll, and school management systems.", "image": "in0.jpg" }} />
        </div>
      </section>
      {/* How It Works Section */}
      <section className="bg-gray-200 p-12 text-center font-[Rajdhani]">
        <h2 className="text-3xl font-bold mb-6 ">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 text-center flex flex-col items-center gap-4">
            <UserRoundPlus size={40} strokeWidth={0.5} />
            <h3 className="text-xl font-semibold">Step 1: Register</h3>
            <p>Users register their face data securely through a simple enrollment process.</p>
          </div>

          <div className="p-6 flex flex-col items-center gap-4">
            <ScanFace size={40} strokeWidth={0.5} />
            <h3 className="text-xl font-semibold">Step 2: Scan</h3>
            <p>Our system verifies identities through facial recognition and marks attendance instantly.</p>
          </div>

          <div className="p-6 flex flex-col items-center gap-4">
            <LocateFixed size={40} strokeWidth={0.5} />
            <h3 className="text-xl font-semibold">Step 3: Track</h3>
            <p>Administrators can monitor real-time reports and analytics to track attendance trends.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="p-12 text-center font-[Orbitron]">
        <h2 className="text-3xl font-bold mb-6 font-[Orbitron]">What Our Users Say</h2>

        <InfiniteHorizontalScroll />
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-700 text-white p-6 text-center font-[Orbitron]">
        <p>&copy; {new Date().getFullYear()} Face Attendance System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HeroSection;
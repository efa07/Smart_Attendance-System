import React from "react";
import { BackgroundBeamsWithCollision } from "../../components/ui/background-beams-with-collision";

export default function BackgroundBeamsWithCollisionDemo() {
  return (
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
  );
}

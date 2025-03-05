import {ScanFace, LocateFixed,UserRoundPlus} from "lucide-react"
import { BackgroundBeams } from "../components/ui/background-beams";
import ThreeDCardDemo from "../components/card";
import InfiniteHorizontalScroll from "./InfiniteCard"

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3 },
};


const HeroSection = () => {
    return (
  <div>
  <section className="relative">
  {/* Background Overlay */}
    <div className="h-[50rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
       <div className="absolute inset-0 bg-black opacity-10"></div>
      
        {/* Content Container */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          {/* Left Side: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Streamline Your Attendance Management
            </h1>
            <p className="text-lg text-gray-100 mb-6">
              Automate attendance tracking, reduce manual errors, and gain real-time insights with our cutting-edge Attendance Management System that uses face tracking and tracking.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start space-x-4">
              <a
                href="/features"
                className="inline-block bg-black text-white font-medium py-3 px-6 rounded hover:bg-gray-800 transition duration-300"
              >
                Explore Features
              </a>
              <a
                href="/login"
                className="inline-block border border-black text-white font-medium py-3 px-6 rounded hover:bg-gray-100 hover:text-black transition duration-300"
              >
                Get Start
              </a>
            </div>
          </div>
      
          {/* Right Side: Image with 3D Effect */}
          <div className="w-full md:w-1/2 text-center">
            <div className="transform perspective-1000 rotate-y-6 hover:rotate-y-12 transition-transform duration-500 ease-in-out">
              <img
                src="/b1_bw.jpg"
                alt="ai image"
                width={900}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
        <BackgroundBeams />
      </div>
</section>

    {/* Features Section */}
    <section className="py-4 px-10 text-center">
  <h2 className="text-3xl font-bold m4">Why Choose Our System?</h2>
  <div className="flex flex-wrap justify-center gap-10 items-start">
    <ThreeDCardDemo data={{"title":"AI Face Recognition","description":"Facial recognition ensures precise attendance tracking, eliminating manual errors.","image":"face.jpg"}}/>
    <ThreeDCardDemo data={{"title":"Finger Print Scanner","description":"Finger print scan ensures precise attendance tracking, eliminating manual errors when face recognition fails.","image":"finer.png"}}/>
    <ThreeDCardDemo data={{"title":"Secure & Fast","description":"Protects data with advanced encryption and processes attendance records in real-time.","image":"seci.jpg"}}/>
    <ThreeDCardDemo data={{"title":"Seamless Integration","description":"Easily integrates with existing HR, payroll, and school management systems.","image":"in0.jpg"}}/>
  </div>
</section>
      {/* How It Works Section */}
      <section className="bg-gray-200 p-12 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
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
      <section className="p-12 text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
      
        <InfiniteHorizontalScroll />
      </section>

      {/* Footer */}
      <footer className="bg-gray-700 text-white p-6 text-center">
        <p>&copy; {new Date().getFullYear()} Face Attendance System. All rights reserved.</p>
        
      </footer>

      </div>
    );
  };
  
  export default HeroSection;
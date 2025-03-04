'use client'
import React, { useRef, useEffect } from "react";

const cardData = [
  {
    quote:
      "Technology is best when it brings people together. Our biometric system ensures seamless attendance tracking for every team member.",
    name: "Yohannes Tesfaye",
    title: "Lead Software Engineer",
  },
  {
    quote:
      "Efficiency is doing things right; effectiveness is doing the right things. With our system, you achieve both.",
    name: "Meron Abebe",
    title: "HR Manager",
  },
  {
    quote:
      "Innovation is the calling card of the future. Our advanced features are designed to keep you ahead of the curve.",
    name: "Tewodros Kassahun",
    title: "Product Manager",
  },
  {
    quote:
      "The future of work is here. Our biometric attendance system ensures accuracy, security, and convenience.",
    name: "Selamawit Girma",
    title: "Operations Director",
  },
  {
    quote:
      "Great things in business are never done by one person; they’re done by a team. Our system helps you manage your team effortlessly.",
    name: "Dawit Mekonnen",
    title: "CEO",
  },
  {
    quote:
      "Time is the most valuable resource. Our system helps you track it efficiently, so you can focus on what matters most.",
    name: "Alemitu Fekadu",
    title: "Project Coordinator",
  },
  {
    quote:
      "Security and simplicity go hand in hand. Our biometric system ensures both for your organization.",
    name: "Kaleb Assefa",
    title: "Security Specialist",
  },
  {
    quote:
      "The right tools can transform the way you work. Our attendance management system is designed to do just that.",
    name: "Hana Solomon",
    title: "IT Consultant",
  },
  {
    quote:
      "Data is the new oil. Our system provides actionable insights to help you make informed decisions.",
    name: "Elias Tadesse",
    title: "Data Analyst",
  },
  {
    quote:
      "Automation is the future. Let our system handle the mundane, so you can focus on the extraordinary.",
    name: "Zewditu Bekele",
    title: "Automation Engineer",
  },
];

const InfiniteHorizontalScroll = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate the total width of all cards
    const totalWidth = container.scrollWidth;

    const animation = container.animate(
      [
        { transform: "translateX(0)" },
        { transform: `translateX(-${totalWidth / 2}px)` },
      ],
      {
        duration: 20000,
        iterations: Infinity, // Loop infinitely
      }
    );

    return () => {
      animation.cancel();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-4">
      <div
        ref={containerRef}
        className="flex overflow-x-hidden whitespace-nowrap"
      >
        {[...cardData, ...cardData].map((card, index) => (
          <div
            key={index}
            className="w-80 p-4 bg-white shadow-lg rounded-lg mx-3 flex flex-col justify-between"
            style={{ flex: "0 0 auto", minHeight: "180px" }}
          >
            <div>
              <p className="text-gray-800 font-semibold">{card.name}</p>
              <p className="text-gray-500 text-sm">{card.title}</p>
            </div>
            <div className="mt-4 h-auto">
              <p className="text-gray-600  italic leading-relaxed">
                {card.quote}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteHorizontalScroll;

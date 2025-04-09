"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconMenu2,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SidebarDemo() {
  const [username, setUsername] = useState<string | null>("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }
  }, []);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/setting",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 transition-colors duration-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg flex flex-col md:flex-row bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen shadow-lg",
      )}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 absolute top-4 left-4 md:hidden bg-white dark:bg-neutral-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 z-50"
      >
        <IconMenu2 className="text-gray-600 dark:text-gray-300 h-6 w-6" />
      </button>
      
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-8 p-4">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              {open ? <Logo /> : <LogoIcon />}
            </AnimatePresence>
            <div className="mt-8 flex flex-col gap-3">
              {links.map((link, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <SidebarLink link={link} />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <SidebarLink
              link={{
                label: username || "Profile",
                href: "profile",
                icon: profilePic ? (
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    src={`${API_URL}/uploads/${profilePic}`}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                    width={32}
                    height={32}
                    alt="Avatar"
                  />
                ) : (
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center ring-2 ring-neutral-200 dark:ring-neutral-700">
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">NA</span>
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-3 items-center text-sm text-black py-2 relative z-20 hover:opacity-80 transition-opacity duration-200"
    >
      <Image src={"/INSA.png"} alt="INSA" width={32} height={32} className="rounded-lg" />
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="font-semibold text-lg text-black dark:text-white whitespace-pre"
      >
        INSA
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex items-center text-sm text-black py-2 relative z-20 hover:opacity-80 transition-opacity duration-200"
    >
      <Image src={"/INSA.png"} alt="INSA" width={32} height={32} className="rounded-lg" />
    </Link>
  );
};
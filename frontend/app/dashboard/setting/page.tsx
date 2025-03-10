"use client"
import { useState } from "react";
import { Switch } from "@headlessui/react";
import { User } from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <User className="w-6 h-6" /> Settings
      </h2>
      
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg">Dark Mode</span>
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition`}
        >
          <span
            className={`${darkMode ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      {/* Notifications Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg">Notifications</span>
        <Switch
          checked={notifications}
          onChange={setNotifications}
          className={`${notifications ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition`}
        >
          <span
            className={`${notifications ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      {/* Save Button */}
      <button className="w-full mt-4 py-2 px-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition">
        Save Changes
      </button>
    </div>
  );
}

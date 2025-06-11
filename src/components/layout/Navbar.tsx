import React, { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-extrabold text-blue-600">StudyAbroad</span>
          <span className="text-sm font-medium text-gray-500 hidden md:block">
            CRM Portal
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="relative hover:bg-blue-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
              onClick={() => setOpen(!open)}
            >
              <img
                src={
                  user?.avatar ||
                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                }
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || "Coordinator"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" /> Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
  
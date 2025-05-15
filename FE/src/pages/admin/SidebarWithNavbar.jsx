import {
  Home,
  CreditCard,
  Star,
  List,
  BarChart,
  Users,
  LogOut,
  Search,
  Bell,
  Mail,
  Menu
} from "lucide-react";
import { useState } from "react";
import avatar from '@/assets/avatar.jpg'
import logo from '@/assets/logo.jpg'
import { Link } from "react-router-dom";
export default function SidebarWithNavbar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-blue-50">
      {/* Navbar */}
      <div className="w-full h-20 bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-between px-4 md:px-6 shadow-md rounded-b-2xl">
        {/* Left: Logo + Toggle */}
        <div className="flex items-center gap-3">
          {/* Toggle button for small screens */}
          <button
            className="md:hidden p-2 text-blue-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <img
            className="w-12 h-12 bg-white rounded-full shadow-sm object-cover"
            src={logo}
            alt="logo"
          />
          <h2 className="text-blue-900 text-lg font-semibold hidden sm:block">
            HOME CONVENIENT
          </h2>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4 text-blue-900 text-sm">
          <Search className="w-6 h-6 cursor-pointer" />
          <div className="relative cursor-pointer">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          <div className="relative cursor-pointer">
            <Mail className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <img
              src={avatar} 
              alt="Admin Avatar"
              className="w-8 h-8 rounded-full object-cover border border-blue-300"
            />
            <p className="text-sm font-medium text-blue-900">Quỳnh Trang</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-blue-100 to-blue-300 w-64 p-4 space-y-4 shadow-lg transition-transform duration-300 ease-in-out fixed md:static top-20 left-0 h-full z-20 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:rounded-r-3xl`}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 border-b border-blue-300 pb-4">
            <img
              src={avatar} 
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover border border-blue-300"
            />
            <div>
              <h2 className="text-md font-semibold text-blue-900">Quỳnh Trang</h2>
              <p className="text-sm text-blue-700">Quản trị viên</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            <SidebarItem icon={<BarChart />} label="Dashboard" />
            <Link to ="/admin/category">
            <SidebarItem icon={<List />} label="Quản lý danh mục" />
            </Link>
            <SidebarItem icon={<Home />} label="Quản lý bài đăng" />
            <SidebarItem icon={<CreditCard />} label="Quản lý thanh toán" />
            <SidebarItem icon={<Star />} label="Quản lý đánh giá" />
            <SidebarItem icon={<Users />} label="Quản lý người dùng" />
          </nav>

          {/* Logout */}
          <div className="border-t pt-4 border-blue-300">
            <button className="flex items-center w-full p-2 text-red-600 hover:bg-red-200 rounded-lg transition duration-200">
              <LogOut className="w-5 h-5 mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content Placeholder */}
        <div className="flex-1 p-4 md:ml-64 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <a
      href="#"
      className="flex items-center p-3 rounded-xl hover:bg-blue-200 transition duration-200 text-blue-900 font-medium"
    >
      <span className="w-5 h-5 mr-3 text-blue-700">{icon}</span>
      {label}
    </a>
  );
}

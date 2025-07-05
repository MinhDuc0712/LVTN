import avatar from "@/assets/avatar.jpg";
import logo from "@/assets/logo.jpg";
import {
  BarChart,
  Bell,
  CreditCard,
  Home,
  List,
  LogOut,
  Mail,
  Menu,
  Puzzle,
  Search,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function SidebarWithNavbar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  // console.log("User data:", user);
  // console.log("Avatar URL:", user?.HinhDaiDien);

  return (
    <div className="flex h-screen flex-col bg-blue-50">
      {/* Navbar */}
      <div className="flex h-20 w-full items-center justify-between rounded-b-2xl bg-gradient-to-r from-blue-200 to-blue-400 px-4 shadow-md md:px-6">
        {/* Left: Logo + Toggle */}
        <div className="flex items-center gap-3">
          {/* Toggle button for small screens */}
          <button
            className="p-2 text-blue-900 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <img
            className="h-12 w-12 rounded-full bg-white object-cover shadow-sm"
            src={logo}
            alt="logo"
          />
          <h2 className="hidden text-lg font-semibold text-blue-900 sm:block">
            HOME CONVENIENT
          </h2>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-4 text-sm text-blue-900">
          <Search className="h-6 w-6 cursor-pointer" />
          <div className="relative cursor-pointer">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </div>
          <div className="relative cursor-pointer">
            <Mail className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <img
              src={user?.HinhDaiDien}
              alt="Admin Avatar"
              className="h-8 w-8 rounded-full border border-blue-300 object-cover"
            />
            <p className="text-sm font-medium text-blue-900">{user?.HoTen}</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-20 left-0 z-20 h-full w-64 space-y-4 bg-gradient-to-b from-blue-100 to-blue-300 p-4 shadow-lg transition-transform duration-300 ease-in-out md:static ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:rounded-r-3xl`}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 border-b border-blue-300 pb-4">
            <img
              src={user?.HinhDaiDien}
              alt="Admin Avatar"
              className="h-10 w-10 rounded-full border border-blue-300 object-cover"
            />
            <div>
              <h2 className="text-md font-semibold text-blue-900">
                {user?.HoTen}
              </h2>
              <p className="text-sm text-blue-700">{user?.roles}</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            <Link to="/admin">
              <SidebarItem icon={<BarChart />} label="Dashboard" />
            </Link>
            <Link to="/admin/category">
              <SidebarItem icon={<List />} label="Quản lý danh mục" />
            </Link>
            <Link to="/admin/Utilities">
              <SidebarItem icon={<Puzzle />} label="Quản lý tiện ích" />
            </Link>
            <Link to="/admin/post">
              <SidebarItem icon={<Home />} label="Quản lý bài đăng" />
            </Link>
            <Link to="/admin/top_up">
              <SidebarItem icon={<Wallet />} label="Quản lý nạp tiền" />
            </Link>
            <Link to="/admin/payments">
              <SidebarItem icon={<CreditCard />} label="Quản lý thanh toán" />
            </Link>
            <Link to="/admin/reviews">
              <SidebarItem icon={<Star />} label="Quản lý đánh giá" />
            </Link>
            <Link to="/admin/users">
              <SidebarItem icon={<Users />} label="Quản lý người dùng" />
            </Link>
          </nav>
          {/* Logout */}
          <div className="border-t border-blue-300 pt-4">
            <button
              onClick={logout}
              className="flex w-full items-center rounded-lg p-2 text-red-600 transition duration-200 hover:bg-red-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content Placeholder */}
        <div className="flex-1 justify-center overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center rounded-xl p-3 font-medium text-blue-900 transition duration-200 hover:bg-blue-200">
      <span className="mr-3 h-5 w-5 text-blue-700">{icon}</span>
      {label}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import Logo from "@/assets/logo.png";

import Avatar from "../assets/avatar.jpg";
import { Link } from "react-router-dom";
import { useGetCategoriesUS } from "@/api/homePage";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  // console.log("HinhDaiDien:", isAuthenticated);
  const { data } = useGetCategoriesUS();
  const categories = data || [];
  // console.log("Categories data:", data);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ngăn chặn cuộn khi menu mobile mở
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Phongtro logo"
                  className="h-10 object-contain md:h-16"
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button text-gray-700 hover:text-orange-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden items-center space-x-4 md:flex">
            {/* Saved Listings */}
            <Link
              to="/savedList"
              className="flex items-center text-gray-700 hover:text-[#ff5723]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mr-1 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Tin đã lưu
            </Link>

            {/* Manage */}
            {isAuthenticated && (
              <Link
                to="/user"
                className="flex items-center text-gray-700 hover:text-[#ff5723]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-1 h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                  />
                </svg>
                Quản lý
              </Link>
            )}

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 hover:text-[#ff5723]"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                    <img
                      src={user?.HinhDaiDien || Avatar}
                      alt="User Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="inline">Tài khoản</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                      }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <ul className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                    <li className="border-b border-gray-100 px-4 py-2">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.HoTen || "Người dùng"}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {user?.SDT || "Không có thông tin"}
                      </span>
                    </li>
                    <li>
                      <Link
                        to="user"
                        className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mr-2 h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                        Hồ sơ
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center px-4 py-2 text-left hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mr-2 h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/dang-nhap"
                  className="flex items-center text-gray-700 hover:text-[#ff5723]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                    />
                  </svg>
                  Đăng nhập
                </Link>

                <Link
                  to="/dang-ky-tai-khoan"
                  className="flex items-center text-gray-700 hover:text-[#ff5723]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                  Đăng ký
                </Link>
              </>
            )}

            {/* Post Ad Button */}
            <Link
              to={isAuthenticated ? "/post" : "/dang-nhap?redirect=/post"}
              className="flex items-center gap-1 rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <span className="inline">Đăng tin</span>
            </Link>
            <Link
              to="/RentHouse"
              className="
    relative overflow-hidden group
    px-4 py-2  // Giảm kích thước padding
    bg-gradient-to-r from-[#2e7d32] to-[#4caf50]  
    text-white font-semibold text-sm  
    rounded-full
    border-2 border-transparent
    shadow-md hover:shadow-lg  
    transform transition-all duration-300 ease-out
    hover:scale-105 hover:shadow-md  
    hover:from-[#1b5e20] hover:to-[#2e7d32]  
    focus:outline-none focus:ring-2 focus:ring-green-300  
    active:scale-95
  "
            >
              {/* Hiệu ứng sáng chạy */}
              <div className="
    absolute top-0 left-0 w-full h-full
    bg-gradient-to-r from-transparent via-white to-transparent
    opacity-0 transform -skew-x-12 translate-x-[-100%]
    transition-all duration-700 ease-out
    group-hover:opacity-20 group-hover:translate-x-[100%]
  " />

              {/* Content */}
              <div className="relative flex items-center space-x-1">
                {/* House Icon */}
                <svg
                  className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"  // Giảm kích thước icon
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>

                {/* Text */}
                <span className="tracking-tight">THUÊ NHÀ NHANH</span>

                {/* Lightning Icon */}
                <svg
                  className="w-4 h-4 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"  // Giảm kích thước icon
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                </svg>
              </div>

              {/* Glow effect */}
              <div className="
    absolute inset-0 rounded-full
    bg-gradient-to-r from-green-400 to-green-500  // Màu xanh cho hiệu ứng glow
    opacity-0 blur-md  // Giảm blur
    transition-opacity duration-300
    group-hover:opacity-30
  " />
            </Link>
          </div>
        </div>

        <nav className="hidden border-t border-gray-200 md:block">
          <div className="flex items-center justify-center space-x-4 py-2">
            {categories.map((category) => (
              <Link
                to={`/category/${category.MaDanhMuc}`}
                key={category.MaDanhMuc}
                onClick={() => setActiveCategoryId(category.MaDanhMuc)}
                className={`text-sl relative px-3 py-2 font-medium transition-colors ${activeCategoryId === category.MaDanhMuc
                  ? "text-[#ff5723]"
                  : "text-gray-700 hover:text-[#ff5723]"
                  }`}
              >
                {category.name}
                {activeCategoryId === category.MaDanhMuc && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-[#ff5723]"></span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Menu - Slide from right */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="bg-opacity-50 absolute inset-0 bg-[#000]"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div
              ref={mobileMenuRef}
              className="absolute top-0 right-0 h-full w-[90%] max-w-sm overflow-y-auto bg-white shadow-lg"
            >
              <div className="p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-auto block text-gray-700 hover:text-orange-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <nav className="mt-4 flex flex-col space-y-4">
                  {isAuthenticated ? (
                    <div className="mb-3 rounded bg-gray-100 p-4">
                      <div className="flex items-center px-2 py-2">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                          <img
                            src={user?.HinhDaiDien || Avatar}
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-2 text-sm font-medium text-gray-700">
                          <span className="text-sm font-medium text-gray-700">
                            Xin chào: {user?.HoTen}
                          </span>
                          <span className="block text-xs text-gray-500">
                            {user?.Email || "Không có thông tin"}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/user/profile"
                        className="flex items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mr-3 h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                        Hồ sơ
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="mr-3 h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-4">
                      <Link
                        to="/dang-nhap"
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                        Đăng nhập
                      </Link>
                      <Link
                        to="/dang-ky-tai-khoan"
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                          />
                        </svg>
                        Đăng ký
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/savedList"
                    className="flex items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="mr-3 h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                    Tin đã lưu
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to="/user"
                      className="flex items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="mr-3 h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                        />
                      </svg>
                      Quản lý
                    </Link>
                  )}

                  <Link
                    to={isAuthenticated ? "/post" : "/dang-nhap?redirect=/post"}
                    className="flex items-center justify-center gap-1 rounded-full bg-red-500 py-2 text-white hover:bg-red-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Đăng tin
                  </Link>
                  <Link
                    to="/RentHouse"
                    className="
    flex items-center justify-center
    w-full py-2 mt-4  
    bg-gradient-to-r from-[#2e7d32] to-[#4caf50]  
    text-white font-semibold text-sm  
    rounded-full
    shadow-md active:scale-95  
    transition-transform duration-200
  "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">  // Giảm kích thước icon và khoảng cách
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                    THUÊ NHÀ NHANH
                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 24 24">  // Giảm kích thước icon và khoảng cách
                      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                    </svg>
                  </Link>
                  <div className="flex flex-col justify-start space-x-4 py-2">
                    {categories.map((category) => (
                      <Link
                        to={`/${category.MaDanhMuc}`}
                        // key={category.id}
                        onClick={() => setActiveCategoryId(category.MaDanhMuc)}
                        className={`text-sl relative px-3 py-2 transition-colors ${activeCategoryId === category.MaDanhMuc
                          ? "text-[#ff5723]"
                          : "text-gray-700 hover:text-[#ff5723]"
                          }`}
                      >
                        {category.name}
                        {activeCategoryId === category.MaDanhMuc && (
                          <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-[#ff5723]"></span>
                        )}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

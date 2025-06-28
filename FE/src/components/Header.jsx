// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import Logo from "@/assets/logo.png";
import Avatar from "../assets/avatar.jpg";
import { Link } from "react-router-dom";
import { useGetCategoriesUS } from "@/api/homePage";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useFilter } from "@/context/FilterContext";
import { Heart, Home, User, LogOut, Menu, X, MapPin } from "lucide-react";
import { MdArrowDropDown } from "react-icons/md";
import { getHousesWithFilter } from "@/api/homePage";


const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { data: categories = [] } = useGetCategoriesUS();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { filters, setFilters } = useFilter();


  const fetchListings = async (filters) => {
    const response = await getHousesWithFilter(filters);
    return response.data;
  };

  // Sử dụng useQuery để quản lý dữ liệu
  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", filters],
    queryFn: () => fetchListings(filters),
    enabled: !!filters.province || Object.keys(filters).length > 0,
  });

  // Xử lý bộ lọc từ SearchBar
  const handleFilters = (newFilters) => {
    setFilters(newFilters);
  };

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
              <SearchBar onApplyFilters={handleFilters} isLoading={isLoading} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-button text-gray-700 hover:text-orange-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
              <Heart className="mr-1 h-5 w-5" />
              Tin đã lưu
            </Link>

            {/* Manage */}
            {isAuthenticated && (
              <Link
                to="/user"
                className="flex items-center text-gray-700 hover:text-[#ff5723]"
              >
                <Home className="mr-1 h-5 w-5" />
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
                  <MdArrowDropDown
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
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
                        to="/user"
                        className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="mr-2 h-5 w-5" />
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
                        <LogOut className="mr-2 h-5 w-5" />
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
                  <LogOut className="mr-2 h-5 w-5" />
                  Đăng nhập
                </Link>

                <Link
                  to="/dang-ky-tai-khoan"
                  className="flex items-center text-gray-700 hover:text-[#ff5723]"
                >
                  <User className="mr-2 h-5 w-5" />
                  Đăng ký
                </Link>
              </>
            )}

            {/* Post Ad Button */}
            <Link
              to={isAuthenticated ? "/post" : "/dang-nhap?redirect=/post"}
              className="flex items-center gap-1 rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              <MapPin className="h-5 w-5" />
              <span className="inline">Đăng tin</span>
            </Link>
            <Link
              to="/RentHouse"
              className="
    relative overflow-hidden group
    px-4 py-2 
    bg-gradient-to-r from-[#2e7d32] to-[#4caf50]  
    text-white font-semibold text-sm  
    rounded-full
    border-2 border-transparent
    shadow-md 
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
    bg-gradient-to-r from-green-400 to-green-500  
    opacity-0 
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
                  <X className="h-6 w-6" />
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
                        <User className="mr-3 h-5 w-5" />
                        Hồ sơ
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
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
                        <LogOut className="h-5 w-5" />
                        Đăng nhập
                      </Link>
                      <Link
                        to="/dang-ky-tai-khoan"
                        className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Đăng ký
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/savedList"
                    className="flex items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="mr-3 h-5 w-5" />
                    Tin đã lưu
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to="/user"
                      className="flex items-center px-2 py-2 text-gray-700 hover:text-orange-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="mr-3 h-5 w-5" />
                      Quản lý
                    </Link>
                  )}

                  <Link
                    to={isAuthenticated ? "/post" : "/dang-nhap?redirect=/post"}
                    className="flex items-center justify-center gap-1 rounded-full bg-red-500 py-2 text-white hover:bg-red-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MapPin className="h-5 w-5" />
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
                        key={category.MaDanhMuc}
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
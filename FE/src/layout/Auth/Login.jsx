import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    accountType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tab Switching */}
          <div className="flex border-b border-gray-200">
            <Link
              to="/dang-nhap"
              className="flex-1 py-4 font-medium text-center text-lg text-orange-500 border-b-2 border-orange-500"
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky-tai-khoan"
              className="flex-1 py-4 font-medium text-center text-lg   text-gray-500 hover:text-orange-500 transition-colors"
            >
              Tạo tài khoản mới
            </Link>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Mật khẩu"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-md transition-colors"
              >
                Đăng nhập
              </button>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-600 text-sm underline">
                  Bạn quên mật khẩu?
                </a>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              <p className="mb-3">
                Bằng việc đăng ký, bạn đã đồng ý với{" "}
                <a href="#" className="text-orange-600 hover:underline">
                  Điều khoản dịch vụ
                </a>{" "}
                và{" "}
                <a href="#" className="text-orange-600 hover:underline">
                  Chính sách bảo mật
                </a>{" "}
                của chúng tôi
              </p>
              <p>© 2015 - {new Date().getFullYear()} Phongtro123.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;

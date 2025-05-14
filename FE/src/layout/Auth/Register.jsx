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
              className="flex-1 py-4 font-medium text-center text-lg text-gray-500 hover:text-orange-500 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky-tai-khoan"
              className="flex-1 py-4 font-medium text-center text-lg text-orange-500 border-b-2 border-orange-500"
            >
              Tạo tài khoản mới
            </Link>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

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
                  placeholder="Tạo mật khẩu"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mật khẩu tối thiểu 6 ký tự
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Loại tài khoản
                </label>
                <div className="flex flex-wrap gap-4">
                  {/* Tìm kiếm */}
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500"
                      type="radio"
                      name="user_type"
                      required
                      data-msg="Chọn loại tài khoản"
                      id="user_type_guest"
                      value="1"
                      checked={formData.user_type === "1"}
                      onChange={(e) =>
                        setFormData({ ...formData, user_type: e.target.value })
                      }
                    />
                    <label
                      htmlFor="user_type_guest"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Tìm kiếm
                    </label>
                  </div>

                  {/* Chính chủ */}
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 border-gray-300 text-orange-500 focus:ring-orange-500"
                      type="radio"
                      name="user_type"
                      required
                      data-msg="Chọn loại tài khoản"
                      id="user_type_owner"
                      value="2"
                      checked={formData.user_type === "2"}
                      onChange={(e) =>
                        setFormData({ ...formData, user_type: e.target.value })
                      }
                    />
                    <label
                      htmlFor="user_type_owner"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Chính chủ
                    </label>
                  </div>

                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md transition-colors"
              >
                Đăng ký tài khoản
              </button>
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

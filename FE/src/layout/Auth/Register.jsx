import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postRegisterAPI } from "../../api/homePage";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    HoTen: "",
    SDT: "",
    Email: "",
    Password: "",
    PasswordConfirmation: "",
    user_type: "1", // Mặc định là tìm kiếm
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Gọi API đăng ký
      const response = await postRegisterAPI({
        HoTen: formData.HoTen,
        SDT: formData.SDT,
        Email: formData.Email,
        Password: formData.Password,
        Password_confirmation: formData.PasswordConfirmation,
        MaQuyen: parseInt(formData.user_type),
      });

      // console.log("response from API:", response);
      // Xử lý kết quả thành công
      if (response.user) {
        // Chuyển hướng sau khi đăng ký thành công
        navigate("/dang-nhap", {
          state: { message: "Đăng ký thành công! Vui lòng đăng nhập." },
          replace: true,
        });
      } else {
        setError(response.message || "Đăng ký không thành công");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.MaQuyen?.[0] ||
        "Lỗi hệ thống, vui lòng thử lại sau",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-gradient-to-b from-orange-50 to-white py-10">
      <main className="container mx-auto px-4">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-md">
          {/* Tab Switching */}
          <div className="flex border-b border-gray-200">
            <Link
              to="/dang-nhap"
              className="flex-1 py-4 text-center text-lg font-medium text-gray-500 transition-colors hover:text-orange-500"
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky-tai-khoan"
              className="flex-1 border-b-2 border-orange-500 py-4 text-center text-lg font-medium text-orange-500"
            >
              Tạo tài khoản mới
            </Link>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="HoTen"
                  value={formData.HoTen}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="SDT"
                  value={formData.SDT}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  placeholder="Tạo mật khẩu"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mật khẩu tối thiểu 8 ký tự
                </p>
              </div>

              {/* <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  name="PasswordConfirmation"
                  value={formData.PasswordConfirmation}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div> */}

              <div className="mb-6 flex items-center gap-4">
                <label className="flex text-sm font-medium text-gray-700">
                  Loại tài khoản
                </label>
                <div className="flex gap-4">
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
                disabled={isLoading}
                className="w-full rounded-lg bg-orange-500 py-3 font-medium text-white shadow-md transition-colors hover:bg-orange-600"
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
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
              <p>© {new Date().getFullYear()} Home.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;

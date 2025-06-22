import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postLoginAPI } from "../../api/homePage";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); //

  const [formData, setFormData] = useState({
    Email: "",
    SDT: "",
    Password: "",
  });

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

    try {
      // Gọi API đăng ký
      const response = await postLoginAPI({
        SDT: formData.SDT,
        Password: formData.Password,
      });

      console.log("response from API:", response);
      if (response.user && response.token) {
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        login(response.user, response.token);
        if (response.roles.includes("admin")) {
          navigate("/admin");
        } else if (response.roles.includes("owner")) {
          navigate("/owner/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.message || "Đăng nhập không thành công");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại sau",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <main className="container mx-auto px-4">
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl bg-white shadow-md">
          {/* Tab Switching */}
          <div className="flex border-b border-gray-200">
            <Link
              to="/dang-nhap"
              className="flex-1 border-b-2 border-orange-500 py-4 text-center text-lg font-medium text-orange-500"
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky-tai-khoan"
              className="flex-1 py-4 text-center text-lg font-medium text-gray-500 transition-colors hover:text-orange-500"
            >
              Tạo tài khoản mới
            </Link>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="SDT"
                  value={formData.SDT}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="Nhập số điện thoại"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="Mật khẩu"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white shadow-md transition-colors hover:bg-orange-600"
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-blue-600 underline">
                  Bạn quên mật khẩu?
                </a>
              </div>
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
              <p>© 2015 - {new Date().getFullYear()} Phongtro123.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};  

export default Login;

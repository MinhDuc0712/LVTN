import { changePasswordAPI } from "@/api/homePage"; // Adjust the import path
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";


const ChangePassword = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState({
    current_password: false,
    new_password: false,
    new_password_confirmation: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.new_password_confirmation) {
      toast.error("Mật khẩu mới và xác nhận không khớp.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const result = await changePasswordAPI({
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirmation: form.new_password_confirmation,
      });

      if (result.success) {
        toast.success("Đổi mật khẩu thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        setForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
        navigate("/user");
      } else {
        toast.error(result.message || "Đổi mật khẩu thất bại.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.log("Data sent to API:", {
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirmation: form.new_password_confirmation,
      });
    } catch (err) {
      toast.error("Lỗi hệ thống. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4 md:flex-row md:p-6">
      <Sidebar />

      <div className="w-full overflow-auto rounded-lg bg-white p-4 shadow-lg md:w-3/4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-700 md:text-3xl">
          Quản lý tài khoản
        </h1>

        <div className="mb-4 flex flex-wrap items-center gap-2 border-b">
          <Link
            to="/user"
            className="text-sl relative px-3 py-2 text-gray-400 transition-colors hover:text-[#ff5723]"
          >
            Thông tin cá nhân
          </Link>
          <Link
            to="/change_phone"
            className="text-sl relative px-3 py-2 text-gray-400 transition-colors hover:text-[#ff5723]"
          >
            Đổi số điện thoại
          </Link>
          <Link
            to="/change_password"
            className="text-sl relative px-3 py-2 font-medium transition-colors hover:text-[#ff5723]"
          >
            Đổi mật khẩu
          </Link>
        </div>
        <div className="mx-auto rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl text-center font-bold text-gray-700">
            Đổi mật khẩu
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative mt-3 mb-4 w-full">
              <input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                onFocus={() =>
                  setIsFocused({ ...isFocused, current_password: true })
                }
                onBlur={() =>
                  setIsFocused({ ...isFocused, current_password: false })
                }
                required
                placeholder=""
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none"
              />
              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all ${
                  isFocused.current_password || form.current_password !== ""
                    ? "-top-2 left-2 text-sm text-gray-600"
                    : "top-3 text-base"
                }`}
              >
                Mật khẩu hiện tại
              </label>
            </div>

            <div className="relative mt-3 mb-4 w-full">
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                onFocus={() =>
                  setIsFocused({ ...isFocused, new_password: true })
                }
                onBlur={() =>
                  setIsFocused({ ...isFocused, new_password: false })
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none"
              />
              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all ${
                  isFocused.new_password || form.new_password !== ""
                    ? "-top-2 left-2 text-sm text-gray-600"
                    : "top-3 text-base"
                }`}
              >
                Mật khẩu mới
              </label>
            </div>

            <div className="relative mt-3 mb-4 w-full">
              <input
                type="password"
                name="new_password_confirmation"
                value={form.new_password_confirmation}
                onChange={handleChange}
                onFocus={() =>
                  setIsFocused({
                    ...isFocused,
                    new_password_confirmation: true,
                  })
                }
                onBlur={() =>
                  setIsFocused({
                    ...isFocused,
                    new_password_confirmation: false,
                  })
                }
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:outline-none"
              />
              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all ${
                  isFocused.new_password_confirmation ||
                  form.new_password_confirmation !== ""
                    ? "-top-2 left-2 text-sm text-gray-600"
                    : "top-3 text-base"
                }`}
              >
                Mật khẩu mới
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-2 text-white hover:bg-orange-600"
            >
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

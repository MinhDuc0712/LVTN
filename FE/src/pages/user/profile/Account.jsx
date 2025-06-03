import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { getUserProfileAPI } from "../../../api/homePage";
import { toast } from "react-toastify";

const AccountManagement = () => {
  const [avatar, setAvatar] = useState("src/assets/avatar.jpg");
  const { isAuthenticated, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ SDT: "", HoTen: "", Email: "" });
  const [isFocused, setIsFocused] = useState({
    SDT: false,
    HoTen: false,
    Email: false,
  });

  // Load hồ sơ người dùng
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await getUserProfileAPI();
        if (result.success) {
          toast.success("Cập nhật hồ sơ thành công!", {
            position: "top-right",
            autoClose: 3000,
          });
          setUser({
            ...result.user,
            roles: result.roles,
          });
          setFormData({
            SDT: result.user.SDT || "",
            HoTen: result.user.HoTen || "",
            Email: result.user.Email || "",
          });
        } else {
          toast.error(result.message || "Lỗi khi tải hồ sơ");
        }
      } catch (err) {
        if (!isMounted) return;
        toast.error(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

  }, [ setUser]);

  // Xử lý đổi avatar (chưa có API upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      // TODO: Gửi avatar lên server nếu cần
    }
  };

  // Gửi dữ liệu cập nhật
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const result = await updateUserProfileAPI(formData); // Thêm API cập nhật
      if (result.success) {
        toast.success("Cập nhật thông tin thành công!");
        setUser((prev) => ({ ...prev, ...formData }));
      } else {
        toast.error(result.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  // if (!isAuthenticated) return <Navigate to="/dang-nhap" replace />;
  if (loading) return <div className="mt-10 text-center">Đang tải...</div>;

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
            className="text-sl relative px-3 py-2 font-medium transition-colors hover:text-[#ff5723]"
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
            className="text-sl relative px-3 py-2 text-gray-400 transition-colors hover:text-[#ff5723]"
          >
            Đổi mật khẩu
          </Link>
        </div>
        <form>
          <div className="max-w mx-auto mt-10 rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex flex-col items-center sm:flex-row">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-300">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <label className="mt-2 cursor-pointer rounded bg-gray-500 px-3 py-1 text-sm text-white sm:mt-0 sm:ml-2">
                Đổi ảnh đại diện
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Input - SĐT */}
            <div className="relative mt-3 mb-4 w-full">
              <input
                type="tel"
                name="SDT"
                value={formData.SDT}
                onChange={(e) =>
                  setFormData({ ...formData, SDT: e.target.value })
                }
                onFocus={() => setIsFocused({ ...isFocused, SDT: true })}
                onBlur={() => setIsFocused({ ...isFocused, SDT: false })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none"
                required
              />
              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all ${
                  isFocused.SDT || formData.SDT !== ""
                    ? "-top-2 left-2 text-sm text-gray-600"
                    : "top-3 text-base"
                }`}
              >
                Số điện thoại
              </label>
            </div>

            {/* Input - Họ tên */}
            <div className="relative mt-3 mb-4 w-full">
              <input
                type="text"
                name="HoTen"
                value={formData.HoTen}
                onChange={(e) =>
                  setFormData({ ...formData, HoTen: e.target.value })
                }
                onFocus={() => setIsFocused({ ...isFocused, HoTen: true })}
                onBlur={() => setIsFocused({ ...isFocused, HoTen: false })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none"
                required
              />
              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all ${
                  isFocused.HoTen || formData.HoTen !== ""
                    ? "-top-2 left-2 text-sm text-gray-600"
                    : "top-3 text-base"
                }`}
              >
                Tên liên hệ
              </label>
            </div>

            {/* Input - Email */}
            <div className="relative mt-3 mb-4 w-full">
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                onFocus={() => setIsFocused({ ...isFocused, Email: true })}
                onBlur={() => setIsFocused({ ...isFocused, Email: false })}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none"
                required
              />
              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all ${
                  isFocused.Email || formData.Email !== ""
                    ? "-top-2 left-2 text-sm text-gray-600"
                    : "top-3 text-base"
                }`}
              >
                Email
              </label>
            </div>

            {/* Nút cập nhật */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white shadow-md transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountManagement;

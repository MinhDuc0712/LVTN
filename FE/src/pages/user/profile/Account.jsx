import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { getUserProfileAPI, updateUserProfileAPI } from "../../../api/homePage";
import { toast } from "react-toastify";
import defaultAvatar from "../../../assets/avatar.jpg";

const AccountManagement = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    SDT: "",
    HoTen: "",
    Email: "",
    avatarBase64: "", // Lưu base64 thay vì file
  });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isFocused, setIsFocused] = useState({
    SDT: false,
    HoTen: false,
    Email: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await getUserProfileAPI();
        if (result.success) {
          setUser({
            ...result.user,
            roles: result.roles || [],
          });
          setFormData({
            SDT: result.user.SDT || "",
            HoTen: result.user.HoTen || "",
            Email: result.user.Email || "",
            avatarBase64: "", // Reset base64
          });
          setAvatar(result.user.HinhDaiDien || defaultAvatar);
        } else {
          toast.error(result.message || "Lỗi khi tải hồ sơ");
        }
      } catch (err) {
        toast.error(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh!");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ảnh không được lớn hơn 2MB!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Hiển thị ảnh base64
        setFormData((prev) => ({
          ...prev,
          avatarBase64: reader.result.split(",")[1], // Lấy phần base64 (bỏ prefix data:image/jpeg;base64,)
        }));
        toast.success("Đổi ảnh đại diện thành công (chưa lưu lên server)!");
      };
      reader.readAsDataURL(file); // Chuyển file thành base64
    } else {
      toast.warn("Bạn chưa chọn ảnh!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const dataToSend = {
        SDT: formData.SDT,
        HoTen: formData.HoTen,
        Email: formData.Email,
        avatarBase64: formData.avatarBase64, // Gửi base64
      };

      const result = await updateUserProfileAPI(dataToSend);
      if (result.success) {
        toast.success(result.message || "Cập nhật thông tin thành công!");
        setUser((prev) => ({
          ...prev,
          ...result.user,
          roles: result.roles || prev.roles,
        }));
        setAvatar(result.user.HinhDaiDien || defaultAvatar);


        setFormData((prev) => ({ ...prev, avatarBase64: "" }));
      } else {
        toast.error(result.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi hệ thống khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.SDT || !formData.HoTen || !formData.Email) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  if (!isAuthenticated) return <Navigate to="/user" replace />;
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
        <form
          onSubmit={handleUpdate}
          className="max-w mx-auto mt-10 rounded-xl bg-white p-6 shadow-md"
        >
          <div className="mb-4 flex flex-col items-center sm:flex-row">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-300">
              <img
                // src={avatar}
                src={`data:image/jpeg;base64,${avatar}`}
                alt="Avatar"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-3 font-medium text-white shadow-md transition-colors hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountManagement;

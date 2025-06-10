import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaBan,
  FaCheck,
  FaUserShield,
  FaUser,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import SidebarWithNavbar from "./SidebarWithNavbar";
import Avatar from "../../assets/avatar.jpg";
import {
  useGetUsers,
  useUpdateUserRole,
  useBanUser,
  useUnbanUser,
  useGetRoles,
} from "../../api/homePage/queries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Users() {
  const { isLoading: isLoadingUsers, error: errorUsers, data: users = [] } = useGetUsers();
  const { isLoading: isLoadingRoles, error: errorRoles, data: roles = [] } = useGetRoles();
  const updateUserRoleMutation = useUpdateUserRole();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userImage, setUserImage] = useState(null); // State for image file

  // Handle image selection
  const handleImageChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  const handleUpdateUserRole = async (userId) => {
    try {
      const formData = new FormData();
      formData.append("HoTen", selectedUser.HoTen);
      formData.append("Email", selectedUser.Email);
      formData.append("SDT", selectedUser.SDT);
      formData.append("Role", userRole);
      formData.append("TrangThai", userStatus);
      if (userImage) {
        formData.append("HinhDaiDien", userImage);
      }

      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Cập nhật thông tin thành công cho người dùng ${selectedUser?.HoTen}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setShowEditModal(false);
      setUserImage(null); // Reset image
    } catch (error) {
      toast.error("Cập nhật thất bại: " + (error.response?.data?.message || error.message), {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Chi tiết lỗi:", error.response?.data);
    }
  };

  const handleBanUser = async (userId, reason) => {
    try {
      await banUserMutation.mutateAsync({ userId, reason });
      toast.success("Cấm người dùng thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowBanModal(false);
      setBanReason("");
    } catch (error) {
      toast.error("Cấm người dùng thất bại: " + (error.message || "Lỗi không xác định"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await unbanUserMutation.mutateAsync(userId);
      toast.success("Bỏ cấm người dùng thành công", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Bỏ cấm người dùng thất bại: " + (error.message || "Lỗi không xác định"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserRole(user.Role || "user");
    setUserStatus(user.TrangThai || "Đang hoạt động");
    setUserImage(null); // Reset image when opening modal
    setShowEditModal(true);
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "owner":
        return "bg-yellow-100 text-yellow-800";
      case "guest":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Bị cấm":
        return "bg-red-100 text-red-800";
      case "Tạm khóa":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Bị cấm":
        return "Bị cấm";
      case "Tạm khóa":
        return "Tạm khóa";
      default:
        return "Hoạt động";
    }
  };

  const getRoleText = (role) => {
    const roleObj = roles.find((r) => r.TenQuyen === role);
    return roleObj ? roleObj.MoTaQuyen : "Không xác định";
  };

  if (isLoadingUsers || isLoadingRoles) {
    return (
      <SidebarWithNavbar>
        <div className="mx-auto max-w-7xl p-6">
          <h1 className="mb-6 text-3xl font-bold text-blue-900">
            Quản lý người dùng
          </h1>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="py-10 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

  if (errorUsers || errorRoles) {
    return (
      <SidebarWithNavbar>
        <div className="mx-auto max-w-7xl p-6">
          <h1 className="mb-6 text-3xl font-bold text-blue-900">
            Quản lý người dùng
          </h1>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <p className="text-red-600">
              Lỗi khi tải dữ liệu: {errorUsers?.message || errorRoles?.message}
            </p>
            {(errorUsers?.message.includes("Unauthorized") || errorRoles?.message.includes("Unauthorized")) && (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Đăng nhập lại
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

  return (
    <SidebarWithNavbar>
      <div className="mx-auto max-w-7xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-blue-900">
          Quản lý người dùng
        </h1>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-blue-800">
              Danh sách người dùng ({users.length})
            </h2>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                <div className="mr-1 h-2 w-2 rounded-full bg-green-400"></div>
                Hoạt động
              </span>
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                <div className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></div>
                Tạm khóa
              </span>
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                <div className="mr-1 h-2 w-2 rounded-full bg-red-400"></div>
                Bị cấm
              </span>
            </div>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-500">Không có người dùng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Thông tin người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Quyền hạn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr
                      key={user.MaNguoiDung}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={user.HinhDaiDien ? `http://localhost:5000${user.HinhDaiDien}` : Avatar}
                              alt={`${user.HoTen}'s avatar`}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = Avatar;
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-900">
                              {user.HoTen}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.MaNguoiDung}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.Email}
                        </div>
                        <div className="text-sm text-gray-500">{user.SDT}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.Role || "user")}`}
                        >
                          {user.Role === "admin" ? (
                            <FaUserShield className="mr-1" />
                          ) : (
                            <FaUser className="mr-1" />
                          )}
                          {getRoleText(user.Role || "user")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(user.TrangThai || "Đang hoạt động")}`}
                        >
                          <div
                            className={`mr-1 h-2 w-2 rounded-full ${
                              user.TrangThai === "Bị cấm"
                                ? "bg-red-400"
                                : user.TrangThai === "Tạm khóa"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                            }`}
                          ></div>
                          {getStatusText(user.TrangThai || "Đang hoạt động")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1 text-xs text-blue-600 transition-colors hover:bg-blue-200"
                            onClick={() => openEditModal(user)}
                          >
                            <FaEdit /> Sửa
                          </button>
                          {user.TrangThai !== "Bị cấm" ? (
                            <button
                              className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-200"
                              onClick={() => openBanModal(user)}
                            >
                              <FaBan /> Cấm
                            </button>
                          ) : (
                            <button
                              className="inline-flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-xs text-green-600 transition-colors hover:bg-green-200"
                              onClick={() => handleUnbanUser(user.MaNguoiDung)}
                            >
                              <FaCheck /> Bỏ cấm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-blue-900">
                Chỉnh sửa thông tin người dùng
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tên người dùng
                  </label>
                  <input
                    type="text"
                    value={selectedUser.HoTen}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    value={selectedUser.Email}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={selectedUser.SDT}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hình đại diện
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {userImage && (
                    <p className="mt-2 text-sm text-gray-600">Đã chọn: {userImage.name}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quyền hạn
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {roles.map((role) => (
                      <option key={role.MaQuyen} value={role.TenQuyen}>
                        {role.MoTaQuyen}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Đang hoạt động">Hoạt động</option>
                    <option value="Tạm khóa">Tạm khóa</option>
                    <option value="Bị cấm">Bị cấm</option>
                  </select>
                </div>
              </div>
              {updateUserRoleMutation.isError && (
                <div className="mt-2 text-sm text-red-600">
                  <p>Lỗi: {updateUserRoleMutation.error.response?.data?.message || "Dữ liệu không hợp lệ"}</p>
                  {updateUserRoleMutation.error.response?.data?.errors && (
                    <ul>
                      {Object.entries(updateUserRoleMutation.error.response.data.errors).map(([field, messages]) => (
                        <li key={field}>{field}: {messages.join(", ")}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleUpdateUserRole(selectedUser.MaNguoiDung)}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  disabled={updateUserRoleMutation.isLoading}
                >
                  {updateUserRoleMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setUserImage(null);
                  }}
                  className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ban User Modal */}
        {showBanModal && selectedUser && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-red-700">
                Cấm người dùng
              </h3>
              <p className="mb-4 text-gray-600">
                Bạn có chắc chắn muốn cấm người dùng{" "}
                <strong>{selectedUser.HoTen}</strong>?
              </p>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lý do cấm (tùy chọn)
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Nhập lý do cấm người dùng này..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleBanUser(selectedUser.MaNguoiDung, banReason)}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                  disabled={banUserMutation.isLoading}
                >
                  {banUserMutation.isLoading ? "Đang cấm..." : "Xác nhận cấm"}
                </button>
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setBanReason("");
                  }}
                  className="flex-1 rounded-md bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWithNavbar>
  );
}
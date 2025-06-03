import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import SidebarWithNavbar from "./SidebarWithNavbar";
import { useGetUsers } from "../../api/homePage/queries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserManagement() {
  const { data: users = [], isLoading, error } = useGetUsers();

  const handleEdit = (user) => {
    toast.info(`Chức năng chỉnh sửa cho người dùng ${user.HoTen}`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDelete = () => {
    toast.warning("Không thể xoá người dùng này.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  if (isLoading) {
    return (
      <SidebarWithNavbar>
        <div className="mx-auto max-w-6xl p-6">
          <h1 className="mb-6 text-3xl font-bold text-blue-900">
            Quản lý người dùng
          </h1>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-blue-800">
              Danh sách người dùng
            </h2>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

  if (error) {
    return (
      <SidebarWithNavbar>
        <div className="mx-auto max-w-6xl p-6">
          <h1 className="mb-6 text-3xl font-bold text-blue-900">
            Quản lý người dùng
          </h1>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-blue-800">
              Danh sách người dùng
            </h2>
            <p className="text-red-600">
              {/* Lỗi khi tải danh sách người dùng: {error.message} */}
              {toast.error("Không thể tải danh sách người dùng.")}
            </p>
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
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-blue-900">
          Quản lý người dùng
        </h1>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-blue-800">
            Danh sách người dùng
          </h2>
          {users.length === 0 ? (
            <p className="text-gray-500">Không có người dùng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase ">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Số điện thoại
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
                        <div className="text-sm font-medium text-blue-900">
                          {user.HoTen}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.Email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.SDT}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-4">
                          <button
                            className="inline-flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-800"
                            onClick={() => handleEdit(user)}
                          >
                            <FaEdit /> Sửa
                          </button>
                          <button
                            className="inline-flex cursor-not-allowed items-center gap-1 text-gray-400 transition-colors hover:text-gray-600"
                            onClick={handleDelete}
                            // disabled
                          >
                            <FaTrash /> Xoá
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SidebarWithNavbar>
  );
}

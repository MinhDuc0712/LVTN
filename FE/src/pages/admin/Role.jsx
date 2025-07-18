import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getRoleAPI,
  deleteRoleAPI,
  postRoleAPI,
  updateRoleAPI,
} from "@/api/homePage/";
import SidebarWithNavbar from "./SidebarWithNavbar";
import { Key } from "lucide-react";

export default function Role() {
  const queryClient = useQueryClient();
  
  // State for form
  const [tenQuyen, setTenQuyen] = useState("");
  const [moTaQuyen, setMoTaQuyen] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get roles data
  const { data: rolesResponse, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoleAPI,
  });

  const roles = rolesResponse || [];

  // Handle form submission
  const handleSubmit = async () => {
    if (!tenQuyen.trim()) {
      toast.error("Vui lòng nhập tên quyền");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        TenQuyen: tenQuyen.trim(),
        MoTaQuyen: moTaQuyen.trim(),
      };

      if (editingRole) {
        // Update existing role
        await updateRoleAPI(editingRole.MaQuyen, payload);
        toast.success("Cập nhật quyền thành công");
      } else {
        // Create new role
        await postRoleAPI(payload);
        toast.success("Thêm quyền thành công");
      }
      
      // Reset form
      setTenQuyen("");
      setMoTaQuyen("");
      setEditingRole(null);
      
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (error) {
      toast.error(editingRole ? "Cập nhật quyền thất bại" : "Thêm quyền thất bại");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit role
  const handleEdit = (role) => {
    setEditingRole(role);
    setTenQuyen(role.TenQuyen || "");
    setMoTaQuyen(role.MoTaQuyen || "");
  };

  // Handle delete role
  const handleDelete = async (roleId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa quyền này?")) {
      return;
    }

    try {
      await deleteRoleAPI(roleId);
      toast.success("Xóa quyền thành công");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (error) {
      toast.error(`Xóa quyền thất bại: ${error.response?.data?.message}`);
      console.error("Error:", error);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingRole(null);
    setTenQuyen("");
    setMoTaQuyen("");
  };

  return (
    <SidebarWithNavbar>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-800">
            Quản lý quyền
          </h1>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Key className="h-4 w-4" />
            <span>Tổng số quyền: {roles.length}</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md border border-blue-100">
          <h2 className="mb-4 text-lg font-semibold text-blue-700 flex items-center gap-2">
            {editingRole ? (
              <>
                <FaEdit className="h-5 w-5" />
                Chỉnh sửa quyền
              </>
            ) : (
              <>
                <FaPlus className="h-5 w-5" />
                Thêm quyền mới
              </>
            )}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Tên quyền <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên quyền (ví dụ: admin, user, manager...)"
                value={tenQuyen}
                onChange={(e) => setTenQuyen(e.target.value)}
                className="w-full rounded-lg border border-blue-300 p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Mô tả
              </label>
              <textarea
                placeholder="Nhập mô tả về quyền này..."
                value={moTaQuyen}
                onChange={(e) => setMoTaQuyen(e.target.value)}
                className="w-full rounded-lg border border-blue-300 p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
                rows="3"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !tenQuyen.trim()}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {editingRole ? "Đang cập nhật..." : "Đang thêm..."}
                  </>
                ) : (
                  <>
                    <FaCheck className="h-4 w-4" />
                    {editingRole ? "Cập nhật quyền" : "Thêm quyền"}
                  </>
                )}
              </button>
              
              {editingRole && (
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-lg bg-gray-300 px-6 py-3 text-black hover:bg-gray-400 transition disabled:opacity-50"
                >
                  <FaTimes className="h-4 w-4" />
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="rounded-xl bg-white p-6 shadow-md border border-blue-100">
          <h2 className="mb-4 text-lg font-semibold text-blue-700">
            Danh sách quyền
          </h2>
          
          {isRolesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-2 text-blue-600">Đang tải...</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có quyền nào</p>
              <p className="text-sm text-gray-500">Hãy thêm quyền đầu tiên của bạn</p>
            </div>
          ) : (
            <div className="space-y-4">
              {roles.map((item, index) => (
                <div
                  key={item.MaQuyen || index}
                  className={`flex items-start justify-between rounded-lg border p-4 transition-colors ${
                    editingRole?.MaQuyen === item.MaQuyen
                      ? "border-blue-400 bg-blue-50"
                      : "border-blue-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-blue-900">{item.TenQuyen}</h3>
                      {editingRole?.MaQuyen === item.MaQuyen && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Đang chỉnh sửa
                        </span>
                      )}
                    </div>
                    {item.MoTaQuyen && (
                      <p className="text-sm text-blue-700 mb-2">{item.MoTaQuyen}</p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Mã: {item.MaQuyen}</span>
                      {item.created_at && (
                        <span>Tạo: {new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 ml-4">
                    <button
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => handleEdit(item)}
                      disabled={isLoading}
                    >
                      <FaEdit className="h-4 w-4" />
                      Sửa
                    </button>
                    <button
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDelete(item.MaQuyen)}
                      disabled={isLoading}
                    >
                      <FaTrash className="h-4 w-4" />
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
import { useState } from "react";
import SidebarWithNavbar from "./SidebarWithNavbar";
import { useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGetUtilitiesUS } from "../../api/homePage/queries";
import {
  deleteUtilitiesAPI,
  postUtilitiesAPI,
  updateUtilitiesAPI,
} from "../../api/homePage/request";
export default function Utilities() {
  const [TenTienIch, setName] = useState("");
  const [message, setMessage] = useState("");
  const [editingUtilities, setEditingUtilities] = useState(null);

  const queryClient = useQueryClient();
  const { data: utilities = [], isLoading } = useGetUtilitiesUS();

 const handleSubmit = async () => {
  if (!TenTienIch.trim()) {
    setMessage("Tên tiện ích không được để trống");
    return;
  }

  try {
    if (editingUtilities) {
      if (!editingUtilities.MaTienIch) {
        throw new Error("Missing utility ID");
      }
      
      await updateUtilitiesAPI(editingUtilities.MaTienIch, { TenTienIch });
      setMessage("Cập nhật thành công!");
    } else {
      await postUtilitiesAPI({ TenTienIch });
      setMessage("Thêm thành công!");
    }
    
    await queryClient.invalidateQueries({ queryKey: ["utilities"] });
    setName("");
    setEditingUtilities(null);
  } catch (error) {
    console.error("Update error:", error);
    setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

  try {
    await deleteUtilitiesAPI(id);
    setMessage("Xóa thành công!"); 
    await queryClient.invalidateQueries({ queryKey: ["utilities"] });
  } catch (error) {
    setMessage("Xóa thất bại: " + error.message); 
  }
};

  const handleEdit = (utility) => {
    setEditingUtilities(utility);
    setName(utility.TenTienIch);
    setMessage("");
  };

  return (
    <SidebarWithNavbar>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          Quản lý tiện ích 
        </h1>

        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            {editingUtilities ? "Chỉnh sửa tiện ích" : "Thêm tiện ích mới"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên tiện ích"
              value={TenTienIch}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {message && (
              <div className="text-sm text-red-600 font-medium">{message}</div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {editingUtilities ? "Cập nhật tiện ích" : "Thêm tiện ích"}
              </button>
              {editingUtilities && (
                <button
                  onClick={() => {
                    setEditingUtilities(null);
                    setName("");
                    setMoTa("");
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Danh sách tiện ích 
          </h2>
          {isLoading ? (
            <p>Đang tải...</p>
          ) : (
            <ul className="space-y-4">
              {utilities.map((item) => (
                <li
                  key={item.MaTienIch}
                  className="border border-blue-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-blue-900 font-semibold">{item.TenTienIch}</h3>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline inline-flex items-center gap-1"
                      onClick={() => handleDelete(item.MaTienIch)}
                    >
                      <FaTrash /> Xoá
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SidebarWithNavbar>
  );
}

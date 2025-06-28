import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useGetCategoriesUS } from "../../api/homePage/queries";
import {
  deleteCategoryAPI,
  postCategoryAPI,
  updateCategoryAPI,
} from "../../api/homePage/request";
import SidebarWithNavbar from "./SidebarWithNavbar";

export default function Category() {
  const [name, setName] = useState("");
  const [moTa, setMoTa] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const queryClient = useQueryClient();
  const { data: categories = [] } = useGetCategoriesUS();

  const handleSubmit = async () => {
    if (!name.trim()) {
      // setMessage("Tên danh mục không được để trống.");
      toast.error("Tên danh mục không được để trống.");
      return;
    }

    try {
      // setMessage("");
      if (editingCategory) {
        const res = await updateCategoryAPI(editingCategory.MaDanhMuc, {
          name,
          mo_ta: moTa,
        });
        // setMessage("Cập nhật thành công!");
        toast.success("Cập nhật thành công!");
      } else {
        const res = await postCategoryAPI({ name, mo_ta: moTa });
        // setMessage("Thêm thành công!");
        toast.success("Thêm thành công!");
      }

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setMoTa("");
      setEditingCategory(null);
    } catch (error) {
      // console.error("Error:", error.response?.data);
      // setMessage(error.response?.data?.message || "Lỗi khi cập nhật");
      toast.error(`Lỗi khi cập nhật`);
      // console.error("Error:", error);
    }
  };

  const handleDelete = async (MaDanhMuc) => {
    try {
      await deleteCategoryAPI(MaDanhMuc);
      // setMessage("Xóa thành công!");
      toast.success("Xóa thành công!");
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Delete error:", error);
      // setMessage("Xóa thất bại: " + (error.response?.data?.message || error.message));
      toast.error(`Xóa thất bại`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setMoTa(category.mo_ta);
    // setMessage("");
  };
  return (
    <SidebarWithNavbar>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-blue-800">
          Quản lý danh mục
        </h1>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-blue-700">
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <textarea
              placeholder="Mô tả"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              className="w-full rounded-lg border border-blue-300 p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="3"
            />
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
              </button>
              {editingCategory && (
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setName("");
                    setMoTa("");
                  }}
                  className="rounded-lg bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-blue-700">
            Danh sách danh mục
          </h2>
          {categories.length === 0 ? (
            <p>Không có danh mục nào</p>
          ) : (
            <ul className="space-y-4">
              {categories.map((item) => (
                <li
                  key={item.MaDanhMuc}
                  className="flex items-start justify-between rounded-lg border border-blue-200 p-4"
                >
                  <div>
                    <h3 className="font-semibold text-blue-900">{item.name}</h3>
                    <p className="text-sm text-blue-700">{item.mo_ta}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      className="inline-flex items-center gap-1 text-red-600 hover:underline"
                      onClick={() => handleDelete(item.MaDanhMuc)}
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

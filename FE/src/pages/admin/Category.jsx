import { useEffect, useState } from "react";
import SidebarWithNavbar from "./SidebarWithNavbar";
import {
  postCategoryAPI,
  deleteCategoryAPI,
  updateCategoryAPI,
  getCategoriesAPI,
} from "../../api/homePage/request";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [moTa, setMoTa] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
 
  const fetchCategories = async () => {
    try {
      const data = await getCategoriesAPI();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setMessage("Tên danh mục không được để trống.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (editingCategory) {
        const res = await updateCategoryAPI(editingCategory.id, {
          name,
          mo_ta: moTa,
        });
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? res.category : cat
          )
        );
        setMessage("Cập nhật thành công!");
      } else {
        const res = await postCategoryAPI({ name, mo_ta: moTa });
        setCategories((prev) => [...prev, res.category]);
        setMessage("Thêm thành công!");
      }

      // Reset form
      setName("");
      setMoTa("");
      setEditingCategory(null);
    } catch (error) {
      setMessage("Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa?");
    if (!confirmDelete) return;

    try {
      await deleteCategoryAPI(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      alert("Xóa thất bại.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setMoTa(category.mo_ta);
    setMessage("");
  };

  return (
    <SidebarWithNavbar>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          Quản lý danh mục
        </h1>

        {/* Form thêm/sửa danh mục */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Mô tả"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
            />
            {message && (
              <div className="text-sm text-red-600 font-medium">{message}</div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading
                  ? "Đang xử lý..."
                  : editingCategory
                  ? "Cập nhật danh mục"
                  : "Thêm danh mục"}
              </button>
              {editingCategory && (
                <button
                  onClick={() => {
                    setEditingCategory(null);
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

        {/* Danh sách danh mục */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Danh sách danh mục
          </h2>
          <ul className="space-y-4">
            {categories.map((item) => (
              <li
                key={item.id}
                className="border border-blue-200 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-blue-900 font-semibold">{item.name}</h3>
                  <p className="text-sm text-blue-700">{item.mo_ta}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(item)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}

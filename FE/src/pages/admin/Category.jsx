import SidebarWithNavbar from "./SidebarWithNavbar";

export default function Category() {
  return (
    <SidebarWithNavbar>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Quản lý danh mục</h1>

        {/* Form nhập danh mục */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Thêm danh mục mới
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên danh mục"
              className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              
            />
            <textarea
              placeholder="Mô tả"
              className="w-full border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              
            ></textarea>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-600 transition"
              >
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách danh mục mẫu (hiển thị tĩnh) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Danh sách danh mục</h2>
          <ul className="space-y-4">
            <li className="border border-blue-200 rounded-lg p-4 flex justify-between items-start">
              <div>
                <h3 className="text-blue-900 font-semibold">Danh mục A</h3>
                <p className="text-sm text-blue-700">Mô tả cho danh mục A</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:underline">Chỉnh sửa</button>
                <button className="text-red-600 hover:underline">Xóa</button>
              </div>
            </li>
            
          </ul>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}

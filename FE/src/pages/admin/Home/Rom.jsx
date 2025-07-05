import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import SidebarWithNavbar from "../SidebarWithNavbar";

export default function RoomListPage() {
  // Mock data - Thay bằng API call thực tế
  const rooms = [
    {
      id: 1,
      name: "Phòng 101",
      area: 30,
      floor: 1,
      price: 5000000,
      status: "available",
      description: "Phòng đẹp view thành phố"
    },
    {
      id: 2,
      name: "Phòng 201",
      area: 45,
      floor: 2,
      price: 8000000,
      status: "rented",
      description: "Phòng cao cấp full nội thất"
    },
    {
      id: 3,
      name: "Phòng 301",
      area: 25,
      floor: 3,
      price: 4000000,
      status: "maintenance",
      description: "Phòng đang bảo trì"
    }
  ];

  const statusColors = {
    available: "bg-green-100 text-green-800",
    rented: "bg-blue-100 text-blue-800",
    maintenance: "bg-yellow-100 text-yellow-800"
  };

  const statusLabels = {
    available: "Có sẵn",
    rented: "Đã thuê",
    maintenance: "Bảo trì"
  };

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Danh sách phòng</h1>
          <Link
            to="/admin/AddRoom"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            + Thêm phòng mới
          </Link>
        </div>

        {/* Search and filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả trạng thái</option>
              <option value="available">Có sẵn</option>
              <option value="rented">Đã thuê</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả tầng</option>
              <option value="1">Tầng 1</option>
              <option value="2">Tầng 2</option>
              <option value="3">Tầng 3</option>
              <option value="3">Tầng 4</option>
              <option value="3">Tầng 5</option>
            </select>
          </div>
        </div>

        {/* Room list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên phòng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diện tích</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tầng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá thuê</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{room.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{room.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.area} m²
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Tầng {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {room.price.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[room.status]}`}>
                        {statusLabels[room.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/rooms/edit/${room.id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FaEdit className="mr-1" /> Sửa
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900 flex items-center"
                          onClick={() => {
                            // Xử lý xóa phòng
                            if (window.confirm(`Bạn chắc chắn muốn xóa ${room.name}?`)) {
                              console.log("Xóa phòng", room.id);
                            }
                          }}
                        >
                          <FaTrash className="mr-1" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Trước
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">3</span> của <span className="font-medium">3</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Trước</span>
                    &larr;
                  </button>
                  <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Sau</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
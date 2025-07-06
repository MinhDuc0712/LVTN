import { useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import SidebarWithNavbar from "../SidebarWithNavbar";
import {getRoomsAPI, getRoomByIdAPI} from "@/api/homePage";

export default function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");

  const statusLabels = {
    trong: "Có sẵn",
    da_thue: "Đã thuê",
    bao_tri: "Bảo trì"
  };

  const statusColors = {
    trong: "bg-green-100 text-green-800",
    da_thue: "bg-blue-100 text-blue-800",
    bao_tri: "bg-yellow-100 text-yellow-800"
  };

  const fetchRooms = async () => {
    try {
      const response = await getRoomsAPI();
        setRooms(response);
        setFilteredRooms(response);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    let filtered = [...rooms];

    if (search.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.ten_phong.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((r) => r.trang_thai === statusFilter);
    }

    if (floorFilter) {
      filtered = filtered.filter((r) => r.tang.toString() === floorFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, search, statusFilter, floorFilter]);

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Bạn chắc chắn muốn xoá ${name}?`);
    if (!confirm) return;

    try {
      const response = await getRoomByIdAPI(id);
      if (response.status !== 200) {
        console.error("Không thể xoá phòng:", response.statusText);
        return;
      }
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Lỗi khi xoá phòng:", error);
    }
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

        {/* Tìm kiếm và lọc */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="trong">Có sẵn</option>
              <option value="da_thue">Đã thuê</option>
              <option value="bao_tri">Bảo trì</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
            >
              <option value="">Tất cả tầng</option>
              {[1, 2, 3, 4, 5].map((f) => (
                <option key={f} value={f}>
                  Tầng {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danh sách phòng */}
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
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{room.ten_phong}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{room.mo_ta}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{room.dien_tich} m²</td>
                    <td className="px-6 py-4 whitespace-nowrap">Tầng {room.tang}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Number(room.gia).toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[room.trang_thai]}`}
                      >
                        {statusLabels[room.trang_thai]}
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
                          onClick={() => handleDelete(room.id, room.ten_phong)}
                        >
                          <FaTrash className="mr-1" /> Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      Không tìm thấy phòng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}

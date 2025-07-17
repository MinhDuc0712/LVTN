import { deleteRoomAPI, getRoomsAPI } from "@/api/homePage/request";
import { useEffect, useState } from "react";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { toast } from 'react-toastify';
export default function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5); 


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

  // const fetchRooms = async () => {
  //   try {
  //     const response = await getRoomsAPI();
  //       setRooms(response);
  //       setFilteredRooms(response);
  //   } catch (error) {
  //     console.error("Lỗi khi tải danh sách phòng:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRooms();
  // }, []);

  useEffect(() => {
    let filtered = [...rooms];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.ten_phong.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((r) => r.trang_thai === statusFilter);
    }

    if (floorFilter) {
      filtered = filtered.filter((r) => r.tang.toString() === floorFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, statusFilter, floorFilter]);

  const handleDelete = async (id, name) => {
  const confirm = window.confirm(`Bạn chắc chắn muốn xoá ${name}?`);
  if (!confirm) return;

  setRooms(prev => prev.filter(r => r.id !== id));

  try {
    const response = await deleteRoomAPI(id); 
    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Delete failed");
    }
    toast.success(`Đã xoá ${name} thành công`);
  } catch (error) {
    setRooms(prev => [...prev, rooms.find(r => r.id === id)]);
    toast.error(
      error.response?.data?.message || 
      error.message || 
      `Xoá ${name} thất bại`
    );
    console.error("Lỗi khi xoá phòng:", error);
  }
};

  /* ---------- fetch API ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRoomsAPI();
        // console.log("Dữ liệu phòng:", response);

        const mappedRooms = response.map(room => ({
          id: room.id,
          name: room.ten_phong,
          description: room.mo_ta,
          area: room.dien_tich,
          floor: room.tang,
          price: room.gia,
          status: room.trang_thai,
        }));

        setRooms(mappedRooms);
        setFilteredRooms(mappedRooms);
      } catch (error) {
        if (error.response) {
        }
        setError("Không tải được danh sách phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    let result = rooms;
    
    if (searchTerm) {
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      result = result.filter(room => {
        if (statusFilter === "available") return room.status === "trong";
        if (statusFilter === "rented") return room.status === "da_thue";
        if (statusFilter === "maintenance") return room.status === "bao_tri";
        return true;
      });
    }
    
    if (floorFilter) {
      result = result.filter(room => room.floor.toString() === floorFilter);
    }
    
    setFilteredRooms(result);
    setCurrentPage(1); 
  }, [searchTerm, statusFilter, floorFilter, rooms]);

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <SidebarWithNavbar><p className="p-8">Đang tải...</p></SidebarWithNavbar>;
  if (error) return <SidebarWithNavbar><p className="p-8 text-red-600">{error}</p></SidebarWithNavbar>;

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Danh sách phòng</h1>
          <Link
            to="/admin/Room/add"
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="1">Tầng 1</option>
              <option value="2">Tầng 2</option>
              <option value="3">Tầng 3</option>
              <option value="4">Tầng 4</option>
              <option value="5">Tầng 5</option>
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
                {currentRooms.length > 0 ? (
                  currentRooms.map((room) => (
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
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[room.status]}`}>
                          {statusLabels[room.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/Room/edit/${room.id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <FaEdit className="mr-1" /> Sửa
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleDelete(room.id, room.name)}
                          >
                            <FaTrash className="mr-1" /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Không tìm thấy phòng nào phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {filteredRooms.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Trước
                </button>
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{indexOfFirstRoom + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastRoom, filteredRooms.length)}
                    </span>{' '}
                    của <span className="font-medium">{filteredRooms.length}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Trước</span>
                      &larr;
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button 
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Sau</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
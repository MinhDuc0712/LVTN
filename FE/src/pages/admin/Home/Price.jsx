import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { getServicePrices, deleteServicePrice } from "../../../api/homePage/request";

// Hàm format tiền VND
const formatCurrencyVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function ServicePriceList() {
  const [servicePrices, setServicePrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServicePrices();
        setServicePrices(data);
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;

    try {
      await deleteServicePrice(id);
      setServicePrices(prev => prev.filter(price => price.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert(err.message || "Xóa thất bại!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredPrices = servicePrices.filter(service =>
    service.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <SidebarWithNavbar>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </SidebarWithNavbar>
  );

  if (error) return (
    <SidebarWithNavbar>
      <div className="p-4 text-red-600">
        {error}
      </div>
    </SidebarWithNavbar>
  );

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Quản lý giá dịch vụ</h1>
          <Link
            to="/admin/AddPrice"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Thêm giá mới
          </Link>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên dịch vụ..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày áp dụng</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrices.length > 0 ? (
                filteredPrices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.ten}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrencyVND(service.gia_tri)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(service.ngay_ap_dung)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/AddPrice/edit/${service.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="inline mr-1" /> Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? "Không tìm thấy kết quả" : "Không có dữ liệu"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
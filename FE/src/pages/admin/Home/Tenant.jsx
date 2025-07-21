import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaUserPlus } from "react-icons/fa";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { useEffect, useState } from "react";

const mockTenants = [
  {
    id: 1,
    ho_ten: "Nguyễn Văn A",
    sdt: "0987654321",
    cccd: "123456789012",
    email: "nguyenvana@gmail.com",
    phong_thue: "PH101",
    ngay_ket_thuc: "2024-01-14",
    phong_id: 101,
    trang_thai: "dang_thue"
  },
  {
    id: 3,
    ho_ten: "Lê Văn C",
    sdt: "0967891234",
    cccd: "456789012345",
    email: "levanc@gmail.com",
    phong_thue: "PH505",
    ngay_ket_thuc: "2023-11-09",
    phong_id: 302,
    trang_thai: "da_ket_thuc"
  },
];

// Component chính
export default function TenantListPage() {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 5;

  // Thay thế API call bằng mock data
  useEffect(() => {
    setTenants(mockTenants);
  }, []);

  // Format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Filter tenants based on search term
  const filteredTenants = tenants.filter(tenant => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tenant.ho_ten.toLowerCase().includes(searchLower) ||
      tenant.sdt.toLowerCase().includes(searchLower) ||
      tenant.cccd.toLowerCase().includes(searchLower) ||
      tenant.email.toLowerCase().includes(searchLower)
    );
  });

  // Get current tenants for pagination
  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(indexOfFirstTenant, indexOfLastTenant);
  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách thuê này?")) {
      // Xử lý xóa trong mock data
      setTenants(tenants.filter(tenant => tenant.id !== id));
    }
  };

  // Hiển thị trạng thái
  const statusLabels = {
    dang_thue: "Đang thuê",
    da_ket_thuc: "Đã kết thúc"
  };

  const statusColors = {
    dang_thue: "bg-green-100 text-green-800",
    da_ket_thuc: "bg-gray-100 text-gray-800"
  };

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Danh sách khách thuê</h1>
          {/* <Link
            to="/admin/tenant/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaUserPlus className="mr-2" /> Thêm khách thuê
          </Link> */}
        </div>

        {/* Search and filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại, CCCD hoặc email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.value === "") {
                  setTenants(mockTenants);
                } else {
                  setTenants(mockTenants.filter(tenant => tenant.trang_thai === e.target.value));
                }
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="dang_thue">Đang thuê</option>
              <option value="da_ket_thuc">Đã kết thúc</option>
            </select>
          </div>
        </div>

        {/* Tenants list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số ĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng thuê</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTenants.length > 0 ? (
                  currentTenants.map((tenant, index) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {indexOfFirstTenant + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                        {tenant.ho_ten}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenant.sdt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenant.cccd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenant.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tenant.phong_thue}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(tenant.ngay_ket_thuc)}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[tenant.trang_thai]}`}>
                          {statusLabels[tenant.trang_thai]}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/tenant/edit/${tenant.id}`}
                            className="text-yellow-600 hover:text-yellow-900 flex items-center"
                          >
                            <FaEdit className="mr-1" /> Sửa
                          </Link>
                          <button
                            className="text-red-600 hover:text-red-900 flex items-center"
                            onClick={() => handleDelete(tenant.id)}
                          >
                            <FaTrash className="mr-1" /> Xóa
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                      Không tìm thấy khách thuê nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTenants.length > tenantsPerPage && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button 
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </button>
                <button 
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{indexOfFirstTenant + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastTenant, filteredTenants.length)}
                    </span>{' '}
                    của <span className="font-medium">{filteredTenants.length}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <span className="sr-only">Trước</span>
                      &larr;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
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
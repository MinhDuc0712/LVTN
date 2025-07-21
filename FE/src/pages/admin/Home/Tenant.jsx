import { useEffect, useState } from "react";
import { FaSearch} from "react-icons/fa";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { getKhachs } from "../../../api/homePage/request";

export default function TenantListPage() {
  const [khachs, setKhachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 5; 

  useEffect(() => {
    const fetchKhachs = async () => {
      try {
        const response = await getKhachs();
        if (response.success) {
          const formattedKhachs = response.data.map(khach => ({
            id: khach.id,
            ho_ten: khach.ho_ten,
            sdt: khach.sdt,
            cccd: khach.cmnd,
            email: khach.email,
            dia_chi: khach.dia_chi,
            phong_thue: khach.phong_thue || [],
            so_phong: khach.so_phong || 0 
          }));
          setKhachs(formattedKhachs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKhachs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredTenants = khachs.filter(tenant => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tenant.ho_ten.toLowerCase().includes(searchLower) ||
      tenant.sdt.toLowerCase().includes(searchLower) ||
      tenant.cccd.toLowerCase().includes(searchLower) ||
      (tenant.email && tenant.email.toLowerCase().includes(searchLower))
    );
  });

  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = filteredTenants.slice(indexOfFirstTenant, indexOfLastTenant);
  const totalPages = Math.ceil(filteredTenants.length / tenantsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Danh sách khách thuê</h1>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng thuê ({currentTenants.reduce((sum, tenant) => sum + tenant.so_phong, 0)})</th>
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
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {tenant.phong_thue.length > 0 ? (
                            tenant.phong_thue.map((phong, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="font-medium">{phong.ten_phong}</span>
                                {phong.ngay_ket_thuc && (
                                  <span className="text-xs text-gray-500">
                                    (Kết thúc: {formatDate(phong.ngay_ket_thuc)})
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <span>N/A</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
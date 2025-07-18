import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaPrint,
  FaFileExport
} from "react-icons/fa";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function PaymentInvoiceList() {
  // Dữ liệu mock
  const mockInvoices = [
    {
      id: 1,
      ma_hoa_don: "HD202310001",
      hopdong: {
        phong: { ten_phong: "PH101" },
        khach: { ten_khach: "Nguyễn Văn A" }
      },
      thang: "2023-10",
      tong_tien: 3700000,
      da_thanh_toan: 3700000,
      con_no: 0,
      trang_thai: "Đã thanh toán",
      ngay_tao: "2023-10-05T10:30:00"
    },
    {
      id: 2,
      ma_hoa_don: "HD202310002",
      hopdong: {
        phong: { ten_phong: "PH102" },
        khach: { ten_khach: "Trần Thị B" }
      },
      thang: "2023-10",
      tong_tien: 4350000,
      da_thanh_toan: 3000000,
      con_no: 1350000,
      trang_thai: "Còn nợ",
      ngay_tao: "2023-10-06T14:15:00"
    },
    {
      id: 3,
      ma_hoa_don: "HD202309001",
      hopdong: {
        phong: { ten_phong: "PH201" },
        khach: { ten_khach: "Lê Văn C" }
      },
      thang: "2023-09",
      tong_tien: 4200000,
      da_thanh_toan: 4200000,
      con_no: 0,
      trang_thai: "Đã thanh toán",
      ngay_tao: "2023-09-05T09:20:00"
    }
  ];

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Format tiền tệ
  const formatCurrency = (amount) => 
    new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  // Format ngày tháng
  const formatDate = (dateString) => 
    format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });

  // Lọc hóa đơn
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const room = invoice.hopdong.phong.ten_phong.toLowerCase();
    const customer = invoice.hopdong.khach.ten_khach.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchSearch =
      searchTerm === "" ||
      room.includes(searchLower) ||
      customer.includes(searchLower) ||
      invoice.ma_hoa_don.toLowerCase().includes(searchLower);
    
    const matchStatus = filterStatus 
      ? invoice.trang_thai.toLowerCase() === filterStatus.toLowerCase()
      : true;
    
    const matchMonth = filterMonth
      ? invoice.thang === filterMonth
      : true;

    return matchSearch && matchStatus && matchMonth;
  });

  const availableMonths = [...new Set(mockInvoices.map(invoice => invoice.thang))].sort((a, b) => {
    return new Date(b) - new Date(a); 
  });

  const statusBadge = (status) => {
    return status === "Đã thanh toán" ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        <FaCheckCircle className="text-green-500" /> {status}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        <FaTimesCircle className="text-red-500" /> {status}
      </span>
    );
  };

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Danh sách hóa đơn thu tiền</h1>
            <p className="text-sm text-gray-500">
              Tổng số hóa đơn: <span className="font-medium">{filteredInvoices.length}</span>
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaFilter /> {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </button>
            <Link
              to="/admin/AddMoney"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaFileInvoiceDollar className="mr-2" /> Tạo hóa đơn mới
            </Link>
          </div>
        </div>

        {/* Bộ lọc */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Bộ lọc nâng cao</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tìm kiếm */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo phòng, khách hàng, mã hóa đơn..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Lọc theo tháng */}
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">Tất cả các tháng</option>
                  {availableMonths.map((month) => {
                    const [year, monthNum] = month.split('-');
                    return (
                      <option key={month} value={month}>
                        Tháng {monthNum}/{year}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Lọc theo trạng thái */}
              <select
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
                <option value="Còn nợ">Còn nợ</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("");
                  setFilterMonth("");
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Danh sách hóa đơn */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <img
                src="/empty-state.svg"
                alt="No data"
                className="mx-auto h-40 w-40 opacity-70"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Không tìm thấy hóa đơn nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus || filterMonth
                  ? "Hãy thử thay đổi điều kiện lọc"
                  : "Chưa có hóa đơn nào được tạo"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã HĐ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tháng
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã thanh toán
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Còn nợ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.ma_hoa_don}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.hopdong.phong.ten_phong}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.hopdong.khach.ten_khach}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Tháng {invoice.thang.split('-')[1]}/{invoice.thang.split('-')[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(invoice.tong_tien)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(invoice.da_thanh_toan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(invoice.con_no)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(invoice.trang_thai)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(invoice.ngay_tao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            to={`/admin/payment-invoices/${invoice.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </Link>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="In hóa đơn"
                          >
                            <FaPrint />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Xuất file"
                          >
                            <FaFileExport />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SidebarWithNavbar>
  );
}
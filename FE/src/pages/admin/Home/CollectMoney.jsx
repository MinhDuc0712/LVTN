import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEdit,
  FaTrash,
  FaMoneyBillWave
} from "react-icons/fa";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getPaymentReceipts, deletePaymentReceipt, updatePaymentReceipt } from "@/api/homePage/request";
import { toast } from "react-toastify";

export default function PaymentInvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('partial');

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentNote, setPaymentNote] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchInvoices = async () => {
      try {
        const data = await getPaymentReceipts();
        if (isMounted) {
          setInvoices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setInvoices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInvoices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedInvoice) return;
    const debt = selectedInvoice.no;

    if (paymentAmount === debt) {
      setPaymentStatus('full');
    } else if (paymentAmount < debt) {
      setPaymentStatus('partial');
    } else if (paymentAmount > debt) {
      setPaymentStatus('over');
    }
  }, [paymentAmount, selectedInvoice]);

  // Format currency
  const formatCurrency = (amount) => {
    const numericValue = typeof amount === 'string'
      ? parseFloat(amount.replace(/[^\d.-]/g, ''))
      : Number(amount);

    return isNaN(numericValue)
      ? '0 ₫'
      : new Intl.NumberFormat("vi-VN").format(numericValue) + " ₫";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const room = invoice.hopdong?.phong?.ten_phong?.toLowerCase() || '';
    const customer = invoice.hopdong?.khach?.ho_ten?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      searchTerm === "" ||
      room.includes(searchLower) ||
      customer.includes(searchLower) ||
      invoice.ma_hoa_don?.toLowerCase().includes(searchLower);

    const matchStatus = filterStatus
      ? invoice.trang_thai?.toLowerCase() === filterStatus.toLowerCase()
      : true;

    const matchMonth = filterMonth
      ? invoice.thang === filterMonth
      : true;

    return matchSearch && matchStatus && matchMonth;
  });

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const availableMonths = [...new Set(invoices.map(invoice => invoice.thang))].sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const statusBadge = (status) => {
    let bgColor = "";
    let textColor = "";
    let icon = null;

    switch (status) {
      case "Đã thanh toán":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <FaCheckCircle className="text-green-500" />;
        break;
      case "Còn nợ":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        icon = <FaTimesCircle className="text-red-500" />;
        break;
      case "Trả dư":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <FaMoneyBillWave className="text-yellow-500" />;
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
        icon = null;
        break;
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
        {icon} {status}
      </span>
    );
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.con_no);
    setShowPaymentModal(true);
  };
  const formatDateTimeForMySQL = (date) => {
    const d = new Date(date);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handlePaymentSubmit = async () => {
    let trangThai = "";
    if (paymentStatus === "full") {
      trangThai = "Đã thanh toán";
    } else if (paymentStatus === "partial") {
      trangThai = "Còn nợ";
    } else if (paymentStatus === "over") {
      trangThai = "Trả dư";
    }
    const now = formatDateTimeForMySQL(new Date());

    const data = {
      da_thanh_toan: Number(selectedInvoice.da_thanh_toan) + Number(paymentAmount),
      no: Number(selectedInvoice.no) - Number(paymentAmount),
      trang_thai: trangThai,
      ngay_thu: now,
      noi_dung: paymentNote
    };

    try {
      await updatePaymentReceipt(selectedInvoice.id, data);
      toast.success(`Đã thanh toán ${formatCurrency(paymentAmount)} cho hóa đơn ${selectedInvoice.id}`);
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      toast.error("Thanh toán thất bại!");
    }
  };



  const handleDelete = async (invoiceId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
      try {
        await deletePaymentReceipt(invoiceId);
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
        toast.success(`Đã xóa hóa đơn ${invoiceId}`);
      } catch (error) {
        toast.error("Xóa hóa đơn thất bại. Vui lòng thử lại.");
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  if (loading) {
    return (
      <SidebarWithNavbar>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

  if (error) {
    return (
      <SidebarWithNavbar>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        </div>
      </SidebarWithNavbar>
    );
  }

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
                <option value="Trả dư">Trả dư</option>
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
            <>
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
                        Ghi chú
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.hopdong.phong.ten_phong}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.hopdong.khach.ho_ten}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Tháng {invoice.thang.split('-')[1]}/{invoice.thang.split('-')[0]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(invoice.so_tien)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(invoice.da_thanh_toan)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(invoice.no)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {statusBadge(invoice.trang_thai)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {statusBadge(invoice.noi_dung)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.ngay_thu)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => handleEditClick(invoice)}
                              className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg shadow-sm text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                              title="Thanh toán"
                            >
                              <FaEdit className="mr-2" />
                              <span>Thanh toán </span>
                            </button>
                            <button
                              onClick={() => handleDelete(invoice.id)}
                              className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-100 rounded-lg shadow-sm text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                              title="Xóa"
                            >
                              <FaTrash className="mr-2" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredInvoices.length)}
                        </span>{' '}
                        trong tổng số <span className="font-medium">{filteredInvoices.length}</span> kết quả
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          &larr;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          &rarr;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Thanh toán hóa đơn</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Phòng</p>
                  <p className="font-medium">{selectedInvoice.hopdong.phong.ten_phong}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Tháng</p>
                  <p className="font-medium">
                    Tháng {selectedInvoice.thang.split('-')[1]}/{selectedInvoice.thang.split('-')[0]}
                  </p>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-semibold">{formatCurrency(selectedInvoice.so_tien)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span className="text-green-600 font-semibold">
                    {formatCurrency(selectedInvoice.da_thanh_toan)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Còn nợ:</span>
                  <span className="text-red-600 font-semibold">
                    {formatCurrency(selectedInvoice.no)}
                  </span>
                </div>
              </div>

              {/* Form thanh toán */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tiền thanh toán
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      className="block w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={paymentAmount?.toLocaleString("vi-VN") ?? "0"}
                      onChange={(e) => {
                        const raw = e.target.value.replaceAll(".", "").replace(/\D/g, "");
                        const number = Number(raw);
                        setPaymentAmount(number);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">₫</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nhập ghi chú (nếu có)..."
                    rows={2}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái thanh toán
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-lg border ${paymentStatus === 'full'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      onClick={() => {
                        setPaymentStatus('full');
                        setPaymentAmount(selectedInvoice.no);
                      }}
                    >
                      Thanh toán đủ
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-lg border ${paymentStatus === 'partial'
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      onClick={() => setPaymentStatus('partial')}
                    >
                      Thanh toán một phần
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-lg border ${paymentStatus === 'over'
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700'
                        }`}
                      onClick={() => {
                        setPaymentStatus('over');
                        setPaymentAmount(selectedInvoice.no + 100000); // Có thể sửa lại logic này nếu cần
                      }}
                    >
                      Trả dư
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setShowPaymentModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                onClick={handlePaymentSubmit}
              >
                <FaMoneyBillWave className="mr-2" />
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarWithNavbar>
  );
}
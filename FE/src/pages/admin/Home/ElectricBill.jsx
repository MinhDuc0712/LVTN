import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExchangeAlt,
  FaSearch,
  FaCalendarAlt,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getElectricBills,toggleElectricBillStatus } from "@/api/homePage/request";

export default function ElectricBillList() {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    bill: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const response = await getElectricBills();
        if (Array.isArray(response)) { 
          const mapped = response.map((bill) => ({
            id: bill.id,
            hopdong_id: bill.hopdong_id,
            roomName: bill.hopdong?.phong?.ten_phong || `Phòng ${bill.hopdong_id}`,
            thang: bill.thang, 
            chi_so_dau: bill.chi_so_dau,
            chi_so_cuoi: bill.chi_so_cuoi,
            don_gia: Number(bill.don_gia),
            status: bill.trang_thai === "Đã thanh toán" ? "paid" : "unpaid",
            created_at: bill.ngay_tao || bill.created_at,
          }));
          setBills(mapped);
          toast.dismiss();
          toast.success("Tải dữ liệu hóa đơn thành công");
        } else {
          toast.dismiss();
          toast.error("Dữ liệu trả về không hợp lệ");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Lỗi khi tải dữ liệu hóa đơn");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const calcUsage = (dau, cuoi) => cuoi - dau;
  const calcAmount = (bill) =>   calcUsage(bill.chi_so_dau, bill.chi_so_cuoi) * (bill.don_gia / 10);
  const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  const formatDate = (dateString) => format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });

  const filteredBills = bills.filter((b) => {
    const room = b.roomName?.toLowerCase() || '';
    const matchSearch =
      searchTerm === "" ||
      room.includes(searchTerm.toLowerCase()) ||
      b.id.toString().includes(searchTerm);
    const matchStatus = filterStatus ? b.status === filterStatus : true;

    const matchMonth = filterMonth ?
      (b.thang && b.thang.includes(filterMonth)) : true;

    return matchSearch && matchStatus && matchMonth;
  });

  const availableMonths = [...new Set(bills.map(bill => bill.thang))].sort((a, b) => {
    return new Date(b) - new Date(a); 
  });

  const statusBadge = (status) =>
    status === "paid" ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        <FaCheckCircle className="text-green-500" /> Đã thanh toán
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        <FaTimesCircle className="text-red-500" /> Chưa thanh toán
      </span>
    );

 const updateBillStatus = async (billId, newStatus) => {
  try {
    setLoading(true); 
    
    const result = await toggleElectricBillStatus(billId);
    
    if (result.success) {
      toast.dismiss();
       toast.error(result.message || "Cập nhật trạng thái thất bại");
    
      setBills(prev => prev.map(b => 
        b.id === billId
          ? { 
              ...b, 
              status: result.data.trang_thai === "Đã thanh toán" ? "paid" : "unpaid",
              ...(result.data.trang_thai && { 
                trang_thai: result.data.trang_thai 
              })
            }
          : b
      ));
    } else {
     toast.dismiss();
      toast.success(result.message || "Đã cập nhật trạng thái hóa đơn");
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái hóa đơn");
  } finally {
    setLoading(false);
  }
};

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn điện</h1>
            <p className="text-sm text-gray-500">
              Tổng số hóa đơn: <span className="font-medium">{filteredBills.length}</span>
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
              to="/admin/AddElectric"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Tạo hóa đơn mới
            </Link>
          </div>
        </div>

        {/* BỘ LỌC */}
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
                  placeholder="Tìm theo phòng, ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Lọc theo tháng */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
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

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredBills.length === 0 ? (
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
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tháng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chỉ số
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
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
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{bill.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.roomName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Tháng {bill.thang.split('-')[1]}/{bill.thang.split('-')[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.chi_so_dau} → {bill.chi_so_cuoi} ({calcUsage(bill.chi_so_dau, bill.chi_so_cuoi)} kWh)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(calcAmount(bill))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(bill.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bill.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setConfirmModal({ open: true, bill })}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Đổi trạng thái"
                          >
                            <FaExchangeAlt />
                          </button>
                          <p className="whitespace-nowrap text-sm font-medium text-gray-900">Đổi trạng thái</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL XÁC NHẬN ĐỔI TRẠNG THÁI */}
        {confirmModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Xác nhận đổi trạng thái hóa đơn
                </h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Phòng:</span> {confirmModal.bill.roomName}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Tháng:</span> Tháng {confirmModal.bill.thang.split('-')[1]}/{confirmModal.bill.thang.split('-')[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Chuyển từ:</span> {confirmModal.bill.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"} →{" "}
                    <span className="font-medium text-blue-600">
                      {confirmModal.bill.status === "paid" ? "Chưa thanh toán" : "Đã thanh toán"}
                    </span>
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setConfirmModal({ open: false, bill: null })}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => {
                      updateBillStatus(
                        confirmModal.bill.id,
                        confirmModal.bill.status === "paid" ? "unpaid" : "paid"
                      );
                      setConfirmModal({ open: false, bill: null });
                    }}
                    className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWithNavbar>
  );
}
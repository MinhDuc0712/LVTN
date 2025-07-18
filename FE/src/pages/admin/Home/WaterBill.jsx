import { useEffect, useState } from "react";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getWaterBills, toggleWaterStatus } from "@/api/homePage/request";

export default function WaterBillList() {
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
        const response = await getWaterBills();
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
          toast.success("Tải dữ liệu hóa đơn nước thành công");
        } else {
          toast.dismiss();
          toast.error("Dữ liệu trả về không hợp lệ");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Lỗi khi tải dữ liệu hóa đơn nước");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const calcUsage = (dau, cuoi) => cuoi - dau;
  const calcAmount = (bill) => calcUsage(bill.chi_so_dau, bill.chi_so_cuoi) * bill.don_gia;
  const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  const formatDate = (date) => format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi });

  const filteredBills = bills.filter((b) => {
    const matchSearch =
      b.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toString().includes(searchTerm);
    const matchStatus = filterStatus ? b.status === filterStatus : true;
    const matchMonth = filterMonth ? b.thang?.includes(filterMonth) : true;
    return matchSearch && matchStatus && matchMonth;
  });

  const availableMonths = [...new Set(bills.map(b => b.thang))].sort((a, b) => new Date(b) - new Date(a));

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

  const updateBillStatus = async (billId) => {
    try {
      setLoading(true);
      const result = await toggleWaterStatus(billId);
      if (result.success) {
        toast.dismiss();
        toast.error(result.message || "Cập nhật trạng thái thất bại");
        setBills(prev =>
          prev.map(b =>
            b.id === billId
              ? {
                ...b,
                status: result.data.trang_thai === "Đã thanh toán" ? "paid" : "unpaid",
              }
              : b
          )
        );
      } else {
        toast.dismiss();
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Lỗi khi cập nhật trạng thái hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn nước</h1>
            <p className="text-sm text-gray-500">
              Tổng số hóa đơn: <span className="font-medium">{filteredBills.length}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm"
            >
              <FaFilter /> {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </button>
            <Link
              to="/admin/AddWater"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Tạo hóa đơn nước
            </Link>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo phòng, ID..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">Tất cả các tháng</option>
                  {availableMonths.map((month) => {
                    const [year, monthNum] = month.split("-");
                    return (
                      <option key={month} value={month}>
                        Tháng {monthNum}/{year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <select
                className="w-full px-4 py-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {loading ? (
            <div className="text-center py-12">Đang tải dữ liệu...</div>
          ) : filteredBills.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Không có hóa đơn nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tháng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chỉ số</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">#{bill.id}</td>
                      <td className="px-6 py-4">{bill.roomName}</td>
                      <td className="px-6 py-4">Tháng {bill.thang.split("-")[1]}/{bill.thang.split("-")[0]}</td>
                      <td className="px-6 py-4">{bill.chi_so_dau} → {bill.chi_so_cuoi}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(calcAmount(bill))}</td>
                      <td className="px-6 py-4">{statusBadge(bill.status)}</td>
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

        {/* Modal xác nhận */}
        {confirmModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Xác nhận đổi trạng thái hóa đơn</h3>
                <p className="text-sm mb-6 text-gray-700">
                  Bạn có chắc chắn muốn đổi trạng thái của hóa đơn #{confirmModal.bill.id} – {confirmModal.bill.roomName}?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmModal({ open: false, bill: null })}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      updateBillStatus(confirmModal.bill.id);
                      setConfirmModal({ open: false, bill: null });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

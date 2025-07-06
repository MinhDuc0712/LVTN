import { useState } from "react";
import { Link } from "react-router-dom";
import SidebarWithNavbar from "../SidebarWithNavbar";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExchangeAlt,
  FaSearch,
  FaEye,
} from "react-icons/fa";

// Dữ liệu mẫu – nên fetch từ API
const billsSample = [
  {
    id: 1,
    hopdong_id: 1,
    roomName: "Phòng 101",
    thang: "2025-07",
    chi_so_dau: 40,
    chi_so_cuoi: 55,
    don_gia: 15000,
    status: "paid", // paid | unpaid
  },
  {
    id: 2,
    hopdong_id: 2,
    roomName: "Phòng 102",
    thang: "2025-07",
    chi_so_dau: 30,
    chi_so_cuoi: 50,
    don_gia: 15000,
    status: "unpaid",
  },
];

export default function WaterBillList() {
  const [bills, setBills] = useState(billsSample);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    bill: null,
  });

  const calcUsage = (dau, cuoi) => cuoi - dau;
  const calcAmount = (bill) =>
    calcUsage(bill.chi_so_dau, bill.chi_so_cuoi) * bill.don_gia;

  const updateBillStatus = (billId, newStatus) => {
    // TODO: gọi API để cập nhật trạng thái thực tế
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId ? { ...b, status: newStatus } : b
      )
    );
  };

  const filteredBills = bills.filter((b) => {
    const matchSearch =
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toString().includes(searchTerm);
    const matchStatus = filterStatus ? b.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status) =>
    status === "paid" ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        <FaCheckCircle /> Đã thanh toán
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
        <FaTimesCircle /> Chưa thanh toán
      </span>
    );

  return (
    <SidebarWithNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Danh sách hóa đơn nước</h1>
          <Link
            to="/admin/AddWater"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tạo hóa đơn nước
          </Link>
        </div>

        {/* Bộ lọc */}
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo phòng, ID..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="paid">Đã thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
          </select>
        </div>

        {/* Bảng */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tháng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số m³</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền (VNĐ)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{b.id}</td>
                  <td className="px-4 py-3">{b.roomName}</td>
                  <td className="px-4 py-3">{b.thang}</td>
                  <td className="px-4 py-3">
                    {calcUsage(b.chi_so_dau, b.chi_so_cuoi)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {calcAmount(b).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{statusBadge(b.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/water-bill/${b.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <FaEye /> Xem
                      </Link>
                      <button
                        onClick={() => setConfirmModal({ open: true, bill: b })}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                      >
                        <FaExchangeAlt /> Đổi trạng thái
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal xác nhận */}
        {confirmModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                Bạn chắc chắn muốn đổi trạng thái hóa đơn này?
              </h2>
              <p className="mb-6">
                Hóa đơn ID: <strong>{confirmModal.bill.id}</strong> –{" "}
                {confirmModal.bill.roomName} (
                {confirmModal.bill.status === "paid"
                  ? "đã thanh toán → chuyển thành chưa thanh toán"
                  : "chưa thanh toán → chuyển thành đã thanh toán"}
                )
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmModal({ open: false, bill: null })}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    updateBillStatus(
                      confirmModal.bill.id,
                      confirmModal.bill.status === "paid"
                        ? "unpaid"
                        : "paid"
                    );
                    setConfirmModal({ open: false, bill: null });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarWithNavbar>
  );
}

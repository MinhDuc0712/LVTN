import { getUserElecBillsById } from "@/api/homePage";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  DollarSign,
  Download,
  Printer,
  Search,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";

const UserElectricityHistory = () => {
  const [activeItem, setActiveItem] = useState("payment-history");
  const [searchTerm, setSearchTerm] = useState("");
  const [bills, setBills] = useState([]);
  const { user } = useAuth();
  // console.log("Dữ liệu bills đang render:", bills);

  useEffect(() => {
    console.log("Gọi useEffect - user:", user);

    if (!user || !user.MaNguoiDung) {
      console.log("Chưa có user.MaNguoiDung, bỏ qua fetch");
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await getUserElecBillsById(user.MaNguoiDung);
        console.log("API Response:", JSON.stringify(res, null, 2));
        if (Array.isArray(res)) {
          console.log("Set bills (array):", res);
          setBills(res);
        } else {
          console.error("Định dạng dữ liệu không mong đợi:", res);
          toast.error("Dữ liệu hóa đơn không đúng định dạng");
        }
      } catch (err) {
        console.error("Lỗi fetch:", err.message, err.response?.data);
        toast.error(`Không thể tải phiếu điện: ${err.message}`);
      }
    };

    fetchBills();
  }, [user]);

  const paymentHistory = bills
    .map((bill) => {
      if (!bill.thang || !bill.ngay_tao || !bill.trang_thai) {
        console.warn("Dữ liệu hóa đơn không hợp lệ:", bill);
        return null;
      }
      return {
        id: bill.id,
        period: bill.thang,
        issueDate: bill.ngay_tao,
        paymentDate:
          bill.trang_thai === "Đã thanh toán" ? bill.ngay_thanh_toan : null,
        consumption: bill.chi_so_cuoi - bill.chi_so_dau,
        amount:
          parseFloat(bill.don_gia || "0") ,
        status: bill.trang_thai === "Đã thanh toán" ? "paid" : "unpaid",
        meterNumber: `CT-${bill.hopdong?.phong_id ?? "?"}`,
        receiptNumber: `HD-${bill.id}`,
      };
    })
    .filter(Boolean);

  // console.log("Bills state:", bills);
  // console.log("Payment History:", paymentHistory);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const filteredPayments = paymentHistory.filter(
    (payment) =>
      !searchTerm ||
      payment.period?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  // console.log("Filtered Payments:", filteredPayments);

  const statusBadge = {
    paid: (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        <CheckCircle className="mr-1 h-3 w-3" />
        Đã thanh toán
      </span>
    ),
    unpaid: (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
        <AlertCircle className="mr-1 h-3 w-3" />
        Chưa thanh toán
      </span>
    ),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar User */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                to="/HouseList"
                className="mb-2 flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Quay lại trang chủ
              </Link>
              <h1 className="flex items-center text-2xl font-bold">
                <Zap className="mr-2 h-6 w-6 text-yellow-500" />
                Lịch sử thanh toán điện
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                <Printer className="h-5 w-5" />
                In
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
                <Download className="h-5 w-5" />
                Xuất file
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo kỳ hoặc số hóa đơn..."
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Tổng hóa đơn
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {filteredPayments.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Tổng đã thanh toán
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(
                      filteredPayments
                        .filter((p) => p.status === "paid")
                        .reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Công nợ hiện tại
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(
                      filteredPayments
                        .filter((p) => p.status === "unpaid")
                        .reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      <div className="flex items-center">
                        Kỳ thanh toán
                        <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Số công tơ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Tiêu thụ (kWh)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.period}
                          </div>
                          <div className="text-sm text-gray-500">
                            Ngày xuất: {payment.issueDate}
                          </div>
                          {payment.paymentDate && (
                            <div className="text-sm text-gray-500">
                              Thanh toán: {payment.paymentDate}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {payment.meterNumber}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {payment.consumption}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {statusBadge[payment.status]}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                          {/* <Link
                            to={`/User/ElectricityBill/${payment.id}`}
                            className="mr-3 text-blue-600 hover:text-blue-900"
                          >
                            Chi tiết
                          </Link> */}
                          {payment.status === "unpaid" && (
                            <button className="text-green-600 hover:text-green-900">
                              Thanh toán
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Không tìm thấy hóa đơn nào phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Notice */}
          {filteredPayments.some((p) => p.status === "unpaid") && (
            <div className="mb-6 border-l-4 border-red-400 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Bạn có{" "}
                    <strong>
                      {
                        filteredPayments.filter((p) => p.status === "unpaid")
                          .length
                      }{" "}
                      hóa đơn
                    </strong>{" "}
                    chưa thanh toán. Vui lòng thanh toán trước ngày{" "}
                    <strong>
                      5/{new Date().getMonth() + 2}/{new Date().getFullYear()}
                    </strong>{" "}
                    để tránh bị cắt điện.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserElectricityHistory;

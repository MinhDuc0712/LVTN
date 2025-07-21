import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  Home,
  Printer,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { getUserPaymentReceiptsById } from "@/api/homePage";

const UserRentPaymentHistory = () => {
  const [activeItem, setActiveItem] = useState("payment-history");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentBills, setPaymentBills] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Gọi useEffect - user:", user);

    if (!user || !user.MaNguoiDung) {
      console.log("Chưa có user.MaNguoiDung, bỏ qua fetch");
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await getUserPaymentReceiptsById(user.MaNguoiDung);
        console.log("API Response:", JSON.stringify(res, null, 2));
        if (Array.isArray(res)) {
          console.log("Set bills (array):", res);
          setPaymentBills(res);
        } else if (res.success && Array.isArray(res.data)) {
          console.log("Set bills (data):", res.data);
          setPaymentBills(res.data);
        } else {
          console.error("Định dạng dữ liệu không mong đợi:", res);
          toast.error("Dữ liệu phiếu thu tiền nhà không đúng định dạng");
        }
      } catch (err) {
        console.error("Lỗi fetch:", err.message, err.response?.data);
        toast.error(`Không thể tải phiếu thu tiền nhà: ${err.message}`);
      }
    };

    fetchBills();
  }, [user]);

  const paymentHistory = paymentBills
    .map((bill) => {
      if (!bill.thang || !bill.trang_thai || !bill.so_tien) {
        console.warn("Dữ liệu hóa đơn không hợp lệ:", bill);
        return null;
      }
      const soTien = parseFloat(bill.so_tien);
      const daThanhToan = parseFloat(bill.da_thanh_toan);
      return {
        id: bill.id,
        period: bill.thang,
        issueDate: bill.ngay_thu,
        paymentDate: ["Đã thanh toán", "Trả dư"].includes(bill.trang_thai)
          ? bill.ngay_thu
          : null,
        amount: daThanhToan,
        total: soTien,
        status:
          bill.trang_thai === "Đã thanh toán" || bill.trang_thai === "Trả dư"
            ? "paid"
            : bill.trang_thai === "Trễ hạn"
              ? "late"
              : "unpaid",
        receiptNumber: `HD-${bill.id}`,
        paymentMethod: bill.noi_dung || null,
        dueDate: bill.ngay_thu ?? "Không rõ",
      };
    })
    .filter(Boolean);

  console.log("Bills state:", paymentBills);
  console.log("Payment History:", paymentHistory);

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
  const currentDebt = filteredPayments.reduce((sum, p) => {
    return sum + (p.total - p.amount);
  }, 0);

  console.log("Filtered Payments:", filteredPayments);

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
    late: (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        <Clock className="mr-1 h-3 w-3" />
        Trễ hạn
      </span>
    ),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
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
                <Home className="mr-2 h-6 w-6 text-green-600" />
                Lịch sử thanh toán tiền nhà
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
          <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo kỳ hoặc số phiếu thu..."
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Tổng phiếu thu
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
                        .reduce((sum, p) => sum + p.total, 0),
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
                    {formatPrice(currentDebt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
                      Số phiếu thu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Đã thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Tổng cộng
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
                            Hạn: {payment.dueDate}
                            {payment.paymentDate && (
                              <span className="ml-2">
                                • Thanh toán: {payment.paymentDate}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {payment.receiptNumber}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {formatPrice(payment.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {payment.total === 0
                            ? "Miễn phí"
                            : formatPrice(payment.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {statusBadge[payment.status]}
                          {payment.paymentMethod && (
                            <div className="mt-1 text-xs text-gray-500">
                              {payment.paymentMethod}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                          <Link
                            to={`/User/RentReceipt/${payment.id}`}
                            className="mr-3 text-blue-600 hover:text-blue-900"
                          >
                            Chi tiết
                          </Link>
                          {(payment.status === "unpaid" ||
                            payment.status === "late") && (
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
                        Không tìm thấy phiếu thu nào phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
              Tổng quan thanh toán
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  Thông tin hợp đồng
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Tiền phòng:</span>{" "}
                    {formatPrice(4500000)}/tháng
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phí dịch vụ:</span>{" "}
                    {formatPrice(200000)}/tháng
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ngày thanh toán:</span> 05
                    hàng tháng
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  Phương thức thanh toán
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Ngân hàng:</span> Vietcombank
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số tài khoản:</span> 123456789
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Chủ tài khoản:</span> CÔNG TY
                    QUẢN LÝ HOME CONVENIENT
                  </p>
                </div>
              </div>
            </div>
          </div>
          {filteredPayments.some(
            (p) => p.status === "unpaid" || p.status === "late",
          ) && (
            <div className="border-l-4 border-red-400 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Bạn có{" "}
                    <strong>
                      {
                        filteredPayments.filter(
                          (p) => p.status === "unpaid" || p.status === "late",
                        ).length
                      }{" "}
                      phiếu thu tiền phòng
                    </strong>{" "}
                    chưa thanh toán với tổng số tiền{" "}
                    <strong>
                      {formatPrice(
                        filteredPayments
                          .filter(
                            (p) => p.status === "unpaid" || p.status === "late",
                          )
                          .reduce((sum, p) => sum + (p.total - p.amount), 0),
                      )}
                    </strong>
                    . Vui lòng thanh toán trước ngày{" "}
                    <strong>
                      05/{new Date().getMonth() + 2}/{new Date().getFullYear()}
                    </strong>{" "}
                    để tránh bị phạt trễ hạn 1%/ngày.
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

export default UserRentPaymentHistory;

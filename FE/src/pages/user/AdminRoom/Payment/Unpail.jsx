import { getUnpaidBillsById } from "@/api/homePage";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  DollarSign,
  Droplet,
  Home,
  MapPin,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";

const UnpaidBillsAlert = () => {
  const [activeItem, setActiveItem] = useState("bills");
  const { user } = useAuth();
  const [unpaidBills, setUnpaidBills] = useState([]);

useEffect(() => {
    if (!user || !user.MaNguoiDung) {
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await getUnpaidBillsById(user.MaNguoiDung);
        console.log("API Response:", JSON.stringify(res, null, 2));

        let hopdongs = [];
        if (Array.isArray(res)) {
          hopdongs = res;
        } else if (res.success && res.data) {
          hopdongs = Array.isArray(res.data) ? res.data : [res.data];
        } else if (res.id && res.phong_id) {
          hopdongs = [res];
          console.warn("API trả về object hợp đồng trực tiếp");
        } else {
          console.error("API phản hồi không hợp lệ:", res);
          toast.error(res.message || "Không tìm thấy dữ liệu hợp đồng");
          return;
        }

        const bills = [];
        hopdongs.forEach((hopdong) => {
          // Xử lý phiếu điện
          hopdong.phieudien?.forEach((phieu) => {
            if (phieu.trang_thai === "Chưa thanh toán") {
              const amount = parseFloat(phieu.don_gia || "0");
              if (amount > 0) {
                bills.push({
                  id: phieu.id,
                  type: "electricity",
                  period: phieu.thang || "Không xác định",
                  dueDate: phieu.ngay_thu || phieu.ngay_tao || "Không xác định",
                  amount,
                  daysOverdue: calcDaysOverdue(phieu.ngay_thu || phieu.ngay_tao),
                  meterNumber: `EM-${hopdong.phong?.id || "UNKNOWN"}`,
                  roomNumber: hopdong.phong?.ten_phong || `Phòng ${hopdong.phong_id || "UNKNOWN"}`,
                });
              }
            }
          });

          // Xử lý phiếu nước
          hopdong.phieunuoc?.forEach((phieu) => {
            if (phieu.trang_thai === "Chưa thanh toán") {
              const amount =parseFloat(phieu.don_gia || "0");
              if (amount > 0) {
                bills.push({
                  id: phieu.id,
                  type: "water",
                  period: phieu.thang || "Không xác định",
                  dueDate: phieu.ngay_thu || phieu.ngay_tao || "Không xác định",
                  amount,
                  daysOverdue: calcDaysOverdue(phieu.ngay_thu || phieu.ngay_tao),
                  meterNumber: `WM-${hopdong.phong?.id || "UNKNOWN"}`,
                  roomNumber: hopdong.phong?.ten_phong || `Phòng ${hopdong.phong_id || "UNKNOWN"}`,
                });
              }
            }
          });

          // Xử lý phiếu thu tiền nhà
          hopdong.phieuthutien?.forEach((phieu) => {
            const no = parseFloat(phieu.no || "0");
            if (no > 0) {
              bills.push({
                id: phieu.id,
                type: "rent",
                period: phieu.thang || "Không xác định",
                dueDate: phieu.ngay_thu || phieu.ngay_tao || "Không xác định",
                amount: no,
                daysOverdue: calcDaysOverdue(phieu.ngay_thu || phieu.ngay_tao),
                meterNumber: null,
                roomNumber: hopdong.phong?.ten_phong || `Phòng ${hopdong.phong_id || "UNKNOWN"}`,
              });
            }
          });
        });

        setUnpaidBills(bills);
        console.log("Unpaid Bills:", JSON.stringify(bills, null, 2));
        console.log("Bills by Room:", JSON.stringify(billsByRoom, null, 2));
      } catch (err) {
        console.error("Lỗi fetch API:", err.message, err.response?.data);
        toast.error(`Không thể tải danh sách hóa đơn: ${err.message}`);
      }
    };

    fetchBills();
  }, [user]);
  const calcDaysOverdue = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    if (isNaN(dueDate.getTime())) return 0;
    return Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getBillIcon = (type) => {
    switch (type) {
      case "electricity":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "water":
        return <Droplet className="h-5 w-5 text-blue-400" />;
      case "rent":
        return <Home className="h-5 w-5 text-green-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBillTypeName = (type) => {
    switch (type) {
      case "electricity":
        return "Tiền điện";
      case "water":
        return "Tiền nước";
      case "rent":
        return "Tiền phòng";
      default:
        return "Hóa đơn";
    }
  };

  const getDueStatus = (daysOverdue) => {
    if (daysOverdue > 0) {
      return {
        text: `Trễ ${daysOverdue} ngày`,
        color: "text-red-600",
        bg: "bg-red-50",
      };
    } else if (daysOverdue === 0) {
      return {
        text: "Hôm nay",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    } else {
      return {
        text: `Còn ${Math.abs(daysOverdue)} ngày`,
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    }
  };

  const totalAmount = unpaidBills.reduce((sum, bill) => {
    const lateFee =
      bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
    return sum + bill.amount + lateFee;
  }, 0);

  const billsByRoom = unpaidBills.reduce((acc, bill) => {
    const roomNumber = bill.roomNumber || "UNKNOWN";
    if (!acc[roomNumber]) {
      acc[roomNumber] = [];
    }
    acc[roomNumber].push(bill);
    return acc;
  }, {});

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <h1 className="flex items-center text-2xl font-bold">
              <Bell className="mr-2 h-6 w-6 text-red-500" />
              Cảnh báo hóa đơn chưa thanh toán
            </h1>
            <p className="text-gray-600">
              Danh sách các hóa đơn cần thanh toán
            </p>
          </div>
          <div className="mb-6 border-l-4 border-red-500 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Bạn có {unpaidBills.length} hóa đơn chưa thanh toán từ{" "}
                  {Object.keys(billsByRoom).length} phòng
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">
                    Tổng số tiền cần thanh toán: {formatPrice(totalAmount)}
                  </p>
                  <p className="mt-1">Vui lòng thanh toán sớm để tránh bị:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>Phạt trễ hạn 1%/ngày (với hóa đơn trễ hạn)</li>
                    <li>Ngưng cung cấp dịch vụ (sau 15 ngày quá hạn)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 space-y-6">
            {unpaidBills.length === 0 ? (
              <div className="text-center text-gray-500">
                Không có hóa đơn chưa thanh toán nào.
              </div>
            ) : (
              Object.entries(billsByRoom).map(([roomNumber, bills]) => (
                <div
                  key={roomNumber}
                  className="overflow-hidden rounded-lg bg-white shadow-lg"
                >
                  <div className="border-b bg-gray-50 px-4 py-3">
                    <h2 className="flex items-center text-lg font-semibold text-gray-800">
                      <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                      Phòng {roomNumber}
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({bills.length} hóa đơn)
                      </span>
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {bills.map((bill) => {
                      const dueStatus = getDueStatus(bill.daysOverdue);
                      const lateFee =
                        bill.daysOverdue > 0
                          ? bill.amount * 0.01 * bill.daysOverdue
                          : 0;
                      return (
                        <div
                          key={bill.id}
                          className="p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div
                                className={`rounded-lg p-2 ${dueStatus.bg} mr-3`}
                              >
                                {getBillIcon(bill.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h3 className="mr-3 font-medium text-gray-900">
                                    {getBillTypeName(bill.type)} - {bill.period}
                                  </h3>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dueStatus.color} ${dueStatus.bg}`}
                                  >
                                    {dueStatus.text}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-500">
                                  <div className="flex items-center space-x-4">
                                    {bill.type !== "rent" && (
                                      <span>
                                        Số đồng hồ: {bill.meterNumber}
                                      </span>
                                    )}
                                    <span>Hạn: {bill.dueDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-end justify-between">
                            <div>
                              <p className="m-3 mt-2 text-lg font-bold text-gray-900">
                                {formatPrice(bill.amount)}
                              </p>
                              {bill.daysOverdue > 0 && bill.amount > 0 && (
                                <p className="mt-1 text-sm text-red-600">
                                  Phí trễ hạn: {formatPrice(lateFee)}
                                </p>
                              )}
                            </div>
                            <Link
                              to={`/User/Payment/${bill.type}/${bill.id}`}
                              className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                            >
                              Thanh toán ngay{" "}
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Tổng tiền phòng {roomNumber}:
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(
                          bills.reduce((sum, bill) => {
                            const lateFee =
                              bill.daysOverdue > 0
                                ? bill.amount * 0.01 * bill.daysOverdue
                                : 0;
                            return sum + bill.amount + lateFee;
                          }, 0),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  Chuyển khoản ngân hàng
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Ngân hàng:</span> Vietcombank
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số TK:</span> 123456789
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Chủ TK:</span> CÔNG TY QUẢN LÝ
                    HOME CONVENIENT
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Nội dung:</span> [SỐ PHÒNG]
                    [LOẠI HÓA ĐƠN] [KỲ]
                  </p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-500">
                  Thanh toán trực tiếp
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Địa điểm:</span> Văn phòng
                    quản lý tòa nhà
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Thời gian:</span> 8:00 - 17:00
                    (T2-T6)
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Hỗ trợ:</span> 0901 234 567
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Lưu ý quan trọng
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Sau 15 ngày quá hạn, dịch vụ sẽ bị ngưng cung cấp</li>
                    <li>Phí trễ hạn 1%/ngày tính trên tổng số tiền</li>
                    <li>Vui lòng giữ lại biên lai sau khi thanh toán</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnpaidBillsAlert;

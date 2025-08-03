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
import { getUnpaidBillsById } from "@/api/homePage";
import { updatePaymentReceipt } from "@/api/homePage";
import Sidebar from "../Sidebar";

const UnpaidBillsAlert = () => {
  const [activeItem, setActiveItem] = useState("bills");
  const { user } = useAuth();
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  
  useEffect(() => {
    if (!user || !user.MaNguoiDung) {
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await getUnpaidBillsById(user.MaNguoiDung);

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
              const amount = parseFloat(phieu.don_gia || "0");
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
      } catch (err) {
        toast.error(`Không thể tải danh sách hóa đơn: ${err.message}`);
      }
    };

    fetchBills();
  }, [user]);

  const calcDaysOverdue = (dueDateStr) => {
  const today = new Date();
  
  const nextMonth = today.getMonth() + 1;
  const dueDate = new Date(today.getFullYear(), nextMonth, 5);
  
  const diffTime = today - dueDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0; 
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

  const handleConfirmPayment = async () => {
    if (!currentBill) return;

    const totalAmount = calculateTotalAmount(currentBill);

    try {
      await updatePaymentReceipt(currentBill.id, {
        da_thanh_toan: totalAmount,
        no: 0,
        trang_thai: "Đang xử lý",
        ngay_thu: new Date().toISOString().slice(0, 10),
        noi_dung: `Thanh toán QR phòng ${currentBill.roomNumber} - ${currentBill.period} (Tiền gốc: ${formatPrice(currentBill.amount)}, Phí trễ: ${formatPrice(totalAmount - currentBill.amount)})`,
      });

      toast.success(`Đã thanh toán thành công ${getBillTypeName(currentBill.type)} - ${currentBill.period} với tổng số tiền ${formatPrice(totalAmount)}`);
      setUnpaidBills((prev) => prev.filter((b) => b.id !== currentBill.id));
      setShowPaymentForm(false);
      setCurrentBill(null);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xác nhận thanh toán. Vui lòng thử lại.");
    }
  };

  const calculateTotalAmount = (bill) => {
    const lateFee = bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
    return bill.amount + lateFee;
  };

  const handlePaymentClick = (bills) => {
    const rentBill = bills.find(bill => bill.type === "rent");
    if (rentBill) {
      setCurrentBill(rentBill);
      setShowPaymentForm(true);
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


  const calculateRoomTotal = (bills) => {
    const rentBill = bills.find(bill => bill.type === "rent");
    if (!rentBill) return 0;
    
    const lateFee = rentBill.daysOverdue > 0 ? rentBill.amount * 0.01 * rentBill.daysOverdue : 0;
    return rentBill.amount + lateFee;
  };


  const calculateAllBillsTotal = () => {
    return unpaidBills.reduce((sum, bill) => {
      const lateFee = bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
      return sum + bill.amount + lateFee;
    }, 0);
  };

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
                  {/* <p className="font-medium">
                    Tổng số tiền cần thanh toán: {formatPrice(calculateAllBillsTotal())}
                  </p> */}

                  <p className="mt-1">Vui lòng thanh toán sớm để tránh bị:</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li> Vui lòng thanh toán trước ngày <strong>05/{new Date().getMonth() + 2}/{new Date().getFullYear()}</strong></li>
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
                <div key={roomNumber} className="overflow-hidden rounded-lg bg-white shadow-lg">
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
                      const lateFee = bill.daysOverdue > 0 ? bill.amount * 0.01 * bill.daysOverdue : 0;
                      
                      return (
                        <div key={bill.id} className="p-4 transition-colors hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className={`rounded-lg p-2 ${dueStatus.bg} mr-3`}>
                                {getBillIcon(bill.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h3 className="mr-3 font-medium text-gray-900">
                                    {getBillTypeName(bill.type)} - {bill.period}
                                  </h3>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dueStatus.color} ${dueStatus.bg}`}>
                                    {dueStatus.text}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-500">
                                  <div className="flex items-center space-x-4">
                                    {bill.type !== "rent" && (
                                      <span>Số đồng hồ: {bill.meterNumber}</span>
                                    )}
                                    <span>Ngày tạo: {bill.dueDate}</span>
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span className="text-sm font-medium text-gray-700 mb-2 md:mb-0">
                        Tổng tiền phòng {roomNumber} ( Số tiền cần đóng + phí trễ):
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(calculateRoomTotal(bills))}
                      </span>
                    </div>

                    <div className="mt-3">
                      <button
                        onClick={() => handlePaymentClick(bills)}
                        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Thanh toán tiền phòng
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          
        </div>
      </div>
      
      {showPaymentForm && currentBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg w-full max-w-md">
            <h4 className="mb-4 text-lg font-semibold text-gray-800">
              Thanh toán tiền phòng {currentBill.roomNumber}
            </h4>

            <div className="mb-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Kỳ:</span> {currentBill.period}
              </p>
              <p className="text-sm">
                <span className="font-medium">Tiền phòng:</span> {formatPrice(currentBill.amount)}
              </p>
              {currentBill.daysOverdue > 0 && (
                <p className="text-sm">
                  <span className="font-medium">Phí trễ ({currentBill.daysOverdue} ngày):</span>
                  {formatPrice(currentBill.amount * 0.01 * currentBill.daysOverdue)}
                </p>
              )}
              <p className="text-lg font-bold mt-2">
                <span className="font-medium">Tổng cộng:</span> 
                {formatPrice(calculateTotalAmount(currentBill))}
              </p>
            </div>

            <div className="mb-4 flex justify-center">
              <img
                src="/QR.jpg"
                alt="QR Code"
                className="h-48 w-48 border border-gray-200"
              />
            </div>

            <p className="mb-4 text-sm text-gray-600 text-center">
              Nội dung chuyển khoản: <br />
              <strong>PHONG{currentBill.roomNumber} TIENPHONG {currentBill.period}</strong>
            </p>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="inline-flex items-center rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmPayment}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnpaidBillsAlert;